"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
} from "@/lib/actions/categories";
import type { Database } from "@/types/database";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

type DialogMode =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; category: CategoryRow }
  | { type: "delete"; category: CategoryRow };

export function CategoriesManager({
  categories,
}: {
  categories: CategoryRow[];
}) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogMode>({ type: "closed" });
  const [isPending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    formData.set("is_active", "true");
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Category created");
        setDialog({ type: "closed" });
        router.refresh();
      }
    });
  }

  function handleUpdate(formData: FormData) {
    if (dialog.type !== "edit") return;
    startTransition(async () => {
      const result = await updateCategory(dialog.category.id, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Category updated");
        setDialog({ type: "closed" });
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (dialog.type !== "delete") return;
    startTransition(async () => {
      const result = await deleteCategory(dialog.category.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Category deleted");
        setDialog({ type: "closed" });
        router.refresh();
      }
    });
  }

  function handleToggleActive(id: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleCategoryActive(id, !current);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(current ? "Category deactivated" : "Category activated");
        router.refresh();
      }
    });
  }

  return (
    <>
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <p className="text-muted-foreground">No categories yet</p>
          <Button
            className="mt-4"
            onClick={() => setDialog({ type: "create" })}
          >
            Add your first category
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => setDialog({ type: "create" })}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Category
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <GripVertical className="h-3.5 w-3.5" />
                    {cat.display_order}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground">
                      {cat.description}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {cat.slug}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggleActive(cat.id, cat.is_active)}
                    disabled={isPending}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                      cat.is_active
                        ? "border-neon-green/40 bg-neon-green/10 text-neon-green-dark"
                        : "border-orange-300/40 bg-orange-50 text-orange-600"
                    }`}
                    title={
                      cat.is_active
                        ? "Click to deactivate"
                        : "Click to activate"
                    }
                  >
                    {cat.is_active ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                    {cat.is_active ? "Active" : "Inactive"}
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        setDialog({ type: "edit", category: cat })
                      }
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        setDialog({ type: "delete", category: cat })
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog
        open={dialog.type === "create" || dialog.type === "edit"}
        onOpenChange={(open) => {
          if (!open) setDialog({ type: "closed" });
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialog.type === "edit" ? "Edit Category" : "New Category"}
            </DialogTitle>
            <DialogDescription>
              {dialog.type === "edit"
                ? "Update the category details."
                : "Add a new product category."}
            </DialogDescription>
          </DialogHeader>
          <form
            action={dialog.type === "edit" ? handleUpdate : handleCreate}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label htmlFor="cat-name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="cat-name"
                name="name"
                required
                defaultValue={
                  dialog.type === "edit" ? dialog.category.name : ""
                }
                placeholder="Gadgets"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cat-desc" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="cat-desc"
                name="description"
                defaultValue={
                  dialog.type === "edit"
                    ? (dialog.category.description ?? "")
                    : ""
                }
                placeholder="Wonderfully useless gadgets"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cat-image" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="cat-image"
                name="image_url"
                type="url"
                defaultValue={
                  dialog.type === "edit"
                    ? (dialog.category.image_url ?? "")
                    : ""
                }
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cat-order" className="text-sm font-medium">
                Display Order
              </label>
              <Input
                id="cat-order"
                name="display_order"
                type="number"
                defaultValue={
                  dialog.type === "edit" ? dialog.category.display_order : 0
                }
              />
            </div>

            {dialog.type === "edit" && (
              <input
                type="hidden"
                name="is_active"
                value={dialog.category.is_active.toString()}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialog({ type: "closed" })}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving..."
                  : dialog.type === "edit"
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={dialog.type === "delete"}
        onOpenChange={(open) => {
          if (!open) setDialog({ type: "closed" });
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {dialog.type === "delete" ? dialog.category.name : ""}
              </strong>
              ? Products in this category will become uncategorized.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialog({ type: "closed" })}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
