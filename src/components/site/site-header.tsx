import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader({ siteName }: { siteName: string }) {
  return (
    <header className="sticky top-0 z-40 h-0">
      <div className="flex items-center justify-between py-4">
        {/* Half-cylinder tab, mounted on the left viewport edge */}
        <Link
          href="/"
          className="group rounded-r-full border border-l-0 border-white/50 bg-white/35 py-2 pl-3 pr-5 shadow-lg shadow-black/5 backdrop-blur-md sm:py-2.5 sm:pl-5 sm:pr-7"
        >
          <img
            src="/logo-notagline.svg"
            alt={siteName}
            className="h-12 w-auto transition-transform group-hover:-rotate-2 sm:h-[4.2rem]"
          />
        </Link>

        {/* Half-cylinder tab, mounted on the right viewport edge */}
        <Button
          className="h-11 rounded-l-full rounded-r-none border-2 border-r-0 border-foreground bg-foreground pl-6 pr-4 font-display text-base font-bold text-background shadow-[0_3px_0_0_rgba(104,247,11,1)] transition-transform hover:-translate-y-0.5 sm:pr-6"
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
