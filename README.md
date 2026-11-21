# OwnX progress

Public engineering progress for all of OwnX (Own1, OwnXOS, OwnX Desktop, Nexy Apps, Nexy Cloud, OwnX Console, OwnX CLI, Earth Compute), live at [progress.ownx.co](https://progress.ownx.co) (Vercel team `openmesh`, project `ownx-progress`).

All content lives in [`data/progress.json`](data/progress.json). `render.js` turns it into HTML in the browser (`app.js`, which also runs the product filter) and at build time (`scripts/build.mjs`, which writes the content into `index.html` so crawlers and no-JS readers see it).

## Update (one command per step)

```sh
npm install                 # once: Playwright for the layout test
npm run candidates          # everything shipped since `updated`, from data/sources.json -> candidates.md
# edit data/progress.json: add rows to `shipped` from candidates.md, set `updated`
npm run deploy              # re-measure pace, build, check, layout test, commit, push, Vercel, live check
```

Only the editing step needs judgement. `candidates.md` tags lines `[probably skip]` (tests, docs, chores) and `[CAREFUL]` (fixes, security): describe the benefit, never the weakness.

## Data

- `shipped`: `date` (the release day, YYYY-MM-DD), `product` (one of `productOrder`), `title`, `benefit` (one plain sentence). Shown newest first. No shipping durations.
- `inReview`, `upcoming`: product, title, benefit. No dates and no commitments.
- `tracks`: one product card each: `group`, `status` (`live`, `prototype`, `planned`), `summary`, `highlights`, `next`, optional `link`.
- `news`: hand-picked "What's new". `facts`: the headline numbers.
- `pace`: written by `scripts/pace.mjs` from GitHub. Never edit it by hand.
- `data/sources.json`: which repo feeds which product.

## Content rules (scripts/check.mjs enforces what it can)

- Engineering progress only. The disclaimer stays at the top, in "Coming next" and in the footer.
- Describe what people get. Never name a fixed weakness, bug, security gap or current limit ("instead of failing", "now needs", "was open").
- No secret sauce: no internal architecture, methods or stack beyond a normal product page.
- No personal names, internal hosts or addresses, PR numbers, competitor or AI-vendor names, or web3, wallet or token words. Paid compute is "GPU credits", and only as a plan.
- US spelling (data center, organization, catalog). Say "Own1", not "box".
- No prices, dates or promises for unreleased work. Usage figures only with sign-off.
