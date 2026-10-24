/* =============================================================================
 * Starting XI – European Nights Edition — game logic
 * Plain vanilla JS, no dependencies. Reads the dataset from data.js
 * (window.STARTING_XI_DATA). All persistence is in localStorage.
 * ========================================================================== */

(function () {
  'use strict';

  // ===========================================================================
  // 1. Constants & configuration
  // ===========================================================================

  const RAW = window.STARTING_XI_DATA || { teams: [], decoyClubs: [], clubAliases: {}, YOUTH: 'Youth academy' };
  const YOUTH = RAW.YOUTH || 'Youth academy';

  const MAX_GUESSES = 3;
  const TIME_ATTACK_SECONDS = 60;
  const STORE_KEY = 'startingXI.v1';
  const FIRST_SEASON_END = 1956;                   // 1955–56, first European Cup
  const LAST_SEASON_END = 2026;
  const DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

  const SCORING = {
    club: 50,
    seasonByDiff: [50, 35, 25, 15, 8, 4],          // index = years off; beyond → 0
    wrongGuess: 10
  };

  /**
   * Hints, ordered from "gentle" to "giveaway". Cost reflects how much each one gives away.
   *  - team: reveals one clue type for EVERY player (shown as small badges on each card).
   *  - The final result names the opponent, so it is priced like the manager.
   */
  const HINTS = [
    { id: 'team-shirt', group: 'team', clue: 'shirt', label: 'All shirt numbers', cost: 10 },
    { id: 'team-age',   group: 'team', clue: 'age',   label: 'All ages',          cost: 10 },
    { id: 'team-caps',  group: 'team', clue: 'caps',  label: 'All intl caps',     cost: 10 },
    { id: 'team-goals', group: 'team', clue: 'goals', label: 'All career goals',  cost: 10 },
    { id: 'team-flag',  group: 'team', clue: 'flag',  label: 'All flags',         cost: 15 },
    { id: 'team-prev',  group: 'team', clue: 'prev',  label: 'All previous clubs', cost: 20 },
    { id: 'kit',        group: 'big', label: 'Kit colours',     cost: 30 },
    { id: 'decade',     group: 'big', label: 'Decade',          cost: 15 },
    { id: 'name',       group: 'big', label: 'Reveal a player', cost: 15, max: 3 },
    { id: 'manager',    group: 'big', label: 'Manager',         cost: 25 },
    { id: 'stage',      group: 'big', label: 'Match result',    cost: 25 }
  ];
  const HINT_BY_ID = Object.fromEntries(HINTS.map(h => [h.id, h]));

  /** Named formations that are not simple hyphenated lists. */
  const SPECIAL_FORMATIONS = { WM: [3, 2, 2, 3] };

  /**
   * Clue types. Every player always gets at least one of these (never "position only").
   * `value` returns null when the clue isn't available or isn't informative.
   */
  const CLUE_TYPES = {
    flag:    { label: 'Nation',       value: p => p.nationality },
    age:     { label: 'Age',          value: p => p.age },
    shirt:   { label: 'Shirt no.',    value: p => p.shirtNumber },
    goals:   { label: 'Career goals', value: p => (p.careerGoals > 0 ? p.careerGoals : null) },
    assists: { label: 'Assists',      value: p => (p.careerAssists > 0 ? p.careerAssists : null) },
    caps:    { label: 'Intl caps',    value: p => (p.caps > 0 ? p.caps : null) },
    prev:    { label: 'Prev. club',   value: p => p.previousClub }
  };

  /** Base likelihood of each clue type per difficulty (harder = more obscure stats). */
  const CLUE_WEIGHTS = {
    easy:   { flag: 3,   age: 2,   shirt: 2.5, goals: 2,   assists: 1,   caps: 2,   prev: 2 },
    medium: { flag: 2.2, age: 2,   shirt: 2,   goals: 2,   assists: 1.4, caps: 2,   prev: 1.6 },
    hard:   { flag: 1,   age: 1.8, shirt: 1.2, goals: 1.8, assists: 1.8, caps: 1.8, prev: 1.4 }
  };

  /**
   * Position-aware multipliers so clues make sense for the role:
   * keepers never show goals/assists, defenders rarely do, forwards often show goals.
   */
  const ROLE_OF = {
    GK: 'gk',
    LB: 'def', RB: 'def', CB: 'def', SW: 'def', LWB: 'def', RWB: 'def', CH: 'def',
    DM: 'mid', CM: 'mid', AM: 'mid', LM: 'mid', RM: 'mid', LH: 'mid', RH: 'mid',
    ST: 'fwd', CF: 'fwd', LW: 'fwd', RW: 'fwd', OL: 'fwd', OR: 'fwd', IL: 'fwd', IR: 'fwd', RF: 'fwd', LF: 'fwd', SS: 'fwd'
  };
  const ROLE_MULT = {
    gk:  { goals: 0, assists: 0, caps: 1.3, age: 1.3, flag: 1.2, prev: 1.3, shirt: 0.8 },
    def: { goals: 0.35, assists: 0.4 },
    mid: { assists: 1.3 },
    fwd: { goals: 1.7, assists: 1 }
  };
  const MAX_SAME_CLUE = 4;   // per clue slot: no single clue type on more than 4 shirts (8 with 2 clues)

  /** Clues per shirt and kit visibility per difficulty; harder = fewer clues but more points. */
  const DIFFICULTY = {
    easy:   { clues: 2, kit: true,  mult: 0.75, label: 'Easy' },
    medium: { clues: 2, kit: false, mult: 1,    label: 'Medium' },
    hard:   { clues: 1, kit: false, mult: 1.5,  label: 'Hard' }
  };

  /** Points multiplier from how recognisable the team is (each team's `difficulty` in data.js). */
  const TEAM_RATING = {
    easy:   { label: 'Easy',   mult: 0.8 },
    medium: { label: 'Medium', mult: 1 },
    hard:   { label: 'Hard',   mult: 1.3 }
  };
  const teamRating = t => (TEAM_RATING[t.difficulty] ? t.difficulty : 'medium');

  /** Team pool filter options (Settings). */
  const FAMOUS_CLUBS = new Set(RAW.famousClubs || []);
  const isSemi = t => /^semi/i.test(t.competitionStage || '');
  const isRunnerUp = t => !isSemi(t) && (/runners?-up/i.test(t.competitionStage || '') || /^Lost/.test(t.result || ''));
  const POOLS = {
    all:     { label: 'All teams',         test: () => true },
    winners: { label: 'Winners only',      test: t => !isSemi(t) && !isRunnerUp(t) },
    runners: { label: 'Runner-ups only',   test: t => isRunnerUp(t) },
    famous:  { label: 'Famous clubs only', test: t => FAMOUS_CLUBS.has(t.club) }
  };

  const NEUTRAL_KIT = { primary: '#2a3242', secondary: '#7083a8', pattern: 'plain' };

  /** ISO-ish code → short label shown with each flag. */
  const COUNTRY_LABELS = {
    AR: 'ARG', AT: 'AUT', AU: 'AUS', BE: 'BEL', BG: 'BUL', BR: 'BRA', CA: 'CAN', CH: 'SUI', CI: 'CIV',
    CL: 'CHI', CM: 'CMR', CR: 'CRC', CZ: 'CZE', DE: 'GER', DK: 'DEN', EC: 'ECU', EG: 'EGY', ES: 'ESP',
    FI: 'FIN', FR: 'FRA', GE: 'GEO', GH: 'GHA', GR: 'GRE', HR: 'CRO', HU: 'HUN', IE: 'IRL', IT: 'ITA',
    KR: 'KOR', MA: 'MAR', MK: 'MKD', ML: 'MLI', ME: 'MNE', MX: 'MEX', NG: 'NGA', NL: 'NED', NO: 'NOR',
    PL: 'POL', PT: 'POR', RO: 'ROU', RS: 'SRB', SE: 'SWE', SN: 'SEN', TT: 'TRI', UA: 'UKR', UY: 'URU',
    ZW: 'ZIM', TR: 'TUR', BA: 'BIH', BY: 'BLR', RU: 'RUS', CO: 'COL', JP: 'JPN', PE: 'PER', ENG: 'ENG', SCO: 'SCO', WAL: 'WAL', NIR: 'NIR'
  };

  // ===========================================================================
  // 2. Small utilities
  // ===========================================================================

  const $ = id => document.getElementById(id);
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Create an element: el('div', {class: 'x', text: 'hi'}, [children]). Text is never parsed as HTML. */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        // Set styles through the CSSOM (not a style attribute) so a strict Content-Security-Policy allows them.
        else if (k === 'style') node.style.cssText = v;
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : v);
      }
    }
    (children || []).forEach(c => { if (c !== null && c !== undefined) node.append(c); });
    return node;
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, v);
    return node;
  }

  /** Lower-case, strip accents/punctuation so "Barça" matches "barca". */
  function normalize(str) {
    return String(str || '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/ø/gi, 'o').replace(/ı/g, 'i').replace(/ł/gi, 'l')
      .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickWeighted(options) {
    const total = options.reduce((s, o) => s + o.w, 0);
    let r = Math.random() * total;
    for (const o of options) { if ((r -= o.w) <= 0) return o.key; }
    return options[options.length - 1].key;
  }

  const isPresent = v => v !== null && v !== undefined && v !== '';
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : /s$/.test(word) ? 'es' : 's'}`;
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  /** "1988–89" → 1989 (the year the final was played). */
  function seasonEndYear(season) {
    const m = String(season).match(/(\d{4})/);
    return m ? Number(m[1]) + 1 : NaN;
  }
  /** 1989 → "1988–89" */
  function seasonLabel(endYear) {
    return `${endYear - 1}–${String(endYear).slice(-2)}`;
  }
  const decadeOf = team => Math.floor(seasonEndYear(team.season) / 10) * 10;

  function formationRows(formation) {
    if (SPECIAL_FORMATIONS[formation]) return SPECIAL_FORMATIONS[formation].slice();
    return String(formation).split('-').map(Number);
  }

  const countryLabel = code => COUNTRY_LABELS[code] || code;

  function surname(name) {
    const parts = name.split(' ');
    if (parts.length === 1) return name;
    // Keep particles like "van", "de", "del", "di" with the surname.
    const particles = ['van', 'de', 'der', 'del', 'di', 'da', 'dos', 'von', 'den', 'ter'];
    let i = parts.length - 1;
    while (i > 1 && particles.includes(parts[i - 1].toLowerCase())) i--;
    return parts.slice(i).join(' ');
  }

  // ===========================================================================
  // 3. Flags — simplified SVG drawings (emoji flags don't render on Windows)
  // ===========================================================================

  const Flag = (() => {
    const W = 30, H = 20;
    const rect = (s, x, y, w, h, fill) => s.append(svgEl('rect', { x, y, width: w, height: h, fill }));
    const circle = (s, cx, cy, r, fill) => s.append(svgEl('circle', { cx, cy, r, fill }));
    const poly = (s, points, fill) => s.append(svgEl('polygon', { points, fill }));
    const line = (s, x1, y1, x2, y2, stroke, w) => s.append(svgEl('line', { x1, y1, x2, y2, stroke, 'stroke-width': w }));
    function bands(s, colors, ratios, vertical) {
      const r = ratios || colors.map(() => 1);
      const total = r.reduce((a, b) => a + b, 0);
      let pos = 0;
      colors.forEach((c, i) => {
        const size = (vertical ? W : H) * r[i] / total;
        if (vertical) rect(s, pos, 0, size + 0.05, H, c); else rect(s, 0, pos, W, size + 0.05, c);
        pos += size;
      });
    }
    const h = (colors, ratios) => s => bands(s, colors, ratios, false);
    const v = (colors, ratios) => s => bands(s, colors, ratios, true);
    function star(s, cx, cy, r, fill) {
      const pts = [];
      for (let k = 0; k < 10; k++) {
        const a = (Math.PI / 5) * k - Math.PI / 2;
        const rad = k % 2 ? r * 0.4 : r;
        pts.push(`${(cx + Math.cos(a) * rad).toFixed(2)},${(cy + Math.sin(a) * rad).toFixed(2)}`);
      }
      poly(s, pts.join(' '), fill);
    }
    function nordic(s, bg, cross, inner) {
      rect(s, 0, 0, W, H, bg);
      rect(s, 8, 0, 5, H, cross); rect(s, 0, 7.5, W, 5, cross);
      if (inner) { rect(s, 9.25, 0, 2.5, H, inner); rect(s, 0, 8.75, W, 2.5, inner); }
    }
    function unionJack(s, w, hgt) {
      rect(s, 0, 0, w, hgt, '#012169');
      line(s, 0, 0, w, hgt, '#fff', hgt * 0.2); line(s, w, 0, 0, hgt, '#fff', hgt * 0.2);
      line(s, 0, 0, w, hgt, '#c8102e', hgt * 0.07); line(s, w, 0, 0, hgt, '#c8102e', hgt * 0.07);
      rect(s, w * 0.42, 0, w * 0.16, hgt, '#fff'); rect(s, 0, hgt * 0.38, w, hgt * 0.24, '#fff');
      rect(s, w * 0.455, 0, w * 0.09, hgt, '#c8102e'); rect(s, 0, hgt * 0.43, w, hgt * 0.14, '#c8102e');
    }
    function stripes(s, n, a, b) {
      for (let i = 0; i < n; i++) rect(s, 0, (H / n) * i, W, H / n + 0.05, i % 2 ? b : a);
    }

    const FLAGS = {
      AR: s => { h(['#74acdf', '#fff', '#74acdf'])(s); circle(s, 15, 10, 2.2, '#f6b40e'); },
      AT: h(['#ed2939', '#fff', '#ed2939']),
      AU: s => { rect(s, 0, 0, W, H, '#012169'); unionJack(s, 15, 10); star(s, 7.5, 15.5, 2.4, '#fff'); star(s, 23, 5, 1.3, '#fff'); star(s, 20, 10, 1.3, '#fff'); star(s, 26, 9, 1.3, '#fff'); star(s, 23, 16, 1.4, '#fff'); },
      BE: v(['#1a1a1a', '#fdda24', '#ef3340']),
      BG: h(['#fff', '#00966e', '#d62612']),
      BR: s => { rect(s, 0, 0, W, H, '#009c3b'); poly(s, '15,2 28,10 15,18 2,10', '#ffdf00'); circle(s, 15, 10, 4.4, '#002776'); line(s, 10.8, 9, 19.2, 11, '#fff', 0.8); },
      CA: s => { v(['#d52b1e', '#fff', '#d52b1e'], [1, 2, 1])(s); star(s, 15, 10, 4.5, '#d52b1e'); rect(s, 14.5, 12, 1, 4, '#d52b1e'); },
      CH: s => { rect(s, 0, 0, W, H, '#da291c'); rect(s, 13, 4, 4, 12, '#fff'); rect(s, 9, 8, 12, 4, '#fff'); },
      CI: v(['#f77f00', '#fff', '#009e60']),
      CL: s => { rect(s, 0, 0, W, H, '#fff'); rect(s, 0, 10, W, 10, '#d52b1e'); rect(s, 0, 0, 10, 10, '#0039a6'); star(s, 5, 5, 2.6, '#fff'); },
      CM: s => { v(['#007a5e', '#ce1126', '#fcd116'])(s); star(s, 15, 10, 2.6, '#fcd116'); },
      CR: h(['#002b7f', '#fff', '#ce1126', '#fff', '#002b7f'], [1, 1, 2, 1, 1]),
      CZ: s => { rect(s, 0, 0, W, 10, '#fff'); rect(s, 0, 10, W, 10, '#d7141a'); poly(s, '0,0 15,10 0,20', '#11457e'); },
      DE: h(['#1a1a1a', '#dd0000', '#ffce00']),
      DK: s => nordic(s, '#c8102e', '#fff'),
      EC: s => { h(['#ffdd00', '#034ea2', '#ed1c24'], [2, 1, 1])(s); circle(s, 15, 9.5, 2.2, '#7a5c2e'); },
      EG: s => { h(['#ce1126', '#fff', '#1a1a1a'])(s); circle(s, 15, 10, 1.8, '#c09300'); },
      ES: s => { h(['#aa151b', '#f1bf00', '#aa151b'], [1, 2, 1])(s); rect(s, 7, 7.5, 3, 5, '#aa151b'); },
      FI: s => nordic(s, '#fff', '#003580'),
      FR: v(['#0055a4', '#fff', '#ef4135']),
      GE: s => { rect(s, 0, 0, W, H, '#fff'); rect(s, 13, 0, 4, H, '#ff0000'); rect(s, 0, 8, W, 4, '#ff0000');
        [[6.5, 4], [23.5, 4], [6.5, 16], [23.5, 16]].forEach(([x, y]) => { rect(s, x - 0.6, y - 2, 1.2, 4, '#ff0000'); rect(s, x - 2, y - 0.6, 4, 1.2, '#ff0000'); }); },
      GH: s => { h(['#ce1126', '#fcd116', '#006b3f'])(s); star(s, 15, 10, 3, '#1a1a1a'); },
      GR: s => { stripes(s, 9, '#0d5eaf', '#fff'); rect(s, 0, 0, 11.1, 11.1, '#0d5eaf'); rect(s, 4.45, 0, 2.2, 11.1, '#fff'); rect(s, 0, 4.45, 11.1, 2.2, '#fff'); },
      HR: s => { h(['#ff0000', '#fff', '#171796'])(s);
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) rect(s, 12.6 + c * 1.6, 6.5 + r * 1.6, 1.6, 1.6, (r + c) % 2 ? '#fff' : '#ff0000'); },
      HU: h(['#ce2939', '#fff', '#477050']),
      IE: v(['#169b62', '#fff', '#ff883e']),
      IT: v(['#009246', '#fff', '#ce2b37']),
      KR: s => { rect(s, 0, 0, W, H, '#fff');
        s.append(svgEl('path', { d: 'M10.5 10 A4.5 4.5 0 0 1 19.5 10 Z', fill: '#cd2e3a' }));
        s.append(svgEl('path', { d: 'M10.5 10 A4.5 4.5 0 0 0 19.5 10 Z', fill: '#0047a0' }));
        [[5, 4], [25, 4], [5, 16], [25, 16]].forEach(([x, y]) => rect(s, x - 1.6, y - 1.2, 3.2, 2.4, '#1a1a1a')); },
      MA: s => { rect(s, 0, 0, W, H, '#c1272d'); star(s, 15, 10.5, 4.5, '#006233'); star(s, 15, 10.5, 2.6, '#c1272d'); },
      ME: s => { rect(s, 0, 0, W, H, '#d4af37'); rect(s, 1.2, 1.2, W - 2.4, H - 2.4, '#c40308'); circle(s, 15, 10, 3.2, '#d4af37'); },
      MK: s => { rect(s, 0, 0, W, H, '#d20000');
        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; line(s, 15, 10, 15 + Math.cos(a) * 18, 10 + Math.sin(a) * 18, '#ffe600', 2.2); }
        circle(s, 15, 10, 3.2, '#ffe600'); },
      ML: v(['#14b53a', '#fcd116', '#ce1126']),
      MX: s => { v(['#006847', '#fff', '#ce1126'])(s); circle(s, 15, 10, 2.3, '#8c6a3f'); },
      NG: v(['#008751', '#fff', '#008751']),
      NL: h(['#ae1c28', '#fff', '#21468b']),
      NO: s => nordic(s, '#ba0c2f', '#fff', '#00205b'),
      PL: h(['#fff', '#dc143c']),
      PT: s => { v(['#006600', '#ff0000'], [2, 3])(s); circle(s, 12, 10, 3.8, '#ffcc00'); circle(s, 12, 10, 2.4, '#ff0000'); circle(s, 12, 10, 1.6, '#fff'); },
      RO: v(['#002b7f', '#fcd116', '#ce1126']),
      RS: s => { h(['#c6363c', '#0c4076', '#fff'])(s); rect(s, 7, 5, 4.5, 7, '#c6363c'); rect(s, 7.6, 5.6, 3.3, 5.8, '#fff'); },
      SE: s => nordic(s, '#006aa7', '#fecc00'),
      SN: s => { v(['#00853f', '#fdef42', '#e31b23'])(s); star(s, 15, 10, 3, '#00853f'); },
      TT: s => { rect(s, 0, 0, W, H, '#ce1126'); poly(s, '2,0 12,0 28,20 18,20', '#fff'); poly(s, '4.5,0 9.5,0 25.5,20 20.5,20', '#1a1a1a'); },
      UA: h(['#0057b7', '#ffd700']),
      TR: s => { rect(s, 0, 0, W, H, '#e30a17'); circle(s, 11, 10, 5, '#fff'); circle(s, 12.3, 10, 4, '#e30a17'); star(s, 17.5, 10, 2.4, '#fff'); },
      BA: s => { rect(s, 0, 0, W, H, '#002395'); poly(s, '8,0 24,0 24,20', '#fecb00');
        for (let k = 0; k < 7; k++) star(s, 6.5 + k * 2.6, 1.5 + k * 2.9, 1, '#fff'); },
      BY: s => { h(['#c8313e', '#4aa657'], [2, 1])(s); rect(s, 0, 0, 4, H, '#fff');
        for (let k = 0; k < 6; k++) poly(s, `2,${1.5 + k * 3.2} 3.4,${3 + k * 3.2} 2,${4.5 + k * 3.2} 0.6,${3 + k * 3.2}`, '#c8313e'); },
      RU: h(['#fff', '#0039a6', '#d52b1e']),
      CO: h(['#fcd116', '#003893', '#ce1126'], [2, 1, 1]),
      JP: s => { rect(s, 0, 0, W, H, '#fff'); circle(s, 15, 10, 6, '#bc002d'); },
      PE: v(['#d91023', '#fff', '#d91023']),
      UY: s => { stripes(s, 9, '#fff', '#0038a8'); rect(s, 0, 0, 11.1, 11.1, '#fff'); circle(s, 5.5, 5.5, 3, '#fcd116'); },
      ZW: s => { h(['#319208', '#ffd200', '#de2010', '#1a1a1a', '#de2010', '#ffd200', '#319208'])(s);
        poly(s, '0,0 11,10 0,20', '#fff'); star(s, 4, 10, 2.4, '#de2010'); },
      ENG: s => { rect(s, 0, 0, W, H, '#fff'); rect(s, 13, 0, 4, H, '#ce1124'); rect(s, 0, 8, W, 4, '#ce1124'); },
      SCO: s => { rect(s, 0, 0, W, H, '#005eb8'); line(s, 0, 0, W, H, '#fff', 3.2); line(s, W, 0, 0, H, '#fff', 3.2); },
      WAL: s => { rect(s, 0, 0, W, 10, '#fff'); rect(s, 0, 10, W, 10, '#00b140');
        s.append(svgEl('path', { d: 'M7 13 L10 7 L13 9 L17 5 L18 8 L22 8 L20 11 L24 14 L19 14 L16 16 L13 13 L10 15 Z', fill: '#c8102e' })); },
      NIR: s => { rect(s, 0, 0, W, H, '#fff'); rect(s, 13, 0, 4, H, '#c8102e'); rect(s, 0, 8, W, 4, '#c8102e'); star(s, 15, 10, 3.6, '#fff'); circle(s, 15, 10.3, 1.5, '#c8102e'); }
    };

    /** Returns an <svg> flag, or a plain code badge when the country isn't drawn. */
    function make(code, cls) {
      const draw = FLAGS[code];
      const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: `flag ${cls || ''}`.trim(), role: 'img', 'aria-label': `Flag: ${countryLabel(code)}` });
      if (draw) draw(svg);
      else {
        rect(svg, 0, 0, W, H, '#4a5568');
        svg.append(Object.assign(svgEl('text', { x: 15, y: 13.5, 'text-anchor': 'middle', 'font-size': 9, 'font-weight': 700, fill: '#fff' }), { textContent: countryLabel(code) }));
      }
      svg.append(svgEl('rect', { x: 0.25, y: 0.25, width: W - 0.5, height: H - 0.5, fill: 'none', stroke: 'rgba(0,0,0,.35)', 'stroke-width': 0.5 }));
      return svg;
    }
    return { make };
  })();

  // ===========================================================================
  // 4. Data validation & derived lists
  // ===========================================================================

  function validateTeam(t) {
    const problems = [];
    if (!t || !t.id) problems.push('missing id');
    if (!Array.isArray(t.players) || t.players.length !== 11) problems.push('needs exactly 11 players');
    const rows = formationRows(t.formation);
    if (rows.some(n => !Number.isFinite(n) || n < 1) || rows.reduce((a, b) => a + b, 0) !== 10) problems.push(`invalid formation "${t.formation}"`);
    if (!Number.isFinite(seasonEndYear(t.season))) problems.push('invalid season');
    if (Array.isArray(t.players) && t.players.some(p => !Object.values(CLUE_TYPES).some(c => isPresent(c.value(p))))) problems.push('a player has no usable clue');
    if (problems.length) {
      console.warn(`[Starting XI] Skipping team "${t && t.id}": ${problems.join(', ')}`);
      return false;
    }
    return true;
  }

  const seenIds = new Set();
  const TEAMS = (RAW.teams || []).filter(t => {
    if (!validateTeam(t)) return false;
    if (seenIds.has(t.id)) { console.warn(`[Starting XI] Duplicate team id "${t.id}" skipped`); return false; }
    seenIds.add(t.id);
    return true;
  });

  const ALL_CLUBS = [...new Set([...TEAMS.map(t => t.club), ...(RAW.decoyClubs || [])])]
    .sort((a, b) => a.localeCompare(b));
  const CLUB_BY_NORM = new Map(ALL_CLUBS.map(c => [normalize(c), c]));
  const ALIASES = new Map();
  for (const [alias, club] of Object.entries(RAW.clubAliases || {})) {
    if (CLUB_BY_NORM.has(normalize(club))) ALIASES.set(normalize(alias), CLUB_BY_NORM.get(normalize(club)));
  }
  const DATA_DECADES = DECADES.filter(d => TEAMS.some(t => decadeOf(t) === d));

  // ===========================================================================
  // 5. Persistence (localStorage, failure-tolerant)
  // ===========================================================================

  function defaultStore() {
    return {
      settings: { difficulty: 'medium', pool: 'all', decades: DECADES.slice(), sound: true },
      stats: { played: 0, wins: 0, hints: 0, points: 0, streak: 0, bestStreak: 0 },
      discovered: [],         // team ids solved at least once
      timeAttack: { best: 0, plays: 0 },
      seenHelp: false
    };
  }

  function mergeDefaults(def, obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(def)) return obj === undefined ? def : obj;
    const out = { ...def };
    for (const k of Object.keys(def)) {
      if (!(k in obj)) continue;
      const plain = def[k] && typeof def[k] === 'object' && !Array.isArray(def[k]);
      // Empty default objects (like ratings) are free-form maps: keep whatever was saved.
      out[k] = plain && Object.keys(def[k]).length ? mergeDefaults(def[k], obj[k]) : obj[k];
    }
    return out;
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const s = raw ? mergeDefaults(defaultStore(), JSON.parse(raw)) : defaultStore();
      // Saved data comes from the user's browser: coerce every field to the expected shape.
      const num = (v, d) => (Number.isFinite(v) && v >= 0 ? Math.floor(v) : d);
      for (const k of Object.keys(s.stats)) s.stats[k] = num(s.stats[k], 0);
      s.timeAttack.best = num(s.timeAttack.best, 0);
      s.timeAttack.plays = num(s.timeAttack.plays, 0);
      s.discovered = Array.isArray(s.discovered) ? s.discovered.filter(id => typeof id === 'string').slice(0, 1000) : [];
      s.settings.sound = s.settings.sound !== false;
      s.seenHelp = s.seenHelp === true;
      if (Array.isArray(s.settings.decades)) s.settings.decades = s.settings.decades.filter(d => DECADES.includes(d));
      if (!Array.isArray(s.settings.decades) || !s.settings.decades.length) s.settings.decades = DECADES.slice();
      if (!POOLS[s.settings.pool]) s.settings.pool = 'all';           // migrate old fame-based pools
      if (!DIFFICULTY[s.settings.difficulty]) s.settings.difficulty = 'medium';
      return s;
    } catch (e) {
      return defaultStore();
    }
  }

  let store = loadStore();
  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* storage full or blocked */ }
  }

  // ===========================================================================
  // 6. Sound (Web Audio API, synthesised — no files)
  // ===========================================================================

  const Sound = {
    ctx: null,
    ensure() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        try { this.ctx = new AC(); } catch (e) { return null; }
      }
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return this.ctx;
    },
    tone(freq, start, dur, type = 'sine', vol = 0.12, slideTo = null) {
      const ctx = this.ctx;
      const t = ctx.currentTime + start;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur + 0.03);
    },
    noise(start, dur, vol = 0.08, freq = 900) {
      const ctx = this.ctx;
      const len = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass'; filter.frequency.value = freq; filter.Q.value = 0.6;
      const g = ctx.createGain();
      const t = ctx.currentTime + start;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filter).connect(g).connect(ctx.destination);
      src.start(t);
      src.stop(t + dur + 0.05);
    },
    /**
     * Happy celebration for a perfect guess: a bright major-key jingle with sparkly bells,
     * a cheerful (high, airy) crowd, rising "woo!" voices and a clap-clap-clapclapclap rhythm.
     */
    happyCheer(start) {
      const ctx = this.ctx;
      const t0 = ctx.currentTime + start;
      const out = ctx.createGain();
      out.gain.value = 0.85;
      out.connect(ctx.destination);
      const note = (freq, at, dur, type, vol) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(vol, at + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
        o.connect(g).connect(out); o.start(at); o.stop(at + dur + 0.02);
      };

      // 1) Victory jingle in C major (melody + octave sparkle)
      const melody = [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3], [784, 0.48], [1047, 0.58], [1319, 0.7]];
      melody.forEach(([f, s], i) => {
        const last = i === melody.length - 1;
        note(f, t0 + s, last ? 0.9 : 0.22, 'triangle', 0.12);
        note(f * 2, t0 + s, last ? 0.6 : 0.15, 'sine', 0.035);
      });
      // Final chord under the top note
      [523, 659, 784].forEach(f => note(f, t0 + 0.7, 1.0, 'triangle', 0.05));

      // 2) Glockenspiel sparkles scattered over the cheer
      const bells = [2093, 2349, 2637, 3136, 3520];
      for (let i = 0; i < 10; i++) note(bells[(Math.random() * bells.length) | 0], t0 + 0.9 + Math.random() * 1.8, 0.35, 'sine', 0.03);

      // Shared noise buffer
      const dur = 3.2;
      const len = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

      // 3) Bright, airy crowd (higher bands than a stadium roar)
      [[900, 0.8, 0.07], [1800, 1.0, 0.06], [3200, 1.2, 0.03]].forEach(([freq, q, vol]) => {
        const src = ctx.createBufferSource(); src.buffer = buf;
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q;
        const g = ctx.createGain();
        const a = t0 + 0.3;
        g.gain.setValueAtTime(0.0001, a);
        g.gain.exponentialRampToValueAtTime(vol, a + 0.4);
        g.gain.setValueAtTime(vol, a + 1.6);
        g.gain.exponentialRampToValueAtTime(0.0001, a + dur - 0.3);
        src.connect(bp).connect(g).connect(out); src.start(a); src.stop(a + dur);
      });

      // 4) "Wooo!" voices: pitch glides upward, the sound of a happy crowd
      for (let i = 0; i < 6; i++) {
        const a = t0 + 0.35 + Math.random() * 0.8;
        const base = 280 + Math.random() * 140;
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(base, a);
        o.frequency.exponentialRampToValueAtTime(base * 1.9, a + 0.45);
        o.frequency.exponentialRampToValueAtTime(base * 1.7, a + 0.9);
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.Q.value = 2;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, a);
        g.gain.exponentialRampToValueAtTime(0.018, a + 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, a + 0.9);
        o.connect(lp).connect(g).connect(out); o.start(a); o.stop(a + 0.95);
      }

      // 5) Rhythmic crowd claps: clap . clap . clap-clap-clap (twice); each clap is several hands
      const clap = at => {
        for (let h = 0; h < 7; h++) {
          const c = at + (Math.random() - 0.5) * 0.03;
          const src = ctx.createBufferSource(); src.buffer = buf;
          const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800 + Math.random() * 1400; bp.Q.value = 1.4;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, c);
          g.gain.exponentialRampToValueAtTime(0.05, c + 0.004);
          g.gain.exponentialRampToValueAtTime(0.0001, c + 0.07);
          src.connect(bp).connect(g).connect(out); src.start(c, Math.random() * (dur - 0.2), 0.08);
        }
      };
      const beat = 0.28;
      [0, 2, 4, 5, 6].forEach(b => clap(t0 + 1.0 + b * beat));
      [0, 2, 4, 5, 6].forEach(b => clap(t0 + 1.0 + (8 + b) * beat));

      // 6) A cheerful two-note fan whistle
      this.whistle(start + 0.5, 0.18, 3200, 0.03);
      this.whistle(start + 0.75, 0.3, 3600, 0.03);
    },
    whistle(start, dur, freq = 2900, vol = 0.07) {
      const ctx = this.ctx;
      const t = ctx.currentTime + start;
      const o = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      lfo.frequency.value = 32; lfoGain.gain.value = freq * 0.048;
      lfo.connect(lfoGain).connect(o.frequency);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
      g.gain.setValueAtTime(vol, t + dur - 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t); lfo.start(t);
      o.stop(t + dur + 0.02); lfo.stop(t + dur + 0.02);
    },
    play(name) {
      if (!store.settings.sound) return;
      if (!this.ensure()) return;
      try {
        switch (name) {
          case 'click': this.tone(520, 0, 0.05, 'triangle', 0.06); break;
          case 'flip': this.tone(700, 0, 0.06, 'sine', 0.05, 1100); break;
          case 'tick': this.tone(1200, 0, 0.04, 'square', 0.03); break;
          case 'hint': this.tone(660, 0, 0.09, 'triangle', 0.08); this.tone(990, 0.08, 0.12, 'triangle', 0.07); break;
          case 'wrong': this.tone(220, 0, 0.28, 'sawtooth', 0.07, 110); break;
          case 'clubRight': [523, 659, 784].forEach((f, i) => this.tone(f, i * 0.08, 0.18, 'triangle', 0.1)); break;
          case 'whistle': this.whistle(0, 0.18); this.whistle(0.24, 0.5); break;
          case 'win':
            [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.1, 0.3, 'triangle', 0.11));
            this.noise(0.05, 1.6, 0.07, 700);
            break;
          case 'perfect':   // exact club AND season: happy jingle + cheering crowd
            this.happyCheer(0);
            break;
          case 'lose': [392, 330, 262].forEach((f, i) => this.tone(f, i * 0.16, 0.3, 'sine', 0.09)); break;
        }
      } catch (e) { /* audio is optional */ }
    }
  };

  // ===========================================================================
  // 7. Confetti (canvas)
  // ===========================================================================

  const Confetti = (() => {
    const canvas = $('confetti');
    const ctx = canvas.getContext('2d');
    let parts = [];
    let running = false;
    const colors = ['#ffd166', '#ffb703', '#7cc8ff', '#3ddc84', '#ff5d73', '#ffffff'];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function drawStar(c, r) {
      c.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const rad = i % 2 ? r * 0.45 : r;
        c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      c.closePath(); c.fill();
    }
    function frame() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter(p => p.y < innerHeight + 30 && p.life > 0);
      for (const p of parts) {
        p.vy += 0.18; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.star) drawStar(ctx, p.size); else ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (parts.length) requestAnimationFrame(frame);
      else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    }
    return {
      burst(amount = 150) {
        if (reducedMotion) return;
        resize();
        for (let i = 0; i < amount; i++) {
          parts.push({
            x: innerWidth / 2 + (Math.random() - 0.5) * innerWidth * 0.3,
            y: innerHeight * 0.32,
            vx: (Math.random() - 0.5) * 14,
            vy: -Math.random() * 12 - 4,
            rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
            size: 6 + Math.random() * 7,
            color: colors[(Math.random() * colors.length) | 0],
            star: Math.random() < 0.25,
            life: 260
          });
        }
        if (!running) { running = true; requestAnimationFrame(frame); }
      }
    };
  })();

  // ===========================================================================
  // 8. Shirt rendering (inline SVG, generic kits — no crests)
  // ===========================================================================

  const SHIRT_PATH = 'M33 4 L42 1 Q50 9 58 1 L67 4 L96 20 L87 40 L76 34 L76 90 L24 90 L24 34 L13 40 L4 20 Z';

  function shirtSVG(kit, cls) {
    const svg = svgEl('svg', { viewBox: '0 0 100 92', class: cls || 'shirt', 'aria-hidden': 'true', focusable: 'false' });
    svg.append(svgEl('path', { d: SHIRT_PATH, fill: kit.primary }));
    const g = svgEl('g', { 'clip-path': 'url(#shirt-clip)', fill: kit.secondary });
    switch (kit.pattern) {
      case 'stripes': for (let x = 9; x < 100; x += 16) g.append(svgEl('rect', { x, y: 0, width: 8, height: 92 })); break;
      case 'hoops': for (let y = 12; y < 92; y += 15) g.append(svgEl('rect', { x: 0, y, width: 100, height: 7.5 })); break;
      case 'band': g.append(svgEl('rect', { x: 38, y: 0, width: 24, height: 92 })); break;
      case 'halves': g.append(svgEl('rect', { x: 50, y: 0, width: 50, height: 92 })); break;
      case 'diagonal': g.append(svgEl('polygon', { points: '100,0 100,92 0,92' })); break;
      default: break;
    }
    svg.append(g);
    const trim = kit.pattern === 'plain' ? kit.secondary : kit.primary;
    svg.append(svgEl('path', { d: 'M42 1 Q50 9 58 1', fill: 'none', stroke: trim, 'stroke-width': 3.2, 'stroke-linecap': 'round' }));
    svg.append(svgEl('line', { x1: 4, y1: 20, x2: 13, y2: 40, stroke: trim, 'stroke-width': 3.5 }));
    svg.append(svgEl('line', { x1: 96, y1: 20, x2: 87, y2: 40, stroke: trim, 'stroke-width': 3.5 }));
    svg.append(svgEl('path', { d: SHIRT_PATH, fill: 'none', stroke: 'rgba(0,0,0,.4)', 'stroke-width': 1.4, 'stroke-linejoin': 'round' }));
    return svg;
  }

  function teamKit(team) {
    const k = team.kitColors || {};
    return { primary: k.primary || NEUTRAL_KIT.primary, secondary: k.secondary || '#ffffff', pattern: k.pattern || 'plain' };
  }

  // ===========================================================================
  // 9. Clue generation — every player gets a real, role-appropriate clue
  // ===========================================================================

  function clueWeight(type, player, difficulty) {
    const base = (CLUE_WEIGHTS[difficulty] || CLUE_WEIGHTS.medium)[type] || 0;
    const roleMult = (ROLE_MULT[ROLE_OF[player.position] || 'mid'] || {})[type];
    let w = base * (roleMult === undefined ? 1 : roleMult);
    // "Academy product" is a weak clue on its own — use it less often.
    if (type === 'prev' && player.previousClub === YOUTH) w *= 0.45;
    return w;
  }

  /** Returns an array (one per player) of clue-type arrays. Easy: 2 clues each, otherwise 1. */
  function generateClues(team, difficulty) {
    const perPlayer = (DIFFICULTY[difficulty] || DIFFICULTY.medium).clues;
    const cap = MAX_SAME_CLUE * perPlayer;
    const counts = {};
    // Visit players in random order so the "max per type" cap doesn't always hit the same shirts.
    const result = new Array(11);
    shuffle([...Array(11).keys()]).forEach(i => {
      const p = team.players[i];
      const chosen = [];
      for (let k = 0; k < perPlayer; k++) {
        const available = Object.keys(CLUE_TYPES)
          .filter(t => !chosen.includes(t) && isPresent(CLUE_TYPES[t].value(p)));
        const build = respectCap => available
          .filter(t => !respectCap || (counts[t] || 0) < cap)
          .map(t => ({ key: t, w: clueWeight(t, p, difficulty) / (1 + (counts[t] || 0) * 0.45) }))
          .filter(o => o.w > 0);
        let options = build(true);
        if (!options.length) options = build(false);
        // Last resort (e.g. keeper with only goals/assists left): any available field.
        if (!options.length) options = available.map(t => ({ key: t, w: 1 }));
        if (!options.length) break;
        const t = pickWeighted(options);
        chosen.push(t);
        counts[t] = (counts[t] || 0) + 1;
      }
      result[i] = chosen;
    });
    return result;
  }

  /** Display data for a clue: {main (string|Node), sub, label, cls, describe}. */
  function formatClue(type, p) {
    switch (type) {
      case 'flag': return { main: Flag.make(p.nationality, 'flag-big'), sub: countryLabel(p.nationality), label: 'Nation', cls: 'flag', describe: `nationality ${countryLabel(p.nationality)}` };
      case 'age': return { main: String(p.age), label: 'Age', describe: `age ${p.age}` };
      case 'shirt': return { main: `#${p.shirtNumber}`, label: 'Shirt no.', describe: `shirt number ${p.shirtNumber}` };
      case 'goals': return { main: String(p.careerGoals), label: 'Career goals', describe: `about ${p.careerGoals} career goals` };
      case 'assists': return { main: String(p.careerAssists), label: 'Assists', describe: `about ${p.careerAssists} career assists` };
      case 'caps': return { main: String(p.caps), label: 'Intl caps', describe: `${p.caps} international caps` };
      case 'prev': {
        const v = p.previousClub === YOUTH ? 'Academy' : p.previousClub;
        return { main: v, label: 'Prev. club', cls: 'text', describe: p.previousClub === YOUTH ? 'came through the youth academy' : `previous club ${p.previousClub}` };
      }
      default: return { main: '?', label: '', describe: 'no clue' };
    }
  }

  /** Compact badge for team-wide hints and easy-mode second clues. Returns a Node. */
  function badge(type, p, cls) {
    const b = el('span', { class: `badge-mini ${cls || ''}`.trim() });
    switch (type) {
      case 'flag': b.append(Flag.make(p.nationality, 'flag-mini'), ` ${countryLabel(p.nationality)}`); break;
      case 'shirt': b.textContent = isPresent(p.shirtNumber) ? `#${p.shirtNumber}` : '#?'; break;
      case 'age': b.textContent = `${p.age} yrs`; break;
      case 'caps': b.textContent = `${isPresent(p.caps) ? p.caps : '?'} caps`; break;
      case 'goals': b.textContent = `${isPresent(p.careerGoals) ? p.careerGoals : '?'} gls`; break;
      case 'assists': b.textContent = `${p.careerAssists} ast`; break;
      case 'prev': b.textContent = !isPresent(p.previousClub) ? 'ex-?' : p.previousClub === YOUTH ? 'Academy' : `ex-${p.previousClub}`; break;
      default: b.textContent = '?';
    }
    return b;
  }

  // ===========================================================================
  // 10. Game state
  // ===========================================================================

  const state = {
    mode: 'classic',
    round: null,
    session: { score: 0, rounds: 0, seen: new Set() },
    ta: { active: false, finished: false, timeLeft: TIME_ATTACK_SECONDS, score: 0, answered: 0, timer: null, seen: new Set(), log: [] }
  };

  function createRound(team, opts) {
    return {
      team,
      difficulty: opts.difficulty,
      mode: opts.mode,
      clues: generateClues(team, opts.difficulty),
      guesses: [],
      phase: 'club',            // 'club' → 'season' → 'over'
      seasonGuess: null,
      seasonDiff: null,
      used: {},                 // hint id → times used
      teamClues: new Set(),     // clue types revealed for every player
      revealedNames: new Set(),
      hintLog: [],
      won: false,
      points: 0
    };
  }

  const hintCount = r => Object.values(r.used).reduce((a, b) => a + b, 0);
  const hintCost = r => Object.entries(r.used).reduce((s, [id, n]) => s + HINT_BY_ID[id].cost * n, 0);
  const wrongCount = r => r.guesses.filter(g => !g.correct).length;
  const seasonPoints = diff => (diff === null || diff === undefined) ? 0 : (SCORING.seasonByDiff[diff] || 0);
  const kitVisible = r => r.phase === 'over' || (DIFFICULTY[r.difficulty] || {}).kit || !!r.used.kit;

  /** Teams matching the pool (fame) and decade filters from settings. */
  function filteredTeams() {
    const { pool, decades } = store.settings;
    return TEAMS.filter(t =>
      (POOLS[pool] || POOLS.all).test(t) &&
      decades.includes(decadeOf(t)));
  }
  function poolTeams() {
    const f = filteredTeams();
    if (f.length) return f;
    toast('No teams match your filters — using all teams.');
    return TEAMS;
  }

  /** Pick a team not yet seen in this session; reshuffle when exhausted. */
  function pickFresh(pool, seen) {
    let candidates = pool.filter(t => !seen.has(t.id));
    if (!candidates.length) {
      seen.clear();
      if (state.round) seen.add(state.round.team.id);
      candidates = pool.filter(t => !seen.has(t.id));
      if (!candidates.length) candidates = pool;
      toast(`You've seen all ${plural(pool.length, 'team')} in your selection — reshuffling!`);
    }
    const team = candidates[Math.floor(Math.random() * candidates.length)];
    seen.add(team.id);
    return team;
  }

  // ===========================================================================
  // 11. Rendering — pitch
  // ===========================================================================

  const els = {
    players: $('players'), pitch: $('pitch'), formationTag: $('formation-tag'), overlay: $('pitch-overlay'),
    status: $('status-bar'), playPanel: $('play-panel'), clubForm: $('club-form'), seasonForm: $('season-form'),
    clubInput: $('club-input'), clubList: $('club-list'), clubSubmit: $('club-submit'), history: $('guess-history'),
    seasonSelect: $('season-select'), feedback: $('feedback'), hints: $('hints'), hintButtons: $('hint-buttons'),
    hintLog: $('hint-log'), roundActions: $('round-actions'), reveal: $('reveal'), taPanel: $('ta-panel'), toast: $('toast')
  };

  /** Compute % coordinates for each player from the formation. */
  function layoutPositions(team) {
    const rows = formationRows(team.formation);
    const gaps = { 1: 0, 2: 34, 3: 29, 4: 22.5, 5: 18.5 };
    const pos = [{ x: 50, y: 89, row: 0, size: 1 }];
    const top = 13, bottom = 71;
    let idx = 1;
    rows.forEach((count, r) => {
      const y = rows.length === 1 ? (top + bottom) / 2 : bottom - r * (bottom - top) / (rows.length - 1);
      const gap = gaps[count] !== undefined ? gaps[count] : 88 / count;
      for (let i = 0; i < count; i++) {
        pos[idx++] = { x: 50 + (i - (count - 1) / 2) * gap, y, row: r + 1, size: count };
      }
    });
    return pos;
  }

  function renderPitch(opts = {}) {
    const r = state.round;
    els.players.innerHTML = '';
    els.overlay.hidden = true;
    els.pitch.classList.toggle('no-anim', !!opts.noAnim);
    if (!r) { els.formationTag.textContent = ''; hideTip(); return; }

    els.formationTag.textContent = r.team.formation === 'WM' ? 'WM (3-2-2-3)' : r.team.formation;
    const kit = kitVisible(r) ? teamKit(r.team) : NEUTRAL_KIT;
    const realKit = teamKit(r.team);
    const positions = layoutPositions(r.team);
    const over = r.phase === 'over';

    r.team.players.forEach((p, i) => {
      const pos = positions[i];
      const clueTypes = r.clues[i];
      const nameShown = r.revealedNames.has(i);

      // ── front face ──
      const shirtWrap = el('div', { class: 'shirt-wrap' }, [shirtSVG(kit)]);
      const front = el('div', { class: 'card-face card-front' }, [shirtWrap]);
      const c = formatClue(clueTypes[0], p);
      shirtWrap.append(el('div', { class: `clue-bubble${c.cls === 'flag' ? ' is-flag' : ''}` }, [
        el('span', { class: `clue-main ${c.cls || ''}`.trim() }, [c.main]),
        c.sub ? el('span', { class: 'clue-sub', text: c.sub }) : null
      ]));
      front.append(el('div', { class: 'chip', text: c.label }));
      let describe = c.describe;

      // Extra info: easy-mode second clue + any team-wide hints not already on this card.
      const extras = el('div', { class: 'extras' });
      if (clueTypes[1]) {
        extras.append(badge(clueTypes[1], p, 'second'));
        describe += `, ${formatClue(clueTypes[1], p).describe}`;
      }
      r.teamClues.forEach(t => {
        if (clueTypes.includes(t)) return;
        extras.append(badge(t, p));
        describe += `, ${badgeDescribe(t, p)}`;
      });
      if (extras.childNodes.length) front.append(extras);
      if (nameShown) front.append(el('div', { class: 'name-tag', text: surname(p.name) }));

      // ── back face (revealed) ──
      const backShirt = el('div', { class: 'shirt-wrap' }, [shirtSVG(realKit),
        el('div', { class: 'back-num', text: isPresent(p.shirtNumber) ? String(p.shirtNumber) : '' })]);
      const back = el('div', { class: 'card-face card-back', 'aria-hidden': 'true' }, [
        backShirt,
        el('div', { class: 'back-name', text: p.name }),
        el('div', { class: 'back-pos' }, [Flag.make(p.nationality, 'flag-mini'), ` ${p.position}`])
      ]);

      const label = over
        ? `${p.name}, ${p.position}${isPresent(p.shirtNumber) ? `, number ${p.shirtNumber}` : ''}. Show profile`
        : `Player ${i + 1}: ${describe}${nameShown ? `. Revealed: ${p.name}` : ''}. Show details`;
      const card = el('li', {
        class: `card${pos.size >= 5 ? ' compact' : ''}${opts.flipped ? ' flipped' : ''}`,
        style: `left:${pos.x}%;top:${pos.y}%;`
      }, [
        // The whole card is a button: tap / Enter opens a tooltip with the full clue (or profile once revealed).
        el('button', {
          type: 'button', class: 'card-drop card-btn', 'aria-label': label, 'aria-expanded': 'false',
          'aria-controls': 'card-tip', 'data-index': String(i),
          style: `--delay:${opts.noAnim ? 0 : (10 - pos.row) * 70 + i * 25}ms`,
          onclick: e => { e.stopPropagation(); toggleTip(i); }
        }, [
          el('div', { class: 'card-inner' }, [front, back])
        ])
      ]);
      els.players.append(card);
    });
    hideTip();
  }

  function badgeDescribe(type, p) {
    const v = CLUE_TYPES[type].value(p);
    if (!isPresent(v)) return `${CLUE_TYPES[type].label.toLowerCase()} unknown`;
    return formatClue(type, p).describe;
  }

  /** Flip every card with a stagger. */
  function flipAll() {
    const cards = [...els.players.children];
    const r = state.round;
    hideTip();
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('flipped');
        const p = r.team.players[i];
        const btn = card.querySelector('.card-btn');
        if (btn) btn.setAttribute('aria-label', `${p.name}, ${p.position}. Show profile`);
        if (i % 2 === 0) Sound.play('flip');
      }, reducedMotion ? 0 : i * 110);
    });
  }

  function shake(node) {
    if (reducedMotion) return;
    node.classList.remove('shake');
    void node.offsetWidth; // restart animation
    node.classList.add('shake');
  }

  // ── Card tooltip: full clue text while playing, player profile after the reveal ──
  const tip = { el: null, index: -1 };
  const LONG_LABEL = {
    flag: 'Nationality', age: 'Age in this match', shirt: 'Shirt number', goals: 'Career club goals (≈)',
    assists: 'Career assists (≈)', caps: 'International caps', prev: 'Joined from'
  };

  function flagLine(p) { return el('span', {}, [Flag.make(p.nationality, 'flag-mini'), ` ${countryLabel(p.nationality)}`]); }

  function tipLines(r, i) {
    const p = r.team.players[i];
    if (r.phase === 'over') {
      const lines = [[p.position, isPresent(p.shirtNumber) ? `#${p.shirtNumber}` : '—']];
      if (isPresent(p.nationality)) lines.push(['Nation', flagLine(p)]);
      if (isPresent(p.age)) lines.push(['Age in final', String(p.age)]);
      if (isPresent(p.careerGoals)) lines.push(['Career goals', `≈ ${p.careerGoals}`]);
      if (isPresent(p.careerAssists)) lines.push(['Career assists', `≈ ${p.careerAssists}`]);
      if (isPresent(p.caps)) lines.push(['Intl caps', String(p.caps)]);
      if (isPresent(p.previousClub)) lines.push(['Joined from', p.previousClub]);
      return { title: p.name, lines };
    }
    const types = [...r.clues[i], ...[...r.teamClues].filter(t => !r.clues[i].includes(t))];
    const lines = types.map(t => {
      const v = CLUE_TYPES[t].value(p);
      if (t === 'flag') return [LONG_LABEL[t], flagLine(p)];
      if (!isPresent(v)) return [LONG_LABEL[t], 'unknown'];
      if (t === 'prev') return [LONG_LABEL[t], p.previousClub === YOUTH ? 'Youth academy' : p.previousClub];
      return [LONG_LABEL[t], formatClue(t, p).main];
    });
    return { title: r.revealedNames.has(i) ? p.name : `Player ${i + 1}`, lines };
  }

  function toggleTip(i) {
    if (tip.index === i) { hideTip(); return; }
    const r = state.round;
    if (!r) return;
    if (!tip.el) {
      tip.el = el('div', { class: 'card-tip', id: 'card-tip', role: 'tooltip' });
      els.pitch.append(tip.el);
    }
    const { title, lines } = tipLines(r, i);
    tip.el.innerHTML = '';
    tip.el.append(el('strong', { class: 'card-tip-title', text: title }));
    const dl = el('dl');
    lines.forEach(([k, v]) => dl.append(el('dt', { text: k }), el('dd', {}, [v])));
    tip.el.append(dl);

    const card = els.players.children[i];
    const x = parseFloat(card.style.left), y = parseFloat(card.style.top);
    tip.el.style.left = `${Math.min(78, Math.max(22, x))}%`;
    tip.el.style.top = `${y}%`;
    tip.el.classList.toggle('below', y < 40);
    tip.el.hidden = false;
    els.players.querySelectorAll('.card-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
    card.querySelector('.card-btn').setAttribute('aria-expanded', 'true');
    tip.index = i;
    Sound.play('click');
  }

  function hideTip() {
    if (tip.el) tip.el.hidden = true;
    if (tip.index >= 0) {
      const btn = els.players.querySelector(`.card-btn[data-index="${tip.index}"]`);
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
    tip.index = -1;
  }

  // ===========================================================================
  // 12. Rendering — status bar, controls, hints
  // ===========================================================================

  function chip(k, v, extra) {
    const vNode = el('span', { class: 'v' });
    if (v instanceof Node) vNode.append(v); else vNode.textContent = v;
    return el('div', { class: `stat-chip ${extra || ''}`.trim() }, [el('span', { class: 'k', text: k }), vNode]);
  }

  function ballsNode(r) {
    const used = r ? wrongCount(r) + (r.won ? 1 : 0) : 0;
    const left = r ? MAX_GUESSES - wrongCount(r) : MAX_GUESSES;
    const node = el('span', { class: 'balls', 'aria-label': `${left} guesses left` });
    for (let i = 0; i < MAX_GUESSES; i++) node.append(el('span', { class: i < used ? 'used' : '', text: '⚽' }));
    return node;
  }

  /** "All eras", "1990s", "1960s–1980s" or "4 decades". */
  function decadeSummary() {
    const d = store.settings.decades.filter(x => DATA_DECADES.includes(x)).sort();
    if (!d.length || d.length === DATA_DECADES.length) return 'All eras';
    if (d.length === 1) return `${d[0]}s`;
    const contiguous = d.every((x, i) => i === 0 || x - d[i - 1] === 10);
    return contiguous ? `${d[0]}s–${String(d[d.length - 1]).slice(2)}s` : `${d.length} decades`;
  }

  function renderStatus() {
    const s = els.status;
    s.innerHTML = '';
    const r = state.round;
    if (state.mode === 'classic') {
      s.append(chip('Score', String(state.session.score)), chip('Streak', `${store.stats.streak}🔥`),
        chip('Guesses', ballsNode(r)), chip('Clues', `${DIFFICULTY[store.settings.difficulty].label} ×${DIFFICULTY[store.settings.difficulty].mult}`));
    } else {
      const ta = state.ta;
      s.append(chip('Time', `${ta.timeLeft}s`, `timer${ta.timeLeft <= 10 && ta.active ? ' low' : ''}`),
        chip('Correct', String(ta.score)), chip('Best', String(store.timeAttack.best)), chip('Era', decadeSummary()));
    }
  }

  function setFeedback(text, kind) {
    els.feedback.textContent = text || '';
    els.feedback.className = `feedback${kind ? ' ' + kind : ''}`;
    // Mirror warnings/misses into the docked phone bar (it hides itself when empty).
    $('dock-feedback').textContent = kind === 'bad' || kind === 'warn' ? text : '';
  }

  /**
   * Phones: while the guess form is scrolled out of view (you're looking at the pitch),
   * dock it to the bottom of the screen. A placeholder keeps the page from jumping.
   */
  const dock = { rowOffset: 0, update: () => {} };
  function setupDock() {
    const slot = $('club-slot');
    const form = els.clubForm;
    const narrow = window.matchMedia('(max-width: 899px)');
    const row = form.querySelector('.guess-row');
    dock.update = () => {
      // Where the bottom of the input row sits (measured in place, so docking doesn't change the answer).
      if (!form.classList.contains('docked') && !form.hidden) {
        dock.rowOffset = row.getBoundingClientRect().bottom - slot.getBoundingClientRect().top;
      }
      const rowBottom = slot.getBoundingClientRect().top + (dock.rowOffset || 0);
      const inputHidden = rowBottom > window.innerHeight;
      const should = narrow.matches && inputHidden && !form.hidden && !els.clubInput.disabled;
      if (should === form.classList.contains('docked')) return;
      slot.style.minHeight = should ? `${form.offsetHeight}px` : '';
      form.classList.toggle('docked', should);
      els.playPanel.classList.toggle('has-dock', should);   // backdrop-filter would trap position:fixed inside the panel
      if (!should) closeCombo();
    };
    window.addEventListener('scroll', () => dock.update(), { passive: true });
    window.addEventListener('resize', () => dock.update());
  }

  function renderHistory() {
    els.history.innerHTML = '';
    const r = state.round;
    if (!r) return;
    r.guesses.forEach(g => {
      const li = el('li', { class: g.correct ? 'right' : 'wrong' }, [`${g.correct ? '✓' : '✗'} ${g.club}`]);
      els.history.append(li);
    });
  }

  /** Build the hint buttons once (from HINTS); renderHints() then toggles their state. */
  function buildHintButtons() {
    const box = els.hintButtons;
    box.innerHTML = '';
    const groups = [['team', 'Team-wide clues'], ['big', 'Bigger hints']];
    groups.forEach(([g, title]) => {
      box.append(el('h3', { class: 'hint-group-title', text: title }));
      const grid = el('div', { class: 'hint-grid' });
      HINTS.filter(h => h.group === g).forEach(h => {
        grid.append(el('button', { class: 'btn btn-hint', type: 'button', 'data-hint': h.id, onclick: () => useHint(h.id) }, [
          el('span', { class: 'hint-label', text: h.label }), el('span', { class: 'cost', text: `−${h.cost}` })
        ]));
      });
      box.append(grid);
    });
  }

  function renderHints() {
    const r = state.round;
    const inTA = state.mode === 'timeattack';
    els.hints.hidden = inTA || !r;
    if (!r || inTA) return;
    const over = r.phase === 'over';
    els.hintButtons.querySelectorAll('.btn-hint').forEach(btn => {
      const h = HINT_BY_ID[btn.dataset.hint];
      const used = r.used[h.id] || 0;
      let disabled = over || used >= (h.max || 1);
      let hidden = false;
      let title = '';
      if (h.id === 'kit') {
        hidden = DIFFICULTY[r.difficulty].kit;
      }
      if (h.group === 'team') {
        // Pointless if every shirt already shows this clue type.
        const allShown = r.clues.every(c => c.includes(h.clue));
        if (allShown && !used) { disabled = true; title = 'Already shown on every shirt'; }
      }
      const labelNode = btn.querySelector('.hint-label');
      labelNode.textContent = h.max ? `${h.label}${used ? ` (${h.max - used} left)` : ''}` : h.label;
      btn.classList.toggle('used', used > 0);
      btn.disabled = disabled;
      btn.hidden = hidden;
      btn.title = title;
    });
    els.hintLog.innerHTML = '';
    r.hintLog.forEach(line => els.hintLog.append(el('li', { text: line })));
  }

  function renderSteps() {
    const r = state.round;
    const phase = r ? r.phase : 'over';
    const ta = state.mode === 'timeattack';
    els.playPanel.hidden = ta && (!state.ta.active || state.ta.finished);
    els.clubForm.hidden = phase === 'season' || (phase === 'over' && !ta);
    els.seasonForm.hidden = phase !== 'season';
    const clubDisabled = phase !== 'club';
    els.clubInput.disabled = clubDisabled;
    els.clubSubmit.disabled = clubDisabled;
    renderHistory();
    renderHints();
    renderRoundActions();
    dock.update();
  }

  function renderRoundActions() {
    const a = els.roundActions;
    a.innerHTML = '';
    const r = state.round;
    if (!r) return;
    if (state.mode === 'timeattack') {
      if (state.ta.active) a.append(el('button', { class: 'btn btn-ghost', type: 'button', text: 'Skip ⏭', onclick: () => taAnswer(false, null) }));
      return;
    }
    if (r.phase !== 'over') {
      a.append(el('button', { class: 'btn btn-ghost', type: 'button', text: 'Give up', onclick: giveUp }));
    }
  }

  function populateSeasons() {
    const sel = els.seasonSelect;
    sel.innerHTML = '';
    for (let y = LAST_SEASON_END; y >= FIRST_SEASON_END; y--) {
      sel.append(el('option', { value: String(y), text: seasonLabel(y) }));
    }
  }

  // ===========================================================================
  // 13. Club autocomplete (accessible combobox)
  // ===========================================================================

  const combo = { items: [], active: -1 };

  function suggestClubs(query) {
    const q = normalize(query);
    if (!q) return [];
    const scored = new Map();
    for (const club of ALL_CLUBS) {
      const n = normalize(club);
      let s = -1;
      if (n.startsWith(q)) s = 0;
      else if (n.split(' ').some(w => w.startsWith(q))) s = 1;
      else if (n.includes(q)) s = 2;
      if (s >= 0) scored.set(club, s);
    }
    for (const [alias, club] of ALIASES) {
      if (alias.startsWith(q) && !(scored.has(club) && scored.get(club) <= 1)) scored.set(club, 1.5);
    }
    return [...scored.entries()]
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([club]) => club);
  }

  /** Turn free text into a canonical club name, or null if ambiguous/unknown. */
  function resolveClub(text) {
    const n = normalize(text);
    if (!n) return null;
    if (CLUB_BY_NORM.has(n)) return CLUB_BY_NORM.get(n);
    if (ALIASES.has(n)) return ALIASES.get(n);
    const s = suggestClubs(text);
    return s.length === 1 ? s[0] : null;
  }

  function highlight(text, query) {
    const frag = document.createDocumentFragment();
    const nText = normalize(text);
    const q = normalize(query);
    const idx = q ? nText.indexOf(q) : -1;
    if (idx < 0 || nText.length !== text.length) { frag.append(text); return frag; }
    frag.append(text.slice(0, idx), el('mark', { text: text.slice(idx, idx + q.length) }), text.slice(idx + q.length));
    return frag;
  }

  function renderCombo() {
    const list = els.clubList;
    list.innerHTML = '';
    const r = state.round;
    const guessed = new Set(r ? r.guesses.map(g => g.club) : []);
    combo.items.forEach((club, i) => {
      const li = el('li', {
        id: `club-opt-${i}`, role: 'option', 'aria-selected': i === combo.active ? 'true' : 'false',
        class: guessed.has(club) ? 'guessed' : ''
      });
      li.append(highlight(club, els.clubInput.value));
      li.addEventListener('mousedown', e => { e.preventDefault(); chooseSuggestion(i); });
      list.append(li);
    });
    const open = combo.items.length > 0;
    list.hidden = !open;
    els.clubInput.setAttribute('aria-expanded', String(open));
    if (combo.active >= 0) {
      els.clubInput.setAttribute('aria-activedescendant', `club-opt-${combo.active}`);
      const node = $(`club-opt-${combo.active}`);
      if (node) node.scrollIntoView({ block: 'nearest' });
    } else {
      els.clubInput.removeAttribute('aria-activedescendant');
    }
  }

  function closeCombo() { combo.items = []; combo.active = -1; renderCombo(); }

  function chooseSuggestion(i) {
    els.clubInput.value = combo.items[i];
    closeCombo();
    submitClub();
  }

  function bindCombo() {
    els.clubInput.addEventListener('input', () => {
      combo.items = suggestClubs(els.clubInput.value);
      combo.active = combo.items.length ? 0 : -1;
      renderCombo();
    });
    els.clubInput.addEventListener('keydown', e => {
      const open = combo.items.length > 0;
      if (e.key === 'ArrowDown' && open) { e.preventDefault(); combo.active = (combo.active + 1) % combo.items.length; renderCombo(); }
      else if (e.key === 'ArrowUp' && open) { e.preventDefault(); combo.active = (combo.active - 1 + combo.items.length) % combo.items.length; renderCombo(); }
      else if (e.key === 'Enter' && open && combo.active >= 0) { e.preventDefault(); chooseSuggestion(combo.active); }
      else if (e.key === 'Escape' && open) { e.preventDefault(); e.stopPropagation(); closeCombo(); }
    });
    els.clubInput.addEventListener('blur', () => setTimeout(closeCombo, 120));
  }

  // ===========================================================================
  // 14. Round flow — guesses, hints, scoring
  // ===========================================================================

  function startRound(team, opts) {
    state.round = createRound(team, opts);
    els.reveal.hidden = true;
    els.reveal.innerHTML = '';
    els.clubInput.value = '';
    closeCombo();
    setFeedback(state.mode === 'timeattack' ? 'Name the club!' : 'Study the shirts (tap one for details)… which club is this?');
    els.seasonSelect.value = '2000';
    renderPitch();
    renderStatus();
    renderSteps();
  }

  function submitClub() {
    const r = state.round;
    if (!r || r.phase !== 'club') return;
    const text = els.clubInput.value.trim();
    if (!text) {
      setFeedback('Type a club name first.', 'warn');
      shake(els.clubForm.querySelector('.guess-row'));
      els.clubInput.focus();
      return;
    }
    const club = resolveClub(text);
    if (!club) {
      setFeedback(`“${text}” isn't a club we know — pick one from the suggestions.`, 'warn');
      shake(els.clubForm.querySelector('.guess-row'));
      combo.items = suggestClubs(text); combo.active = combo.items.length ? 0 : -1; renderCombo();
      return;
    }
    if (r.guesses.some(g => g.club === club)) {
      setFeedback(`You already guessed ${club} — try another club.`, 'warn');
      els.clubInput.select();
      return;
    }
    const correct = normalize(club) === normalize(r.team.club);
    r.guesses.push({ club, correct });
    els.clubInput.value = '';
    closeCombo();

    if (state.mode === 'timeattack') { taAnswer(correct, club); return; }

    if (correct) {
      Sound.play('clubRight');
      r.phase = 'season';
      setFeedback(`✅ ${club} is right! Now — which season?`, 'good');
      renderStatus();
      renderSteps();
      els.seasonSelect.focus();
    } else {
      Sound.play('wrong');
      shake(els.pitch);
      const left = MAX_GUESSES - wrongCount(r);
      renderStatus();
      if (left <= 0) {
        endRound(false);
      } else {
        setFeedback(left === 1 ? `❌ Not ${club}. Last guess — maybe take a hint?` : `❌ Not ${club}. ${plural(left, 'guess')} left.`, 'bad');
        renderSteps();
        els.clubInput.focus();
      }
    }
  }

  function submitSeason() {
    const r = state.round;
    if (!r || r.phase !== 'season') return;
    const raw = els.seasonSelect.value;
    const end = Number(raw);
    if (!raw || !Number.isFinite(end) || end < FIRST_SEASON_END || end > LAST_SEASON_END) {
      setFeedback('Pick a season from the list first.', 'warn');
      return;
    }
    r.seasonGuess = end;
    r.seasonDiff = Math.abs(end - seasonEndYear(r.team.season));
    endRound(true);
  }

  function stepSeason(delta) {
    const sel = els.seasonSelect;
    // Options are listed newest first, so "+" (later season) moves up the list.
    sel.selectedIndex = Math.min(sel.options.length - 1, Math.max(0, sel.selectedIndex - delta));
    Sound.play('click');
  }

  function giveUp() {
    const r = state.round;
    if (!r || r.phase === 'over') return;
    if (r.phase === 'season') {
      // Club already correct: treat as a skipped season (0 season points).
      r.seasonGuess = null;
      r.seasonDiff = 99;
      endRound(true);
    } else {
      endRound(false);
    }
  }

  /** The least-capped (i.e. least famous) hidden player is revealed first, so the hint helps without giving the game away. */
  function nextPlayerToReveal(r) {
    const hidden = r.team.players.map((p, i) => ({ p, i })).filter(x => !r.revealedNames.has(x.i));
    if (!hidden.length) return -1;
    const fame = p => (isPresent(p.caps) ? p.caps : 0) + (isPresent(p.careerGoals) ? p.careerGoals / 10 : 0);
    const min = Math.min(...hidden.map(x => fame(x.p)));
    const quiet = hidden.filter(x => fame(x.p) <= min + 8);   // small random spread among the least famous
    return quiet[Math.floor(Math.random() * quiet.length)].i;
  }

  function useHint(id) {
    const r = state.round;
    const h = HINT_BY_ID[id];
    if (!r || !h || r.phase === 'over' || state.mode === 'timeattack') return;
    const used = r.used[id] || 0;
    if (used >= (h.max || 1)) return;
    const t = r.team;

    if (h.group === 'team') {
      r.teamClues.add(h.clue);
      const legend = { shirt: '#9', age: '24 yrs', caps: '58 caps', goals: '277 gls', flag: 'flag', prev: 'ex-Ajax' }[h.clue];
      r.hintLog.push(`👕 ${h.label} now shown on every shirt${h.clue === 'flag' ? '' : ` (e.g. “${legend}”)`}`);
    } else {
      switch (id) {
        case 'name': {
          const i = nextPlayerToReveal(r);
          if (i < 0) return;
          r.revealedNames.add(i);
          r.hintLog.push(`👤 ${t.players[i].position}: ${t.players[i].name}`);
          break;
        }
        case 'manager': r.hintLog.push(`🧠 Manager: ${t.manager}`); break;
        case 'stage': r.hintLog.push(`🏟️ ${t.competitionStage}: ${t.result}`); break;
        case 'decade': r.hintLog.push(`📅 Match played in the ${decadeOf(t)}s`); break;
        case 'kit':
          if (DIFFICULTY[r.difficulty].kit) return;
          r.hintLog.push('🎽 Kit colours revealed on the shirts');
          break;
        default: return;
      }
    }
    r.used[id] = used + 1;
    Sound.play('hint');
    renderPitch({ noAnim: true });
    renderHints();
    setFeedback(`Hint used (−${h.cost} pts).`, 'warn');
  }

  /** How good the season guess was, with a message that says so plainly. */
  function seasonVerdict(r) {
    const actual = r.team.season;
    if (r.seasonDiff === 99 || r.seasonGuess === null) {
      return { tier: 'wrong', short: 'Right club — season skipped', text: `✅ Right club, but no season given. It was ${actual}.` };
    }
    const guess = seasonLabel(r.seasonGuess);
    const off = plural(r.seasonDiff, 'season');
    if (r.seasonDiff === 0) return { tier: 'exact', short: 'Perfect call! 🏆', text: `🏆 Perfect — right club AND right season (${actual})!` };
    if (r.seasonDiff <= 2) return { tier: 'close', short: `Right club — close, ${off} off`, text: `🟨 Right club, close on the season: you said ${guess}, it was ${actual} (${off} off).` };
    return { tier: 'wrong', short: `Right club — wrong season (${off} off)`, text: `❌ Wrong season: you said ${guess}, it was ${actual} (${off} off). Club was right.` };
  }

  function endRound(won) {
    const r = state.round;
    if (!r || r.phase === 'over') return;
    r.phase = 'over';
    r.won = won;
    const base = won ? SCORING.club + seasonPoints(r.seasonDiff) : 0;
    r.mult = (DIFFICULTY[r.difficulty] || DIFFICULTY.medium).mult;
    r.rating = teamRating(r.team);
    r.teamMult = TEAM_RATING[r.rating].mult;
    r.points = won ? Math.round(Math.max(0, base - hintCost(r) - wrongCount(r) * SCORING.wrongGuess) * r.mult * r.teamMult) : 0;

    // ── stats ──
    // A round only counts as a WIN (streak, win %, team discovered) when the club is right
    // AND the season is Perfect or Close (within 2 seasons). A wrong or skipped season still
    // keeps its points, but resets the streak.
    const tier = won ? seasonVerdict(r).tier : null;
    r.success = tier === 'exact' || tier === 'close';
    const st = store.stats;
    st.played++;
    st.hints += hintCount(r);
    st.points += r.points;
    if (r.success) {
      st.wins++;
      if (!store.discovered.includes(r.team.id)) store.discovered.push(r.team.id);
    }
    st.streak = r.success ? st.streak + 1 : 0;
    st.bestStreak = Math.max(st.bestStreak, st.streak);
    state.session.score += r.points;
    state.session.rounds++;
    saveStore();

    // ── presentation: celebrate only what was actually right ──
    if (won) {
      const verdict = seasonVerdict(r);
      if (verdict.tier === 'exact') { Sound.play('perfect'); Confetti.burst(220); }
      else if (verdict.tier === 'close') { Sound.play('clubRight'); Confetti.burst(60); }
      else Sound.play('wrong');
      setFeedback(verdict.text, verdict.tier === 'exact' ? 'good' : verdict.tier === 'close' ? 'warn' : 'bad');
    } else {
      Sound.play('lose');
      setFeedback(`Full time. It was ${r.team.club}, ${r.team.season}.`, 'bad');
    }
    renderPitch({ noAnim: true });
    flipAll();
    renderStatus();
    renderSteps();
    renderReveal();
  }

  // ===========================================================================
  // 15. Reveal / result panel
  // ===========================================================================

  function renderReveal() {
    const r = state.round;
    const t = r.team;
    const box = els.reveal;
    box.innerHTML = '';
    const wrong = wrongCount(r);

    const sv = r.won ? seasonVerdict(r) : null;
    const verdict = r.won ? sv.short : 'Not this time';
    const verdictCls = !r.won ? 'bad' : sv.tier === 'exact' ? 'good' : sv.tier === 'close' ? 'warn' : 'bad';

    box.append(el('div', { class: 'reveal-head' }, [
      shirtSVG(teamKit(t), 'reveal-kit'),
      el('div', {}, [
        el('h2', { class: 'reveal-title' }, [`${t.club} `, el('span', { class: 'reveal-season', text: t.season })]),
        el('p', { class: `reveal-verdict ${verdictCls}`, text: verdict })
      ])
    ]));

    const facts = el('dl', { class: 'reveal-facts' });
    const addFact = (k, v) => facts.append(el('dt', { text: k }), el('dd', {}, [v]));
    addFact('Stage', t.competitionStage);
    addFact('Result', t.result);
    addFact('Manager', t.manager);
    addFact('Formation', t.formation === 'WM' ? 'WM (3-2-2-3)' : t.formation);
    addFact('Team rating', el('span', { class: `badge ${teamRating(t)}`, text: `${TEAM_RATING[teamRating(t)].label} ×${TEAM_RATING[teamRating(t)].mult}` }));
    box.append(facts);

    const bd = el('ul', { class: 'breakdown', 'aria-label': 'Points breakdown' });
    const line = (k, v, cls) => bd.append(el('li', { class: cls || '' }, [el('span', { text: k }), el('span', { text: v })]));
    if (r.won) {
      line('Correct club', `+${SCORING.club}`);
      line(r.seasonDiff === 99 ? 'Season (skipped)' : r.seasonDiff === 0 ? `Exact season (${t.season})`
        : `Season: you said ${seasonLabel(r.seasonGuess)} (${plural(r.seasonDiff, 'season')} off)`, `+${seasonPoints(r.seasonDiff)}`);
      if (wrong) line(`Wrong guesses ×${wrong}`, `−${wrong * SCORING.wrongGuess}`);
      if (hintCount(r)) line(`Hints ×${hintCount(r)}`, `−${hintCost(r)}`);
    } else {
      line('Club not found', '0');
    }
    if (r.won) line(`${DIFFICULTY[r.difficulty].label} clues multiplier`, `×${r.mult}`);
    if (r.won) line(`${TEAM_RATING[r.rating].label} team rating multiplier`, `×${r.teamMult}`);
    line('Round total', `${r.points} pts`, 'total');
    box.append(bd);

    box.append(el('p', { class: 'muted small', text: `Tap any shirt for the player's profile · Teams discovered: ${store.discovered.length} / ${TEAMS.length}` }));

    const actions = el('div', { class: 'round-actions' }, [
      el('button', { class: 'btn btn-primary', type: 'button', id: 'btn-next', text: 'Next team ➜', onclick: nextClassic })
    ]);
    box.append(actions);
    box.hidden = false;

    // Bring the result into view on phones and move focus for keyboard users.
    setTimeout(() => {
      const target = $('btn-next');
      if (target) target.focus({ preventScroll: true });
      if (window.innerWidth < 900) box.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    }, reducedMotion ? 0 : 1300);
  }

  // ===========================================================================
  // 16. Modes
  // ===========================================================================

  function nextClassic() {
    if (!TEAMS.length) return;
    const team = pickFresh(poolTeams(), state.session.seen);
    startRound(team, { mode: 'classic', difficulty: store.settings.difficulty });
    Sound.play('whistle');
    els.clubInput.focus({ preventScroll: true });
  }

  // ── Time Attack ──
  function showTAIntro() {
    const p = els.taPanel;
    p.innerHTML = '';
    p.append(
      el('h2', { class: 'panel-title', text: '⏱️ Time Attack' }),
      el('p', { text: `${TIME_ATTACK_SECONDS} seconds on the clock. Name the club — no season needed. One guess per team; skip if you're stuck.` }),
      el('p', { class: 'muted', text: `Era filter: ${decadeSummary()} · Personal best: ${store.timeAttack.best}` }),
      el('button', { class: 'btn btn-primary', type: 'button', id: 'btn-ta-start', text: 'Start the clock ▶', onclick: taStart })
    );
    p.hidden = false;
    els.overlay.hidden = false;
    els.overlay.textContent = 'Ready?';
    setTimeout(() => { const b = $('btn-ta-start'); if (b) b.focus({ preventScroll: true }); }, 50);
  }

  function taStart() {
    const ta = state.ta;
    clearInterval(ta.timer);
    Object.assign(ta, { active: true, finished: false, timeLeft: TIME_ATTACK_SECONDS, score: 0, answered: 0, log: [] });
    ta.seen.clear();
    els.taPanel.hidden = true;
    Sound.play('whistle');
    taNext();
    ta.timer = setInterval(taTick, 1000);
  }

  function taTick() {
    const ta = state.ta;
    ta.timeLeft--;
    if (ta.timeLeft <= 10 && ta.timeLeft > 0) Sound.play('tick');
    renderStatus();
    if (ta.timeLeft <= 0) taEnd();
  }

  function taNext() {
    if (!state.ta.active) return;
    const team = pickFresh(poolTeams(), state.ta.seen);
    startRound(team, { mode: 'timeattack', difficulty: 'medium' });
    els.clubInput.focus({ preventScroll: true });
  }

  function taAnswer(correct, club) {
    const ta = state.ta;
    const r = state.round;
    if (!ta.active || !r || r.phase === 'over') return;
    r.phase = 'over';
    ta.answered++;
    ta.log.push({ team: r.team, correct, skipped: !club });
    if (correct) {
      ta.score++;
      Sound.play('clubRight');
      Confetti.burst(50);
      setFeedback(`✅ ${r.team.club} (${r.team.season})`, 'good');
    } else {
      Sound.play(club ? 'wrong' : 'click');
      shake(els.pitch);
      setFeedback(`${club ? '❌' : '⏭'} It was ${r.team.club} (${r.team.season})`, 'bad');
    }
    renderStatus();
    renderSteps();
    setTimeout(taNext, 750);
  }

  function taEnd() {
    const ta = state.ta;
    clearInterval(ta.timer);
    ta.active = false;
    ta.finished = true;
    ta.timeLeft = 0;
    const isBest = ta.score > store.timeAttack.best;
    ta.newBest = isBest && ta.score > 0;
    store.timeAttack.best = Math.max(store.timeAttack.best, ta.score);
    store.timeAttack.plays++;
    ta.log.filter(x => x.correct).forEach(x => { if (!store.discovered.includes(x.team.id)) store.discovered.push(x.team.id); });
    saveStore();
    if (state.round) state.round.phase = 'over';
    Sound.play(ta.score ? 'win' : 'lose');
    if (isBest && ta.score) Confetti.burst(200);

    els.players.innerHTML = '';
    hideTip();
    els.formationTag.textContent = '';
    els.overlay.hidden = false;
    els.overlay.textContent = 'Full time!';
    renderStatus();
    renderSteps();

    const p = els.taPanel;
    p.innerHTML = '';
    const list = el('ul', { class: 'breakdown', 'aria-label': 'Teams in this run' });
    ta.log.forEach(x => list.append(el('li', {}, [el('span', { text: `${x.correct ? '✅' : '❌'} ${x.team.club}` }), el('span', { text: x.team.season })])));
    p.append(
      el('h2', { class: 'panel-title', text: '⏱️ Time Attack — full time' }),
      el('p', { class: 'ta-big', text: String(ta.score) }),
      el('p', { text: `${plural(ta.score, 'correct club')} from ${plural(ta.answered, 'team')}${isBest && ta.score ? ' — new personal best! 🏆' : ''}` }),
      el('p', { class: 'muted', text: `Personal best: ${store.timeAttack.best}` }),
      ta.log.length ? list : null,
      el('div', { class: 'round-actions center' }, [
        el('button', { class: 'btn btn-ghost', type: 'button', id: 'btn-ta-share', text: 'Share result 📤', onclick: openTAShare }),
        el('button', { class: 'btn btn-primary', type: 'button', id: 'btn-ta-again', text: 'Play again ▶', onclick: taStart })
      ])
    );
    p.hidden = false;
    setTimeout(() => { const b = $('btn-ta-again'); if (b) b.focus({ preventScroll: true }); }, 50);
  }

  // ===========================================================================
  // Sharing: spoiler-free result text + generated image card + link to the game
  // ===========================================================================

  /**
   * Link to the game: always the address it is running from (GitHub Pages, Netlify,
   * a custom domain…), so it adjusts automatically wherever you deploy. A local
   * file:// copy has no shareable address, so it shares without a link.
   */
  function shareUrl() {
    if (!/^https?:$/.test(location.protocol)) return '';
    return `${location.origin}${location.pathname.replace(/index\.html$/, '')}`;
  }

  const COLORS = { right: '#3ddc84', wrong: '#3a4459', bad: '#ff5d73', skip: '#7a869e' };

  /** The only text that is shared — every stat lives on the image card. */
  const challengeText = url => (url ? `Can you beat me? ${url}` : 'Can you beat me?');

  /** Everything the share popup, text and image need for a Time Attack run. */
  function taShare() {
    const ta = state.ta;
    const skipped = ta.log.filter(x => x.skipped).length;
    const wrong = ta.answered - ta.score - skipped;
    const accuracy = ta.answered ? Math.round((ta.score / ta.answered) * 100) : 0;
    const pace = ta.score ? (TIME_ATTACK_SECONDS / ta.score).toFixed(1) : '—';
    const url = shareUrl();
    const text = challengeText(url);
    return {
      title: 'Share your run',
      fileName: 'starting-xi-time-attack.png',
      text,
      url,
      card: {
        label: '⏱  TIME ATTACK',
        banner: ta.newBest ? 'NEW PERSONAL BEST' : '',
        big: String(ta.score),
        sub: `${ta.score === 1 ? 'club' : 'clubs'} named in ${TIME_ATTACK_SECONDS} seconds`,
        dots: ta.log.map(m => m.correct ? { fill: COLORS.right, mark: '✓' } : m.skipped ? { fill: COLORS.skip, mark: '›' } : { fill: COLORS.bad, mark: '✕' }),
        empty: 'No teams this run'
      },
      tiles: [
        { k: 'Correct', v: String(ta.score), tone: 'good' },
        { k: 'Accuracy', v: `${accuracy}%` },
        { k: 'Per club', v: ta.score ? `${pace}s` : '—' },
        { k: 'Wrong', v: String(wrong), tone: wrong ? 'bad' : '' },
        { k: 'Skipped', v: String(skipped) },
        { k: 'Best', v: String(store.timeAttack.best), tone: ta.newBest ? 'gold' : '' }
      ]
    };
  }

  /** Overall record from the Statistics window. */
  function statsShare() {
    const st = store.stats;
    const found = store.discovered.filter(id => TEAMS.some(t => t.id === id)).length;
    const url = shareUrl();
    return {
      title: 'Share your stats',
      fileName: 'starting-xi-stats.png',
      text: challengeText(url),
      url,
      card: {
        label: '📊  MY STATS',
        banner: found === TEAMS.length ? 'EVERY TEAM FOUND' : '',
        big: String(found),
        sub: `of ${TEAMS.length} legendary teams discovered`,
        progress: TEAMS.length ? found / TEAMS.length : 0,
        dots: [],
        empty: ''
      },
      // Only achievements are shown (no games played / win % that could look bad).
      tiles: [
        { k: 'Best streak', v: `${st.bestStreak}🔥`, tone: st.bestStreak > 2 ? 'gold' : '' },
        { k: 'Total points', v: String(st.points), tone: 'good' },
        { k: 'Time Attack best', v: String(store.timeAttack.best) }
      ]
    };
  }

  /** Draws a 1080×1350 result card (stadium-at-night style) and resolves with a PNG blob. */
  function makeShareImage(share) {
    const spec = share.card;
    const W = 1080, H = 1350;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    if (!g.roundRect) g.roundRect = (x, y, w, h) => g.rect(x, y, w, h);   // older browsers
    const display = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
    const body = 'system-ui, "Segoe UI", Roboto, Arial, sans-serif';
    const tone = { good: '#3ddc84', bad: '#ff5d73', warn: '#ffb547', gold: '#ffd166' };

    // Night sky + floodlight glows
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0d1630'); sky.addColorStop(1, '#05080f');
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    [[90, 40], [W - 90, 40]].forEach(([x, y]) => {
      const glow = g.createRadialGradient(x, y, 10, x, y, 520);
      glow.addColorStop(0, 'rgba(255,240,190,.35)'); glow.addColorStop(1, 'rgba(255,240,190,0)');
      g.fillStyle = glow; g.fillRect(0, 0, W, H);
    });

    // Logo: arc of eleven stars + wordmark
    const star = (cx, cy, r, color) => {
      g.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = (Math.PI / 5) * k - Math.PI / 2, rad = k % 2 ? r * 0.45 : r;
        g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
      }
      g.closePath(); g.fillStyle = color; g.fill();
    };
    for (let i = 0; i < 11; i++) {
      const a = (-90 - 22 + (44 / 10) * i) * Math.PI / 180;
      star(W / 2 + Math.cos(a) * 640, 705 + Math.sin(a) * 640, i === 5 ? 18 : 12, '#ffd166');
    }
    g.textAlign = 'center';
    g.fillStyle = '#ffffff'; g.font = `110px ${display}`;
    g.fillText('STARTING XI', W / 2, 215);
    g.fillStyle = '#7cc8ff'; g.font = `700 28px ${body}`;
    g.fillText('E U R O P E A N   N I G H T S   E D I T I O N', W / 2, 262);

    // Pitch panel with mown stripes and markings
    const px = 70, py = 300, pw = W - 140, ph = 560;
    g.save();
    g.beginPath(); g.roundRect(px, py, pw, ph, 36); g.clip();
    for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? '#2b8436' : '#33963f'; g.fillRect(px, py + i * ph / 10, pw, ph / 10 + 1); }
    const vig = g.createRadialGradient(W / 2, py + ph / 2, 100, W / 2, py + ph / 2, 620);
    vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,.45)');
    g.fillStyle = vig; g.fillRect(px, py, pw, ph);
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 4;
    g.strokeRect(px + 24, py + 24, pw - 48, ph - 48);
    g.beginPath(); g.arc(W / 2, py + ph / 2, 110, 0, Math.PI * 2); g.stroke();
    g.restore();

    // Score block
    g.fillStyle = 'rgba(5,8,15,.74)';
    g.beginPath(); g.roundRect(W / 2 - 340, py + 50, 680, 320, 30); g.fill();
    g.fillStyle = '#ffd166'; g.font = `700 32px ${body}`;
    g.fillText(spec.label, W / 2, py + 105);
    g.font = `190px ${display}`;
    g.fillText(spec.big, W / 2, py + 290);
    g.fillStyle = '#ffffff'; g.font = `600 32px ${body}`;
    g.fillText(spec.sub, W / 2, py + 340);

    // Banner for a perfect round / new best
    if (spec.banner) {
      g.font = `800 30px ${body}`;
      const banner = `★ ${spec.banner} ★`;
      const bw = g.measureText(banner).width + 60;
      const grad = g.createLinearGradient(0, py + 10, 0, py + 60);
      grad.addColorStop(0, '#fff3c4'); grad.addColorStop(1, '#ffb703');
      g.fillStyle = grad;
      g.beginPath(); g.roundRect(W / 2 - bw / 2, py + 22, bw, 50, 25); g.fill();
      g.fillStyle = '#1a1406';
      g.fillText(banner, W / 2, py + 58);
    }

    // Result dots (one per team in Time Attack, one per guess in Classic)
    const marks = spec.dots.slice(0, 24);
    const size = 44, gap = 14, perRow = 12;
    marks.forEach((m, i) => {
      const row = Math.floor(i / perRow), inRow = Math.min(perRow, marks.length - row * perRow);
      const x0 = W / 2 - (inRow * size + (inRow - 1) * gap) / 2;
      const x = x0 + (i % perRow) * (size + gap) + size / 2, y = py + 430 + row * (size + gap);
      g.beginPath(); g.arc(x, y, size / 2, 0, Math.PI * 2);
      g.fillStyle = m.fill; g.fill();
      g.fillStyle = m.fill === COLORS.wrong ? '#ffffff' : '#0b1222'; g.font = `800 26px ${body}`;
      g.fillText(m.mark, x, y + 9);
    });
    if (!marks.length && spec.empty) { g.fillStyle = '#ffffff'; g.font = `600 30px ${body}`; g.fillText(spec.empty, W / 2, py + 440); }

    // Progress bar (stats card): share of all teams discovered
    if (typeof spec.progress === 'number') {
      const bx = W / 2 - 300, by = py + 410, bw = 600, bh = 34;
      g.fillStyle = 'rgba(5,8,15,.6)';
      g.beginPath(); g.roundRect(bx, by, bw, bh, bh / 2); g.fill();
      const fillW = Math.max(bh, bw * Math.min(1, spec.progress));
      const pg = g.createLinearGradient(bx, 0, bx + bw, 0);
      pg.addColorStop(0, '#3ddc84'); pg.addColorStop(1, '#ffd166');
      g.fillStyle = pg;
      g.beginPath(); g.roundRect(bx, by, spec.progress > 0 ? fillW : 0, bh, bh / 2); g.fill();
      g.fillStyle = '#ffffff'; g.font = `800 24px ${body}`;
      g.fillText(`${Math.round(spec.progress * 100)}% complete`, W / 2, by + bh + 36);
    }

    // Stat tiles: 3 × 2 for six tiles, 2 × 2 for four
    const cols = share.tiles.length === 4 ? 2 : 3;
    const tg = 20, tw = (W - 140 - tg * (cols - 1)) / cols, th = 104, tx0 = 70, ty0 = py + ph + 30;
    share.tiles.slice(0, 6).forEach((t, i) => {
      const x = tx0 + (i % cols) * (tw + tg), y = ty0 + Math.floor(i / cols) * (th + tg);
      g.fillStyle = 'rgba(255,255,255,.06)';
      g.beginPath(); g.roundRect(x, y, tw, th, 18); g.fill();
      g.strokeStyle = 'rgba(140,170,255,.22)'; g.lineWidth = 2; g.stroke();
      g.fillStyle = tone[t.tone] || '#ffffff'; g.font = `54px ${display}`;
      g.fillText(t.v, x + tw / 2, y + 60);
      g.fillStyle = 'rgba(255,255,255,.6)'; g.font = `700 20px ${body}`;
      g.fillText(t.k.toUpperCase(), x + tw / 2, y + 90);
    });

    // Footer: challenge + link
    g.fillStyle = '#ffffff'; g.font = `54px ${display}`;
    g.fillText('CAN YOU BEAT ME?', W / 2, 1185);
    g.fillStyle = '#ffd166'; g.font = `700 34px ${body}`;
    g.fillText(share.url ? share.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'Play Starting XI – European Nights', W / 2, 1240);
    g.fillStyle = 'rgba(255,255,255,.45)'; g.font = `500 22px ${body}`;
    g.fillText('Fan-made trivia game · not affiliated with UEFA or any club', W / 2, 1305);

    return new Promise(resolve => c.toBlob(b => resolve(b), 'image/png'));
  }

  let shareImage = { blob: null, url: null };

  const openTAShare = () => openShare(taShare());
  const openStatsShare = () => { closeModal($('modal-stats')); openShare(statsShare()); };

  /** Saves the card as a PNG (works in every browser). */
  function downloadImage(share) {
    if (!shareImage.url) return false;
    const a = el('a', { href: shareImage.url, download: share.fileName });
    document.body.append(a); a.click(); a.remove();
    return true;
  }

  /**
   * Puts the card image AND the challenge line on the clipboard, so pasting into a chat sends both.
   * Returns 'both', 'image' (browser only allowed the picture) or '' (clipboard images unsupported).
   */
  async function copyImageAndLink(share) {
    if (!shareImage.blob || !navigator.clipboard || !window.ClipboardItem || !window.isSecureContext) return '';
    try {
      await navigator.clipboard.write([new ClipboardItem({
        'image/png': shareImage.blob,
        'text/plain': new Blob([share.text], { type: 'text/plain' })
      })]);
      return 'both';
    } catch (e) {
      try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': shareImage.blob })]); return 'image'; } catch (e2) { return ''; }
    }
  }

  async function openShare(share) {
    $('share-title').textContent = share.title;
    $('share-preview').textContent = share.text;

    // Stat chips (the same numbers that are drawn on the card)
    const stats = $('share-stats');
    stats.innerHTML = '';
    stats.classList.toggle('two-col', share.tiles.length === 4);
    share.tiles.forEach(t => stats.append(el('div', { class: `share-stat${t.tone ? ' ' + t.tone : ''}` }, [
      el('span', { class: 'v', text: t.v }), el('span', { class: 'k', text: t.k })
    ])));

    // Image (generated after the popup opens so it appears instantly)
    const img = $('share-image');
    const fig = img.closest('.share-figure');
    const shareBtn = $('btn-share-native');
    const saveBtn = $('btn-share-download');
    if (shareImage.url) URL.revokeObjectURL(shareImage.url);
    shareImage = { blob: null, url: null };
    img.removeAttribute('src');
    fig.classList.add('loading');
    shareBtn.disabled = saveBtn.disabled = true;
    openModal('modal-share');

    try {
      shareImage.blob = await makeShareImage(share);
      shareImage.url = URL.createObjectURL(shareImage.blob);
      img.src = shareImage.url;
    } catch (e) { /* handled below: without a picture there is nothing to share */ }
    fig.classList.remove('loading');
    shareBtn.disabled = saveBtn.disabled = !shareImage.blob;

    // Every share sends the image together with "Can you beat me? <link>".
    const file = shareImage.blob ? new File([shareImage.blob], share.fileName, { type: 'image/png' }) : null;
    const canShareFile = !!(file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] }));
    shareBtn.textContent = canShareFile ? 'Share image 📤' : 'Copy image & link 📋';
    $('share-how').textContent = canShareFile
      ? 'Opens your share menu with the image and the link.'
      : 'Copies the image and the link — paste them into any chat.';

    shareBtn.onclick = async () => {
      if (canShareFile) {
        try { await navigator.share({ files: [file], text: share.text }); return; }
        catch (err) { if (err && err.name === 'AbortError') return; /* otherwise fall back to the clipboard */ }
      }
      const copied = await copyImageAndLink(share);
      if (copied === 'both') { toast('Image and link copied — paste them into any chat!'); return; }
      if (copied === 'image') { toast('Image copied! Paste it, then paste the link from the box below.'); return; }
      // Last resort: save the picture and copy the link.
      downloadImage(share);
      copyText(share.text, 'Image saved and link copied — attach the image and paste the link!',
        'Image saved! Attach it and add the link shown above.');
    };
    saveBtn.onclick = () => { if (downloadImage(share)) toast('Image saved — post it anywhere!'); };

    // Per-app buttons. A website can't attach an image through a WhatsApp/X/Facebook link, so:
    //  • phones: the system share menu carries the image (the player then picks the app);
    //  • computers: the image goes on the clipboard, the app opens with the text ready, and Ctrl+V attaches it.
    const apps = $('share-apps');
    apps.innerHTML = '';
    SHARE_APPS.forEach(app => {
      const btn = el('button', { type: 'button', class: `share-app share-app-${app.id}`, 'aria-label': `Share on ${app.name}` }, [
        el('span', { class: 'share-app-icon', 'aria-hidden': 'true', text: app.icon }), el('span', { text: app.name })
      ]);
      btn.disabled = !shareImage.blob;
      btn.addEventListener('click', () => shareToApp(app, share, file, canShareFile));
      apps.append(btn);
    });
  }

  const SHARE_APPS = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', copyText: false, open: s => `https://wa.me/?text=${encodeURIComponent(s.text)}` },
    { id: 'x', name: 'X', icon: '𝕏', copyText: false, open: s => `https://twitter.com/intent/tweet?text=${encodeURIComponent(s.text)}` },
    // Facebook doesn't accept pre-filled text, so the link goes on the clipboard with the image.
    { id: 'facebook', name: 'Facebook', icon: 'f', copyText: true, open: () => 'https://www.facebook.com/' }
  ];

  const isPhone = () => !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const pasteKey = () => (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘V' : 'Ctrl+V');

  async function shareToApp(app, share, file, canShareFile) {
    // Phones: the share menu is the only way to hand an image to another app.
    if (canShareFile && isPhone()) {
      try { await navigator.share({ files: [file], text: share.text }); }
      catch (err) { if (!err || err.name !== 'AbortError') toast(`Couldn't open the share menu — use Save image, then post it on ${app.name}.`, 6000); }
      return;
    }
    // Computers: copy the image (plus the link for Facebook), then open the app.
    let copied = false;
    if (shareImage.blob && navigator.clipboard && window.ClipboardItem && window.isSecureContext) {
      try {
        const parts = { 'image/png': shareImage.blob };
        if (app.copyText) parts['text/plain'] = new Blob([share.text], { type: 'text/plain' });
        await navigator.clipboard.write([new ClipboardItem(parts)]);
        copied = true;
      } catch (e) { copied = false; }
    }
    if (!copied) downloadImage(share);
    window.open(app.open(share), '_blank', 'noopener,noreferrer');
    const where = app.id === 'facebook' ? 'in "Create post"' : app.id === 'x' ? 'in the post box' : 'in the chat';
    toast(copied
      ? `Image copied — press ${pasteKey()} ${where} on ${app.name} to attach it.`
      : `Image saved to your downloads — attach it ${where} on ${app.name}.`, 7000);
  }

  function copyText(text, message, failMessage) {
    const done = () => toast(message || 'Copied — paste it anywhere!');
    const fallback = () => {
      const area = el('textarea', { style: 'position:fixed;opacity:0;left:-9999px' });
      area.value = text;
      document.body.append(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      area.remove();
      if (ok) done(); else toast(failMessage || 'Copy failed — please copy it manually.');
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  function setMode(mode) {
    if (!['classic', 'timeattack'].includes(mode)) mode = 'classic';
    // Leaving a running time attack ends it without saving.
    if (state.ta.active && mode !== 'timeattack') { clearInterval(state.ta.timer); state.ta.active = false; }
    state.mode = mode;
    document.querySelectorAll('.mode-tab').forEach(t => {
      const sel = t.dataset.mode === mode;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
    });
    els.taPanel.hidden = true;
    els.reveal.hidden = true;

    if (mode === 'classic') nextClassic();
    else {
      state.round = null;
      state.ta.finished = false;
      state.ta.timeLeft = TIME_ATTACK_SECONDS;
      renderPitch();
      renderStatus();
      renderSteps();
      setFeedback('');
      showTAIntro();
    }
  }

  // ===========================================================================
  // 17. Modals: help, stats, settings
  // ===========================================================================

  function openModal(id) {
    const d = $(id);
    if (!d) return;
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); }
    else d.setAttribute('open', '');
  }
  function closeModal(d) {
    if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
  }

  function renderStats() {
    const c = $('stats-content');
    c.innerHTML = '';
    const st = store.stats;
    const winPct = st.played ? Math.round((st.wins / st.played) * 100) : 0;
    const avgHints = st.played ? (st.hints / st.played).toFixed(1) : '0.0';
    c.append(el('div', { class: 'stats-grid' }, [
      chip('Played', String(st.played)), chip('Win %', `${winPct}%`), chip('Avg hints', avgHints),
      chip('Streak', String(st.streak)), chip('Best streak', String(st.bestStreak)), chip('TA best', String(store.timeAttack.best))
    ]));
    c.append(el('p', { class: 'muted small', text: `Total points: ${st.points}. Classic rounds count toward played, win % and streaks.` }));

    c.append(el('h3', { class: 'stats-section', text: `Teams discovered (${store.discovered.length} / ${TEAMS.length})` }));
    const grid = el('div', { class: 'collection' });
    TEAMS.slice().sort((a, b) => seasonEndYear(a.season) - seasonEndYear(b.season)).forEach(t => {
      const found = store.discovered.includes(t.id);
      grid.append(el('div', { class: `collection-item${found ? '' : ' locked'}` }, [
        shirtSVG(found ? teamKit(t) : NEUTRAL_KIT, 'mini-kit'),
        el('span', { text: found ? `${t.club} ${t.season}` : `??? · ${decadeOf(t)}s` })
      ]));
    });
    c.append(grid);
  }

  function buildDecadeFilter() {
    const box = $('setting-decades');
    box.innerHTML = '';
    DATA_DECADES.forEach(d => {
      const input = el('input', { type: 'checkbox', value: String(d) });
      input.addEventListener('change', onDecadeChange);
      box.append(el('label', { class: 'decade-pill' }, [input, el('span', { text: `${d}s` })]));
    });
  }

  function onDecadeChange() {
    const checked = [...document.querySelectorAll('#setting-decades input:checked')].map(i => Number(i.value));
    if (!checked.length) {
      // Keep at least one decade selected.
      this.checked = true;
      toast('Keep at least one decade selected.');
      return;
    }
    store.settings.decades = checked;
    state.session.seen.clear();
    saveStore();
    renderStatus();
  }

  function syncSettingsUI() {
    document.querySelectorAll('input[name="difficulty"]').forEach(i => { i.checked = i.value === store.settings.difficulty; });
    $('setting-pool').value = store.settings.pool;
    $('setting-sound').checked = !!store.settings.sound;
    document.querySelectorAll('#setting-decades input').forEach(i => { i.checked = store.settings.decades.includes(Number(i.value)); });
    const btn = $('btn-sound');
    btn.textContent = store.settings.sound ? '🔊' : '🔇';
    btn.setAttribute('aria-pressed', String(!store.settings.sound));
    btn.setAttribute('aria-label', store.settings.sound ? 'Mute sound' : 'Unmute sound');
  }

  // ===========================================================================
  // 18. Toast
  // ===========================================================================

  let toastTimer = null;
  function toast(msg, ms = 2800) {
    const t = els.toast;
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, ms);
  }

  // ===========================================================================
  // 19. Logo stars (original arc-of-eleven design)
  // ===========================================================================

  function drawLogoStars() {
    const g = $('logo-star-arc');
    if (!g) return;
    const n = 11, cx = 110, cy = 120, R = 104;
    for (let i = 0; i < n; i++) {
      const a = (-90 - 42 + (84 / (n - 1)) * i) * Math.PI / 180;
      const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      const r = i === 5 ? 7 : 4.6;
      const pts = [];
      for (let k = 0; k < 10; k++) {
        const ang = (Math.PI / 5) * k - Math.PI / 2;
        const rad = k % 2 ? r * 0.45 : r;
        pts.push(`${(x + Math.cos(ang) * rad).toFixed(2)},${(y + Math.sin(ang) * rad).toFixed(2)}`);
      }
      g.append(svgEl('polygon', { points: pts.join(' ') }));
    }
  }

  // ===========================================================================
  // 20. Wire-up
  // ===========================================================================

  function bindEvents() {
    els.clubForm.addEventListener('submit', e => { e.preventDefault(); submitClub(); });
    els.seasonForm.addEventListener('submit', e => { e.preventDefault(); submitSeason(); });
    $('season-minus').addEventListener('click', () => stepSeason(-1));
    $('season-plus').addEventListener('click', () => stepSeason(1));

    // Mode tabs (with arrow-key navigation per WAI-ARIA tabs pattern)
    const tabs = [...document.querySelectorAll('.mode-tab')];
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => { Sound.play('click'); setMode(tab.dataset.mode); });
      tab.addEventListener('keydown', e => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        next.click();
      });
    });

    $('btn-help').addEventListener('click', () => openModal('modal-help'));
    $('btn-stats').addEventListener('click', () => { renderStats(); openModal('modal-stats'); });
    $('btn-settings').addEventListener('click', () => { syncSettingsUI(); openModal('modal-settings'); });
    $('btn-sound').addEventListener('click', () => {
      store.settings.sound = !store.settings.sound;
      saveStore();
      syncSettingsUI();
      Sound.play('click');
      toast(store.settings.sound ? 'Sound on' : 'Sound off');
    });

    document.querySelectorAll('dialog.modal').forEach(d => {
      d.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closeModal(d)));
      d.addEventListener('click', e => { if (e.target === d) closeModal(d); });
    });
    $('modal-help').addEventListener('close', () => {
      if (!store.seenHelp) { store.seenHelp = true; saveStore(); }
    });

    // Settings
    document.querySelectorAll('input[name="difficulty"]').forEach(i => i.addEventListener('change', () => {
      store.settings.difficulty = i.value;
      saveStore();
      toast(`Clue difficulty: ${cap(i.value)} — applies from the next Classic team.`);
    }));
    $('setting-pool').addEventListener('change', e => {
      store.settings.pool = e.target.value;
      state.session.seen.clear();
      saveStore();
    });
    $('decades-all').addEventListener('click', () => {
      store.settings.decades = DECADES.slice();
      saveStore();
      syncSettingsUI();
      renderStatus();
    });
    $('setting-sound').addEventListener('change', e => {
      store.settings.sound = e.target.checked;
      saveStore();
      syncSettingsUI();
    });
    $('btn-share-stats').addEventListener('click', openStatsShare);
    $('btn-reset-stats').addEventListener('click', () => {
      if (!window.confirm('Reset all statistics and your team collection? Settings are kept.')) return;
      const keep = store.settings;
      store = defaultStore();
      store.settings = keep;
      store.seenHelp = true;
      saveStore();
      renderStats();
      renderStatus();
      toast('Stats reset.');
    });


    // Close the card tooltip on outside click or Escape.
    document.addEventListener('click', e => { if (!e.target.closest('.card-tip')) hideTip(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && tip.index >= 0) {
        const btn = els.players.querySelector(`.card-btn[data-index="${tip.index}"]`);
        hideTip();
        if (btn) btn.focus();
      }
    });

    // "n" = next team in Classic once the round is over.
    document.addEventListener('keydown', e => {
      if (e.target.matches('input, select, textarea') || document.querySelector('dialog[open]')) return;
      if (e.key === 'n' && state.mode === 'classic' && state.round && state.round.phase === 'over') nextClassic();
    });
  }

  function init() {
    drawLogoStars();
    populateSeasons();
    buildHintButtons();
    buildDecadeFilter();
    bindCombo();
    bindEvents();
    setupDock();
    syncSettingsUI();

    if (!TEAMS.length) {
      setFeedback('No valid teams found in data.js.', 'bad');
      return;
    }
    setMode('classic');
    if (!store.seenHelp) openModal('modal-help');

    // Offline support when served over http(s); opening index.html as a file still works without it.
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { /* offline mode is optional */ }));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
