import { useRef, useState, type PointerEvent } from 'react'
import { motion } from 'framer-motion'
import { projects, type Project } from '../data/projects'
import { ProjectCover } from './ProjectCover'

interface ProjectCarouselProps {
  onSelect: (project: Project) => void
  /** Name of the currently expanded project — hidden here to avoid a ghost. */
  selectedName: string | null
}

interface ProjectCardProps {
  project: Project
  hidden: boolean
  onSelect: (project: Project) => void
}

function ProjectCard({ project, hidden, onSelect }: ProjectCardProps) {
  return (
    <motion.article
      layoutId={`card-${project.name}`}
      onClick={() => onSelect(project)}
      className="relative aspect-[4/3] w-[300px] shrink-0 cursor-pointer overflow-hidden rounded-[22px] shadow-[0_16px_36px_rgba(35,40,70,0.16)] select-none sm:w-[380px]"
      // Keep it in the layout but invisible while its detail view is open.
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Inner wrapper handles hover zoom so it doesn't fight layout transforms */}
      <motion.div
        className="pointer-events-none h-full w-full"
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <ProjectCover project={project} />
      </motion.div>
    </motion.article>
  )
}

export function ProjectCarousel({ onSelect, selectedName }: ProjectCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [grabbing, setGrabbing] = useState(false)
  // Tracks a mouse drag so releasing after a drag doesn't open a project.
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // Touch/pen use native momentum scrolling; only hijack the mouse.
    if (e.pointerType !== 'mouse' || !trackRef.current) return
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: trackRef.current.scrollLeft,
      moved: false,
    }
    setGrabbing(true)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !trackRef.current) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    trackRef.current.scrollLeft = drag.current.startLeft - dx
  }

  const endDrag = () => {
    drag.current.active = false
    setGrabbing(false)
  }

  const handleSelect = (project: Project) => {
    if (drag.current.moved) {
      drag.current.moved = false
      return
    }
    onSelect(project)
  }

  return (
    // Normal-flow section directly below the hero; scroll down to reach it.
    <section id="work" className="relative z-20 w-full scroll-mt-24 pb-20">
      {/* Drag hint above the cards */}
      <div className="pointer-events-none mb-6 flex justify-center">
        <span className="glass rounded-full px-5 py-2 font-mono text-[11px] tracking-[0.22em] text-ink/70 uppercase">
          ← Drag me →
        </span>
      </div>

      <div
        ref={trackRef}
        className={`no-scrollbar flex gap-6 overflow-x-auto px-[max(2rem,calc((100vw-1440px)/2))] pt-2 pb-6 ${
          grabbing ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            hidden={selectedName === project.name}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </section>
  )
}
