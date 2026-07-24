# Gordon Li - Portfolio

A single-viewport portfolio hero inspired by David Kovalev's Dribbble shot:
liquid-glass social icons that fan out from the avatar on hover, a serif→sans
headline, and a draggable project carousel peeking up from the bottom.

Built with **Vite + React + TypeScript + Tailwind v4 + Framer Motion**.

## Run

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to /dist
npm run lint     # oxlint
```

## Contact form (email setup)

The **Contact** nav item opens a form that emails submissions straight to
`gordonyli@gmail.com` via [Web3Forms](https://web3forms.com) - **already set up
and working, no backend required.**

The Web3Forms access key is embedded in
[`ContactModal.tsx`](src/components/ContactModal.tsx). This is intentional and
safe: Web3Forms keys are **public by design** (meant for client-side code) and
only allow sending to the inbox they're bound to. To swap it, replace the key in
that file, or override per-environment by setting `VITE_WEB3FORMS_KEY` (see
[`.env.example`](.env.example)).

If the key is ever removed, the form gracefully falls back to opening the
visitor's mail client with a prefilled draft.

## Where to put your real content

Everything below is placeholder - swap it in place, no refactor needed.

- **Your photo** - replace [`public/gordon.png`](public/gordon.png) with a real
  portrait (any image works; `object-cover object-top` handles the crop).
- **Social links** - edit the `SOCIALS` array in
  [`src/components/Hero.tsx`](src/components/Hero.tsx): set each `href`.
  Order is `[left-outer, left-inner, right-inner, right-outer]`.
- **Projects** - edit [`src/data/projects.json`](src/data/projects.json). Each
  entry has:
  - `name`, `icon` (emoji), `subheader` (one-line tagline), `details`
    (long-form copy shown only in the expanded view), `year`, `url`
  - `cover` (optional) - path to real art in `/public/projects`; when absent it
    falls back to the two-stop `gradient` placeholder card.

  **Interaction:** the carousel hides `details`; hovering a card zooms it, and
  clicking morphs it into a full detail view (cover + icon + subheader +
  details + Visit link). Click the backdrop, the ✕, or press Esc to morph it
  back. All handled by a shared Framer Motion `layoutId` - no config needed,
  just add entries to the JSON.
- **Nav / location / resume** - [`src/components/TopNav.tsx`](src/components/TopNav.tsx):
  wordmark, the `America/New_York` timezone + `TORONTO, CA` label, and the
  `/resume.pdf` link (drop the PDF in `/public`).

## Fonts

Loaded from CDNs in [`index.html`](index.html) - chosen as free matches for the
original's paid type:

- **General Sans** (Fontshare) - the "Our paths" sans
- **Zodiak Italic** (Fontshare) - the "just crossed." serif
- **JetBrains Mono** (Google) - the mono nav labels
