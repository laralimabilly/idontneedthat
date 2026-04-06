import Link from "next/link";
import {
  Package,
  FolderOpen,
  Tags,
  MousePointerClick,
  Eye,
  EyeOff,
  FileEdit,
  Star,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/actions/dashboard";

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  href?: string;
  accent?: string;
}) {
  const content = (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-2xl font-bold">{value}</p>
      </div>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent ?? "bg-muted"}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your product catalog and performance.
        </p>
      </div>

      {/* Product Stats */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Products
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Products"
            value={stats.totalProducts}
            icon={Package}
            href="/admin/products"
            accent="bg-neon-green/10 text-neon-green-dark"
          />
          <StatCard
            label="Published"
            value={stats.publishedProducts}
            icon={Eye}
            accent="bg-electric-blue/10 text-electric-blue"
          />
          <StatCard
            label="Drafts"
            value={stats.draftProducts}
            icon={FileEdit}
            accent="bg-muted text-muted-foreground"
          />
          <StatCard
            label="Featured"
            value={stats.featuredProducts}
            icon={Star}
            accent="bg-bright-yellow/10 text-bright-yellow"
          />
        </div>
      </section>

      {/* Taxonomy Stats */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Taxonomy
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Categories"
            value={stats.totalCategories}
            icon={FolderOpen}
            href="/admin/categories"
            accent="bg-hot-pink/10 text-hot-pink"
          />
          <StatCard
            label="Tags"
            value={stats.totalTags}
            icon={Tags}
            href="/admin/tags"
            accent="bg-purple/10 text-purple"
          />
          <StatCard
            label="Total Clicks"
            value={stats.totalClicks}
            icon={MousePointerClick}
            accent="bg-neon-green/10 text-neon-green-dark"
          />
        </div>
      </section>

      {/* Click Stats */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Affiliate Clicks
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="mt-1 font-display text-2xl font-bold">
              {stats.clicksToday}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="mt-1 font-display text-2xl font-bold">
              {stats.clicksThisWeek}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-muted-foreground">This Month</p>
              <TrendingUp className="h-3.5 w-3.5 text-neon-green" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold">
              {stats.clicksThisMonth}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Recent Products
          </h2>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/admin/products" />}
            nativeButton={false}
          >
            View all
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>

        {stats.recentProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center">
            <p className="text-muted-foreground">No products yet</p>
            <Button
              render={<Link href="/admin/products/new" />}
              nativeButton={false}
              className="mt-3"
              size="sm"
            >
              Add your first product
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-lg border border-border">
            {stats.recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}/edit`}
                className="flex items-center justify-between p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.image_alt ?? product.title}
                      className="h-9 w-9 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {product.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.store} ·{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: product.currency,
                      }).format(product.price)}
                    </p>
                  </div>
                </div>
                <span
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${
                    product.is_published
                      ? "border-neon-green/40 bg-neon-green/10 text-neon-green-dark"
                      : "border-orange-300/40 bg-orange-50 text-orange-600"
                  }`}
                >
                  {product.is_published ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                  {product.is_published ? "Live" : "Draft"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
