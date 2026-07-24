import type { Project } from '../data/projects'

/**
 * The visual for a project — real cover art when present, otherwise a labelled
 * gradient placeholder. Shared by the carousel card and the expanded detail
 * view so the two morph seamlessly under a shared `layoutId`.
 */
export function ProjectCover({ project }: { project: Project }) {
  if (project.cover) {
    return (
      <img
        src={project.cover}
        alt={project.name}
        className="h-full w-full object-cover"
        draggable={false}
      />
    )
  }

  const [from, to] = project.gradient
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
    >
      <span className="font-serif text-4xl text-white/95 italic drop-shadow-sm sm:text-5xl">
        {project.name}
      </span>
    </div>
  )
}
