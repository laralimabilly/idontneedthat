import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-neon-green/40 hover:shadow-lg hover:shadow-neon-green/5"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.image_alt ?? product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <span className="text-4xl">📦</span>
          </div>
        )}
        {product.is_featured && (
          <Badge className="absolute left-2 top-2" variant="default">
            Featured
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        {product.categories && (
          <span className="mb-1 text-xs font-medium text-neon-green-dark">
            {product.categories.name}
          </span>
        )}
        <h3 className="font-display text-sm font-semibold leading-tight group-hover:text-neon-green-dark">
          {product.title}
        </h3>
        {product.short_description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {product.short_description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          {showPrice ? (
            <span className="font-display text-base font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: product.currency,
              }).format(product.price)}
            </span>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">{product.store}</span>
        </div>
      </div>
    </Link>
  );
}
