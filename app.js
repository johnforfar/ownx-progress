import { sections, chips, shipped } from "/render.js";

const $ = (id) => document.getElementById(id);

async function main() {
  const d = await (await fetch("/data/progress.json")).json();
  for (const [id, html] of Object.entries(sections(d))) if ($(id)) $(id).innerHTML = html;
  let current = "All";
  $("chips").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    current = b.dataset.p;
    $("chips").innerHTML = chips(d, current);
    $("shipped").innerHTML = shipped(d, current);
  });
}

main();
