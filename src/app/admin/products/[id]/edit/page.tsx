import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { getProduct, getCategories } from "@/lib/actions/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProduct(id).catch(() => null),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Products
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold">
          Edit Product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{product.title}</p>
      </div>

      <div className="max-w-2xl">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
