/* Should setup, a demo with made-up data. Answers stay in this browser tab (sessionStorage); nothing is sent anywhere. */
(() => {
"use strict";
const AREAS = window.ONB_AREAS, I = window.DSI18n;
const MAX_AREAS = 4, MIN_AREAS = 2, MAX_WF = 5;

const T = {
en: {
  skiplink:"Skip to the content", logo:"Should", lang:"Language", skip:"Skip setup",
  demo:"This is a demo with made-up data. Your answers stay in this browser tab and nothing is created.",
  step:"Step {n} of 5 · {name}", s1:"Pick what matters", s2:"Choose first workflows", s3:"What you already have", s4:"How to reach you", s5:"Your plan",
  t1:"What matters to you right now?", l1:"Pick 2 to 4. You can add more any time.", picked:"{n} picked", need:"Pick at least 2",
  cap:"Fewer, better. Start with these four. You can add more any time.", more:"More areas", cont:"Continue", back:"Back",
  t2:"Where should we start?", suggested:"Suggested", notsure:"Not sure yet", notsure_t:"Nothing yet. We'll suggest one later.",
  firstset:"First set: {n} of 5 workflows.", wfcap:"That's five. Fewer, better: start with these and add more any time.",
  nextarea:"Next area", skiparea:"Skip this area", areaof:"{name} ({i} of {n})",
  t3:"What do you already have?", l3:"We only note it. Nothing connects now, and we never ask for a password here.", later:"I'll add these later",
  t4:"How should we reach you?", l4:"Pick a main way. You can change it any time.",
  ch_text:"Text", ch_chat:"Chat", ch_email:"Email", ch_dash:"Dashboard", ch_note:"Default: one short note a day.",
  quiet:"Quiet hours", from:"From", to:"Until", resty:"No messages on my rest day", resty_day:"No messages on {day}.", restday:"Your rest day", restpick:"Choose a day", restnone:"I don't have one",
  phone:"Phone number", phonenote:"Used only to send your daily note.",
  days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  t5:"Here's your plan", l5:"This is what we'd set up, in this order. Nothing is created yet. Edit anything.", edit:"Edit",
  sum_areas:"Areas", sum_wf:"First workflows", sum_roles:"Helpers", sum_weeks:"Weeks",
  who_you:"You", who_agent:"A helper does this", who_both:"You and a helper", wk:"Week {w}, day {d}", wk1:"Week 1, day {d}",
  core:"Set up your workspace and your values", core_d:"The core steps: the rules file, your values, the decisions log and your morning summary.",
  area_step:"Add {role}: {area}", area_step_d:"Starts with: {wf}.", conn:"Connect the accounts for {area}", conn_d:"You sign in. We never see a password.",
  oversight:"Add Security and Compliance checks", oversight_d:"Right after your first helper that can send or spend.",
  review:"Weekly review", review_d:"Ten minutes on the weekend: what worked, what to add next.",
  notnow:"Not now", notnow_t:"You skipped: {list}. Add them any time.",
  money_t:"Money, set the way you like", money_l:"These are the defaults. You can change any of them.",
  m1:"Each paid account gets its own card, owned by the helper that uses it.", m2:"You set one monthly budget per helper. The helper runs its cards and billing inside it.",
  m3:"Small fixes up to $25 inside an approved limit happen on their own, with a one-line note.", m4:"Only going over a budget comes back to you, as one button.", m5:"You paste any card number yourself.",
  budget:"Monthly budget", budget_later:"Set later", budget_hint:"A number in dollars",
  door:"I'll ask you with a button before I spend, send or publish.",
  go:"Start with step 1", save:"Save this plan and decide later", saved:"Saved in this tab. In the real setup this would be kept for you.",
  started:"In the real setup, step 1 would start here. This demo ends here, and nothing was created.",
  basics_t:"Start with the basics", basics_l:"No problem. Everything below works without picking anything now. You can pick areas later in Settings.",
  basics_1:"Your workspace and values (the core steps)", basics_2:"A daily summary at the time you choose", basics_3:"Add areas later, one or two at a time",
  basics_go:"Back to the picker", notadvice:"Money, health and legal help is not financial, medical or legal advice.",
  tab:"Plan"
},
es: {
  skiplink:"Saltar al contenido", logo:"Should", lang:"Idioma", skip:"Omitir configuración",
  demo:"Esto es una demostración con datos inventados. Sus respuestas se quedan en esta pestaña y no se crea nada.",
  step:"Paso {n} de 5 · {name}", s1:"Elegir lo que importa", s2:"Elegir primeros flujos", s3:"Lo que ya tiene", s4:"Cómo contactarlo", s5:"Su plan",
  t1:"¿Qué le importa ahora?", l1:"Elija de 2 a 4. Puede agregar más cuando quiera.", picked:"{n} elegidas", need:"Elija al menos 2",
  cap:"Menos, pero mejor. Empiece con estas cuatro. Puede agregar más cuando quiera.", more:"Más áreas", cont:"Continuar", back:"Atrás",
  t2:"¿Por dónde empezamos?", suggested:"Sugerido", notsure:"Aún no lo sé", notsure_t:"Por ahora nada. Más adelante le sugerimos uno.",
  firstset:"Primer conjunto: {n} de 5 flujos.", wfcap:"Ya son cinco. Menos, pero mejor: empiece con estos y agregue más cuando quiera.",
  nextarea:"Siguiente área", skiparea:"Omitir esta área", areaof:"{name} ({i} de {n})",
  t3:"¿Qué ya tiene?", l3:"Solo lo anotamos. Nada se conecta ahora y aquí nunca le pedimos una contraseña.", later:"Los agregaré después",
  t4:"¿Cómo lo contactamos?", l4:"Elija una forma principal. Puede cambiarla cuando quiera.",
  ch_text:"Mensaje de texto", ch_chat:"Chat", ch_email:"Correo", ch_dash:"Panel", ch_note:"Por defecto: una nota corta al día.",
  quiet:"Horas de silencio", from:"Desde", to:"Hasta", resty:"Sin mensajes en mi día de descanso", resty_day:"Sin mensajes el {day}.", restday:"Su día de descanso", restpick:"Elija un día", restnone:"No tengo uno",
  phone:"Número de teléfono", phonenote:"Se usa solo para enviarle su nota diaria.",
  days:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],
  t5:"Este es su plan", l5:"Esto es lo que configuraríamos, en este orden. Todavía no se crea nada. Puede cambiar lo que quiera.", edit:"Editar",
  sum_areas:"Áreas", sum_wf:"Primeros flujos", sum_roles:"Ayudantes", sum_weeks:"Semanas",
  who_you:"Usted", who_agent:"Lo hace un ayudante", who_both:"Usted y un ayudante", wk:"Semana {w}, día {d}", wk1:"Semana 1, día {d}",
  core:"Configurar su espacio de trabajo y sus valores", core_d:"Los pasos básicos: el archivo de reglas, sus valores, el registro de decisiones y su resumen de la mañana.",
  area_step:"Agregar {role}: {area}", area_step_d:"Empieza con: {wf}.", conn:"Conectar las cuentas de {area}", conn_d:"Usted inicia sesión. Nosotros nunca vemos una contraseña.",
  oversight:"Agregar las revisiones de Seguridad y Cumplimiento", oversight_d:"Justo después de su primer ayudante que pueda enviar o gastar.",
  review:"Revisión semanal", review_d:"Diez minutos el fin de semana: qué funcionó y qué agregar después.",
  notnow:"Por ahora no", notnow_t:"Omitió: {list}. Puede agregarlas cuando quiera.",
  money_t:"El dinero, a su manera", money_l:"Estos son los valores por defecto. Puede cambiar cualquiera.",
  m1:"Cada cuenta de pago tiene su propia tarjeta, a cargo del ayudante que la usa.", m2:"Usted fija un presupuesto mensual por ayudante. El ayudante maneja sus tarjetas y cobros dentro de ese monto.",
  m3:"Los arreglos pequeños de hasta $25 dentro de un límite aprobado se hacen solos, con una nota de una línea.", m4:"Solo pasarse del presupuesto vuelve a usted, como un botón.", m5:"Usted pega cualquier número de tarjeta.",
  budget:"Presupuesto mensual", budget_later:"Fijarlo después", budget_hint:"Un número en dólares",
  door:"Le preguntaré con un botón antes de gastar, enviar o publicar.",
  go:"Empezar con el paso 1", save:"Guardar este plan y decidir después", saved:"Guardado en esta pestaña. En la configuración real se guardaría para usted.",
  started:"En la configuración real, aquí empezaría el paso 1. Esta demostración termina aquí y no se creó nada.",
  basics_t:"Empiece con lo básico", basics_l:"Sin problema. Todo lo de abajo funciona sin elegir nada ahora. Puede elegir áreas después en Configuración.",
  basics_1:"Su espacio de trabajo y sus valores (los pasos básicos)", basics_2:"Un resumen diario a la hora que usted elija", basics_3:"Agregar áreas después, una o dos a la vez",
  basics_go:"Volver al selector", notadvice:"La ayuda en dinero, salud y temas legales no es asesoría financiera, médica ni legal.",
  tab:"Plan"
}};

const ICONS = {
 money:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1 1-1.6 2.5-1.6s2.5.7 2.5 1.7-1 1.4-2.5 1.9-2.5.9-2.5 1.9 1 1.6 2.5 1.6 2.5-.6 2.5-1.6"/>',
 time:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 health:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
 home:'<path d="M4 11l8-7 8 7v9H4zM10 20v-6h4v6"/>',
 family:'<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9.5" r="2.5"/><path d="M3 20c0-3 2.5-5 5-5s5 2 5 5M14 20c0-2.2 1.5-4 3.5-4s3.5 1.8 3.5 4"/>',
 privacy:'<path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z"/>',
 pets:'<circle cx="6.5" cy="11" r="1.8"/><circle cx="10" cy="6.5" r="1.8"/><circle cx="14" cy="6.5" r="1.8"/><circle cx="17.5" cy="11" r="1.8"/><path d="M12 12c-3 0-5 2.5-5 5 0 1.8 1.5 2.5 3 2.5 1 0 1.3-.4 2-.4s1 .4 2 .4c1.5 0 3-.7 3-2.5 0-2.5-2-5-5-5z"/>',
 shopping:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
 career:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
 business:'<path d="M4 20V5h10v15M14 10h6v10M4 20h16M8 9h2M8 13h2M8 17h2"/>',
 legal:'<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/>',
 fun:'<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>',
 learning:'<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>'
};
const icon = id => `<svg class="ds-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[id]||''}</svg>`;
const CHECK = '<span class="ds-choice-mark"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>';

let lang = I ? I.pickLang() : "en"; if (!T[lang]) lang = "en";
const S0 = { step: "areas", wfi: 0, areas: [], wf: {}, acc: {}, later: {}, reach: { ch: "text", from: "21:00", to: "08:00", rest: true, day: "", phone: "" }, budgets: {}, saved: false, started: false, basics: false };
let st; try { st = Object.assign({}, S0, JSON.parse(sessionStorage.getItem("onb") || "{}")); } catch (e) { st = Object.assign({}, S0); }
const save = () => { try { sessionStorage.setItem("onb", JSON.stringify(st)); } catch (e) { /* private mode: lasts this page */ } };
const t = (k, v) => String(T[lang][k] ?? T.en[k] ?? k).replace(/\{(\w+)\}/g, (m, x) => (v && x in v) ? v[x] : m);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const $ = s => document.querySelector(s);
const A = id => AREAS.find(a => a.id === id);
const L = a => a[lang];
const wfCount = () => Object.values(st.wf).filter(v => v !== "none" && v != null).length;
const go = step => { st.step = step; save(); render(true); };

function frame(n, name, narrow) {
  $("#steptext").textContent = t("step", { n, name });
  const bar = $("#bar"); bar.setAttribute("aria-valuenow", n * 20); bar.setAttribute("aria-label", t("step", { n, name })); bar.firstElementChild.style.setProperty("--value", n * 20 + "%");
  $("main").classList.toggle("narrow", !!narrow);
}

function screenAreas() {
  frame(1, t("s1"));
  const n = st.areas.length, capped = n >= MAX_AREAS;
  const tile = a => { const on = st.areas.includes(a.id), dis = capped && !on;
    return `<label class="ds-choice">${icon(a.id)}<input type="checkbox" name="area" value="${a.id}" ${on ? "checked" : ""} ${dis ? 'aria-disabled="true" aria-describedby="capmsg"' : ""}>${CHECK}<span class="ds-choice-title">${esc(L(a).name)}</span><span class="ds-choice-text">${esc(L(a).promise)}</span></label>`; };
  const first = AREAS.filter(a => a.start), rest = AREAS.filter(a => !a.start);
  return `<h1 tabindex="-1">${t("t1")}</h1><p class="lede">${t("l1")}</p>
  <div class="countrow"><span class="ds-chip status primary" role="status" aria-live="polite">${t("picked", { n })}</span></div>
  ${capped ? `<div class="ds-banner" id="capmsg" role="status"><span>${t("cap")}</span></div>` : ""}
  <div class="grid" id="grid">${first.map(tile).join("")}</div>
  <details class="more" ${rest.some(a => st.areas.includes(a.id)) ? "open" : ""}><summary>${t("more")}</summary><div class="grid">${rest.map(tile).join("")}</div></details>
  <p class="ds-supporting mt5">${t("notadvice")}</p>
  <div class="actions">${n < MIN_AREAS ? `<span class="need ds-supporting">${t("need")}</span>` : ""}<button class="ds-btn" id="next" type="button" ${n < MIN_AREAS ? "disabled" : ""}>${t("cont")}</button></div>`;
}
function bindAreas() {
  document.querySelectorAll('input[name="area"]').forEach(i => i.addEventListener("change", () => {
    const id = i.value;
    if (i.getAttribute("aria-disabled") === "true" && i.checked) { i.checked = false; return; } // capped: the reason is in #capmsg, read through aria-describedby
    st.areas = i.checked ? st.areas.concat(id) : st.areas.filter(x => x !== id);
    if (st.areas.length > MAX_AREAS) st.areas = st.areas.slice(0, MAX_AREAS);
    save(); const f = document.activeElement && document.activeElement.value; render(false); const el = f && document.querySelector(`input[value="${f}"]`); if (el) el.focus();
  }));
  $("#next").addEventListener("click", () => { st.wfi = 0; go("wf"); });
}

function screenWf() {
  const a = A(st.areas[st.wfi]), n = st.areas.length;
  frame(2, t("areaof", { name: L(a).name, i: st.wfi + 1, n: n }));
  const cur = st.wf[a.id], used = wfCount() - (cur && cur !== "none" ? 1 : 0), over = used >= MAX_WF;
  const card = (label, text, val, sug) => { const on = cur === val, dis = over && !on && val !== "none";
    return `<label class="ds-choice"><input type="radio" name="wf" value="${val}" ${on ? "checked" : ""} ${sug && cur == null ? "data-suggest" : ""} ${dis ? 'aria-disabled="true" aria-describedby="wfcap"' : ""}>${CHECK}<span class="ds-choice-title">${esc(label)}${sug ? `<span class="ds-chip status suggested">${t("suggested")}</span>` : ""}</span>${text ? `<span class="ds-choice-text">${esc(text)}</span>` : ""}</label>`; };
  const last = st.wfi === n - 1;
  return `<p class="ds-overline">${esc(L(a).name)}</p><h1 tabindex="-1">${t("t2")}</h1>
  <p class="ds-supporting mb4">${esc(L(a).promise)}</p>
  <div class="stack" role="radiogroup" aria-label="${esc(L(a).name)}">${L(a).workflows.map((w, i) => card(w, L(a).wfdesc[i], String(i), i === 0)).join("")}${card(t("notsure"), t("notsure_t"), "none", false)}</div>
  <p class="ds-supporting mt3" role="status">${t("firstset", { n: wfCount() })}</p>
  ${over ? `<div class="ds-banner" id="wfcap" role="status"><span>${t("wfcap")}</span></div>` : ""}
  <div class="actions"><button class="ds-btn text" id="back" type="button">${t("back")}</button><button class="ds-btn text" id="skiparea" type="button">${t("skiparea")}</button><button class="ds-btn" id="next" type="button">${last ? t("cont") : t("nextarea")}</button></div>`;
}
function bindWf() {
  const a = A(st.areas[st.wfi]), n = st.areas.length;
  document.querySelectorAll('input[name="wf"]').forEach(i => i.addEventListener("change", () => { if (i.getAttribute("aria-disabled") === "true") { render(false); const keep = document.querySelector(`input[name="wf"][value="${i.value}"]`); if (keep) keep.focus(); return; } st.wf[a.id] = i.value; save(); render(false); const el = document.querySelector(`input[name="wf"][value="${i.value}"]`); if (el) el.focus(); }));
  const adv = () => { if (st.wfi < n - 1) { st.wfi++; go("wf"); } else go("acc"); };
  $("#next").addEventListener("click", adv);
  $("#skiparea").addEventListener("click", () => { st.wf[a.id] = "none"; st.skipped = (st.skipped || []).concat(a.id); adv(); });
  $("#back").addEventListener("click", () => { if (st.wfi > 0) { st.wfi--; go("wf"); } else go("areas"); });
}

function screenAcc() {
  frame(3, t("s3"), true);
  const cards = st.areas.map(id => { const a = A(id), later = !!st.later[id], got = st.acc[id] || [];
    return `<div class="ds-card area-card"><div class="ds-card-header"><h2 class="ds-card-title">${esc(L(a).name)}</h2></div><div class="accrow">
    ${L(a).accounts.map((x, i) => `<label class="ds-check"><input type="checkbox" data-a="${id}" data-i="${i}" ${got.includes(i) ? "checked" : ""} ${later ? "disabled" : ""}> ${esc(x)}</label>`).join("")}
    <label class="ds-check"><input type="checkbox" data-later="${id}" ${later ? "checked" : ""}> ${t("later")}</label></div></div>`; }).join("");
  return `<h1 tabindex="-1">${t("t3")}</h1><p class="lede">${t("l3")}</p><div>${cards}</div>
  <div class="actions"><button class="ds-btn text" id="back" type="button">${t("back")}</button><button class="ds-btn" id="next" type="button">${t("cont")}</button></div>`;
}
function bindAcc() {
  document.querySelectorAll("input[data-a]").forEach(i => i.addEventListener("change", () => { const id = i.dataset.a, k = +i.dataset.i, s = new Set(st.acc[id] || []); i.checked ? s.add(k) : s.delete(k); st.acc[id] = [...s]; save(); }));
  document.querySelectorAll("input[data-later]").forEach(i => i.addEventListener("change", () => { const id = i.dataset.later; st.later[id] = i.checked; if (i.checked) st.acc[id] = []; save(); const y = scrollY; render(false); scrollTo(0, y); const el = document.querySelector(`input[data-later="${id}"]`); if (el) el.focus(); }));
  $("#back").addEventListener("click", () => { st.wfi = Math.max(0, st.areas.length - 1); go("wf"); });
  $("#next").addEventListener("click", () => go("reach"));
}

function screenReach() {
  frame(4, t("s4"), true); const r = st.reach;
  const ch = [["text", "ch_text"], ["chat", "ch_chat"], ["email", "ch_email"], ["dash", "ch_dash"]];
  return `<h1 tabindex="-1">${t("t4")}</h1><p class="lede">${t("l4")}</p>
  <div class="stack">
   <div class="ds-segmented" role="group" aria-label="${t("s4")}">${ch.map(([k, key]) => `<button type="button" data-ch="${k}" aria-pressed="${r.ch === k}">${t(key)}</button>`).join("")}</div>
   <p class="ds-supporting">${t("ch_note")}</p>
   ${r.ch === "text" ? `<div class="ds-field"><label for="phone">${t("phone")}</label><input class="ds-input" id="phone" type="tel" inputmode="tel" autocomplete="off" value="${esc(r.phone)}"><span class="ds-supporting">${t("phonenote")}</span></div>` : ""}
   <fieldset class="ds-field bare"><legend class="ds-field-label">${t("quiet")}</legend><div class="two"><div class="ds-field"><label for="qf">${t("from")}</label><input class="ds-input" id="qf" type="time" value="${r.from}"></div><div class="ds-field"><label for="qt">${t("to")}</label><input class="ds-input" id="qt" type="time" value="${r.to}"></div></div></fieldset>
   <div class="ds-field"><label for="restday">${t("restday")}</label><select class="ds-select" id="restday"><option value="">${t("restpick")}</option>${T[lang].days.map((d, i) => `<option value="${i}" ${String(r.day) === String(i) ? "selected" : ""}>${d}</option>`).join("")}<option value="none" ${r.day === "none" ? "selected" : ""}>${t("restnone")}</option></select>${r.day !== "" && r.day !== "none" ? `<span class="ds-supporting">${t("resty_day", { day: T[lang].days[+r.day] })}</span>` : ""}</div>
  </div>
  <div class="actions"><button class="ds-btn text" id="back" type="button">${t("back")}</button><button class="ds-btn" id="next" type="button">${t("cont")}</button></div>`;
}
function bindReach() {
  const r = st.reach;
  document.querySelectorAll("[data-ch]").forEach(b => b.addEventListener("click", () => { r.ch = b.dataset.ch; save(); render(false); const el = document.querySelector(`[data-ch="${r.ch}"]`); if (el) el.focus(); }));
  const on = (id, fn) => { const e = $("#" + id); if (e) e.addEventListener("change", () => { fn(e); save(); }); };
  on("phone", e => r.phone = e.value); on("qf", e => r.from = e.value); on("qt", e => r.to = e.value);
  const rd = $("#restday"); rd.addEventListener("change", () => { r.day = rd.value; save(); render(false); $("#restday").focus(); });
  $("#back").addEventListener("click", () => go("acc"));
  $("#next").addEventListener("click", () => go("plan"));
}

function buildPlan() {
  const items = []; let day = 1, week = 1;
  const when = () => t("wk", { w: week, d: day });
  const push = (title, desc, who, edit) => { items.push({ title, desc, who, when: when(), edit }); };
  push(t("core"), t("core_d"), "both", "areas"); day = 2;
  const picked = st.areas.filter(id => st.wf[id] !== undefined);
  let newThisWeek = 0, oversightDone = false;
  picked.forEach((id, idx) => {
    const a = A(id);
    if (newThisWeek >= 2) { week++; day = 1; newThisWeek = 0; }
    const w = st.wf[id], wfn = (w === "none" || w == null) ? L(a).workflows[0] : L(a).workflows[+w];
    push(t("area_step", { role: a.role, area: L(a).name }), t("area_step_d", { wf: wfn }), "agent", "wf"); newThisWeek++; day = Math.min(day + 1, 7);
    const hasAcc = !st.later[id] && (st.acc[id] || []).length;
    if (hasAcc) { push(t("conn", { area: L(a).name }), t("conn_d"), "you", "acc"); day = Math.min(day + 1, 7); }
    if (!oversightDone && id !== "privacy") { push(t("oversight"), t("oversight_d"), "agent", "areas"); oversightDone = true; day = Math.min(day + 1, 7); }
  });
  if (day > 7) day = 7;
  day = 7; push(t("review"), t("review_d"), "you", "reach");
  return { items, weeks: week };
}
function screenPlan() {
  frame(5, t("s5"), true);
  const { items, weeks } = buildPlan(), roles = new Set(st.areas.map(id => A(id).role));
  const skipped = st.areas.filter(id => st.wf[id] === "none" && (st.skipped || []).includes(id)).map(id => L(A(id)).name);
  const whoText = { you: t("who_you"), agent: t("who_agent"), both: t("who_both") };
  const restName = (st.reach.day !== "" && st.reach.day !== "none") ? T[lang].days[+st.reach.day] : "";
  return `<h1 tabindex="-1">${t("t5")}</h1><p class="lede">${t("l5")}</p>
  <div class="summary">${[["sum_areas",st.areas.length],["sum_wf",wfCount()],["sum_roles",roles.size],["sum_weeks",weeks]].map(([k,n])=>`<div class="ds-stat"><span class="ds-stat-value">${n}</span><span class="ds-stat-label">${t(k)}</span></div>`).join("")}</div>
  <ol class="plan">${items.map(i => `<li><div><strong>${esc(i.title)}</strong><div class="ds-supporting">${esc(i.desc)}</div><div class="who">${esc(whoText[i.who])}</div></div><div class="when">${esc(i.when)}<br><button class="ds-btn text sm" type="button" data-edit="${i.edit}">${t("edit")}</button></div></li>`).join("")}</ol>
  ${skipped.length ? `<p class="ds-supporting mt3"><strong>${t("notnow")}:</strong> ${esc(t("notnow_t", { list: skipped.join(", ") }))}</p>` : ""}
  ${restName ? `<p class="ds-supporting">${t("restday")}: ${esc(restName)}</p>` : ""}
  <div class="ds-card finish"><div class="ds-card-header"><h2 class="ds-card-title">${t("money_t")}</h2><p class="ds-card-subtitle">${t("money_l")}</p></div>
   <ul class="ds-supporting money-list">${["m1", "m2", "m3", "m4", "m5"].map(k => `<li>${t(k)}</li>`).join("")}</ul>
   <div class="stack money-fields">${[...roles].map(r => `<div class="ds-field"><label for="b-${esc(r)}">${esc(r)}: ${t("budget")}</label><input class="ds-input" id="b-${esc(r)}" data-b="${esc(r)}" inputmode="numeric" placeholder="${t("budget_later")}" value="${esc(st.budgets[r] || "")}"><span class="ds-supporting">${t("budget_hint")}</span></div>`).join("")}</div></div>
  <p class="ds-supporting"><strong>${t("door")}</strong></p>
  ${st.started ? `<div class="ds-banner primary" role="status"><span>${t("started")}</span></div>` : ""}${st.saved ? `<div class="ds-banner" role="status"><span>${t("saved")}</span></div>` : ""}
  <div class="actions"><button class="ds-btn text" id="back" type="button">${t("back")}</button><button class="ds-btn outlined" id="savebtn" type="button">${t("save")}</button><button class="ds-btn" id="go" type="button">${t("go")}</button></div>`;
}
function bindPlan() {
  document.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => { const e = b.dataset.edit; st.wfi = 0; go(e === "areas" ? "areas" : e); }));
  document.querySelectorAll("[data-b]").forEach(i => i.addEventListener("change", () => { st.budgets[i.dataset.b] = i.value.replace(/[^\d]/g, ""); save(); }));
  $("#back").addEventListener("click", () => go("reach"));
  $("#go").addEventListener("click", () => { st.started = true; st.saved = false; save(); render(false); $("#go").focus(); });
  $("#savebtn").addEventListener("click", () => { st.saved = true; st.started = false; save(); render(false); $("#savebtn").focus(); });
}

