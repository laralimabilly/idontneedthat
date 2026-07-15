// ViewTransition ships in the React canary bundled with Next.js
// (enabled via experimental.viewTransition in next.config.ts)
import { ViewTransition } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getSiteSettings } from "@/lib/actions/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader siteName={settings.site_name} />
      <ViewTransition>
        <main className="flex flex-1 flex-col">{children}</main>
      </ViewTransition>
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
