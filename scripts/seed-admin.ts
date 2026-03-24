import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const ADMIN_EMAIL = "laralimabilly@gmail.com";
const ADMIN_PASSWORD = "admin123456";

async function seedAdmin() {
  console.log(`Creating admin user: ${ADMIN_EMAIL}`);

  // Create auth user
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });

  if (authError) {
    if (authError.message.includes("already been registered")) {
      console.log("User already exists in auth, looking up...");
      const {
        data: { users },
      } = await supabase.auth.admin.listUsers();
      const existing = users?.find((u) => u.email === ADMIN_EMAIL);
      if (existing) {
        console.log(`Found existing user: ${existing.id}`);
        await insertAdminRow(existing.id);
      }
      return;
    }
    console.error("Auth error:", authError.message);
    process.exit(1);
  }

  console.log(`Auth user created: ${authData.user.id}`);
  await insertAdminRow(authData.user.id);
}

async function insertAdminRow(userId: string) {
  const { error } = await supabase.from("admin_users").upsert({
    id: userId,
    email: ADMIN_EMAIL,
  });

  if (error) {
    console.error("Error inserting admin_users row:", error.message);
    process.exit(1);
  }

  console.log("Admin user seeded successfully!");
  console.log(`\nLogin credentials:\n  Email: ${ADMIN_EMAIL}\n  Password: ${ADMIN_PASSWORD}`);
  console.log("\n⚠️  Change the password after first login!");
}

seedAdmin();
