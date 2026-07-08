"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type BannerRow = Database["public"]["Tables"]["hero_banners"]["Row"];
type BannerInsert = Database["public"]["Tables"]["hero_banners"]["Insert"];
type BannerUpdate = Database["public"]["Tables"]["hero_banners"]["Update"];

export async function getBanners(): Promise<BannerRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_banners")
    .select("*")
    .order("display_order");

  if (error) {
    // 42P01 = table missing (hero_banners migration not applied yet)
    if (error.code === "42P01") return [];
    throw error;
  }
  return data as unknown as BannerRow[];
}

function bannerFromForm(formData: FormData): BannerInsert {
  return {
    title: formData.get("title") as string,
    subtitle: (formData.get("subtitle") as string) || null,
    badge: (formData.get("badge") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    cta_label: (formData.get("cta_label") as string) || null,
    cta_url: (formData.get("cta_url") as string) || null,
    theme: (formData.get("theme") as string) || "neon-green",
    display_order: parseInt(formData.get("display_order") as string) || 0,
    is_active: formData.get("is_active") === "true",
  };
}

export async function createBanner(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("hero_banners")
    .insert(bannerFromForm(formData));

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}

export async function updateBanner(id: string, formData: FormData) {
  const supabase = await createClient();

  const banner: BannerUpdate = bannerFromForm(formData);
  const { error } = await supabase
    .from("hero_banners")
    .update(banner)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}

export async function deleteBanner(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("hero_banners").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}

export async function toggleBannerActive(id: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("hero_banners")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}
