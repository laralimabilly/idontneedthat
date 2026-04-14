/**
 * TEMPORARY one-time endpoint to reset an admin user's password directly.
 * DELETE THIS FILE after use.
 *
 * Usage:
 *   curl -X POST http://localhost:3000/api/dev/reset-admin \
 *     -H "Content-Type: application/json" \
 *     -d '{"email":"you@example.com","newPassword":"YourNewPass123!"}'
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Only runs in development
if (process.env.NODE_ENV === "production") {
  throw new Error("This endpoint must not be deployed to production. Delete src/app/api/dev/reset-admin/route.ts");
}

export async function POST(request: Request) {
  const { email, newPassword } = await request.json();

  if (!email || !newPassword) {
    return NextResponse.json({ error: "email and newPassword are required" }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Find the user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    // Show all users to help find the right email
    const emails = users.map((u) => u.email).filter(Boolean);
    return NextResponse.json({
      error: `No user found with email "${email}"`,
      existingUsers: emails,
    }, { status: 404 });
  }

  // Update password
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
    email_confirm: true,
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Ensure user is in admin_users table
  const { error: upsertError } = await supabase
    .from("admin_users")
    .upsert({ id: user.id, email: user.email! });

  if (upsertError) {
    return NextResponse.json({
      warning: `Password updated but admin_users upsert failed: ${upsertError.message}`,
      userId: user.id,
    }, { status: 200 });
  }

  return NextResponse.json({
    success: true,
    message: `Password updated for ${email}. You can now log in at /login. DELETE this file after use.`,
  });
}
