import Link from "next/link";
import { ArrowRight, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/site/cta-banner";
import { ProductCard } from "@/components/site/product-card";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { Sparks } from "@/components/site/doodles";
import {
  getFeaturedProducts,
  getRecentProducts,
  getActiveCategories,
  getActiveBanners,
} from "@/lib/actions/public";
import { getSiteSettings } from "@/lib/actions/settings";

const MARQUEE_PHRASES = [
  "Totally unnecessary",
  "Absolutely essential",
  "You came here on purpose",
  "Add to cart, coward",
  "It's basically self-care",
  "Treat yourself",
];

const CATEGORY_TILE_STYLES = [
  {
    bg: "bg-neon-green/15",
    border: "hover:border-neon-green",
    shadow: "hover:shadow-[5px_5px_0_0_#68f70b]",
    icon: "bg-neon-green/25",
  },
  {
    bg: "bg-hot-pink/15",
    border: "hover:border-hot-pink",
    shadow: "hover:shadow-[5px_5px_0_0_#ff6b9d]",
    icon: "bg-hot-pink/25",
  },
  {
    bg: "bg-electric-blue/15",
    border: "hover:border-electric-blue",
    shadow: "hover:shadow-[5px_5px_0_0_#00d4ff]",
    icon: "bg-electric-blue/25",
  },
  {
    bg: "bg-purple/15",
    border: "hover:border-purple",
    shadow: "hover:shadow-[5px_5px_0_0_#b44dff]",
    icon: "bg-purple/25",
  },
  {
    bg: "bg-bright-yellow/20",
    border: "hover:border-bright-yellow",
    shadow: "hover:shadow-[5px_5px_0_0_#ffe600]",
    icon: "bg-bright-yellow/35",
  },
];

export default async function HomePage() {
  const [featured, recent, categories, banners, settings] = await Promise.all([
    getFeaturedProducts(),
    getRecentProducts(8),
    getActiveCategories(),
    getActiveBanners(),
    getSiteSettings(),
  ]);

  return (
    <div>
      {/* Hero (backend-fed carousel, playful fallback when no banners) */}
      <HeroCarousel
        banners={banners}
        siteDescription={settings.site_description}
      />

      {/* Marquee strip */}
      <div className="overflow-hidden border-b-2 border-foreground bg-foreground py-2.5">
        <div className="animate-marquee flex w-max items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {MARQUEE_PHRASES.map((phrase, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="flex items-center whitespace-nowrap font-display text-sm font-bold uppercase tracking-widest text-neon-green"
                >
                  {phrase}
                  <span className="mx-6 text-hot-pink">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-flex -rotate-1 items-center gap-1 rounded-full bg-hot-pink px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider text-black shadow-[2px_2px_0_0_#1a1a1a]">
                <Flame className="h-3 w-3" />
                Hot right now
              </span>
              <h2 className="relative mt-2 w-fit font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Featured Finds
                <Sparks className="absolute -right-8 -top-3 h-6 w-6 rotate-30 text-hot-pink" />
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="font-display font-bold"
              render={<Link href="/products" />}
              nativeButton={false}
            >
              View all
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showPrice={settings.show_prices}
              />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="border-y-2 border-foreground bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="relative w-fit font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              Pick Your Poison
              <Sparks className="absolute -right-8 -top-3 h-6 w-6 rotate-30 text-neon-green" />
            </h2>
            <p className="mt-1 text-muted-foreground">
              Every category is a different way to say &quot;fine, I&apos;ll buy it.&quot;
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat, i) => {
                const style =
                  CATEGORY_TILE_STYLES[i % CATEGORY_TILE_STYLES.length];
                return (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className={`group flex items-center gap-3 rounded-2xl border-2 border-foreground/15 p-4 transition-all hover:-translate-y-1 ${style.bg} ${style.border} ${style.shadow}`}
                  >
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="h-11 w-11 rounded-xl border border-foreground/10 object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${style.icon}`}
                      >
                        📦
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-display text-sm font-bold">
                        {cat.name}
                      </p>
                      {cat.description && (
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {cat.description}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Recent Products */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-flex rotate-1 items-center gap-1 rounded-full bg-electric-blue px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider text-black shadow-[2px_2px_0_0_#1a1a1a]">
                <Zap className="h-3 w-3" />
                Fresh off the truck
              </span>
              <h2 className="relative mt-2 w-fit font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Latest Finds
                <Sparks className="absolute -right-8 -top-3 h-6 w-6 rotate-30 text-electric-blue" />
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="font-display font-bold"
              render={<Link href="/products" />}
              nativeButton={false}
            >
              View all
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showPrice={settings.show_prices}
              />
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA band */}
      <CtaBanner />
    </div>
  );
}
