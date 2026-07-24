import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
} from './icons'

// Pixel-art portrait lives in /public; swap the file to change it.
const avatar = '/gordon.png'

type Side = 'left' | 'right'

interface Social {
  label: string
  href: string
  side: Side
  /** 1 = inner (nearest avatar), 2 = outer. */
  rank: 1 | 2
  Icon: (props: { className?: string }) => React.ReactElement
}

// Ordered outer→inner per side so the DOM reads L2 L1 [avatar] R1 R2.
const SOCIALS: Social[] = [
  { label: 'Instagram', href: 'https://instagram.com/gordonyli', side: 'left', rank: 2, Icon: InstagramIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/@gordonyli', side: 'left', rank: 1, Icon: TikTokIcon },
  { label: 'GitHub', href: 'https://github.com/gordoli', side: 'right', rank: 1, Icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gordonyli/', side: 'right', rank: 2, Icon: LinkedInIcon },
]

const INNER_OFFSET = 118
const OUTER_OFFSET = 220

// Mobile: a vertical column of icons to the left of the avatar.
const MOBILE_X = -112
const MOBILE_GAP = 66

interface Point {
  x: number
  y: number
}

function targetFor(social: Social, index: number, isMobile: boolean): Point {
  if (isMobile) {
    return { x: MOBILE_X, y: (index - (SOCIALS.length - 1) / 2) * MOBILE_GAP }
  }
  const distance = social.rank === 1 ? INNER_OFFSET : OUTER_OFFSET
  return { x: social.side === 'left' ? -distance : distance, y: 0 }
}

export function Hero() {
  // Intro: socials start fanned out, then collapse once the page has settled.
  const [open, setOpen] = useState(true)
  const [showWave, setShowWave] = useState(false)
  const discovered = useRef(false)
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 640px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    // Collapse the socials back onto the avatar after the entrance, then reveal
    // the wave hint that you can hover to fan them out again.
    const collapse = setTimeout(() => {
      if (!discovered.current) setOpen(false)
    }, 1900)
    const wave = setTimeout(() => setShowWave(true), 2350)
    return () => {
      clearTimeout(collapse)
      clearTimeout(wave)
    }
  }, [])

  const openSocials = () => {
    discovered.current = true
    setOpen(true)
  }

  const pillVariants: Variants = {
    closed: (t: Point) => ({
      x: reduceMotion ? t.x : 0,
      y: reduceMotion ? t.y : 0,
      opacity: 0,
      scale: 0.5,
    }),
    open: (t: Point) => ({
      x: t.x,
      y: t.y,
      opacity: 1,
      scale: 1,
    }),
  }

  return (
    <section className="relative z-10 flex min-h-[72vh] flex-col items-center justify-center px-6 pt-24 pb-[13vh]">
      {/* Avatar + orbiting socials */}
      <div
        className="fade-in relative flex h-[200px] items-center justify-center"
        style={{ animationDelay: '0.1s' }}
        onMouseEnter={openSocials}
        onMouseLeave={() => setOpen(false)}
        onFocusCapture={openSocials}
        onBlurCapture={(e) => {
          // Keep open while focus stays within the cluster (e.g. tabbing pills).
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
        }}
      >
        {/* Social pills - absolutely centered, fan out on open */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial="closed"
          animate={open ? 'open' : 'closed'}
          transition={{ staggerChildren: 0.05 }}
        >
          {SOCIALS.map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              custom={targetFor(social, i, isMobile)}
              variants={pillVariants}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="glass absolute grid h-[60px] w-[60px] place-items-center rounded-[20px] text-ink/85 transition-colors hover:text-ink sm:h-[92px] sm:w-[76px] sm:rounded-[28px]"
              style={{ zIndex: social.rank === 1 ? 2 : 1 }}
            >
              <social.Icon className="h-6 w-6" />
            </motion.a>
          ))}
        </motion.div>

        {/* Avatar - arch shape, sits above the pills */}
        <motion.div
          className="relative z-10"
          animate={{ scale: open ? 1.04 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Wave hint - hover me */}
          <AnimatePresence>
            {showWave && !open && !discovered.current && (
              <motion.span
                className="absolute -top-1 -right-2 z-20 grid h-9 w-9 place-items-center rounded-full text-lg shadow-[0_6px_16px_rgba(35,40,70,0.18)] backdrop-blur-md"
                style={{ background: 'rgba(255,255,255,0.9)' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                aria-hidden
              >
                <span className="wave-hand">👋</span>
              </motion.span>
            )}
          </AnimatePresence>
          <button
            type="button"
            aria-label="Show social links"
            aria-expanded={open}
            onClick={() => {
              discovered.current = true
              setOpen((v) => !v)
            }}
            className="block h-[172px] w-[153px] cursor-pointer overflow-hidden rounded-t-[76px] rounded-b-[38px] bg-white shadow-[0_18px_40px_rgba(35,40,70,0.18)]"
          >
            <img
              src={avatar}
              alt="Portrait of Gordon Li"
              className="h-full w-full object-cover object-top [image-rendering:pixelated]"
              draggable={false}
            />
          </button>
        </motion.div>
      </div>

      {/* Headline: sans → serif italic. Sized against both width and height
          so it always fits inside the single-viewport frame. */}
      <h1
        className="fade-in mt-6 text-center leading-[0.94] font-medium tracking-[-0.02em]"
        style={{ animationDelay: '0.19s' }}
      >
        <span className="block text-[min(8vw,10vh)] text-ink">Hey there,</span>
        <span className="mt-3 block font-serif text-[min(9.5vw,12vh)] italic sm:mt-4">
          I'm Gordon
        </span>
      </h1>

      {/* Small divider between the hero and the work below */}
      <span
        className="fade-in mt-11 block h-px w-12 bg-ink/20"
        style={{ animationDelay: '0.28s' }}
        aria-hidden
      />
    </section>
  )
}
