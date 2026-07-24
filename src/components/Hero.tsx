import { useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
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

function offsetFor(social: Social) {
  const distance = social.rank === 1 ? INNER_OFFSET : OUTER_OFFSET
  return social.side === 'left' ? -distance : distance
}

export function Hero() {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  const pillVariants: Variants = {
    closed: (x: number) => ({
      x: reduceMotion ? x : 0,
      opacity: 0,
      scale: 0.5,
    }),
    open: (x: number) => ({
      x,
      opacity: 1,
      scale: 1,
    }),
  }

  return (
    <section className="relative z-10 flex flex-1 flex-col items-center justify-center pt-24 pb-[240px]">
      {/* Avatar + orbiting socials */}
      <div
        className="relative flex h-[176px] items-center justify-center"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={(e) => {
          // Keep open while focus stays within the cluster (e.g. tabbing pills).
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
        }}
      >
        {/* Social pills — absolutely centered, fan out on open */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial="closed"
          animate={open ? 'open' : 'closed'}
          transition={{ staggerChildren: 0.05 }}
        >
          {SOCIALS.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              custom={offsetFor(social)}
              variants={pillVariants}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="glass absolute grid h-[92px] w-[76px] place-items-center rounded-[28px] text-ink/85 transition-colors hover:text-ink"
              style={{ zIndex: social.rank === 1 ? 2 : 1 }}
            >
              <social.Icon className="h-6 w-6" />
            </motion.a>
          ))}
        </motion.div>

        {/* Avatar — arch shape, sits above the pills */}
        <motion.div
          className="relative z-10"
          animate={{ scale: open ? 1.04 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <button
            type="button"
            aria-label="Show social links"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="block h-[150px] w-[134px] cursor-pointer overflow-hidden rounded-t-[67px] rounded-b-[32px] bg-white shadow-[0_18px_40px_rgba(35,40,70,0.18)]"
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
      <h1 className="mt-8 text-center leading-[0.94] font-medium tracking-[-0.02em]">
        <span className="block text-[min(8vw,10vh)] text-ink">Hey there,</span>
        <span className="mt-3 block font-serif text-[min(9.5vw,12vh)] italic sm:mt-4">
          I'm Gordon
        </span>
      </h1>

      {/* Name + contact */}
      <p className="mt-8 font-sans text-lg font-medium text-ink">Gordon Li</p>
      <a
        href="mailto:gordonyli@gmail.com"
        className="mt-1 font-mono text-[12px] tracking-[0.1em] text-mute transition-colors hover:text-ink"
      >
        gordonyli@gmail.com
      </a>
    </section>
  )
}
