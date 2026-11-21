# OwnX progress

Public progress for Own1, OwnXOS, Nexy and Earth Compute, published at [progress.ownx.co](https://progress.ownx.co).

All content lives in [`data/progress.json`](data/progress.json): one entry per track, plus the monthly history. The page (`index.html`, `app.js`, `styles.css`) is static and has no build step.

## Update

1. Edit `data/progress.json`: `news` is the hand-picked "What's new" list (newest first, five or six items). Each product in `tracks` has a `status` (`live`, `prototype`, `planned`), a one-line `summary`, two `highlights` and one `next`.
2. `shipped` lists user-visible features (merge `date`, `product`, `title`, one-line `benefit`, `hours` from opened to merged; omit `hours` when there is no PR). `inReview` and `upcoming` feed "Coming next". Re-measure the `pace` facts from the PR history on each update.
3. Set `updated` at the top of the file.
4. Preview locally with any static server, for example `npx serve .`, then commit.

## Content rules

- Lead with impact in plain language; no changelog entries or internal detail.
- Shipped work only under `news` and `highlights`; plans go under `next`.
- No claim beyond what has been measured.
- Plain language, no internal hostnames, addresses, credentials or access codes.
- Describe what a change gives people; never list a fixed weakness. No PR numbers or links.
- Usage figures are published only with sign-off.
