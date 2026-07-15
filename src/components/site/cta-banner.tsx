import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Dark CTA band shown at the bottom of every public page, right above the
 * footer — its black background flows into the footer's squiggle divider.
 */
export function CtaBanner() {
  return (
    <section className="mt-auto border-t-2 border-foreground bg-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 text-center">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-background sm:text-4xl">
          Still convinced you don&apos;t need anything
          <span className="text-neon-green">*</span>?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-background/70">
          Bold of you. Scroll the full catalog and prove yourself wrong.
        </p>
        <Button
          size="lg"
          className="mt-6 rounded-full border-2 border-neon-green bg-neon-green font-display font-bold text-black shadow-[4px_4px_0_0_#ff6b9d] transition-transform hover:-translate-y-0.5 hover:bg-neon-green"
          render={<Link href="/products" />}
          nativeButton={false}
        >
          Browse everything
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
