(() => {

const CUES = {
  headset: "M5 13a7 7 0 0 1 14 0M5 13v3h3v-4H5M19 13v3h-3v-4h3M16 17c0 2-2 3-4 3",
  clipboard: "M8 4h8v3H8zM6 6H5v15h14V6h-1M9 13l2 2 4-4",
  flag: "M6 21V4M6 4h11l-2 4 2 4H6",
  compass: "M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M15.5 8.5l-2 5-5 2 2-5z",
  stethoscope: "M6 4v5a4 4 0 0 0 8 0V4M10 13v3a4 4 0 0 0 8 0v-2M18 11.5m-1.6 0a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0",
  ledger: "M6 4h12v16H6zM9 8h6M9 12h6M9 16h3",
  magnifier: "M10 10m-5.5 0a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0-11 0M14 14l6 6",
  chat: "M4 5h16v11H10l-5 4v-4H4z",
  book: "M3 6c3-1 6-1 9 1 3-2 6-2 9-1v12c-3-1-6-1-9 1-3-2-6-2-9-1zM12 7v12",
  shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z",
  scales: "M12 4v16M7 20h10M5 8h14M5 8l-2.5 6h5zM19 8l-2.5 6h5z",
  briefcase: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  chart: "M4 20h16M7 16v-3M11 16V9M15 16v-5M19 16V6",
  plane: "M3 13l18-8-6 16-3-6z",
  cart: "M3 4h3l2 11h11l2-8H7M10 19.5m-1.2 0a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0M17 19.5m-1.2 0a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0",
  hanger: "M12 8a2 2 0 1 1 2-2M12 8v1.5L3 16h18l-9-6.5",
  house: "M4 11l8-7 8 7v9H4zM10 20v-5h4v5",
  paw: "M7.5 9.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M16.5 9.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M12 6.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M8 18c0-3 2-5.5 4-5.5s4 2.5 4 5.5c0 2-8 2-8 0",
  box: "M4 8l8-4 8 4v9l-8 4-8-4zM4 8l8 4 8-4M12 12v9",
  gift: "M4 10h16v4H4zM6 14h12v6H6zM12 10v10M12 10c-2-4-6-4-5-1M12 10c2-4 6-4 5-1",
  people: "M9 9m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M3 19c0-3 3-5 6-5s6 2 6 5M17 8m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M16.5 13.5c2.5 0 4.5 2 4.5 5",
  calendar: "M4 6h16v14H4zM4 10h16M8 4v4M16 4v4",
  clock: "M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0M12 8v4l3 2",
  note: "M9 18V5l10-2v13M9 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M19 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
  monitor: "M3 5h18v11H3zM9 20h6M12 16v4",
  megaphone: "M3 10v4h4l8 5V5L7 10zM18 9c1.3 1.3 1.3 4.7 0 6",
  film: "M4 5h16v14H4zM8 5v14M16 5v14M4 9h4M4 15h4M16 9h4M16 15h4",
  nib: "M12 3l6 8-6 10-6-10zM12 3v7.5M12 12m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0",
  pin: "M12 21s-6-6-6-11a6 6 0 0 1 12 0c0 5-6 11-6 11zM12 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
  building: "M5 20V4h10v16M15 9h4v11M8 8h4M8 12h4M8 16h4M3 20h18",
  ruler: "M4 20L20 4M4 20h6M4 20v-6M8 16l2 2M11 13l2 2M14 10l2 2",
  database: "M12 6m-7 0a7 2.5 0 1 0 14 0a7 2.5 0 1 0-14 0M5 6v12c0 1.4 3 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3 2.5 7 2.5s7-1.1 7-2.5",
  wrench: "M14.5 5.5a4 4 0 0 0 4 5.5L10 19.5 7 16.5 15.5 8a4 4 0 0 0-1-2.5z",
  puzzle: "M5 9h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v3H5v-4a2 2 0 1 0 0-4z",
  heart: "M12 20s-8-5-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 6-8 11-8 11z",
  code: "M8 7l-5 5 5 5M16 7l5 5-5 5",
  check: "M5 12l4 4 10-10",
  cloud: "M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11 2 3 3 0 0 0 1 6z",
  pie: "M12 4v8h8M12 4a8 8 0 1 0 8 8",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
};

const AVATARS = {
  "assistant":            { name: "Executive Assistant",    skin: 3, hair: 2, hairColor: 1, tone: 1, cue: "headset" },
  "coach":                { name: "Life Coach",             skin: 5, hair: 3, hairColor: 1, tone: 2, cue: "flag" },
  "business_coach":       { name: "Business Coach",         skin: 2, hair: 6, hairColor: 4, tone: 4, cue: "compass" },
  "bookkeeper":           { name: "Accountant",             skin: 4, hair: 4, hairColor: 2, tone: 3, cue: "ledger" },
  "financial":            { name: "Financial Advisor",      skin: 1, hair: 2, hairColor: 3, tone: 1, cue: "chart" },
  "career":               { name: "Career Assistant",       skin: 6, hair: 1, hairColor: 1, tone: 4, cue: "briefcase" },
  "health":               { name: "Health Agent",           skin: 3, hair: 5, hairColor: 2, tone: 2, cue: "stethoscope" },
  "investigator":         { name: "Investigator",           skin: 2, hair: 1, hairColor: 2, tone: 4, cue: "magnifier" },
  "scheduler":            { name: "Scheduler",              skin: 4, hair: 7, hairColor: 1, tone: 1, cue: "clock" },
  "travel":               { name: "Travel Agent",           skin: 5, hair: 2, hairColor: 2, tone: 3, cue: "plane" },
  "legal":                { name: "Legal Advisor",          skin: 1, hair: 4, hairColor: 5, tone: 4, cue: "scales" },
  "music":                { name: "Music Producer",         skin: 6, hair: 3, hairColor: 2, tone: 3, cue: "note" },
  "home-manager":         { name: "Home Manager",           skin: 3, hair: 6, hairColor: 1, tone: 2, cue: "house" },
  "relationship-manager": { name: "Relationship Manager",   skin: 2, hair: 5, hairColor: 3, tone: 1, cue: "people" },
  "gifts":                { name: "Gift Concierge",         skin: 4, hair: 3, hairColor: 2, tone: 3, cue: "gift" },
  "pr":                   { name: "PR Person",              skin: 1, hair: 7, hairColor: 2, tone: 1, cue: "megaphone" },
  "shopping":             { name: "Shopping Expert",        skin: 5, hair: 4, hairColor: 1, tone: 2, cue: "cart" },
  "clothier":             { name: "Clothier",               skin: 2, hair: 2, hairColor: 4, tone: 3, cue: "hanger" },
  "relocation":           { name: "Relocation Expert",      skin: 6, hair: 6, hairColor: 1, tone: 2, cue: "box" },
  "pets":                 { name: "Pet Expert",             skin: 3, hair: 4, hairColor: 3, tone: 4, cue: "paw" },
  "media":                { name: "Media Concierge",        skin: 4, hair: 5, hairColor: 1, tone: 3, cue: "film" },
  "local-guide":          { name: "Local Guide",            skin: 1, hair: 3, hairColor: 3, tone: 2, cue: "pin" },
  "events":               { name: "Event Planner",          skin: 5, hair: 7, hairColor: 2, tone: 1, cue: "calendar" },
  "business_analyst":     { name: "Business Analyst",       skin: 4, hair: 2, hairColor: 5, tone: 2, cue: "pie" },
  "business":             { name: "Business Executive",     skin: 3, hair: 1, hairColor: 5, tone: 4, cue: "building" },
  "it":                   { name: "IT Guy",                 skin: 2, hair: 3, hairColor: 2, tone: 4, cue: "wrench" },
  "webmaster":            { name: "Webmaster",              skin: 6, hair: 2, hairColor: 1, tone: 1, cue: "monitor" },
  "product":              { name: "Product Manager",        skin: 4, hair: 6, hairColor: 2, tone: 3, cue: "puzzle" },
  "designer":             { name: "Designer",               skin: 5, hair: 3, hairColor: 4, tone: 2, cue: "nib" },
  "dba":                  { name: "Database Administrator", skin: 1, hair: 6, hairColor: 2, tone: 4, cue: "database" },
  "text-concierge":       { name: "Text Concierge",         skin: 5, hair: 1, hairColor: 2, tone: 2, cue: "chat" },
  "philosopher":          { name: "Philosopher",            skin: 3, hair: 7, hairColor: 5, tone: 3, cue: "book" },
  "security":             { name: "Security Officer",       skin: 6, hair: 4, hairColor: 1, tone: 4, cue: "shield" },
  "compliance":           { name: "Compliance Officer",     skin: 2, hair: 5, hairColor: 4, tone: 1, cue: "clipboard" },
  "relationships":        { name: "Relationship Coach",     skin: 4, hair: 2, hairColor: 1, tone: 2, cue: "heart" },
  "as-architect":         { name: "Software Architect",     skin: 5, hair: 6, hairColor: 2, tone: 1, cue: "ruler" },
  "as-product":           { name: "Product Owner",          skin: 1, hair: 5, hairColor: 2, tone: 3, cue: "list" },
  "as-backend":           { name: "Backend Engineer",       skin: 3, hair: 3, hairColor: 1, tone: 4, cue: "code" },
  "as-qa":                { name: "QA Engineer",            skin: 6, hair: 7, hairColor: 2, tone: 2, cue: "check" },
  "as-devops":            { name: "DevOps Engineer",        skin: 2, hair: 4, hairColor: 3, tone: 3, cue: "cloud" },
};

const TONES = {
  1: { bg: "var(--md-sys-color-primary-container)", cloth: "var(--md-sys-color-primary)" },
  2: { bg: "var(--md-sys-color-secondary-container)", cloth: "var(--md-sys-color-secondary)" },
  3: { bg: "var(--md-sys-color-tertiary-container)", cloth: "var(--md-sys-color-tertiary)" },
  4: { bg: "var(--md-sys-color-surface-container-highest)", cloth: "var(--md-sys-color-on-surface-variant)" },
};

const HAIR = {
  1: { front: "M21 26c0-9 5-13 11-13s11 4 11 13c-2-5-6-7-11-7s-9 2-11 7z" },                                   // short crop
  2: { front: "M20.5 28c-1.5-12 7-16 13-15.5 7 .6 11 6 9.5 15-1.5-6-4-8.5-9-9-5 2.5-10 3.5-13.5 9.5z" },   // side part
  3: { back: "M32 23m-15.5 0a15.5 14 0 1 0 31 0a15.5 14 0 1 0-31 0" },                                       // full curls
  4: { back: "M32 9.5m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0", front: "M21 26c0-9 5-13 11-13s11 4 11 13c-2-5-6-7-11-7s-9 2-11 7z" }, // bun
  5: { back: "M19 27c0-10 6-15 13-15s13 5 13 15l1.5 17h-29z", front: "M21 25c0-8 5-12 11-12s11 4 11 12c-3-4-7-6-11-6s-8 2-11 6z" }, // long
  6: { front: "M22 22c2-6 6-8 10-8s8 2 10 8c-3-3-6-4-10-4s-7 1-10 4z" },                                     // close shave
  7: { front: "M20 27c-1-11 5-16 12-16s13 5 12 16c-2-6-6-8.5-12-8.5s-10 2.5-12 8.5zM32 11.5m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0", wrap: true }, // head wrap
};

let n = 0;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function avatarSVG(key, { size = 48, label, badge = true } = {}) {
  const a = AVATARS[key] || { name: label || key, skin: 3, hair: 1, hairColor: 1, tone: 4, cue: "people" };
  const t = TONES[a.tone] || TONES[4];
  const h = HAIR[a.hair] || HAIR[1];
  const hairFill = h.wrap ? t.cloth : `var(--ds-hair-${a.hairColor})`;
  const skin = `var(--ds-skin-${a.skin})`;
  const id = `ds-av-${++n}`;
  const name = esc(label || a.name);
  return `<svg class="ds-person" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="${name}">
<defs><clipPath id="${id}"><circle cx="32" cy="32" r="32"/></clipPath></defs>
<g clip-path="url(#${id})"><rect width="64" height="64" fill="${t.bg}"/>
${h.back ? `<path d="${h.back}" fill="${hairFill}"/>` : ""}
<path d="M10 66c0-15 9.5-22 22-22s22 7 22 22z" fill="${t.cloth}"/>
<path d="M28 36h8v9.5c0 2-8 2-8 0z" fill="${skin}"/>
<circle cx="32" cy="27" r="11" fill="${skin}"/>
${h.front ? `<path d="${h.front}" fill="${hairFill}"/>` : ""}</g>
${badge ? `<g transform="translate(40 40)"><circle cx="12" cy="12" r="11.5" fill="var(--md-sys-color-surface-container-lowest)" stroke="var(--md-sys-color-outline-variant)"/>
<g transform="translate(4.8 4.8) scale(.6)"><path d="${CUES[a.cue] || CUES.people}" fill="none" stroke="var(--md-sys-color-primary)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g></g>` : ""}
</svg>`;
}

window.DSAvatars = { AVATARS, CUES, avatarSVG };
})();
