import { Plus } from "lucide-react";
import { CategoriesManager } from "@/components/admin/categories-manager";
import { getCategories } from "@/lib/actions/categories";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
      </div>

      <CategoriesManager categories={categories} />
    </div>
  );
}
