"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  featuredProducts: number;
  totalCategories: number;
  totalTags: number;
  totalClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  recentProducts: ProductRow[];
  topClickedProducts: { product_id: string; title: string; clicks: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // Run all queries in parallel
  const [
    productsResult,
    categoriesResult,
    tagsResult,
    totalClicksResult,
    clicksTodayResult,
    clicksWeekResult,
    clicksMonthResult,
    recentProductsResult,
  ] = await Promise.all([
    supabase.from("products").select("id, is_published, is_featured"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("tags").select("id", { count: "exact", head: true }),
    supabase
      .from("click_events")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("click_events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabase
      .from("click_events")
      .select("id", { count: "exact", head: true })
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      ),
    supabase
      .from("click_events")
      .select("id", { count: "exact", head: true })
      .gte(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      ),
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const products = (productsResult.data ?? []) as { id: string; is_published: boolean; is_featured: boolean }[];
  const recentProducts = (recentProductsResult.data ?? []) as unknown as ProductRow[];

  return {
    totalProducts: products.length,
    publishedProducts: products.filter((p) => p.is_published).length,
    draftProducts: products.filter((p) => !p.is_published).length,
    featuredProducts: products.filter((p) => p.is_featured).length,
    totalCategories: categoriesResult.count ?? 0,
    totalTags: tagsResult.count ?? 0,
    totalClicks: totalClicksResult.count ?? 0,
    clicksToday: clicksTodayResult.count ?? 0,
    clicksThisWeek: clicksWeekResult.count ?? 0,
    clicksThisMonth: clicksMonthResult.count ?? 0,
    recentProducts,
    topClickedProducts: [], // Will be populated when click events exist
  };
}
