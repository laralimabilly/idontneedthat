import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, source_page } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: "product_id is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Parse user agent for device type
    const userAgent = request.headers.get("user-agent") ?? null;
    let deviceType: string | null = null;
    if (userAgent) {
      if (/mobile|android|iphone/i.test(userAgent)) {
        deviceType = "Mobile";
      } else if (/tablet|ipad/i.test(userAgent)) {
        deviceType = "Tablet";
      } else {
        deviceType = "Desktop";
      }
    }

    // Hash IP for privacy (don't store raw IP)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = await hashString(ip);

    const referrer = request.headers.get("referer") ?? null;

    await supabase.from("click_events").insert({
      product_id,
      referrer,
      user_agent: userAgent,
      ip_hash: ipHash,
      device_type: deviceType,
      source_page: source_page ?? null,
    });

    // Get the product's affiliate URL to redirect
    const { data: product } = await supabase
      .from("products")
      .select("affiliate_url")
      .eq("id", product_id)
      .single();

    return NextResponse.json({
      success: true,
      redirect_url: (product as { affiliate_url: string } | null)
        ?.affiliate_url,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
