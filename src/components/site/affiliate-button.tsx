"use client";

import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AffiliateButton({
  productId,
  affiliateUrl,
  store,
}: {
  productId: string;
  affiliateUrl: string;
  store: string;
}) {
  const pathname = usePathname();

  async function handleClick() {
    // Fire click tracking in background
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        source_page: pathname,
      }),
    }).catch(() => {
      // Silently fail — don't block the redirect
    });

    // Open affiliate link
    window.open(affiliateUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="animate-nudge motion-reduce:animate-none">
      <Button
        onClick={handleClick}
        size="lg"
        className="h-14 w-full gap-2 rounded-full border-2 border-foreground bg-neon-green font-display text-lg font-bold text-black shadow-[5px_5px_0_0_#ff6b9d] transition-all hover:-translate-y-1 hover:bg-neon-green hover:shadow-[7px_7px_0_0_#ff6b9d]"
      >
        <ExternalLink className="h-5 w-5" />
        Buy on {store}
      </Button>
    </div>
  );
}
