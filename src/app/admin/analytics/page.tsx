import {
  MousePointerClick,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAnalyticsData } from "@/lib/actions/analytics";

function DeviceIcon({ type }: { type: string }) {
  const lower = type.toLowerCase();
  if (lower.includes("mobile") || lower.includes("phone"))
    return <Smartphone className="h-3.5 w-3.5" />;
  if (lower.includes("tablet")) return <Tablet className="h-3.5 w-3.5" />;
  return <Monitor className="h-3.5 w-3.5" />;
}

function BarChart({
  data,
  maxValue,
}: {
  data: { label: string; value: number }[];
  maxValue: number;
}) {
  if (data.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No data yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-right text-xs text-muted-foreground">
            {item.label}
          </span>
          <div className="flex-1">
            <div
              className="h-6 rounded bg-neon-green/20"
              style={{
                width: `${maxValue > 0 ? Math.max((item.value / maxValue) * 100, 2) : 0}%`,
              }}
            >
              <div
                className="h-full rounded bg-neon-green transition-all"
                style={{
                  width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
          <span className="w-10 text-right text-xs font-medium">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  const maxDayClicks = Math.max(
    ...data.clicksLast30Days.map((d) => d.count),
    0
  );
  const maxProductClicks = Math.max(
    ...data.topProducts.map((p) => p.clicks),
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Affiliate click tracking and performance metrics.
        </p>
      </div>

      {/* Total clicks */}
      <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon-green/10">
          <MousePointerClick className="h-6 w-6 text-neon-green-dark" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Total Affiliate Clicks
          </p>
          <p className="font-display text-3xl font-bold">{data.totalClicks}</p>
        </div>
      </div>

      {/* Clicks over time */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Clicks — Last 30 Days
        </h2>
        <div className="rounded-lg border border-border bg-card p-4">
          <BarChart
            data={data.clicksLast30Days.map((d) => ({
              label: new Date(d.date + "T00:00:00").toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" }
              ),
              value: d.count,
            }))}
            maxValue={maxDayClicks}
          />
        </div>
      </section>

      {/* Top products */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Top Products by Clicks
        </h2>
        <div className="rounded-lg border border-border bg-card p-4">
          <BarChart
            data={data.topProducts.map((p) => ({
              label: p.title,
              value: p.clicks,
            }))}
            maxValue={maxProductClicks}
          />
        </div>
      </section>

      {/* Device + Country breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Device Breakdown
          </h2>
          <div className="rounded-lg border border-border bg-card">
            {data.deviceBreakdown.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No data yet
              </p>
            ) : (
              <div className="divide-y divide-border">
                {data.deviceBreakdown.map((d) => (
                  <div
                    key={d.device_type}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-2">
                      <DeviceIcon type={d.device_type} />
                      <span className="text-sm">{d.device_type}</span>
                    </div>
                    <Badge variant="secondary">{d.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Top Countries
          </h2>
          <div className="rounded-lg border border-border bg-card">
            {data.countryBreakdown.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No data yet
              </p>
            ) : (
              <div className="divide-y divide-border">
                {data.countryBreakdown.map((c) => (
                  <div
                    key={c.country}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{c.country}</span>
                    </div>
                    <Badge variant="secondary">{c.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Recent clicks table */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Recent Clicks
        </h2>
        {data.recentClicks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center">
            <p className="text-muted-foreground">
              No click events recorded yet. Clicks will appear here once
              visitors start using affiliate links.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentClicks.map((click) => (
                <TableRow key={click.id}>
                  <TableCell className="font-medium">
                    {click.product_title}
                  </TableCell>
                  <TableCell>
                    {click.referrer ? (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="max-w-40 truncate text-xs">
                          {click.referrer}
                        </span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Direct</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {click.device_type && (
                        <DeviceIcon type={click.device_type} />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {click.device_type ?? "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {click.country ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(click.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
