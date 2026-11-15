/* Should portal demo (rebuilt in Nightcap 2026-11-15 to match the real portal).
   The shell (bar, area pill, quick add, launcher, avatar, sub-page pills) uses the portal's own class
   names; portal.css and icons.js are copied from the portal by product/scripts/sync-demo.py.
   All data is in data.js and made up. Friend commands never go in the nav (Rod 11/12). */
(function () {
  'use strict';
  var D = window.DEMO, I = window.ICONS;
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function icon(n, size) {
    size = size || 20;
    return '<svg class="icon" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || I.assistant) + '</svg>';
  }

  // ---- Navigation: the portal's six areas, then the companies -------------------------------------------
  var GROUPS = [
    { key: 'today', name: 'Today', icon: 'today', tile: 'today', tabs: [['', 'today', 'today', 'var(--r-today)'], ['assistant', 'assistant', 'assistant', 'var(--r-assistant)'], ['coach', 'coach', 'coach', 'var(--r-coach)']] },
    { key: 'money', name: 'Money', icon: 'bookkeeper', tile: 'money', tabs: [['money', 'overview', 'today', 'var(--pen)'], ['bookkeeper', 'accountant', 'bookkeeper', 'var(--r-bookkeeper)'], ['financial', 'financial', 'financial', 'var(--r-financial)'], ['shopping', 'shopping', 'shopping', 'var(--r-shopping)']] },
    { key: 'home-health', name: 'Home & Health', icon: 'home-manager', tile: 'home', tabs: [['home', 'overview', 'today', 'var(--pen)'], ['chores', 'chores', 'home-manager', 'var(--r-home-manager)'], ['health', 'health', 'health', 'var(--r-health)']] },
    { key: 'plans', name: 'Plans', icon: 'scheduler', tile: 'plans', tabs: [['local-guide', 'local guide', 'local-guide', 'var(--r-local-guide)'], ['scheduler', 'scheduler', 'scheduler', 'var(--r-scheduler)'], ['travel', 'travel', 'travel', 'var(--r-travel)'], ['media', 'movies', 'media', 'var(--r-media)']] },
    { key: 'people', name: 'People', icon: 'people', tile: 'people', tabs: [['people', 'overview', 'today', 'var(--pen)'], ['relationship-manager', 'relationships', 'relationship-manager', 'var(--r-relationship-manager)'], ['gifts', 'gifts', 'gifts', 'var(--r-gifts)']] },
    { key: 'work', name: 'Work', icon: 'career', tile: 'work', tabs: [['work', 'overview', 'today', 'var(--pen)'], ['career', 'career', 'career', 'var(--r-career)'], ['legal', 'legal', 'legal', 'var(--r-legal)']] }
  ];
  var CO_TABS = [['', 'overview', 'business'], ['cap', 'cap table', 'financial'], ['compliance', 'compliance', 'legal'], ['money', 'accounts & money', 'bookkeeper'], ['tasks', 'tasks', 'check']];
  var H = D.holding;
  var COMPANIES = [{ slug: 'northstar', name: H.name, color: '#5ac8fa', depth: 0 }].concat(H.subs.map(function (s) { return { slug: s.slug, name: s.name, color: s.color, depth: 1, stage: s.stage }; }));
  var AREA = { health: 'health', shopping: 'shopping', chores: 'home', home: 'home' };

  // Desks that open as a simple role page (report + routines), with made-up reports.
  var DESKS = {
    assistant: ['Executive Assistant', 'Chief of staff: the morning text, your list, and one batched ask a day', 'Sent the 8 AM text. 3 things today, 2 decisions waiting. Moved the oil change to Monday so Saturday stays light.', ['Morning text, 8 AM', 'List hygiene, 5:45 AM']],
    coach: ['Personal Coach', 'Your weekly scorecard and the Saturday sit-down', 'Sit-down at 9:30: money and health are green, sleep is yellow. Three questions from the team, and up to 3 commitments for next week.', ['Weekly review, Saturdays 9 AM']],
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
    legal: ['Legal Advisor', 'Agreements, deadlines and questions for a lawyer', 'Lease renewal is in your email: the rent stays the same, 12 months. Sign by 12/1.', []]
  };

  // ---- Router --------------------------------------------------------------------------------------------
  var menu = null;
  function parse() {
    var h = (location.hash || '#/').slice(2).split('/');
    if (h[0] === 'c') return { co: h[1] || 'northstar', sec: h[2] || '' };
    if (h[0] === 'agency') return { co: 'brightside', sec: 'hours' };
    return { key: h[0] || '' };
  }
  function groupOf(key) { return GROUPS.filter(function (g) { return g.tabs.some(function (t) { return t[0] === key; }); })[0] || GROUPS[0]; }
  function hrefOf(key) { return '#/' + key; }

  function render() {
    var r = parse(), co = r.co && COMPANIES.filter(function (c) { return c.slug === r.co; })[0];
    var g = co ? null : groupOf(r.key);
    document.documentElement.dataset.area = co ? 'business' : (AREA[r.key] || g.tile);
    document.title = (co ? co.name : g.name) + ' · Should demo';
    renderBar(g, co);
    renderSeg(g, co, r);
    $('#app').innerHTML = co ? companyView(co, r.sec) : (VIEWS[r.key] || deskView)(r.key);
  }

  // ---- The app bar (portal +layout.svelte markup) --------------------------------------------------------
  function launcherApps() {
    return GROUPS.map(function (g) { return { name: g.name, icon: g.icon, href: hrefOf(g.tabs[0][0]), bg: 'var(--tile-' + g.tile + ')', act: g.key === 'money' }; })
      .concat([{ name: 'Health', icon: 'health', href: '#/health', bg: 'var(--tile-health)' }, { name: 'Coach', icon: 'coach', href: '#/coach', bg: 'var(--tile-plans)' }, { name: 'Agency desk', icon: 'as-architect', href: '#/agency', bg: 'var(--tile-business)' }]);
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
    var add = '<div class="panel list" role="menu" aria-label="Quick add"><form class="quick" onsubmit="return false"><label class="head" for="qa">Add a task (Todoist)</label><input id="qa" class="field" placeholder="Call the bank about…"><button class="nc-go" type="button" data-demo>Add</button><p class="small muted" id="qmsg" hidden>Demo: nothing is saved.</p></form>' +
      '<a role="menuitem" href="#/agency"><span class="mini" style="background: var(--tile-business)">' + icon('as-architect', 13) + '</span>Log time<span class="hint">text /agency /log 3h Client note</span></a>' +
      '<a role="menuitem" href="#/assistant"><span class="mini" style="background: var(--tile-today)">' + icon('ask', 13) + '</span>Ask Executive Assistant</a></div>';
    var launcher = '<div class="panel launcher" role="dialog" aria-label="All desks"><div class="grid">' +
      apps.map(function (a) { return '<a href="' + a.href + '"><span class="app" style="background:' + a.bg + '">' + icon(a.icon, 24) + (a.act ? '<i class="badge"></i>' : '') + '</span><span class="lbl">' + a.name + '</span></a>'; }).join('') +
      '</div><p class="head">Companies</p><div class="grid">' +
      COMPANIES.map(function (c) { return '<a href="#/c/' + c.slug + '"><span class="app" style="background: linear-gradient(135deg, color-mix(in srgb, ' + c.color + ' 60%, #fff), ' + c.color + ')">' + icon(c.slug === 'lantern' ? 'legal' : 'business', 24) + '</span><span class="lbl">' + esc(c.name) + '</span></a>'; }).join('') +
      '</div><p class="head">Systems and tools</p><div class="grid small">' +
      [['it', 'it'], ['webmaster', 'webmaster'], ['search', 'search'], ['people', 'phone book']].map(function (t) { return '<a href="#/assistant"><span class="app" style="background: var(--tile-systems)">' + icon(t[0], 20) + '</span><span class="lbl">' + t[1] + '</span></a>'; }).join('') + '</div></div>';
    var me = '<div class="panel list" role="menu" aria-label="' + D.me.name + '"><p class="who"><b>' + D.me.name + '</b><span class="small muted">' + D.me.email + '</span></p><a role="menuitem" href="#/coach">Coach and values</a><a role="menuitem" href="../">The Should page ↗</a></div>';
    bar.innerHTML =
      '<a href="#/" class="brand" aria-label="Should, Today"><svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#1f6f54"/><path d="M17 34.5 L27.5 44.5 L45 23" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="16.5" r="5" fill="#e88a60"/></svg><span class="word">Should</span></a>' +
      '<div class="mid"><span class="pop"><button class="pillbtn" data-menu="ctx" aria-haspopup="listbox" aria-expanded="' + (menu === 'ctx') + '"><span class="sw" style="background:' + (co ? co.color : 'var(--nc-blue)') + '"></span><span class="pname">' + esc(co ? co.name : g.name) + '</span><span class="chev' + (menu === 'ctx' ? ' up' : '') + '" aria-hidden="true">▾</span></button>' + (menu === 'ctx' ? ctx : '') + '</span></div>' +
      '<div class="right">' +
      '<span class="pop"><button class="round" data-menu="add" aria-label="Quick add" aria-expanded="' + (menu === 'add') + '"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>' + (menu === 'add' ? add : '') + '</span>' +
      '<span class="pop"><button class="round dot" data-menu="apps" aria-label="All desks" aria-expanded="' + (menu === 'apps') + '"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' + [5, 12, 19].map(function (y) { return [5, 12, 19].map(function (x) { return '<circle cx="' + x + '" cy="' + y + '" r="2.1" fill="currentColor"/>'; }).join(''); }).join('') + '</svg></button>' + (menu === 'apps' ? launcher : '') + '</span>' +
      '<span class="pop"><button class="round avatar" data-menu="me" aria-label="' + D.me.name + '’s menu" aria-expanded="' + (menu === 'me') + '">' + D.me.initials + '</button>' + (menu === 'me' ? me : '') + '</span>' +
      '</div>' + (menu ? '<div class="scrim" role="presentation"></div>' : '');
  }
  function renderSeg(g, co, r) {
    var tabs;
    if (co && co.slug === 'brightside') tabs = [['#/agency', 'hours', 'as-architect', co.color, r.sec === 'hours']].concat(CO_TABS.slice(1).map(function (t) { return ['#/c/brightside/' + t[0], t[1], t[2], co.color, r.sec === t[0]]; }));
    else if (co) tabs = CO_TABS.map(function (t) { return ['#/c/' + co.slug + (t[0] ? '/' + t[0] : ''), t[1], t[2], co.color, r.sec === t[0]]; });
    else tabs = g.tabs.map(function (t) { return [hrefOf(t[0]), t[1], t[2], t[3], r.key === t[0], t[0] === 'bookkeeper']; });
    $('#seg').innerHTML = '<div class="segin">' + tabs.map(function (t) {
      var cls = (t[4] ? 'on ' : '') + (t[5] ? 'act' : '');
      return '<a href="' + t[0] + '" style="--c:' + t[3] + '"' + (cls.trim() ? ' class="' + cls.trim() + '"' : '') + (t[4] ? ' aria-current="page"' : '') + '>' + icon(t[2], 14) + '<span>' + t[1] + '</span></a>';
    }).join('') + '</div>';
  }

  // ---- Building blocks ------------------------------------------------------------------------------------
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
  function pill(text, tone) { return '<span class="pill ' + (tone || '') + '">' + text + '</span>'; }
  function phone() {
    return '<section class="block phonecard"><h2 class="label"><span>A 1/2/3 text</span><span class="muted small">how you answer, on the go</span></h2><div class="msgs">' +
      D.text.map(function (m) { return '<p class="' + m[0] + '">' + esc(m[1]).replace(/\n/g, '<br>') + '</p>'; }).join('') + '</div></section>';
  }

  // ---- Views ----------------------------------------------------------------------------------------------
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
        card('Bills, next 14 days', rows(M.bills, function (b) { return '<b>' + b[0] + '</b><span class="num">' + b[1] + '</span><span class="muted">' + b[2] + '</span>' + pill(b[3], b[3] === 'autopay' ? 'ok' : 'watch'); }));
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
    work: function () {
      var X = D.work, tone = { strong: 'ok', maybe: 'watch', skip: 'act' };
      return hero('Job search and side work, from Career Assistant.', 'work') + tiles(X.tiles) +
        '<div class="cols2">' + card('Job leads', rows(X.leads, function (l) { return '<b>' + l[0] + '</b><span>' + l[1] + ' · ' + l[2] + '</span>' + pill(l[3], tone[l[3]]); }), '<span class="muted small">scored against your criteria</span>') +
        card('Pipeline', rows(X.pipeline, function (p) { return '<b>' + p[0] + '</b><span class="muted">' + p[1] + '</span>'; })) + '</div>';
    }
  };
  function deskView(key) {
    var d = DESKS[key];
    if (!d) return VIEWS['']();
    return '<header class="dhead" style="--c: var(--r-' + key + ')"><span class="badge">' + icon(key, 26) + '</span><div><h1 class="page-h1">' + d[0] + '</h1><p class="eyebrow">' + d[1] + '</p></div></header>' +
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

  // Companies: the holding company's command center, its subsidiaries, and the agency's hours.
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
  function agencyView() {
    var A = D.agency;
    var table = function (head, list) { return '<table class="data"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + list.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i ? ' class="num"' : '') + '>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>'; };
    return hero('<a href="#/c/northstar">Companies</a> · Business Executive', A.name, 'Hours, invoices, payouts and affiliates, read only.') +
      '<div class="testmode"><b>TEST MODE</b> · payments sandbox, no real money moves. Snapshot ' + A.snapshot + '.</div>' +
      card('Hours', '<p>' + A.total + '</p><div class="cols3"><div><h3 class="sub">By worker</h3>' + table(['Name', 'Hours', 'Cost', 'Billed'], A.workers) + '</div><div><h3 class="sub">By project</h3>' + table(['Project', 'Hours', 'Billed'], A.projects) + '</div><div><h3 class="sub">By client</h3>' + table(['Client', 'Hours', 'Billed'], A.clients) + '</div></div>', '<span class="seg-btns"><button class="on">this week</button><button>this month</button></span>');
  }

  // ---- Wiring ---------------------------------------------------------------------------------------------
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-menu]');
    if (b) { menu = menu === b.dataset.menu ? null : b.dataset.menu; render(); return; }
    if (e.target.closest('[data-demo]')) { var m = $('#qmsg'); if (m) m.hidden = false; return; }
    if (e.target.closest('.scrim')) { menu = null; render(); return; }
    var sb = e.target.closest('.seg-btns button');
    if (sb) sb.parentNode.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === sb); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu) { menu = null; render(); } });
  window.addEventListener('hashchange', function () { menu = null; render(); window.scrollTo(0, 0); });
  render();
})();
