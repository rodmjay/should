(function () {
  'use strict';
  var D = window.DEMO, I = window.ICONS;
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function icon(n, size) {
    size = size || 20;
    return '<svg class="icon" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || I.assistant) + '</svg>';
  }  // A role drawn as a person (the design system's avatars, like the portal's Person.svelte); anything else keeps its icon
  function face(n, size, label) {
    var A = window.DSAvatars;
    return A && A.AVATARS[n] ? '<span class="person" style="width:' + size + 'px;height:' + size + 'px">' + A.avatarSVG(n, { size: size, label: label, badge: size >= 28 }) + '</span>' : icon(n, size);
  }

  var GROUPS = [
    { key: 'today', name: 'Today', icon: 'today', tile: 'today', tabs: [['', 'today', 'today', 'var(--r-today)'], ['projects', 'projects', 'check', 'var(--r-today)'], ['assistant', 'assistant', 'assistant', 'var(--r-assistant)'], ['coach', 'coach', 'coach', 'var(--r-coach)'], ['business_coach', 'business coach', 'business_coach', 'var(--r-business)']] },
    { key: 'money', name: 'Money', icon: 'bookkeeper', tile: 'money', tabs: [['money', 'overview', 'today', 'var(--pen)'], ['forecast', 'cash forecast', 'financial', 'var(--r-bookkeeper)'], ['bookkeeper', 'accountant', 'bookkeeper', 'var(--r-bookkeeper)'], ['financial', 'financial', 'financial', 'var(--r-financial)'], ['shopping', 'shopping', 'shopping', 'var(--r-shopping)'], ['phone', 'phone', 'it', 'var(--r-it)'], ['retirement', 'retirement', 'financial', 'var(--r-financial)'], ['forex', 'forex (paper)', 'wealth', 'var(--r-financial)']] },
    { key: 'home-health', name: 'Home & Health', icon: 'home-manager', tile: 'home', tabs: [['home', 'overview', 'today', 'var(--pen)'], ['chores', 'chores', 'home-manager', 'var(--r-home-manager)'], ['health', 'health', 'health', 'var(--r-health)']] },
    { key: 'plans', name: 'Plans', icon: 'scheduler', tile: 'plans', tabs: [['local-guide', 'local guide', 'local-guide', 'var(--r-local-guide)'], ['scheduler', 'scheduler', 'scheduler', 'var(--r-scheduler)'], ['travel', 'travel', 'travel', 'var(--r-travel)'], ['media', 'movies', 'media', 'var(--r-media)']] },
    { key: 'people', name: 'People', icon: 'people', tile: 'people', tabs: [['people', 'overview', 'today', 'var(--pen)'], ['relationship-manager', 'relationships', 'relationship-manager', 'var(--r-relationship-manager)'], ['gifts', 'gifts', 'gifts', 'var(--r-gifts)'], ['brokers', 'data brokers', 'investigator', 'var(--r-investigator)']] },
    { key: 'work', name: 'Work', icon: 'career', tile: 'work', tabs: [['work', 'overview', 'today', 'var(--pen)'], ['career', 'career', 'career', 'var(--r-career)'], ['legal', 'legal', 'legal', 'var(--r-legal)']] }
  ];
  var CO_TABS = [['', 'overview', 'business'], ['cap', 'cap table', 'financial'], ['compliance', 'compliance', 'legal'], ['money', 'accounts & money', 'bookkeeper'], ['tasks', 'tasks', 'check']];
  var H = D.holding;
  var COMPANIES = [{ slug: 'northstar', name: H.name, color: '#5ac8fa', depth: 0 }].concat(H.subs.map(function (s) { return { slug: s.slug, name: s.name, color: s.color, depth: 1, stage: s.stage }; }));
  var AREA = { retirement: 'money', forex: 'money', forecast: 'money', phone: 'money', health: 'health', shopping: 'shopping', chores: 'home', home: 'home' };
  var DESKS = {
    assistant: ['Executive Assistant', 'Chief of staff: the morning text, your list, and one batched ask a day', 'Sent the 8 AM text. 3 things today, 2 decisions waiting. Moved the oil change to Monday so Saturday stays light.', ['Morning text, 8 AM', 'List hygiene, 5:45 AM']],
    coach: ['Life Coach', 'Your long-term guide: yearly goals, quarterly outcomes, a monthly focus and the week', 'Sit-down at 9:30: money and health are green, sleep is yellow. Three questions from the team, and up to 3 commitments for next week.', ['Weekly review, Saturdays 9 AM']],
    business_coach: ['Business Coach', 'Long-term coaching for your companies: vision down to the week', 'This quarter’s focus: Brightside Agency to 5 retainer clients (now 3). Two proposals are out. This week’s business commitment: one follow-up call.', ['Business check-in, weekly', 'Quarterly business review']],
    bookkeeper: ['Accountant', 'Balances, bills and transactions, every morning', D.money.report, ['Balance sync, 6:15 AM']],
    financial: ['Financial Advisor', 'Credit, savings and investing, paper trades only', 'Score up 5 to 731. Paying the store card to $0 next payday would lift it more than anything else this month.', ['Credit check, Saturdays']],
    shopping: ['Shopping Expert', 'Research, the wish list and price watch', 'The headphones on your wish list dropped to $129 (was $179). They’re in the cart; checkout is yours.', ['Price watch, daily']],
    'local-guide': ['Local Guide', 'Places you’ll like and this weekend’s events', 'Two picks this weekend: a jazz trio at The Blue Room (Fri, $15) and a winter market downtown (Sat, free).', ['Weather, 6 AM']],
    scheduler: ['Scheduler', 'Your calendar, appointments and due dates', 'Next week has room: Tuesday and Thursday evenings are open. Dentist moved to Thu 9:00.', ['Day plan, 6 AM']],
    travel: ['Travel Agent', 'Fares, stays and cars; search only', 'Spring trip: fares are $40 lower on Tuesdays. Watching 3 stays under your budget.', ['Fare watch, Tuesdays']],
    media: ['Media Concierge', 'One great movie pick, and where to stream it', 'Tonight: a 1970s heist classic, streaming free with your plan. Two more on the watchlist.', []],
    'relationship-manager': ['Relationship Manager', 'Contacts, households and staying in touch', '2 friends are overdue for a hello; drafts are ready for your OK. Nothing goes out without it.', []],
    gifts: ['Gift Concierge', 'Birthdays, cards and gifts', 'Priya’s birthday is Tuesday: a card is drafted and a cookbook ($24) is in the cart.', ['Gift check, Mondays']],
    career: ['Career Assistant', 'Job leads, recruiter replies and the resume', '4 new leads, 2 strong fits. Two recruiter replies drafted; they go out only on your yes.', ['Job leads, 6:15 AM']],
    it: ['IT Guy', 'Internet, phones, the computer and account security', 'All services healthy. Phone bill is on AutoPay; one upgrade window opens Dec 24.', ['Health check, every 15 min']],
    legal: ['Legal Advisor', 'Agreements, deadlines and questions for a lawyer', 'Lease renewal is in your email: the rent stays the same, 12 months. Sign by 12/1.', []]
  };
  var menu = null, pageName = '', OFFTAB = { usage: 'Agent usage' };
  function parse() {
    var h = (location.hash || '#/').slice(2).split('/');
    if (h[0] === 'c') return { co: h[1] || 'northstar', sec: h[2] || '' };
    if (h[0] === 'agency') return { co: 'brightside', sec: 'hours' };
    return { key: h[0] || '', sub: h[1] || '' };
  }
  function groupOf(key) { return GROUPS.filter(function (g) { return g.tabs.some(function (t) { return t[0] === key; }); })[0] || GROUPS[0]; }
  function hrefOf(key) { return '#/' + key; }

  function render() {
    var r = parse(), co = r.co && COMPANIES.filter(function (c) { return c.slug === r.co; })[0];
    var g = co ? null : groupOf(r.key);
    document.documentElement.dataset.area = co ? 'business' : (AREA[r.key] || g.tile);
    // Desks off the area tabs (the gear's Systems pages) name themselves, not the area they fall back to
    pageName = co ? co.name : (OFFTAB[r.key] || g.name);
    document.title = pageName + ' · Should demo';
    renderBar(g, co);
    renderSeg(g, co, r);
    CH = [];
    $('#app').innerHTML = co ? companyView(co, r.sec) : (VIEWS[r.key] || deskView)(r.key, r.sub);
    // Charts are the design system's charts.js (v0.14.0), mounted once the view is in the page
    document.querySelectorAll('#app [data-ch]').forEach(function (el) { DSCharts.mount(el, CH[+el.dataset.ch]); });
  }
  function launcherApps() {
    return GROUPS.map(function (g) { return { key: g.key, name: g.name, icon: g.icon, href: hrefOf(g.tabs[0][0]), bg: 'var(--tile-' + g.tile + ')' }; })
      .concat([{ name: 'Cash Forecast', icon: 'financial', href: '#/forecast', bg: 'var(--tile-money)' }, { name: 'Phone', icon: 'it', href: '#/phone', bg: 'var(--tile-money)' }, { name: 'Retirement', icon: 'financial', href: '#/retirement', bg: 'var(--tile-money)' }, { name: 'Projects', icon: 'check', href: '#/projects', bg: 'var(--tile-today)' }, { name: 'Forex (paper)', icon: 'wealth', href: '#/forex', bg: 'var(--tile-money)' }, { name: 'Health', icon: 'health', href: '#/health', bg: 'var(--tile-health)' }, { name: 'Coach', icon: 'coach', href: '#/coach', bg: 'var(--tile-plans)' }, { name: 'Agency desk', icon: 'as-architect', href: '#/agency', bg: 'var(--tile-business)' }]);
  }
  function renderBar(g, co) {
    var bar = $('#bar');
    bar.classList.toggle('company', !!co);
    bar.style.setProperty('--ctx', co ? co.color : 'var(--nc-blue)');
    var apps = launcherApps();
    var ctx = '<ul class="panel list center" role="listbox" aria-label="Areas and companies"><li class="head">Personal</li>' +
      GROUPS.map(function (x) { return '<li role="option"><a href="' + hrefOf(x.tabs[0][0]) + '"' + (!co && g === x ? ' class="on"' : '') + '><span class="mini" style="background: var(--tile-' + x.tile + ')">' + icon(x.icon, 13) + '</span>' + x.name + '</a></li>'; }).join('') +
      '<li class="head">Companies</li>' +
      COMPANIES.map(function (c) { return '<li role="option"><a href="#/c/' + c.slug + '" style="padding-left:' + (10 + c.depth * 16) + 'px"' + (co && co.slug === c.slug ? ' class="on"' : '') + '><span class="sw" style="background:' + c.color + '"></span><span>' + esc(c.name) + '</span></a></li>'; }).join('') + '</ul>';
    var add = '<div class="panel list" role="menu" aria-label="Quick add"><form class="quick" onsubmit="return false"><label class="head" for="qa">Add a task</label><input id="qa" class="field" placeholder="Call the bank about…"><button class="nc-go" type="button" data-demo>Add</button><p class="small muted" id="qmsg" hidden>Demo: nothing is saved.</p></form>' +
      '<a role="menuitem" href="#/agency"><span class="mini" style="background: var(--tile-business)">' + icon('as-architect', 13) + '</span>Log time<span class="hint">text /agency /log 3h Client note</span></a>' +
      '<a role="menuitem" href="#/assistant"><span class="mini" style="background: var(--tile-today)">' + icon('ask', 13) + '</span>Ask Executive Assistant</a></div>';
    var launcher = '<div class="panel launcher" role="dialog" aria-label="All desks"><div class="grid">' +
      apps.map(function (a) { return '<a href="' + a.href + '"' + (a.key ? ' data-nav="g:' + a.key + '"' : '') + '><span class="app ds-nav-icon" style="background:' + a.bg + '">' + icon(a.icon, 24) + '</span><span class="lbl">' + a.name + '</span></a>'; }).join('') +
      '</div><p class="head">Companies</p><div class="grid">' +
      COMPANIES.map(function (c) { return '<a href="#/c/' + c.slug + '"><span class="app" style="background: ' + c.color + '">' + icon(c.slug === 'lantern' ? 'legal' : 'business', 24) + '</span><span class="lbl">' + esc(c.name) + '</span></a>'; }).join('') +
      '</div><p class="head">Systems and tools</p><div class="grid small">' +
      [['it', 'it'], ['webmaster', 'webmaster'], ['dba', 'database'], ['designer', 'designer'], ['usage', 'agent usage', '#/usage', 'it'], ['search', 'search'], ['people', 'phone book']].map(function (t) { return '<a href="' + (t[2] || '#/assistant') + '">' + (window.DSAvatars && DSAvatars.AVATARS[t[0]] ? face(t[0], 42) : '<span class="app" style="background: var(--tile-systems)">' + icon(t[3] || t[0], 20) + '</span>') + '<span class="lbl">' + t[1] + '</span></a>'; }).join('') + '</div></div>';
    var me = '<div class="panel list" role="menu" aria-label="' + D.me.name + '"><p class="who"><b>' + D.me.name + '</b><span class="small muted">' + D.me.email + '</span></p><a role="menuitem" href="#/coach">Coach and values</a><a role="menuitem" href="../">The Should page ↗</a></div>';
    bar.innerHTML =
      '<a href="#/" class="brand" aria-label="Should, Today"><svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#1f6f54"/><path d="M17 34.5 L27.5 44.5 L45 23" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="16.5" r="5" fill="#e88a60"/></svg><span class="word">Should</span></a>' +
      '<div class="mid"><span class="pop"><button class="pillbtn" data-menu="ctx" aria-haspopup="listbox" aria-expanded="' + (menu === 'ctx') + '"><span class="sw" style="background:' + (co ? co.color : 'var(--nc-blue)') + '"></span><span class="pname">' + esc(pageName) + '</span><span class="chev' + (menu === 'ctx' ? ' up' : '') + '" aria-hidden="true">▾</span></button>' + (menu === 'ctx' ? ctx : '') + '</span></div>' +
      '<div class="right">' +
      '<span class="pop"><button class="round" data-menu="add" aria-label="Quick add" aria-expanded="' + (menu === 'add') + '"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>' + (menu === 'add' ? add : '') + '</span>' +
      '<span class="pop"><button class="round" data-nav="all" data-menu="apps" aria-label="All desks" aria-expanded="' + (menu === 'apps') + '"><span class="ds-nav-icon"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' + [5, 12, 19].map(function (y) { return [5, 12, 19].map(function (x) { return '<circle cx="' + x + '" cy="' + y + '" r="2.1" fill="currentColor"/>'; }).join(''); }).join('') + '</svg></span></button>' + (menu === 'apps' ? launcher : '') + '</span>' +
      '<span class="pop"><button class="round avatar" data-menu="me" aria-label="' + D.me.name + '’s menu" aria-expanded="' + (menu === 'me') + '">' + D.me.initials + '</button>' + (menu === 'me' ? me : '') + '</span>' +
      '</div>' + (menu ? '<div class="scrim" role="presentation"></div>' : '');
  }
  // Needs-you badges (design system v0.16.1, Rod 11/20; mirrors the portal): made-up counts per desk from data.js,
  // each group's sum on its launcher tile, and the total on the launcher button. The old red dots are gone.
  function badges() {
    if (!window.DSBadges) return;
    var n = D.needs || {}, out = {}, all = 0;
    Object.keys(n).forEach(function (k) { out[k] = n[k]; });
    GROUPS.forEach(function (g) { var sum = g.tabs.reduce(function (s, t) { return s + (n[t[0]] || 0); }, 0); out['g:' + g.key] = sum; all += sum; });
    out.all = all;
    DSBadges.navBadges(document.body, out);
  }
  function renderSeg(g, co, r) {
    var tabs;
    if (co && co.slug === 'brightside') tabs = [['#/agency', 'hours', 'as-architect', co.color, r.sec === 'hours']].concat(CO_TABS.slice(1).map(function (t) { return ['#/c/brightside/' + t[0], t[1], t[2], co.color, r.sec === t[0]]; }));
    else if (co) tabs = CO_TABS.map(function (t) { return ['#/c/' + co.slug + (t[0] ? '/' + t[0] : ''), t[1], t[2], co.color, r.sec === t[0]]; });
    else tabs = g.tabs.map(function (t) { return [hrefOf(t[0]), t[1], t[2], t[3], r.key === t[0], t[0] === 'bookkeeper', t[0]]; });
    $('#seg').innerHTML = '<div class="segin">' + tabs.map(function (t) {
      var cls = (t[4] ? 'on ' : '') + (t[6] ? 'ds-nav-inline' : '');
      return '<a href="' + t[0] + '" style="--c:' + t[3] + '"' + (cls.trim() ? ' class="' + cls.trim() + '"' : '') + (t[4] ? ' aria-current="page"' : '') + (t[6] ? ' data-nav="' + t[6] + '"' : '') + '><span class="ds-nav-icon">' + face(t[2], 20) + '</span><span>' + t[1] + '</span></a>';
    }).join('') + '</div>';
    badges();
  }
  function spark(pts) {
    var min = Math.min.apply(null, pts), max = Math.max.apply(null, pts), w = 120, h = 30;
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + (i * w / (pts.length - 1)).toFixed(1) + ' ' + (h - 3 - (p - min) / ((max - min) || 1) * (h - 6)).toFixed(1); }).join(' ');
    return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><path d="' + d + '" fill="none" stroke="var(--nc-orange)" stroke-width="2" stroke-linejoin="round"/></svg>';
  }
  function tiles(ts) {
    return '<div class="tiles" aria-label="At a glance">' + ts.map(function (t) {
      return '<div class="tile ' + (t.tone || '') + '"><span class="t-label">' + t.label + '</span><span class="t-value num">' + t.value + '</span>' + (t.spark ? spark(t.spark) : '') + '<span class="t-sub">' + t.sub + '</span></div>';
    }).join('') + '</div>';
  }
  function card(title, body, extra) { return '<section class="block"><h2 class="label"><span>' + title + '</span>' + (extra ? '<span>' + extra + '</span>' : '') + '</h2>' + body + '</section>'; }
  function rows(list, fn) { return '<ul class="rows">' + list.map(function (x) { return '<li>' + fn(x) + '</li>'; }).join('') + '</ul>'; }
  function hero(eyebrow, title, lede, side) {
    return '<header class="hero"><div>' + (eyebrow ? '<p class="eyebrow">' + eyebrow + '</p>' : '') + '<h1 class="page-h1">' + title + '</h1>' + (lede ? '<p class="lede">' + lede + '</p>' : '') + '</div>' + (side || '') + '</header>';
  }
  var CH = [];
  function chart(spec) { CH.push(spec); return '<div data-ch="' + (CH.length - 1) + '"></div>'; }
  function pill(text, tone) { return '<span class="pill ' + (tone || '') + '">' + text + '</span>'; }
  function phone() {
    return '<section class="block phonecard"><h2 class="label"><span>A 1/2/3 text</span><span class="muted small">how you answer, on the go</span></h2><div class="msgs">' +
      D.text.map(function (m) { return '<p class="' + m[0] + '">' + esc(m[1]).replace(/\n/g, '<br>') + '</p>'; }).join('') + '</div></section>';
  }
  var T = D.today;
  var VIEWS = {
    '': function () {
      return hero(D.dateLong, D.date, '▸ ' + T.brief, '<span class="pill act">' + T.attention + ' desks need action</span>') + tiles(T.tiles) +
        '<div class="cols2">' +
        card('Today &amp; next', rows(T.tasks, function (t) { return '<span class="box' + (t[3] ? ' p1' : '') + '"></span><span>' + esc(t[0]) + '<small>' + t[1] + ' · ' + t[2] + '</small></span>'; }), '<a href="#/assistant">assistant</a>') +
        card('Calendar', rows(T.calendar, function (c) { return '<span class="num when">' + c[0] + '</span><span class="cal" style="--t: var(--tile-' + c[2] + ')">' + esc(c[1]) + '</span>'; }), '<span class="muted small">today</span>') +
        '</div><div class="cols2">' +
        card('Weather', '<p>' + T.weather.line + '</p>' + rows(T.weather.places, function (p) { return '<b>' + p[0] + '</b><span class="num">' + p[1] + '</span><span class="muted">' + p[2] + '</span>'; }), '<a href="#/local-guide">local guide</a>') +
        card('Waiting on', rows(T.waiting, function (w) { return '<b>' + esc(w[0]) + '</b><span>' + esc(w[1]) + '</span><span class="muted small">' + w[2] + '</span>'; }), '<span class="muted small">agents follow up</span>') +
        '</div>' + card('Done yesterday', '<p>' + T.done + '</p>') + phone();
    },
    money: function () {
      var M = D.money, S = M.spend;
      return hero('Cash, bills, credit and buying, from Accountant, Financial Advisor and Shopping Expert.', 'money') + tiles(M.tiles) +
        '<div class="seg-btns subtabs">' + M.tabs.map(function (t, i) { return '<button' + (i ? '' : ' class="on"') + '>' + t + '</button>'; }).join('') + '</div>' +
        card('Current spend', '<p class="big"><b class="num">' + S.total + '</b> in November <span class="good">' + S.note + '</span></p>' + spendChart(S.now, S.last), '<a href="#/bookkeeper">by category</a>') +
        card('Bills, next 14 days', rows(M.bills, function (b) { return '<b>' + b[0] + '</b><span class="num">' + b[1] + '</span><span class="muted">' + b[2] + '</span>' + pill(b[3], b[3] === 'autopay' ? 'ok' : 'watch'); })) +
        card('Card offers', [['Expiring this week', M.offers.filter(function (o) { return o[6] <= 7; })], ['Other offers', M.offers.filter(function (o) { return o[6] > 7; })]].map(function (g) {
          return g[1].length ? '<h3 class="rt-sub">' + g[0] + '</h3>' + rows(g[1], function (o) { return '<b>' + o[0] + '</b>' + (o[1] ? pill('you shop here', 'good') : '') + '<span class="small muted">card ··' + o[2] + [o[4], o[5]].filter(Boolean).map(function (x) { return ' · ' + x; }).join('') + '</span><span class="num">' + o[3] + '</span><span class="small ' + (o[6] <= 7 ? 'soon' : 'muted') + '">' + o[6] + ' days left</span>' + pill(o[7] ? 'activated' : 'not activated', o[7] ? 'ok' : 'watch'); }) : '';
        }).join('') + '<p class="small muted">Accountant reads them; you activate an offer in the card’s own app.</p>', '<span class="small muted">read only</span>');
    },
    phone: function () {
      var X = D.phone, PEND = '<i class="pend">pending sign-in</i>';
      var dl = function (pairs) { return '<dl class="kv">' + pairs.map(function (p) { return '<div><dt>' + p[0] + '</dt><dd>' + p[1] + '</dd></div>'; }).join('') + '</dl>'; };
      return hero('<a href="#/money">Money</a> · <a href="#/it">IT Guy</a> keeps it current', 'Phone', 'Lines, equipment charges and the phone data Should syncs. Read only.') + tiles(X.tiles) +
        '<div class="lines">' + X.lines.map(function (l) {
          return '<article class="block line"><h2 class="label"><span>…' + l.last4 + ' · ' + l.label + '</span>' + pill(l.status, l.status === 'active' ? 'ok' : 'watch') + '</h2>' +
            dl([['Used by', l.user], ['Phone', l.device], ['Monthly share', l.share || PEND], ['Device protection', l.protection], ['Line total a month', l.total ? '<b>' + l.total + '</b>' : PEND]]) +
            (l.promo ? '<p class="small promo">' + l.promo + '</p>' : '') + (l.change ? '<p class="small change"><b>' + l.change[0] + '</b> ' + l.change[1] + '</p>' : '') + '</article>';
        }).join('') + '</div>' +
        card('The plan', '<p class="plantext">' + X.plan.text + '</p><div class="scroll"><table class="data"><thead><tr><th>From the bill of</th><th>Equipment</th><th class="r">Bill</th></tr></thead><tbody>' +
          X.plan.falloff.map(function (f) { return '<tr><td>' + f[0].replace('Bill of ', '') + '</td><td>' + f[1] + '</td><td class="num r"><b>' + f[2] + '</b></td></tr>'; }).join('') + '</tbody></table></div>', '<span class="small muted">' + X.plan.approved + '</span>') +
        card('Equipment charges', '<div class="scroll"><table class="data"><thead><tr><th>Device</th><th>Line</th><th>Monthly</th><th>Payoff today</th><th>Payments left</th><th>Final payment</th><th>Credits</th></tr></thead><tbody>' +
          X.installments.map(function (i) { return '<tr><td><b>' + i[0] + '</b><br><span class="small muted">' + i[1] + '</span></td><td>…' + i[2] + '</td><td class="num">' + i[3] + '</td><td class="num">' + i[4] + '</td><td class="num">' + i[5] + '</td><td>' + i[6] + '</td><td class="small">' + i[7] + '</td></tr>'; }).join('') +
          '</tbody><tfoot><tr><td colspan="2"><b>Total</b></td><td class="num"><b>$52.08</b></td><td class="num"><b>$611.40</b></td><td colspan="3"></td></tr></tfoot></table></div>', '<span class="small muted">2 of 2 balances known</span>') +
        card('Where the bill goes', '<div class="cats">' + X.bill.cats.map(function (c) {
          var amt = (c[1] < 0 ? '−$' : '$') + Math.abs(c[1]).toFixed(2);
          return '<details class="cat"><summary><span>' + c[0] + '</span><b class="num' + (c[1] < 0 ? ' neg' : '') + '">' + amt + '</b></summary><ul>' + c[2].map(function (i) { return '<li><span>' + i[0] + '</span><span class="num">' + i[1] + '</span></li>'; }).join('') + '</ul></details>';
        }).join('') + '</div><p class="bill-total"><span>Statement total</span><b class="num">' + X.bill.total + '</b></p><p class="small muted">' + X.bill.next + '</p>', '<span class="small muted">statement of ' + X.bill.date + '</span>') +
        '<div class="cols2">' + card('Timeline', rows(X.timeline, function (t) { return '<b class="num">' + t[0] + '</b><span>' + t[1] + '</span>'; })) +
        card('Phone data', dl(X.data) + '<p class="small muted">Counts only. Message text stays on each person’s timeline.</p>') + '</div>';
    },
    forecast: function () { return forecastView(); },
    retirement: function () { return retirementView(); },
    projects: function (k, sub) { return sub ? projectView(sub) : projectsView(); },
    forex: function () {
      var X = D.forex, S = X.strategies;
      var sgn = function (n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 }); };
      var pc = function (n) { return n == null ? '—' : (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(1) + '%'; };
      var ranked = S.slice().sort(function (a, b) { return b.equity - a.equity; });
      var W = 900, H = 240, L = 56, R = 14, T = 14, B = 26, all = [].concat.apply([], S.map(function (s) { return s.curve; }));
      var lo = Math.min.apply(null, all) - 40, hi = Math.max.apply(null, all) + 40, n = S[0].curve.length;
      var x = function (i) { return L + i * (W - L - R) / (n - 1); }, y = function (v) { return T + (hi - v) / (hi - lo) * (H - T - B); };
      var eq = '<svg class="eq" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Equity of each paper sub-account"><line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(0) + '" y2="' + y(0) + '" class="start"/><text x="' + (L - 8) + '" y="' + (y(0) + 4) + '" class="yt">$25k</text>' +
        S.map(function (s) { return '<path d="' + s.curve.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' ') + '" style="stroke:' + s.color + '" class="ln' + (s.baseline ? ' base' : '') + '"/>'; }).join('') +
        '<text x="' + L + '" y="' + (H - 6) + '" class="xt">' + X.days[0] + '</text><text x="' + (W - R) + '" y="' + (H - 6) + '" class="xt end">' + X.days[1] + '</text></svg>';
      return '<header class="hero"><div><p class="eyebrow"><a href="#/financial">Stocks</a> · <b>Forex</b> · <a href="#/financial">Financial Advisor</a> runs it</p><h1 class="page-h1">Forex <span class="paper">PAPER</span></h1><p class="lede">A play account: one paper sub-account per strategy, each started at the same balance, racing against simply holding US dollars. No real money.</p></div></header>' +
        '<p class="small muted fxmeta">' + X.broker + ' · prices as of ' + X.asOf + ' · ' + X.pairs.join(', ') + '.</p>' +
        card('Leaderboard', '<div class="scroll"><table class="data"><thead><tr><th>Strategy</th><th>On</th><th class="r">Equity</th><th class="r">P&amp;L</th><th class="r">Max DD</th><th class="r">Trades</th><th class="r">Win rate</th><th class="r">Backtest a year</th><th class="r">vs holding USD</th></tr></thead><tbody>' +
          ranked.map(function (s) { return '<tr><td><span class="sw" style="background:' + s.color + '"></span><b>' + s.name + '</b>' + (s.baseline ? ' <span class="small muted">baseline</span>' : '') + '</td><td><button class="switch' + (s.on ? ' on' : '') + '" role="switch" aria-checked="' + s.on + '" aria-label="' + s.name + '" data-demo-switch><span></span></button></td><td class="num">' + money(s.equity) + '</td><td class="num ' + (s.pnl > 0 ? 'up' : s.pnl < 0 ? 'down' : '') + '">' + sgn(s.pnl) + '</td><td class="num">' + pc(-s.dd) + '</td><td class="num">' + s.trades + '</td><td class="num">' + (s.win == null ? '—' : s.win + '%') + '</td><td class="num">' + pc(s.cagr) + '</td><td class="num ' + (s.vs > 0 ? 'up' : s.vs < 0 ? 'down' : '') + '">' + (s.baseline ? '—' : pc(s.vs)) + '</td></tr>'; }).join('') +
          '</tbody></table></div><p class="small muted" id="swmsg">Backtest columns are since 2016, after costs. A strategy only earns trust by beating holding USD on paper first.</p>', '<span class="small muted">turn a strategy on or off; the bot picks it up on its next run</span>') +
        card('Equity curves', eq + '<p class="legend small eql">' + S.map(function (s) { return '<span><i style="background:' + s.color + '"></i>' + s.name + '</span>'; }).join('') + '</p>') +
        '<h2 class="label sect">Strategies</h2><div class="cards">' + S.map(function (s) {
          return '<article class="block scard" style="--c:' + s.color + '"><h2 class="label"><span>' + s.name + '</span>' + pill(s.on ? 'active' : 'paused', s.on ? 'ok' : 'watch') + '</h2><p class="small">' + s.desc + '</p>' +
            (s.params.length ? '<dl class="params">' + s.params.map(function (p) { return '<div><dt>' + p[0] + '</dt><dd>' + p[1] + '</dd><span class="small muted">' + p[2] + '</span></div>'; }).join('') + '</dl>' : '') + '<p class="small verdict">' + s.verdict + '</p></article>';
        }).join('') + '</div>' +
        '<div class="cols2">' + card('Open positions', '<div class="scroll"><table class="data"><thead><tr><th>Strategy</th><th>Pair</th><th>Side</th><th class="r">Units</th><th class="r">Entry</th></tr></thead><tbody>' + X.open.map(function (t) { return '<tr><td>' + t[0] + '</td><td>' + t[1] + '</td><td>' + t[2] + '</td><td class="num">' + t[3] + '</td><td class="num">' + t[4] + '</td></tr>'; }).join('') + '</tbody></table></div>', '<span class="small muted">' + X.open.length + '</span>') +
        card('Risk rules', '<dl class="risk">' + X.risk.map(function (r) { return '<div' + (r[2] ? ' class="wide2"' : '') + '><dt>' + r[0] + '</dt><dd' + (r[2] ? ' class="small"' : '') + '>' + r[1] + '</dd></div>'; }).join('') + '</dl>', '<span class="small muted">hard caps in the bot’s code</span>') + '</div>' +
        card('Trades log', '<div class="scroll"><table class="data"><thead><tr><th>Day</th><th>Strategy</th><th>Pair</th><th>Side</th><th class="r">Units</th><th class="r">Price</th><th class="r">Result</th></tr></thead><tbody>' + X.trades.map(function (t) { return '<tr><td>' + t[0] + '</td><td>' + t[1] + '</td><td>' + t[2] + '</td><td>' + t[3] + '</td><td class="num">' + t[4] + '</td><td class="num">' + t[5] + '</td><td class="num ' + (t[6][0] === '+' ? 'up' : t[6] ? 'down' : '') + '">' + (t[6] || 'open') + '</td></tr>'; }).join('') + '</tbody></table></div>');
    },
    health: function () {
      var X = D.health;
      return hero('Training, meals and weigh-ins, from Health Agent.', 'health') + tiles(X.tiles) +
        '<div class="cols2">' + card('This week’s training', rows(X.training, function (t) { return '<b>' + t[0] + '</b><span>' + t[1] + '</span>' + pill(t[2], t[2] === 'done' ? 'ok' : 'watch'); })) +
        card('Today’s meals', rows(X.meals, function (m) { return '<b>' + m[0] + '</b><span>' + m[1] + '</span>'; })) + '</div>' + card('Groceries', '<p>' + X.cart + '</p>');
    },
    home: function () {
      var X = D.home;
      return hero('Cleaning, repairs, chores and supplies, from Home Manager.', 'home') + tiles(X.tiles) +
        '<div class="cols2">' + card('Repairs', rows(X.repairs, function (r) { return '<b>' + r[0] + '</b><span class="muted">' + r[1] + '</span>' + pill(r[2], 'watch'); })) +
        card('Supplies running low', rows(X.supplies, function (s) { return '<b>' + s[0] + '</b><span class="muted">' + s[1] + '</span>' + pill('in cart', 'ok'); })) + '</div>';
    },
    chores: function () {
      return hero('Home Manager', 'chores', 'The week’s chores. Ticking one off is two taps.') +
        card('This week', rows(D.home.chores, function (c) { return '<span class="box' + (c[2] ? ' done' : '') + '"></span><span' + (c[2] ? ' class="muted strike"' : '') + '>' + c[0] + '</span><span class="muted small">' + c[1] + '</span>'; }));
    },
    people: function () {
      var X = D.people;
      return hero('Family and friends, from Relationship Manager and Gift Concierge.', 'people') + tiles(X.tiles) +
        '<div class="cols2">' + card('Birthdays coming', rows(X.birthdays, function (b) { return '<b>' + b[0] + '</b><span class="muted">' + b[1] + ' · ' + b[2] + '</span><span class="small">' + b[3] + '</span>'; })) +
        card('Stay in touch', rows(X.touch, function (t) { return '<b>' + t[0] + '</b><span>' + t[1] + '</span><span class="muted small">' + t[2] + '</span>'; })) + '</div>';
    },
    brokers: function () {
      var X = D.brokers, n = { off: 0, prog: 0, need: 0 };
      var G = { confirmed: 'off', notlisted: 'off', needs: 'need' }, STEP = { checking: 0, found: 1, relisted: 1, filed: 2, needs: 2, confirmed: 3, notlisted: 4 };
      var LBL = { checking: ['Checking', ''], filed: ['Opt-out filed', ''], relisted: ['Listed again, re-filed', 'watch'], needs: ['Needs you', 'watch'], confirmed: ['Opt-out confirmed', 'ok'], notlisted: ['Re-checked: not listed', 'good'] };
      X.sites.forEach(function (s) { n[G[s[1]] || 'prog']++; });
      var ORDER = ['checking', 'relisted', 'filed', 'needs', 'confirmed', 'notlisted'];
      var bar = chart({ type: 'bar', horizontal: true, title: 'Sites by status', labels: ORDER.map(function (k) { return LBL[k][0]; }), series: [{ name: 'Sites', values: ORDER.map(function (k) { return X.sites.filter(function (s) { return s[1] === k; }).length; }) }], height: 220 });
      var tilesHtml = '<ul class="br-tiles">' + X.sites.map(function (s) {
        var tr = ''; for (var i = 0; i < 4; i++) tr += '<i class="' + (i < STEP[s[1]] ? 'on' : '') + '"></i>';
        return '<li class="' + (G[s[1]] || 'prog') + '"><span class="br-logo" aria-hidden="true">' + s[0].replace(/[^A-Z]/g, '').slice(0, 2) + '</span><b>' + s[0] + '</b><span class="br-track">' + tr + '</span>' + pill(LBL[s[1]][0], LBL[s[1]][1]) + '</li>';
      }).join('') + '</ul>';
      return hero('Investigator', 'Data brokers', 'Where you’re listed on people-search and marketing sites, what’s filed, and the few steps only you can do. Investigator files and re-checks.') +
        tiles([{ label: 'Opt-outs confirmed', value: n.off + ' of ' + X.sites.length, sub: 'as of ' + X.asOf }, { label: 'In progress', value: '' + n.prog, sub: 'filed or checking' }, { label: 'Needs you', value: '' + n.need, sub: 'a few minutes each' }, { label: 'Next check', value: X.next, sub: 're-checks every 3 months' }]) +
        card('Removals by status', bar + '<p class="small muted">' + n.off + ' confirmed · ' + n.prog + ' in progress · ' + n.need + ' need you</p>') +
        card('Needs you', rows(X.needs, function (x) { return '<b>' + x[0] + '</b><span>' + x[1] + '</span><a class="small" href="#/brokers">Open ' + x[0] + '</a>'; }), '<span class="muted small">one step each</span>') +
        '<div class="cols2">' + card('Your sites', tilesHtml) +
        card('What we’ve done', rows(X.feed, function (f) { return '<span class="muted small">' + f[0] + '</span><span>' + f[1] + '</span>' + (f[2] ? '<span class="small muted">Confirmation ' + f[2] + '</span>' : ''); })) + '</div>' +
        card('Re-checks due', rows(X.rechecks, function (r) { return '<b>' + r[0] + '</b><span class="muted">' + r[1] + '</span>'; }), '<span class="muted small">confirmation references only, never copies of their pages</span>');
    },
    usage: function () {
      var X = D.usage, C = DSCharts, metric = 'spend';
      var t = [C.statTile({ label: 'Estimated cost, last 7 days', value: X.kpis.week, unit: '$', delta: X.kpis.weekDelta, goodWhen: 'down', trend: X.byModel[0].values.slice(-7), caption: 'at API list price' }),
        C.statTile({ label: 'Tokens on Nov 19', value: X.kpis.day, delta: X.kpis.dayDelta, goodWhen: 'down' }),
        C.statTile({ label: 'Messages, last 7 days', value: X.kpis.messages }), C.statTile({ label: 'Agents active, 30 days', value: X.kpis.active })].join('');
      return hero('IT Guy', 'Agent usage', 'Claude tokens per agent, model and day. Cost is an estimate at API list price; you’re on a subscription, so it isn’t money spent.') +
        '<div class="us-tiles">' + t + '</div>' +
        '<div class="us-grid"><section class="block us-wide">' + chart({ type: 'bar', stacked: true, title: 'Estimated cost per day, by agent', labels: X.labels, series: X.byRole, unit: '$', height: 260 }) + '</section>' +
        '<section class="block">' + chart({ type: 'line', title: 'Estimated cost per day, by model', labels: X.labels, series: X.byModel, unit: '$', height: 240 }) + '</section>' +
        '<section class="block">' + chart({ type: 'calendar', title: 'Estimated cost per day, last 90 days', days: X.calendar, unit: '$' }) + '</section>' +
        '<section class="block"><h2 class="ds-chart-title">Per agent, last 30 days</h2>' + C.barTable({ rows: X.perRole.map(function (r) { return { label: r.label, value: r.spend }; }), unit: '$' }) + '</section>' +
        '<section class="block"><h2 class="ds-chart-title">Each agent’s model</h2><table class="ds-table"><tbody>' + X.current.map(function (c) { return '<tr><td>' + c[0] + '</td><td>' + c[1] + '</td><td class="num muted">' + c[2] + '</td></tr>'; }).join('') + '</tbody></table></section></div>';
    },
    work: function () {
      var X = D.work, tone = { strong: 'ok', maybe: 'watch', skip: 'act' };
      return hero('Job search and side work, from Career Assistant.', 'work') + tiles(X.tiles) +
        '<div class="cols2">' + card('Job leads', rows(X.leads, function (l) { return '<b>' + l[0] + '</b><span>' + l[1] + ' · ' + l[2] + '</span>' + pill(l[3], tone[l[3]]); }), '<span class="muted small">scored against your criteria</span>') +
        card('Pipeline', rows(X.pipeline, function (p) { return '<b>' + p[0] + '</b><span class="muted">' + p[1] + '</span>'; })) + '</div>';
    }
  };
  // Cash Forecast: a day-by-day balance worked out in the page from data.js.
  var fcDays = 90, fcPick = null, fcWhatif = [];
  var PRESETS = [['2 wks', 14], ['1 mo', 30], ['3 mo', 90], ['6 mo', 182], ['1 yr', 365], ['2 yrs', 730]];
  function iso(d) { return d.toISOString().slice(0, 10); }
  function addDays(s, n) { var d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return iso(d); }
  function shortDay(s) { return new Date(s + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }); }
  function money(n) { return (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function forecast(days) {
    var F = D.forecast, bal = F.balance, out = [], periods = [], cur = null;
    var extras = F.extras.concat(fcWhatif);
    var payStart = (new Date(F.pay.first) - new Date(F.start)) / 864e5;
    for (var i = 0; i < days; i++) {
      var day = addDays(F.start, i), dom = +day.slice(8), items = [], income = 0;
      var isPay = i >= payStart && (i - payStart) % F.pay.every === 0;
      if (isPay || !cur) {
        cur = { start: day, payday: isPay, opening: bal, income: 0, bills: 0, extra: 0, low: Infinity, lowOn: day, items: [] };
        periods.push(cur);
      }
      if (isPay) { income = F.pay.amount; cur.income += income; }
      F.bills.forEach(function (b) { if (b[0] === dom) { items.push([day, b[1], b[2], 'bill']); cur.bills += b[2]; } });
      cur.bills += F.daily;
      extras.forEach(function (e) { if (e[0] === day) { items.push([day, e[1], e[2], 'extra']); cur.extra += e[2]; } });
      bal += income - F.daily - items.reduce(function (a, x) { return a + x[2]; }, 0);
      cur.items = cur.items.concat(items);
      if (bal < cur.low) { cur.low = bal; cur.lowOn = day; }
      cur.end = day; cur.closing = bal;
      out.push({ day: day, bal: bal, pay: isPay });
    }
    periods.forEach(function (p) { p.under = p.low < F.bar; });
    return { pts: out, periods: periods };
  }
  function forecastView() {
    var F = D.forecast, r = forecast(fcDays), pts = r.pts, P = r.periods;
    var worst = P.reduce(function (a, p) { return !a || p.low < a.low ? p : a; }, null);
    var W = 900, H = 280, L = 56, R = 14, T = 18, B = 30;
    var vals = pts.map(function (p) { return p.bal; }).concat([F.bar, 0]);
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals) * 1.08;
    var x = function (i) { return L + i * (W - L - R) / Math.max(1, pts.length - 1); };
    var y = function (v) { return T + (hi - v) / (hi - lo || 1) * (H - T - B); };
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.bal).toFixed(1); }).join(' ');
    var area = line + ' L' + x(pts.length - 1).toFixed(1) + ' ' + y(lo) + ' L' + x(0) + ' ' + y(lo) + ' Z';
    var red = pts.map(function (p, i) { return p.bal < F.bar && i ? '<line x1="' + x(i - 1) + '" y1="' + y(pts[i - 1].bal) + '" x2="' + x(i) + '" y2="' + y(p.bal) + '" class="red"/>' : ''; }).join('');
    var step = Math.pow(10, Math.floor(Math.log10(hi - lo || 1))), ticks = [];
    for (var t = Math.ceil(lo / step) * step; t <= hi; t += step) ticks.push(t);
    if (ticks.length > 6) ticks = ticks.filter(function (_, k) { return k % 2 === 0; });
    var idx = {}; pts.forEach(function (p, i) { idx[p.day] = i; });
    var months = pts.map(function (p, i) { return [p, i]; }).filter(function (a) { return a[0].day.slice(8) === '01'; });
    if (months.length > 12) months = months.filter(function (_, k) { return k % 3 === 0; });
    var events = F.extras.concat(fcWhatif).filter(function (e) { return idx[e[0]] != null; });
    var lows = P.filter(function (p) { return idx[p.lowOn] != null; });
    var showAll = lows.length <= W / 70;
    var svg = '<svg class="fc" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Checking balance by day; lowest ' + money(worst.low) + '">' +
      ticks.map(function (t) { return '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(t) + '" y2="' + y(t) + '" class="grid"/><text x="' + (L - 8) + '" y="' + (y(t) + 4) + '" class="yt">' + (Math.abs(t) >= 1000 ? '$' + t / 1000 + 'k' : '$' + t) + '</text>'; }).join('') +
      months.map(function (m) { return '<line x1="' + x(m[1]) + '" x2="' + x(m[1]) + '" y1="' + T + '" y2="' + (H - B) + '" class="grid"/><text x="' + x(m[1]) + '" y="' + (H - 10) + '" class="xt">' + shortDay(m[0].day).split(' ')[0] + (m[0].day.slice(5, 7) === '01' ? ' ’' + m[0].day.slice(2, 4) : '') + '</text>'; }).join('') +
      pts.map(function (p, i) { return p.pay ? '<line x1="' + x(i) + '" x2="' + x(i) + '" y1="' + (H - B) + '" y2="' + (H - B - 7) + '" class="pay"/>' : ''; }).join('') +
      '<path d="' + area + '" class="area"/><path d="' + line + '" class="ln"/>' + red +
      '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(F.bar) + '" y2="' + y(F.bar) + '" class="barl"/><text x="' + (L + 6) + '" y="' + (y(F.bar) - 5) + '" class="bart">bar ' + money(F.bar).replace('.00', '') + '</text>' +
      events.map(function (e) { return '<line x1="' + x(idx[e[0]]) + '" x2="' + x(idx[e[0]]) + '" y1="' + T + '" y2="' + (T + 10) + '" class="ev"/>'; }).join('') +
      lows.map(function (p) { var cx = x(idx[p.lowOn]), cy = y(p.low);
        return '<g class="low' + (p.under ? ' under' : '') + (fcPick === p.start ? ' on' : '') + '" data-period="' + p.start + '" role="button" tabindex="0" aria-label="Low ' + money(p.low) + ' on ' + shortDay(p.lowOn) + '"><circle cx="' + cx + '" cy="' + cy + '" r="12" class="hit"/><circle cx="' + cx + '" cy="' + cy + '" r="4.5"/>' +
          (showAll || p.under || p === worst ? '<text x="' + cx + '" y="' + (cy + 18) + '" class="lt">' + money(p.low).replace(/\.\d\d$/, '') + '</text>' : '') + '</g>'; }).join('') + '</svg>';
    var picked = P.filter(function (p) { return p.start === fcPick; })[0];
    var due = picked ? card('What’s due ' + shortDay(picked.start) + ' – ' + shortDay(picked.end), '<p class="small">Opens ' + money(picked.opening) + (picked.income ? ', payday adds ' + money(picked.income) : '') + '; low ' + money(picked.low) + ' on ' + shortDay(picked.lowOn) + (picked.under ? ', under the bar' : '') + '. Daily spending of ' + money(F.daily) + ' is in the bills total.</p>' +
      (picked.items.length ? rows(picked.items, function (it) { return '<b class="num">' + shortDay(it[0]) + '</b><span>' + esc(it[1]) + (it[3] === 'extra' ? '<span class="small muted"> · one-off</span>' : '') + '</span><span class="num">' + money(it[2]) + '</span>'; }) : '<p class="muted">Only daily spending in this stretch.</p>'),
      '<button class="pen" data-fc-close>close</button>') : '';
    var label = fcDays < 60 ? fcDays + ' days' : fcDays < 365 ? Math.round(fcDays / 30.4) + ' months' : (fcDays / 365).toFixed(fcDays % 365 ? 1 : 0) + ' years';
    return hero('<a href="#/money">Money</a> · Accountant’s numbers, checking …' + F.last4, 'Cash Forecast', 'The checking balance a day at a time, every paycheck, bill and one-off, out to two years. The bar is ' + money(F.bar).replace('.00', '') + '.') +
      card('Horizon', '<input class="slider" type="range" min="14" max="730" step="1" value="' + fcDays + '" aria-label="Days ahead" data-fc-slider><div class="presets">' + PRESETS.map(function (p) { return '<button class="pen' + (fcDays === p[1] ? ' on' : '') + '" data-fc-days="' + p[1] + '">' + p[0] + '</button>'; }).join('') + '</div>', '<span class="small muted">' + label + '</span>') +
      tiles([
        { label: 'Checking today', value: money(F.balance), sub: shortDay(F.start) },
        { label: 'Lowest point', value: money(worst.low), sub: shortDay(worst.lowOn) + (worst.under ? ' · under the bar' : ''), tone: worst.under ? 'act' : '' },
        { label: 'Periods under ' + money(F.bar).replace('.00', ''), value: P.filter(function (p) { return p.under; }).length + ' of ' + P.length, sub: 'pay periods in view', tone: P.some(function (p) { return p.under; }) ? 'act' : '' },
        { label: 'On ' + shortDay(pts[pts.length - 1].day), value: money(pts[pts.length - 1].bal), sub: 'end of the horizon' }
      ]) +
      card('Checking balance by day', svg + '<p class="legend small fcl"><span class="k ln-k"></span>balance <span class="k red-k"></span>under the bar <span class="k bar-k"></span>bar <span class="k pay-k"></span>payday <span class="k ev-k"></span>event</p>', '<span class="small muted">click a low point to see what’s due</span>') +
      due +
      card('Pay periods', '<div class="scroll"><table class="data fct"><thead><tr><th>Period</th><th class="r">Opening</th><th class="r">Income</th><th class="r">Bills</th><th class="r">One-offs</th><th class="r">Low point</th><th>Low on</th><th class="r">Closing</th></tr></thead><tbody>' +
        P.map(function (p) { return '<tr data-period="' + p.start + '" class="' + (p.under ? 'under ' : '') + (fcPick === p.start ? 'on' : '') + '"><td>' + shortDay(p.start) + (p.payday ? '' : ' (part)') + '</td><td class="num">' + money(p.opening) + '</td><td class="num">' + (p.income ? money(p.income) : '—') + '</td><td class="num">' + money(p.bills) + '</td><td class="num">' + (p.extra ? money(p.extra) : '—') + '</td><td class="num"><b>' + money(p.low) + '</b>' + (p.under ? ' <span class="pill act">under</span>' : '') + '</td><td>' + shortDay(p.lowOn) + '</td><td class="num">' + money(p.closing) + '</td></tr>'; }).join('') +
        '</tbody></table></div>', '<span class="small muted">' + P.length + ' in view · click a row for what’s due</span>') +
      '<div class="cols2">' + card('Events on the timeline', rows(F.extras.map(function (e) { return [e[0], e[1], money(e[2]), 'extra']; }).concat(F.ends.map(function (e) { return [e[0], e[1] + '<span class="small muted"> · frees ' + money(e[2]) + ' ' + e[3] + '</span>', '', 'ends']; })), function (e) { return '<b class="num">' + shortDay(e[0]) + ' ’' + e[0].slice(2, 4) + '</b><span class="ev-' + e[3] + '">' + e[1] + '</span>' + (e[2] ? '<span class="num">' + e[2] + '</span>' : ''); })) +
      card('What if', '<form class="wf" data-fc-form><input class="field" type="date" name="date" min="' + F.start + '" max="' + addDays(F.start, 729) + '" required aria-label="Date"><input class="field" name="label" placeholder="New laptop" aria-label="What"><input class="field" type="number" step="0.01" name="amount" placeholder="120" required aria-label="Amount"><button class="pen">add</button></form>' +
        (fcWhatif.length ? rows(fcWhatif, function (w) { return '<b class="num">' + shortDay(w[0]) + '</b><span>' + esc(w[1]) + '</span><span class="num">' + money(w[2]) + '</span>'; }) + '<button class="pen" data-fc-clear>clear what-ifs</button>' : '') +
        '<p class="small muted">A positive amount is money out, a negative one money in. Ask Accountant to make one real.</p>', '<span class="small muted">this view only, never saved</span>') + '</div>';
  }
  function deskView(key) {
    var d = DESKS[key];
    if (!d) return VIEWS['']();
    return '<header class="dhead" style="--c: var(--r-' + key + ')"><span class="badge">' + face(key, 56, d[0]) + '</span><div><h1 class="page-h1">' + d[0] + '</h1><p class="eyebrow">' + d[1] + '</p></div></header>' +
      card('Latest report', '<p>' + d[2] + '</p>', '<span class="muted small">today</span>') +
      (d[3].length ? card('Routines it runs', rows(d[3], function (r) { return '<span>' + r + '</span>'; })) : '') +
      card('What it never does', '<p>Buys, sends, books or deletes anything without your yes for that exact thing.</p>');
  }
  function spendChart(now, last) {
    var w = 640, h = 180, max = Math.max.apply(null, last) * 1.05;
    var x = function (i) { return 34 + i * (w - 44) / 29; }, y = function (v) { return h - 20 - v / max * (h - 34); };
    var line = function (pts) { return pts.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' '); };
    var grid = [0, 1000, 2000, 3000].map(function (v) { return '<line x1="34" x2="' + (w - 10) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="rgba(255,255,255,0.08)"/><text x="0" y="' + (y(v) + 4) + '" class="ax">$' + (v / 1000) + 'k</text>'; }).join('');
    var n = now.length - 1;
    return '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Spending this month versus last month">' + grid +
      '<path d="' + line(last) + '" fill="none" stroke="rgba(235,235,245,0.45)" stroke-width="2" stroke-dasharray="5 5"/>' +
      '<path d="' + line(now) + '" fill="none" stroke="var(--nc-green)" stroke-width="3" stroke-linejoin="round"/><circle cx="' + x(n) + '" cy="' + y(now[n]) + '" r="5" fill="var(--nc-green)"/>' +
      [1, 8, 15, 22, 29].map(function (d) { return '<text x="' + x(d - 1) + '" y="' + (h - 2) + '" class="ax" text-anchor="middle">' + d + '</text>'; }).join('') + '</svg>';
  }
  function companyView(co, sec) {
    if (co.slug === 'northstar' && !sec) return holdingView();
    if (co.slug === 'brightside' && sec === 'hours') return agencyView();
    var sub = H.subs.filter(function (s) { return s.slug === co.slug; })[0];
    var title = sub ? sub.name : H.name;
    var kv = function (r) { return '<b>' + r[0] + '</b><span>' + r[1] + '</span>'; };
    var body = {
      '': sub ? card('Pulse', rows([['Stage', sub.stage], ['Now', sub.pulse], ['Next', sub.next]], kv)) : '',
      cap: card('Cap table', rows([[H.name, '100% · ' + D.me.name], ['Each subsidiary', '100% · ' + H.name]], kv)),
      compliance: card('Filings and renewals', rows(H.next, function (n) { return '<b class="num">' + n[0] + '</b><span>' + n[1] + '</span><span class="muted small">' + n[2] + '</span>'; })),
      money: card('Accounts', rows([['Business checking', '…4821', '$6,240.18'], ['Payments', 'test mode, no live money', '$0.00']], function (a) { return '<b>' + a[0] + '</b><span class="muted">' + a[1] + '</span><span class="num">' + a[2] + '</span>'; })),
      tasks: card('Waiting on you', rows(H.asks, function (a) { return '<span>' + esc(a) + '</span>'; }))
    }[sec] || '';
    return hero(sub ? 'Subsidiary of ' + H.name + ' · ' + sub.stage : 'Holding company', title) + body;
  }
  function holdingView() {
    var counts = H.stages.slice().reverse().map(function (s) { var n = H.subs.filter(function (c) { return c.stage === s; }).length; return n ? '<span class="st-' + s + ' word">' + n + ' ' + s + '</span>' : ''; }).filter(Boolean).join(', ');
    var LEN = Math.PI * 80, pct = H.goal.pct;
    return hero('Holding company · ' + H.state + ' LLC · formed ' + H.formed + ' · ' + D.me.name + ' owns 100%', H.legal, H.subs.length + ' companies under one roof: ' + counts + '.') +
      '<section class="block tree" aria-label="Company family tree"><h2 class="label"><span>Family tree</span></h2><div class="root"><b>' + H.name + '</b><span class="small muted">Holdings LLC</span></div><div class="trunk" aria-hidden="true"></div><ul class="kids">' +
      H.subs.map(function (c) { return '<li class="node st-' + c.stage + '"><a href="#/c/' + c.slug + '"><b>' + c.name + '</b><span class="tag">' + c.stage + '</span></a></li>'; }).join('') +
      '</ul><p class="legend small">' + H.stages.map(function (s) { return '<span class="st-' + s + '"><i></i>' + s + '</span>'; }).join('') + '</p></section>' +
      '<div class="cols2"><section class="block goal"><h2 class="label"><span>' + H.goal.label + '</span></h2><svg viewBox="0 0 200 112" role="img" aria-label="' + pct + '% of the way"><path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="14" stroke-linecap="round"/><path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--nc-green)" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + (LEN * pct / 100).toFixed(1) + ' ' + LEN.toFixed(1) + '"/><text x="100" y="92" text-anchor="middle" class="gpct">' + pct + '%</text></svg><p class="center">' + H.goal.have + ' of ' + H.goal.target + ' a year</p></section>' +
      card('Waiting on you', rows(H.asks, function (a) { var p = a.split(': '); return pill(p[0], 'watch') + '<span>' + esc(p[1]) + '</span>'; }), '<span class="muted small">one batched ask a day</span>') + '</div>' +
      '<div class="pulses">' + H.subs.map(function (c) { return '<section class="block pulse" style="--c:' + c.color + '"><h2 class="label"><span>' + c.name + '</span><span class="pill st-' + c.stage + '">' + c.stage + '</span></h2><p><b>' + c.pulse + '</b></p><p class="muted small">Next: ' + c.next + '</p></section>'; }).join('') + '</div>' +
      card('Coming up', rows(H.next, function (n) { return '<b class="num">' + n[0] + '</b><span>' + n[1] + '</span><span class="muted small">' + n[2] + '</span>'; }));
  }
  // Retirement, mirrors the portal's /retirement. The slider is a what-if only.
  var rtTab = 'when', rtD = null;
  function retirementView() {
    var X = D.retirement, I0 = X.income, d0 = X.deferral;
    if (rtD == null) rtD = d0;
    var d = rtD, usd = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
    var match = function (p) { return Math.min(p, 3) + 0.5 * Math.max(0, Math.min(p, 5) - 3); };
    var goal = I0.savings + I0.employer + I0.ss + I0.other + I0.gap;
    var sav = I0.savings * d / d0, emp = I0.employer * match(d) / match(d0), have = sav + emp + I0.ss + I0.other;
    var gap = Math.max(0, goal - have), pct = Math.min(100, Math.round(have / goal * 100));
    var perYear = (100 - X.goalPct) / Math.max(1, X.ageProjected - X.planAge);
    var age = pct >= 100 ? X.planAge : Math.round(X.planAge + (100 - pct) / perYear), moved = d !== d0;
    var parts = [['My savings', sav, 'var(--rt-mine)'], ['Employer', emp, 'var(--rt-emp)'], ['Social Security', I0.ss, 'var(--rt-ss)'], ['Other assets', I0.other, 'var(--rt-other)'], ['Income gap', gap, 'var(--rt-gap)', true]];
    var total = parts.reduce(function (a, p) { return a + p[1]; }, 0) || 1, R = 52, C = 2 * Math.PI * R, off = 0;
    var arcs = parts.filter(function (p) { return p[1] > 0; }).map(function (p) { var len = p[1] / total * C, a = '<circle cx="64" cy="64" r="52" class="arc' + (p[3] ? ' gapc' : '') + '" stroke="' + p[2] + '" stroke-dasharray="' + Math.max(0, len - 2).toFixed(1) + ' ' + C.toFixed(1) + '" stroke-dashoffset="' + (-off).toFixed(1) + '" transform="rotate(-90 64 64)"/>'; off += len; return a; }).join('');
    var ticks = []; for (var i = 0; i < 7; i++) ticks.push(X.ageProjected - 3 + i);
    var scale = ticks.map(function (t) { return '<span class="tk' + (t === age ? ' on' : Math.abs(t - age) === 1 ? ' near' : '') + '">' + t + '</span>'; }).join('') + (age < ticks[0] || age > ticks[6] ? '<span class="tk on out">' + age + '</span>' : '');
    var facts = function (pairs) { return '<dl class="facts">' + pairs.map(function (p) { return '<div><dt>' + p[0] + '</dt><dd class="num">' + p[1] + '</dd></div>'; }).join('') + '</dl>'; };
    var TABS = [['when', 'When could I retire'], ['income', 'Retirement income'], ['health', 'Healthcare costs'], ['compare', 'How do I compare']];
    var body;
    if (rtTab === 'when') body = '<div class="rt-two">' +
      card('Before-tax contribution', '<div class="slide"><input type="range" min="0" max="15" step="1" value="' + d + '" data-rt-slider aria-label="Before-tax contribution percent"><output class="num">' + d + '%</output></div>' +
        facts([['From each paycheck', usd(X.grossPerPay * d / 100)], ['Take-home cost', '~' + usd(X.grossPerPay * d / 100 * (1 - X.taxSaving / 100))], ['Employer match', match(d) + '% · ' + usd(X.grossPerPay * match(d) / 100)], ['% of goal', pct + '%'], ['Goal reached at', age]]) +
        '<p class="small muted">Per paycheck. Take-home cost is Financial Advisor’s estimate (' + X.taxSaving + '% tax saving). Now ' + d0 + '% at the plan. The match is 100% of the first 3% and 50% of the next 2%, so anything past 5% is your money only.' + (moved ? ' <button class="link" data-rt-reset>back to ' + d0 + '%</button>' : '') + '</p>', '<span class="small muted">what-if only, changes nothing</span>') +
      card('Next step', '<p class="rt-step">' + X.next[0] + '</p><p class="small muted">Financial Advisor, ' + X.next[1] + '. You change the election yourself at the plan’s site.</p>' +
        '<h3 class="rt-sub">Payoff order <span class="small muted">plan order, your call</span></h3><ol class="rt-payoff">' + X.payoff.map(function (r) { return '<li><b>' + r[0] + '</b><span class="small muted">' + r[1] + (r[2] !== '—' ? ' · ' + r[2] : '') + '</span></li>'; }).join('') + '</ol><p class="small muted">Each dollar on this list beats an unmatched 401(k) dollar until it’s paid (Financial Advisor’s plan).</p>') + '</div>';
    else if (rtTab === 'income') body = card('Monthly income at retirement', '<div class="scroll"><table class="data rt-t"><tbody>' + parts.map(function (p) { return '<tr' + (p[3] ? ' class="gaprow"' : '') + '><td><i style="background:' + p[2] + '"></i>' + p[0] + '</td><td class="num r">' + usd(p[1]) + '</td><td class="num r muted">' + Math.round(p[1] / goal * 100) + '%</td></tr>'; }).join('') + '<tr class="tot"><td>Goal</td><td class="num r">' + usd(goal) + '</td><td></td></tr></tbody></table></div><p class="small muted">As of ' + X.asOf + ', source the plan’s projection' + (moved ? ', with your savings and match at ' + d + '%' : '') + '.</p>');
    else if (rtTab === 'health') body = card('Healthcare costs in retirement', facts([['Per month', usd(X.healthcare.monthly)], ['Lifetime', usd(X.healthcare.total)]]) + '<p class="small muted">As of ' + X.asOf + ', source the plan’s projection.</p>');
    else body = card('How do I compare', facts([['You', X.goalPct + '% of goal'], ['People like you', X.peerPct + '% of goal']]) + '<p class="small muted">' + X.peerNote + ' As of ' + X.asOf + '.</p>');
    var own = X.accounts.reduce(function (a, x) { return a + (x[2] || 0); }, 0), g = X.goal, gp = Math.min(100, g[1] / g[2] * 100);
    return '<div class="rt">' + hero('<a href="#/money">Money</a> · <b>Retirement</b> · <a href="#/financial">Financial Advisor</a> keeps it', 'retirement', 'The 401(k) plan’s projection, with your own accounts beside it. Read only.') +
      '<section class="block rt-hero" aria-label="Retirement income goal"><div class="rt-top"><div class="rt-head"><p class="rt-h">' + (moved ? 'At ' + d + '% you would reach' : 'At your current savings rate you will reach') + ' your retirement income goal at age</p>' +
      '<div class="scale" aria-label="Projected age ' + age + '">' + scale + '</div>' + (moved ? '<p class="small muted">The plan says ' + X.ageProjected + ' at ' + d0 + '%. The what-if age is a straight-line estimate, not the plan’s model.</p>' : '') + '</div>' +
      '<figure class="ring" aria-label="' + pct + '% of goal"><svg viewBox="0 0 128 128" role="img" aria-hidden="true"><circle cx="64" cy="64" r="52" class="track"/>' + arcs + '</svg><figcaption><b class="num">' + pct + '%</b><span>of my goal</span></figcaption></figure></div>' +
      '<div class="rt-bar" role="list" aria-label="Monthly income at retirement">' + parts.map(function (p) { return '<div class="seg' + (p[3] ? ' gap' : '') + '" role="listitem" style="--c:' + p[2] + ';flex-grow:' + Math.max(p[1], total * 0.08).toFixed(0) + '"><span class="k">' + p[0] + '</span><b class="num">' + usd(p[1]) + '</b></div>'; }).join('') + '</div>' +
      '<p class="small muted rt-src">Monthly income at retirement. As of ' + X.asOf + ', source the plan’s projection · goal ' + usd(goal) + '/mo.</p></section>' +
      '<div class="seg-btns subtabs" role="tablist" aria-label="Retirement views">' + TABS.map(function (t) { return '<button data-rt-tab="' + t[0] + '"' + (rtTab === t[0] ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + '>' + t[1] + '</button>'; }).join('') + '</div>' + body +
      card('Beyond the plan', '<div class="scroll"><table class="data"><thead><tr><th>Account</th><th class="r">Balance</th><th class="r">As of</th></tr></thead><tbody>' +
        X.accounts.map(function (a) { return '<tr><td>' + a[0] + ' · ' + a[1] + (a[4] ? ' ' + pill('planned', 'watch') : '') + '</td><td class="num r">' + (a[2] != null ? money(a[2]) : '—') + '</td><td class="num r small muted">' + a[3] + '</td></tr>'; }).join('') +
        '</tbody><tfoot><tr><td><b>Total</b></td><td class="num r"><b>' + usd(own) + '</b></td><td></td></tr></tfoot></table></div>' +
        '<div class="rt-cards"><div class="rt-mini"><span class="label">401(k) match and vesting</span><p>' + X.plan[0] + '</p><p class="small muted">' + X.plan[1] + '</p></div>' +
        '<div class="rt-mini"><span class="label">' + g[0] + '</span><p><b class="num">' + usd(g[1]) + '</b> of ' + usd(g[2]) + ' by ' + g[3] + '</p><div class="meter" role="meter" aria-valuenow="' + Math.round(gp) + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + g[0] + ' progress"><span style="width:' + gp.toFixed(1) + '%"></span></div><p class="small muted">' + usd(g[4]) + '/mo needed</p></div></div>',
        '<span class="small muted">what the plan counts as $0 “other assets”</span>') + strategiesCard(X.strategies) + '</div>';
  }
  function strategiesCard(S) {
    var ST = { not: ['not yet', ''], ready: ['ready', 'watch'], doing: ['doing', 'act'], done: ['done', 'ok'] };
    var n = function (k) { return S.list.filter(function (x) { return x[0] === k; }).length; };
    return card('Strategies explained', '<p class="small muted">' + S.list.length + ' strategies · ' + n('done') + ' done, ' + n('doing') + ' doing, ' + n('ready') + ' ready, ' + n('not') + ' not yet · ' + S.changed + '</p>' +
      '<ul class="rt-strats">' + S.list.map(function (x) { return '<li>' + pill(ST[x[0]][0], ST[x[0]][1]) + '<div><b>' + x[1] + '</b><p>' + x[2] + '</p><p class="small"><b>When:</b> ' + x[3] + '</p><p class="small muted">' + x[4] + ' · next review ' + x[5] + '</p></div></li>'; }).join('') + '</ul>',
      '<span class="small muted">Financial Advisor reviews monthly</span>');
  }
  // Projects, mirrors the portal's /projects and /projects/<key> (first-class pass 85151ae): overview strip, cards or
  // timeline, and a project page with a hero, the next step, the kind's panel, steps and a side column. Made-up data.
  var PK = { vacation: ['Trips', 'Trip', 'travel', 'var(--ds-series-1)'], move: ['Moves', 'Move', 'relocation', 'var(--ds-series-4)'], event: ['Events', 'Event', 'events', 'var(--ds-series-8)'], legal_case: ['Legal', 'Legal case', 'legal', 'var(--ds-series-9)'], purchase: ['Purchases', 'Purchase', 'shopping', 'var(--ds-series-6)'], business_launch: ['Launches', 'Launch', 'business', 'var(--ds-series-2)'], generic: ['Other projects', 'Project', 'check', 'var(--ds-series-3)'] };
  var PST = { active: 'Active', waiting: 'Waiting', someday: 'Someday', done: 'Done', dropped: 'Dropped' };
  var PCHIP = { active: 'primary', waiting: 'warning', someday: '', done: 'success', dropped: '' };
  var PJ_TODAY = '2026-11-21';
  var pjShow = 'open', pjView = 'cards', pjRange = '12';
  var pjK = function (p) { return PK[p.kind] || PK.generic; };
  var pjFits = function (p, f) { return f === 'all' || (f === 'open' ? (p.status === 'active' || p.status === 'waiting') : f === 'done' ? (p.status === 'done' || p.status === 'dropped') : p.status === f); };
  var pjLive = function (p) { return p.status === 'active' || p.status === 'waiting'; };
  var pjMd = function (iso, o) { return iso ? new Date(iso + 'T12:00:00').toLocaleDateString('en-US', o || { month: 'short', day: 'numeric' }) : ''; };
  var pjPct = function (p) { return p.progress[1] ? Math.round(p.progress[0] / p.progress[1] * 100) : null; };
  var pjDays = function (iso) { return Math.round((new Date(iso + 'T12:00:00') - new Date(PJ_TODAY + 'T12:00:00')) / 864e5); };
  function pjDue(d) {
    if (d == null) return null;
    if (d < 0) return [-d + 'd overdue', 'error']; if (d === 0) return ['today', 'error']; if (d === 1) return ['tomorrow', 'warning'];
    if (d <= 7) return ['in ' + d + ' days', 'warning']; if (d <= 60) return ['in ' + d + ' days', ''];
    return d <= 540 ? ['in ' + Math.round(d / 30.4) + ' months', ''] : ['in ' + (d / 365).toFixed(1) + ' years', ''];
  }
  function pjNext(p) {
    if (p.next) return ['Your step', p.next[0], p.next[1]];
    if (p.waits.length) return ['Waiting on ' + p.waits[0][0], p.waits[0][1], p.waits[0][2]];
    if (!pjLive(p)) return null;
    return [pjOwner(p), 'Owns the next step.', ''];
  }
  function pjOwner(p) { var A = window.DSAvatars; return A && A.AVATARS[p.owner] ? A.AVATARS[p.owner].name : (DESKS[p.owner] || [p.owner])[0]; }
  function ring(pct, size, stroke, accent) {
    var r = (size - stroke) / 2, c = 2 * Math.PI * r, h = size / 2;
    return '<span class="pj-ring" style="width:' + size + 'px;height:' + size + 'px" role="meter" aria-label="Progress" aria-valuenow="' + (pct || 0) + '" aria-valuemin="0" aria-valuemax="100"><svg viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true"><circle cx="' + h + '" cy="' + h + '" r="' + r + '" class="track" stroke-width="' + stroke + '"/>' +
      (pct ? '<circle cx="' + h + '" cy="' + h + '" r="' + r + '" class="arc" stroke="' + accent + '" stroke-width="' + stroke + '" stroke-dasharray="' + (pct / 100 * c).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 ' + h + ' ' + h + ')"/>' : '') +
      '</svg><span class="v" style="font-size:' + Math.max(11, size * 0.24) + 'px">' + (pct == null ? '–' : pct + '%') + '</span></span>';
  }
  var chip = function (text, tone) { return '<span class="pj-chip ' + (tone || '') + '">' + text + '</span>'; };
  function pjCard(p) {
    var K = pjK(p), d = pjDue(p.days), n = pjNext(p), pct = pjPct(p), quiet = !pjLive(p);
    return '<div class="pj-wrap"><a class="pj-card' + (quiet ? ' quiet' : '') + '" href="#/projects/' + p.key + '" style="--accent:' + K[3] + '"><div class="pj-main">' +
      '<div class="pj-head"><span class="pj-kind"><span class="pj-ki">' + icon(K[2], 16) + '</span>' + K[1] + '</span>' + chip(PST[p.status], PCHIP[p.status]) + '</div>' +
      '<h3 class="pj-t">' + esc(p.title) + '</h3><p class="pj-oc">' + esc(p.outcome) + '</p>' +
      (p.sig.length ? '<p class="pj-sig">' + p.sig.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</p>' : '') +
      (p.flags || []).map(function (f) { return chip(esc(f), 'error flag'); }).join('') +
      (n ? '<div class="pj-next"><span class="who">' + esc(n[0]) + '</span><span class="what">' + esc(n[1]) + '</span>' + (n[2] ? '<span class="nd">' + pjMd(n[2]) + '</span>' : '') + '</div>' : '') +
      '</div><div class="pj-foot">' + (p.progress[1] ? ring(pct, 44, 5, K[3]) + '<span class="pj-steps-n">' + p.progress[0] + '/' + p.progress[1] + '<br><span>steps</span></span>' : '') +
      (d ? chip(d[0], d[1]) : '') + (p.waits.length ? chip(p.waits.length + ' waiting', 'warning') : '') + '<span class="pj-own" title="' + esc(pjOwner(p)) + '">' + face(p.owner, 28) + '</span></div></a></div>';
  }
  function pjTimeline(P) {
    var rows = P.filter(function (p) { return p.end && p.status !== 'done' && p.status !== 'dropped'; }).sort(function (a, b) { return a.end.localeCompare(b.end); });
    var undated = P.filter(function (p) { return !p.end && p.status !== 'done' && p.status !== 'dropped'; });
    var t0 = new Date(PJ_TODAY + 'T00:00:00Z'), from = new Date(Date.UTC(t0.getUTCFullYear(), t0.getUTCMonth(), 1));
    var last = rows.reduce(function (m, r) { return r.end > m ? r.end : m; }, PJ_TODAY), l = new Date(last + 'T00:00:00Z');
    var cap = Date.UTC(t0.getUTCFullYear(), t0.getUTCMonth() + (pjRange === 'all' ? 24 : +pjRange), 1);
    var to = new Date(Math.min(cap, Date.UTC(l.getUTCFullYear(), l.getUTCMonth() + 1, 1), cap));
    if (to <= from) to = new Date(Date.UTC(t0.getUTCFullYear(), t0.getUTCMonth() + 3, 1));
    var pos = function (iso) { return Math.max(0, Math.min(100, (new Date(iso + 'T00:00:00Z') - from) / (to - from) * 100)); };
    var iso = function (d) { return d.toISOString().slice(0, 10); };
    var months = []; for (var d = new Date(from); d < to; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))) months.push(d);
    var step = months.length > 12 ? 3 : months.length > 6 ? 2 : 1;
    var ml = function (m, i) { return m.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }) + (m.getUTCMonth() === 0 || i === 0 ? ' ’' + String(m.getUTCFullYear()).slice(2) : ''); };
    var end = iso(to);
    return '<div class="pj-tl-top"><div class="pj-seg" role="group" aria-label="Range">' + [['3', '3 months'], ['12', '1 year'], ['all', 'All']].map(function (r) { return '<button data-pj-range="' + r[0] + '" aria-pressed="' + (pjRange === r[0]) + '">' + r[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="pj-tl" role="region" aria-label="Projects timeline"><div class="pj-tl-in"><div class="pj-axis" aria-hidden="true">' +
      months.map(function (m, i) { return '<span class="m' + (m.getUTCMonth() === 0 ? ' yr' : '') + '" style="left:' + pos(iso(m)) + '%">' + (i % step === 0 ? ml(m, i) : '') + '</span>'; }).join('') +
      '<span class="today" style="left:' + pos(PJ_TODAY) + '%">Today</span></div>' +
      rows.map(function (p) {
        var K = pjK(p), st = p.start && p.start < PJ_TODAY ? p.start : PJ_TODAY, open = p.end > end;
        var dots = p.steps.filter(function (t) { return t[1] && t[1] >= st && t[1] <= p.end && t[1] <= end; }).map(function (t) { return '<span class="dot" style="left:' + pos(t[1]) + '%" title="' + pjMd(t[1]) + ': ' + esc(t[0]) + '"></span>'; }).join('');
        return '<a class="row" href="#/projects/' + p.key + '" style="--accent:' + K[3] + '"><span class="name"><b>' + esc(p.title) + '</b><span>' + K[1] + ' · ends ' + pjMd(p.end) + '</span></span><span class="lane">' +
          (st > end ? '<span class="later">' + pjMd(st) + ' →</span>' : '<span class="bar' + (p.status !== 'active' ? ' faint' : '') + (open ? ' open' : '') + '" style="left:' + pos(st) + '%;width:max(6px,' + (pos(p.end) - pos(st)).toFixed(2) + '%)">' + (pjPct(p) ? '<span class="fill" style="width:' + pjPct(p) + '%"></span>' : '') + '</span>') +
          dots + (p.limit && p.limit <= end ? '<span class="limit" style="left:' + pos(p.limit) + '%" title="Hard limit ' + pjMd(p.limit) + '"></span>' : '') + '<span class="now" style="left:' + pos(PJ_TODAY) + '%"></span></span></a>';
      }).join('') + '</div></div><p class="pj-legend small"><span class="lg dot"></span> dated step <span class="lg limit"></span> hard limit <span class="lg bar"></span> in progress (filled part = steps done)</p>' +
      (undated.length ? '<p class="small muted">No dates yet: ' + undated.map(function (p) { return '<a href="#/projects/' + p.key + '">' + esc(p.title) + '</a>'; }).join(', ') + '</p>' : '');
  }
  function projectsView() {
    var P = D.projects, list = P.filter(function (p) { return pjFits(p, pjShow); });
    var F = [['open', 'In progress'], ['someday', 'Someday'], ['done', 'Done'], ['all', 'All']];
    var urg = function (a, b) { return (a.days == null ? 1e6 : a.days) - (b.days == null ? 1e6 : b.days); };
    var groups = Object.keys(PK).map(function (k) { return { K: PK[k], items: list.filter(function (p) { return (PK[p.kind] ? p.kind : 'generic') === k; }).sort(urg) }; }).filter(function (g) { return g.items.length; });
    var live = P.filter(pjLive), by = function (s) { return P.filter(function (p) { return p.status === s; }).length; };
    var nextUp = live.filter(function (p) { return p.days != null && p.days >= 0; }).sort(urg)[0];
    var yours = live.filter(function (p) { return p.next; }), soon = yours.filter(function (p) { return p.next[1] && pjDays(p.next[1]) <= 7; }).length;
    var flagged = P.filter(function (p) { return (p.flags || []).length; }), waits = live.reduce(function (n, p) { return n + p.waits.length; }, 0);
    var strip = '<section class="pj-strip" aria-label="Overview"><div class="pj-tile"><span class="tl">In motion</span><span class="big">' + by('active') + '<small>active</small></span><span class="sub">' + by('waiting') + ' waiting · ' + by('someday') + ' someday · ' + by('done') + ' done</span></div>' +
      (nextUp ? '<a class="pj-tile nextup" href="#/projects/' + nextUp.key + '" style="--accent:' + pjK(nextUp)[3] + '"><span class="tl">Next date</span><span class="big">' + nextUp.days + '<small>' + (nextUp.days === 1 ? 'day' : 'days') + '</small></span><span class="sub"><b>' + esc(nextUp.title) + '</b> · ' + pjMd(nextUp.end, { weekday: 'short', month: 'short', day: 'numeric' }) + '</span></a>' : '') +
      '<div class="pj-tile"><span class="tl">Your steps</span><span class="big">' + yours.length + '<small>next</small></span><span class="sub">' + (soon ? soon + ' due this week' : 'none due this week') + (waits ? ' · ' + waits + ' waiting on others' : '') + '</span></div>' +
      '<button class="pj-tile attn' + (flagged.length ? '' : ' ok') + '" data-pj-attn' + (flagged.length ? '' : ' disabled') + '><span class="tl">Needs attention</span><span class="big">' + flagged.length + '<small>' + (flagged.length === 1 ? 'project' : 'projects') + '</small></span><span class="sub">' + (flagged.length ? flagged.map(function (p) { return esc(p.title); }).join(', ') : 'Every project has a next step.') + '</span></button></section>';
    var body = pjView === 'timeline' ? '<section class="pj-panel" aria-label="Timeline">' + pjTimeline(P) + '</section>' :
      '<nav class="pj-filters" aria-label="Filter by status">' + F.map(function (f) { return '<button class="pj-fchip" data-pj-filter="' + f[0] + '" aria-pressed="' + (pjShow === f[0]) + '">' + f[1] + ' <span class="n">' + P.filter(function (p) { return pjFits(p, f[0]); }).length + '</span></button>'; }).join('') + '</nav>' +
      (groups.length ? '' : '<div class="pj-empty">' + icon('check', 28) + '<p>Nothing here yet.</p></div>') +
      groups.map(function (g) { return '<section class="pj-group" aria-label="' + g.K[0] + '" style="--accent:' + g.K[3] + '"><h2 class="pj-kh"><span class="pj-ki">' + icon(g.K[2], 18) + '</span>' + g.K[0] + '<span class="kn">' + g.items.length + '</span></h2><div class="pj-grid">' + g.items.map(pjCard).join('') + '</div></section>'; }).join('');
    return '<div class="pj"><header class="pj-hero"><div><p class="pj-over">Today · Projects</p><h1 class="pj-h">Projects</h1><p class="pj-lede">Every outcome that takes more than one step, where it stands and what’s next.</p></div>' +
      '<div class="pj-seg" role="group" aria-label="View"><button data-pj-view="cards" aria-pressed="' + (pjView === 'cards') + '">Cards</button><button data-pj-view="timeline" aria-pressed="' + (pjView === 'timeline') + '">Timeline</button></div></header>' + strip + body + '</div>';
  }
  function projectView(key) {
    var p = D.projects.filter(function (x) { return x.key === key; })[0];
    if (!p) return hero('<a href="#/projects">Projects</a>', 'Not found', 'That project isn’t in the demo.');
    var K = pjK(p), d = pjDue(p.days), n = pjNext(p), pct = pjPct(p);
    var dates = []; var add = function (date, what, lim) { if (date) dates.push([date, what, !!lim]); };
    add(p.limit, 'Hard limit', true); if (p.trip) { add('2027-03-10', 'Trip starts'); add('2027-03-16', 'Trip ends'); }
    p.waits.forEach(function (w) { add(w[2], 'Check: ' + w[0]); }); p.steps.forEach(function (t) { add(t[1], t[0]); });
    var seen = {}; dates = dates.sort(function (a, b) { return a[0].localeCompare(b[0]); }).filter(function (x) { if (seen[x[0]]) { seen[x[0]][3] = (seen[x[0]][3] || 0) + 1; return false; } seen[x[0]] = x; return true; }).slice(0, 7);
    var heroH = '<header class="pj-phero" style="--accent:' + K[3] + '"><div class="hl"><div class="meta"><span class="pj-kind"><span class="pj-ki big">' + icon(K[2], 18) + '</span>' + K[1] + '</span>' + chip(PST[p.status], PCHIP[p.status]) + (d ? chip(d[0], d[1]) : '') + '</div>' +
      '<h1 class="t">' + esc(p.title) + '</h1><p class="oc"><span class="ol">Done looks like</span>' + esc(p.outcome) + '</p>' +
      (p.sig.length ? '<p class="pj-sig big">' + p.sig.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</p>' : '') +
      (p.flags || []).map(function (f) { return '<p class="pj-chip error flag" role="status">' + esc(f) + '</p>'; }).join('') +
      '</div><div class="hr">' + ring(pct, 112, 10, K[3]) + '<span class="small">' + (p.progress[1] ? p.progress[0] + ' of ' + p.progress[1] + ' steps done' : 'No steps yet') + '</span></div></header>';
    var nextH = n ? '<section class="pj-nextbig" style="--accent:' + K[3] + '" aria-label="Next step"><span class="who">' + esc(n[0]) + '</span><p class="what">' + esc(n[1]) + '</p>' + (n[2] ? '<span class="nd">' + pjMd(n[2], { weekday: 'short', month: 'short', day: 'numeric' }) + ' · in ' + pjDays(n[2]) + ' day' + (pjDays(n[2]) === 1 ? '' : 's') + '</span>' : '') + '</section>' : '';
    var panel = '';
    if (p.trip) {
      var T = p.trip;
      panel = '<section class="pj-panel" aria-label="Trip details"><h2 class="pj-sh">' + icon(K[2], 18) + ' Trip details</h2><div class="pj-opts">' +
        T.options.map(function (o) { return '<div class="pj-opt' + (o[3] ? ' pick' : '') + '"><b>' + esc(o[0]) + '</b><span class="num big">' + o[1] + '</span><span class="small muted">' + esc(o[2]) + '</span>' + (o[3] ? chip('Travel Agent’s pick', 'success') : '') + '</div>'; }).join('') +
        '</div><ul class="pj-lines">' + T.lines.map(function (l) { return '<li><span>' + l[0] + '</span><b class="num">' + l[1] + '</b></li>'; }).join('') + '</ul><p class="small pj-watch">' + T.watch + '</p></section>';
    }
    var steps = '<section class="pj-panel pj-stepsec" aria-label="Steps" style="--accent:' + K[3] + '"><h2 class="pj-sh">Your steps <span class="kn">' + p.steps.length + ' open</span></h2>' +
      (p.steps.length ? '<ol class="pj-list">' + p.steps.map(function (t, i) { return '<li' + (i ? '' : ' class="first"') + '><span class="box" aria-hidden="true"></span><span class="txt">' + esc(t[0]) + '</span><span class="meta">' + [t[1] ? pjMd(t[1], { weekday: 'short', month: 'short', day: 'numeric' }) : '', t[2] ? t[2] + ' min' : ''].filter(Boolean).join(' · ') + '</span></li>'; }).join('') + '</ol>' : '<p class="pj-none">No open steps.</p>') +
      (p.done.length ? '<details class="pj-done"><summary>' + p.done.length + ' done in the last 90 days</summary><ol class="pj-list">' + p.done.map(function (t) { return '<li class="ok"><span class="box" aria-hidden="true">✓</span><span class="txt">' + esc(t[0]) + '</span><span class="meta">' + pjMd(t[1], { weekday: 'short', month: 'short', day: 'numeric' }) + '</span></li>'; }).join('') + '</ol></details>' : '') + '</section>';
    var side = '<aside class="pj-side"><a class="pj-box owner" href="#/' + p.owner + '">' + face(p.owner, 44) + '<span><span class="lbl">Owner</span><b>' + esc(pjOwner(p)) + '</b><span class="small muted">keeps this project moving</span></span></a>' +
      '<section class="pj-box" aria-label="Waiting on"><h2 class="lbl">Waiting on</h2>' + (p.waits.length ? '<ul class="pj-wl">' + p.waits.map(function (w) { return '<li><b>' + esc(w[0]) + '</b><span>' + esc(w[1]) + '</span><span class="small muted">check ' + pjMd(w[2], { weekday: 'short', month: 'short', day: 'numeric' }) + '</span></li>'; }).join('') + '</ul>' : '<p class="pj-none">Nothing outstanding.</p>') + '</section>' +
      '<section class="pj-box" aria-label="Key dates"><h2 class="lbl">Key dates</h2>' + (dates.length ? '<ol class="pj-dates">' + dates.map(function (x) { return '<li class="' + (x[2] ? 'limit ' : '') + (x[0] < PJ_TODAY ? 'past' : '') + '"><span class="dd">' + pjMd(x[0]) + '</span><span>' + esc(x[1]) + (x[3] ? '<span class="more"> +' + x[3] + ' more</span>' : '') + '</span></li>'; }).join('') + '</ol>' : '<p class="pj-none">Nothing dated.</p>') + '</section>' +
      '<section class="pj-box" aria-label="Goal"><h2 class="lbl">Serves the goal</h2>' + (p.goal ? '<p class="goal">' + chip(p.goal[1]) + ' ' + esc(p.goal[0]) + '</p>' : '<p class="pj-none">Not tied to a goal yet.</p>') + '</section>' +
      '<section class="pj-box" aria-label="Recent activity"><h2 class="lbl">Recent activity</h2>' + (p.done.length ? '<ol class="pj-act">' + p.done.slice(0, 8).map(function (a) { return '<li><span class="tick" aria-hidden="true">✓</span><span>' + esc(a[0]) + '</span><span class="small muted">' + pjMd(a[1]) + '</span></li>'; }).join('') + '</ol>' : '<p class="pj-none">No steps finished in the last 90 days.</p>') + '</section></aside>';
    return '<div class="pj"><nav class="pj-crumbs" aria-label="Breadcrumb"><a href="#/projects">Projects</a> <span aria-hidden="true">›</span> ' + K[0] + '</nav>' + heroH + '<div class="pj-cols"><div class="pj-maincol">' + nextH + panel + steps + '</div>' + side + '</div></div>';
  }
  function agencyView() {
    var A = D.agency;
    var table = function (head, list) { return '<table class="data"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + list.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i ? ' class="num"' : '') + '>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>'; };
    return hero('<a href="#/c/northstar">Companies</a> · Business Executive', A.name, 'Hours, invoices, payouts and affiliates, read only.') +
      '<div class="testmode"><b>TEST MODE</b> · payments sandbox, no real money moves. Snapshot ' + A.snapshot + '.</div>' +
      card('Hours', '<p>' + A.total + '</p><div class="cols3"><div><h3 class="sub">By worker</h3>' + table(['Name', 'Hours', 'Cost', 'Billed'], A.workers) + '</div><div><h3 class="sub">By project</h3>' + table(['Project', 'Hours', 'Billed'], A.projects) + '</div><div><h3 class="sub">By client</h3>' + table(['Client', 'Hours', 'Billed'], A.clients) + '</div></div>', '<span class="seg-btns"><button class="on">this week</button><button>this month</button></span>');
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-menu]');
    if (b) { menu = menu === b.dataset.menu ? null : b.dataset.menu; render(); return; }
    if (e.target.closest('[data-demo]')) { var m = $('#qmsg'); if (m) m.hidden = false; return; }
    if (e.target.closest('.scrim')) { menu = null; render(); return; }
    var sw = e.target.closest('[data-demo-switch]');
    if (sw) { var m2 = $('#swmsg'); if (m2) m2.textContent = 'Demo: switches don’t change anything here.'; return; }
    var fd = e.target.closest('[data-fc-days]');
    if (fd) { fcDays = +fd.dataset.fcDays; render(); return; }
    if (e.target.closest('[data-fc-close]')) { fcPick = null; render(); return; }
    if (e.target.closest('[data-fc-clear]')) { fcWhatif = []; render(); return; }
    var pf = e.target.closest('[data-pj-filter]');
    if (pf) { pjShow = pf.dataset.pjFilter; render(); return; }
    var pv = e.target.closest('[data-pj-view]');
    if (pv) { pjView = pv.dataset.pjView; render(); return; }
    var pr = e.target.closest('[data-pj-range]');
    if (pr) { pjRange = pr.dataset.pjRange; render(); return; }
    if (e.target.closest('[data-pj-attn]')) { pjShow = 'all'; pjView = 'cards'; render(); return; }
    var rt = e.target.closest('[data-rt-tab]');
    if (rt) { rtTab = rt.dataset.rtTab; render(); return; }
    if (e.target.closest('[data-rt-reset]')) { rtD = null; render(); return; }
    var fp = e.target.closest('[data-period]');
    if (fp) { fcPick = fp.dataset.period; render(); return; }
    var sb = e.target.closest('.seg-btns button');
    if (sb) sb.parentNode.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === sb); });
  });
  document.addEventListener('input', function (e) {
    if (e.target.matches('[data-rt-slider]')) { rtD = +e.target.value; var ys = window.scrollY; render(); window.scrollTo(0, ys); var rs = $('[data-rt-slider]'); if (rs) rs.focus(); return; }
    if (e.target.matches('[data-fc-slider]')) { fcDays = +e.target.value; var y = window.scrollY; render(); window.scrollTo(0, y); var sl = $('[data-fc-slider]'); if (sl) sl.focus(); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-fc-form]');
    if (!f) return;
    e.preventDefault();
    fcWhatif.push([f.date.value, f.label.value || 'What-if', Number(f.amount.value)]);
    render();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu) { menu = null; render(); } });
  window.addEventListener('hashchange', function () { menu = null; render(); window.scrollTo(0, 0); });
  render();
})();
