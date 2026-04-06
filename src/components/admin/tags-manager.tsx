"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
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
  createTag,
  updateTag,
  deleteTag,
} from "@/lib/actions/tags";
import type { Database } from "@/types/database";

type TagRow = Database["public"]["Tables"]["tags"]["Row"];

type DialogMode =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; tag: TagRow }
  | { type: "delete"; tag: TagRow };

export function TagsManager({ tags }: { tags: TagRow[] }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogMode>({ type: "closed" });
  const [isPending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createTag(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Tag created");
        setDialog({ type: "closed" });
        router.refresh();
      }
    });
  }

  function handleUpdate(formData: FormData) {
    if (dialog.type !== "edit") return;
    startTransition(async () => {
      const result = await updateTag(dialog.tag.id, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Tag updated");
        setDialog({ type: "closed" });
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (dialog.type !== "delete") return;
    startTransition(async () => {
      const result = await deleteTag(dialog.tag.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Tag deleted");
        setDialog({ type: "closed" });
        router.refresh();
      }
    });
  }

  return (
    <>
      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <p className="text-muted-foreground">No tags yet</p>
          <Button
            className="mt-4"
            onClick={() => setDialog({ type: "create" })}
          >
            Add your first tag
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="group flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5"
              >
                <span className="text-sm font-medium">{tag.name}</span>
                <span className="text-xs text-muted-foreground">
                  {tag.slug}
                </span>
                <div className="ml-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => setDialog({ type: "edit", tag })}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setDialog({ type: "delete", tag })}
                    className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Also show table for detail view */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {tag.slug}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(tag.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDialog({ type: "edit", tag })}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDialog({ type: "delete", tag })}
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
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {dialog.type === "edit" ? "Edit Tag" : "New Tag"}
            </DialogTitle>
            <DialogDescription>
              {dialog.type === "edit"
                ? "Update the tag name. Slug will be auto-generated."
                : "Add a new tag. Slug will be auto-generated from the name."}
            </DialogDescription>
          </DialogHeader>
          <form
            action={dialog.type === "edit" ? handleUpdate : handleCreate}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label htmlFor="tag-name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="tag-name"
                name="name"
                required
                defaultValue={
                  dialog.type === "edit" ? dialog.tag.name : ""
                }
                placeholder="Weird Kitchen"
              />
            </div>

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
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {dialog.type === "delete" ? dialog.tag.name : ""}
              </strong>
              ? It will be removed from all products.
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
