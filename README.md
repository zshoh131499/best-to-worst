# Best to Worst — All Together

A cooperative, pass-and-play party game for 2–8 people, built with Three.js r170. Everyone shares one device and one team score. No account, server, or online multiplayer room is required.

## Open the standalone game

Double-click `Best to Worst.html`. It contains the complete game, styles, and Three.js library and needs no server or internet connection.

## Run locally

Run `npm start` in this directory, then open http://127.0.0.1:4178 . The static app is in `dist/`. Serve it over HTTP; opening the HTML directly will not load ES modules. Run `npm test` to check scoring and game outcomes.

## Rules

One person secretly ranks five topics from favorite (1, S-TIER) to least favorite (5, NOPE). Everyone else submits one shared guess. Each exact position match earns the team one point; each miss earns the game one point. After everyone ranks once, the higher score wins. Ties continue into overtime. All players win or lose together.

Both sides predict the team's match rate. With predictions p and q and actual match rate a, confidence accuracy c = 1 − (|p−a| + |q−a|) / 2. Connection score = round(40a + 60c). The overall connection score averages round scores. Connection scores never change victory points.

## Features

- Three.js paper cards, shadows, animated reordering, and individual reveals.
- Flat-card fallback when WebGL cannot initialize.
- Four English topic packs plus custom topics.
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
- `tests/core.test.js`: eleven tests, including all 120 possible permutations.

Three.js is vendored locally with its MIT license. No remote CDN or font request is needed. Installation reference: https://threejs.org/manual/pages/installation.html
