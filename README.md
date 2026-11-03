# Chord Finder — Explorateur d’accords

> ## 🚀 Essayez-la en ligne ! · Try it live!
> ### 👉 [Ouvrir l’application — cliquez ici ! · Open the app — click here!](https://cestymour.github.io/chord-finder/)

🇫🇷 Choisissez un accord pour voir ses notes sur le clavier, ou sélectionnez des notes pour retrouver l’accord qu’elles forment. Tout se passe dans le navigateur, sans rien installer.

🇬🇧 Pick a chord to see its notes on the keyboard, or select notes to find the chord they make. Everything runs in the browser, with nothing to install. *(English summary [below](#-english).)*

## Fonctionnalités

L’application propose deux modes, accessibles par les boutons en haut, qui partagent le même clavier d’une octave.

- **Accord → Notes** : choisissez une fondamentale et un type d’accord, et ses notes s’affichent avec leur intervalle en demi-tons par rapport à la fondamentale. Elles s’allument aussi sur le clavier.
- **Notes → Accord** : sélectionnez des notes avec les boutons ou directement sur le clavier. Dès deux notes, l’application liste les accords qui contiennent exactement ces notes, dans n’importe quel ordre (les renversements sont donc reconnus).
- **15 types d’accords** : majeur, mineur, 7e de dominante, maj7, m7, sus2, sus4, diminué, augmenté, add9, 6, m6, 9, 7e diminuée et demi-diminué.
- Les notes altérées sont affichées en dièse et en bémol (ex. `C#/Db`).

## Développement

Node.js 20.19+ requis par Vite (le fichier `.nvmrc` indique Node 24 : `nvm use`).

```bash
npm install
npm run dev      # serveur de développement (http://localhost:5173/chord-finder/)
npm run build    # build de production dans dist/
npm run preview  # prévisualisation du build
npm run lint     # ESLint
```

## Déploiement

Chaque push sur `main` déclenche le workflow `.github/workflows/deploy.yml`, qui compile l’application et la publie sur GitHub Pages.

`vite.config.js` fixe `base` à `/chord-finder/`. Pour héberger ailleurs, adaptez cette valeur à votre URL.

## Technologies

- [React 19](https://react.dev), [Vite 8](https://vitejs.dev)

## 🇬🇧 English

**Chord Finder** has two modes sharing a one-octave on-screen keyboard:

- **Accord → Notes** (chord to notes): pick a root and a chord type to see its notes, with their interval in semitones from the root, lit up on the keyboard.
- **Notes → Accord** (notes to chord): select notes with the buttons or on the keyboard. From two notes on, the app lists every chord made of exactly those notes, in any order, so inversions are recognized.
- 15 chord types: major, minor, dominant 7th, maj7, m7, sus2, sus4, diminished, augmented, add9, 6, m6, 9, diminished 7th and half-diminished.

The interface is in French. Run it locally with `npm install` then `npm run dev`.

## Licence

[MIT](LICENSE) © cestymour
