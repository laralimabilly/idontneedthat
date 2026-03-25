import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <Link href="/" className="font-display text-sm font-bold">
              <span className="text-neon-green">I DON&apos;T</span> NEED THAT
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              Products You Didn&apos;t Know You Needed
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            This site contains affiliate links. We may earn a commission at no
            extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
