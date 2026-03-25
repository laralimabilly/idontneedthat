"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];


export async function getCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  if (error) throw error;
  return data as unknown as CategoryRow[];
}

export async function getCategory(id: string): Promise<CategoryRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as unknown as CategoryRow;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const category: CategoryInsert = {
    name,
    slug: slugify(name),
    description: (formData.get("description") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    display_order: parseInt(formData.get("display_order") as string) || 0,
    is_active: formData.get("is_active") === "true",
  };

  const { error } = await supabase.from("categories").insert(category);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const category: CategoryUpdate = {
    name,
    slug: slugify(name),
    description: (formData.get("description") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    display_order: parseInt(formData.get("display_order") as string) || 0,
    is_active: formData.get("is_active") === "true",
  };

  const { error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}
