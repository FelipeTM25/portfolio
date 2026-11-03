# Felipe Torres · Portfolio

Personal portfolio told as **the journey of a request**: as you scroll, a packet travels
through the layers of a system — Client → Controller → Domain → Persistence → `200 OK`.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · Lenis ·
Bricolage Grotesque + JetBrains Mono (self-hosted via Fontsource)

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

## Deploy

Every push to `main` is linted, built and deployed to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Where things live

| Path | What |
| --- | --- |
| `src/content/es.ts`, `src/content/en.ts` | All copy, in Spanish and English |
| `src/content/stack.ts` | Rows of the queryable stack table |
| `src/content/links.ts` | LinkedIn, GitHub and (optional) email |
| `src/sections/` | One file per layer/section |
| `src/diagrams/` | Interactive Fuelix and Fitally architecture diagrams |
| `src/index.css` | Color tokens (light/dark), fonts, blueprint grid |