function screenBasics() {
  $("#steptext").textContent = ""; const bar = $("#bar"); bar.firstElementChild.style.setProperty("--value", "0%"); bar.setAttribute("aria-valuenow", 0); bar.setAttribute("aria-label", t("basics_t")); $("main").classList.add("narrow");
  return `<h1 tabindex="-1">${t("basics_t")}</h1><p class="lede">${t("basics_l")}</p>
  <ul class="ds-list"><li class="ds-list-item"><div class="text"><span class="headline">${t("basics_1")}</span></div></li><li class="ds-list-item"><div class="text"><span class="headline">${t("basics_2")}</span></div></li><li class="ds-list-item"><div class="text"><span class="headline">${t("basics_3")}</span></div></li></ul>
  <div class="actions"><button class="ds-btn" id="backpick" type="button">${t("basics_go")}</button></div>`;
}

function render(focusTitle) {
  document.documentElement.lang = lang === "es" ? "es-419" : "en";
  $("#skiplink").textContent = t("skiplink"); $("#langlabel").textContent = t("lang"); $("#skipsetup").textContent = t("skip"); $("#demonote").innerHTML = `<span>${t("demo")}</span>`; $("#lang").value = lang;
  document.title = "Should: " + t("s1") + " (demo)";
  if (st.areas.length < MIN_AREAS && st.step !== "areas" && st.step !== "basics") st.step = "areas";
  if (st.basics) st.step = "basics";
  const scr = $("#screen"), step = st.step;
  scr.innerHTML = step === "areas" ? screenAreas() : step === "wf" ? screenWf() : step === "acc" ? screenAcc() : step === "reach" ? screenReach() : step === "plan" ? screenPlan() : screenBasics();
  ({ areas: bindAreas, wf: bindWf, acc: bindAcc, reach: bindReach, plan: bindPlan, basics: () => $("#backpick").addEventListener("click", () => { st.basics = false; st.step = "areas"; save(); render(true); }) })[step]();
  if (focusTitle) { const h = scr.querySelector("h1"); if (h) { h.focus({ preventScroll: false }); } window.scrollTo(0, 0); }
  if (step === "wf") { const s = scr.querySelector("[data-suggest]") || scr.querySelector('input[name="wf"]:checked'); if (focusTitle && s) { /* focus starts on the suggested card, so Enter or Space chooses it */ s.focus(); } }
}
$("#lang").addEventListener("change", e => { lang = e.target.value; try { I && I.applyLang && I.applyLang(lang); I && localStorage.setItem("ds-lang", lang); } catch (x) { /* ok */ } render(false); });
$("#skipsetup").addEventListener("click", () => { st.basics = true; save(); render(true); });
render(false);
})();
