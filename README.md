# Vruttant Patoliya · Portfolio

My developer portfolio, built as a small production-grade React app rather than a template. Deployed on Vercel.

![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

## Highlights

- **Interactive terminal.** Visitors can type `help`, `projects`, `open jobmate` or `github`. Includes command history (↑/↓) and Tab autocomplete. The command interpreter is a pure TypeScript module with no DOM access, so it's fully unit-tested.
- **Live GitHub stats, including a React footprint.** GitHub counts `.jsx` as JavaScript, so React never shows up in its language bar. A daily GitHub Actions job runs `scripts/fetch_github.py`, which scans my repos' `package.json` files and component trees, and commits fresh data. Vercel then redeploys. There's no backend and no API rate limits for visitors.
- **AI toolkit section** with an animated prompt → typed JSON → React UI demo, based on JobMate's real Gemini structured-output route.
- **Motion design** (Motion for React): scroll progress, word-by-word headings, magnetic buttons, 3D tilt cards with cursor spotlight, layout-animated project filtering, a self-drawing timeline and a live-typing code window. All of it respects `prefers-reduced-motion`.
- **Project filtering** by technology, using `useState` and `useMemo`, with `aria-pressed` buttons and a live result count.
- **Custom hooks:** `useTheme` (persisted, no flash on load), `useTypewriter`, `useCountUp`, `useActiveSection` (scroll-spy nav), `useReducedMotion` (built on `useSyncExternalStore`) and `useGitHubStats`.
- **Accessibility:** semantic landmarks, a skip link, visible focus rings, `prefers-reduced-motion` support, high-contrast light and dark themes, and 44px touch targets.
- **Quality gates:** strict TypeScript (`noUncheckedIndexedAccess`), ESLint with the React Hooks rules, and Vitest + React Testing Library. CI runs all of them on every push.

## Structure

```
src/
  components/   Hero, Nav, Projects, Skills, LanguageChart, Terminal, Experience, Contact
  hooks/        useTheme, useTypewriter, useCountUp, useActiveSection, useReducedMotion, ...
  lib/
    data.ts      all portfolio content (edit this, not the markup)
    commands.ts  terminal command interpreter (pure, tested)
    filters.ts   project filter logic
    github.ts    types + loader for the stats snapshot
scripts/
  fetch_github.py        builds public/data/github.json from the GitHub API
.github/workflows/ci.yml              lint → test → build on every push / PR
.github/workflows/refresh-stats.yml   daily stats refresh (commit → Vercel redeploy)
```

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest + React Testing Library
npm run build    # type-check + production build
npm run data     # refresh GitHub stats (needs Python 3.10+)
```
