// Bakes data/progress.json into index.html (for crawlers and no-JS readers),
// plus the JSON-LD, sitemap and llms.txt. Run after every content edit.
import { readFileSync, writeFileSync } from "node:fs";
import { sections, jsonLd, newest, SITE } from "../render.js";

const root = new URL("..", import.meta.url);
const d = JSON.parse(readFileSync(new URL("data/progress.json", root), "utf8"));
let html = readFileSync(new URL("index.html", root), "utf8");

const fill = (key, value) => {
  const re = new RegExp(`(<!--${key}-->)[\\s\\S]*?(<!--/${key}-->)`);
  if (!re.test(html)) throw new Error(`index.html is missing the ${key} markers`);
  html = html.replace(re, (_, a, b) => `${a}${value}${b}`);
};
for (const [id, value] of Object.entries(sections(d))) fill(id, value);
fill("jsonld", `<script type="application/ld+json">${JSON.stringify(jsonLd(d)).replace(/</g, "\\u003c")}</script>`);
fill("modified", `<meta property="article:modified_time" content="${d.updated}">`);
writeFileSync(new URL("index.html", root), html);

writeFileSync(new URL("sitemap.xml", root),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE}/</loc><lastmod>${d.updated}</lastmod></url>\n</urlset>\n`);
writeFileSync(new URL("robots.txt", root), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

const line = (s) => `- ${s.date}, ${s.product}: ${s.title}. ${s.benefit}`;
writeFileSync(new URL("llms.txt", root), [
  "# OwnX Progress",
  "",
  `> ${d.intro}`,
  "",
  `Updated ${d.updated}. Page: ${SITE}/`,
  "",
  "## Products",
  ...d.tracks.map((t) => `- ${t.name} (${t.status}): ${t.summary} Next: ${t.next}`),
  "",
  "## Shipped features, newest first (date merged)",
  ...newest(d).map(line),
  "",
  "## In review",
  ...d.inReview.map((s) => `- ${s.product}: ${s.title}. ${s.benefit}`),
  "",
  "## Planned",
  ...d.upcoming.map((s) => `- ${s.product}: ${s.title}. ${s.benefit}`),
  "",
].join("\n"));
console.log("built index.html, sitemap.xml, robots.txt, llms.txt");
