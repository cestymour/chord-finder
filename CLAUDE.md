# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR (served under `/chord-finder/`)
- `npm run build` — production build into `dist/` (gitignored)
- `npm run preview` — serve the built `dist/`
- `npm run lint` — ESLint (flat config, `eslint.config.js`)

There is no test framework set up. Node version is pinned in `.nvmrc` (24); the CI workflow reads it via `node-version-file`.

## Architecture

Single-page React 19 + Vite app (plain JSX, no TypeScript, no router, no state library). Almost everything lives in `src/App.jsx`; styles are in `src/App.css` (`src/index.css` is empty). The UI text is in French.

- **Music model** (top of `App.jsx`): `NOTES` is the 12 sharp-named pitch classes; flats exist only as display aliases (`NOTE_ALIASES`, rendered via `noteLabel`). `CHORD_TYPES` maps a chord name to semitone intervals from the root — intervals ≥ 12 (e.g. 14 for the 9th) wrap modulo 12 in `getChordNotes`. Adding a chord type means adding one entry here; both modes pick it up automatically.
- **Two modes** sharing one piano keyboard:
  - `chord-to-notes`: root + type selects → computed notes.
  - `notes-to-chord`: user toggles notes (pills or piano keys) → `findChords` brute-forces every root × chord type and returns **exact** pitch-class set matches (no subset/superset matching, inversions are implicit since order is ignored).
  - `activeNotes` switches between the two sources to drive keyboard highlighting; keys are only clickable in `notes-to-chord`. Switching mode clears selected notes.
- **Piano layout**: a single octave. Black keys are absolutely positioned with an inline `left: (blackPos - 1) * 55 + 35` computed from `BLACK_KEY_POSITIONS`; this is coupled to the white key width/spacing in `App.css` (`.white-key` width 52px + `.white-keys-row` gap 3px = 55px) — change both together.

## Deployment

`.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages on every push to `main`. `vite.config.js` sets `base: '/chord-finder/'` to match the Pages repo path — keep it in sync if the repo is renamed.
