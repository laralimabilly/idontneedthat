"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, BarChart3, BarChartBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateSiteSettings,
  type SiteSettings,
} from "@/lib/actions/settings";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();
  const [showPrices, setShowPrices] = useState(settings.show_prices);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    settings.analytics_enabled
  );

  function handleSubmit(formData: FormData) {
    formData.set("show_prices", showPrices.toString());
    formData.set("analytics_enabled", analyticsEnabled.toString());

    startTransition(async () => {
      const result = await updateSiteSettings(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Settings saved");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* General */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">General</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="site_name" className="text-sm font-medium">
              Site Name
            </label>
            <Input
              id="site_name"
              name="site_name"
              defaultValue={settings.site_name}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="site_description" className="text-sm font-medium">
              Site Description
            </label>
            <Input
              id="site_description"
              name="site_description"
              defaultValue={settings.site_description}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="footer_text" className="text-sm font-medium">
              Footer Text
            </label>
            <textarea
              id="footer_text"
              name="footer_text"
              rows={2}
              defaultValue={settings.footer_text}
              placeholder="Custom footer text..."
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>
      </section>

      {/* Affiliate Defaults */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">
          Affiliate Defaults
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="default_affiliate_tag"
              className="text-sm font-medium"
            >
              Default Affiliate Tag
            </label>
            <Input
              id="default_affiliate_tag"
              name="default_affiliate_tag"
              defaultValue={settings.default_affiliate_tag}
              placeholder="mysite-20"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="default_affiliate_network"
              className="text-sm font-medium"
            >
              Default Affiliate Network
            </label>
            <Input
              id="default_affiliate_network"
              name="default_affiliate_network"
              defaultValue={settings.default_affiliate_network}
              placeholder="Amazon Associates"
            />
          </div>
        </div>
      </section>

      {/* Display */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Display</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="products_per_page"
              className="text-sm font-medium"
            >
              Products Per Page
            </label>
            <Input
              id="products_per_page"
              name="products_per_page"
              type="number"
              min="1"
              max="100"
              defaultValue={settings.products_per_page}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowPrices(!showPrices)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              showPrices
                ? "border-neon-green/40 bg-neon-green/10 text-neon-green-dark"
                : "border-orange-300/40 bg-orange-50 text-orange-600"
            }`}
          >
            {showPrices ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
            {showPrices ? "Prices Visible" : "Prices Hidden"}
          </button>

          <button
            type="button"
            onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              analyticsEnabled
                ? "border-neon-green/40 bg-neon-green/10 text-neon-green-dark"
                : "border-orange-300/40 bg-orange-50 text-orange-600"
            }`}
          >
            {analyticsEnabled ? (
              <BarChart3 className="h-3 w-3" />
            ) : (
              <BarChartBig className="h-3 w-3" />
            )}
            {analyticsEnabled ? "Analytics On" : "Analytics Off"}
          </button>
        </div>
      </section>

      {/* Social */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Social</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="social_twitter"
              className="text-sm font-medium"
            >
              Twitter / X Handle
            </label>
            <Input
              id="social_twitter"
              name="social_twitter"
              defaultValue={settings.social_twitter}
              placeholder="@idontneedthat"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="social_instagram"
              className="text-sm font-medium"
            >
              Instagram Handle
            </label>
            <Input
              id="social_instagram"
              name="social_instagram"
              defaultValue={settings.social_instagram}
              placeholder="@idontneedthat"
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="border-t border-border pt-6">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
