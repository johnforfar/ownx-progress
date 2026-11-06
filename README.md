# OwnX progress

Public progress for Own1, OwnXOS, Nexy and Earth Compute, published at [progress.ownx.co](https://progress.ownx.co).

All content lives in [`data/progress.json`](data/progress.json): one entry per track, plus the monthly history. The page (`index.html`, `app.js`, `styles.css`) is static and has no build step.

## Update

1. Edit `data/progress.json`: `news` is the hand-picked "What's new" list (newest first, five or six items). Each product in `tracks` has a `status` (`live`, `prototype`, `planned`), a one-line `summary`, two `highlights` and one `next`.
2. Set `updated` at the top of the file.
3. Preview locally with any static server, for example `npx serve .`, then commit.

## Content rules

- Lead with impact in plain language; no changelog entries or internal detail.
- Shipped work only under `news` and `highlights`; plans go under `next`.
- No claim beyond what has been measured.
- Plain language, no internal hostnames, addresses, credentials or access codes.
- Usage figures are published only with sign-off.
