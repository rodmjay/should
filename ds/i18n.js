export const SUPPORTED = ["en", "es"];
export const HTML_LANG = { en: "en", es: "es-419" };
export const NAMES = { en: "English", es: "Español" };
const KEY = "ds-lang";

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
  try { lang ? localStorage.setItem(KEY, lang) : localStorage.removeItem(KEY); } catch (e) {  }
}
function stored() {
  try { return localStorage.getItem(KEY); } catch (e) { return null; }
}

export function pickLang({ fallback = "en", url = globalThis.location, doc = globalThis.document, nav = globalThis.navigator } = {}) {
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
  try { if (ES_ZONES.has(Intl.DateTimeFormat().resolvedOptions().timeZone)) return "es"; } catch (e) {  }
  return fallback;
}

export function applyLang(lang, doc = globalThis.document) {
  const root = doc.documentElement;
  root.lang = HTML_LANG[lang] || lang;
  root.setAttribute("translate", "no");
  root.classList.add("notranslate");
}

export function t(dict, key, vars) {
  let v = key.split(".").reduce((o, k) => (o == null ? o : o[k]), dict);
  if (v == null) { console.warn(`i18n: missing "${key}"`); return key; }
  if (typeof v === "string" && vars) v = v.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  return v;
}

export function translate(dict, root = globalThis.document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(dict, el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(dict, el.dataset.i18nHtml); });
  root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(dict, key));
    });
  });
}

export function langMenu(container, { current, label = "Language", onChange } = {}) {
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
    } catch (e) {  }
    onChange?.(lang);
  });
  return { set(lang, newLabel) { sel.value = lang; if (newLabel) { sel.setAttribute("aria-label", newLabel); container.querySelector(".ds-lang-label").textContent = newLabel; } } };
}

export function compareDicts(a, b, names = ["en", "es"]) {
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
