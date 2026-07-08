import Link from "next/link";
import { Star } from "lucide-react";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

type ProductWithCategory = ProductRow & {
  categories: { name: string; slug: string } | null;
};

export function ProductCard({
  product,
  showPrice = true,
}: {
  product: ProductWithCategory;
  showPrice?: boolean;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border-2 border-foreground/15 bg-card transition-all hover:-translate-y-1 hover:border-foreground hover:shadow-[6px_6px_0_0_#68f70b]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.image_alt ?? product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <span className="text-4xl">📦</span>
          </div>
        )}
        {product.is_featured && (
          <span className="absolute left-2.5 top-2.5 inline-flex -rotate-2 items-center gap-1 rounded-full bg-bright-yellow px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-black shadow-[2px_2px_0_0_#1a1a1a]">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        {product.categories && (
          <span className="mb-1.5 w-fit rounded-full bg-neon-green/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon-green-dark">
            {product.categories.name}
          </span>
        )}
        <h3 className="font-display text-sm font-bold leading-snug group-hover:text-neon-green-dark">
          {product.title}
        </h3>
        {product.short_description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {product.short_description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3.5">
          {showPrice ? (
            <span className="rounded-lg bg-foreground px-2 py-0.5 font-display text-sm font-bold text-background">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: product.currency,
              }).format(product.price)}
            </span>
          ) : (
            <span />
          )}
          <span className="text-xs font-medium text-muted-foreground">
            {product.store}
          </span>
        </div>
      </div>
    </Link>
  );
}
