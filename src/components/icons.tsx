import type { SVGProps } from "react";

/**
 * Brand marks extracted from the source site.
 *
 * The source rendered these through Iconify CSS masks (`i-simple-icons:*`).
 * lucide-react v1 dropped brand icons entirely — including `Github` — so all
 * four live here as plain SVG components. Paths are verbatim from the origin.
 *
 * Every other icon on the page maps 1:1 onto lucide-react.
 */

export function GitBookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.513 1.097c-.645 0-1.233.34-2.407 1.017L3.675 5.82A7.23 7.23 0 0 0 0 12.063v.236a7.23 7.23 0 0 0 3.667 6.238L7.69 20.86c2.354 1.36 3.531 2.042 4.824 2.042c1.292.001 2.47-.678 4.825-2.038l4.251-2.453c1.177-.68 1.764-1.02 2.087-1.579c.323-.56.324-1.24.323-2.6v-2.63a1.04 1.04 0 0 0-1.558-.903l-8.728 5.024c-.587.337-.88.507-1.201.507c-.323 0-.616-.168-1.204-.506l-5.904-3.393c-.297-.171-.446-.256-.565-.271a.6.6 0 0 0-.634.368c-.045.111-.045.282-.043.625c.002.252 0 .378.025.494c.053.259.189.493.387.667c.089.077.198.14.416.266l6.315 3.65c.589.34.884.51 1.207.51s.617-.17 1.206-.509l7.74-4.469c.202-.116.302-.172.377-.13c.075.044.075.16.075.392v1.193c0 .34.001.51-.08.649c-.08.14-.227.224-.522.394l-6.382 3.685c-1.178.68-1.767 1.02-2.413 1.02s-1.236-.34-2.412-1.022l-5.97-3.452l-.043-.025a4.1 4.1 0 0 1-2.031-3.52V11.7a2.25 2.25 0 0 1 1.12-1.944a1.98 1.98 0 0 1 1.982-.001l4.946 2.858c1.174.679 1.762 1.019 2.407 1.02c.645 0 1.233-.34 2.41-1.017l7.482-4.306a1.091 1.091 0 0 0 0-1.891L14.92 2.11c-1.175-.675-1.762-1.013-2.406-1.013Z" />
    </svg>
  );
}

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14.234 10.162L22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299l-.929-1.329L3.076 1.56h3.182l5.965 8.532l.929 1.329l7.754 11.09h-3.182z" />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.5.5 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024q-.159.037-5.061 3.345q-.72.495-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789q.04-.324.893-.663q5.247-2.286 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635" />
    </svg>
  );
}
