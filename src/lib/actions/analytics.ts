"use server";

import { createClient } from "@/lib/supabase/server";

export interface ClicksByDay {
  date: string;
  count: number;
}

export interface ClicksByProduct {
  product_id: string;
  title: string;
  clicks: number;
}

export interface ClicksByDevice {
  device_type: string;
  count: number;
}

export interface ClicksByCountry {
  country: string;
  count: number;
}

export interface AnalyticsData {
  totalClicks: number;
  clicksLast30Days: ClicksByDay[];
  topProducts: ClicksByProduct[];
  deviceBreakdown: ClicksByDevice[];
  countryBreakdown: ClicksByCountry[];
  recentClicks: {
    id: string;
    product_title: string;
    referrer: string | null;
    device_type: string | null;
    country: string | null;
    created_at: string;
  }[];
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const [totalResult, clicksResult, productsResult, recentResult] =
    await Promise.all([
      // Total clicks
      supabase
        .from("click_events")
        .select("id", { count: "exact", head: true }),

      // All clicks from last 30 days for aggregation
      supabase
        .from("click_events")
        .select("product_id, device_type, country, created_at")
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: true }),

      // Products lookup for names
      supabase.from("products").select("id, title"),

      // Recent clicks with product info
      supabase
        .from("click_events")
        .select("id, product_id, referrer, device_type, country, created_at")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const clicks = (clicksResult.data ?? []) as {
    product_id: string;
    device_type: string | null;
    country: string | null;
    created_at: string;
  }[];
  const productsMap = new Map(
    ((productsResult.data ?? []) as { id: string; title: string }[]).map(
      (p) => [p.id, p.title]
    )
  );

  // Aggregate clicks by day
  const byDay = new Map<string, number>();
  for (const click of clicks) {
    const date = click.created_at.split("T")[0];
    byDay.set(date, (byDay.get(date) ?? 0) + 1);
  }
  const clicksLast30Days: ClicksByDay[] = Array.from(byDay.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Aggregate clicks by product
  const byProduct = new Map<string, number>();
  for (const click of clicks) {
    byProduct.set(
      click.product_id,
      (byProduct.get(click.product_id) ?? 0) + 1
    );
  }
  const topProducts: ClicksByProduct[] = Array.from(byProduct.entries())
    .map(([product_id, clickCount]) => ({
      product_id,
      title: productsMap.get(product_id) ?? "Unknown",
      clicks: clickCount,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // Aggregate by device
  const byDevice = new Map<string, number>();
  for (const click of clicks) {
    const device = click.device_type ?? "Unknown";
    byDevice.set(device, (byDevice.get(device) ?? 0) + 1);
  }
  const deviceBreakdown: ClicksByDevice[] = Array.from(byDevice.entries())
    .map(([device_type, count]) => ({ device_type, count }))
    .sort((a, b) => b.count - a.count);

  // Aggregate by country
  const byCountry = new Map<string, number>();
  for (const click of clicks) {
    const country = click.country ?? "Unknown";
    byCountry.set(country, (byCountry.get(country) ?? 0) + 1);
  }
  const countryBreakdown: ClicksByCountry[] = Array.from(byCountry.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Map recent clicks with product titles
  const recentClicks = (
    (recentResult.data ?? []) as {
      id: string;
      product_id: string;
      referrer: string | null;
      device_type: string | null;
      country: string | null;
      created_at: string;
    }[]
  ).map((click) => ({
    id: click.id,
    product_title: productsMap.get(click.product_id) ?? "Unknown",
    referrer: click.referrer,
    device_type: click.device_type,
    country: click.country,
    created_at: click.created_at,
  }));

  return {
    totalClicks: totalResult.count ?? 0,
    clicksLast30Days,
    topProducts,
    deviceBreakdown,
    countryBreakdown,
    recentClicks,
  };
}
