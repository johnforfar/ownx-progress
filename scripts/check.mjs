// Content and data checks before any deploy. Exits non-zero on a problem.
import { readFileSync } from "node:fs";

const root = new URL("..", import.meta.url);
const d = JSON.parse(readFileSync(new URL("data/progress.json", root), "utf8"));
const text = readFileSync(new URL("llms.txt", root), "utf8") + readFileSync(new URL("index.html", root), "utf8").replace(/<script[\s\S]*?<\/script>|<[^>]+>/g, " ");
const problems = [];
const BANNED = [
  [/\b(xnode|ethereum|wallet|crypto|web3|token|x402|yggdrasil|ygg)\b/i, "web3 or internal term"],
  [/\b(Sam|Ashton|John|Buri|Plopmenz)\b/, "personal name"],
  [/\b\d{1,3}(\.\d{1,3}){3}\b|\.local\b|\.container\b/, "address or internal host"],
  [/#\d{2,4}\b/, "PR number"],
  [/instead of failing|stops responding|was open|shared login|vulnerab|leak|exploit|advisory|issues found/i, "reveals a weakness"],
  [/\b(centre|catalogue|organisation|organise)\b|\bthe box\b|\bbox's\b/i, "house style (US spelling; say Own1, not box)"],
  [/\b(OTC|Claude|OpenAI|Anthropic|Grok|Gemini|Salad|NEAR AI)\b/, "outside name"],
];
for (const [re, why] of BANNED) { const m = text.match(re); if (m) problems.push(`${why}: "${m[0]}"`); }
const today = new Date().toISOString().slice(0, 10);
for (const s of d.shipped) {
  if (!d.productOrder.includes(s.product)) problems.push(`unknown product "${s.product}" (${s.title})`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date) || s.date > today) problems.push(`bad date ${s.date} (${s.title})`);
  if (!s.benefit || s.benefit.length > 200) problems.push(`benefit missing or too long (${s.title})`);
  if ("hours" in s) problems.push(`ship durations are not shown (${s.title})`);
}
const titles = d.shipped.map((s) => s.title);
for (const t of titles.filter((t, i) => titles.indexOf(t) !== i)) problems.push(`duplicate title "${t}"`);
if (d.updated > today) problems.push("updated is in the future");
if (problems.length) { console.error("CHECK FAILED\n- " + problems.join("\n- ")); process.exit(1); }
console.log(`check ok: ${d.shipped.length} features, ${d.productOrder.length} products`);
