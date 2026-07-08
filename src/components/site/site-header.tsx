import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 -rotate-3 items-center justify-center rounded-lg border-2 border-foreground bg-neon-green font-display text-sm font-black text-black shadow-[2px_2px_0_0_#1a1a1a] transition-transform group-hover:rotate-3">
            !?
          </span>
          <span className="font-display text-lg font-black tracking-tight">
            <span className="text-neon-green-dark">{firstWord}</span>{" "}
            {rest}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-neon-green/15 hover:text-foreground"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="rounded-full border-2 border-foreground bg-foreground font-display font-bold text-background shadow-[3px_3px_0_0_rgba(104,247,11,1)] transition-transform hover:-translate-y-0.5 hover:bg-foreground"
            render={<Link href="/products" />}
            nativeButton={false}
          >
            All Products
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
