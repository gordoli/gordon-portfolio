import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'

const CONTACT_EMAIL = 'gordonyli@gmail.com'
// Web3Forms access key — public by design (safe in client code) so the form
// works out of the box. Override per-environment via VITE_WEB3FORMS_KEY if ever
// needed. Without any key, the form falls back to a prefilled mailto: link.
const WEB3FORMS_KEY =
  import.meta.env.VITE_WEB3FORMS_KEY ?? '7fac3a97-d4ee-485d-9a38-a25f2e88cb4d'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const inputClass =
  'w-full border-b border-ink/20 bg-transparent py-2 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-ink'

export function ContactModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')

    // No key configured → open the user's mail client with a prefilled draft.
    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio inquiry from ${name}`,
          name,
          email,
          message,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <Modal onClose={onClose} title="Get in touch">
      <h2 className="font-serif text-3xl text-ink italic">Get in touch</h2>
      <p className="mt-2 text-[15px] text-ink/60">
        Drop me a line and it lands in my inbox.
      </p>

      {status === 'sent' ? (
        <p className="mt-8 text-[15px] text-ink/80">
          Thanks — your message is on its way. I'll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <input
            name="name"
            type="text"
            required
            placeholder="Your name"
            className={inputClass}
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Your email"
            className={inputClass}
          />
          <textarea
            name="message"
            required
            rows={4}
            placeholder="What's on your mind?"
            className={`${inputClass} resize-none`}
          />
          {status === 'error' && (
            <p className="text-[13px] text-red-500">
              Something went wrong — email me directly at {CONTACT_EMAIL}.
            </p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-ink py-3 font-mono text-[12px] tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </Modal>
  )
}
