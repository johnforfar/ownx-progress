# OwnX progress

Public progress for Own1, OwnXOS, Nexy and Earth Compute, published at [progress.ownx.co](https://progress.ownx.co).

All content lives in [`data/progress.json`](data/progress.json): one entry per track, plus the monthly history. The page (`index.html`, `app.js`, `styles.css`) is static and has no build step.

## Update

1. Edit `data/progress.json`. Each track has a `status` (`live`, `prototype`, `planned`), a summary, `updates` (newest first) and `next`.
2. Set `updated` at the top of the file.
3. Preview locally with any static server, for example `npx serve .`, then commit.

## Content rules

- Shipped work only under `updates`; plans go under `next`.
- Plain language, no internal hostnames, addresses, credentials or access codes.
- Usage figures are published only with sign-off.
