import { BannersManager } from "@/components/admin/banners-manager";
import { getBanners } from "@/lib/actions/banners";

export default async function BannersPage() {
  const banners = await getBanners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Hero Banners</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {banners.length} banner{banners.length !== 1 ? "s" : ""} — shown in
            the homepage hero carousel
          </p>
        </div>
      </div>

      <BannersManager banners={banners} />
    </div>
  );
}
