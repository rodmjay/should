/* @should/design-system 0.14.2: generated from src/ by scripts/build.mjs; edit src/, not this file */
(() => {
// English and Spanish for every site (one kit, same rules everywhere).
// Our own dictionaries, never a browser or widget translation: pages set
// translate="no" and <meta name="google" content="notranslate">.
//
// Which language shows first, in order:
//   1. the URL: a /es/ or /en/ path segment, or ?lang=es  (an edge redirect can set either)
//   2. the visitor's own choice from the language menu, remembered in localStorage
//   3. a server hint: <meta name="lang-hint" content="es"> (for example from a CDN's country header)
//   4. the browser's languages (navigator.languages)
//   5. the time zone, for Spanish-speaking regions
//   6. English
//
//   import { pickLang, applyLang, translate, langMenu } from "@should/design-system/i18n.js";
// Static pages without modules can load dist/i18n.global.js, which sets window.DSI18n.

const SUPPORTED = ["en", "es"];
const HTML_LANG = { en: "en", es: "es-419" };
const NAMES = { en: "English", es: "Español" };
const KEY = "ds-lang";

// Spanish-speaking time zones (Latin America, Spain); a hint only, the menu always wins
const ES_ZONES = new Set([
  "America/Costa_Rica", "America/Mexico_City", "America/Monterrey", "America/Merida", "America/Cancun", "America/Chihuahua",
  "America/Tijuana", "America/Hermosillo", "America/Mazatlan", "America/Guatemala", "America/El_Salvador", "America/Tegucigalpa",
  "America/Managua", "America/Panama", "America/Bogota", "America/Caracas", "America/Lima", "America/Guayaquil", "America/La_Paz",
  "America/Santiago", "America/Asuncion", "America/Montevideo", "America/Argentina/Buenos_Aires", "America/Argentina/Cordoba",
  "America/Argentina/Mendoza", "America/Santo_Domingo", "America/Havana", "America/Puerto_Rico", "Europe/Madrid", "Atlantic/Canary",
]);

const ok = (l) => (l && SUPPORTED.includes(l) ? l : null);
const short = (l) => String(l || "").toLowerCase().split(/[-_]/)[0];

function store(lang) {
  try { lang ? localStorage.setItem(KEY, lang) : localStorage.removeItem(KEY); } catch (e) { /* private mode: choice lasts this visit */ }
}
function stored() {
  try { return localStorage.getItem(KEY); } catch (e) { return null; }
}

function pickLang({ fallback = "en", url = globalThis.location, doc = globalThis.document, nav = globalThis.navigator } = {}) {
  if (url) {
    const seg = url.pathname.split("/").map(short).find((s) => SUPPORTED.includes(s));
    const q = ok(short(new URLSearchParams(url.search).get("lang")));
    if (q) return q;
    if (seg) return seg;
  }
  const mine = ok(stored());
  if (mine) return mine;
  const hint = ok(short(doc?.querySelector('meta[name="lang-hint"]')?.content));
  if (hint) return hint;
  for (const l of nav?.languages || [nav?.language]) { const s = ok(short(l)); if (s) return s; }
  try { if (ES_ZONES.has(Intl.DateTimeFormat().resolvedOptions().timeZone)) return "es"; } catch (e) { /* no Intl */ }
  return fallback;
}

// Set the document language and keep browsers from machine-translating over our copy
function applyLang(lang, doc = globalThis.document) {
  const root = doc.documentElement;
  root.lang = HTML_LANG[lang] || lang;
  root.setAttribute("translate", "no");
  root.classList.add("notranslate");
}

// Look up "a.b.c" in a dictionary; {name} placeholders are filled from vars
function t(dict, key, vars) {
  let v = key.split(".").reduce((o, k) => (o == null ? o : o[k]), dict);
  if (v == null) { console.warn(`i18n: missing "${key}"`); return key; }
  if (typeof v === "string" && vars) v = v.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return v;
}

// Fill the page: data-i18n (text), data-i18n-html (trusted markup from our own dictionary),
// data-i18n-attr="aria-label:key;content:key"
function translate(dict, root = globalThis.document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(dict, el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(dict, el.dataset.i18nHtml); });
  root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(dict, key));
    });
  });
}

// The language menu: a native <select>, so it works by keyboard and screen reader everywhere.
// onChange(lang) re-renders the page; the choice is remembered and put in the URL (?lang=).
function langMenu(container, { current, label = "Language", onChange } = {}) {
  container.classList.add("ds-lang");
  container.innerHTML = `<label><span class="ds-lang-label">${label}</span><select aria-label="${label}">${SUPPORTED
    .map((l) => `<option value="${l}" lang="${HTML_LANG[l]}"${l === current ? " selected" : ""}>${NAMES[l]}</option>`)
    .join("")}</select></label>`;
  const sel = container.querySelector("select");
  sel.addEventListener("change", () => {
    const lang = sel.value;
    store(lang);
    try {
      const u = new URL(globalThis.location.href);
      u.searchParams.set("lang", lang);
      history.replaceState(null, "", u);
    } catch (e) { /* file:// or sandboxed frame */ }
    onChange?.(lang);
  });
  return { set(lang, newLabel) { sel.value = lang; if (newLabel) { sel.setAttribute("aria-label", newLabel); container.querySelector(".ds-lang-label").textContent = newLabel; } } };
}

// Compare two dictionaries: every key, array length and value type must match,
// and no string may be empty. Returns a list of problems (empty means OK).
function compareDicts(a, b, names = ["en", "es"]) {
  const out = [];
  const walk = (x, y, path) => {
    const tx = Array.isArray(x) ? "array" : typeof x, ty = Array.isArray(y) ? "array" : typeof y;
    if (y === undefined) return out.push(`${path}: missing in ${names[1]}`);
    if (x === undefined) return out.push(`${path}: missing in ${names[0]}`);
    if (tx !== ty) return out.push(`${path}: ${names[0]} is ${tx}, ${names[1]} is ${ty}`);
    if (tx === "array") {
      if (x.length !== y.length) out.push(`${path}: ${names[0]} has ${x.length} items, ${names[1]} has ${y.length}`);
      for (let i = 0; i < Math.max(x.length, y.length); i++) walk(x[i], y[i], `${path}[${i}]`);
    } else if (tx === "object" && x && y) {
      for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) walk(x[k], y[k], path ? `${path}.${k}` : k);
    } else if (tx === "string") {
      if (!x.trim()) out.push(`${path}: empty in ${names[0]}`);
      if (!y.trim()) out.push(`${path}: empty in ${names[1]}`);
    }
  };
  walk(a, b, "");
  return out;
}

window.DSI18n = { SUPPORTED, HTML_LANG, NAMES, pickLang, applyLang, t, translate, langMenu, compareDicts };
})();
