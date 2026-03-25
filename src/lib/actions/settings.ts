"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export interface SiteSettings {
  site_name: string;
  site_description: string;
  default_affiliate_tag: string;
  default_affiliate_network: string;
  products_per_page: number;
  show_prices: boolean;
  analytics_enabled: boolean;
  social_twitter: string;
  social_instagram: string;
  footer_text: string;
}

const DEFAULTS: SiteSettings = {
  site_name: "I Don't Need That",
  site_description: "Products You Didn't Know You Needed",
  default_affiliate_tag: "",
  default_affiliate_network: "",
  products_per_page: 12,
  show_prices: true,
  analytics_enabled: true,
  social_twitter: "",
  social_instagram: "",
  footer_text: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", Object.keys(DEFAULTS));

  const settings = { ...DEFAULTS };
  if (data) {
    for (const row of data as { key: string; value: Json }[]) {
      if (row.key in settings) {
        (settings as Record<string, Json>)[row.key] = row.value;
      }
    }
  }

  return settings;
}

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();

  const entries: { key: string; value: Json }[] = [
    { key: "site_name", value: formData.get("site_name") as string },
    {
      key: "site_description",
      value: formData.get("site_description") as string,
    },
    {
      key: "default_affiliate_tag",
      value: formData.get("default_affiliate_tag") as string,
    },
    {
      key: "default_affiliate_network",
      value: formData.get("default_affiliate_network") as string,
    },
    {
      key: "products_per_page",
      value: parseInt(formData.get("products_per_page") as string) || 12,
    },
    { key: "show_prices", value: formData.get("show_prices") === "true" },
    {
      key: "analytics_enabled",
      value: formData.get("analytics_enabled") === "true",
    },
    { key: "social_twitter", value: formData.get("social_twitter") as string },
    {
      key: "social_instagram",
      value: formData.get("social_instagram") as string,
    },
    { key: "footer_text", value: formData.get("footer_text") as string },
  ];

  // Upsert each setting
  for (const entry of entries) {
    const { error } = await supabase
      .from("site_settings")
      .upsert(entry, { onConflict: "key" });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/admin/settings");
  return { success: true };
}
