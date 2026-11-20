(() => {
const STRINGS = {
  en: { one: "1 item needs you", many: "{n} items need you" },
  es: { one: "1 pendiente para ti", many: "{n} pendientes para ti" },
};

const langOf = (el, lang) => ((lang || el.closest("[lang]")?.lang || document.documentElement.lang || "en").toLowerCase().startsWith("es") ? "es" : "en");

function needsYou(el, count, opts = {}) {
  if (typeof count === "function") count = count();
  if (count && typeof count.then === "function") {
    const token = (el.__dsNeeds = (el.__dsNeeds || 0) + 1);  // a newer call wins over a slower older one
    count.then((v) => { if (el.__dsNeeds === token) needsYou(el, v, opts); }, () => { if (el.__dsNeeds === token) needsYou(el, 0, opts); });
    return;
  }
  el.__dsNeeds = (el.__dsNeeds || 0) + 1;  // a plain count also cancels any count still loading
  const n = Math.max(0, Math.floor(Number(count) || 0));
  const host = (!el.matches(".ds-nav-inline") && el.querySelector(":scope > .ds-nav-icon")) || el;  // inline icon + label: badge after the label
  let b = host.querySelector(":scope > .ds-badge[data-needs]");
  if (!n) { b?.remove(); el.removeAttribute("data-needs-you"); return; }
  const S = Object.assign({}, STRINGS[langOf(el, opts.lang)], opts.strings);
  if (!b) {
    b = document.createElement("span");
    b.className = "ds-badge";
    b.dataset.needs = "";
    host.append(b);
  }
  b.classList.toggle("dot", n === 1);
  b.textContent = n === 1 ? "" : n > 99 ? "99+" : String(n);
  b.setAttribute("aria-hidden", "true");
  let sr = el.querySelector(":scope > .ds-sr[data-needs]");
  if (!sr) {
    sr = document.createElement("span");
    sr.className = "ds-sr";
    sr.dataset.needs = "";
    el.append(sr);
  }
  sr.textContent = ", " + (n === 1 ? S.one : S.many.replace("{n}", n));
  el.setAttribute("data-needs-you", n);
}

function navBadges(root, counts = {}, opts = {}) {
  root.querySelectorAll("[data-nav]").forEach((el) => needsYou(el, counts[el.dataset.nav] ?? 0, opts));
}

const fromUrl = (url) => fetch(url, { credentials: "include", headers: { accept: "application/json" } })
  .then((r) => (r.ok ? r.json() : 0)).then((j) => (typeof j === "number" ? j : j?.needsYou ?? j?.count ?? 0));

function navBadgesFrom(root, sources = {}, opts = {}) {
  const run = () => root.querySelectorAll("[data-nav]").forEach((el) => {
    const src = sources[el.dataset.nav];
    if (src == null) return;
    needsYou(el, typeof src === "string" ? () => fromUrl(src).catch(() => 0) : src, opts);
  });
  run();
  const id = opts.every ? setInterval(run, Math.max(15000, opts.every)) : 0;
  const onVis = () => { if (document.visibilityState === "visible") run(); };
  document.addEventListener("visibilitychange", onVis);
  return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
}

window.DSBadges = { STRINGS, needsYou, navBadges, navBadgesFrom };
})();
