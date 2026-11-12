/* Should portal demo: a static, simplified copy of the real portal for the public page.
 * Data rules: real data only for taste (movies), public places and
 * the agent roster. Money, health, people, tasks, calendar, companies and texts are made up.
 * No family names, addresses, phone numbers, emails, employers, legal or medical details. */
(() => {
  'use strict';

  // ---------- Icons ----------
  const I = {
    today: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    guide: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    movies: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 9h20M7 5v4M12 5v4M17 5v4"/>',
    money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
    agents: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20v-1a6 6 0 0 1 12 0v1M15 20v-1a4 4 0 0 1 7 0"/>',
    coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
    cap: '<path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
    company: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 13h18"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
    bar: '<path d="M8 22h8M12 11v11M3 3l9 9 9-9z"/>',
    outdoors: '<path d="m8 3 4 8 5-5 5 15H2z"/>',
    arts: '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c.9 0 1.5-.7 1.5-1.5 0-.4-.1-.8-.4-1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16a6 6 0 0 0 6-6c0-5-4.5-9-10-9z"/>',
    family: '<circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 21v-2a5 5 0 0 1 10 0v2M14 21v-1a3 3 0 0 1 6 0v1"/>',
  };
  const svg = (k, attrs = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${attrs}>${I[k] || I.guide}</svg>`;
  const CAT = { coffee: '#8a5a3c', bar: '#c2307a', food: '#e0672b', music: '#7b4fd6', outdoors: '#2e8b57', arts: '#2d6a8f', family: '#eda100' };

  // ---------- Dates (always relative to today, so the demo never looks stale) ----------
  const now = new Date();
  const addDays = (n) => { const d = new Date(now); d.setDate(d.getDate() + n); return d; };
  const nextDow = (dow) => addDays(((dow - now.getDay() + 7) % 7) || 7);
  const fmt = (d, o) => d.toLocaleDateString('en-US', o);
  const day = (d) => fmt(d, { weekday: 'short', month: 'short', day: 'numeric' });
  const sat = nextDow(6), sun = addDays(((7 - now.getDay()) % 7) || 7), fri = nextDow(5);
  const greet = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const money = (n) => (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ---------- Real, public taste data ----------
  // Media Concierge's picks (titles, posters from Wikipedia, the reason it fits).
  const MOVIES = [
    { t: 'Master and Commander: The Far Side of the World', y: 2003, d: 'Peter Weir', m: 138, g: 'Period · Adventure', where: 'Apple TV+', p: 'https://upload.wikimedia.org/wikipedia/en/b/bf/Master_and_Commander-The_Far_Side_of_the_World_poster.png',
      why: 'Napoleonic-era craft and candle-lit interiors in the Barry Lyndon vein. Real ships, real sea.' },
    { t: 'Ripley', y: 2024, d: 'Steven Zaillian', m: 480, g: 'Limited series', where: 'Netflix', p: 'https://upload.wikimedia.org/wikipedia/en/c/c4/Ripley_%28TV_series%29_Poster.jpg',
      why: 'Black-and-white, every frame composed like a still photograph.' },
    { t: 'Days of Heaven', y: 1978, d: 'Terrence Malick', m: 94, g: 'Period · Drama', where: 'Rent $3.99', p: 'https://upload.wikimedia.org/wikipedia/en/e/e7/Daysofheavenposter.jpg',
      why: 'Shot almost entirely at magic hour. Patient and image-first, like Kubrick.' },
    { t: 'The Duellists', y: 1977, d: 'Ridley Scott', m: 100, g: 'Period · Drama', where: 'Rent $3.99', p: 'https://upload.wikimedia.org/wikipedia/en/5/5d/Duellistsposter.jpg',
      why: 'The closest film to Barry Lyndon: painterly Napoleonic Europe and formal duels.' },
    { t: '1917', y: 2019, d: 'Sam Mendes', m: 119, g: 'War', where: 'Netflix', p: 'https://upload.wikimedia.org/wikipedia/en/f/fe/1917_%282019%29_Film_Poster.jpeg',
      why: "Roger Deakins' camera in what feels like one continuous shot." },
    { t: 'The Leopard', y: 1963, d: 'Luchino Visconti', m: 186, g: 'Period · Epic', where: 'Rent $3.99', p: 'https://upload.wikimedia.org/wikipedia/en/2/28/OLeopardo.jpg',
      why: 'Real palaces, candlelight and the slow, elegiac fall of a class.' },
    { t: 'The Power of the Dog', y: 2021, d: 'Jane Campion', m: 126, g: 'Western', where: 'Netflix', p: 'https://upload.wikimedia.org/wikipedia/en/6/6d/The_Power_of_the_Dog_%28film%29.jpg',
      why: 'Vast, patient landscapes and a slow-burn character study.' },
    { t: 'Roma', y: 2018, d: 'Alfonso Cuarón', m: 135, g: 'Drama', where: 'Netflix', p: 'https://upload.wikimedia.org/wikipedia/en/8/85/Roma_theatrical_poster.png',
      why: 'Long, gliding black-and-white shots. Pure image-making.' },
    { t: 'Train Dreams', y: 2025, d: 'Clint Bentley', m: 102, g: 'Period · Drama', where: 'Netflix', p: 'https://upload.wikimedia.org/wikipedia/en/5/58/Train_Dreams_poster.jpeg',
      why: 'Natural-light images of forests and rail camps.' },
  ];
  const WATCHED = [['Barry Lyndon', 1975, 5], ['Paths of Glory', 1957, 5], ['Amadeus', 1984, 4], ['The Last Duel', 2021, 4]];

  // Local Guide: public Salt Lake valley places (names, the one-line pitch, the venue's own photo when it has one).
  const P = (name, cat, city, score, pitch, img, url, mins, tags = []) => ({ name, cat, city, score, pitch, img, url, mins, tags });
  const PLACES = [
    P('Three Pines Coffee', 'coffee', 'Salt Lake City', 78, 'Specialty coffee on Main Street, steps from TRAX.', 'https://static.wixstatic.com/media/bfa48b_efd9c0e457604d85bce1e6aaf8b827a5%7Emv2_d_2560_1704_s_2.jpg/v1/fit/w_900,h_600,al_c/bfa48b_efd9c0e457604d85bce1e6aaf8b827a5%7Emv2_d_2560_1704_s_2.jpg', 'https://threepinescoffee.com', null),
    P('Publik Coffee Roasters', 'coffee', 'Salt Lake City', 84, 'A big, warm roastery with room to spread out.', null, 'https://publikcoffee.com', null),
    P('La Barba Coffee', 'coffee', 'Draper', 88, "Utah's best-known specialty roaster.", null, 'https://labarbacoffee.com', null, ['new']),
    P('Caffeine Station', 'coffee', 'Sandy', 85, 'Top-rated café, bright with big windows.', null, null, null),
    P('Garden Espresso', 'coffee', 'Murray', 70, 'A small neighborhood espresso bar.', null, null, null),
    P('Biscotts Bakery & Café', 'coffee', 'South Jordan', 72, 'A London-style chai house by the lake.', null, null, null),
    P('Bohemian Brewery', 'bar', 'Midvale', 84, 'Old-world lagers in a calm room made for long talks.', null, null, null, ['date-night']),
    P('2 Row Brewing', 'bar', 'Midvale', 72, "One of Utah's best brewers, plus cornhole.", null, 'https://2rowbrewing.com', null),
    P('Cliff Dining Pub', 'bar', 'Draper', 82, 'A pub with a mountain view and real food.', null, null, null, ['date-night']),
    P('Wolfdog Brewery', 'bar', 'Sandy', 68, 'A friendly local brewpub.', null, null, null),
    P('Hoof & Vine', 'food', 'Midvale', 82, "The valley's top-rated steakhouse.", 'https://static.wixstatic.com/media/08c62d_c59e510285964f469785ce73b2fa82f2.jpg/v1/fit/w_900,h_600,al_c/08c62d_c59e510285964f469785ce73b2fa82f2.jpg', 'https://hoofandvine.com', null, ['date-night']),
    P('Los Cucos', 'food', 'Sandy', 74, 'Sit-down Mexican, warm and loud.', 'https://loscucos.com/wp-content/uploads/2024/07/LosCucos.jpg', 'https://loscucos.com', null, ['lunch']),
    P("Penny Ann's Café", 'food', 'Draper', 64, 'Cozy local café, a breakfast favorite.', 'https://pennyannscafe.com/wp-content/uploads/2023/10/table.png', 'https://pennyannscafe.com', null, ['lunch', 'kids']),
    P('Libertango Steakhouse', 'food', 'Sandy', 84, 'Argentine steakhouse: Latin flavor, all grill.', null, null, null, ['lunch']),
    P('Goodwood Barbecue', 'food', 'Draper', 76, 'Slow-smoked meats, an easy lunch.', null, null, null, ['lunch', 'kids']),
    P('Spitz', 'food', 'Draper', 72, 'Döner meat over salad, quick and filling.', null, null, null, ['lunch']),
  ];
  const EVENTS = [
    { t: 'Temple Square Christmas lights', cat: 'arts', when: () => `${day(fri)} · 5 PM`, where: 'Salt Lake City', price: 'Free', why: 'The classic December walk: free, festive, an easy evening out.', kids: true, free: true },
    { t: 'Gardner Village "Christmas in the Village"', cat: 'family', when: () => `${day(sat)} · 4 PM`, where: 'West Jordan', price: 'Free', why: 'Late-afternoon shops and lights with an easy ride home.', kids: true, free: true },
    { t: 'Dimple Dell Regional Park walk', cat: 'outdoors', when: () => `${day(sun)} · midday`, where: 'Sandy', price: 'Free', why: 'A quiet trail an hour before lunch. Rest-day friendly.', kids: true, free: true },
    { t: 'Utah Symphony: Holiday Pops', cat: 'music', when: () => `${day(sat)} · 7:30 PM`, where: 'Abravanel Hall', price: '$29–89', why: 'Big orchestra, warm hall, dinner downtown first.' },
    { t: 'Jazz night at the Bohemian', cat: 'music', when: () => `${day(fri)} · 8 PM`, where: 'Midvale', price: '$10', why: 'A trio and a lager, no reservations needed.' },
  ];

  // The agent roster (the real org chart; descriptions are the public page's, generic on purpose).
  const ROSTER = [
    ['People you rely on most', [
      ['ea', 'Executive Assistant', 'Chief of staff: runs the team, brings you only decisions and problems', 'var(--r-ea)'],
      ['coach', 'Personal Coach', 'Scores every area against your own goals; the Saturday sit-down', 'var(--r-coach)']]],
    ['Money', [
      ['accountant', 'Accountant', 'Balances, bills, transactions and taxes', 'var(--r-money)'],
      ['advisor', 'Financial Advisor', 'Credit, retirement, the long-term money goal', 'var(--r-money)']]],
    ['Health', [['health', 'Health Agent', 'Training, meal plans, groceries, weigh-ins; text a nurse', 'var(--r-health)']]],
    ['Fun & Local', [
      ['guide', 'Local Guide', 'Places you might like, events, weekend picks, weather', 'var(--r-guide)'],
      ['media', 'Media Concierge', 'One great movie pick a night, and where to stream it', 'var(--r-media)'],
      ['events', 'Event Planner', 'Dinners, send-offs and get-togethers you host', 'var(--r-fun)'],
      ['music', 'Music Coach', 'Records the piano and turns it into sheet music', 'var(--r-fun)']]],
    ['Time & Travel', [
      ['scheduler', 'Scheduler', 'Calendar, appointments, due dates', 'var(--r-time)'],
      ['travel', 'Travel Agent', 'Fares, stays and cars; search only, you book', 'var(--r-time)']]],
    ['Home', [
      ['home', 'Home Manager', 'Cleaning, repairs, supplies and the car', 'var(--r-home)'],
      ['relocation', 'Relocation Expert', 'The next move, end to end', 'var(--r-home)']]],
    ['Shopping & Style', [
      ['shopping', 'Shopping Expert', 'Research, the wish list, price watch, carts', 'var(--r-shop)'],
      ['clothier', 'Clothier', 'Wardrobe and an outfit for the day', 'var(--r-shop)'],
      ['gifts', 'Gift Concierge', 'Birthdays, cards and gifts', 'var(--r-shop)']]],
    ['People', [
      ['relationships', 'Relationship Manager', 'Contacts, households, staying in touch', 'var(--r-people)'],
      ['investigator', 'Investigator', 'Who is this, can I trust it, scams', 'var(--r-people)']]],
    ['Career & Business', [
      ['career', 'Career Assistant', 'Resume, leads, recruiter replies', 'var(--r-career)'],
      ['business', 'Business Executive', 'Runs the companies: filings, cap tables, renewals', 'var(--r-career)'],
      ['legal', 'Legal Advisor', 'Keeps every agreement and its deadlines', 'var(--r-career)'],
      ['pr', 'PR Person', 'Profiles, posts and reputation; drafts only', 'var(--r-career)']]],
    ['Systems', [
      ['it', 'IT Guy', 'Wi-Fi, devices, account security, service health', 'var(--r-systems)'],
      ['webmaster', 'Webmaster', 'This portal', 'var(--r-systems)'],
      ['product', 'Product Manager', 'The product, its name and roadmap', 'var(--r-systems)']]],
  ];
  const AGENCY = [['architect', 'Software Architect', 'Leads the software team: architecture, plan, the build', 'var(--r-agency)'],
    ['po', 'Product Owner', 'Backlog and acceptance criteria', 'var(--r-agency)'], ['backend', 'Backend Engineer', 'The API', 'var(--r-agency)'],
    ['qa', 'QA Engineer', 'Tests and quality gates', 'var(--r-agency)'], ['devops', 'DevOps Engineer', 'CI, deploys, monitoring', 'var(--r-agency)']];
  const ALL = [...ROSTER.flatMap(([, r]) => r), ...AGENCY];

  // ---------- Made-up data ----------
  const TASKS = [
    ['Call the dentist to move the cleaning', 'Health', '10 min', 'today'],
    ['Pay the electric bill ($84.12, autopay off)', 'Money', '5 min', 'today'],
    ['Approve the Saturday grocery cart (Walmart, $96.40)', 'Shopping', '5 min', 'today'],
    ['Renew car registration online', 'Car', '15 min', 'Fri'],
    ['Pick a gift for Jordan (birthday next week)', 'Gifts', '10 min', 'Sat'],
    ['File the LLC annual report ($20)', 'Business', '20 min', 'next week'],
  ];
  const AGENDA = [
    ['7:00', 'Workout: lower body (45 min)', 'var(--r-health)'],
    ['9:00', 'Team standup', 'var(--r-career)'],
    ['12:15', 'Lunch: Los Cucos (Local Guide pick)', 'var(--r-guide)'],
    ['15:30', 'Dentist (moved from Thursday)', 'var(--r-health)'],
    ['19:30', 'Movie night: Master and Commander', 'var(--r-media)'],
  ];
  const FUN = { left: 142.6, through: day(addDays(9)), spent: 57.4, charges: [['Bohemian Brewery', 2, 38.2, true], ['Three Pines Coffee', 4, 6.75, true], ['Fandango', 6, 12.45, false]] };
  const REPORTS = {
    ea: { status: 'on track', wins: ['Moved 3 tasks off an overloaded Wednesday', 'Morning text out at 8:00 every day', 'Queued 2 decisions instead of 9 questions'], next: ['Payday plan Friday', 'Weekly review prep for the coach'], ask: 'Approve the payday plan when it comes in Friday.' },
    guide: { status: 'on track', wins: ['Scored 38 places against your taste', 'Found 5 events this weekend, 3 free', 'Added photos for the top picks'], next: ['Holiday events feed', 'Date-night shortlist'], ask: null },
    media: { status: 'on track', wins: ["Tonight's pick: Master and Commander (leaves Apple TV+ at month end)", 'Watchlist sorted by where it streams', 'Logged 4 watched films'], next: ['A Kubrick double feature for the weekend'], ask: null },
    accountant: { status: 'keep an eye on it', wins: ['All 14 bills matched to the calendar', 'Fun money tagged automatically'], next: ['Payday split Friday'], ask: 'The water bill went up 18%. Check for a leak?' },
    health: { status: 'on track', wins: ['4 of 4 workouts done', 'Protein target hit 6 of 7 days', 'Grocery cart built from the meal plan'], next: ['Deload week', 'New breakfast rotation'], ask: null },
    business: { status: 'keep an eye on it', wins: ['Cap table checked: 2 rows still unsigned', 'Annual report task added with the $20 fee'], next: ['Operating agreement draft for review'], ask: 'Sign the founder units agreement so the cap table shows signed.' },
  };
  const COMPANIES = [
    { slug: 'example-holdings', name: 'Example Holdings LLC', short: 'Example Holdings', color: '#3d6fd1', depth: 0, status: 'active' },
    { slug: 'example-labs', name: 'Example Labs LLC', short: 'Example Labs', color: '#c2307a', depth: 1, status: 'planned' },
  ];
  const CAP = {
    'example-holdings': { units: 1000000, rows: [['Sam Carter', 'person', 'Common units', 100, 1000000, 'signed']], safes: [] },
    'example-labs': { units: 10000000, rows: [
      ['Example Holdings LLC', 'company', 'Common units', 80, 8000000, 'signed'],
      ['Alex Rivera', 'person', 'Profits interest', 10, 1000000, 'unsigned'],
      ['Option pool', 'pool', 'Reserved', 10, 1000000, 'signed']],
      safes: [['Northwind Angels', 50000, 5000000, 20]] },
  };
  const DEADLINES = { 'example-holdings': [['Annual report (state)', 34, '$20'], ['Business license renewal (city)', 61, '$50'], ['Federal tax return (pass-through)', 128, '$0']],
    'example-labs': [['File articles of organization', 9, '$59'], ['Get an EIN', 12, '$0'], ['Sign the operating agreement', 14, '$0']] };

  // ---------- Context and router ----------
  const PERSONAL = { slug: '', short: 'Personal', color: '#1f6f54' };
  let ctx = PERSONAL;
  const PAGES = [['', 'Today', 'today'], ['guide', 'Local Guide', 'guide'], ['movies', 'Movies', 'movies'], ['money', 'Money', 'money'], ['agents', 'Agents', 'agents'], ['coffee', '/coffee', 'coffee']];
  const CO_PAGES = [['', 'Overview', 'company'], ['cap', 'Cap table', 'cap'], ['agents', 'Team', 'agents']];
  const $ = (s) => document.querySelector(s);
  const app = $('#app');

  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    let page = parts[0] || '', arg = parts[1];
    if (page === 'c') { ctx = COMPANIES.find((c) => c.slug === parts[1]) || COMPANIES[0]; page = parts[2] || ''; arg = parts[3]; }
    else ctx = PERSONAL;
    document.documentElement.style.setProperty('--ctx', ctx.color);
    $('#ctxname').textContent = ctx.short;
    const pre = ctx.slug ? `#/c/${ctx.slug}/` : '#/';
    const list = ctx.slug ? CO_PAGES : PAGES;
    const links = list.map(([k, n, ic]) => `<a href="${pre}${k}" class="${k === page ? 'on' : ''}">${svg(ic)}<span>${n}</span></a>`).join('');
    $('#nav').innerHTML = list.map(([k, n]) => `<a href="${pre}${k}" class="${k === page ? 'on' : ''}">${n}</a>`).join('');
    $('#tabs').innerHTML = links;
    const view = ctx.slug ? ({ '': companyView, cap: capView, agents: teamView }[page] || companyView)
      : ({ '': todayView, guide: guideView, movies: moviesView, money: moneyView, agents: arg ? () => deskView(arg) : agentsView, coffee: coffeeView }[page] || todayView);
    app.innerHTML = view();
    window.scrollTo(0, 0);
    wire();
  }

  function ctxMenu() {
    const btn = $('#ctxbtn'), menu = $('#ctxmenu');
    const items = [PERSONAL, ...COMPANIES];
    menu.innerHTML = items.map((c) => `<button role="menuitem" data-slug="${c.slug}" class="${c.depth ? 'sub' : ''}"><span class="dot" style="background:${c.color}"></span>${c.short}${c.status === 'planned' ? '<span class="tag">planned</span>' : ''}</button>`).join('');
    btn.onclick = (e) => { e.stopPropagation(); const o = menu.classList.toggle('open'); btn.setAttribute('aria-expanded', o); };
    menu.onclick = (e) => { const b = e.target.closest('button'); if (!b) return; menu.classList.remove('open'); location.hash = b.dataset.slug ? `#/c/${b.dataset.slug}/` : '#/'; };
    document.addEventListener('click', () => menu.classList.remove('open'));
  }

  // ---------- Pieces ----------
  const media = (x, cat) => `<div class="media" style="--cat:${CAT[cat]}">${x.img ? `<img src="${x.img}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">` : ''}${x.img ? '' : svg(cat === 'food' ? 'food' : cat)}<span class="cat">${cat}</span></div>`;
  const placeCard = (p) => `<a class="card" style="--cat:${CAT[p.cat]}" ${p.url ? `href="${p.url}" target="_blank" rel="noopener"` : ''}>${media(p, p.cat)}
    <div class="cbody"><b>${p.name}</b><span class="meta">${p.city} · ${p.cat === 'food' ? 'restaurant' : p.cat}</span>
    <span class="chips"><span class="pill score">${p.score}</span>${p.tags.includes('kids') ? '<span class="pill">kids</span>' : ''}</span>
    <span class="why">${p.pitch}</span></div></a>`;
  const eventCard = (e) => `<div class="card" style="--cat:${CAT[e.cat]}">${media({}, e.cat)}<div class="cbody"><b>${e.t}</b><span class="meta">${e.when()}</span>
    <span class="meta">${e.where} · <b>${e.price}</b></span><span class="chips">${e.kids ? '<span class="pill">kids</span>' : ''}</span><span class="why">${e.why}</span></div></div>`;
  const funCard = () => `<section class="block fun"><h2 class="label">fun money <a href="#/money">more</a></h2>
    <p class="big"><b class="num">${money(FUN.left)}</b><span>Free to spend, through ${FUN.through}</span></p>
    <p class="small muted" style="margin:0 0 8px">${money(FUN.spent)} of fun so far. Spend it on anything; nobody comments.</p>
    <ul class="list">${FUN.charges.map(([m, d, a, auto]) => `<li><span>${m}${auto ? '<span class="auto" title="Not fun? Text /notfun">auto</span>' : ''}</span><span class="small muted num">${day(addDays(-d))} · ${money(a)}</span></li>`).join('')}</ul></section>`;
  const movieCard = (m, full) => `<section class="block"><h2 class="label">tonight's movie <a href="#/movies">watchlist</a></h2>
    <div class="pick"><img class="poster" src="${m.p}" alt="${m.t} poster" loading="lazy" referrerpolicy="no-referrer">
    <div><h3>${m.t}</h3><p class="small muted" style="margin:0 0 6px">${m.y} · ${m.d} · ${Math.floor(m.m / 60)}h ${m.m % 60}m · ${m.g}</p>
    <p style="margin:0 0 8px">${m.why}</p><span class="pill ok">Streaming on ${m.where}</span>${full ? ' <span class="pill warn">Leaves at month end</span>' : ''}</div></div></section>`;

  // ---------- Views ----------
  function todayView() {
    const m = MOVIES[0];
    return `<p class="eyebrow">${fmt(now, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
    <h1 class="page-h1">${greet}, Sam</h1>
    <p class="lede">Twenty-seven agents worked overnight. Here's what they need from you, and what they already handled.</p>
    <div class="grid">
      <section class="block s8"><h2 class="label">morning brief <span class="muted" style="text-transform:none;letter-spacing:0;font-weight:500">texted 8:00 AM</span></h2>
        <div class="brief"><div class="avatar" style="background:var(--r-ea)">EA</div><div class="bubble">
          <p><b>3 things today.</b> Dentist moved to 3:30. Electric bill is due ($84.12). Approve the grocery cart by noon.</p>
          <p>Done yesterday: car insurance card saved, 2 tasks moved off Wednesday, birthday card for Jordan in the mail.</p>
          <p>Weather is clear, 57°. Fun money: ${money(FUN.left)} left. Tonight: <i>Master and Commander</i>.</p>
          <p class="small muted">Reply 1 to approve the cart · 2 to see it · 3 tomorrow</p></div></div></section>
      <section class="block s4"><h2 class="label">weather</h2><div class="wx">
        <div><span class="small muted">today</span><br><b>57°</b> <span class="muted">/ 40°</span><br><span class="small">Clear · AQI 38 good</span></div>
        <div><span class="small muted">tomorrow</span><br><b>61°</b> <span class="muted">/ 42°</span><br><span class="small">Sunny · dry</span></div></div>
        <p class="small muted" style="margin:10px 0 0">Nothing that changes plans.</p></section>
      <div class="s12 tiles">
        <div class="tile"><b>6</b><span>tasks today · 1h 05m</span></div><div class="tile"><b>2</b><span>decisions waiting</span></div>
        <div class="tile"><b>${money(2318.4).replace('.40', '')}</b><span>checking, after bills</span></div><div class="tile"><b>4/4</b><span>workouts this week</span></div></div>
      <section class="block s6"><h2 class="label">today &amp; next <a href="#/agents/ea">assistant</a></h2><ul class="list">${TASKS.map(([t, p, d, w]) => `<li><span class="check"></span><span class="li-main"><b>${t}</b><span class="small muted">${p} · ${d}</span></span><span class="when">${w}</span></li>`).join('')}</ul></section>
      <section class="block s6"><h2 class="label">calendar</h2><ul class="list agenda">${AGENDA.map(([t, x, c]) => `<li><span class="t">${t}</span><span class="bar2" style="background:${c}"></span><span class="li-main">${x}</span></li>`).join('')}</ul></section>
      <div class="s6">${funCard()}</div>
      <div class="s6">${movieCard(m)}</div>
      <section class="block s12"><h2 class="label">this weekend <a href="#/guide">local guide</a></h2><div class="row">${EVENTS.slice(0, 3).map(eventCard).join('')}${PLACES.filter((p) => p.img).map(placeCard).join('')}</div></section>
    </div>`;
  }

  let gFilter = 'all';
  function guideView() {
    const pass = (x) => gFilter === 'kids' ? (x.kids || x.tags?.includes('kids')) : gFilter === 'free' ? x.free : true;
    const ev = EVENTS.filter(pass), hero = ev.slice(0, 3);
    const pl = PLACES.filter(pass).sort((a, b) => b.score - a.score);
    const list = (cat, name, rows) => `<section class="block" style="--cat:${CAT[cat]}"><h2 class="label" style="color:${CAT[cat]}">${svg(cat === 'food' ? 'food' : cat, 'width="16" height="16"')}${name}</h2>
      <ol class="rank">${rows.slice(0, 6).map((p) => `<li>${p.img ? `<img class="thumb" src="${p.img}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<span class="thumb">${svg(cat === 'food' ? 'food' : cat)}</span>`}
        <span class="li-main"><b>${p.name}</b><span class="chips"><span class="pill">${p.city}</span></span></span><span class="pill score">${p.score}</span></li>`).join('') || '<li class="muted">Nothing with this filter.</li>'}</ol></section>`;
    return `<p class="eyebrow">Fun &amp; Local</p><h1 class="page-h1">Local Guide</h1>
    <p class="lede">Places scored against your taste, this weekend's best events, and where to get coffee, a beer or lunch. Real Salt Lake valley places.</p>
    <div class="filters">${[['all', 'All'], ['kids', 'Kid-friendly'], ['free', 'Free']].map(([k, n]) => `<button data-f="${k}" class="${gFilter === k ? 'on' : ''}">${n}</button>`).join('')}</div>
    <section><h2 class="label">this weekend · ${fmt(fri, { month: 'short', day: 'numeric' })}–${fmt(sun, { month: 'short', day: 'numeric' })}</h2>
      <div class="hero">${hero.map((e) => `<div class="herocard" style="--cat:${CAT[e.cat]}">${svg(e.cat)}<div class="over"><span class="w">${e.when()}</span><span class="t">${e.t}</span><span class="d">${e.where} · ${e.price}</span><span class="d"><i>${e.why}</i></span></div></div>`).join('') || '<p class="muted">Nothing with this filter.</p>'}</div></section>
    <section><h2 class="label">events this week</h2><div class="row">${ev.map(eventCard).join('') || '<p class="muted">Nothing with this filter.</p>'}</div></section>
    <section><h2 class="label">places to try</h2><div class="row">${pl.map(placeCard).join('')}</div></section>
    <section class="lists">${list('coffee', 'coffee', pl.filter((p) => p.cat === 'coffee'))}${list('bar', 'bars', pl.filter((p) => p.cat === 'bar'))}${list('food', 'lunch', pl.filter((p) => p.tags.includes('lunch')))}</section>`;
  }

  function moviesView() {
    return `<p class="eyebrow">Fun &amp; Local · Media Concierge</p><h1 class="page-h1">Movies</h1>
    <p class="lede">One strong pick a night from your taste (Kubrick, Barry Lyndon, painterly period films), with where it streams and what's leaving soon. These are the real picks.</p>
    ${movieCard(MOVIES[0], true)}
    <section class="block"><h2 class="label">watchlist</h2><div class="posters">${MOVIES.slice(1).map((m) => `<a href="https://en.wikipedia.org/wiki/${encodeURIComponent(m.t.replace(/ /g, '_'))}" target="_blank" rel="noopener"><img class="poster" src="${m.p}" alt="" loading="lazy" referrerpolicy="no-referrer"><b>${m.t}</b><br>${m.y} · ${m.where}</a>`).join('')}</div></section>
    <section class="block"><h2 class="label">watched</h2><ul class="list">${WATCHED.map(([t, y, r]) => `<li><span class="li-main"><b>${t}</b><span class="small muted">${y}</span></span><span class="pill">${'★'.repeat(r)}</span></li>`).join('')}</ul></section>`;
  }

  function moneyView() {
    const accts = [['Checking', 2318.4, 'bank'], ['Savings', 6120, 'bank'], ['Venmo', 312.5, 'wallet'], ['Credit card', -486.22, 'card']];
    const bills = [['Rent', 1650, 1, true], ['Electric', 84.12, 0, false], ['Internet', 70, 12, true], ['Phone', 95, 15, true], ['Car insurance', 118.4, 21, true]];
    return `<p class="eyebrow">Money · Accountant</p><h1 class="page-h1">Money</h1>
    <p class="lede">Read only: the agents never move money. They match every bill to a date, flag the tight weeks and keep fun money guilt-free.</p>
    <div class="grid"><div class="s6">${funCard()}</div>
    <section class="block s6"><h2 class="label">accounts</h2><ul class="list">${accts.map(([n, b, l]) => `<li><span class="li-main"><b>${n}</b><span class="small muted">${l}</span></span><b class="num" style="color:${b < 0 ? 'var(--red)' : 'inherit'}">${money(b)}</b></li>`).join('')}</ul></section>
    <section class="block s12"><h2 class="label">bills, next 30 days</h2><div class="scroll"><table class="data"><thead><tr><th>Bill</th><th>Due</th><th class="r">Amount</th><th>Autopay</th></tr></thead>
    <tbody>${bills.map(([n, a, d, ap]) => `<tr><td>${n}</td><td>${d === 0 ? 'today' : day(addDays(d))}</td><td class="r num">${money(a)}</td><td>${ap ? '<span class="pill ok">on</span>' : '<span class="pill warn">pay it</span>'}</td></tr>`).join('')}</tbody></table></div></section>
    <section class="block s12"><h2 class="label">low point before payday</h2><p style="margin:0">Checking bottoms out at <b>${money(612.18)}</b> on ${day(addDays(8))}, above the ${money(250).replace('.00', '')} floor. Safe to book the Saturday dinner.</p></section></div>`;
  }

  const deskTile = ([k, n, d, c], pre = '#/agents/') => `<a class="desk" href="${pre}${k}" style="--c:${c}"><span class="ic">${n.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span><span><b>${n}</b><p>${d}</p></span></a>`;
  function agentsView() {
    return `<p class="eyebrow">The staff</p><h1 class="page-h1">Agents</h1>
    <p class="lede">Each agent has its own desk: what it owns, its tasks and its latest report. You talk to two of them; the rest report up.</p>
    ${ROSTER.map(([g, rs]) => `<h2 class="dept">${g}</h2><div class="desks">${rs.map((r) => deskTile(r)).join('')}</div>`).join('')}`;
  }
  function deskView(key) {
    const r = ALL.find((x) => x[0] === key) || ALL[0];
    const rep = REPORTS[key] || { status: 'on track', wins: ['Checked its area this morning', 'Nothing needs you today'], next: ['Weekly report Friday'], ask: null };
    const st = rep.status === 'on track' ? 'ok' : 'warn';
    return `<div class="deskhead"><span class="ic" style="background:${r[3]}">${r[1].split(' ').map((w) => w[0]).join('').slice(0, 2)}</span><div><h1 class="page-h1" style="margin:0">${r[1]}</h1><p class="muted" style="margin:0">${r[2]}</p></div></div>
    <div class="grid"><section class="block s8 report"><h2 class="label">latest report <span class="pill ${st}">${rep.status}</span></h2>
      <h3>Wins</h3><ul>${rep.wins.map((w) => `<li>${w}</li>`).join('')}</ul><h3>Next</h3><ul>${rep.next.map((w) => `<li>${w}</li>`).join('')}</ul>
      ${rep.ask ? `<h3>Needs you</h3><p style="margin:0">${rep.ask}</p>` : ''}</section>
    <section class="block s4"><h2 class="label">never does</h2><ul class="list"><li>Pays, buys or books anything</li><li>Messages anyone without your yes</li><li>Deletes your data</li></ul></section>
    ${key === 'media' ? `<div class="s12">${movieCard(MOVIES[0])}</div>` : ''}
    ${key === 'guide' ? `<section class="block s12"><h2 class="label">top picks <a href="#/guide">open the guide</a></h2><div class="row">${PLACES.filter((p) => p.img).map(placeCard).join('')}</div></section>` : ''}</div>
    <p style="margin-top:16px"><a href="#/agents">← all agents</a></p>`;
  }

  function coffeeView() {
    return `<p class="eyebrow">For friends</p><h1 class="page-h1">/coffee</h1>
    <p class="lede">Friends can text one word to get on your calendar. The assistant picks a favorite café near you, offers three free times, and books the one they choose. It never shares your calendar.</p>
    <div class="coffee-wrap"><div class="phone" aria-label="Text conversation"><div class="ph-top">Sam's assistant<span>Text message</span></div><div class="msgs" id="msgs"></div></div>
      <div><ol class="steps"><li>Alex texts <b>/coffee</b> to Sam's number.</li><li>The assistant checks Sam's calendar and picks a café Local Guide scored highly.</li>
      <li>Alex replies with a digit. The invite lands on both calendars.</li><li>Before 3 PM it's <b>/coffee</b>; after 3 PM, <b>/beer</b>.</li></ol>
      <p><button class="btn" id="replay">Play it again</button></p></div></div>`;
  }
  const CHAT = [['me', '/coffee'], ['them', 'Hi Alex, this is Sam\'s assistant. Coffee at Three Pines Coffee, a favorite near Sam:\n1 Thu 8:30 AM · 2 Fri 9:00 AM · 3 Sat 11:00 AM'],
    ['me', '2'], ['them', 'Done: coffee Fri 9:00 AM at Three Pines Coffee. Sam has the invite and is looking forward to it.\nassistant here to /help'], ['me', '🙌']];
  function playChat() {
    const box = $('#msgs'); if (!box) return;
    box.innerHTML = CHAT.map(([w, t]) => `<div class="msg ${w}">${t.replace(/\n/g, '<br>')}</div>`).join('');
    [...box.children].forEach((el, i) => setTimeout(() => el.classList.add('show'), 350 + i * 900));
  }

  // Company context
  const co = () => ctx;
  function companyView() {
    const c = co(), cap = CAP[c.slug], dl = DEADLINES[c.slug];
    return `<p class="eyebrow">${c.status === 'planned' ? 'Planned subsidiary' : 'Holding company'}</p><h1 class="page-h1">${c.name}</h1>
    <p class="lede">The whole view changes with the company: its own tasks, deadlines, cap table and team. Nothing personal shows here.</p>
    <div class="tiles" style="margin-bottom:14px"><div class="tile"><b>${dl.length}</b><span>deadlines ahead</span></div><div class="tile"><b>${cap.rows.length}</b><span>holders</span></div>
      <div class="tile"><b>${cap.rows.filter((r) => r[5] !== 'signed').length}</b><span>unsigned rows</span></div><div class="tile"><b>${c.status}</b><span>status</span></div></div>
    <div class="grid"><section class="block s6"><h2 class="label">compliance</h2><ul class="list">${dl.map(([t, d, f]) => `<li><span class="li-main"><b>${t}</b><span class="small muted">${day(addDays(d))} · fee ${f}</span></span><span class="pill ${d < 20 ? 'warn' : ''}">in ${d} days</span></li>`).join('')}</ul></section>
    <section class="block s6"><h2 class="label">ownership <a href="#/c/${c.slug}/cap">cap table</a></h2>${stack(cap)}<ul class="tree">${COMPANIES.map((x) => `<li style="padding-left:${x.depth * 1.3}rem">${x.depth ? '<span class="muted">└</span>' : ''}<b>${x.name}</b><span class="small muted">${x.depth ? '80% owned by Example Holdings' : '100% Sam Carter'}${x.status === 'planned' ? ' · planned' : ''}</span></li>`).join('')}</ul></section>
    <section class="block s12"><h2 class="label">company tasks</h2><ul class="list">${(c.depth ? ['Draft the operating agreement', 'Pick a registered agent', 'Open the business bank account'] : ['File the annual report ($20)', 'Renew the city business license', 'Send Q4 numbers to the accountant']).map((t) => `<li><span class="check"></span><span class="li-main"><b>${t}</b></span><span class="pill">${c.slug}</span></li>`).join('')}</ul></section></div>`;
  }
  const COLORS = ['var(--ctx)', '#c8643b', '#8a8f98'];
  const stack = (cap) => `<div class="stack">${cap.rows.map((r, i) => `<span style="width:${r[3]}%;background:${COLORS[i % 3]};opacity:${r[5] === 'signed' ? 1 : 0.45}"></span>`).join('')}</div>
    <div class="legend">${cap.rows.map((r, i) => `<span><i style="background:${COLORS[i % 3]};opacity:${r[5] === 'signed' ? 1 : 0.45}"></i>${r[0]} ${r[3]}%</span>`).join('')}</div>`;
  function capView() {
    const c = co(), cap = CAP[c.slug];
    const badge = (s) => s === 'signed' ? '<span class="pill ok">Signed</span>' : '<span class="pill bad">Recorded, unsigned</span>';
    return `<p class="eyebrow">${c.name}</p><h1 class="page-h1">Cap table</h1>
    <p class="lede">Business Executive keeps an append-only ledger. A row without signed paper shows as "Recorded, unsigned", never as owned.</p>
    <section class="block">${stack(cap)}<div class="scroll"><table class="data"><thead><tr><th>Holder</th><th>Class</th><th class="r">Recorded</th><th class="r">Units</th><th>Paper</th></tr></thead>
    <tbody>${cap.rows.map(([h, k, cl, pct, u, s]) => `<tr><td>${h} <span class="small muted">· ${k}</span></td><td class="small">${cl}</td><td class="r num">${pct}%</td><td class="r num small">${u.toLocaleString()}</td><td>${badge(s)}</td></tr>`).join('')}</tbody></table></div>
    ${cap.rows.some((r) => r[5] !== 'signed') ? '<p class="small" style="color:var(--amber);margin:10px 0 0">1 warning: a holder has no signed agreement yet.</p>' : ''}</section>
    <section class="block" style="margin-top:14px"><h2 class="label">SAFEs outstanding</h2>${cap.safes.length ? `<div class="scroll"><table class="data"><thead><tr><th>Investor</th><th class="r">Amount</th><th class="r">Cap</th><th class="r">Discount</th></tr></thead><tbody>${cap.safes.map(([n, a, cp, d]) => `<tr><td>${n}</td><td class="r num">${money(a).replace('.00', '')}</td><td class="r num">${money(cp).replace('.00', '')}</td><td class="r">${d}%</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted small" style="margin:0">None.</p>'}</section>`;
  }
  function teamView() {
    const c = co(), pre = `#/c/${c.slug}/agents/`;
    const team = c.depth ? AGENCY : [ALL.find((x) => x[0] === 'business'), ALL.find((x) => x[0] === 'legal'), ALL.find((x) => x[0] === 'accountant')];
    return `<p class="eyebrow">${c.name}</p><h1 class="page-h1">Team</h1><p class="lede">Agents that work for this company. Their tasks carry the company's label, so nothing leaks into Personal.</p>
    <div class="desks">${team.map((r) => deskTile(r, '#/agents/')).join('')}</div>`;
  }

  function wire() {
    app.querySelectorAll('.filters button').forEach((b) => b.onclick = () => { gFilter = b.dataset.f; route(); });
    const r = $('#replay'); if (r) r.onclick = playChat;
    playChat();
  }

  ctxMenu();
  window.addEventListener('hashchange', route);
  route();
})();
