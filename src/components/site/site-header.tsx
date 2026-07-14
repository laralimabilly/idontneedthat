import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader({ siteName }: { siteName: string }) {
  return (
    <header className="sticky top-0 z-40 h-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="group rounded-full border border-white/50 bg-white/35 px-4 py-2 shadow-lg shadow-black/5 backdrop-blur-md sm:px-6 sm:py-2.5"
        >
          <img
            src="/logo-notagline.svg"
            alt={siteName}
            className="h-12 w-auto transition-transform group-hover:-rotate-2 sm:h-[4.2rem]"
          />
        </Link>

        <Button
          className="h-11 rounded-full border-2 border-foreground bg-foreground px-5 font-display text-base font-bold text-background shadow-[3px_3px_0_0_rgba(104,247,11,1)] transition-transform hover:-translate-y-0.5"
          render={<Link href="/products" />}
          nativeButton={false}
        >
          All Products
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
