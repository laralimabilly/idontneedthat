import Link from "next/link";
import type { Database } from "@/types/database";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export function SiteHeader({
  categories,
  siteName,
}: {
  categories: CategoryRow[];
  siteName: string;
}) {
  // Split site name on first space for two-tone styling
  const firstWord = siteName.split(" ").slice(0, 2).join(" ");
  const rest = siteName.split(" ").slice(2).join(" ");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold">
            <span className="text-neon-green">{firstWord}</span>{" "}
            {rest}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            All Products
          </Link>
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            Browse
          </Link>
        </div>
      </div>
    </header>
  );
}
