# Best to Worst

A cooperative, pass-and-play party game for 2–8 people, built with Three.js r170. Everyone shares one device and one team score. No account, server, or online multiplayer room is required.

## Open the standalone game

Double-click `Best to Worst.html`. It contains the complete game, styles, and Three.js library and needs no server or internet connection.

## Run locally

Run `npm start` in this directory, then open http://127.0.0.1:4178 . The static app is in `dist/`. Serve it over HTTP; opening the HTML directly will not load ES modules. Run `npm test` to check scoring and game outcomes.

## Rules

One person secretly ranks five topics from favorite (1, S-TIER) to least favorite (5, NOPE). Everyone else submits one shared guess. Each exact position match earns the team one point; each miss earns the game one point. After everyone ranks once, the higher score wins. Ties continue into overtime. All players win or lose together.

Both sides predict the team's match rate. With predictions p and q and actual match rate a, confidence accuracy c = 1 − (|p−a| + |q−a|) / 2. Connection score = round(40a + 60c). The overall connection score averages round scores. Connection scores never change victory points.

## Features

- Optional ranker notes after each round: explain a specific card or the overall ranking. Save, edit, remove, or cancel. Notes stay in this browser, are visible on the shared device, never affect scores, and are not sent to Sammy.

- Three.js paper cards, shadows, animated reordering, and individual reveals.
- Flat-card fallback when WebGL cannot initialize.
- Default category draw each round: a Three.js packet cut, fan, and flip reveals a category. Accept it or choose another; skip animation is available. Reduced motion reveals immediately. The timer starts only when ranking begins.
- Six selectable English categories with 120 unique cards, plus custom cards.
- Rotate one category per round or mix selected categories. Preview each category before playing.
- Cards are drawn without repeats until the relevant pool is exhausted. Existing saved games remain playable.
- Private handoff screens and automatic shielding when the tab is hidden.
- Browser-local progress and a resume button.
- Optional turn timer: off, 60, 90 (default), or 120 seconds for each ranking and guessing phase. Pause/resume and add 30 seconds. Expiry is advisory, never an automatic submission or penalty. The countdown pauses when leaving the tab.
- Optional synthesized sound; muted by default.
- Responsive controls and reduced-motion support.

The handoff screen is a party etiquette aid, not an anti-cheat security boundary. Someone with access to this browser's developer tools can inspect locally stored rankings.

## Source

- `dist/core.js`: scoring, shuffling, reordering, and victory conditions.
- `dist/app.js`: game flow, storage, and accessible HTML controls.
- `dist/table.js`: Three.js cards, textures, and animation.
- `dist/style.css`: responsive layout and styling.
- `tests/`: 17 tests covering scoring, all 120 possible permutations, timers, category rotation, mixed draws, and repeat avoidance.

Three.js is vendored locally with its MIT license. No remote CDN or font request is needed. Installation reference: https://threejs.org/manual/pages/installation.html
