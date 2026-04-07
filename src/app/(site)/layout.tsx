import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getActiveCategories } from "@/lib/actions/public";
import { getSiteSettings } from "@/lib/actions/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, settings] = await Promise.all([
    getActiveCategories(),
    getSiteSettings(),
  ]);

  return (
    <>
      <SiteHeader categories={categories} siteName={settings.site_name} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        siteName={settings.site_name}
        siteDescription={settings.site_description}
        footerText={settings.footer_text}
        socialTwitter={settings.social_twitter}
        socialInstagram={settings.social_instagram}
      />
      <Toaster />
    </>
  );
}
