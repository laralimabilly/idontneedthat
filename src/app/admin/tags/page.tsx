import { TagsManager } from "@/components/admin/tags-manager";
import { getTags } from "@/lib/actions/tags";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Tags</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tags.length} tag{tags.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <TagsManager tags={tags} />
    </div>
  );
}
