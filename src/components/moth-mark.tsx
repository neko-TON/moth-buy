import { cn } from "@/lib/utils";

/**
 * The MOTH mark.
 *
 * Drawn as four solid shapes per side — forewing, hindwing, body, antenna comb —
 * with a constant-width gap holding the forewing off the hindwing. That gap is
 * doing real work: a filled symmetrical insect with no internal counter-shape
 * reads as a generic bug pictogram, and the notch is what the eye remembers.
 *
 * The comb-toothed antennae are the one feature that unambiguously says *moth*
 * rather than butterfly, bee, or wasp. They are also the first thing to turn to
 * mud, so `simplified` swaps them for solid wedges and fattens every stroke —
 * that variant is what feeds the 16/32px favicons.
 *
 * Fill is `currentColor`, so the mark inherits: gold on the dark page, and
 * `text-accent-ink` when it sits on the lit plate in the hero.
 */
export function MothMark({
  className,
  simplified = false,
  title,
}: {
  className?: string;
  simplified?: boolean;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      fill="currentColor"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      {simplified ? (
        <g>
          <path d="M32 13c3 0 4.6 3 5 7.4.5 5.6.1 11.6-.6 18.6-.6 7-1.4 12.5-2.2 16-.5 2.3-1.4 3.6-2.2 3.6s-1.7-1.3-2.2-3.6c-.8-3.5-1.6-9-2.2-16-.7-7-1.1-13-.6-18.6.4-4.4 2-7.4 5-7.4Z" />
          <path d="M33.6 19.5c9.4 1.7 21 9.3 28.6 18.5 1.8 2.2.6 5-3.2 6.1-7.6 2.2-15.5 1.3-20.4-1.8-2.9-2.3-4.7-11.3-5-23.2Z" />
          <path d="M30.4 19.5C21 21.2 9.4 28.8 1.8 38c-1.8 2.2-.6 5 3.2 6.1 7.6 2.2 15.5 1.3 20.4-1.8 2.9-2.3 4.7-11.3 5-23.2Z" />
          <path d="M34 37.4c5.6 2.4 12 7.4 15.4 12.4 1.6 2.4.4 4.5-3 4.8-4.5.2-8.8-1.6-11.1-4.6-1-1.6-1.4-6.9-1.3-12.6Z" />
          <path d="M30 37.4c-5.6 2.4-12 7.4-15.4 12.4-1.6 2.4-.4 4.5 3 4.8 4.5.2 8.8-1.6 11.1-4.6 1-1.6 1.4-6.9 1.3-12.6Z" />
          <path d="m33.4 15 14.6-9-4 7.2-2.6 2.4-3.4.8Z" />
          <path d="m30.6 15-14.6-9 4 7.2 2.6 2.4 3.4.8Z" />
        </g>
      ) : (
        <g>
          <path d="M32 14.4c2.4 0 3.7 2.6 4 6.2.4 4.6.1 9.6-.5 15.6-.5 6-1.1 11.4-1.8 15.1-.4 2.2-1.1 3.4-1.7 3.4s-1.3-1.2-1.7-3.4c-.7-3.7-1.3-9.1-1.8-15.1-.6-6-.9-11-.5-15.6.3-3.6 1.6-6.2 4-6.2Z" />
          <path d="M33.3 20c8.3 1.5 18.6 8.3 25.6 16.5 1.8 2.1.8 4.6-2.6 5.6-6.7 2-13.7 1.2-18-1.6-2.6-2-4.2-10.1-5-20.5Z" />
          <path d="M30.7 20c-8.3 1.5-18.6 8.3-25.6 16.5-1.8 2.1-.8 4.6 2.6 5.6 6.7 2 13.7 1.2 18-1.6 2.6-2 4.2-10.1 5-20.5Z" />
          <path d="M33.7 36.6c4.9 2.1 10.6 6.5 13.6 10.9 1.4 2.1.4 4-2.6 4.2-4 .2-7.8-1.4-9.8-4-.9-1.4-1.3-6.1-1.2-11.1Z" />
          <path d="M30.3 36.6c-4.9 2.1-10.6 6.5-13.6 10.9-1.4 2.1-.4 4 2.6 4.2 4 .2 7.8-1.4 9.8-4 .9-1.4 1.3-6.1 1.2-11.1Z" />
          <path d="m32.6 16.2 14.2-7.6-.9 3.2-1.3.1v2.6l-1.8-.7.3 2.9-2.2-1.4.2 2.9-2.3-1.7.2 2.9-2.4-1.8-1.6 1.9Z" />
          <path d="m31.4 16.2-14.2-7.6.9 3.2 1.3.1v2.6l1.8-.7-.3 2.9 2.2-1.4-.2 2.9 2.3-1.7-.2 2.9 2.4-1.8 1.6 1.9Z" />
        </g>
      )}
    </svg>
  );
}
