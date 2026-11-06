const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const month = (ym) => { const [y, m] = ym.split("-"); return `${MONTHS[+m - 1].slice(0, 3)} ${y}`; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const label = { live: "Live", prototype: "Prototype", planned: "Planned" };

async function render() {
  const d = await (await fetch("/data/progress.json")).json();
  const $ = (id) => document.getElementById(id);
  const [y, m, day] = d.updated.split("-");
  $("updated").textContent = `${+day} ${MONTHS[+m - 1]} ${y}`;
  $("intro").textContent = d.intro;
  $("facts").innerHTML = d.facts.map((f) => `<div><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join("");

  $("news").innerHTML = d.news.map((u) =>
    `<li><time>${month(u.date)}</time><span class="prod">${esc(u.product)}</span><div><b>${esc(u.title)}</b><p>${esc(u.text)}</p></div></li>`).join("");

  $("products").innerHTML = d.tracks.map((t) => `
    <article class="card" id="${esc(t.id)}">
      <div class="top"><span class="group">${esc(t.group)}</span><span class="st ${t.status}">${label[t.status]}</span></div>
      <h3>${esc(t.name)}</h3>
      <p>${esc(t.summary)}</p>
      <ul>${t.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
      ${t.next ? `<p class="next"><b>Next</b>${esc(t.next)}</p>` : ""}
      ${t.link ? `<a class="link" href="${esc(t.link.url)}" rel="noopener">${esc(t.link.label)} →</a>` : ""}
    </article>`).join("");

  $("history").innerHTML = d.history.map((h) =>
    `<div><h3>${esc(h.month)} 2026</h3><ul>${h.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("");
}

render();
