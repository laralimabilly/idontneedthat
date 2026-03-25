import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import { getProductsByCategory } from "@/lib/actions/public";

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
  const result = await getProductsByCategory(slug);

  if (!result) {
    notFound();
  }

  const { category, products } = result;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Products
      </Link>

      <div className="mt-6">
        <h1 className="font-display text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="mt-1 text-muted-foreground">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">
            No products in this category yet.
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
