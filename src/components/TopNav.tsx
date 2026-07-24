import { useEffect, useState } from 'react'

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

const linkClass =
  'cursor-pointer rounded-full px-4 py-1.5 font-mono text-[12px] tracking-[0.12em] text-ink/70 uppercase transition-colors outline-none hover:bg-black/[0.05] hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/20'

export function TopNav({ onOpen }: TopNavProps) {
  const clock = useZonedClock('America/Los_Angeles')

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 px-6 pt-6 sm:px-10 sm:pt-8">
      {/* 3-col grid keeps the nav pill perfectly centered regardless of side widths */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-3 items-center">
        {/* Wordmark with online dot */}
        <span className="pointer-events-auto flex items-center gap-2 justify-self-start font-mono text-[11px] tracking-[0.18em] text-ink/80">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          GORDON&nbsp;LI
        </span>

        {/* Center pill */}
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

        {/* Location / time */}
        <span className="pointer-events-auto hidden justify-self-end font-mono text-[11px] tracking-[0.14em] text-ink/70 sm:block">
          SAN&nbsp;FRANCISCO,&nbsp;CA&nbsp;&nbsp;·&nbsp;&nbsp;{clock}
        </span>
      </div>
    </header>
  )
}
