import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CtaBanner } from "@/components/site/cta-banner";
import { InkSplat, Sparks } from "@/components/site/doodles";
import { ProductCard } from "@/components/site/product-card";
import { getProductsByCategory } from "@/lib/actions/public";
import { getSiteSettings } from "@/lib/actions/settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductsByCategory(slug);
  if (!result) return { title: "Category Not Found" };

  return {
    title: result.category.name,
    description:
      result.category.description ??
      `Browse ${result.category.name} — wonderfully useless products you didn't know you needed.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [result, settings] = await Promise.all([
    getProductsByCategory(slug),
    getSiteSettings(),
  ]);

  if (!result) {
    notFound();
  }

  const { category, products } = result;

  return (
    <>
      <section className="relative overflow-hidden bg-dot-grid">
        {/* Same wash + blob treatment as the home hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 via-transparent to-electric-blue/10" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-neon-green/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-hot-pink/20 blur-3xl" />
        <InkSplat className="absolute -left-8 top-32 hidden h-24 w-24 -rotate-12 text-neon-green/40 lg:block" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-28 sm:pt-32">
          <Link
            href="/products"
            className="inline-flex -rotate-1 items-center gap-1.5 rounded-full border-2 border-foreground bg-surface px-4 py-1.5 font-display text-sm font-bold shadow-[3px_3px_0_0_#1a1a1a] transition-transform hover:-translate-y-0.5 hover:rotate-0"
          >
            <ArrowLeft className="h-4 w-4" />
            All Products
          </Link>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="relative w-fit font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                {category.name}
                <span className="text-neon-green-dark">*</span>
                <Sparks className="absolute -right-9 -top-4 h-8 w-8 rotate-12 text-hot-pink" />
              </h1>
              {category.description && (
                <p className="mt-3 max-w-xl text-lg text-muted-foreground">
                  {category.description}
                </p>
              )}
              <p className="mt-3 font-display text-sm font-bold text-hot-pink">
                *A different way to say &quot;fine, I&apos;ll buy it.&quot;
              </p>
            </div>
            <span className="inline-flex rotate-1 items-center rounded-full border-2 border-foreground bg-bright-yellow px-4 py-1.5 font-display text-sm font-bold text-black shadow-[3px_3px_0_0_#1a1a1a]">
              {products.length} temptation{products.length !== 1 ? "s" : ""}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="mt-16 text-center">
              <span className="text-6xl">📦</span>
              <p className="mt-4 font-heading text-2xl font-bold">
                Nothing here yet<span className="text-neon-green-dark">*</span>
              </p>
              <p className="mt-2 text-muted-foreground">
                *The chicken is still packing the boxes. Check back soon!
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showPrice={settings.show_prices}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
