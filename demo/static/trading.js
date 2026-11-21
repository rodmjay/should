// Trading page charts: ticker sparklines, a price chart with moving averages,
// strategy growth curves vs SPY, and the allocation donut. Plain SVG, no library.
(() => {
  const src = document.getElementById("mkt-data");
  if (!src) return;  // the desk unmounted before the script loaded (e.g. an old /r/wealth URL redirecting)
  const M = JSON.parse(src.textContent);
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const money = v => "$" + v.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const pct = v => (v >= 0 ? "+" : "") + (v * 100).toFixed(2) + "%";
  const fmtDate = s => new Date(s + "T12:00").toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"});
  const RANGE_DAYS = {"1M": 31, "3M": 92, "6M": 183, "1Y": 366, "3Y": 1096, "5Y": 1827, "All": 1e9};
  const since = (last, r) => r === "All" ? "0000" : new Date(new Date(last).getTime() - RANGE_DAYS[r] * 864e5).toISOString().slice(0, 10);

  function sma(v, n) {
    const out = []; let s = 0;
    v.forEach((x, i) => { s += x; if (i >= n) s -= v[i - n]; out.push(i >= n - 1 ? s / n : null); });
    return out;
  }

  // Sparklines: last ~30 sessions.
  M.tickers.forEach(t => {
    const svg = document.querySelector(`[data-spark="${t.sym}"]`);
    if (!svg) return;
    const c = t.c.slice(-30), lo = Math.min(...c), hi = Math.max(...c);
    const pts = c.map((v, i) => `${(i / (c.length - 1) * 100).toFixed(1)},${(26 - (v - lo) / (hi - lo || 1) * 24).toFixed(1)}`);
    el("polyline", {points: pts.join(" "), class: c[c.length - 1] >= c[0] ? "up" : "down"}, svg);
  });

  // Generic line chart: series = [{d: [...dates], v: [...], cls, label, dash}], dates shared or not.
  function lineChart(svg, series, opt = {}) {
    svg.innerHTML = "";
    const W = 760, H = 300, L = 8, R = 62, T = 12, B = 26;
    const all = series.flatMap(s => s.v.filter(v => v != null));
    if (!all.length) return;
    let lo = Math.min(...all), hi = Math.max(...all);
    const pad = (hi - lo) * 0.06 || hi * 0.01 || 1; lo -= pad; hi += pad;
    const d0 = series[0].d[0], d1 = series[0].d[series[0].d.length - 1];
    const t0 = Date.parse(d0), span = Math.max(Date.parse(d1) - t0, 1);
    const X = d => L + (Date.parse(d) - t0) / span * (W - L - R);
    const Y = v => T + (hi - v) / (hi - lo) * (H - T - B);
    for (let i = 0; i <= 4; i++) {
      const v = lo + pad + (hi - lo - 2 * pad) * i / 4;
      el("line", {x1: L, x2: W - R, y1: Y(v), y2: Y(v), class: "gridline"}, svg);
      el("text", {x: W - R + 6, y: Y(v) + 4, class: "tick"}, svg).textContent = opt.yfmt ? opt.yfmt(v) : v.toFixed(2);
    }
    const n = series[0].d.length;
    [0, Math.floor(n / 3), Math.floor(2 * n / 3), n - 1].forEach((i, k) => {
      el("text", {x: X(series[0].d[i]), y: H - 6, class: "tick", "text-anchor": k === 0 ? "start" : k === 3 ? "end" : "middle"}, svg)
        .textContent = fmtDate(series[0].d[i]);
    });
    if (opt.area) {
      const s = series[0];
      const top = s.d.map((d, i) => `${X(d).toFixed(1)},${Y(s.v[i]).toFixed(1)}`);
      el("polygon", {points: `${X(s.d[0])},${H - B} ${top.join(" ")} ${X(s.d[n - 1])},${H - B}`, class: "area " + s.cls}, svg);
    }
    series.forEach(s => {
      let d = "", pen = false;
      s.d.forEach((x, i) => {
        if (s.v[i] == null) { pen = false; return; }
        d += `${pen ? "L" : "M"}${X(x).toFixed(1)},${Y(s.v[i]).toFixed(1)}`; pen = true;
      });
      el("path", {d, class: "ln " + s.cls + (s.dash ? " dash" : "")}, svg);
    });
    // Hover: crosshair + readout.
    const cross = el("line", {y1: T, y2: H - B, class: "cross", visibility: "hidden"}, svg);
    const dots = series.map(s => el("circle", {r: 3.5, class: "dot " + s.cls, visibility: "hidden"}, svg));
    const tip = el("g", {visibility: "hidden"}, svg);
    const tipBox = el("rect", {class: "tipbox", rx: 6}, tip);
    const tipText = el("text", {class: "tiptext"}, tip);
    const hit = el("rect", {x: L, y: T, width: W - L - R, height: H - T - B, fill: "transparent"}, svg);
    const move = ev => {
      const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY;
      const x = p.matrixTransform(svg.getScreenCTM().inverse()).x;
      const target = t0 + (x - L) / (W - L - R) * span;
      const s0 = series[0];
      let i = 0; while (i < s0.d.length - 1 && Date.parse(s0.d[i + 1]) <= target) i++;
      const day = s0.d[i];
      cross.setAttribute("x1", X(day)); cross.setAttribute("x2", X(day)); cross.setAttribute("visibility", "visible");
      tipText.innerHTML = "";
      el("tspan", {x: 10, dy: 16, class: "tiphead"}, tipText).textContent = fmtDate(day);
      series.forEach((s, k) => {
        let j = s === s0 ? i : s.d.findIndex(d => d >= day);
        if (j < 0) j = s.d.length - 1;
        const v = s.v[j];
        if (v == null) { dots[k].setAttribute("visibility", "hidden"); return; }
        dots[k].setAttribute("cx", X(s.d[j])); dots[k].setAttribute("cy", Y(v)); dots[k].setAttribute("visibility", "visible");
        el("tspan", {x: 10, dy: 16, class: s.cls}, tipText).textContent = `${s.label}: ${opt.yfmt ? opt.yfmt(v) : v.toFixed(2)}`;
      });
      const bb = tipText.getBBox();
      tipBox.setAttribute("width", bb.width + 20); tipBox.setAttribute("height", bb.height + 12);
      const tx = X(day) + 12 + bb.width + 20 > W - R ? X(day) - bb.width - 32 : X(day) + 12;
      tip.setAttribute("transform", `translate(${tx},${T + 4})`); tip.setAttribute("visibility", "visible");
    };
    hit.addEventListener("pointermove", move);
    hit.addEventListener("pointerleave", () => {
      [cross, tip, ...dots].forEach(e => e.setAttribute("visibility", "hidden"));
    });
  }

  // Price chart.
  let sym = (M.tickers[0] || {}).sym, range = "1Y";
  function drawPrice() {
    const t = M.tickers.find(x => x.sym === sym);
    if (!t) return;
    const s50 = sma(t.c, 50), s200 = sma(t.c, 200);
    const from = since(t.date, range);
    const i0 = Math.max(t.d.findIndex(d => d >= from), 0);
    const d = t.d.slice(i0), c = t.c.slice(i0);
    const ch = c[c.length - 1] / c[0] - 1, cls = ch >= 0 ? "up" : "down";
    const series = [{d, v: c, cls: "l0 " + cls, label: t.sym}];
    if (range !== "1M") series.push({d, v: s50.slice(i0), cls: "sma50", label: "50d"});
    if (!["1M", "3M"].includes(range)) series.push({d, v: s200.slice(i0), cls: "sma200", label: "200d"});
    lineChart(document.getElementById("px-chart"), series, {area: true, yfmt: v => v.toFixed(2)});
    document.getElementById("px-title").textContent = `${t.sym} · ${t.name}`;
    document.getElementById("px-last").textContent = money(t.last);
    const pc = document.getElementById("px-chg");
    pc.textContent = `${pct(t.chg)} today`; pc.className = "chg " + (t.chg >= 0 ? "up" : "down");
    document.getElementById("px-sub").innerHTML = `${range}: <span class="chg ${cls}">${pct(ch)}</span> · close ${fmtDate(t.date)}`;
    document.querySelectorAll(".tk").forEach(b => b.classList.toggle("on", b.dataset.sym === sym));
  }
  const pick = s => { sym = s; drawPrice(); };
  document.querySelectorAll(".tk").forEach(b => b.addEventListener("click", () => pick(b.dataset.sym)));
  document.querySelectorAll("#holdings tr[data-sym]").forEach(r => r.addEventListener("click", () => {
    pick(r.dataset.sym); document.getElementById("price").scrollIntoView({behavior: "smooth", block: "start"});
  }));
  const segs = (id, fn) => document.querySelectorAll(`#${id} button`).forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(`#${id} button`).forEach(x => x.classList.toggle("on", x === b)); fn(b.dataset.r);
  }));
  segs("px-range", r => { range = r; drawPrice(); });
  drawPrice();

  // Strategies vs SPY.
  const PALETTE = ["c1", "c2", "c3", "c4", "c5"];
  function drawCurves(r) {
    const svg = document.getElementById("bt-chart");
    if (!svg || !M.curves.length) return;
    const last = M.curves[0].d[M.curves[0].d.length - 1], from = since(last, r);
    let k = 0;
    const series = M.curves.map(c => {
      const i0 = Math.max(c.d.findIndex(d => d >= from), 0), base = c.v[i0];
      return {d: c.d.slice(i0), v: c.v.slice(i0).map(v => v / base * 10000), label: c.name,
              cls: c.bench ? "bench" : PALETTE[k++ % PALETTE.length], dash: c.bench};
    });
    lineChart(svg, series, {yfmt: v => "$" + Math.round(v).toLocaleString()});
    document.getElementById("bt-legend").innerHTML = series.map(s => {
      const ret = s.v[s.v.length - 1] / 10000 - 1;
      return `<span class="lg ${s.cls}"></span>${s.label} <b class="chg ${ret >= 0 ? "up" : "down"}">${pct(ret)}</b>`;
    }).join(" &nbsp; ");
  }
  segs("bt-range", drawCurves);
  drawCurves("All");

  // Allocation donut.
  const donut = document.getElementById("alloc");
  if (donut && M.total) {
    const parts = M.positions.slice().sort((a, b) => b.value - a.value).map((p, i) => ({label: p.sym, v: p.value, cls: PALETTE[i % 5]}));
    if (M.cash) parts.push({label: "Cash", v: M.cash, cls: "cash"});
    let a = -Math.PI / 2;
    const R = 70, r = 46, cx = 80, cy = 80;
    parts.forEach(p => {
      const a1 = a + p.v / M.total * Math.PI * 2, big = a1 - a > Math.PI ? 1 : 0;
      const P = (rad, ang) => `${(cx + rad * Math.cos(ang)).toFixed(2)},${(cy + rad * Math.sin(ang)).toFixed(2)}`;
      el("path", {d: `M${P(R, a)} A${R},${R} 0 ${big} 1 ${P(R, a1)} L${P(r, a1)} A${r},${r} 0 ${big} 0 ${P(r, a)} Z`, class: "slice " + p.cls}, donut)
        .appendChild(document.createElementNS(NS, "title")).textContent = `${p.label} ${(p.v / M.total * 100).toFixed(1)}%`;
      a = a1;
    });
    const invested = 1 - (M.cash || 0) / M.total;
    el("text", {x: cx, y: cy - 2, "text-anchor": "middle", class: "donut-big"}, donut).textContent = Math.round(invested * 100) + "%";
    el("text", {x: cx, y: cy + 15, "text-anchor": "middle", class: "tick"}, donut).textContent = "invested";
    document.getElementById("alloc-legend").innerHTML = parts.map(p =>
      `<li><span class="lg ${p.cls}"></span>${p.label}<span class="num">${(p.v / M.total * 100).toFixed(1)}%</span></li>`).join("");
  }
})();
