"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

type ProductWithCategory = ProductRow & {
  categories: { name: string } | null;
};

export async function getProducts(): Promise<ProductWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as ProductWithCategory[];
}

export async function getProduct(id: string): Promise<ProductWithCategory> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as unknown as ProductWithCategory;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("display_order");

  if (error) throw error;
  return data;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const isPublished = formData.get("is_published") === "true";

  const product: ProductInsert = {
    title,
    slug: slugify(title),
    description: (formData.get("description") as string) || null,
    short_description: (formData.get("short_description") as string) || null,
    price: parseFloat(formData.get("price") as string),
    currency: (formData.get("currency") as string) || "USD",
    image_url: (formData.get("image_url") as string) || null,
    image_alt: (formData.get("image_alt") as string) || null,
    affiliate_url: formData.get("affiliate_url") as string,
    store: formData.get("store") as string,
    affiliate_network: (formData.get("affiliate_network") as string) || null,
    affiliate_tag: (formData.get("affiliate_tag") as string) || null,
    category_id: (formData.get("category_id") as string) || null,
    is_published: isPublished,
    is_featured: formData.get("is_featured") === "true",
    seo_title: (formData.get("seo_title") as string) || null,
    seo_description: (formData.get("seo_description") as string) || null,
    published_at: isPublished ? new Date().toISOString() : null,
  };

  const { error } = await supabase.from("products").insert(product);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const isPublished = formData.get("is_published") === "true";

  const product: ProductUpdate = {
    title,
    slug: slugify(title),
    description: (formData.get("description") as string) || null,
    short_description: (formData.get("short_description") as string) || null,
    price: parseFloat(formData.get("price") as string),
    currency: (formData.get("currency") as string) || "USD",
    image_url: (formData.get("image_url") as string) || null,
    image_alt: (formData.get("image_alt") as string) || null,
    affiliate_url: formData.get("affiliate_url") as string,
    store: formData.get("store") as string,
    affiliate_network: (formData.get("affiliate_network") as string) || null,
    affiliate_tag: (formData.get("affiliate_tag") as string) || null,
    category_id: (formData.get("category_id") as string) || null,
    is_published: isPublished,
    is_featured: formData.get("is_featured") === "true",
    seo_title: (formData.get("seo_title") as string) || null,
    seo_description: (formData.get("seo_description") as string) || null,
  };

  // Set published_at when first publishing
  if (isPublished) {
    const { data: existing } = await supabase
      .from("products")
      .select("published_at")
      .eq("id", id)
      .single();

    if (existing && !existing.published_at) {
      product.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function toggleProductPublished(id: string, isPublished: boolean) {
  const supabase = await createClient();

  const update: ProductUpdate = { is_published: isPublished };
  if (isPublished) {
    const { data: existing } = await supabase
      .from("products")
      .select("published_at")
      .eq("id", id)
      .single();

    if (existing && !existing.published_at) {
      update.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase
    .from("products")
    .update(update)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}
