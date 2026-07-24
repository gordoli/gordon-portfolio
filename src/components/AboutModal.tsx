import { Modal } from './Modal'

export function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} title="A bit about me">
      <h2 className="font-serif text-3xl text-ink italic">A bit about me</h2>
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink/75">
        <p>
          I'm a founder and engineer based in San Francisco. I like building
          products end to end — from the first sketch to the thing people
          actually use.
        </p>
        <p>
          Outside of work you'll find me deep in fashion, out for a run, or up in
          the mountains snowboarding. And never far from my dog Benji, who is
          extremely good and knows it.
        </p>
      </div>
    </Modal>
  )
}
