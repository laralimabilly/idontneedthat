/**
 * Hand-drawn SVG accents matching the logo: spark bursts, ink splats,
 * and brush-stroke underlines. Color via `currentColor` — set a text-*
 * class on the component.
 */

export function Sparks({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden fill="none">
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <path d="M20 5 L20 14" />
        <path d="M7 13 L13 19" />
        <path d="M33 13 L27 19" />
      </g>
    </svg>
  );
}

export function InkSplat({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <ellipse cx="46" cy="50" rx="26" ry="21" />
      <ellipse cx="66" cy="37" rx="12" ry="10" transform="rotate(18 66 37)" />
      <ellipse cx="29" cy="35" rx="9" ry="7" transform="rotate(-24 29 35)" />
      <ellipse cx="63" cy="67" rx="11" ry="8" transform="rotate(-12 63 67)" />
      <ellipse cx="28" cy="66" rx="7" ry="6" />
      <circle cx="85" cy="28" r="4" />
      <circle cx="80" cy="80" r="5" />
      <circle cx="12" cy="76" r="3.5" />
      <circle cx="90" cy="56" r="2.5" />
      <circle cx="16" cy="24" r="3" />
    </svg>
  );
}

export function BrushUnderline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 16"
      className={className}
      aria-hidden
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M4 10 C 40 4 85 13 125 8 C 155 4 180 10 196 7"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M14 13 C 60 9 110 14 186 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
