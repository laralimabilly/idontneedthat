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
    <Button onClick={handleClick} size="lg" className="w-full gap-2">
      <ExternalLink className="h-4 w-4" />
      Buy on {store}
    </Button>
  );
}
