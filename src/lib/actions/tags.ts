"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type TagRow = Database["public"]["Tables"]["tags"]["Row"];
type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];
type TagUpdate = Database["public"]["Tables"]["tags"]["Update"];


export async function getTags(): Promise<TagRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as unknown as TagRow[];
}

export async function getTag(id: string): Promise<TagRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as unknown as TagRow;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export async function createTag(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const tag: TagInsert = {
    name,
    slug: slugify(name),
  };

  const { error } = await supabase.from("tags").insert(tag);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/tags");
  return { success: true };
}

export async function updateTag(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const tag: TagUpdate = {
    name,
    slug: slugify(name),
  };

  const { error } = await supabase.from("tags").update(tag).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/tags");
  return { success: true };
}

export async function deleteTag(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("tags").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/tags");
  return { success: true };
}
