import type { CSSProperties } from "react";
import Link from "next/link";
import { Sparks, InkSplat } from "@/components/site/doodles";

/* Hand-drawn squiggle, periodic every 720u so the marquee loops seamlessly */
const WAVE_CURVES =
  "C 45 12, 90 12, 135 50 C 172 82, 209 82, 246 50 C 272 28, 298 28, 324 50 C 360 88, 396 88, 432 50 C 470 8, 508 8, 546 50 C 580 76, 614 76, 648 50 C 672 36, 696 36, 720 50 C 765 12, 810 12, 855 50 C 892 82, 929 82, 966 50 C 992 28, 1018 28, 1044 50 C 1080 88, 1116 88, 1152 50 C 1190 8, 1228 8, 1266 50 C 1300 76, 1334 76, 1368 50 C 1392 36, 1416 36, 1440 50";
const WAVE = `M0 50 ${WAVE_CURVES}`;
/* Everything above the squiggle, filled — dark side of the divider */
const WAVE_FILL = `M0 0 L0 50 ${WAVE_CURVES} L1440 0 Z`;

function SquiggleDivider() {
  return (
    <div aria-hidden className="overflow-hidden">
      <div
        className="flex w-[200%] animate-marquee motion-reduce:animate-none"
        style={{ animationDuration: "18s" }}
      >
        {[0, 1].map((i) => (
          <svg
            key={i}
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="block h-16 w-1/2 shrink-0 sm:h-20"
            fill="none"
          >
            <path d={WAVE_FILL} fill="var(--foreground)" />
            <g strokeLinecap="round">
              <path
                d={WAVE}
                stroke="var(--color-neon-green)"
                strokeWidth="13"
              />
              <path
                d={WAVE}
                stroke="var(--color-hot-pink)"
                strokeWidth="4"
                transform="translate(0,27)"
              />
            </g>
          </svg>
        ))}
      </div>
    </div>
  );
}

function FloatingDoodle({
  children,
  className,
  rotate,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  rotate: string;
  delay: string;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute select-none animate-float motion-reduce:animate-none ${className}`}
      style={
        { "--float-rotate": rotate, animationDelay: delay } as CSSProperties
      }
    >
      {children}
    </span>
  );
}

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
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-surface">
      <SquiggleDivider />

      <div className="bg-dot-grid relative">
        {/* Floating doodles */}
        <FloatingDoodle
          className="left-[6%] top-14 font-heading text-6xl text-neon-green"
          rotate="-14deg"
          delay="0s"
        >
          *
        </FloatingDoodle>
        <FloatingDoodle
          className="right-[8%] top-24 font-heading text-4xl text-purple"
          rotate="18deg"
          delay="1.2s"
        >
          *
        </FloatingDoodle>
        <FloatingDoodle
          className="bottom-16 left-[12%] hidden font-heading text-5xl text-hot-pink sm:block"
          rotate="10deg"
          delay="0.6s"
        >
          *
        </FloatingDoodle>
        <FloatingDoodle
          className="bottom-24 right-[13%] hidden sm:block"
          rotate="-8deg"
          delay="1.8s"
        >
          <InkSplat className="h-16 w-16 text-bright-yellow" />
        </FloatingDoodle>

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-16 sm:py-20">
          {/* The star of the show */}
          <Link href="/" className="group relative inline-block">
            <Sparks className="absolute -left-12 top-4 h-10 w-10 -rotate-[24deg] text-hot-pink transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-[40deg]" />
            <Sparks className="absolute -right-12 top-4 h-10 w-10 rotate-[24deg] text-electric-blue transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[40deg]" />
            <img
              src="/logo-full.svg"
              alt={siteName}
              className="h-44 w-auto transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-[1.04] motion-reduce:transform-none sm:h-56"
            />
          </Link>

          <p className="mt-6 max-w-md text-center text-sm text-muted-foreground">
            {siteDescription}
          </p>

          {/* Sticker nav */}
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="-rotate-2 rounded-full border-2 border-foreground bg-bright-yellow px-4 py-1.5 font-display text-sm font-bold text-black shadow-[3px_3px_0_0_#1a1a1a] transition-transform hover:-translate-y-1 hover:rotate-0"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="rotate-1 rounded-full border-2 border-foreground bg-neon-green px-4 py-1.5 font-display text-sm font-bold text-black shadow-[3px_3px_0_0_#1a1a1a] transition-transform hover:-translate-y-1 hover:rotate-0"
            >
              All Products
            </Link>
            {socialTwitter && (
              <a
                href={`https://x.com/${socialTwitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rotate-2 rounded-full border-2 border-foreground bg-electric-blue px-4 py-1.5 font-display text-sm font-bold text-black shadow-[3px_3px_0_0_#1a1a1a] transition-transform hover:-translate-y-1 hover:rotate-0"
              >
                {socialTwitter}
              </a>
            )}
            {socialInstagram && (
              <a
                href={`https://instagram.com/${socialInstagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="-rotate-1 rounded-full border-2 border-foreground bg-hot-pink px-4 py-1.5 font-display text-sm font-bold text-black shadow-[3px_3px_0_0_#1a1a1a] transition-transform hover:-translate-y-1 hover:rotate-0"
              >
                {socialInstagram}
              </a>
            )}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t-2 border-foreground bg-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-background/70">
            © {year} {siteName} — you didn&apos;t need this footer either
            <span className="text-neon-green">*</span>
          </p>
          <p className="max-w-sm text-xs text-background/50 sm:text-right">
            {footerText ||
              "This site contains affiliate links. We may earn a commission at no extra cost to you."}
          </p>
        </div>
      </div>
    </footer>
  );
}
