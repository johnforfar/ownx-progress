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

  const short = (iso) => { const [, mm, dd] = iso.split("-"); return `${+dd} ${MONTHS[+mm - 1].slice(0, 3)}`; };
  const took = (h) => h === undefined ? "" : h < 24 ? "Under a day" : `${Math.round(h / 24)} day${Math.round(h / 24) > 1 ? "s" : ""}`;
  $("pace").innerHTML = d.pace.facts.map((f) => `<div><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join("");
  $("pace-note").textContent = d.pace.note;
  const products = [...new Set(d.shipped.map((s) => s.product))];
  let current = "All";
  const draw = () => {
    $("chips").innerHTML = ["All", ...products].map((p) =>
      `<button type="button" aria-pressed="${p === current}" data-p="${esc(p)}">${esc(p)}</button>`).join("");
    $("shipped").innerHTML = d.shipped.filter((s) => current === "All" || s.product === current).map((s) =>
      `<li><time datetime="${esc(s.date)}">${short(s.date)}</time><span class="prod">${esc(s.product)}</span>` +
      `<div><b>${esc(s.title)}</b><p>${esc(s.benefit)}</p></div>` +
      (s.hours === undefined ? "<span></span>" : `<span class="took" title="Opened for review to shipped">${took(s.hours)}</span>`) + `</li>`).join("");
  };
  $("chips").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { current = b.dataset.p; draw(); } });
  draw();
  const soon = (list, k) => list.map((s) => `<li><span class="prod">${esc(s.product)}${s[k] ? ` · in review since ${short(s[k])}` : ""}</span><b>${esc(s.title)}</b><p>${esc(s.benefit)}</p></li>`).join("");
  $("review").innerHTML = soon(d.inReview, "opened");
  $("upcoming").innerHTML = soon(d.upcoming);

  $("history").innerHTML = d.history.map((h) =>
    `<div><h3>${esc(h.month)} 2026</h3><ul>${h.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("");
}

render();
