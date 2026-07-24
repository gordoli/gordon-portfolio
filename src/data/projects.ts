import data from './projects.json'

export interface Project {
  name: string
  /** One-line tagline shown in the detail view. */
  subheader: string
  /** Long-form copy, hidden in the carousel, revealed in the detail view. */
  details: string
  /** Display label shown in gray under the card (usually the domain). May be empty. */
  website: string
  /** Optional status pill shown on the card, e.g. "Acquired". */
  badge?: string
  /** Optional cover art (in /public/projects). Falls back to `gradient`. */
  cover?: string
  /** Two-stop gradient for the filler card when there's no cover. */
  gradient: string[]
  /** Full href for the "Visit project" button. Empty means no live site. */
  url: string
}

export const projects: Project[] = data
