import data from './projects.json'

export interface Project {
  name: string
  /** One-line tagline shown in the carousel + detail header. */
  subheader: string
  /** Long-form copy — hidden in the carousel, revealed in the detail view. */
  details: string
  year: string
  /** Optional cover art (in /public/projects). Falls back to `gradient`. */
  cover?: string
  /** Two-stop gradient for the filler card when there's no cover. */
  gradient: string[]
  url: string
}

export const projects: Project[] = data
