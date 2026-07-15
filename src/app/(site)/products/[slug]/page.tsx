import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { AffiliateButton } from "@/components/site/affiliate-button";
import { CtaBanner } from "@/components/site/cta-banner";
import { InkSplat, Sparks } from "@/components/site/doodles";
import { getProductBySlug } from "@/lib/actions/public";
import { getSiteSettings } from "@/lib/actions/settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.seo_title ?? product.title,
    description:
      product.seo_description ??
      product.short_description ??
      product.description?.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
  }).format(product.price);

  return (
    <>
      <section className="relative overflow-hidden bg-dot-grid">
        {/* Same wash + blob treatment as the home hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 via-transparent to-electric-blue/10" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-neon-green/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-hot-pink/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-28 sm:pt-32">
          <Link
            href="/products"
            className="inline-flex -rotate-1 items-center gap-1.5 rounded-full border-2 border-foreground bg-surface px-4 py-1.5 font-display text-sm font-bold shadow-[3px_3px_0_0_#1a1a1a] transition-transform hover:-translate-y-0.5 hover:rotate-0"
          >
            <ArrowLeft className="h-4 w-4" />
            All Products
          </Link>

          <div className="mt-10 grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
            {/* Image — floating polaroid with stickers */}
            <div className="relative">
              <InkSplat className="absolute -left-10 -top-10 h-28 w-28 -rotate-12 text-neon-green/50" />
              <Sparks className="absolute -right-2 -top-8 h-10 w-10 rotate-12 text-hot-pink" />

              <div className="animate-float relative [--float-rotate:-2deg] motion-reduce:animate-none">
                <div className="overflow-hidden rounded-3xl border-2 border-foreground bg-surface shadow-[8px_8px_0_0_#1a1a1a]">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.image_alt ?? product.title}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center text-7xl">
                      📦
                    </div>
                  )}
                </div>

                {product.is_featured && (
                  <span className="absolute -left-3 -top-3 inline-flex -rotate-6 items-center gap-1 rounded-full border-2 border-foreground bg-bright-yellow px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-black shadow-[3px_3px_0_0_#1a1a1a]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    Featured
                  </span>
                )}

                {settings.show_prices && (
                  <span className="absolute -bottom-5 -right-2 rotate-3 rounded-full border-2 border-foreground bg-bright-yellow px-5 py-2 font-heading text-2xl font-bold text-black shadow-[4px_4px_0_0_#1a1a1a] sm:-right-5">
                    {price}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                {product.categories && (
                  <Link
                    href={`/categories/${product.categories.slug}`}
                    className="inline-flex -rotate-1 items-center rounded-full border-2 border-foreground bg-electric-blue px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-black shadow-[2px_2px_0_0_#1a1a1a] transition-transform hover:-translate-y-0.5 hover:rotate-0"
                  >
                    {product.categories.name}
                  </Link>
                )}
                <span className="inline-flex rotate-1 items-center rounded-full border-2 border-foreground bg-surface px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-[2px_2px_0_0_#1a1a1a]">
                  on {product.store}
                </span>
              </div>

              <h1 className="relative mt-5 w-fit font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                {product.title}
                <span className="text-neon-green-dark">*</span>
              </h1>

              {product.short_description && (
                <p className="mt-4 text-lg text-muted-foreground">
                  {product.short_description}
                </p>
              )}

              <p className="mt-3 font-display text-sm font-bold text-hot-pink">
                *It&apos;s not an impulse buy if you scrolled this far. ;)
              </p>

              {/* CTA card — the whole point of this page */}
              <div className="mt-8 rounded-3xl border-2 border-foreground bg-surface p-5 shadow-[6px_6px_0_0_rgba(104,247,11,1)]">
                {settings.show_prices && (
                  <div className="mb-4 flex items-baseline justify-center gap-2">
                    <span className="font-heading text-4xl font-bold">
                      {price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      on {product.store}
                    </span>
                  </div>
                )}
                <AffiliateButton
                  productId={product.id}
                  affiliateUrl={product.affiliate_url}
                  store={product.store}
                />
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Affiliate link — we may earn a commission. Your wallet may
                  never forgive us.
                </p>
              </div>

              {/* Brand promise stickers */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="-rotate-2 rounded-full bg-neon-green/20 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-neon-green-dark">
                  Weird ✓
                </span>
                <span className="rotate-1 rounded-full bg-bright-yellow/30 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-yellow-700">
                  Useful ✓
                </span>
                <span className="-rotate-1 rounded-full bg-hot-pink/20 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-hot-pink">
                  Funny ✓
                </span>
              </div>

              {product.description && (
                <div className="mt-10">
                  <h2 className="relative w-fit font-heading text-2xl font-bold tracking-tight">
                    Why you need<span className="text-neon-green-dark">*</span>{" "}
                    it
                    <Sparks className="absolute -right-8 -top-3 h-6 w-6 rotate-12 text-electric-blue" />
                  </h2>
                  <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
