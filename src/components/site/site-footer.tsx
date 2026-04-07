import Link from "next/link";

export function SiteFooter({
  siteName,
  siteDescription,
  footerText,
  socialTwitter,
  socialInstagram,
}: {
  siteName: string;
  siteDescription: string;
  footerText: string;
  socialTwitter: string;
  socialInstagram: string;
}) {
  const firstWord = siteName.split(" ").slice(0, 2).join(" ");
  const rest = siteName.split(" ").slice(2).join(" ");

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <Link href="/" className="font-display text-sm font-bold">
              <span className="text-neon-green">{firstWord}</span>{" "}
              {rest}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              {siteDescription}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 sm:items-end">
            {(socialTwitter || socialInstagram) && (
              <div className="flex items-center gap-3">
                {socialTwitter && (
                  <a
                    href={`https://x.com/${socialTwitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {socialTwitter}
                  </a>
                )}
                {socialInstagram && (
                  <a
                    href={`https://instagram.com/${socialInstagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {socialInstagram}
                  </a>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {footerText ||
                "This site contains affiliate links. We may earn a commission at no extra cost to you."}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
