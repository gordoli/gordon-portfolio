import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export type NavTarget = 'about' | 'contact'

interface TopNavProps {
  onOpen: (target: NavTarget) => void
}

/** Local time in the given IANA zone, formatted like "5:29 PM PDT". */
function useZonedClock(timeZone: string) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone,
        timeZoneName: 'short',
      }).format(new Date())

    setLabel(format())
    const id = setInterval(() => setLabel(format()), 15_000)
    return () => clearInterval(id)
  }, [timeZone])

  return label
}

// Fixed width per item so the pill stays symmetric even though "Work" is
// shorter than "Contact" — keeps the whole nav visually centered.
const linkClass =
  'w-[92px] cursor-pointer rounded-full py-1.5 text-center font-mono text-[12px] tracking-[0.12em] text-ink/70 uppercase transition-colors outline-none hover:bg-black/[0.05] hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/20'

export function TopNav({ onOpen }: TopNavProps) {
  const clock = useZonedClock('America/Los_Angeles')
  const [menuOpen, setMenuOpen] = useState(false)

  const select = (target: NavTarget) => {
    setMenuOpen(false)
    onOpen(target)
  }

  return (
    <header className="fade-in pointer-events-none absolute inset-x-0 top-0 z-30 px-6 pt-6 sm:px-10 sm:pt-8">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 items-center sm:grid-cols-3">
        {/* Wordmark with online dot */}
        <span className="pointer-events-auto flex items-center gap-2 justify-self-start font-mono text-[11px] tracking-[0.18em] text-ink/80">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          GORDON&nbsp;LI
        </span>

        {/* Center pill (desktop) */}
        <nav className="glass pointer-events-auto hidden items-center justify-self-center rounded-full p-1.5 sm:flex">
          <a href="#work" className={linkClass}>
            Work
          </a>
          <button type="button" className={linkClass} onClick={() => onOpen('about')}>
            About
          </button>
          <button
            type="button"
            className={linkClass}
            onClick={() => onOpen('contact')}
          >
            Contact
          </button>
        </nav>

        {/* Right side: time (desktop) + hamburger (mobile) */}
        <div className="pointer-events-auto flex items-center justify-self-end">
          <span className="hidden font-mono text-[11px] tracking-[0.14em] text-ink/70 sm:block">
            SAN&nbsp;FRANCISCO,&nbsp;CA&nbsp;&nbsp;·&nbsp;&nbsp;{clock}
          </span>
          <button
            type="button"
            className="glass grid h-10 w-10 place-items-center rounded-full text-ink/80 sm:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              {menuOpen ? (
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <div
              className="pointer-events-auto fixed inset-0 z-40 sm:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              // Opacity stays 1 so the menu is always solid/readable; only
              // position + scale animate (never a translucent stuck state).
              className="pointer-events-auto absolute right-6 z-50 mt-3 flex w-52 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white p-2 shadow-[0_20px_50px_rgba(20,22,45,0.22)] sm:hidden"
              initial={{ y: -8, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -8, scale: 0.97 }}
              transition={{ duration: 0.16 }}
              style={{ transformOrigin: 'top right' }}
            >
              <a
                href="#work"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-left font-mono text-[13px] tracking-[0.1em] text-ink/80 uppercase hover:bg-black/[0.05]"
              >
                Work
              </a>
              <button
                type="button"
                onClick={() => select('about')}
                className="rounded-lg px-4 py-3 text-left font-mono text-[13px] tracking-[0.1em] text-ink/80 uppercase hover:bg-black/[0.05]"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => select('contact')}
                className="rounded-lg px-4 py-3 text-left font-mono text-[13px] tracking-[0.1em] text-ink/80 uppercase hover:bg-black/[0.05]"
              >
                Contact
              </button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
