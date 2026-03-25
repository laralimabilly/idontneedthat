import type { Metadata } from "next";
import { ProductCard } from "@/components/site/product-card";
import { getPublishedProducts } from "@/lib/actions/public";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our full collection of wonderfully useless products you didn't know you needed.",
};

export default async function ProductsPage() {
  const products = await getPublishedProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div>
        <h1 className="font-display text-3xl font-bold">All Products</h1>
        <p className="mt-1 text-muted-foreground">
          {products.length} product{products.length !== 1 ? "s" : ""} you
          didn&apos;t know you needed.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">
            No products available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
