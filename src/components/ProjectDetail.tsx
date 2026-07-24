import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '../data/projects'
import { ProjectCover } from './ProjectCover'

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

/**
 * Full-frame detail view. The cover shares a `layoutId` with the carousel card,
 * so opening/closing morphs the card into (and back out of) this view while the
 * surrounding text crossfades.
 */
export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-page/95 px-6 py-12 backdrop-blur-xl sm:px-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} — ${project.subheader}`}
    >
      <motion.div
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Morphing cover */}
        <motion.div
          layoutId={`card-${project.name}`}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] shadow-[0_28px_60px_rgba(35,40,70,0.24)]"
        >
          <ProjectCover project={project} />
        </motion.div>

        {/* Copy — revealed after the morph settles */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ delay: 0.16, duration: 0.3 }}
          className="px-1 pt-8"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-xl shadow-sm">
              {project.icon}
            </span>
            <h2 className="font-sans text-3xl font-semibold text-ink sm:text-4xl">
              {project.name}
            </h2>
            <span className="ml-auto font-mono text-[11px] tracking-widest text-mute">
              {project.year}
            </span>
          </div>

          <p className="mt-5 font-serif text-2xl leading-snug text-ink italic sm:text-[28px]">
            {project.subheader}
          </p>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/70">
            {project.details}
          </p>

          <a
            href={project.url}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-mono text-[12px] tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-85"
          >
            Visit project →
          </a>
        </motion.div>
      </motion.div>

      {/* Close */}
      <motion.button
        type="button"
        onClick={onClose}
        aria-label="Close project"
        className="glass fixed top-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full text-ink/70 transition-colors hover:text-ink"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.1 }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path
            d="m6 6 12 12M18 6 6 18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </motion.button>
    </motion.div>
  )
}
