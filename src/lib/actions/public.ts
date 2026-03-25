"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

type ProductWithCategory = ProductRow & {
  categories: { name: string; slug: string } | null;
};

export async function getPublishedProducts(): Promise<ProductWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as ProductWithCategory[];
}

export async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) throw error;
  return data as unknown as ProductWithCategory[];
}

export async function getRecentProducts(
  limit = 8
): Promise<ProductWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as unknown as ProductWithCategory[];
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return data as unknown as ProductWithCategory;
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<{ category: CategoryRow; products: ProductWithCategory[] } | null> {
  const supabase = await createClient();

  // Get category
  const { data: category, error: catError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .single();

  if (catError || !category) return null;

  const typedCategory = category as unknown as CategoryRow;

  // Get products in category
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("category_id", typedCategory.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (prodError) throw prodError;

  return {
    category: typedCategory,
    products: (products ?? []) as unknown as ProductWithCategory[],
  };
}

export async function getActiveCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) throw error;
  return data as unknown as CategoryRow[];
}
