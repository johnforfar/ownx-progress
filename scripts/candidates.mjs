// Lists everything shipped since the last update (or a given date) from data/sources.json,
// so only the copywriting needs a person or an AI. Writes candidates.md (gitignored).
// Usage: node scripts/candidates.mjs [YYYY-MM-DD]
import { readFileSync, writeFileSync } from "node:fs";
import { gh } from "./gh.mjs";

const root = new URL("..", import.meta.url);
const d = JSON.parse(readFileSync(new URL("data/progress.json", root), "utf8"));
const { sources } = JSON.parse(readFileSync(new URL("data/sources.json", root), "utf8"));
const since = process.argv[2] ?? d.updated;
const listed = new Set(d.shipped.map((s) => `${s.date}|${s.title}`));
// Lines that are usually not public features, or need rewording as a benefit.
const SKIP = /\b(test|tests|ci|lint|typo|readme|docs?|bump|revert|merge|refactor|chore|nix flake|fixture|log|untrack)\b/i;
const CAREFUL = /\b(security|fix|fixed|vuln|leak|advisory|cve|exploit|harden|open to|instead of|broken|crash|fail|bug|secret|key|password|token|wallet|ethereum)\b/i;

const out = [`# Candidates since ${since}`, "", "Mark each: add (write title + one-line benefit), merge into an existing row, or skip.", "Lines tagged CAREFUL reveal a fix or a security detail: describe the benefit, never the weakness.", ""];
for (const s of sources) {
  let rows = [];
  if (s.kind === "prs") rows = gh("pr", "list", "-R", s.repo, "--state", "merged", "--limit", "300", "--search", `merged:>=${since}`, "--json", "mergedAt,title")
    .map((p) => [p.mergedAt.slice(0, 10), p.title]);
  if (s.kind === "releases") rows = gh("release", "list", "-R", s.repo, "--limit", "100", "--json", "tagName,publishedAt")
    .filter((r) => r.publishedAt.slice(0, 10) >= since)
    .map((r) => [r.publishedAt.slice(0, 10), `${r.tagName}: ${gh("release", "view", r.tagName, "-R", s.repo, "--json", "body").body.split("\n").filter((l) => l.trim() && !/windows protected|run anyway|\|/i.test(l)).slice(0, 8).join(" / ")}`]);
  if (s.kind === "commits") rows = gh("api", `repos/${s.repo}/commits?since=${since}T00:00:00Z&per_page=100`)
    .map((c) => [c.commit.committer.date.slice(0, 10), c.commit.message.split("\n")[0]]);
  out.push(`## ${s.products.join(" / ")} (${s.repo}, ${s.kind})`, "");
  if (!rows.length) out.push("- nothing new", "");
  for (const [date, title] of rows.sort((a, b) => b[0].localeCompare(a[0]))) {
    const tag = SKIP.test(title) ? " [probably skip]" : CAREFUL.test(title) ? " [CAREFUL]" : "";
    out.push(`- ${date}${tag} ${title}`);
  }
  out.push("");
}
writeFileSync(new URL("candidates.md", root), out.join("\n"));
console.log(`wrote candidates.md (${out.filter((l) => l.startsWith("- 2")).length} items since ${since}); already listed: ${listed.size}`);
