/* @should/design-system 0.15.1: generated from src/ by scripts/build.mjs; edit src/, not this file */
(() => {
// "Needs you" badges on navigation (Rod 11/20: "red badge next to nav item if there is something needed of them on
// that tab"). M3 Badge in the error color: a small dot for one item, a count for two or more (99+ caps it).
// Only steps waiting on this user count, never general news. Plain DOM, EN and ES; updates in place, no reflow.
//   import { needsYou, navBadges } from "@should/design-system/badges.js";
//   needsYou(tabEl, 3);                                   // one nav item
//   navBadges(navEl, { brokers: 7, mail: 2, phone: 0 });  // items marked data-nav="brokers" etc.
// Works on .ds-tab, rail/bar items (put the icon in .ds-nav-icon) and drawer rows (.ds-list-item).
const STRINGS = {
  en: { one: "1 item needs you", many: "{n} items need you" },
  es: { one: "1 pendiente para ti", many: "{n} pendientes para ti" },
};

const langOf = (el, lang) => ((lang || el.closest("[lang]")?.lang || document.documentElement.lang || "en").toLowerCase().startsWith("es") ? "es" : "en");

function needsYou(el, count, opts = {}) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  const host = el.querySelector(":scope > .ds-nav-icon") || el;
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

window.DSBadges = { STRINGS, needsYou, navBadges };
})();
