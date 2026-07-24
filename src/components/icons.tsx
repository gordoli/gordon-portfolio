import type { SVGProps } from 'react'

/**
 * Monoline social glyphs sized to a 24px box, inheriting `currentColor`.
 * Kept intentionally simple so they read cleanly inside the glass pills.
 */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M13.5 3v10.9a3.1 3.1 0 1 1-2.4-3.02"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 3.4c.5 2.3 2 3.9 4.4 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.66-.21.66-.47v-1.8c-2.72.59-3.3-1.16-3.3-1.16-.44-1.13-1.08-1.43-1.08-1.43-.9-.6.07-.6.07-.6.98.07 1.5 1.01 1.5 1.01.87 1.5 2.29 1.06 2.85.81.09-.63.34-1.06.62-1.3-2.17-.25-4.45-1.09-4.45-4.84 0-1.07.38-1.94 1.01-2.62-.1-.25-.44-1.25.1-2.6 0 0 .83-.27 2.7 1a9.3 9.3 0 0 1 4.92 0c1.87-1.27 2.7-1 2.7-1 .54 1.35.2 2.35.1 2.6.63.68 1.01 1.55 1.01 2.62 0 3.76-2.29 4.58-4.47 4.83.35.3.66.9.66 1.82v2.7c0 .26.16.58.67.47A9.8 9.8 0 0 0 12 2.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7 10.2V17M7 7.4v.02M11 17v-3.5a2 2 0 0 1 4 0V17M11 10.4V17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
