import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AffiliateButton } from "@/components/site/affiliate-button";
import { getProductBySlug } from "@/lib/actions/public";

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
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-xl border border-border bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.image_alt ?? product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-6xl">
              📦
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {product.categories && (
              <Link href={`/categories/${product.categories.slug}`}>
                <Badge variant="secondary">{product.categories.name}</Badge>
              </Link>
            )}
            {product.is_featured && <Badge>Featured</Badge>}
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold">
            {product.title}
          </h1>

          {product.short_description && (
            <p className="mt-2 text-lg text-muted-foreground">
              {product.short_description}
            </p>
          )}

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: product.currency,
              }).format(product.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              on {product.store}
            </span>
          </div>

          <div className="mt-6">
            <AffiliateButton
              productId={product.id}
              affiliateUrl={product.affiliate_url}
              store={product.store}
            />
          </div>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            Affiliate link — we may earn a commission
          </p>

          {product.description && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="font-display text-lg font-semibold">About</h2>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
