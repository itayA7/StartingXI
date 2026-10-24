#!/usr/bin/env node
/* Checks data.js before publishing: run `node scripts/validate-data.js`.
 * Fails (exit code 1) on anything that would break or weaken a round. */
'use strict';
const path = require('path');
const fs = require('fs');

global.window = {};
require(path.join(__dirname, '..', 'data.js'));
const D = window.STARTING_XI_DATA;
const game = fs.readFileSync(path.join(__dirname, '..', 'game.js'), 'utf8');

const errors = [];
const warn = [];
const flagBlock = game.slice(game.indexOf('const FLAGS = {'), game.indexOf('function make('));
const FLAGS = new Set([...flagBlock.matchAll(/^\s+([A-Z]{2,3}):/gm)].map(m => m[1]));
const POSITIONS = new Set('GK LB RB CB SW LWB RWB CH DM CM AM LM RM LH RH ST CF LW RW OL OR IL IR RF LF SS'.split(' '));
const RATINGS = new Set(['easy', 'medium', 'hard']);
const rows = f => (f === 'WM' ? [3, 2, 2, 3] : String(f).split('-').map(Number));
const ids = new Set();
const clubs = new Set([...D.teams.map(t => t.club), ...D.decoyClubs]);

for (const t of D.teams) {
  const where = `team "${t.id}"`;
  if (ids.has(t.id)) errors.push(`${where}: duplicate id`);
  ids.add(t.id);
  if (!/^\d{4}[–-]\d{2,4}$/.test(t.season)) errors.push(`${where}: season "${t.season}" should look like 1988–89`);
  const r = rows(t.formation);
  if (r.some(n => !Number.isInteger(n) || n < 1) || r.reduce((a, b) => a + b, 0) !== 10) errors.push(`${where}: formation "${t.formation}" must add up to 10 outfield players`);
  if (!RATINGS.has(t.difficulty)) errors.push(`${where}: difficulty must be easy, medium or hard`);
  if (!t.kitColors || !/^#[0-9a-f]{6}$/i.test(t.kitColors.primary || '')) errors.push(`${where}: kitColors.primary must be a #rrggbb colour`);
  if (!D.clubCountries[t.club]) warn.push(`${where}: no clubCountries entry for "${t.club}" (no "right country" hint)`);
  if (!Array.isArray(t.players) || t.players.length !== 11) { errors.push(`${where}: needs exactly 11 players`); continue; }
  if (t.players[0].position !== 'GK') errors.push(`${where}: first player must be the goalkeeper`);
  t.players.forEach((p, i) => {
    const pw = `${where} player ${i + 1} (${p.name})`;
    if (!p.name) errors.push(`${pw}: missing name`);
    if (!POSITIONS.has(p.position)) errors.push(`${pw}: unknown position "${p.position}"`);
    if (!FLAGS.has(p.nationality)) warn.push(`${pw}: no drawn flag for "${p.nationality}" (shows a code badge)`);
    if (!(p.age >= 15 && p.age <= 45)) errors.push(`${pw}: age ${p.age} looks wrong`);
    for (const k of ['shirtNumber', 'careerGoals', 'careerAssists', 'caps']) {
      if (p[k] !== null && !(Number.isInteger(p[k]) && p[k] >= 0)) errors.push(`${pw}: ${k} must be a whole number or null`);
    }
  });
}
for (const [alias, club] of Object.entries(D.clubAliases)) if (!clubs.has(club)) errors.push(`alias "${alias}" points to unknown club "${club}"`);
for (const c of D.decoyClubs) if (D.teams.some(t => t.club === c)) errors.push(`decoy "${c}" is also a real answer — remove it from decoyClubs`);
for (const c of D.famousClubs) if (!D.teams.some(t => t.club === c)) warn.push(`famous club "${c}" has no teams`);

warn.forEach(w => console.warn('warning:', w));
if (errors.length) {
  errors.forEach(e => console.error('error:', e));
  console.error(`\n✗ ${errors.length} problem(s) in data.js`);
  process.exit(1);
}
console.log(`✓ data.js OK — ${D.teams.length} teams, ${D.teams.length * 11} players, ${clubs.size} clubs in the guess list`);
