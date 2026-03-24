"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createProduct, updateProduct } from "@/lib/actions/products";
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = { id: string; name: string };

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPublished, setIsPublished] = useState(product?.is_published ?? false);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);

  function handleSubmit(formData: FormData) {
    // Inject checkbox/toggle values since they don't submit when unchecked
    formData.set("is_published", isPublished.toString());
    formData.set("is_featured", isFeatured.toString());

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(product ? "Product updated" : "Product created");
      router.push("/admin/products");
    });
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={product?.title}
              placeholder="The Useless Box"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="price" className="text-sm font-medium">
              Price <span className="text-destructive">*</span>
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={product?.price}
              placeholder="19.99"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="currency" className="text-sm font-medium">
              Currency
            </label>
            <Input
              id="currency"
              name="currency"
              defaultValue={product?.currency ?? "USD"}
              placeholder="USD"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="short_description" className="text-sm font-medium">
              Short Description
            </label>
            <Input
              id="short_description"
              name="short_description"
              defaultValue={product?.short_description ?? ""}
              placeholder="A box that turns itself off"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product?.description ?? ""}
              placeholder="Full product description..."
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="category_id" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              defaultValue={product?.category_id ?? ""}
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-3 text-sm transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Affiliate Info */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Affiliate Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="affiliate_url" className="text-sm font-medium">
              Affiliate URL <span className="text-destructive">*</span>
            </label>
            <Input
              id="affiliate_url"
              name="affiliate_url"
              type="url"
              required
              defaultValue={product?.affiliate_url}
              placeholder="https://amazon.com/dp/..."
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="store" className="text-sm font-medium">
              Store <span className="text-destructive">*</span>
            </label>
            <Input
              id="store"
              name="store"
              required
              defaultValue={product?.store}
              placeholder="Amazon"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="affiliate_network" className="text-sm font-medium">
              Affiliate Network
            </label>
            <Input
              id="affiliate_network"
              name="affiliate_network"
              defaultValue={product?.affiliate_network ?? ""}
              placeholder="Amazon Associates"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="affiliate_tag" className="text-sm font-medium">
              Affiliate Tag
            </label>
            <Input
              id="affiliate_tag"
              name="affiliate_tag"
              defaultValue={product?.affiliate_tag ?? ""}
              placeholder="mysite-20"
            />
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Images</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="image_url" className="text-sm font-medium">
              Image URL
            </label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={product?.image_url ?? ""}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="image_alt" className="text-sm font-medium">
              Image Alt Text
            </label>
            <Input
              id="image_alt"
              name="image_alt"
              defaultValue={product?.image_alt ?? ""}
              placeholder="A photo of the useless box"
            />
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">SEO</h2>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <label htmlFor="seo_title" className="text-sm font-medium">
              SEO Title
            </label>
            <Input
              id="seo_title"
              name="seo_title"
              defaultValue={product?.seo_title ?? ""}
              placeholder="Override the page title for search engines"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="seo_description" className="text-sm font-medium">
              SEO Description
            </label>
            <textarea
              id="seo_description"
              name="seo_description"
              rows={2}
              defaultValue={product?.seo_description ?? ""}
              placeholder="Meta description for search engines"
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>
      </section>

      {/* Publish Settings */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Status</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className="flex items-center gap-2"
          >
            <Badge variant={isPublished ? "default" : "outline"}>
              {isPublished ? "Published" : "Draft"}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setIsFeatured(!isFeatured)}
            className="flex items-center gap-2"
          >
            <Badge variant={isFeatured ? "secondary" : "outline"}>
              {isFeatured ? "Featured" : "Not Featured"}
            </Badge>
          </button>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : product
              ? "Update Product"
              : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
