// Re-measures the "pace" facts from GitHub. Never edit those numbers by hand.
import { readFileSync, writeFileSync } from "node:fs";
import { gh } from "./gh.mjs";

const root = new URL("..", import.meta.url);
const file = new URL("data/progress.json", root);
const d = JSON.parse(readFileSync(file, "utf8"));
const prs = gh("pr", "list", "-R", "Plopmenz/own-demo", "--state", "merged", "--limit", "2000", "--json", "number").length;
const rel = gh("release", "list", "-R", "johnforfar/nexy-releases", "--limit", "1000", "--json", "publishedAt").map((r) => r.publishedAt.slice(0, 10)).sort();
const days = Math.round((Date.parse(rel.at(-1)) - Date.parse(rel[0])) / 864e5) + 1;
d.pace.facts = [
  { value: `${Math.floor(prs / 10) * 10}+`, label: "improvements shipped to Own1 since July" },
  { value: String(rel.length), label: `Nexy app releases in ${days} days, each tested before release` },
];
writeFileSync(file, JSON.stringify(d, null, 2) + "\n");
console.log(`pace: ${prs} merged PRs, ${rel.length} releases over ${days} days`);
