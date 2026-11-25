/* =========================================================
   Charné Janse van Rensburg — portfolio interactions
   One requestAnimationFrame loop drives everything that moves
   with scroll or pointer; layout is measured on resize only.
   ========================================================= */
(() => {
  'use strict';

  const d = document;
  const html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  if (fine) html.classList.add('has-hover');

  /* ---------------------------------------------------------
     Data
     --------------------------------------------------------- */
  const PROJECTS = {
    court: {
      num: '01', title: 'Court Companion', plate: ['#2f54eb', '#1c36b8'],
      lead: 'I was the only developer on this app for the National Bar Council of South Africa. It connects advocates with the law students who want to watch them in court.',
      meta: [['Client', 'National Bar Council of South Africa'], ['Role', 'Freelance, sole developer'], ['When', 'Dec 2025 – May 2026'], ['Stack', 'React Native, Expo, Firebase']],
      problem: "Law students learn a lot by sitting in on real hearings, but finding out where an advocate will be appearing, and when, usually depends on who you know. Advocates had no simple way to share their court schedule with students either. Court Companion gives advocates a place to post their appearances and gives students a way to follow them.",
      did: [
        'Took the brief from the Bar Council, planned the features and designed every screen, starting in December 2025',
        'Built it in React Native with Firebase sign-in and a Cloud Firestore database',
        'The role decides the whole navigator, so screens a role shouldn’t reach are never registered',
        'Built-in list of South African courts and cities with autocomplete',
        'Handled signing, the store listing, privacy details and Apple’s review',
        'Released in March 2026, then shipped updates through v1.2.8 with EAS over-the-air fixes',
      ],
      note: 'It’s client work, so the source is private. I’m happy to walk through it on a call or in an interview.',
      gallery: [['cc-login', 'p'], ['cc-advocate', 'p'], ['cc-add', 'p'], ['cc-student', 'p'], ['cc-search', 'p'], ['cc-profile', 'p'], ['cc-calendar', 'p']],
      links: [['App Store', 'https://apps.apple.com/za/app/court-companion/id6758733477'], ['Showcase repo', 'https://github.com/ST10089153/court-companion-2025-2026']],
    },
    skillpath: {
      num: '02', title: 'SkillPath', plate: ['#f2775e', '#c9472f'],
      lead: 'Tells a graduate which one skill to learn next, shows why, and gets them started in six short steps.',
      meta: [['Role', 'Honours project'], ['When', '2026'], ['Platform', 'Web and phone (Expo)'], ['Stack', 'Python, FastAPI, React Native, Docker']],
      problem: 'A lot of new graduates in South Africa know they need “more skills” but can’t tell which one is worth their next few weekends. SkillPath answers that with one recommendation instead of a list of fifty courses.',
      did: [
        'Reads the CV with a small AI model (MiniLM embeddings) on SkillPath’s own server, quoting the line each skill came from',
        'Finds the three nearest jobs and picks the one missing skill that moves you closest to all three',
        'Shows its working: the jobs, what you already have, what’s missing and the official source for every figure',
        'Six 5–10 minute steps with free resources; difficulty rises as you pass and eases off if you struggle',
        '105 passing tests, shipped in Docker',
      ],
      note: 'The demo runs on a free plan, so the first visit can take about a minute to wake up.',
      gallery: [['sp-wide-welcome', 'w'], ['sp-rec', 'p'], ['sp-wide-cv', 'w'], ['sp-why', 'p'], ['sp-wide-rec', 'w'], ['sp-path', 'p'], ['sp-progress', 'p'], ['sp-wide-home', 'w']],
      links: [['Live demo', 'https://skillpath-demo.onrender.com'], ['GitHub', 'https://github.com/ST10089153/Skillpath-2026']],
    },
    stylu: {
      num: '06', title: 'Stylu', plate: ['#f4c9db', '#dd93b4'],
      lead: 'Stylu turns your closet into a digital wardrobe.',
      meta: [['Role', 'Team of three'], ['When', '2025'], ['Platform', 'Android 8.1+'], ['Stack', 'Kotlin, MVVM, Room, Supabase']],
      problem: 'You photograph your clothes, the app cuts out the background, and from there you build outfits on a drag-and-drop canvas, plan what to wear on a calendar and check the week’s weather before you pick.',
      did: [
        'Native Android in Kotlin with an MVVM architecture',
        'Room as an offline cache, Supabase for sign-in and storage',
        'Background removal and weather through the team’s REST API',
        'Swipe-to-sort wardrobe organising, outfit canvas and calendar scheduling',
        'GitHub Actions builds the Android app',
      ],
      note: 'Built for PROG7314. The portfolio repo keeps the team’s full commit history.',
      gallery: [['st-weather', 'p'], ['st-items', 'p'], ['st-swipe', 'p'], ['st-outfit', 'p'], ['st-outfits', 'p'], ['st-calendar', 'p']],
      links: [['GitHub', 'https://github.com/ST10089153/stylu-2025'], ['Demo video', 'https://www.youtube.com/watch?v=vY-s_k3i2YE']],
    },
    cashoo: {
      num: '07', title: 'Cashoo', plate: ['#3daf78', '#1f7f52'],
      lead: 'An Android budgeting app that turns sticking to a budget into a game.',
      meta: [['Role', 'Team of six'], ['When', '2025'], ['Platform', 'Android'], ['Stack', 'Kotlin, Firebase']],
      problem: 'You log income and expenses, sort them into categories, set a monthly savings target and spending limit, and see where your money went. Hit your goals at the end of the month and you earn cashoos, an in-app currency you can spend on QR-code discount vouchers.',
      did: [
        'A chinchilla avatar you dress up during onboarding keeps you company on the home screen',
        'Bar and pie charts showing spending by category',
        'Bronze, silver and gold voucher tiers, each redeemed with a QR code',
        'Firebase as the backend',
      ],
      note: 'Built for the PROG7313 Portfolio of Evidence.',
      gallery: [['ca-intro', 'p'], ['ca-avatar', 'p'], ['ca-home', 'p'], ['ca-analysis', 'p'], ['ca-rewards', 'p'], ['ca-voucher', 'p']],
      links: [['GitHub', 'https://github.com/ST10089153/cashoo-budget-app-2025'], ['Demo video', 'https://youtu.be/RzWKK3HNCH4']],
    },
    payments: {
      num: '03', title: 'Secure payments portal', plate: ['#6a5cf0', '#21164f'],
      lead: 'A full-stack banking portal for international SWIFT payments. Customers send payments; bank staff verify each one and pass the batch on to SWIFT. Most of the code is about keeping attackers out.',
      meta: [['Role', 'Team of three'], ['When', '2025'], ['Platform', 'Web'], ['Stack', 'React, Node.js, Express, MongoDB']],
      problem: 'The brief was to build something a bank could plausibly put in front of customers. There’s no public sign-up: staff open accounts after checking ID (South African ID numbers are validated with the Luhn checksum), customers must replace their temporary password before doing anything else, and every payment goes from pending to verified to submitted.',
      did: [
        'bcrypt with 12 salt rounds, plus an application-level pepper on customer passwords',
        'Login limited to 5 attempts per IP per 15 minutes, and accounts lock after 5 failures',
        'Short-lived JWTs over HTTPS (TLS 1.2+, restricted ciphers)',
        'Whitelist validation on every field, plus NoSQL-injection and parameter-pollution guards',
        'Helmet with a strict Content Security Policy, HSTS and X-Frame-Options: DENY',
        'Role checks on every staff route: a customer token gets a 403 from the staff API',
        'DevSecOps pipeline with CodeQL, Semgrep, Gitleaks, TruffleHog, npm audit and OWASP Dependency-Check, plus SonarCloud',
      ],
      note: 'Built for APDS7311 (Application Development Security). The repo has the full threat-by-threat write-up and four demo videos.',
      gallery: [['pp-landing', 'w'], ['pp-customer', 'w'], ['pp-employee', 'w'], ['pp-password', 'w']],
      links: [['GitHub', 'https://github.com/ST10089153/secure-payments-portal-2025'], ['Final showcase video', 'https://youtu.be/VNd0L2NnGfo'], ['Walkthrough', 'https://youtu.be/odEApifJag4']],
    },
    tms: {
      num: '04', title: 'TMS for TxDev Systems', plate: ['#1d5577', '#0a1d2c'],
      lead: 'TxDev Systems came to our team with a brief, and six of us built them an Android app for keeping an eye on their temperature sensors: live readings, history charts, reports and push alerts when something goes wrong. TxDev’s customers use it.',
      meta: [['Client', 'TxDev Systems, in use'], ['Team', 'Six students, built free of charge'], ['When', 'Jun – Dec 2025'], ['Stack', 'Kotlin, MVVM, Retrofit, FCM']],
      problem: 'Temperature-sensitive stock can spoil within hours if a unit warms up or a door is left open overnight. TxDev’s IoT units already collected the readings, but customers needed to check on their units from anywhere and hear about a problem as soon as it happened, not the next morning. TxDev approached our team, and we built the app free of charge against their real backend.',
      did: [
        'Home screen that splits every unit into online and offline, coloured against each unit’s own temperature range',
        'Gauges drawn as custom Canvas views, plus history charts by day, week, month or a custom range',
        'Push alerts through Firebase Cloud Messaging for five events: too hot, too cold, door left open, power failure and low battery',
        'Per-unit settings for alert thresholds, how long a door can stay open, and sensor polarity',
        'MVVM with Retrofit and coroutines; one OkHttp interceptor adds the sign-in token to every call',
        'GitHub Actions builds the APKs and runs unit tests and Lint on every push and pull request',
      ],
      mine: [
        'Set up the Android project and its structure',
        'Built the bottom navigation and the navigation graph',
        'Built the reports screen, and later fixed a bug in how it loaded data',
        'Did the app-wide colours, styles and themes',
        'Reworked the sign-in screen',
        'Worked on the CI pipeline and the network security config',
      ],
      note: 'The app belongs to TxDev Systems and their customers use it, so the code is private and I can’t share screenshots. The panels above are illustrations, not the real screens. I’m happy to talk through the code in an interview.',
      gallery: [['ill', 'gauge'], ['ill', 'alerts'], ['ill', 'flow']],
      links: [['Showcase repo', 'https://github.com/ST10089153/txdev-tms-app-2025']],
    },
    municipal: {
      num: '05', title: 'Municipal services portal', plate: ['#17a3a1', '#0b6466'],
      lead: 'A Windows desktop app for reporting potholes, water leaks and broken streetlights, running on data structures I wrote from scratch.',
      meta: [['Role', 'Solo'], ['When', '2025'], ['Platform', 'Windows'], ['Stack', 'C#, WinForms, xUnit, GitHub Actions']],
      problem: 'Residents report problems, browse local events and track the status of service requests. The real work is underneath: every lookup, index and dependency check runs on five generic data structures I wrote by hand. None of them wraps a built-in collection.',
      did: [
        'Binary search tree for looking up a request by ID',
        'AVL tree with all four rotation cases (LL, RR, LR, RL) behind the priority queries',
        'Red-black tree indexing requests by date, with range queries in O(log n + k)',
        'Min-heap queue that always serves the most urgent open request first',
        'Dependency graph with BFS, DFS, Dijkstra, Kruskal with union-find, and cycle detection',
        '25 xUnit tests, e.g. 1,023 sorted keys stay inside the AVL height bound; GitHub Actions runs them on every push',
        'UI built entirely in code, with custom-painted cards and no designer files',
      ],
      note: 'Built for PROG7312. Moved to my own account with full history so it could be public.',
      gallery: [['mu-menu', 'w'], ['mu-report', 'w'], ['mu-events', 'w'], ['mu-status', 'w']],
      links: [['GitHub', 'https://github.com/ST10089153/municipal-services-portal-2025']],
    },
    cmcs: {
      num: '08', title: 'Contract monthly claim system', plate: ['#7d5cf0', '#4d2fc0'],
      lead: 'A web app for handling monthly pay claims from contract lecturers.',
      meta: [['Role', 'Solo'], ['When', '2025'], ['Platform', 'Web'], ['Stack', 'C#, ASP.NET Core MVC, .NET 8']],
      problem: 'Lecturers submit claims for hours worked, coordinators and academic managers review them, and HR manages user accounts, invoices and monthly reports.',
      did: [
        'Four roles, each with its own dashboard that can only reach its own pages',
        'Claim submission with supporting documents',
        'Review and approval flow for coordinators and managers',
        'HR tools for users, invoices and monthly reports',
      ],
      note: 'Built for PROG6212.',
      gallery: [['cm-login', 'w'], ['cm-dash', 'w'], ['cm-claim', 'w'], ['cm-hr', 'w']],
      links: [['GitHub', 'https://github.com/ST10089153/contract-monthly-claim-system-2025']],
    },
  };
  // Featured four first (most impressive), then the "also built" list.
  const ORDER = ['court', 'skillpath', 'payments', 'tms', 'municipal', 'stylu', 'cashoo', 'cmcs'];

  // [keyboard key, label, category, category name, where it shows up]
  const SKILLS = [
    ['1', 'C#', 'lang', 'Language', 'Municipal services portal · Claim system'],
    ['2', 'Kotlin', 'lang', 'Language', 'TMS for TxDev · Stylu · Cashoo'],
    ['3', 'JavaScript', 'lang', 'Language', 'Secure payments portal'],
    ['4', 'TypeScript', 'lang', 'Language', 'SkillPath app'],
    ['5', 'Python', 'lang', 'Language', 'SkillPath engine and CV reader'],
    ['q', 'SQL', 'lang', 'Language', 'SkillPath (SQLite) · Stylu (Room)'],
    ['w', 'ASP.NET Core', 'web', 'Web + APIs', 'Contract monthly claim system'],
    ['e', 'Node + Express', 'web', 'Web + APIs', 'Secure payments portal API'],
    ['r', 'React', 'web', 'Web + APIs', 'Secure payments portal'],
    ['t', 'FastAPI', 'web', 'Web + APIs', 'SkillPath API'],
    ['a', 'React Native', 'mobile', 'Mobile', 'Court Companion · SkillPath'],
    ['s', 'Expo + EAS', 'mobile', 'Mobile', 'Court Companion builds and over-the-air updates'],
    ['d', 'Android', 'mobile', 'Mobile', 'TMS for TxDev · Stylu · Cashoo, native Kotlin'],
    ['f', 'Firebase', 'data', 'Data', 'Court Companion · TMS push alerts · Cashoo'],
    ['g', 'Supabase', 'data', 'Data', 'Stylu sign-in and storage'],
    ['z', 'MongoDB', 'data', 'Data', 'Secure payments portal'],
    ['x', 'SQLite + Room', 'data', 'Data', 'SkillPath · Stylu offline cache'],
    ['c', 'Git + Actions', 'tool', 'Tooling', 'Every repo · CI on TMS, Stylu and the municipal portal'],
    ['v', 'Docker', 'tool', 'Tooling', 'SkillPath deploys'],
    ['b', 'xUnit + pytest', 'tool', 'Tooling', '105 tests on SkillPath · xUnit on the municipal portal'],
  ];

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = '';
    return [...text].map((c, i) => {
      const s = d.createElement('span');
      s.className = 'ch';
      s.style.setProperty('--i', i);
      s.textContent = c === ' ' ? ' ' : c;
      el.appendChild(s);
      return s;
    });
  }
  function splitWords(root) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(d.createTextNode(' ')); return; }
            const s = d.createElement('span');
            s.className = 'w';
            s.textContent = part;
            frag.appendChild(s);
            out.push(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(root);
    return out;
  }
  const absTop = (el) => { let y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; };

  /* ---------------------------------------------------------
     Smooth scroll (Lenis if it loaded; native otherwise)
     --------------------------------------------------------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  }
  let sy = window.scrollY;
  let vel = 0;
  let lastSy = sy;
  if (lenis) {
    lenis.on('scroll', (e) => { sy = e.scroll; vel = e.velocity; });
  } else {
    addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });
  }
  const scrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else (typeof target === 'number' ? window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' }) : target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }));
  };
  d.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const t = id === '#top' ? 0 : $(id);
    if (t === null) return;
    e.preventDefault();
    scrollTo(t);
  });

  /* ---------------------------------------------------------
     Theme + clock
     --------------------------------------------------------- */
  const themeBtn = $('#themeSwitch');
  const syncTheme = () => {
    const paper = html.dataset.theme === 'paper';
    $('.switch__txt', themeBtn).textContent = paper ? 'Paper' : 'Dark';
    $('meta[name="theme-color"]').setAttribute('content', paper ? '#ebe6da' : '#151615');
  };
  themeBtn.addEventListener('click', () => {
    html.dataset.theme = html.dataset.theme === 'paper' ? 'dark' : 'paper';
    store.set('cj-theme', html.dataset.theme);
    syncTheme();
  });
  syncTheme();

  const clockEl = $('#clock');
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const tick = () => { clockEl.textContent = fmt.format(new Date()); };
  tick(); setInterval(tick, 1000);

  /* ---------------------------------------------------------
     Cursor
     --------------------------------------------------------- */
  const cursorEl = $('.cursor');
  const arrowEl = $('.cursor__arrow');
  const ringEl = $('.cursor__ring');
  const labelEl = $('.cursor__label');
  const cur = { x: innerWidth / 2, y: innerHeight / 2, rx: innerWidth / 2, ry: innerHeight / 2, px: 0, tilt: 0, down: false, moved: false, lastMove: 0 };
  const LABELS = { view: 'View', drag: 'Drag', copy: 'Copy', close: 'Close' };

  const PIXEL = [
    '1', '11', '121', '1221', '12221', '122221', '1222221', '12222221', '122222221', '1222222221',
    '12222211111', '1221221', '121 1221', '11  1221', '1    1221', '     1221', '      11',
  ];
  function pixelSVG() {
    const s = 2; let rects = '';
    PIXEL.forEach((row, y) => [...row].forEach((c, x) => {
      if (c === ' ') return;
      rects += `<rect x="${x * s}" y="${y * s}" width="${s}" height="${s}" fill="${c === '1' ? '#151615' : '#ff5b1f'}"/>`;
    }));
    return `<svg width="24" height="36" viewBox="0 0 24 36" shape-rendering="crispEdges" style="margin:0">${rects}</svg>`;
  }
  const INK_SVG = '<svg width="30" height="32" viewBox="0 0 30 32" style="margin:-3px 0 0 -3px"><path d="M3.5 3 L25.5 15.6 L16 17.6 L21.3 27.8 L17 29.9 L11.8 19.6 L4.2 26.3 Z" fill="#ff5b1f" stroke="#151615" stroke-width="2.4" stroke-linejoin="round"/><path d="M7.5 9.5 L7.8 18" stroke="rgba(255,255,255,.55)" stroke-width="1.6" stroke-linecap="round"/></svg>';

  function setCursorMode(mode) {
    html.dataset.cursor = mode;
    store.set('cj-cursor', mode);
    html.classList.toggle('has-cursor', fine && mode !== 'system');
    arrowEl.innerHTML = mode === 'pixel' ? pixelSVG() : INK_SVG;
    $$('[data-set-cursor]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setCursor === mode)));
  }
  setCursorMode(html.dataset.cursor || 'ink');
  $$('[data-set-cursor]').forEach((b) => b.addEventListener('click', () => setCursorMode(b.dataset.setCursor)));

  let cursorState = '';
  function setState(state, label) {
    if (state === cursorState && labelEl.textContent === label) return;
    cursorState = state;
    cursorEl.dataset.state = state;
    labelEl.textContent = label || '';
  }
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    cur.x = e.clientX; cur.y = e.clientY; cur.moved = true; cur.lastMove = performance.now();
    if (!cursorEl.classList.contains('on')) {
      cursorEl.classList.add('on');
      cur.rx = cur.x; cur.ry = cur.y; cur.px = cur.x;
    }
  }, { passive: true });
  d.addEventListener('mouseleave', () => cursorEl.classList.remove('on'));
  d.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor]');
    if (!t) return setState('', '');
    const st = t.dataset.cursor;
    setState(st, t.dataset.cursorLabel || LABELS[st] || '');
  });
  addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || !html.classList.contains('has-cursor')) return;
    cur.down = true;
    for (let i = 0; i < 8; i++) {
      const s = d.createElement('span');
      s.className = 'spark';
      s.style.left = e.clientX + 'px';
      s.style.top = e.clientY + 'px';
      s.style.setProperty('--a', (i * 45 + 22) + 'deg');
      s.addEventListener('animationend', () => s.remove());
      cursorEl.appendChild(s);
    }
  });
  addEventListener('pointerup', () => { cur.down = false; });

  /* ---------------------------------------------------------
     Split text
     --------------------------------------------------------- */
  const heroLetters = splitChars($('.hero__first'));
  const heroW = heroLetters.map(() => 300);
  const heroS = heroLetters.map(() => 0);
  const words = splitWords($('[data-words]'));
  const emailChars = splitChars($('.email__txt'));

  /* ---------------------------------------------------------
     Measurements (resize only)
     --------------------------------------------------------- */
  const parallax = $$('[data-speed]').map((el) => ({ el, speed: parseFloat(el.dataset.speed), top: 0, h: 0 }));
  const M = { vh: innerHeight, vw: innerWidth, docH: 1, stTop: 0, stH: 1, workTop: 0, workH: 1, heroH: 1 };
  const statementEl = $('.statement__text');
  const workEl = $('#work');
  const workTitle = $('.work__title');
  function measure() {
    M.vh = innerHeight; M.vw = innerWidth;
    M.docH = d.documentElement.scrollHeight;
    M.stTop = absTop(statementEl); M.stH = statementEl.offsetHeight;
    M.workTop = absTop(workEl); M.workH = workEl.offsetHeight;
    M.heroH = $('.hero').offsetHeight;
    parallax.forEach((p) => { p.top = absTop(p.el); p.h = p.el.offsetHeight; });
    marquee.w = marquee.first ? marquee.first.offsetWidth : 1;
  }
  let rT;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(measure, 120); });

  /* ---------------------------------------------------------
     Marquee + badge
     --------------------------------------------------------- */
  const marquee = { track: $('.marquee__track'), first: $('.marquee__track span'), x: 0, w: 1, dir: 1, visible: false };
  const badgeRing = $('.badge__ring');
  let badgeAngle = 0;

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
  $$('.h2, .contact__big, .card, .log__list li, .kit, .me').forEach((el) => io.observe(el));

  const vis = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.target.classList.contains('marquee')) marquee.visible = en.isIntersecting;
      if (en.target.id === 'kit') kit.visible = en.isIntersecting;
    });
  });

  /* ---------------------------------------------------------
     Work cards: tilt + open
     --------------------------------------------------------- */
  $$('.card').forEach((card) => {
    const plate = $('.card__plate', card);
    if (fine) {
      card.addEventListener('pointermove', (e) => {
        const r = plate.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        plate.style.setProperty('--ry', ((px - 0.5) * 9).toFixed(2) + 'deg');
        plate.style.setProperty('--rx', (-(py - 0.5) * 7).toFixed(2) + 'deg');
        plate.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        plate.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', () => {
        plate.style.setProperty('--rx', '0deg');
        plate.style.setProperty('--ry', '0deg');
      });
    }
  });
  d.addEventListener('click', (e) => {
    const t = e.target.closest('[data-project]');
    if (t) openCase(t.dataset.project, t);
  });
  d.addEventListener('keydown', (e) => {
    const t = e.target.closest && e.target.closest('[data-project]');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openCase(t.dataset.project, t); }
  });

  /* ---------------------------------------------------------
     TMS card: a reading that drifts like a live sensor, and
     spikes into an alert when you hover the card.
     --------------------------------------------------------- */
  const tms = $('.card .tms');
  if (tms) {
    const tempEl = $('.tms__temp', tms);
    const tmsCard = tms.closest('.card');
    let hot = false;
    const setTemp = (t) => {
      tempEl.textContent = t.toFixed(1);
      tms.style.setProperty('--v', clamp((t / 12) * 100, 4, 100).toFixed(1));
      tms.classList.toggle('hot', t > 8);
    };
    setTemp(4.2);
    if (!reduce) setInterval(() => { if (!hot) setTemp(3.6 + Math.random() * 1.5); }, 1900);
    if (fine) {
      tmsCard.addEventListener('pointerenter', () => { hot = true; setTemp(9.1); });
      tmsCard.addEventListener('pointerleave', () => { hot = false; setTemp(4.4); });
    }
  }

  /* ---------------------------------------------------------
     Index hover preview
     --------------------------------------------------------- */
  const preview = $('.preview');
  const previewInner = $('.preview__inner');
  const pv = { x: 0, y: 0, rot: 0, on: false };
  const rows = $$('.row');
  rows.forEach((row) => {
    const src = row.dataset.preview;
    const item = d.createElement('div');
    item.className = 'preview__item';
    if (src.startsWith('type:')) {
      item.classList.add('preview__type');
      item.innerHTML = `<span class="mono">Secured / hardened</span><b>${src.slice(5)}</b>`;
    } else if (src.startsWith('phone:')) {
      item.classList.add('preview__phone');
      if (row.dataset.previewBg) item.style.background = `radial-gradient(120% 120% at 50% 0%, ${row.dataset.previewBg}, #151615)`;
      item.innerHTML = `<img src="${src.slice(6)}" alt="" loading="lazy" decoding="async">`;
    } else {
      item.innerHTML = `<img src="${src}" alt="" loading="lazy" decoding="async">`;
    }
    previewInner.appendChild(item);
    row._pv = item;
    row.addEventListener('pointerenter', () => {
      if (!fine) return;
      rows.forEach((r) => r._pv.classList.toggle('on', r === row));
      if (!pv.on) { pv.x = cur.x; pv.y = cur.y; }
      pv.on = true; preview.classList.add('on');
    });
  });
  $('.index__list').addEventListener('pointerleave', () => { pv.on = false; preview.classList.remove('on'); });

  /* ---------------------------------------------------------
     Kit: keypad, OLED, knob, sound
     --------------------------------------------------------- */
  const kit = { visible: false, idx: -1, energy: 0, rot: 0 };
  const keysWrap = $('#keys');
  const keyEls = SKILLS.map(([k, name, cat], i) => {
    const b = d.createElement('button');
    b.className = `key key--${cat}`;
    b.type = 'button';
    b.dataset.cursor = 'link';
    b.setAttribute('aria-label', `${name} (key ${k.toUpperCase()})`);
    b.innerHTML = `<span class="key__cap"><span class="key__hint">${k}<b></b></span><span class="key__name">${name}</span></span>`;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); press(i); });
    b.addEventListener('pointerup', () => release(i));
    b.addEventListener('pointerleave', () => release(i));
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); press(i); } });
    b.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') release(i); });
    keysWrap.appendChild(b);
    return b;
  });
  const oled = {
    cat: $('.oled__cat'), idx: $('.oled__idx'), name: $('.oled__name'), used: $('.oled__used'),
    bars: $$('.oled__bars i'), levels: [],
  };
  oled.levels = oled.bars.map(() => 0.06);

  let soundOn = store.get('cj-sound') !== 'off';
  const soundBtn = $('#soundBtn');
  soundBtn.setAttribute('aria-pressed', String(soundOn));
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    store.set('cj-sound', soundOn ? 'on' : 'off');
    if (soundOn) blip(880, 0.05);
  });
  let ac = null;
  function audio() {
    if (!soundOn) return null;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      return ac;
    } catch (e) { return null; }
  }
  function blip(freq, len = 0.18, type = 'triangle', vol = 0.07) {
    const a = audio(); if (!a) return;
    const t = a.currentTime;
    const o = a.createOscillator(); const g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + len + 0.02);
  }
  function clack(pitch = 1) {
    const a = audio(); if (!a) return;
    const t = a.currentTime;
    const len = Math.floor(a.sampleRate * 0.025);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
    const src = a.createBufferSource(); src.buffer = buf;
    const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600 * pitch; bp.Q.value = 0.9;
    const g = a.createGain(); g.gain.value = 0.45;
    src.connect(bp).connect(g).connect(a.destination); src.start(t);
    const o = a.createOscillator(); const og = a.createGain();
    o.frequency.setValueAtTime(170 * pitch, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.06);
    og.gain.setValueAtTime(0.3, t); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    o.connect(og).connect(a.destination); o.start(t); o.stop(t + 0.1);
  }
  // Pentatonic notes across the pad so mashing keys sounds musical.
  const SCALE = [0, 2, 4, 7, 9];
  const noteFor = (i) => 261.63 * Math.pow(2, (SCALE[i % 5] + 12 * Math.floor((19 - i) / 5) - 12) / 12);

  function show(i) {
    const [, name, , catName, used] = SKILLS[i];
    kit.idx = i;
    oled.cat.textContent = catName;
    oled.idx.textContent = String(i + 1).padStart(2, '0') + '/20';
    oled.name.textContent = name;
    oled.used.textContent = 'Used in: ' + used;
    keyEls.forEach((k, j) => k.classList.toggle('lit', j === i));
    kit.energy = 1;
  }
  function press(i) {
    const k = keyEls[i];
    if (k.classList.contains('down')) return;
    k.classList.add('down');
    clack(0.85 + (Math.floor(i / 5) * 0.12));
    blip(noteFor(i));
    show(i);
  }
  function release(i) { keyEls[i].classList.remove('down'); }

  const keyMap = Object.fromEntries(SKILLS.map(([k], i) => [k, i]));
  addEventListener('keydown', (e) => {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || !kit.visible || caseOpen) return;
    if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
    const i = keyMap[e.key.toLowerCase()];
    if (i === undefined) return;
    press(i);
  });
  addEventListener('keyup', (e) => {
    const i = keyMap[(e.key || '').toLowerCase()];
    if (i !== undefined) release(i);
  });

  // Knob: drag around it, scroll on it, or click it.
  const knob = $('#knob');
  const knobCap = $('.knob__cap');
  let knobDrag = null;
  function step(dir) {
    const next = ((kit.idx < 0 ? -1 : kit.idx) + dir + SKILLS.length) % SKILLS.length;
    kit.rot += dir * 18;
    knobCap.style.setProperty('--rot', kit.rot + 'deg');
    clack(1.4);
    blip(noteFor(next), 0.12, 'sine', 0.05);
    show(next);
    keyEls[next].classList.add('down');
    setTimeout(() => release(next), 110);
  }
  knob.addEventListener('pointerdown', (e) => {
    const r = knob.getBoundingClientRect();
    knobDrag = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, last: null, acc: 0, moved: false };
    knobDrag.last = Math.atan2(e.clientY - knobDrag.cy, e.clientX - knobDrag.cx);
    knob.setPointerCapture(e.pointerId);
  });
  knob.addEventListener('pointermove', (e) => {
    if (!knobDrag) return;
    const a = Math.atan2(e.clientY - knobDrag.cy, e.clientX - knobDrag.cx);
    let da = a - knobDrag.last;
    if (da > Math.PI) da -= Math.PI * 2;
    if (da < -Math.PI) da += Math.PI * 2;
    knobDrag.last = a;
    knobDrag.acc += da * 180 / Math.PI;
    while (Math.abs(knobDrag.acc) >= 22) {
      const dir = Math.sign(knobDrag.acc);
      knobDrag.acc -= dir * 22;
      knobDrag.moved = true;
      step(dir);
    }
  });
  knob.addEventListener('pointerup', () => {
    if (knobDrag && !knobDrag.moved) step(1);
    knobDrag = null;
  });
  knob.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); step(-1); }
  });
  knob.addEventListener('click', (e) => { if (e.detail === 0) step(1); }); // keyboard Enter
  knob.addEventListener('wheel', (e) => {
    e.preventDefault(); e.stopPropagation();
    step(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });
  knob.setAttribute('data-lenis-prevent', '');

  /* ---------------------------------------------------------
     Email copy
     --------------------------------------------------------- */
  const emailBtn = $('#email');
  emailBtn.addEventListener('click', async () => {
    const addr = 'charnejvr1@gmail.com';
    let ok = false;
    try { await navigator.clipboard.writeText(addr); ok = true; } catch (e) { ok = false; }
    if (!ok) { window.location.href = 'mailto:' + addr; return; }
    emailBtn.classList.add('copied');
    setState('copy', 'Copied!');
    blip(1046.5, 0.15); setTimeout(() => blip(1568, 0.2), 90);
    setTimeout(() => { emailBtn.classList.remove('copied'); if (cursorState === 'copy') setState('copy', 'Copy'); }, 1800);
  });

  /* ---------------------------------------------------------
     Case study overlay
     --------------------------------------------------------- */
  const caseEl = $('#case');
  const casePanel = $('.case__panel');
  const caseBody = $('.case__body');
  let caseOpen = false;
  let caseReturn = null;

  function renderCase(key) {
    const p = PROJECTS[key];
    const next = ORDER[(ORDER.indexOf(key) + 1) % ORDER.length];
    caseEl.style.setProperty('--plate', p.plate[0]);
    caseEl.style.setProperty('--plate-2', p.plate[1]);
    const gallery = p.gallery.map(([src, kind]) => {
      if (src === 'ill') return ILLUSTRATIONS[kind];
      if (src === 'type') return `<div class="case__type"><span class="mono">React · Node · Express · MongoDB</span><b>${kind}</b><span class="mono">International payments, defended</span></div>`;
      return `<img class="g-${kind}" src="assets/img/${src}.webp" alt="${p.title} screenshot" loading="lazy" decoding="async">`;
    }).join('');
    caseBody.innerHTML = `
      <div class="case__kicker mono"><span>(${p.num})</span><span>Case study</span></div>
      <h2 class="case__title" id="caseTitle">${p.title}</h2>
      <p class="case__lead">${p.lead}</p>
      <dl class="case__meta">${p.meta.map(([k, v]) => `<div><dt class="mono">${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      <div class="case__gallery" data-cursor="drag">${gallery}</div>
      <div class="case__cols">
        <div><h4 class="mono">The problem</h4><p>${p.problem}</p>${p.note ? `<p class="case__note">${p.note}</p>` : ''}</div>
        <div><h4 class="mono">What went into it</h4><ul>${p.did.map((x) => `<li>${x}</li>`).join('')}</ul></div>
      </div>
      ${p.mine ? `<div class="case__mine"><h4 class="mono">My part</h4><ul>${p.mine.map((x) => `<li>${x}</li>`).join('')}</ul></div>` : ''}
      <div class="case__links mono">${p.links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener" data-cursor="link">${t} ↗</a>`).join('')}</div>
      <button class="case__next" data-next="${next}" data-cursor="view" data-cursor-label="Next"><span class="mono">Next project</span><b>${PROJECTS[next].title} →</b></button>`;
    bindGallery($('.case__gallery', caseBody));
  }
  // TMS can't show real screens, so its gallery is drawn panels.
  const GAUGE = (v, t) => `<div class="tms" style="--v:${v}"><div class="tms__gauge"><svg viewBox="0 0 200 200"><path class="tms__track" d="M 43.4 156.6 A 80 80 0 1 1 156.6 156.6"/><path class="tms__value" d="M 43.4 156.6 A 80 80 0 1 1 156.6 156.6" pathLength="100" stroke="url(#tmsG)"/></svg><div class="tms__read"><span class="mono">Cold room</span><b>${t}°</b><span class="mono">Min 2° · Max 8°</span></div></div></div>`;
  const ILLUSTRATIONS = {
    gauge: `<div class="case__type case__ill"><span class="mono">Live gauge · illustration</span>${GAUGE(36, '4.3')}<span class="mono" style="position:relative">Custom Canvas views in the real app</span></div>`,
    alerts: `<div class="case__type case__ill"><span class="mono">Five push alerts</span><div class="tms__alerts">${[['Temperature too high', '#ff5b1f'], ['Temperature too low', '#7fb8ff'], ['Door left open', '#4c6ef5'], ['Power failure', '#e5484d'], ['Low battery', '#e0a100']].map(([t, c]) => `<div class="tms__alert mono"><i style="background:${c}"></i>${t}</div>`).join('')}</div><span class="mono">Firebase Cloud Messaging</span></div>`,
    flow: `<div class="case__type case__ill"><span class="mono">How the data flows</span><div class="case__flow"><span>TxDev sensor units: temperature, battery, door</span><em>↓</em><span>TxDev REST API</span><em>↓</em><span>Android app: Retrofit, OkHttp, MVVM</span><em>↓</em><span>Alerts via Firebase Cloud Messaging</span></div><span class="mono">Built against TxDev’s real backend</span></div>`,
  };

  function bindGallery(g) {
    let drag = null;
    g.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      drag = { x: e.clientX, left: g.scrollLeft };
      g.setPointerCapture(e.pointerId);
    });
    g.addEventListener('pointermove', (e) => { if (drag) g.scrollLeft = drag.left - (e.clientX - drag.x); });
    const end = () => { drag = null; };
    g.addEventListener('pointerup', end);
    g.addEventListener('pointercancel', end);
  }
  function openCase(key, from) {
    if (!PROJECTS[key]) return;
    caseReturn = from || d.activeElement;
    renderCase(key);
    casePanel.scrollTop = 0;
    caseEl.hidden = false;
    void caseEl.offsetWidth; // let the closed state paint before animating
    caseEl.classList.add('open');
    caseOpen = true;
    if (lenis) lenis.stop();
    html.style.overflow = 'hidden';
    setTimeout(() => $('#caseClose').focus({ preventScroll: true }), 50);
    blip(523.25, 0.12, 'sine', 0.04);
  }
  function closeCase() {
    if (!caseOpen) return;
    caseOpen = false;
    caseEl.classList.remove('open');
    setTimeout(() => {
      if (caseOpen) return;
      caseEl.hidden = true;
      html.style.overflow = '';
      if (lenis) lenis.start();
      if (caseReturn && caseReturn.focus) caseReturn.focus({ preventScroll: true });
    }, reduce ? 0 : 900);
  }
  $('#caseClose').addEventListener('click', closeCase);
  caseBody.addEventListener('click', (e) => {
    const n = e.target.closest('[data-next]');
    if (!n) return;
    e.stopPropagation();
    const key = n.dataset.next;
    casePanel.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    caseEl.classList.remove('open');
    setTimeout(() => { renderCase(key); casePanel.scrollTop = 0; void caseEl.offsetWidth; caseEl.classList.add('open'); }, reduce ? 0 : 500);
  });
  addEventListener('keydown', (e) => {
    if (!caseOpen) return;
    if (e.key === 'Escape') closeCase();
    if (e.key === 'Tab') { // keep focus inside the dialog
      const f = $$('button, a[href]', caseEl).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && d.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------------------------------------------------------
     Magnetic elements
     --------------------------------------------------------- */
  if (fine && !reduce) {
    $$('.badge, .live, .case__close, .cv-btn').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.28;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)'; el.style.transform = ''; setTimeout(() => { el.style.transition = ''; }, 600); });
    });
  }

  /* ---------------------------------------------------------
     The loop
     --------------------------------------------------------- */
  const nav = $('.nav');
  const navProg = $('.nav__progress');
  let navHidden = false;
  let litCount = -1;
  let idleT = 0;

  function frame(t) {
    if (lenis) lenis.raf(t);
    else { vel = sy - lastSy; }
    const dy = sy - lastSy;
    lastSy = sy;
    const vh = M.vh;

    // Nav: hide on the way down, show on the way up.
    if (!caseOpen) {
      if (dy > 2 && sy > 240 && !navHidden) { navHidden = true; nav.classList.add('hide'); }
      else if ((dy < -2 || sy < 240) && navHidden) { navHidden = false; nav.classList.remove('hide'); }
    }
    navProg.style.setProperty('--p', clamp(sy / Math.max(1, M.docH - vh), 0, 1).toFixed(4));

    // Cursor
    if (html.classList.contains('has-cursor')) {
      const vx = cur.x - cur.px; cur.px = cur.x;
      cur.tilt = lerp(cur.tilt, clamp(vx * 0.9, -22, 22), 0.2);
      const sc = cur.down ? 0.82 : 1;
      arrowEl.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) rotate(${cur.tilt.toFixed(2)}deg) scale(${sc})`;
      cur.rx = lerp(cur.rx, cur.x, 0.17); cur.ry = lerp(cur.ry, cur.y, 0.17);
      ringEl.style.transform = `translate3d(${cur.rx.toFixed(1)}px, ${cur.ry.toFixed(1)}px, 0)`;
    }

    // Hero letters swell toward the pointer (or breathe on their own when idle / on touch).
    if (sy < M.heroH && html.classList.contains('is-ready')) {
      const idle = !fine || performance.now() - cur.lastMove > 2500;
      idleT += 0.016;
      const rects = idle ? null : heroLetters.map((l) => l.getBoundingClientRect());
      const reach = M.vw * 0.28;
      heroLetters.forEach((l, i) => {
        let target, soft;
        if (idle) {
          const s = 0.5 + 0.5 * Math.sin(idleT * 1.6 - i * 0.7);
          target = 300 + 260 * s; soft = 100 * s;
        } else {
          const r = rects[i];
          const dx = cur.x - (r.left + r.width / 2);
          const dyy = cur.y - (r.top + r.height / 2);
          const f = Math.max(0, 1 - Math.hypot(dx, dyy) / reach);
          target = 300 + 600 * f * f; soft = 100 * f;
        }
        heroW[i] = lerp(heroW[i], target, 0.12);
        heroS[i] = lerp(heroS[i], soft, 0.12);
      });
      heroLetters.forEach((l, i) => {
        l.style.fontVariationSettings = `"opsz" 144, "wght" ${heroW[i].toFixed(0)}, "SOFT" ${heroS[i].toFixed(0)}`;
      });
    }

    // Badge
    badgeAngle += reduce ? 0 : 0.12 + Math.min(Math.abs(vel), 60) * 0.12;
    badgeRing.style.transform = `rotate(${badgeAngle.toFixed(2)}deg)`;

    // Statement words light up as you read down.
    const start = M.stTop - vh * 0.8;
    const end = M.stTop + M.stH - vh * 0.45;
    const p = clamp((sy - start) / Math.max(1, end - start), 0, 1);
    const n = Math.round(p * words.length);
    if (n !== litCount) {
      words.forEach((w, i) => w.classList.toggle('on', i < n));
      litCount = n;
    }

    // Parallax cards + the big title behind them.
    if (M.vw > 960 && !reduce) {
      parallax.forEach((o) => {
        const mid = o.top + o.h / 2 - sy - vh / 2;
        if (Math.abs(mid) < vh * 1.6) o.el.style.transform = `translate3d(0, ${(-mid * o.speed).toFixed(1)}px, 0)`;
      });
    }
    const wp = clamp((sy - M.workTop) / Math.max(1, M.workH - vh), 0, 1);
    if (sy > M.workTop - vh && sy < M.workTop + M.workH) {
      workTitle.style.transform = `scale(${(1.12 - wp * 0.24).toFixed(4)})`;
    }

    // Marquee speeds up with scroll and flips with direction.
    if (marquee.visible && !reduce) {
      if (Math.abs(dy) > 0.5) marquee.dir = dy > 0 ? 1 : -1;
      marquee.x -= (0.6 + Math.min(Math.abs(vel), 80) * 0.25) * marquee.dir;
      if (marquee.x <= -marquee.w) marquee.x += marquee.w;
      if (marquee.x > 0) marquee.x -= marquee.w;
      marquee.track.style.transform = `translate3d(${marquee.x.toFixed(1)}px, 0, 0)`;
    }

    // Floating preview for the "also built" list.
    if (fine && (pv.on || preview.classList.contains('on'))) {
      const px = pv.x;
      pv.x = lerp(pv.x, cur.x, 0.14); pv.y = lerp(pv.y, cur.y, 0.14);
      pv.rot = lerp(pv.rot, clamp((pv.x - px) * 0.6, -10, 10), 0.15);
      preview.style.transform = `translate3d(${pv.x.toFixed(1)}px, ${pv.y.toFixed(1)}px, 0) rotate(${pv.rot.toFixed(2)}deg)`;
    }

    // OLED level meter
    if (kit.visible) {
      kit.energy *= 0.94;
      oled.bars.forEach((b, i) => {
        const target = 0.06 + kit.energy * (0.35 + 0.65 * Math.abs(Math.sin(t * 0.012 + i * 1.7)));
        oled.levels[i] = lerp(oled.levels[i], target, 0.35);
        b.style.transform = `scaleY(${oled.levels[i].toFixed(3)})`;
      });
    }

    if (!lenis) vel *= 0.9;
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  vis.observe($('.marquee'));
  vis.observe($('#kit'));
  measure();
  requestAnimationFrame(frame);

  const fontsReady = d.fonts && d.fonts.ready ? d.fonts.ready : Promise.resolve();
  fontsReady.then(measure);
  addEventListener('load', measure);
  $$('img').forEach((img) => { if (!img.complete) img.addEventListener('load', () => { clearTimeout(rT); rT = setTimeout(measure, 150); }, { once: true }); });

  function ready() { html.classList.add('is-ready'); }
  const loader = $('.loader');
  if (html.classList.contains('no-loader') || reduce) {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    fontsReady.then(() => requestAnimationFrame(ready));
    setTimeout(ready, 1200);
  } else {
    if (lenis) lenis.stop();
    const num = $('.loader__num');
    const bar = $('.loader__bar i');
    const t0 = performance.now();
    const MIN = 1100;
    let fontsDone = false;
    fontsReady.then(() => { fontsDone = true; });
    const run = (now) => {
      const elapsed = now - t0;
      const cap = fontsDone ? 1 : 0.86;
      const p = Math.min(cap, 1 - Math.pow(1 - Math.min(1, elapsed / MIN), 3));
      num.textContent = String(Math.round(p * 100)).padStart(3, '0');
      bar.style.setProperty('--p', p.toFixed(3));
      if ((p >= 1) || elapsed > 2600) {
        num.textContent = '100';
        bar.style.setProperty('--p', 1);
        setTimeout(() => {
          loader.classList.add('done');
          if (lenis) lenis.start();
          setTimeout(ready, 280);
          setTimeout(() => loader.remove(), 1100);
        }, 160);
        try { sessionStorage.setItem('cj-loaded', '1'); } catch (e) { /* ignore */ }
        return;
      }
      requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }
})();
