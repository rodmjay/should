/* @should/design-system 0.14.0: generated from src/ by scripts/build.mjs; edit src/, not this file */
(() => {
// Charts: plain SVG, themed by the M3 roles and the series colors, so every brand, light and dark, comes free.
// No library: the same file works on static pages, the portal and TV (Svelte), and Next.js (client component).
//
//   import { mount } from "@should/design-system/charts.js";
//   mount(el, { type: "line", labels: ["Mon", "Tue"], series: [{ name: "Opus", values: [3, 5] }], unit: "$" });
//   types: line, area, bar (grouped | stacked, horizontal), donut, sparkline, gauge, heatmap, calendar
//   HTML helpers: statTile(), barTable()  ·  pure SVG strings: svg(spec, width)
//
// Rules this follows (design/STANDARDS.md, the dataviz method): series colors in fixed order, never cycled, and a
// 9th series folds into "Other"; one y-axis only; a legend for 2+ series plus direct labels when there are 4 or
// fewer; text in the text roles, never a series color; 2px lines, 4px rounded bar ends, 2px gaps between fills;
// a crosshair or per-mark tooltip on hover; a "Show table" view, so nothing is color alone; EN and ES.

const STRINGS = {
  en: { table: "Show table", hide: "Hide table", other: "Other", total: "Total", of: "of", none: "No data yet" },
  es: { table: "Ver tabla", hide: "Ocultar tabla", other: "Otros", total: "Total", of: "de", none: "Aún no hay datos" },
};
const MAX_SERIES = 8;
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const col = (i) => `var(--ds-series-${i + 1})`;
const langOf = (o) => ((o.lang || (typeof document !== "undefined" && document.documentElement.lang) || "en").toLowerCase().startsWith("es") ? "es" : "en");
const S = (o) => Object.assign({}, STRINGS[langOf(o)], o.strings);

function fmt(v, o = {}) {
  if (v == null || Number.isNaN(v)) return "–";
  const loc = langOf(o) === "es" ? "es-419" : "en-US";
  const compact = Math.abs(v) >= 10000, money = o.unit === "$";
  const dec = compact ? 1 : o.decimals ?? (money && Math.abs(v) < 1000 ? 2 : v % 1 === 0 ? 0 : Math.abs(v) < 10 ? 2 : Math.abs(v) < 100 ? 1 : 0);
  const n = new Intl.NumberFormat(loc, { maximumFractionDigits: dec, minimumFractionDigits: money && !compact ? dec : 0, notation: compact ? "compact" : "standard" }).format(v);
  return o.unit === "$" ? (v < 0 ? "-$" + n.replace("-", "") : "$" + n) : o.unit ? `${n} ${o.unit}` : n;
}

function niceTicks(max, count = 4) {
  if (!(max > 0)) return [0, 1];
  const raw = max / count, mag = 10 ** Math.floor(Math.log10(raw)), norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const ticks = []; for (let t = 0; t <= max + step * 0.001; t += step) ticks.push(+t.toFixed(10));
  if (ticks.at(-1) < max) ticks.push(+(ticks.at(-1) + step).toFixed(10));
  return ticks;
}

// A 9th+ series folds into "Other" (summed), never a new hue
function foldSeries(series, s) {
  if (series.length <= MAX_SERIES) return series;
  const keep = series.slice(0, MAX_SERIES - 1), rest = series.slice(MAX_SERIES - 1);
  const values = rest[0].values.map((_, i) => rest.reduce((a, r) => a + (r.values[i] || 0), 0));
  return [...keep, { name: s.other, values, other: true }];
}
const seriesColor = (sr, i) => (sr.other ? "var(--ds-series-9)" : sr.color || col(i));

const textAttrs = `font-family="var(--md-ref-typeface-plain)" fill="var(--md-sys-color-on-surface-variant)"`;
const roundTop = (x, y, w, h, r) => { // a bar with 4px rounded data end, square at the baseline
  r = Math.min(r, w / 2, Math.abs(h)); if (h <= 0) return "";
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
};
const roundRight = (x, y, w, h, r) => {
  r = Math.min(r, h / 2, w); if (w <= 0) return "";
  return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
};

// ---------- cartesian: line, area, bar ----------
function cartesian(spec, W) {
  const s = S(spec), H = spec.height || 240, horizontal = spec.type === "bar" && spec.horizontal;
  const series = foldSeries(spec.series || [], s), labels = spec.labels || [];
  const stacked = spec.type === "bar" && spec.stacked;
  const n = labels.length;
  if (!n || !series.length) return { svg: empty(W, H, s), table: "" };
  const totals = labels.map((_, i) => series.reduce((a, r) => a + Math.max(0, r.values[i] || 0), 0));
  const max = stacked ? Math.max(...totals) : Math.max(0, ...series.flatMap((r) => r.values.map((v) => v || 0)));
  const ticks = niceTicks(max), top = ticks.at(-1), tickFmt = (t) => fmt(t, { ...spec, decimals: ticks.every((x) => x % 1 === 0) ? 0 : undefined });
  const direct = series.length <= 4 && spec.type !== "bar" && series.length > 1;
  const longest = Math.max(...series.map((r) => r.name.length));
  const pad = { t: 12, r: direct ? Math.min(140, 12 + longest * 7) : 12, b: 28, l: horizontal ? Math.min(160, 16 + Math.max(...labels.map((l) => String(l).length)) * 7) : 12 + Math.max(...ticks.map((t) => tickFmt(t).length)) * 7 };
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  let g = "";
  const tipData = labels.map((lab, i) => ({ label: lab, rows: series.map((r, k) => ({ name: r.name, value: r.values[i], color: seriesColor(r, k) })) }));

  if (horizontal) {
    const band = ih / n, bw = Math.max(4, (band - 8) / (stacked ? 1 : series.length) - 2);
    ticks.forEach((t) => { const x = pad.l + (t / top) * iw; g += `<line x1="${x}" x2="${x}" y1="${pad.t}" y2="${pad.t + ih}" stroke="var(--md-sys-color-outline-variant)" stroke-width="1"/><text x="${x}" y="${H - 8}" text-anchor="middle" font-size="11" ${textAttrs}>${esc(tickFmt(t))}</text>`; });
    labels.forEach((lab, i) => {
      const y0 = pad.t + i * band + 4;
      g += `<text x="${pad.l - 8}" y="${y0 + (band - 8) / 2 + 4}" text-anchor="end" font-size="12" ${textAttrs}>${esc(lab)}</text>`;
      let acc = 0;
      series.forEach((r, k) => {
        const v = Math.max(0, r.values[i] || 0), w = (v / top) * iw;
        const x = pad.l + (stacked ? (acc / top) * iw : 0), y = y0 + (stacked ? 0 : k * (bw + 2));
        const last = !stacked || k === series.length - 1 || series.slice(k + 1).every((q) => !(q.values[i] > 0));
        const path = last ? roundRight(x, y, Math.max(0, w - (stacked && k ? 2 : 0)), stacked ? band - 8 : bw, 4) : `M${x},${y}h${Math.max(0, w - 2)}v${stacked ? band - 8 : bw}h${-Math.max(0, w - 2)}Z`;
        g += `<path d="${path}" fill="${seriesColor(r, k)}" data-tip="${esc(lab)} · ${esc(r.name)}: ${esc(fmt(v, spec))}"><title>${esc(lab)}, ${esc(r.name)}: ${esc(fmt(v, spec))}</title></path>`;
        acc += v;
      });
    });
  } else {
    ticks.forEach((t) => { const y = pad.t + ih - (t / top) * ih; g += `<line x1="${pad.l}" x2="${pad.l + iw}" y1="${y}" y2="${y}" stroke="var(--md-sys-color-outline-variant)" stroke-width="1"/><text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" font-size="11" ${textAttrs}>${esc(tickFmt(t))}</text>`; });
    const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 56))));
    const xAt = spec.type === "bar" ? (i) => pad.l + (i + 0.5) * (iw / n) : (i) => pad.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
    labels.forEach((lab, i) => { if (i % every === 0) g += `<text x="${xAt(i)}" y="${H - 8}" text-anchor="middle" font-size="11" ${textAttrs}>${esc(lab)}</text>`; });
    const yAt = (v) => pad.t + ih - (v / top) * ih;
    if (spec.type === "bar") {
      const band = iw / n, bw = Math.max(3, (band - 6) / (stacked ? 1 : series.length) - 2);
      labels.forEach((lab, i) => {
        let acc = 0;
        const x0 = pad.l + i * band + 3 + (stacked ? (band - 6 - Math.min(bw, 48)) / 2 : 0);
        series.forEach((r, k) => {
          const v = Math.max(0, r.values[i] || 0), h = (v / top) * ih, w = stacked ? Math.min(bw, 48) : bw;
          const x = x0 + (stacked ? 0 : k * (bw + 2)), y = yAt((stacked ? acc : 0) + v);
          const last = !stacked || series.slice(k + 1).every((q) => !(q.values[i] > 0));
          const gap = stacked && k ? 2 : 0;
          const path = last ? roundTop(x, y, w, h - gap, 4) : `M${x},${y}h${w}v${Math.max(0, h - gap)}h${-w}Z`;
          g += `<path d="${path}" fill="${seriesColor(r, k)}" data-tip="${esc(lab)} · ${esc(r.name)}: ${esc(fmt(v, spec))}"><title>${esc(lab)}, ${esc(r.name)}: ${esc(fmt(v, spec))}</title></path>`;
          acc += v;
        });
      });
    } else {
      series.forEach((r, k) => {
        const pts = r.values.map((v, i) => [xAt(i), yAt(v || 0)]);
        const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");
        if (spec.type === "area") g += `<path d="${d}L${pts.at(-1)[0]},${pad.t + ih}L${pts[0][0]},${pad.t + ih}Z" fill="${seriesColor(r, k)}" fill-opacity="${series.length > 1 ? 0.14 : 0.2}"/>`;
        g += `<path d="${d}" fill="none" stroke="${seriesColor(r, k)}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
        const end = pts.at(-1);
        g += `<circle cx="${end[0]}" cy="${end[1]}" r="4" fill="${seriesColor(r, k)}" stroke="var(--md-sys-color-surface)" stroke-width="2"/>`;
        if (direct) g += `<text x="${end[0] + 8}" y="${end[1] + 4}" font-size="12" font-family="var(--md-ref-typeface-plain)" fill="var(--md-sys-color-on-surface)">${esc(r.name)}</text>`;
      });
      g += `<line class="ds-chart-cross" x1="0" x2="0" y1="${pad.t}" y2="${pad.t + ih}" stroke="var(--md-sys-color-outline)" stroke-width="1" visibility="hidden"/>`;
      g += `<rect class="ds-chart-hit" x="${pad.l}" y="${pad.t}" width="${iw}" height="${ih}" fill="transparent" data-xs="${labels.map((_, i) => xAt(i).toFixed(1)).join(",")}"/>`;
    }
    g += `<line x1="${pad.l}" x2="${pad.l + iw}" y1="${pad.t + ih}" y2="${pad.t + ih}" stroke="var(--md-sys-color-outline)" stroke-width="1"/>`;
  }
  const svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(spec.title || "")}">${g}</svg>`;
  const table = `<table class="ds-table"><thead><tr><th></th>${series.map((r) => `<th class="num">${esc(r.name)}</th>`).join("")}</tr></thead><tbody>` +
    labels.map((lab, i) => `<tr><td>${esc(lab)}</td>${series.map((r) => `<td class="num">${esc(fmt(r.values[i], spec))}</td>`).join("")}</tr>`).join("") + `</tbody></table>`;
  return { svg, table, legend: series.length > 1 ? legend(series) : "", tips: tipData };
}

function legend(items) {
  return `<ul class="ds-legend">${items.map((r, k) => `<li><span class="ds-legend-key" style="background:${seriesColor(r, k)}"></span>${esc(r.name ?? r.label)}</li>`).join("")}</ul>`;
}
const empty = (W, H, s) => `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><text x="${W / 2}" y="${H / 2}" text-anchor="middle" font-size="13" ${textAttrs}>${esc(s.none)}</text></svg>`;

// ---------- donut ----------
function donut(spec, W) {
  const s = S(spec);
  let items = (spec.items || []).filter((x) => x.value > 0);
  if (items.length > MAX_SERIES) { const rest = items.slice(MAX_SERIES - 1); items = [...items.slice(0, MAX_SERIES - 1), { label: s.other, value: rest.reduce((a, x) => a + x.value, 0), other: true }]; }
  const H = spec.height || 200, size = Math.min(H, W), r = size / 2 - 4, ri = r * 0.62, cx = size / 2, cy = size / 2;
  const total = items.reduce((a, x) => a + x.value, 0);
  if (!total) return { svg: empty(W, H, s), table: "" };
  let a0 = -Math.PI / 2, g = "";
  items.forEach((it, k) => {
    const frac = it.value / total, a1 = a0 + frac * Math.PI * 2, gap = items.length > 1 ? 0.012 : 0;
    const s0 = a0 + gap, s1 = Math.max(s0, a1 - gap), large = s1 - s0 > Math.PI ? 1 : 0;
    const p = (rad, ang) => `${(cx + rad * Math.cos(ang)).toFixed(2)},${(cy + rad * Math.sin(ang)).toFixed(2)}`;
    const d = frac >= 0.9999 ? `M${p(r, 0)}A${r},${r} 0 1 1 ${p(r, Math.PI)}A${r},${r} 0 1 1 ${p(r, 0)}M${p(ri, 0)}A${ri},${ri} 0 1 0 ${p(ri, Math.PI)}A${ri},${ri} 0 1 0 ${p(ri, 0)}Z`
      : `M${p(r, s0)}A${r},${r} 0 ${large} 1 ${p(r, s1)}L${p(ri, s1)}A${ri},${ri} 0 ${large} 0 ${p(ri, s0)}Z`;
    const label = `${it.label}: ${fmt(it.value, spec)} (${Math.round(frac * 100)}%)`;
    g += `<path d="${d}" fill="${it.other ? "var(--ds-series-9)" : it.color || col(k)}" fill-rule="evenodd" data-tip="${esc(label)}"><title>${esc(label)}</title></path>`;
    a0 = a1;
  });
  g += `<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="${Math.round(size / 8)}" font-weight="600" font-family="var(--md-ref-typeface-brand)" fill="var(--md-sys-color-on-surface)">${esc(spec.center ?? fmt(total, spec))}</text>`;
  g += `<text x="${cx}" y="${cy + size / 10}" text-anchor="middle" font-size="12" ${textAttrs}>${esc(spec.centerLabel ?? s.total)}</text>`;
  const svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${esc(spec.title || "")}">${g}</svg>`;
  const table = `<table class="ds-table"><tbody>${items.map((it) => `<tr><td>${esc(it.label)}</td><td class="num">${esc(fmt(it.value, spec))}</td><td class="num">${Math.round((it.value / total) * 100)}%</td></tr>`).join("")}</tbody></table>`;
  return { svg, table, legend: legend(items.map((x) => ({ ...x, name: `${x.label} · ${fmt(x.value, spec)}` }))) };
}

// ---------- sparkline ----------
function sparkline(values, o = {}) {
  const W = o.width || 96, H = o.height || 28, v = values || [];
  if (v.length < 2) return "";
  const min = Math.min(...v), max = Math.max(...v), span = max - min || 1;
  const pts = v.map((x, i) => [(i / (v.length - 1)) * (W - 6) + 3, H - 3 - ((x - min) / span) * (H - 6)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");
  const c = o.color || "var(--md-sys-color-primary)", end = pts.at(-1);
  return `<svg class="ds-spark" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">` +
    `<path d="${d}L${end[0]},${H}L${pts[0][0]},${H}Z" fill="${c}" fill-opacity="0.12"/>` +
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<circle cx="${end[0]}" cy="${end[1]}" r="3" fill="${c}"/></svg>`;
}

// ---------- gauge (one value against a target or a limit) ----------
function gauge(spec, W) {
  const s = S(spec), size = Math.min(W, spec.height ? spec.height * 2 : 240), H = size / 2 + 28;
  const max = spec.max || 100, frac = Math.max(0, Math.min(1, (spec.value || 0) / max));
  const cx = size / 2, cy = size / 2, r = size / 2 - 12, sw = Math.max(10, size / 14);
  const arc = (f) => { const a = Math.PI + f * Math.PI; return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`; };
  const tone = spec.tone === "warning" ? "var(--warning)" : spec.tone === "error" ? "var(--md-sys-color-error)" : spec.tone === "success" ? "var(--success)" : "var(--md-sys-color-primary)";
  let g = `<path d="M${arc(0)}A${r},${r} 0 0 1 ${arc(1)}" fill="none" stroke="var(--md-sys-color-surface-container-highest)" stroke-width="${sw}" stroke-linecap="round"/>`;
  if (frac > 0) g += `<path d="M${arc(0)}A${r},${r} 0 0 1 ${arc(frac)}" fill="none" stroke="${tone}" stroke-width="${sw}" stroke-linecap="round"/>`;
  if (spec.target != null) { const tf = Math.min(1, spec.target / max), a = Math.PI + tf * Math.PI; g += `<line x1="${cx + (r - sw) * Math.cos(a)}" y1="${cy + (r - sw) * Math.sin(a)}" x2="${cx + (r + sw) * Math.cos(a)}" y2="${cy + (r + sw) * Math.sin(a)}" stroke="var(--md-sys-color-on-surface)" stroke-width="2"/>`; }
  g += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="${Math.round(size / 7)}" font-weight="600" font-family="var(--md-ref-typeface-brand)" fill="var(--md-sys-color-on-surface)">${esc(fmt(spec.value, spec))}</text>`;
  g += `<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" ${textAttrs}>${esc(spec.label ?? `${s.of} ${fmt(max, spec)}`)}</text>`;
  const label = `${fmt(spec.value, spec)} ${s.of} ${fmt(max, spec)}`;
  return { svg: `<svg viewBox="0 0 ${size} ${H}" width="${size}" height="${H}" role="img" aria-label="${esc(spec.title ? spec.title + ": " : "")}${esc(label)}">${g}</svg>`, table: "" };
}

// ---------- heatmap and calendar (sequential: one hue, the brand primary, light to dark) ----------
const STEPS = [0, 18, 38, 62, 88];
const seqFill = (f) => (f == null ? "var(--md-sys-color-surface-container)" : `color-mix(in oklab, var(--md-sys-color-primary) ${STEPS[Math.min(4, 1 + Math.floor(f * 3.999))]}%, var(--md-sys-color-surface-container-low))`);
function heatmap(spec, W) {
  const rows = spec.rows || [], cols = spec.cols || [], vals = spec.values || [];
  const flat = vals.flat().filter((v) => v != null), max = Math.max(1, ...flat);
  const padL = 12 + Math.max(...rows.map((r) => String(r).length)) * 7, padT = 20;
  const cell = Math.max(10, Math.min(36, (W - padL) / Math.max(1, cols.length))) , gap = 2;
  const H = padT + rows.length * cell + 8;
  let g = "";
  cols.forEach((c, j) => { if (cols.length < 16 || j % Math.ceil(cols.length / 12) === 0) g += `<text x="${padL + j * cell + cell / 2}" y="12" text-anchor="middle" font-size="11" ${textAttrs}>${esc(c)}</text>`; });
  rows.forEach((r, i) => {
    g += `<text x="${padL - 8}" y="${padT + i * cell + cell / 2 + 4}" text-anchor="end" font-size="12" ${textAttrs}>${esc(r)}</text>`;
    cols.forEach((c, j) => {
      const v = vals[i]?.[j], tip = `${r} · ${c}: ${fmt(v, spec)}`;
      g += `<rect x="${padL + j * cell}" y="${padT + i * cell}" width="${cell - gap}" height="${cell - gap}" rx="3" fill="${seqFill(v == null ? null : v / max)}" data-tip="${esc(tip)}"><title>${esc(tip)}</title></rect>`;
    });
  });
  const w = padL + cols.length * cell;
  return { svg: `<svg viewBox="0 0 ${w} ${H}" width="${w}" height="${H}" role="img" aria-label="${esc(spec.title || "")}">${g}</svg>`, table: "", legend: scaleLegend(spec, max) };
}
function calendar(spec, W) {
  // days: [{ date: "2026-11-19", value }] → weeks as columns, Monday first
  const days = [...(spec.days || [])].sort((a, b) => a.date.localeCompare(b.date));
  if (!days.length) return { svg: empty(W, 120, S(spec)), table: "" };
  const lang = langOf(spec) === "es" ? "es-419" : "en-US";
  const start = new Date(days[0].date + "T00:00:00"), dow = (d) => (d.getDay() + 6) % 7;
  const byWeek = new Map();
  const monday = new Date(start); monday.setDate(start.getDate() - dow(start));
  days.forEach((d) => { const dt = new Date(d.date + "T00:00:00"), wk = Math.floor(Math.round((dt - monday) / 864e5) / 7); byWeek.set(wk, [...(byWeek.get(wk) || []), { ...d, dow: dow(dt) }]); });  // round: DST days are 23 or 25 hours
  const weeks = Math.max(...byWeek.keys()) + 1, max = Math.max(1, ...days.map((d) => d.value || 0));
  const padL = 28, padT = 4, cell = Math.max(10, Math.min(18, (W - padL) / weeks)), H = padT + 7 * cell + 4;
  const dayNames = [...Array(7)].map((_, i) => new Intl.DateTimeFormat(lang, { weekday: "narrow" }).format(new Date(2024, 0, 1 + i)));
  let g = [0, 2, 4].map((i) => `<text x="${padL - 6}" y="${padT + i * cell + cell / 2 + 4}" text-anchor="end" font-size="10" ${textAttrs}>${dayNames[i]}</text>`).join("");
  byWeek.forEach((list, wk) => list.forEach((d) => {
    const tip = `${new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(new Date(d.date + "T00:00:00"))}: ${fmt(d.value, spec)}`;
    g += `<rect x="${padL + wk * cell}" y="${padT + d.dow * cell}" width="${cell - 2}" height="${cell - 2}" rx="2" fill="${seqFill(d.value == null ? null : d.value / max)}" data-tip="${esc(tip)}"><title>${esc(tip)}</title></rect>`;
  }));
  const w = padL + weeks * cell;
  return { svg: `<svg viewBox="0 0 ${w} ${H}" width="${w}" height="${H}" role="img" aria-label="${esc(spec.title || "")}">${g}</svg>`, table: "", legend: scaleLegend(spec, max) };
}
const scaleLegend = (spec, max) => `<div class="ds-legend ds-legend-scale"><span>${esc(fmt(0, spec))}</span>${STEPS.slice(1).map((_, i) => `<span class="ds-legend-key" style="background:${seqFill((i + 0.5) / 4)}"></span>`).join("")}<span>${esc(fmt(max, spec))}</span></div>`;

// ---------- HTML helpers ----------
function statTile(o) {
  // { label, value, unit, delta (number, e.g. 0.12 = +12%), goodWhen: "up" | "down", trend: [numbers] }
  const s = S(o), d = o.delta, good = d == null || d === 0 ? null : (d > 0) === ((o.goodWhen || "up") === "up");
  const arrow = d == null ? "" : d > 0 ? "▲" : d < 0 ? "▼" : "–";
  const pct = d == null ? "" : `${arrow} ${fmt(Math.abs(d * 100), { ...o, unit: "", decimals: 0 })}%`;
  return `<div class="ds-stat"><span class="ds-stat-label">${esc(o.label)}</span><span class="ds-stat-value ds-figure">${esc(typeof o.value === "number" ? fmt(o.value, o) : o.value)}</span>` +
    `<span class="ds-stat-foot">${pct ? `<span class="ds-stat-delta ${good == null ? "" : good ? "good" : "bad"}">${esc(pct)}</span>` : ""}${o.caption ? `<span>${esc(o.caption)}</span>` : ""}${o.trend ? sparkline(o.trend) : ""}</span></div>`;
}
function barTable(o) {
  // { rows: [{ label, value }], unit, max? } → a table with an inline bar per row
  const rows = o.rows || [], max = o.max || Math.max(1, ...rows.map((r) => r.value || 0));
  return `<table class="ds-table ds-bar-table"><tbody>${rows.map((r) => `<tr><td>${esc(r.label)}</td><td class="bar"><span style="--w:${(((r.value || 0) / max) * 100).toFixed(1)}%"></span></td><td class="num">${esc(fmt(r.value, o))}</td></tr>`).join("")}</tbody></table>`;
}

// ---------- render and mount ----------
function svg(spec, width = 600) {
  const t = spec.type;
  return (t === "donut" ? donut : t === "gauge" ? gauge : t === "heatmap" ? heatmap : t === "calendar" ? calendar : cartesian)(spec, width);
}

function mount(el, spec) {
  const s = S(spec);
  el.classList.add("ds-chart");
  const draw = () => {
    if (spec.type === "sparkline") { el.innerHTML = sparkline(spec.values, spec); return; }
    const W = Math.max(240, Math.floor(el.clientWidth || 600));
    const r = svg(spec, W);
    const tableId = "ds-chart-t" + Math.random().toString(36).slice(2, 8);
    el.innerHTML = (spec.title ? `<div class="ds-chart-title">${esc(spec.title)}</div>` : "") + (r.legend || "") +
      `<div class="ds-chart-plot">${r.svg}<div class="ds-chart-tip" role="status" hidden></div></div>` +
      (r.table ? `<button type="button" class="ds-btn text sm ds-chart-toggle" aria-expanded="false" aria-controls="${tableId}">${esc(s.table)}</button><div class="ds-table-wrap" id="${tableId}" hidden>${r.table}</div>` : "");
    wire(el, r, s, spec);
  };
  draw();
  if (typeof ResizeObserver !== "undefined" && spec.type !== "sparkline") {
    let w = el.clientWidth;
    const ro = new ResizeObserver(() => { if (Math.abs(el.clientWidth - w) > 8) { w = el.clientWidth; draw(); } });
    ro.observe(el);
    return { update: (next) => { Object.assign(spec, next); draw(); }, destroy: () => ro.disconnect() };
  }
  return { update: (next) => { Object.assign(spec, next); draw(); }, destroy() {} };
}

function wire(el, r, s, spec) {
  const plot = el.querySelector(".ds-chart-plot"), tip = el.querySelector(".ds-chart-tip");
  if (!plot) return;
  const show = (html, x, y) => {
    tip.innerHTML = html; tip.hidden = false;
    const pw = plot.clientWidth, tw = tip.offsetWidth;
    tip.style.left = `${Math.max(0, Math.min(x + 12, pw - tw))}px`; tip.style.top = `${Math.max(0, y - tip.offsetHeight - 8)}px`;
  };
  const hide = () => { tip.hidden = true; const c = el.querySelector(".ds-chart-cross"); if (c) c.setAttribute("visibility", "hidden"); };
  const hit = el.querySelector(".ds-chart-hit"), cross = el.querySelector(".ds-chart-cross");
  plot.addEventListener("pointermove", (e) => {
    const box = plot.getBoundingClientRect(), x = e.clientX - box.left, y = e.clientY - box.top;
    if (hit && r.tips) {
      const svgEl = plot.querySelector("svg"), scale = svgEl.viewBox.baseVal.width / svgEl.clientWidth || 1;
      const xs = hit.dataset.xs.split(",").map(Number), vx = x * scale;
      let i = 0; xs.forEach((p, k) => { if (Math.abs(p - vx) < Math.abs(xs[i] - vx)) i = k; });
      cross.setAttribute("x1", xs[i]); cross.setAttribute("x2", xs[i]); cross.setAttribute("visibility", "visible");
      const d = r.tips[i];
      show(`<strong>${esc(d.label)}</strong>` + d.rows.map((row) => `<span><i style="background:${row.color}"></i>${esc(row.name)} <b>${esc(fmt(row.value, spec))}</b></span>`).join(""), x, y);
      return;
    }
    const t = e.target.closest("[data-tip]");
    if (t) show(esc(t.dataset.tip), x, y); else hide();
  });
  plot.addEventListener("pointerleave", hide);
  const btn = el.querySelector(".ds-chart-toggle");
  if (btn) btn.addEventListener("click", () => {
    const t = el.querySelector(`#${btn.getAttribute("aria-controls")}`), open = t.hidden;
    t.hidden = !open; btn.setAttribute("aria-expanded", String(open)); btn.textContent = open ? s.hide : s.table;
  });
}

window.DSCharts = { STRINGS, fmt, sparkline, statTile, barTable, svg, mount };
})();
