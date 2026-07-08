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
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <div className="text-center sm:text-left">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="flex h-7 w-7 -rotate-3 items-center justify-center rounded-lg bg-neon-green font-display text-xs font-black text-black transition-transform group-hover:rotate-3">
                !?
              </span>
              <span className="font-display text-base font-black tracking-tight">
                <span className="text-neon-green">{firstWord}</span>{" "}
                {rest}
              </span>
            </Link>
            <p className="mt-2 max-w-xs text-xs text-background/60">
              {siteDescription}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-end">
            {(socialTwitter || socialInstagram) && (
              <div className="flex items-center gap-2">
                {socialTwitter && (
                  <a
                    href={`https://x.com/${socialTwitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-background/25 px-3 py-1 text-xs font-medium text-background/70 transition-colors hover:border-electric-blue hover:text-electric-blue"
                  >
                    {socialTwitter}
                  </a>
                )}
                {socialInstagram && (
                  <a
                    href={`https://instagram.com/${socialInstagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-background/25 px-3 py-1 text-xs font-medium text-background/70 transition-colors hover:border-hot-pink hover:text-hot-pink"
                  >
                    {socialInstagram}
                  </a>
                )}
              </div>
            )}
            <p className="max-w-sm text-center text-xs text-background/50 sm:text-right">
              {footerText ||
                "This site contains affiliate links. We may earn a commission at no extra cost to you."}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
