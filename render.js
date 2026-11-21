// Shared by the browser (app.js) and the build (scripts/build.mjs).
export const SITE = "https://ownx-progress.vercel.app";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const ym = (s) => { const [y, m] = s.split("-"); return `${MONTHS[+m - 1].slice(0, 3)} ${y}`; };
const ymd = (s) => { const [y, m, d] = s.split("-"); return `${+d} ${MONTHS[+m - 1].slice(0, 3)} ${y}`; };
const label = { live: "Live", prototype: "Prototype", planned: "Planned" };
const facts = (list) => list.map((f) => `<div><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join("");
const soon = (list, k) => list.map((s) => `<li><span class="prod">${esc(s.product)}${s[k] ? ` · in review since ${ymd(s[k]).slice(0, -5)}` : ""}</span><b>${esc(s.title)}</b><p>${esc(s.benefit)}</p></li>`).join("");

export const products = (d) => [...new Set(d.shipped.map((s) => s.product))];
export const newest = (d) => [...d.shipped].sort((a, b) => b.date.localeCompare(a.date));

export function chips(d, current = "All") {
  return ["All", ...products(d)].map((p) => `<button type="button" aria-pressed="${p === current}" data-p="${esc(p)}">${esc(p)}</button>`).join("");
}

export function shipped(d, current = "All") {
  return newest(d).filter((s) => current === "All" || s.product === current).map((s) =>
    `<li><time datetime="${esc(s.date)}">${ymd(s.date)}</time><span class="prod">${esc(s.product)}</span><div><b>${esc(s.title)}</b><p>${esc(s.benefit)}</p></div></li>`).join("");
}

export function sections(d) {
  const [y, m, day] = d.updated.split("-");
  return {
    updated: `${+day} ${MONTHS[+m - 1]} ${y}`,
    intro: esc(d.intro),
    facts: facts(d.facts),
    news: d.news.map((u) => `<li><time>${ym(u.date)}</time><span class="prod">${esc(u.product)}</span><div><b>${esc(u.title)}</b><p>${esc(u.text)}</p></div></li>`).join(""),
    chips: chips(d),
    pace: facts(d.pace.facts),
    shipped: shipped(d),
    "pace-note": esc(d.pace.note),
    review: soon(d.inReview, "opened"),
    upcoming: soon(d.upcoming),
    products: d.tracks.map((t) => `
    <article class="card" id="${esc(t.id)}">
      <div class="top"><span class="group">${esc(t.group)}</span><span class="st ${esc(t.status)}">${label[t.status]}</span></div>
      <h3>${esc(t.name)}</h3>
      <p>${esc(t.summary)}</p>
      <ul>${t.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
      ${t.next ? `<p class="next"><b>Next</b>${esc(t.next)}</p>` : ""}
      ${t.link ? `<a class="link" href="${esc(t.link.url)}" rel="noopener">${esc(t.link.label)} →</a>` : ""}
    </article>`).join(""),
    history: d.history.map((h) => `<div><h3>${esc(h.month)} 2026</h3><ul>${h.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join(""),
  };
}

// Structured data for search and answer engines.
export function jsonLd(d) {
  const org = { "@type": "Organization", "@id": `${SITE}/#org`, name: "OwnX", url: "https://ownx.co" };
  return {
    "@context": "https://schema.org",
    "@graph": [
      org,
      { "@type": "WebPage", "@id": `${SITE}/`, url: `${SITE}/`, name: "OwnX Progress",
        description: "What OwnX has shipped across Own1, Nexy and Earth Compute, feature by feature, and what comes next.",
        dateModified: d.updated, inLanguage: "en", publisher: { "@id": `${SITE}/#org` },
        about: d.tracks.map((t) => ({ "@type": "Thing", name: t.name, description: t.summary })),
        mainEntity: { "@id": `${SITE}/#shipped` } },
      { "@type": "ItemList", "@id": `${SITE}/#shipped`, name: "Shipped features", itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: d.shipped.length,
        itemListElement: newest(d).map((s, i) => ({ "@type": "ListItem", position: i + 1,
          item: { "@type": "CreativeWork", name: s.title, description: s.benefit, datePublished: s.date, about: s.product } })) },
    ],
  };
}
