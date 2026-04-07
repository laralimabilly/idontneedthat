import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/product-card";
import {
  getFeaturedProducts,
  getRecentProducts,
  getActiveCategories,
} from "@/lib/actions/public";
import { getSiteSettings } from "@/lib/actions/settings";

export default async function HomePage() {
  const [featured, recent, categories, settings] = await Promise.all([
    getFeaturedProducts(),
    getRecentProducts(8),
    getActiveCategories(),
    getSiteSettings(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Products You Didn&apos;t Know{" "}
              <span className="text-neon-green">You Needed</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {settings.site_description}
            </p>
            <div className="mt-6 flex gap-3">
              <Button render={<Link href="/products" />} nativeButton={false} size="lg">
                Browse Products
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Featured</h2>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/products" />} nativeButton={false}
            >
              View all
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} showPrice={settings.show_prices} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="font-display text-2xl font-bold">Categories</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-neon-green/40 hover:shadow-md"
                >
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-green/10 text-lg">
                      📁
                    </div>
                  )}
                  <div>
                    <p className="font-display text-sm font-semibold">
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Products */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Latest Finds</h2>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/products" />} nativeButton={false}
            >
              View all
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((product) => (
              <ProductCard key={product.id} product={product} showPrice={settings.show_prices} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
