import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { TopNav, type NavTarget } from './components/TopNav'
import { Hero } from './components/Hero'
import { ProjectCarousel } from './components/ProjectCarousel'
import { ProjectDetail } from './components/ProjectDetail'
import { AboutModal } from './components/AboutModal'
import { ContactModal } from './components/ContactModal'
import type { Project } from './data/projects'

function App() {
  const [selected, setSelected] = useState<Project | null>(null)
  const [modal, setModal] = useState<NavTarget | null>(null)

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <TopNav onOpen={setModal} />
      {/* Hero fills the first screen; the carousel peeks up from below. */}
      <Hero />
      <ProjectCarousel
        onSelect={setSelected}
        selectedName={selected?.name ?? null}
      />

      {/* Expanded project view - morphs out of the clicked card. */}
      <AnimatePresence>
        {selected && (
          <ProjectDetail
            key={selected.name}
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      {/* Nav modals */}
      <AnimatePresence>
        {modal === 'about' && <AboutModal onClose={() => setModal(null)} />}
        {modal === 'contact' && <ContactModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  )
}

export default App
