"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InkSplat, Sparks } from "@/components/site/doodles";
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

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = setInterval(next, 10000);
    return () => clearInterval(timer);
  }, [count, paused, next]);

  if (count === 0) {
    return <FallbackHero siteDescription={siteDescription} />;
  }

  const theme = THEME_STYLES[banners[index].theme] ?? THEME_STYLES["neon-green"];

  return (
    <section
      className="relative flex min-h-[90dvh] flex-col justify-center overflow-hidden border-b-2 border-foreground bg-dot-grid"
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

      {/* Slides stacked in one grid cell, crossfading */}
      <div className="relative mx-auto grid w-full max-w-6xl px-4 py-14 sm:py-20">
        {banners.map((slide, i) => {
          const slideTheme =
            THEME_STYLES[slide.theme] ?? THEME_STYLES["neon-green"];
          const ctaHref = slide.cta_url || "/products";
          const isExternal = ctaHref.startsWith("http");
          const active = i === index;

          return (
            <div
              key={slide.id}
              aria-hidden={!active}
              inert={!active}
              className={`col-start-1 row-start-1 grid items-center gap-8 transition-opacity duration-700 ease-in-out md:grid-cols-[1.1fr_0.9fr] ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {/* Copy */}
              <div className="max-w-xl">
                {slide.badge && (
                  <span
                    className={`inline-flex -rotate-2 items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0_0_#1a1a1a] ${slideTheme.chip}`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {slide.badge}
                  </span>
                )}
                <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                  {slide.title}
                  <span className={slideTheme.accent}>*</span>
                </h1>
                {slide.subtitle && (
                  <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                    {slide.subtitle}
                  </p>
                )}
                <div className="mt-7 flex items-center gap-4">
                  <Button
                    size="lg"
                    className="rounded-full border-2 border-foreground bg-foreground text-background shadow-[4px_4px_0_0_rgba(104,247,11,1)] transition-transform hover:-translate-y-0.5"
                    render={
                      isExternal ? (
                        <a
                          href={ctaHref}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ) : (
                        <Link href={ctaHref} />
                      )
                    }
                    nativeButton={false}
                  >
                    {slide.cta_label || "Check it out"}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                  <span
                    className={`hidden font-display text-sm font-bold sm:block ${slideTheme.accent}`}
                  >
                    You definitely don&apos;t need this. ;)
                  </span>
                </div>
              </div>

              {/* Visual */}
              <div className="relative hidden md:block">
                {slide.image_url ? (
                  <div className="animate-float relative mx-auto w-full max-w-md [--float-rotate:2deg]">
                    <img
                      src={slide.image_url}
                      alt={slide.title}
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
          );
        })}
      </div>

      {/* Dots connected by a thin line */}
      {count > 1 && (
        <div className="relative mx-auto flex w-full max-w-6xl items-center px-4 pb-6">
          <div className="relative flex items-center gap-3">
            <span
              aria-hidden
              className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-foreground/30"
            />
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to banner ${i + 1}`}
                className={`relative h-2.5 rounded-full border border-foreground transition-all ${
                  i === index
                    ? "w-8 bg-foreground"
                    : "w-2.5 bg-background hover:bg-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function FallbackHero({ siteDescription }: { siteDescription: string }) {
  // The "*except you do" pill already says it — skip a duplicate description
  const description = /except you do/i.test(siteDescription)
    ? ""
    : siteDescription;

  return (
    <section className="relative flex min-h-[90dvh] flex-col justify-center overflow-hidden border-b-2 border-foreground bg-dot-grid">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 via-transparent to-hot-pink/15" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-neon-green/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-electric-blue/25 blur-3xl" />

      {/* Ink splats + logo cast */}
      <InkSplat className="absolute -left-6 top-10 hidden h-24 w-24 -rotate-12 text-neon-green/50 lg:block" />
      <InkSplat className="absolute bottom-8 right-[8%] hidden h-16 w-16 rotate-45 text-hot-pink/40 lg:block" />
      <span className="animate-float absolute right-[12%] top-16 hidden text-5xl lg:block [--float-rotate:12deg]">
        🌵
      </span>
      <span className="animate-float absolute bottom-24 right-[30%] hidden text-4xl lg:block [--float-rotate:-8deg] [animation-delay:1.2s]">
        🐔
      </span>
      <span className="animate-float absolute right-[38%] top-24 hidden text-4xl lg:block [--float-rotate:6deg] [animation-delay:2s]">
        🛒
      </span>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex -rotate-2 items-center gap-1.5 rounded-full bg-bright-yellow px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-black shadow-[3px_3px_0_0_#1a1a1a]">
            <Sparkles className="h-3.5 w-3.5" />
            Dangerously good finds
          </span>
          <h1 className="relative mt-5 font-heading text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
            I don&apos;t{" "}
            <span className="text-neon-green-dark">need</span> that
            <span className="relative inline-block text-hot-pink">
              *
              <Sparks className="absolute -right-8 -top-4 h-7 w-7 rotate-45 text-neon-green sm:-right-10 sm:h-9 sm:w-9" />
            </span>
          </h1>
          <p className="mt-5 font-heading text-sm font-bold uppercase tracking-[0.25em] text-foreground/80 sm:text-base">
            Weird<span className="text-neon-green-dark">.</span> Useful
            <span className="text-hot-pink">.</span> Funny
            <span className="text-electric-blue">.</span>
          </p>
          <span className="mt-4 inline-block -rotate-1 rounded-full bg-neon-green px-5 py-1.5 font-heading text-lg font-extrabold uppercase tracking-wider text-black shadow-[3px_3px_0_0_#1a1a1a] sm:text-xl">
            *Except you do
          </span>
          {description && (
            <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="rounded-full border-2 border-foreground bg-foreground font-heading font-bold text-background shadow-[4px_4px_0_0_rgba(104,247,11,1)] transition-transform hover:-translate-y-0.5"
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
