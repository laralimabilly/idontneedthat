"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  ImageIcon,
} from "lucide-react";
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
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerActive,
} from "@/lib/actions/banners";
import type { Database } from "@/types/database";

type BannerRow = Database["public"]["Tables"]["hero_banners"]["Row"];

const THEMES = [
  { value: "neon-green", label: "Neon Green", swatch: "bg-neon-green" },
  { value: "hot-pink", label: "Hot Pink", swatch: "bg-hot-pink" },
  { value: "electric-blue", label: "Electric Blue", swatch: "bg-electric-blue" },
  { value: "bright-yellow", label: "Bright Yellow", swatch: "bg-bright-yellow" },
  { value: "purple", label: "Purple", swatch: "bg-purple" },
] as const;

type DialogMode =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; banner: BannerRow }
  | { type: "delete"; banner: BannerRow };

export function BannersManager({ banners }: { banners: BannerRow[] }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogMode>({ type: "closed" });
  const [theme, setTheme] = useState<string>("neon-green");
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setTheme("neon-green");
    setDialog({ type: "create" });
  }

  function openEdit(banner: BannerRow) {
    setTheme(banner.theme);
    setDialog({ type: "edit", banner });
  }

  function handleCreate(formData: FormData) {
    formData.set("is_active", "true");
    formData.set("theme", theme);
    startTransition(async () => {
      const result = await createBanner(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Banner created");
        setDialog({ type: "closed" });
        router.refresh();
      }
    });
  }

  function handleUpdate(formData: FormData) {
    if (dialog.type !== "edit") return;
    formData.set("theme", theme);
    startTransition(async () => {
      const result = await updateBanner(dialog.banner.id, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Banner updated");
        setDialog({ type: "closed" });
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (dialog.type !== "delete") return;
    startTransition(async () => {
      const result = await deleteBanner(dialog.banner.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Banner deleted");
        setDialog({ type: "closed" });
        router.refresh();
      }
    });
  }

  function handleToggleActive(id: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleBannerActive(id, !current);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(current ? "Banner deactivated" : "Banner activated");
        router.refresh();
      }
    });
  }

  const editing = dialog.type === "edit" ? dialog.banner : null;

  return (
    <>
      {banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <p className="text-muted-foreground">No banners yet</p>
          <Button className="mt-4" onClick={openCreate}>
            Add your first banner
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Banner
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Order</TableHead>
                <TableHead>Banner</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>CTA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => {
                const themeDef =
                  THEMES.find((t) => t.value === banner.theme) ?? THEMES[0];
                return (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <GripVertical className="h-3.5 w-3.5" />
                        {banner.display_order}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {banner.image_url ? (
                          <img
                            src={banner.image_url}
                            alt={banner.title}
                            className="h-10 w-16 rounded-md border border-border object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-16 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{banner.title}</p>
                          {banner.subtitle && (
                            <p className="line-clamp-1 text-xs text-muted-foreground">
                              {banner.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span
                          className={`h-3 w-3 rounded-full border border-border ${themeDef.swatch}`}
                        />
                        {themeDef.label}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {banner.cta_label || "—"}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          handleToggleActive(banner.id, banner.is_active)
                        }
                        disabled={isPending}
                        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                          banner.is_active
                            ? "border-neon-green/40 bg-neon-green/10 text-neon-green-dark"
                            : "border-orange-300/40 bg-orange-50 text-orange-600"
                        }`}
                        title={
                          banner.is_active
                            ? "Click to deactivate"
                            : "Click to activate"
                        }
                      >
                        {banner.is_active ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                        {banner.is_active ? "Live" : "Hidden"}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(banner)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDialog({ type: "delete", banner })}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Banner" : "New Banner"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the hero banner."
                : "Add a banner to the homepage hero carousel."}
            </DialogDescription>
          </DialogHeader>
          <form
            action={editing ? handleUpdate : handleCreate}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label htmlFor="banner-title" className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="banner-title"
                name="title"
                required
                defaultValue={editing?.title ?? ""}
                placeholder="The gadget you'll pretend was a gift"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="banner-subtitle" className="text-sm font-medium">
                Subtitle
              </label>
              <Input
                id="banner-subtitle"
                name="subtitle"
                defaultValue={editing?.subtitle ?? ""}
                placeholder="You said you didn't need it. You lied."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="banner-badge" className="text-sm font-medium">
                  Badge
                </label>
                <Input
                  id="banner-badge"
                  name="badge"
                  defaultValue={editing?.badge ?? ""}
                  placeholder="New drop"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="banner-order" className="text-sm font-medium">
                  Display Order
                </label>
                <Input
                  id="banner-order"
                  name="display_order"
                  type="number"
                  defaultValue={editing?.display_order ?? 0}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="banner-image" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="banner-image"
                name="image_url"
                type="url"
                defaultValue={editing?.image_url ?? ""}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="banner-cta-label" className="text-sm font-medium">
                  CTA Label
                </label>
                <Input
                  id="banner-cta-label"
                  name="cta_label"
                  defaultValue={editing?.cta_label ?? ""}
                  placeholder="Take my money"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="banner-cta-url" className="text-sm font-medium">
                  CTA URL
                </label>
                <Input
                  id="banner-cta-url"
                  name="cta_url"
                  defaultValue={editing?.cta_url ?? ""}
                  placeholder="/products/slug or https://..."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-sm font-medium">Theme Color</span>
              <div className="flex items-center gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value)}
                    title={t.label}
                    className={`h-7 w-7 rounded-full border-2 transition-transform ${t.swatch} ${
                      theme === t.value
                        ? "scale-110 border-foreground"
                        : "border-border hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>

            {editing && (
              <input
                type="hidden"
                name="is_active"
                value={editing.is_active.toString()}
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
                {isPending ? "Saving..." : editing ? "Update" : "Create"}
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
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {dialog.type === "delete" ? dialog.banner.title : ""}
              </strong>
              ? It will disappear from the homepage hero.
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
