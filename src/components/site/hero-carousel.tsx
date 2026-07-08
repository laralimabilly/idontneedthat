"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";

type BannerRow = Database["public"]["Tables"]["hero_banners"]["Row"];

const THEME_STYLES: Record<
  string,
  { wash: string; chip: string; blob: string; accent: string }
> = {
  "neon-green": {
    wash: "from-neon-green/25 via-neon-green/10 to-transparent",
    chip: "bg-neon-green text-black",
    blob: "bg-neon-green/30",
    accent: "text-neon-green-dark",
  },
  "hot-pink": {
    wash: "from-hot-pink/25 via-hot-pink/10 to-transparent",
    chip: "bg-hot-pink text-black",
    blob: "bg-hot-pink/30",
    accent: "text-hot-pink",
  },
  "electric-blue": {
    wash: "from-electric-blue/25 via-electric-blue/10 to-transparent",
    chip: "bg-electric-blue text-black",
    blob: "bg-electric-blue/30",
    accent: "text-electric-blue",
  },
  "bright-yellow": {
    wash: "from-bright-yellow/40 via-bright-yellow/15 to-transparent",
    chip: "bg-bright-yellow text-black",
    blob: "bg-bright-yellow/40",
    accent: "text-yellow-600",
  },
  purple: {
    wash: "from-purple/25 via-purple/10 to-transparent",
    chip: "bg-purple text-white",
    blob: "bg-purple/30",
    accent: "text-purple",
  },
};

export function HeroCarousel({
  banners,
  siteDescription,
}: {
  banners: BannerRow[];
  siteDescription: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;

  const next = useCallback(
    () => setIndex((i) => (i + 1) % count),
    [count]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + count) % count),
    [count]
  );

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [count, paused, next]);

  if (count === 0) {
    return <FallbackHero siteDescription={siteDescription} />;
  }

  const banner = banners[index];
  const theme = THEME_STYLES[banner.theme] ?? THEME_STYLES["neon-green"];
  const ctaHref = banner.cta_url || "/products";
  const isExternal = ctaHref.startsWith("http");

  return (
    <section
      className="relative overflow-hidden border-b-2 border-foreground bg-dot-grid"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${theme.wash} transition-colors duration-700`}
      />
      <div
        className={`absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl ${theme.blob} transition-colors duration-700`}
      />
      <div
        className={`absolute -bottom-32 -left-16 h-72 w-72 rounded-full blur-3xl ${theme.blob} opacity-60 transition-colors duration-700`}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:py-20 md:grid-cols-[1.1fr_0.9fr]">
        {/* Copy */}
        <div key={banner.id} className="max-w-xl">
          {banner.badge && (
            <span
              className={`inline-flex -rotate-2 items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0_0_#1a1a1a] ${theme.chip}`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {banner.badge}
            </span>
          )}
          <h1 className="mt-4 font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              {banner.subtitle}
            </p>
          )}
          <div className="mt-7 flex items-center gap-4">
            {isExternal ? (
              <Button
                size="lg"
                className="rounded-full border-2 border-foreground bg-foreground text-background shadow-[4px_4px_0_0_rgba(104,247,11,1)] transition-transform hover:-translate-y-0.5 hover:bg-foreground"
                render={
                  <a href={ctaHref} target="_blank" rel="noopener noreferrer" />
                }
                nativeButton={false}
              >
                {banner.cta_label || "Check it out"}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="rounded-full border-2 border-foreground bg-foreground text-background shadow-[4px_4px_0_0_rgba(104,247,11,1)] transition-transform hover:-translate-y-0.5 hover:bg-foreground"
                render={<Link href={ctaHref} />}
                nativeButton={false}
              >
                {banner.cta_label || "Check it out"}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
            <span className={`hidden font-display text-sm font-bold sm:block ${theme.accent}`}>
              You definitely don&apos;t need this. ;)
            </span>
          </div>
        </div>

        {/* Visual */}
        <div className="relative hidden md:block">
          {banner.image_url ? (
            <div className="animate-float relative mx-auto w-full max-w-md [--float-rotate:2deg]">
              <img
                key={banner.image_url}
                src={banner.image_url}
                alt={banner.title}
                className="aspect-[4/3] w-full rotate-2 rounded-3xl border-2 border-foreground object-cover shadow-[8px_8px_0_0_#1a1a1a]"
              />
            </div>
          ) : (
            <div className="animate-float mx-auto flex aspect-[4/3] w-full max-w-md rotate-2 items-center justify-center rounded-3xl border-2 border-dashed border-foreground/30 text-7xl [--float-rotate:2deg]">
              🛒
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {count > 1 && (
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 pb-6">
          <div className="flex items-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to banner ${i + 1}`}
                className={`h-2.5 rounded-full border border-foreground transition-all ${
                  i === index ? "w-8 bg-foreground" : "w-2.5 bg-transparent hover:bg-foreground/30"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous banner"
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-foreground bg-background transition-transform hover:-translate-y-0.5"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next banner"
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-foreground bg-background transition-transform hover:-translate-y-0.5"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function FallbackHero({ siteDescription }: { siteDescription: string }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-foreground bg-dot-grid">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 via-transparent to-hot-pink/15" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-neon-green/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-electric-blue/25 blur-3xl" />

      <span className="animate-float absolute right-[12%] top-16 hidden text-5xl lg:block [--float-rotate:12deg]">
        🧲
      </span>
      <span className="animate-float absolute bottom-24 right-[28%] hidden text-4xl lg:block [--float-rotate:-8deg] [animation-delay:1.2s]">
        🛸
      </span>
      <span className="animate-float absolute right-[38%] top-24 hidden text-4xl lg:block [--float-rotate:6deg] [animation-delay:2s]">
        💸
      </span>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex -rotate-2 items-center gap-1.5 rounded-full bg-bright-yellow px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-black shadow-[3px_3px_0_0_#1a1a1a]">
            <Sparkles className="h-3.5 w-3.5" />
            Dangerously good finds
          </span>
          <h1 className="mt-5 font-display text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl">
            <span className="text-muted-foreground/70 line-through decoration-hot-pink decoration-4">
              I don&apos;t need that.
            </span>
            <br />
            <span className="relative inline-block">
              Except{" "}
              <span className="relative inline-block text-neon-green-dark">
                you do
                <svg
                  viewBox="0 0 200 12"
                  className="absolute -bottom-2 left-0 w-full"
                  aria-hidden
                >
                  <path
                    d="M2 8 Q 50 2 100 7 T 198 6"
                    fill="none"
                    stroke="#68f70b"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
            {siteDescription}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="rounded-full border-2 border-foreground bg-foreground text-background shadow-[4px_4px_0_0_rgba(104,247,11,1)] transition-transform hover:-translate-y-0.5 hover:bg-foreground"
              render={<Link href="/products" />}
              nativeButton={false}
            >
              Show me the goods
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <span className="font-display text-sm font-bold text-muted-foreground">
              Your wallet called. It&apos;s scared.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
