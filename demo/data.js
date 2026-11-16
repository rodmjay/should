window.DEMO = {
  me: { name: 'Sam Carter', initials: 'SC', email: 'sam@example.com' },
  date: 'Saturday', dateLong: 'November 21, 2026',

  today: {
    brief: 'Quiet Saturday. The cleaner comes 9–12 and your coach sit-down is at 9:30. The one thing that matters today is choosing a gym plan, and the agents have the comparison ready.',
    attention: 2,
    tiles: [
      { label: 'To do today', value: '1 of 3', sub: 'from the morning brief' },
      { label: 'Checking', value: '$1,584.22', sub: 'as of 6:15 AM' },
      { label: 'Bills, next 14 days', value: '$1,212.40', sub: '5 bills, 4 on autopay' },
      { label: 'Steps this week', value: '48,210', sub: 'goal 56,000', spark: [5200, 7400, 6900, 8100, 7600, 6400, 6610] },
      { label: 'Credit score', value: '731', sub: 'goal 760', spark: [702, 708, 715, 719, 726, 731] }
    ],
    weather: { line: 'Partly sunny, 48°/31°. Dry all day, a good one for the walk.', places: [['Home', '48°/31°', 'Partly sunny'], ['Office', '50°/33°', 'Sunny']] },
    tasks: [
      ['Pick a gym plan: two options texted', 'Phone', '5 min', true],
      ['Sign the lease renewal (link in your email)', 'Home', '10 min', false],
      ['Call the dentist to move Tuesday’s cleaning', 'Phone', '5 min', false]
    ],
    waiting: [
      ['Landlord', 'fixing the bathroom fan', 'since Mon'],
      ['Riverside Clinic', 'your lab results', 'since Wed'],
      ['Jordan Lee', 'reply about Thanksgiving', 'since Thu']
    ],
    calendar: [
      ['9:00', 'Cleaner (Maria)', 'home'],
      ['9:30', 'Coach sit-down', 'plans'],
      ['12:30', 'Lunch with Alex, Green Fork', 'people'],
      ['6:00', 'Movie night: a pick is ready', 'plans']
    ],
    done: 'Renewed the car registration reminder, filed 3 receipts, found a cheaper phone plan ($12/mo less), drafted a birthday card for Priya.'
  },

  money: {
    tiles: [
      { label: 'Low point before payday', value: '$1,164.22', sub: 'Thu 11/26 · safe', tone: 'good' },
      { label: 'Checking now', value: '$1,584.22', sub: '11/21, 6:15 AM' },
      { label: 'Days to payday', value: '6', sub: 'Fri, Nov 27' },
      { label: 'Fun money left', value: '$140', sub: 'of $200 this pay period' },
      { label: 'Bills on time', value: '100%', sub: '12 of 12 this quarter', tone: 'good' }
    ],
    tabs: ['Dashboard', 'Recurring', 'Spending', 'Transactions', 'Net worth', 'Cash flow', 'Credit', 'Goals'],
    spend: { total: '$2,415', note: '$318 less than this point last month', now: [0, 120, 260, 410, 690, 820, 905, 1180, 1290, 1420, 1610, 1790, 1880, 2050, 2160, 2280, 2330, 2415], last: [0, 90, 300, 520, 610, 880, 1010, 1240, 1400, 1530, 1720, 1900, 2100, 2240, 2390, 2550, 2650, 2733, 2850, 2990, 3100, 3180, 3260, 3320, 3410, 3480, 3550, 3600, 3660, 3700] },
    bills: [
      ['Electric', '$84.12', 'Mon 11/23', 'autopay'],
      ['Phone', '$45.00', 'Tue 11/24', 'autopay'],
      ['Internet', '$65.00', 'Wed 11/25', 'autopay'],
      ['Car insurance', '$118.28', 'Fri 11/27', 'autopay'],
      ['Rent', '$900.00', 'Tue 12/1', 'pay link texted']
    ],
    report: 'Balances synced at 6:15. Spending is 12% under last month. One bill (rent) needs your tap on the texted link after payday; the rest are on autopay.'
  },

  health: {
    tiles: [
      { label: 'Weight', value: '182.4 lb', sub: 'goal 178', spark: [186.1, 185.4, 184.9, 184.2, 183.6, 183.0, 182.4] },
      { label: 'Protein today', value: '96 g', sub: 'of 150 g' },
      { label: 'Workouts this week', value: '3 of 4', sub: 'legs left, Sunday off' },
      { label: 'Sleep', value: '7h 12m', sub: '7-night average' }
    ],
    meals: [['Breakfast', 'Eggs, black beans, salsa, avocado'], ['Lunch', 'Chicken salad bowl, lime dressing'], ['Dinner', 'Grilled fish tacos, slaw'], ['Prep Sunday', 'Shredded beef, rice, roasted peppers']],
    training: [['Mon', 'Upper body', 'done'], ['Tue', 'Walk 45 min', 'done'], ['Thu', 'Lower body', 'done'], ['Sat', 'Legs + core', 'today']],
    cart: '23 items in the grocery cart from the meal plan, $96.40. Checkout is yours, from the texted link.'
  },

  home: {
    tiles: [
      { label: 'Next cleaning', value: 'Today', sub: '9:00–12:00' },
      { label: 'Chores this week', value: '4 of 6', sub: '2 left, both 10 min' },
      { label: 'Repairs open', value: '1', sub: 'bathroom fan, landlord', tone: 'watch' },
      { label: 'Supplies low', value: '3', sub: 'in the cart already' }
    ],
    chores: [['Laundry', 'Mon', true], ['Dishes and counters', 'daily', true], ['Water the plants', 'Wed', true], ['Change the sheets', 'Sat', false], ['Take out recycling', 'Sun night', false], ['Clean the fridge', 'Thu', true]],
    repairs: [['Bathroom fan is loud', 'Landlord pays under the lease', 'asked Mon, waiting']],
    supplies: [['Paper towels', '2 left'], ['Dish soap', 'low'], ['Cat litter', '1 week left']]
  },

  people: {
    tiles: [
      { label: 'Birthdays, next 30 days', value: '3', sub: 'cards drafted for all' },
      { label: 'Overdue to reach out', value: '2', sub: 'drafts ready' },
      { label: 'Contacts', value: '412', sub: '6 merged this week' }
    ],
    birthdays: [['Priya Shah', 'friend', 'Tue 11/24', 'card drafted, gift idea: a cookbook'], ['Marcus Bell', 'brother', 'Sat 12/5', 'card drafted'], ['Elena Ruiz', 'coworker', 'Fri 12/11', 'card only']],
    touch: [['Alex Kim', 'lunch today', 'Talked 2 weeks ago'], ['Jordan Lee', 'Thanksgiving plans', 'Waiting on their reply'], ['Chris Moore', 'college friend', '3 months: a hello is drafted']]
  },

  work: {
    tiles: [
      { label: 'New job leads', value: '4', sub: '2 strong fits' },
      { label: 'Recruiter replies', value: '2', sub: 'drafted for your OK' },
      { label: 'Applications open', value: '3', sub: '1 interview next week' }
    ],
    leads: [['Head of Platform', 'Lumen Labs', 'remote', 'strong'], ['Principal Architect', 'Harbor Health', 'remote', 'strong'], ['Engineering Manager', 'Tidewater', 'hybrid', 'maybe'], ['Staff Engineer', 'Quarry Co', 'onsite', 'skip']],
    pipeline: [['Lumen Labs', 'interview Tue 11/24'], ['Harbor Health', 'screen done, waiting'], ['Northgate', 'applied 11/18']]
  },

  phone: {
    tiles: [
      { label: 'Next bill', value: '$204.40', sub: '4 lines · estimate' },
      { label: 'Next payment', value: 'Dec 3', sub: 'bill cycle closes the 24th' },
      { label: 'AutoPay', value: 'On', sub: 'charges itself, $20 discount', tone: 'good' },
      { label: 'Past due', value: '$0.00', sub: 'nothing past due', tone: 'good' },
      { label: 'Equipment', value: '$52.08', sub: '$611.40 owed' },
      { label: 'Pay off every device today', value: '$611.40', sub: '2 devices, no fees' }
    ],
    lines: [
      { last4: '4417', label: 'Main', user: 'Sam', device: 'Pixel 9', share: '$35.00', total: '$41.00', protection: 'On', status: 'active' },
      { last4: '2290', label: 'Family', user: 'Jamie', device: 'iPhone 15', share: '$35.00', total: '$64.34', protection: 'On', status: 'active', promo: '$10/mo trade-in credit through Aug 2027' },
      { last4: '8053', label: 'Family', user: 'Riley', device: 'Galaxy A35', share: '$35.00', total: '$59.74', protection: 'On', status: 'active' },
      { last4: '6631', label: 'Family', user: 'Taylor', device: 'iPhone 13', share: null, total: null, protection: 'Off', status: 'active', change: ['Dec 24', 'upgrade eligible; trade-in quote $180'] }
    ],
    installments: [
      ['iPhone 15', 'Jamie', '2290', '$33.34', '$433.42', '13', 'Dec 2027 · $33.34', '$10/mo trade-in'],
      ['Galaxy A35', 'Riley', '8053', '$18.74', '$177.98', '9', 'Aug 2027 · $28.06', '']
    ],
    timeline: [['Oct 24', 'Switched to the family plan, 4 lines'], ['Nov 3', 'First bill on AutoPay'], ['Nov 18', 'Riley asked about an upgrade'], ['Dec 24', 'Taylor’s upgrade window opens']],
    plan: {
      approved: 'approved Nov 20',
      text: 'Keep all 4 lines, finish both device plans on schedule, and trade in the iPhone 13 when its upgrade window opens; no new devices before then.',
      falloff: [['Bill of Aug 24, 2027', 'Galaxy A35 ends', '$185.66'], ['Bill of Dec 24, 2027', 'iPhone 15 ends', '$152.32']]
    },
    bill: {
      date: 'Nov 24', next: 'Next bill Dec 24, about $204.40 on AutoPay',
      cats: [
        ['Plan and line access', 140.00, [['4 lines × $35.00', '$140.00']]],
        ['Equipment', 52.08, [['iPhone 15 (…2290)', '$33.34'], ['Galaxy A35 (…8053)', '$18.74']]],
        ['Device protection', 18.00, [['3 lines × $6.00', '$18.00']]],
        ['Add-ons', 10.00, [['Hotspot pass (…6631)', '$10.00']]],
        ['Taxes and fees', 14.32, [['Regulatory fees', '$4.20'], ['Sales tax', '$10.12']]],
        ['Late fees', 0, [['None this cycle', '$0.00']]],
        ['Credits and promos', -30.00, [['AutoPay discount', '−$20.00'], ['Trade-in credit (…2290)', '−$10.00']]],
        ['Other', 0, [['Nothing else', '$0.00']]]
      ],
      total: '$204.40'
    },
    data: [['Phone, last 30 days', '64 calls · 812 texts'], ['Assistant number, 30 days', '22 calls · 140 texts'], ['Texts the assistant sent, 30 days', '57']]
  },

  forecast: {
    start: '2026-11-21', balance: 1584.22, bar: 500, daily: 40, last4: '4821',
    pay: { first: '2026-11-27', every: 14, amount: 1980, label: 'Paycheck' },
    bills: [[1, 'Rent', 1350], [3, 'Phone', 204.40], [5, 'Car payment', 289], [9, 'Electric', 84], [12, 'Internet', 65], [15, 'Car insurance', 118.28], [18, 'Streaming', 23], [20, 'Gym', 24], [22, 'Student loan', 180], [27, 'Credit card', 150]],
    extras: [['2026-12-10', 'Holiday gifts', 300], ['2027-01-06', 'Car registration', 145], ['2027-02-14', 'Dentist (after insurance)', 220], ['2027-04-15', 'Taxes owed', 600], ['2027-06-01', 'Summer trip deposit', 500]],
    ends: [['2027-08-24', 'Galaxy A35 paid off', 18.74, 'a month'], ['2027-12-24', 'iPhone 15 paid off', 33.34, 'a month']]
  },

  holding: {
    name: 'Northstar Holdings', legal: 'Northstar Holdings LLC', state: 'Colorado', formed: 'Mar 3, 2025',
    stages: ['idea', 'planned', 'building', 'live'],
    subs: [
      { name: 'Brightside Agency', slug: 'brightside', stage: 'live', color: '#0a84ff', pulse: '$4,820 billed this month', next: 'Send the November invoices (drafted)' },
      { name: 'Cedar Studio', slug: 'cedar', stage: 'building', color: '#30d158', pulse: 'Website 70% done', next: 'Pick a logo from 3 drafts' },
      { name: 'Harbor Goods', slug: 'harbor', stage: 'planned', color: '#ff9f0a', pulse: 'Name and domain held', next: 'Decide on the formation filing ($70)' },
      { name: 'Lantern Trust', slug: 'lantern', stage: 'idea', color: '#bf5af2', pulse: 'Notes only', next: 'Talk to a lawyer in January' }
    ],
    goal: { label: 'double income by Dec 2027', pct: 38, have: '$57k', target: '$150k' },
    asks: ['Money: approve the $70 formation filing for Harbor Goods', 'Sends to clients: the 3 November invoices', 'Legal: sign the Brightside contractor agreement'],
    next: [['Dec 1', 'Annual report due (Colorado)', 'filed by Business Executive, $10'], ['Dec 15', 'Quarterly books close', 'Accountant posts, you review'], ['Jan 15', 'Estimated tax payment', 'amount ready in December']]
  },

  agency: {
    name: 'Brightside Agency', snapshot: '11/21 6:00 AM',
    total: '62h · $4,820 billed to clients since 11/1',
    workers: [['Sam', '31h', '$2,480', '$2,604'], ['Architect agent', '12h', '$480', '$1,080'], ['QA agent', '9h', '$270', '$720'], ['Backend agent', '10h', '$0', '$416']],
    projects: [['Website rebuild', '24h', '$1,920'], ['Booking API', '20h', '$1,640'], ['Data cleanup', '18h', '$1,260']],
    clients: [['Acme Bakery', '22h', '$1,780'], ['Riverbend Dental', '21h', '$1,690'], ['Pine & Co', '19h', '$1,350']]
  },
  text: [
    ['in', 'Coach: two gym plans fit your week.\n\n1 = Basic, $24/mo, 6 AM–10 PM\n2 = Plus, $39/mo, classes included\n3 = ask me Monday'],
    ['out', '1'],
    ['in', 'Done. I put "sign up for Basic" on today’s list with the link. Nothing is paid until you tap it.']
  ]
};
