import { useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import type { EmblaCarouselType, EmblaEventType } from 'embla-carousel'
import { projects, type Project } from '../data/projects'
import { ProjectCover } from './ProjectCover'

const TWEEN_FACTOR_BASE = 0.46
const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max)

interface ProjectCarouselProps {
  onSelect: (project: Project) => void
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
      className="relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-[22px] shadow-[0_16px_36px_rgba(35,40,70,0.16)] select-none"
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="pointer-events-none h-full w-full"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <ProjectCover project={project} />
      </motion.div>
    </motion.article>
  )
}

export function ProjectCarousel({ onSelect, selectedName }: ProjectCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
    AutoScroll({
      playOnInit: true,
      speed: 0.8,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  ])

  const tweenFactor = useRef(0)
  const tweenNodes = useRef<HTMLElement[]>([])
  // Distinguish a drag from a click so panning the rail doesn't open a project.
  const pointerDownX = useRef(0)
  const dragged = useRef(false)

  const setTweenNodes = useCallback((api: EmblaCarouselType) => {
    tweenNodes.current = api
      .slideNodes()
      .map((slide) => slide.querySelector('.embla-slide-inner') as HTMLElement)
  }, [])

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length
  }, [])

  // Dim slides by distance from center — brightest in the middle (Embla opacity example).
  const tweenOpacity = useCallback(
    (api: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = api.internalEngine()
      const scrollProgress = api.scrollProgress()
      const slidesInView = api.slidesInView()
      const isScroll = eventName === 'scroll'

      api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress
        const slidesInSnap = engine.slideRegistry[snapIndex]

        slidesInSnap.forEach((slideIndex) => {
          if (isScroll && !slidesInView.includes(slideIndex)) return

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target()
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target)
                if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
                if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            })
          }

          const tween = 1 - Math.abs(diffToTarget * tweenFactor.current)
          const node = tweenNodes.current[slideIndex]
          if (node) node.style.opacity = clamp(tween, 0.28, 1).toString()
        })
      })
    },
    [],
  )

  useEffect(() => {
    if (!emblaApi) return
    setTweenNodes(emblaApi)
    setTweenFactor(emblaApi)
    tweenOpacity(emblaApi)
    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenOpacity)
      .on('scroll', tweenOpacity)
      .on('slideFocus', tweenOpacity)
  }, [emblaApi, setTweenNodes, setTweenFactor, tweenOpacity])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const handleSelect = (project: Project) => {
    if (dragged.current) return
    onSelect(project)
  }

  return (
    <section
      id="work"
      className="fade-in relative z-20 w-full scroll-mt-24 pt-2 pb-20"
      style={{ animationDelay: '0.5s' }}
    >
      <div
        className="embla-mask overflow-hidden"
        ref={emblaRef}
        onPointerDownCapture={(e) => {
          pointerDownX.current = e.clientX
          dragged.current = false
        }}
        onPointerUpCapture={(e) => {
          if (Math.abs(e.clientX - pointerDownX.current) > 6) dragged.current = true
        }}
      >
        <div className="flex">
          {projects.map((project) => (
            <div
              key={project.name}
              className="min-w-0 flex-[0_0_82%] px-3 sm:flex-[0_0_50%] lg:flex-[0_0_34%]"
            >
              <div className="embla-slide-inner">
                <ProjectCard
                  project={project}
                  hidden={selectedName === project.name}
                  onSelect={handleSelect}
                />
                {/* Caption: project name + gray website */}
                <div className="mt-4 px-1">
                  <h3 className="font-sans text-[17px] font-semibold text-ink">
                    {project.name}
                  </h3>
                  <p className="mt-0.5 font-mono text-[12px] tracking-[0.02em] text-mute">
                    {project.website}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / next controls */}
      <div className="mt-9 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous projects"
          className="glass grid h-12 w-12 place-items-center rounded-full text-ink/70 transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next projects"
          className="glass grid h-12 w-12 place-items-center rounded-full text-ink/70 transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path d="m10 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  )
}
