/* =============================================================================
 * Starting XI – European Nights Edition — DATASET
 * -----------------------------------------------------------------------------
 * ⚠️  DATA ACCURACY NOTICE — PLEASE DOUBLE-CHECK BEFORE PUBLISHING  ⚠️
 * Line-ups and results were compiled from memory of widely reported match
 * reports. Player statistics are APPROXIMATE:
 *   • age          — age on the day of the match (computed from birth dates).
 *   • shirtNumber  — number worn in that match. For several pre-2000 finals
 *                    (Ajax 1971/72, Bayern 1976, Hamburg 1983, Steaua 1986,
 *                    Barcelona 1992, Marseille 1993, Milan 1994, Monaco 2004)
 *                    some numbers are ESTIMATED from the era's 1–11 convention.
 *   • careerGoals  — senior CLUB goals, all competitions. For the 109 players
 *                    still active in October 2026 this (and caps) was refreshed
 *                    from each player's English Wikipedia career-statistics
 *                    table on 23 Oct 2026; for retired players it is approximate.
 *   • careerAssists— approximate. Assists were not tracked reliably before the
 *                    late 2000s, so for older careers these are ROUGH ESTIMATES
 *                    based on the player's role and reputation.
 *   • caps         — senior international caps (current to Oct 2026 for active
 *                    players, see above). careerAssists were NOT refreshed:
 *                    Wikipedia does not list them, so they remain estimates.
 *   • previousClub — club the player joined from ("Youth academy" = home-grown).
 * Every player has every field filled in. A field may still be set to null
 * when adding new teams: the game simply never uses a null field as a clue.
 * Verify against a reliable source (e.g. club archives, RSSSF, Transfermarkt)
 * before treating any number as fact.
 *
 * HOW TO ADD A TEAM
 *   1. Copy any entry below and give it a unique `id`.
 *   2. `formation` must be one of: "4-4-2", "4-3-3", "4-2-3-1", "3-5-2",
 *      "4-3-1-2", "4-4-1-1", "4-2-4", "3-2-4-1", "3-4-2-1", "4-3-2-1", "2-3-5", "WM"
 *      (any hyphenated formation whose numbers add up to 10 also works).
 *   3. List exactly 11 players: goalkeeper FIRST, then each line from defence
 *      to attack, and within each line from LEFT to RIGHT (left-back first).
 *   3b. competitionStage: 'Final', 'Final (runners-up)' or 'Semi-final' — this drives
 *      the Winners / Runner-ups team filters (semi-finalists are in neither).
 *   4. kitColors.pattern: "plain" | "stripes" | "hoops" | "band" | "halves" | "diagonal".
 *   5. nationality: ISO 3166 alpha-2 code ("NL", "BR"…) or "ENG", "SCO",
 *      "WAL", "NIR" for the UK home nations. Flags are drawn by game.js (FLAGS);
 *      an unknown code still works and is shown as a plain code badge.
 *   6. Every player must have at least one usable clue (nationality and age
 *      are always present in this dataset, so this is guaranteed).
 * Nothing in game.js needs to change.
 * ========================================================================== */

(function () {
  'use strict';

  const YOUTH = 'Youth academy';

  /** Compact player factory — keeps the dataset readable. */
  function P(name, position, nationality, age, shirtNumber, careerGoals, careerAssists, caps, previousClub) {
    return { name, position, nationality, age, shirtNumber, careerGoals, careerAssists, caps, previousClub };
  }

  const teams = [
    // ───────────────────────────── 1950s–1960s ─────────────────────────────
    {
      id: 'real-madrid-1960',
      club: 'Real Madrid',
      season: '1959–60',
      competitionStage: 'Final',
      result: 'Won 7–3 vs Eintracht Frankfurt',
      formation: '2-3-5',
      manager: 'Miguel Muñoz',
      kitColors: { primary: '#f4f4f4', secondary: '#2b2f6b', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Rogelio Domínguez', 'GK', 'AR', 29, 1, 0, 0, 58, 'Racing Club'),
        P('Pachín', 'LB', 'ES', 21, 3, 3, 5, 8, 'Osasuna'),
        P('Marquitos', 'RB', 'ES', 27, 2, 10, 5, 2, 'Racing Santander'),
        P('José María Zárraga', 'LH', 'ES', 29, 6, 25, 20, 8, YOUTH),
        P('José Santamaría', 'CH', 'UY', 30, 5, 2, 5, 36, 'Nacional'),
        P('José María Vidal', 'RH', 'ES', 24, 4, 5, 10, 0, YOUTH),
        P('Francisco Gento', 'OL', 'ES', 26, 11, 180, 250, 43, 'Racing Santander'),
        P('Ferenc Puskás', 'IL', 'HU', 33, 10, 620, 150, 89, 'Honvéd'),
        P('Alfredo Di Stéfano', 'CF', 'AR', 33, 9, 500, 250, 37, 'Millonarios'),
        P('Luis del Sol', 'IR', 'ES', 25, 8, 120, 80, 16, 'Real Betis'),
        P('Canário', 'OR', 'BR', 24, 7, 100, 60, 7, 'América-RJ')
      ]
    },
    {
      id: 'benfica-1962',
      club: 'Benfica',
      season: '1961–62',
      competitionStage: 'Final',
      result: 'Won 5–3 vs Real Madrid',
      formation: 'WM',
      manager: 'Béla Guttmann',
      kitColors: { primary: '#d0021b', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Costa Pereira', 'GK', 'PT', 33, 1, 0, 0, 22, 'Ferroviário de Lourenço Marques'),
        P('Ângelo Martins', 'LB', 'PT', 32, 3, 5, 10, 20, YOUTH),
        P('Germano', 'CB', 'PT', 29, 5, 10, 5, 24, 'Atlético CP'),
        P('Mário João', 'RB', 'PT', 26, 2, 2, 5, 3, YOUTH),
        P('Fernando Cruz', 'LH', 'PT', 21, 6, 5, 10, 10, YOUTH),
        P('Domiciano Cavém', 'RH', 'PT', 29, 4, 80, 40, 18, 'Sporting da Covilhã'),
        P('Mário Coluna', 'IL', 'PT', 26, 10, 150, 150, 57, 'Desportivo de Lourenço Marques'),
        P('Eusébio', 'IR', 'PT', 20, 8, 620, 120, 64, 'Sporting de Lourenço Marques'),
        P('António Simões', 'OL', 'PT', 18, 11, 100, 120, 46, YOUTH),
        P('José Águas', 'CF', 'PT', 31, 9, 380, 60, 25, 'Lusitano de Benguela'),
        P('José Augusto', 'OR', 'PT', 25, 7, 170, 120, 45, 'Barreirense')
      ]
    },
    {
      id: 'inter-1965',
      club: 'Inter',
      season: '1964–65',
      competitionStage: 'Final',
      result: 'Won 1–0 vs Benfica',
      formation: '4-3-3',
      manager: 'Helenio Herrera',
      kitColors: { primary: '#0050a0', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'hard',
      players: [
        P('Giuliano Sarti', 'GK', 'IT', 31, 1, 0, 0, 8, 'Fiorentina'),
        P('Giacinto Facchetti', 'LB', 'IT', 22, 3, 75, 50, 94, YOUTH),
        P('Armando Picchi', 'SW', 'IT', 30, 6, 5, 10, 12, 'SPAL'),
        P('Aristide Guarneri', 'CB', 'IT', 27, 5, 3, 5, 21, 'Como'),
        P('Tarcisio Burgnich', 'RB', 'IT', 26, 2, 6, 15, 66, 'Palermo'),
        P('Gianfranco Bedin', 'CM', 'IT', 19, 4, 10, 20, 4, YOUTH),
        P('Luis Suárez', 'CM', 'ES', 30, 10, 150, 150, 32, 'Barcelona'),
        P('Sandro Mazzola', 'AM', 'IT', 22, 8, 160, 100, 70, YOUTH),
        P('Mario Corso', 'LW', 'IT', 23, 11, 95, 150, 23, YOUTH),
        P('Joaquín Peiró', 'CF', 'ES', 30, 9, 150, 50, 12, 'Torino'),
        P('Jair da Costa', 'RW', 'BR', 24, 7, 90, 80, 1, 'Portuguesa')
      ]
    },
    {
      id: 'celtic-1967',
      club: 'Celtic',
      season: '1966–67',
      competitionStage: 'Final',
      result: 'Won 2–1 vs Inter',
      formation: '4-2-4',
      manager: 'Jock Stein',
      kitColors: { primary: '#0b8a3e', secondary: '#ffffff', pattern: 'hoops' },
      difficulty: 'hard',
      players: [
        P('Ronnie Simpson', 'GK', 'SCO', 36, 1, 0, 0, 5, 'Hibernian'),
        P('Tommy Gemmell', 'LB', 'SCO', 23, 3, 90, 40, 18, 'Coltness United'),
        P('John Clark', 'CB', 'SCO', 26, 6, 3, 5, 4, YOUTH),
        P('Billy McNeill', 'CB', 'SCO', 27, 5, 35, 10, 29, YOUTH),
        P('Jim Craig', 'RB', 'SCO', 24, 2, 6, 15, 1, YOUTH),
        P('Bertie Auld', 'CM', 'SCO', 29, 10, 120, 100, 3, 'Birmingham City'),
        P('Bobby Murdoch', 'CM', 'SCO', 22, 4, 110, 100, 12, YOUTH),
        P('Bobby Lennox', 'LW', 'SCO', 23, 11, 300, 80, 10, YOUTH),
        P('Stevie Chalmers', 'ST', 'SCO', 30, 9, 250, 60, 5, 'Ashfield'),
        P('Willie Wallace', 'ST', 'SCO', 26, 8, 200, 60, 7, 'Heart of Midlothian'),
        P('Jimmy Johnstone', 'RW', 'SCO', 22, 7, 140, 150, 23, YOUTH)
      ]
    },
    {
      id: 'man-united-1968',
      club: 'Manchester United',
      season: '1967–68',
      competitionStage: 'Final',
      result: 'Won 4–1 (a.e.t.) vs Benfica',
      formation: '4-3-3',
      manager: 'Matt Busby',
      kitColors: { primary: '#da291c', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Alex Stepney', 'GK', 'ENG', 25, 1, 2, 0, 1, 'Chelsea'),
        P('Tony Dunne', 'LB', 'IE', 26, 3, 3, 15, 33, 'Shelbourne'),
        P('Nobby Stiles', 'CB', 'ENG', 26, 6, 20, 20, 28, YOUTH),
        P('Bill Foulkes', 'CB', 'ENG', 36, 5, 9, 5, 1, YOUTH),
        P('Shay Brennan', 'RB', 'IE', 31, 2, 6, 15, 19, YOUTH),
        P('David Sadler', 'CM', 'ENG', 22, 10, 30, 20, 4, YOUTH),
        P('Bobby Charlton', 'CM', 'ENG', 30, 9, 270, 150, 106, YOUTH),
        P('Pat Crerand', 'CM', 'SCO', 29, 4, 40, 80, 16, 'Celtic'),
        P('John Aston', 'LW', 'ENG', 20, 11, 30, 40, 0, YOUTH),
        P('Brian Kidd', 'ST', 'ENG', 19, 8, 150, 60, 2, YOUTH),
        P('George Best', 'RW', 'NIR', 22, 7, 250, 150, 37, YOUTH)
      ]
    },

    // ───────────────────────────────── 1970s ─────────────────────────────────
    {
      id: 'feyenoord-1970',
      club: 'Feyenoord',
      season: '1969–70',
      competitionStage: 'Final',
      result: 'Won 2–1 (a.e.t.) vs Celtic',
      formation: '4-3-3',
      manager: 'Ernst Happel',
      kitColors: { primary: '#e2001a', secondary: '#ffffff', pattern: 'halves' },
      difficulty: 'hard',
      players: [
        P('Eddy Pieters Graafland', 'GK', 'NL', 35, 1, 0, 0, 47, 'Ajax'),
        P('Theo van Duivenbode', 'LB', 'NL', 26, 5, 15, 15, 7, 'Ajax'),
        P('Rinus Israel', 'CB', 'NL', 27, 3, 30, 15, 47, 'DWS'),
        P('Theo Laseroms', 'CB', 'NL', 29, 4, 20, 5, 2, 'Sparta Rotterdam'),
        P('Piet Romeijn', 'RB', 'NL', 30, 2, 5, 10, 2, YOUTH),
        P('Wim van Hanegem', 'CM', 'NL', 26, 10, 110, 150, 52, 'Xerxes'),
        P('Wim Jansen', 'CM', 'NL', 23, 6, 40, 50, 65, YOUTH),
        P('Franz Hasil', 'CM', 'AT', 25, 8, 70, 50, 21, 'Schalke 04'),
        P('Coen Moulijn', 'LW', 'NL', 32, 11, 90, 120, 38, 'Xerxes'),
        P('Ove Kindvall', 'ST', 'SE', 26, 9, 250, 60, 43, 'IFK Norrköping'),
        P('Henk Wery', 'RW', 'NL', 26, 7, 100, 60, 12, 'DWS')
      ]
    },
    {
      id: 'ajax-1972',
      club: 'Ajax',
      season: '1971–72',
      competitionStage: 'Final',
      result: 'Won 2–0 vs Inter',
      formation: '4-3-3',
      manager: 'Ștefan Kovács',
      kitColors: { primary: '#ffffff', secondary: '#d2122e', pattern: 'band' },
      difficulty: 'medium',
      players: [
        P('Heinz Stuy', 'GK', 'NL', 27, 1, 0, 0, 0, YOUTH),
        P('Ruud Krol', 'LB', 'NL', 23, 5, 40, 50, 83, YOUTH),
        P('Horst Blankenburg', 'CB', 'DE', 24, 4, 15, 10, 0, 'Wiener Sport-Club'),
        P('Barry Hulshoff', 'CB', 'NL', 25, 3, 30, 10, 14, YOUTH),
        P('Wim Suurbier', 'RB', 'NL', 27, 2, 15, 30, 60, YOUTH),
        P('Gerrie Mühren', 'CM', 'NL', 26, 8, 60, 70, 10, 'Volendam'),
        P('Johan Neeskens', 'CM', 'NL', 20, 6, 150, 90, 49, 'RCH'),
        P('Arie Haan', 'CM', 'NL', 23, 10, 120, 60, 35, YOUTH),
        P('Piet Keizer', 'LW', 'NL', 28, 11, 190, 150, 34, YOUTH),
        P('Johan Cruyff', 'CF', 'NL', 25, 14, 400, 250, 48, YOUTH),
        P('Sjaak Swart', 'RW', 'NL', 33, 7, 230, 120, 31, YOUTH)
      ]
    },
    {
      id: 'bayern-1974',
      club: 'Bayern Munich',
      season: '1973–74',
      competitionStage: 'Final (replay)',
      result: 'Won 4–0 vs Atlético Madrid (replay after 1–1)',
      formation: '4-3-3',
      manager: 'Udo Lattek',
      kitColors: { primary: '#dc052d', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Sepp Maier', 'GK', 'DE', 30, 1, 0, 0, 95, YOUTH),
        P('Paul Breitner', 'LB', 'DE', 22, 3, 125, 100, 48, YOUTH),
        P('Franz Beckenbauer', 'SW', 'DE', 28, 5, 110, 150, 103, YOUTH),
        P('Hans-Georg Schwarzenbeck', 'CB', 'DE', 26, 4, 30, 15, 44, YOUTH),
        P('Johnny Hansen', 'RB', 'DK', 30, 2, 20, 20, 8, '1. FC Nürnberg'),
        P('Jupp Kapellmann', 'CM', 'DE', 24, 10, 40, 40, 5, '1. FC Köln'),
        P('Rainer Zobel', 'CM', 'DE', 25, 8, 40, 30, 0, 'Hannover 96'),
        P('Franz Roth', 'CM', 'DE', 28, 6, 90, 40, 4, 'SpVgg Kaufbeuren'),
        P('Uli Hoeneß', 'LW', 'DE', 22, 11, 120, 100, 35, 'TSV Ulm 1846'),
        P('Gerd Müller', 'ST', 'DE', 28, 9, 650, 80, 62, 'TSV 1861 Nördlingen'),
        P('Conny Torstensson', 'RW', 'SE', 24, 7, 80, 40, 40, 'Åtvidabergs FF')
      ]
    },
    {
      id: 'nottingham-forest-1979',
      club: 'Nottingham Forest',
      season: '1978–79',
      competitionStage: 'Final',
      result: 'Won 1–0 vs Malmö FF',
      formation: '4-4-2',
      manager: 'Brian Clough',
      kitColors: { primary: '#dd0000', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Peter Shilton', 'GK', 'ENG', 29, 1, 1, 0, 125, 'Stoke City'),
        P('Frank Clark', 'LB', 'ENG', 35, 3, 10, 15, 0, 'Newcastle United'),
        P('Kenny Burns', 'CB', 'SCO', 25, 6, 70, 20, 20, 'Birmingham City'),
        P('Larry Lloyd', 'CB', 'ENG', 30, 5, 40, 15, 4, 'Coventry City'),
        P('Viv Anderson', 'RB', 'ENG', 22, 2, 40, 40, 30, YOUTH),
        P('John Robertson', 'LM', 'SCO', 26, 11, 90, 150, 28, YOUTH),
        P('Ian Bowyer', 'CM', 'ENG', 27, 8, 90, 40, 0, 'Orient'),
        P('John McGovern', 'CM', 'SCO', 29, 4, 30, 40, 0, 'Leeds United'),
        P('Trevor Francis', 'RM', 'ENG', 25, 7, 230, 100, 52, 'Birmingham City'),
        P('Tony Woodcock', 'ST', 'ENG', 23, 10, 180, 80, 42, YOUTH),
        P('Garry Birtles', 'ST', 'ENG', 22, 9, 100, 40, 3, 'Long Eaton United')
      ]
    },

    // ───────────────────────────────── 1980s ─────────────────────────────────
    {
      id: 'aston-villa-1982',
      club: 'Aston Villa',
      season: '1981–82',
      competitionStage: 'Final',
      result: 'Won 1–0 vs Bayern Munich',
      formation: '4-4-2',
      manager: 'Tony Barton',
      kitColors: { primary: '#670e36', secondary: '#95bfe5', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Jimmy Rimmer', 'GK', 'ENG', 34, 1, 0, 0, 1, 'Arsenal'),
        P('Gary Williams', 'LB', 'ENG', 21, 3, 5, 15, 0, YOUTH),
        P('Allan Evans', 'CB', 'SCO', 25, 4, 70, 15, 4, 'Dunfermline Athletic'),
        P('Ken McNaught', 'CB', 'SCO', 27, 5, 30, 10, 0, 'Everton'),
        P('Kenny Swain', 'RB', 'ENG', 30, 2, 30, 25, 0, 'Chelsea'),
        P('Tony Morley', 'LM', 'ENG', 27, 11, 100, 80, 6, 'Burnley'),
        P('Gordon Cowans', 'CM', 'ENG', 23, 10, 70, 120, 10, YOUTH),
        P('Dennis Mortimer', 'CM', 'ENG', 30, 6, 50, 50, 0, 'Coventry City'),
        P('Des Bremner', 'RM', 'SCO', 29, 7, 30, 40, 1, 'Hibernian'),
        P('Peter Withe', 'ST', 'ENG', 30, 9, 200, 60, 11, 'Newcastle United'),
        P('Gary Shaw', 'ST', 'ENG', 21, 8, 70, 40, 0, YOUTH)
      ]
    },
    {
      id: 'liverpool-1984',
      club: 'Liverpool',
      season: '1983–84',
      competitionStage: 'Final',
      result: 'Drew 1–1 vs Roma, won 4–2 on penalties',
      formation: '4-4-2',
      manager: 'Joe Fagan',
      kitColors: { primary: '#c8102e', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Bruce Grobbelaar', 'GK', 'ZW', 26, 1, 0, 0, 32, 'Vancouver Whitecaps'),
        P('Alan Kennedy', 'LB', 'ENG', 29, 3, 30, 30, 2, 'Newcastle United'),
        P('Alan Hansen', 'CB', 'SCO', 28, 6, 15, 30, 26, 'Partick Thistle'),
        P('Mark Lawrenson', 'CB', 'IE', 26, 4, 30, 20, 39, 'Brighton & Hove Albion'),
        P('Phil Neal', 'RB', 'ENG', 33, 2, 70, 60, 50, 'Northampton Town'),
        P('Ronnie Whelan', 'LM', 'IE', 22, 5, 75, 70, 53, 'Home Farm'),
        P('Graeme Souness', 'CM', 'SCO', 31, 11, 80, 120, 54, 'Middlesbrough'),
        P('Sammy Lee', 'CM', 'ENG', 25, 8, 20, 40, 14, YOUTH),
        P('Craig Johnston', 'RM', 'AU', 23, 10, 40, 40, 0, 'Middlesbrough'),
        P('Ian Rush', 'ST', 'WAL', 22, 9, 380, 100, 73, 'Chester City'),
        P('Kenny Dalglish', 'ST', 'SCO', 33, 7, 340, 220, 102, 'Celtic')
      ]
    },
    {
      id: 'steaua-1986',
      club: 'Steaua București',
      season: '1985–86',
      competitionStage: 'Final',
      result: 'Drew 0–0 vs Barcelona, won 2–0 on penalties',
      formation: '4-4-2',
      manager: 'Emerich Jenei',
      kitColors: { primary: '#d91e2a', secondary: '#0b3d91', pattern: 'halves' },
      difficulty: 'hard',
      players: [
        P('Helmuth Duckadam', 'GK', 'RO', 27, 1, 0, 0, 2, 'UTA Arad'),
        P('Ilie Bărbulescu', 'LB', 'RO', 28, 5, 10, 10, 4, 'FC Argeș'),
        P('Adrian Bumbescu', 'CB', 'RO', 25, 4, 10, 5, 9, YOUTH),
        P('Miodrag Belodedici', 'SW', 'RO', 21, 3, 25, 15, 55, YOUTH),
        P('Ștefan Iovan', 'RB', 'RO', 25, 2, 30, 30, 34, 'Rapid București'),
        P('Mihail Majearu', 'LM', 'RO', 24, 10, 30, 30, 3, 'FC Argeș'),
        P('László Bölöni', 'CM', 'RO', 33, 8, 110, 80, 102, 'ASA Târgu Mureș'),
        P('Lucian Bălan', 'CM', 'RO', 26, 6, 20, 20, 3, 'Corvinul Hunedoara'),
        P('Gavril Balint', 'RM', 'RO', 22, 7, 100, 60, 30, 'Gloria Bistrița'),
        P('Marius Lăcătuș', 'ST', 'RO', 22, 11, 120, 80, 84, 'FC Brașov'),
        P('Victor Pițurcă', 'ST', 'RO', 29, 9, 160, 50, 13, 'Olt Scornicești')
      ]
    },
    {
      id: 'psv-1988',
      club: 'PSV Eindhoven',
      season: '1987–88',
      competitionStage: 'Final',
      result: 'Drew 0–0 vs Benfica, won 6–5 on penalties',
      formation: '4-4-2',
      manager: 'Guus Hiddink',
      kitColors: { primary: '#ed1c24', secondary: '#ffffff', pattern: 'stripes' },
      difficulty: 'hard',
      players: [
        P('Hans van Breukelen', 'GK', 'NL', 31, 1, 0, 0, 73, 'Nottingham Forest'),
        P('Jan Heintze', 'LB', 'DK', 24, 5, 15, 50, 86, YOUTH),
        P('Ivan Nielsen', 'CB', 'DK', 31, 3, 15, 10, 51, 'Feyenoord'),
        P('Ronald Koeman', 'CB', 'NL', 25, 4, 250, 90, 78, 'Ajax'),
        P('Eric Gerets', 'RB', 'BE', 34, 2, 50, 50, 86, 'MVV'),
        P('Søren Lerby', 'LM', 'DK', 30, 10, 100, 90, 67, 'Monaco'),
        P('Edward Linskens', 'CM', 'NL', 19, 8, 15, 10, 0, YOUTH),
        P('Berry van Aerle', 'CM', 'NL', 25, 6, 10, 30, 35, YOUTH),
        P('Gerald Vanenburg', 'RM', 'NL', 24, 7, 80, 100, 42, 'Ajax'),
        P('Hans Gillhaus', 'ST', 'NL', 24, 11, 120, 50, 9, 'FC Den Bosch'),
        P('Wim Kieft', 'ST', 'NL', 25, 9, 200, 60, 42, 'Torino')
      ]
    },
    {
      id: 'milan-1989',
      club: 'AC Milan',
      season: '1988–89',
      competitionStage: 'Final',
      result: 'Won 4–0 vs Steaua București',
      formation: '4-4-2',
      manager: 'Arrigo Sacchi',
      kitColors: { primary: '#c8102e', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'easy',
      players: [
        P('Giovanni Galli', 'GK', 'IT', 31, 1, 0, 0, 19, 'Fiorentina'),
        P('Paolo Maldini', 'LB', 'IT', 20, 3, 33, 40, 126, YOUTH),
        P('Franco Baresi', 'SW', 'IT', 29, 6, 33, 25, 81, YOUTH),
        P('Alessandro Costacurta', 'CB', 'IT', 23, 5, 5, 5, 59, YOUTH),
        P('Mauro Tassotti', 'RB', 'IT', 29, 2, 10, 40, 7, 'Lazio'),
        P('Angelo Colombo', 'LM', 'IT', 28, 4, 15, 30, 0, 'Udinese'),
        P('Carlo Ancelotti', 'CM', 'IT', 29, 11, 30, 40, 26, 'Roma'),
        P('Frank Rijkaard', 'CM', 'NL', 26, 8, 100, 60, 73, 'Real Zaragoza'),
        P('Roberto Donadoni', 'RM', 'IT', 25, 7, 25, 120, 63, 'Atalanta'),
        P('Ruud Gullit', 'ST', 'NL', 26, 10, 200, 120, 66, 'PSV Eindhoven'),
        P('Marco van Basten', 'ST', 'NL', 24, 9, 277, 80, 58, 'Ajax')
      ]
    },

    // ───────────────────────────────── 1990s ─────────────────────────────────
    {
      id: 'barcelona-1992',
      club: 'Barcelona',
      season: '1991–92',
      competitionStage: 'Final',
      result: 'Won 1–0 (a.e.t.) vs Sampdoria',
      formation: '4-3-3',
      manager: 'Johan Cruyff',
      kitColors: { primary: '#a50044', secondary: '#004d98', pattern: 'stripes' },
      difficulty: 'medium',
      players: [
        P('Andoni Zubizarreta', 'GK', 'ES', 30, 1, 0, 0, 126, 'Athletic Bilbao'),
        P('Juan Carlos', 'LB', 'ES', 27, 3, 5, 15, 6, 'Atlético Madrid'),
        P('Ronald Koeman', 'CB', 'NL', 29, 4, 250, 90, 78, 'PSV Eindhoven'),
        P('Nando', 'CB', 'ES', 24, 5, 3, 5, 0, 'Valencia'),
        P('Albert Ferrer', 'RB', 'ES', 21, 2, 5, 25, 36, YOUTH),
        P('José Mari Bakero', 'CM', 'ES', 29, 6, 130, 70, 30, 'Real Sociedad'),
        P('Pep Guardiola', 'DM', 'ES', 21, 11, 15, 60, 47, YOUTH),
        P('Eusebio Sacristán', 'CM', 'ES', 28, 7, 40, 60, 15, 'Atlético Madrid'),
        P('Hristo Stoichkov', 'LW', 'BG', 26, 8, 260, 120, 83, 'CSKA Sofia'),
        P('Michael Laudrup', 'CF', 'DK', 27, 10, 130, 200, 104, 'Juventus'),
        P('Julio Salinas', 'RW', 'ES', 29, 9, 170, 50, 56, 'Atlético Madrid')
      ]
    },
    {
      id: 'marseille-1993',
      club: 'Marseille',
      season: '1992–93',
      competitionStage: 'Final',
      result: 'Won 1–0 vs AC Milan',
      formation: '4-3-3',
      manager: 'Raymond Goethals',
      kitColors: { primary: '#ffffff', secondary: '#2faee0', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Fabien Barthez', 'GK', 'FR', 21, 1, 0, 0, 87, 'Toulouse'),
        P('Éric Di Meco', 'LB', 'FR', 29, 3, 16, 30, 23, YOUTH),
        P('Marcel Desailly', 'CB', 'FR', 24, 5, 15, 15, 116, 'Nantes'),
        P('Basile Boli', 'CB', 'FR', 26, 4, 39, 5, 45, 'Auxerre'),
        P('Jocelyn Angloma', 'RB', 'FR', 27, 2, 15, 30, 37, 'Paris Saint-Germain'),
        P('Jean-Jacques Eydelie', 'CM', 'FR', 27, 6, 20, 20, 6, 'Nantes'),
        P('Didier Deschamps', 'CM', 'FR', 24, 7, 21, 40, 103, 'Bordeaux'),
        P('Franck Sauzée', 'CM', 'FR', 27, 8, 110, 60, 39, 'Monaco'),
        P('Abedi Pelé', 'LW', 'GH', 28, 10, 150, 80, 77, 'Lille'),
        P('Rudi Völler', 'ST', 'DE', 33, 9, 270, 70, 90, 'Roma'),
        P('Alen Bokšić', 'RW', 'HR', 23, 11, 130, 60, 40, 'Hajduk Split')
      ]
    },
    {
      id: 'milan-1994',
      club: 'AC Milan',
      season: '1993–94',
      competitionStage: 'Final',
      result: 'Won 4–0 vs Barcelona',
      formation: '4-4-2',
      manager: 'Fabio Capello',
      kitColors: { primary: '#c8102e', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'medium',
      players: [
        P('Sebastiano Rossi', 'GK', 'IT', 29, 1, 0, 0, 0, 'Cesena'),
        P('Christian Panucci', 'LB', 'IT', 21, 6, 50, 30, 57, 'Genoa'),
        P('Paolo Maldini', 'CB', 'IT', 25, 3, 33, 40, 126, YOUTH),
        P('Filippo Galli', 'CB', 'IT', 30, 5, 10, 5, 0, YOUTH),
        P('Mauro Tassotti', 'RB', 'IT', 34, 2, 10, 40, 7, 'Lazio'),
        P('Roberto Donadoni', 'LM', 'IT', 30, 7, 25, 120, 63, 'Atalanta'),
        P('Demetrio Albertini', 'CM', 'IT', 22, 4, 40, 70, 79, YOUTH),
        P('Marcel Desailly', 'DM', 'FR', 25, 8, 15, 15, 116, 'Marseille'),
        P('Zvonimir Boban', 'RM', 'HR', 25, 11, 70, 80, 51, 'Dinamo Zagreb'),
        P('Dejan Savićević', 'ST', 'ME', 27, 10, 150, 90, 56, 'Red Star Belgrade'),
        P('Daniele Massaro', 'ST', 'IT', 32, 9, 130, 50, 15, 'Fiorentina')
      ]
    },
    {
      id: 'ajax-1995',
      club: 'Ajax',
      season: '1994–95',
      competitionStage: 'Final',
      result: 'Won 1–0 vs AC Milan',
      formation: '4-3-3',
      manager: 'Louis van Gaal',
      kitColors: { primary: '#ffffff', secondary: '#d2122e', pattern: 'band' },
      difficulty: 'medium',
      players: [
        P('Edwin van der Sar', 'GK', 'NL', 24, 1, 1, 0, 130, YOUTH),
        P('Frank de Boer', 'LB', 'NL', 25, 5, 60, 40, 112, YOUTH),
        P('Danny Blind', 'CB', 'NL', 33, 3, 50, 25, 42, 'Sparta Rotterdam'),
        P('Frank Rijkaard', 'CB', 'NL', 32, 4, 100, 60, 73, 'AC Milan'),
        P('Michael Reiziger', 'RB', 'NL', 22, 2, 10, 20, 72, YOUTH),
        P('Clarence Seedorf', 'CM', 'NL', 19, 6, 135, 130, 87, YOUTH),
        P('Edgar Davids', 'CM', 'NL', 22, 8, 39, 50, 74, YOUTH),
        P('Jari Litmanen', 'AM', 'FI', 23, 10, 220, 120, 137, 'MyPa'),
        P('Marc Overmars', 'LW', 'NL', 22, 11, 120, 110, 86, 'Willem II'),
        P('Ronald de Boer', 'CF', 'NL', 25, 9, 140, 70, 67, YOUTH),
        P('Finidi George', 'RW', 'NG', 24, 7, 60, 70, 62, 'Sharks FC')
      ]
    },
    {
      id: 'dortmund-1997',
      club: 'Borussia Dortmund',
      season: '1996–97',
      competitionStage: 'Final',
      result: 'Won 3–1 vs Juventus',
      formation: '3-5-2',
      manager: 'Ottmar Hitzfeld',
      kitColors: { primary: '#fde100', secondary: '#111111', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Stefan Klos', 'GK', 'DE', 25, 1, 0, 0, 0, YOUTH),
        P('Martin Kree', 'CB', 'DE', 32, 5, 30, 15, 0, 'Bayer Leverkusen'),
        P('Matthias Sammer', 'SW', 'DE', 29, 6, 70, 50, 74, 'Inter'),
        P('Jürgen Kohler', 'CB', 'DE', 31, 4, 40, 15, 105, 'Juventus'),
        P('Jörg Heinrich', 'LM', 'DE', 27, 17, 50, 50, 37, 'SC Freiburg'),
        P('Paul Lambert', 'CM', 'SCO', 27, 16, 30, 40, 40, 'Motherwell'),
        P('Andreas Möller', 'AM', 'DE', 29, 10, 150, 150, 85, 'Juventus'),
        P('Paulo Sousa', 'CM', 'PT', 26, 8, 9, 30, 51, 'Juventus'),
        P('Stefan Reuter', 'RM', 'DE', 30, 7, 50, 60, 69, 'Juventus'),
        P('Stéphane Chapuisat', 'ST', 'CH', 27, 9, 230, 80, 103, 'Bayer Uerdingen'),
        P('Karl-Heinz Riedle', 'ST', 'DE', 31, 13, 160, 50, 42, 'Lazio')
      ]
    },
    {
      id: 'man-united-1999',
      club: 'Manchester United',
      season: '1998–99',
      competitionStage: 'Final',
      result: 'Won 2–1 vs Bayern Munich',
      formation: '4-4-2',
      manager: 'Alex Ferguson',
      kitColors: { primary: '#da291c', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Peter Schmeichel', 'GK', 'DK', 35, 1, 11, 1, 129, 'Brøndby'),
        P('Denis Irwin', 'LB', 'IE', 33, 3, 35, 40, 56, 'Oldham Athletic'),
        P('Ronny Johnsen', 'CB', 'NO', 29, 5, 20, 10, 62, 'Beşiktaş'),
        P('Jaap Stam', 'CB', 'NL', 26, 6, 26, 10, 67, 'PSV Eindhoven'),
        P('Gary Neville', 'RB', 'ENG', 24, 2, 7, 50, 85, YOUTH),
        P('Jesper Blomqvist', 'LM', 'SE', 25, 15, 20, 30, 30, 'Parma'),
        P('Nicky Butt', 'CM', 'ENG', 24, 8, 30, 30, 39, YOUTH),
        P('David Beckham', 'CM', 'ENG', 24, 7, 130, 180, 115, YOUTH),
        P('Ryan Giggs', 'RM', 'WAL', 25, 11, 170, 270, 64, YOUTH),
        P('Andy Cole', 'ST', 'ENG', 27, 9, 290, 80, 15, 'Newcastle United'),
        P('Dwight Yorke', 'ST', 'TT', 27, 19, 200, 80, 72, 'Aston Villa')
      ]
    },

    // ───────────────────────────────── 2000s ─────────────────────────────────
    {
      id: 'real-madrid-2002',
      club: 'Real Madrid',
      season: '2001–02',
      competitionStage: 'Final',
      result: 'Won 2–1 vs Bayer Leverkusen',
      formation: '4-4-2',
      manager: 'Vicente del Bosque',
      kitColors: { primary: '#f4f4f4', secondary: '#2b2f6b', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('César Sánchez', 'GK', 'ES', 30, 13, 0, 0, 0, 'Real Valladolid'),
        P('Roberto Carlos', 'LB', 'BR', 29, 3, 110, 140, 125, 'Inter'),
        P('Iván Helguera', 'CB', 'ES', 27, 6, 40, 15, 47, 'Espanyol'),
        P('Fernando Hierro', 'CB', 'ES', 34, 4, 130, 40, 89, 'Real Valladolid'),
        P('Míchel Salgado', 'RB', 'ES', 26, 2, 8, 30, 53, 'Celta Vigo'),
        P('Santiago Solari', 'LM', 'AR', 25, 21, 40, 40, 1, 'Atlético Madrid'),
        P('Zinedine Zidane', 'CM', 'FR', 29, 5, 125, 130, 108, 'Juventus'),
        P('Claude Makélélé', 'DM', 'FR', 29, 24, 15, 20, 71, 'Celta Vigo'),
        P('Luís Figo', 'RM', 'PT', 29, 10, 130, 190, 127, 'Barcelona'),
        P('Raúl', 'ST', 'ES', 24, 7, 404, 120, 102, YOUTH),
        P('Fernando Morientes', 'ST', 'ES', 26, 9, 200, 50, 47, 'Real Zaragoza')
      ]
    },
    {
      id: 'milan-2003',
      club: 'AC Milan',
      season: '2002–03',
      competitionStage: 'Final',
      result: 'Drew 0–0 vs Juventus, won 3–2 on penalties',
      formation: '4-3-1-2',
      manager: 'Carlo Ancelotti',
      kitColors: { primary: '#c8102e', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'easy',
      players: [
        P('Dida', 'GK', 'BR', 29, 12, 0, 0, 91, 'Corinthians'),
        P('Kakha Kaladze', 'LB', 'GE', 25, 4, 25, 15, 83, 'Dynamo Kyiv'),
        P('Paolo Maldini', 'CB', 'IT', 34, 3, 33, 40, 126, YOUTH),
        P('Alessandro Nesta', 'CB', 'IT', 27, 13, 13, 10, 78, 'Lazio'),
        P('Alessandro Costacurta', 'RB', 'IT', 37, 5, 5, 5, 59, YOUTH),
        P('Clarence Seedorf', 'CM', 'NL', 27, 20, 135, 130, 87, 'Inter'),
        P('Andrea Pirlo', 'DM', 'IT', 24, 21, 73, 120, 116, 'Inter'),
        P('Gennaro Gattuso', 'CM', 'IT', 25, 8, 17, 30, 73, 'Salernitana'),
        P('Rui Costa', 'AM', 'PT', 31, 10, 110, 150, 94, 'Fiorentina'),
        P('Andriy Shevchenko', 'ST', 'UA', 26, 7, 343, 70, 111, 'Dynamo Kyiv'),
        P('Filippo Inzaghi', 'ST', 'IT', 29, 9, 310, 40, 57, 'Juventus')
      ]
    },
    {
      id: 'porto-2004',
      club: 'Porto',
      season: '2003–04',
      competitionStage: 'Final',
      result: 'Won 3–0 vs Monaco',
      formation: '4-3-1-2',
      manager: 'José Mourinho',
      kitColors: { primary: '#003893', secondary: '#ffffff', pattern: 'stripes' },
      difficulty: 'medium',
      players: [
        P('Vítor Baía', 'GK', 'PT', 34, 99, 0, 0, 80, 'Barcelona'),
        P('Nuno Valente', 'LB', 'PT', 29, 8, 5, 20, 33, 'União de Leiria'),
        P('Ricardo Carvalho', 'CB', 'PT', 26, 4, 25, 10, 75, 'Alverca (loan)'),
        P('Jorge Costa', 'CB', 'PT', 32, 2, 25, 10, 50, 'Charlton Athletic (loan)'),
        P('Paulo Ferreira', 'RB', 'PT', 25, 22, 5, 20, 62, 'Vitória de Setúbal'),
        P('Maniche', 'CM', 'PT', 26, 18, 60, 50, 52, 'Benfica'),
        P('Costinha', 'DM', 'PT', 29, 6, 25, 15, 53, 'Monaco'),
        P('Pedro Mendes', 'CM', 'PT', 25, 15, 20, 25, 2, 'Vitória de Guimarães'),
        P('Deco', 'AM', 'PT', 26, 10, 100, 120, 75, 'Salgueiros'),
        P('Carlos Alberto', 'ST', 'BR', 19, 19, 50, 25, 0, 'Fluminense'),
        P('Derlei', 'ST', 'BR', 28, 11, 150, 40, 0, 'União de Leiria')
      ]
    },
    {
      id: 'monaco-2004',
      club: 'Monaco',
      season: '2003–04',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 0–3 vs Porto',
      formation: '4-4-1-1',
      manager: 'Didier Deschamps',
      kitColors: { primary: '#e30613', secondary: '#ffffff', pattern: 'diagonal' },
      difficulty: 'medium',
      players: [
        P('Flavio Roma', 'GK', 'IT', 29, 30, 0, 0, 0, 'Piacenza'),
        P('Patrice Evra', 'LB', 'FR', 23, 3, 25, 50, 81, 'Nice'),
        P('Gaël Givet', 'CB', 'FR', 22, 32, 10, 5, 12, YOUTH),
        P('Julien Rodriguez', 'CB', 'FR', 25, 5, 15, 5, 1, 'Bastia'),
        P('Hugo Ibarra', 'RB', 'AR', 30, 4, 10, 20, 3, 'Boca Juniors (loan)'),
        P('Jérôme Rothen', 'LM', 'FR', 26, 25, 40, 80, 13, 'Troyes'),
        P('Akis Zikos', 'CM', 'GR', 29, 6, 25, 15, 36, 'AEK Athens'),
        P('Lucas Bernardi', 'CM', 'AR', 26, 22, 15, 20, 0, 'Marseille'),
        P('Édouard Cissé', 'RM', 'FR', 26, 12, 15, 20, 0, 'Paris Saint-Germain (loan)'),
        P('Ludovic Giuly', 'AM', 'FR', 27, 8, 130, 80, 17, 'Lyon'),
        P('Fernando Morientes', 'ST', 'ES', 28, 9, 200, 50, 47, 'Real Madrid (loan)')
      ]
    },
    {
      id: 'liverpool-2005',
      club: 'Liverpool',
      season: '2004–05',
      competitionStage: 'Final',
      result: 'Drew 3–3 vs AC Milan, won 3–2 on penalties',
      formation: '4-4-1-1',
      manager: 'Rafael Benítez',
      kitColors: { primary: '#c8102e', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Jerzy Dudek', 'GK', 'PL', 31, 1, 0, 0, 60, 'Feyenoord'),
        P('Djimi Traoré', 'LB', 'ML', 25, 21, 5, 5, 21, 'Laval'),
        P('Sami Hyypiä', 'CB', 'FI', 31, 4, 45, 10, 105, 'Willem II'),
        P('Jamie Carragher', 'CB', 'ENG', 27, 23, 5, 10, 38, YOUTH),
        P('Steve Finnan', 'RB', 'IE', 29, 3, 30, 40, 53, 'Fulham'),
        P('John Arne Riise', 'LM', 'NO', 24, 6, 60, 60, 110, 'Monaco'),
        P('Xabi Alonso', 'CM', 'ES', 23, 14, 40, 60, 114, 'Real Sociedad'),
        P('Steven Gerrard', 'CM', 'ENG', 24, 8, 200, 150, 114, YOUTH),
        P('Luis García', 'RM', 'ES', 26, 10, 100, 50, 20, 'Barcelona'),
        P('Harry Kewell', 'AM', 'AU', 26, 7, 124, 60, 58, 'Leeds United'),
        P('Milan Baroš', 'ST', 'CZ', 23, 5, 140, 30, 93, 'Baník Ostrava')
      ]
    },
    {
      id: 'man-united-2008',
      club: 'Manchester United',
      season: '2007–08',
      competitionStage: 'Final',
      result: 'Drew 1–1 vs Chelsea, won 6–5 on penalties',
      formation: '4-4-2',
      manager: 'Alex Ferguson',
      kitColors: { primary: '#da291c', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Edwin van der Sar', 'GK', 'NL', 37, 1, 1, 0, 130, 'Fulham'),
        P('Patrice Evra', 'LB', 'FR', 27, 3, 25, 50, 81, 'Monaco'),
        P('Nemanja Vidić', 'CB', 'RS', 26, 15, 30, 8, 56, 'Spartak Moscow'),
        P('Rio Ferdinand', 'CB', 'ENG', 29, 5, 13, 10, 81, 'Leeds United'),
        P('Wes Brown', 'RB', 'ENG', 25, 6, 7, 15, 23, YOUTH),
        P('Cristiano Ronaldo', 'LM', 'PT', 23, 7, 835, 250, 234, 'Sporting CP'),
        P('Michael Carrick', 'CM', 'ENG', 26, 16, 35, 60, 34, 'Tottenham Hotspur'),
        P('Paul Scholes', 'CM', 'ENG', 33, 18, 155, 100, 66, YOUTH),
        P('Owen Hargreaves', 'RM', 'ENG', 27, 4, 15, 25, 42, 'Bayern Munich'),
        P('Wayne Rooney', 'ST', 'ENG', 22, 10, 310, 150, 120, 'Everton'),
        P('Carlos Tevez', 'ST', 'AR', 24, 32, 320, 120, 76, 'West Ham United')
      ]
    },
    {
      id: 'barcelona-2009',
      club: 'Barcelona',
      season: '2008–09',
      competitionStage: 'Final',
      result: 'Won 2–0 vs Manchester United',
      formation: '4-3-3',
      manager: 'Pep Guardiola',
      kitColors: { primary: '#a50044', secondary: '#004d98', pattern: 'stripes' },
      difficulty: 'easy',
      players: [
        P('Víctor Valdés', 'GK', 'ES', 27, 1, 0, 0, 20, YOUTH),
        P('Sylvinho', 'LB', 'BR', 35, 16, 15, 30, 6, 'Celta Vigo'),
        P('Yaya Touré', 'CB', 'CI', 26, 24, 130, 80, 101, 'Monaco'),
        P('Gerard Piqué', 'CB', 'ES', 22, 3, 50, 20, 102, 'Manchester United'),
        P('Carles Puyol', 'RB', 'ES', 31, 5, 20, 15, 100, YOUTH),
        P('Andrés Iniesta', 'CM', 'ES', 25, 8, 90, 160, 131, YOUTH),
        P('Sergio Busquets', 'DM', 'ES', 20, 28, 20, 45, 143, YOUTH),
        P('Xavi', 'CM', 'ES', 29, 6, 100, 185, 133, YOUTH),
        P('Thierry Henry', 'LW', 'FR', 31, 14, 360, 170, 123, 'Arsenal'),
        P('Lionel Messi', 'CF', 'AR', 21, 10, 821, 370, 208, YOUTH),
        P("Samuel Eto'o", 'RW', 'CM', 28, 9, 380, 110, 118, 'Mallorca')
      ]
    },

    // ───────────────────────────────── 2010s ─────────────────────────────────
    {
      id: 'inter-2010',
      club: 'Inter',
      season: '2009–10',
      competitionStage: 'Final',
      result: 'Won 2–0 vs Bayern Munich',
      formation: '4-2-3-1',
      manager: 'José Mourinho',
      kitColors: { primary: '#0050a0', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'easy',
      players: [
        P('Júlio César', 'GK', 'BR', 30, 12, 0, 0, 87, 'Flamengo'),
        P('Cristian Chivu', 'LB', 'RO', 29, 26, 20, 25, 75, 'Roma'),
        P('Walter Samuel', 'CB', 'AR', 32, 25, 30, 5, 56, 'Real Madrid'),
        P('Lúcio', 'CB', 'BR', 32, 6, 49, 15, 105, 'Bayern Munich'),
        P('Maicon', 'RB', 'BR', 28, 13, 50, 60, 76, 'Monaco'),
        P('Esteban Cambiasso', 'DM', 'AR', 29, 19, 70, 50, 52, 'Real Madrid'),
        P('Javier Zanetti', 'DM', 'AR', 36, 4, 25, 60, 145, 'Banfield'),
        P('Goran Pandev', 'LW', 'MK', 26, 27, 180, 100, 122, 'Lazio'),
        P('Wesley Sneijder', 'AM', 'NL', 25, 10, 150, 170, 134, 'Real Madrid'),
        P("Samuel Eto'o", 'RW', 'CM', 29, 9, 380, 110, 118, 'Barcelona'),
        P('Diego Milito', 'ST', 'AR', 30, 22, 300, 70, 25, 'Genoa')
      ]
    },
    {
      id: 'barcelona-2011',
      club: 'Barcelona',
      season: '2010–11',
      competitionStage: 'Final',
      result: 'Won 3–1 vs Manchester United',
      formation: '4-3-3',
      manager: 'Pep Guardiola',
      kitColors: { primary: '#a50044', secondary: '#004d98', pattern: 'stripes' },
      difficulty: 'easy',
      players: [
        P('Víctor Valdés', 'GK', 'ES', 29, 1, 0, 0, 20, YOUTH),
        P('Éric Abidal', 'LB', 'FR', 31, 22, 5, 15, 67, 'Lyon'),
        P('Javier Mascherano', 'CB', 'AR', 26, 14, 5, 15, 147, 'Liverpool'),
        P('Gerard Piqué', 'CB', 'ES', 24, 3, 50, 20, 102, 'Manchester United'),
        P('Dani Alves', 'RB', 'BR', 28, 2, 45, 130, 126, 'Sevilla'),
        P('Andrés Iniesta', 'CM', 'ES', 27, 8, 90, 160, 131, YOUTH),
        P('Sergio Busquets', 'DM', 'ES', 22, 16, 20, 45, 143, YOUTH),
        P('Xavi', 'CM', 'ES', 31, 6, 100, 185, 133, YOUTH),
        P('David Villa', 'LW', 'ES', 29, 7, 380, 100, 98, 'Valencia'),
        P('Lionel Messi', 'CF', 'AR', 23, 10, 821, 370, 208, YOUTH),
        P('Pedro', 'RW', 'ES', 23, 17, 150, 90, 65, YOUTH)
      ]
    },
    {
      id: 'chelsea-2012',
      club: 'Chelsea',
      season: '2011–12',
      competitionStage: 'Final',
      result: 'Drew 1–1 vs Bayern Munich, won 4–3 on penalties',
      formation: '4-2-3-1',
      manager: 'Roberto Di Matteo',
      kitColors: { primary: '#034694', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Petr Čech', 'GK', 'CZ', 29, 1, 0, 0, 124, 'Rennes'),
        P('Ashley Cole', 'LB', 'ENG', 31, 3, 15, 40, 107, 'Arsenal'),
        P('David Luiz', 'CB', 'BR', 25, 4, 47, 25, 57, 'Benfica'),
        P('Gary Cahill', 'CB', 'ENG', 26, 24, 40, 10, 61, 'Bolton Wanderers'),
        P('José Bosingwa', 'RB', 'PT', 29, 17, 10, 25, 27, 'Porto'),
        P('Frank Lampard', 'CM', 'ENG', 33, 8, 300, 180, 106, 'West Ham United'),
        P('John Obi Mikel', 'DM', 'NG', 25, 12, 15, 20, 91, 'Lyn Oslo'),
        P('Ryan Bertrand', 'LM', 'ENG', 23, 34, 15, 40, 19, YOUTH),
        P('Juan Mata', 'AM', 'ES', 24, 10, 150, 140, 41, 'Valencia'),
        P('Salomon Kalou', 'RM', 'CI', 26, 21, 150, 70, 97, 'Feyenoord'),
        P('Didier Drogba', 'ST', 'CI', 34, 11, 330, 130, 104, 'Marseille')
      ]
    },
    {
      id: 'bayern-2013',
      club: 'Bayern Munich',
      season: '2012–13',
      competitionStage: 'Final',
      result: 'Won 2–1 vs Borussia Dortmund',
      formation: '4-2-3-1',
      manager: 'Jupp Heynckes',
      kitColors: { primary: '#dc052d', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Manuel Neuer', 'GK', 'DE', 27, 1, 0, 2, 128, 'Schalke 04'),
        P('David Alaba', 'LB', 'AT', 20, 27, 41, 70, 117, YOUTH),
        P('Dante', 'CB', 'BR', 29, 4, 25, 10, 13, 'Borussia Mönchengladbach'),
        P('Jérôme Boateng', 'CB', 'DE', 24, 17, 15, 15, 76, 'Manchester City'),
        P('Philipp Lahm', 'RB', 'DE', 29, 21, 30, 90, 113, YOUTH),
        P('Bastian Schweinsteiger', 'DM', 'DE', 28, 31, 85, 100, 121, YOUTH),
        P('Javi Martínez', 'DM', 'ES', 24, 8, 25, 15, 18, 'Athletic Bilbao'),
        P('Franck Ribéry', 'LW', 'FR', 30, 7, 150, 220, 81, 'Marseille'),
        P('Thomas Müller', 'AM', 'DE', 23, 25, 285, 270, 131, YOUTH),
        P('Arjen Robben', 'RW', 'NL', 29, 10, 250, 160, 96, 'Real Madrid'),
        P('Mario Mandžukić', 'ST', 'HR', 27, 9, 230, 70, 89, 'VfL Wolfsburg')
      ]
    },
    {
      id: 'dortmund-2013',
      club: 'Borussia Dortmund',
      season: '2012–13',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 1–2 vs Bayern Munich',
      formation: '4-2-3-1',
      manager: 'Jürgen Klopp',
      kitColors: { primary: '#fde100', secondary: '#111111', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Roman Weidenfeller', 'GK', 'DE', 32, 1, 0, 0, 5, '1. FC Kaiserslautern'),
        P('Marcel Schmelzer', 'LB', 'DE', 25, 29, 10, 30, 16, YOUTH),
        P('Mats Hummels', 'CB', 'DE', 24, 15, 50, 30, 78, 'Bayern Munich'),
        P('Neven Subotić', 'CB', 'RS', 24, 4, 25, 10, 36, 'Mainz 05'),
        P('Łukasz Piszczek', 'RB', 'PL', 27, 26, 30, 50, 66, 'Hertha BSC'),
        P('İlkay Gündoğan', 'DM', 'DE', 22, 8, 96, 90, 82, '1. FC Nürnberg'),
        P('Sven Bender', 'DM', 'DE', 24, 6, 10, 15, 7, '1860 Munich'),
        P('Kevin Großkreutz', 'LW', 'DE', 24, 19, 40, 50, 6, 'Rot Weiss Ahlen'),
        P('Marco Reus', 'AM', 'DE', 23, 11, 237, 140, 48, 'Borussia Mönchengladbach'),
        P('Jakub Błaszczykowski', 'RW', 'PL', 27, 16, 70, 100, 109, 'Wisła Kraków'),
        P('Robert Lewandowski', 'ST', 'PL', 24, 9, 669, 150, 170, 'Lech Poznań')
      ]
    },
    {
      id: 'real-madrid-2014',
      club: 'Real Madrid',
      season: '2013–14',
      competitionStage: 'Final',
      result: 'Won 4–1 (a.e.t.) vs Atlético Madrid',
      formation: '4-3-3',
      manager: 'Carlo Ancelotti',
      kitColors: { primary: '#f4f4f4', secondary: '#2b2f6b', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Iker Casillas', 'GK', 'ES', 33, 1, 0, 0, 167, YOUTH),
        P('Fábio Coentrão', 'LB', 'PT', 26, 5, 10, 30, 52, 'Benfica'),
        P('Sergio Ramos', 'CB', 'ES', 28, 4, 135, 40, 180, 'Sevilla'),
        P('Raphaël Varane', 'CB', 'FR', 21, 2, 20, 10, 93, 'Lens'),
        P('Dani Carvajal', 'RB', 'ES', 22, 15, 18, 55, 52, 'Bayer Leverkusen'),
        P('Ángel Di María', 'CM', 'AR', 26, 22, 218, 260, 145, 'Benfica'),
        P('Sami Khedira', 'CM', 'DE', 27, 6, 60, 40, 77, 'VfB Stuttgart'),
        P('Luka Modrić', 'CM', 'HR', 28, 19, 106, 160, 206, 'Tottenham Hotspur'),
        P('Cristiano Ronaldo', 'LW', 'PT', 29, 7, 835, 250, 234, 'Manchester United'),
        P('Karim Benzema', 'ST', 'FR', 26, 9, 450, 200, 97, 'Lyon'),
        P('Gareth Bale', 'RW', 'WAL', 24, 11, 185, 110, 111, 'Tottenham Hotspur')
      ]
    },
    {
      id: 'real-madrid-2016',
      club: 'Real Madrid',
      season: '2015–16',
      competitionStage: 'Final',
      result: 'Drew 1–1 vs Atlético Madrid, won 5–3 on penalties',
      formation: '4-3-3',
      manager: 'Zinedine Zidane',
      kitColors: { primary: '#f4f4f4', secondary: '#2b2f6b', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Keylor Navas', 'GK', 'CR', 29, 1, 0, 0, 129, 'Levante'),
        P('Marcelo', 'LB', 'BR', 28, 12, 50, 120, 58, 'Fluminense'),
        P('Sergio Ramos', 'CB', 'ES', 30, 4, 135, 40, 180, 'Sevilla'),
        P('Pepe', 'CB', 'PT', 33, 3, 30, 15, 141, 'Porto'),
        P('Dani Carvajal', 'RB', 'ES', 24, 15, 18, 55, 52, 'Bayer Leverkusen'),
        P('Toni Kroos', 'CM', 'DE', 26, 8, 70, 160, 114, 'Bayern Munich'),
        P('Casemiro', 'DM', 'BR', 24, 14, 77, 40, 91, 'São Paulo'),
        P('Luka Modrić', 'CM', 'HR', 30, 19, 106, 160, 206, 'Tottenham Hotspur'),
        P('Cristiano Ronaldo', 'LW', 'PT', 31, 7, 835, 250, 234, 'Manchester United'),
        P('Karim Benzema', 'ST', 'FR', 28, 9, 450, 200, 97, 'Lyon'),
        P('Gareth Bale', 'RW', 'WAL', 26, 11, 185, 110, 111, 'Tottenham Hotspur')
      ]
    },
    {
      id: 'real-madrid-2017',
      club: 'Real Madrid',
      season: '2016–17',
      competitionStage: 'Final',
      result: 'Won 4–1 vs Juventus',
      formation: '4-3-1-2',
      manager: 'Zinedine Zidane',
      kitColors: { primary: '#f4f4f4', secondary: '#2b2f6b', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Keylor Navas', 'GK', 'CR', 30, 1, 0, 0, 129, 'Levante'),
        P('Marcelo', 'LB', 'BR', 29, 12, 50, 120, 58, 'Fluminense'),
        P('Sergio Ramos', 'CB', 'ES', 31, 4, 135, 40, 180, 'Sevilla'),
        P('Raphaël Varane', 'CB', 'FR', 24, 5, 20, 10, 93, 'Lens'),
        P('Dani Carvajal', 'RB', 'ES', 25, 2, 18, 55, 52, 'Bayer Leverkusen'),
        P('Toni Kroos', 'CM', 'DE', 27, 8, 70, 160, 114, 'Bayern Munich'),
        P('Casemiro', 'DM', 'BR', 25, 14, 77, 40, 91, 'São Paulo'),
        P('Luka Modrić', 'CM', 'HR', 31, 10, 106, 160, 206, 'Tottenham Hotspur'),
        P('Isco', 'AM', 'ES', 25, 22, 115, 75, 39, 'Málaga'),
        P('Cristiano Ronaldo', 'ST', 'PT', 32, 7, 835, 250, 234, 'Manchester United'),
        P('Karim Benzema', 'ST', 'FR', 29, 9, 450, 200, 97, 'Lyon')
      ]
    },
    {
      id: 'liverpool-2019',
      club: 'Liverpool',
      season: '2018–19',
      competitionStage: 'Final',
      result: 'Won 2–0 vs Tottenham Hotspur',
      formation: '4-3-3',
      manager: 'Jürgen Klopp',
      kitColors: { primary: '#c8102e', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Alisson', 'GK', 'BR', 26, 13, 1, 3, 83, 'Roma'),
        P('Andrew Robertson', 'LB', 'SCO', 25, 26, 26, 80, 101, 'Hull City'),
        P('Virgil van Dijk', 'CB', 'NL', 27, 4, 65, 15, 100, 'Southampton'),
        P('Joël Matip', 'CB', 'CM', 27, 32, 35, 10, 27, 'Schalke 04'),
        P('Trent Alexander-Arnold', 'RB', 'ENG', 20, 66, 23, 95, 36, YOUTH),
        P('Georginio Wijnaldum', 'CM', 'NL', 28, 5, 159, 70, 96, 'Newcastle United'),
        P('Fabinho', 'DM', 'BR', 25, 3, 51, 30, 36, 'Monaco'),
        P('Jordan Henderson', 'CM', 'ENG', 28, 14, 43, 80, 91, 'Sunderland'),
        P('Sadio Mané', 'LW', 'SN', 27, 10, 259, 110, 132, 'Southampton'),
        P('Roberto Firmino', 'CF', 'BR', 27, 9, 213, 120, 55, 'Hoffenheim'),
        P('Mohamed Salah', 'RW', 'EG', 26, 11, 344, 150, 122, 'Roma')
      ]
    },

    // ───────────────────────────────── 2020s ─────────────────────────────────
    {
      id: 'bayern-2020',
      club: 'Bayern Munich',
      season: '2019–20',
      competitionStage: 'Final',
      result: 'Won 1–0 vs Paris Saint-Germain',
      formation: '4-2-3-1',
      manager: 'Hansi Flick',
      kitColors: { primary: '#dc052d', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Manuel Neuer', 'GK', 'DE', 34, 1, 0, 2, 128, 'Schalke 04'),
        P('Alphonso Davies', 'LB', 'CA', 19, 19, 31, 45, 59, 'Vancouver Whitecaps'),
        P('David Alaba', 'CB', 'AT', 28, 27, 41, 70, 117, YOUTH),
        P('Jérôme Boateng', 'CB', 'DE', 31, 17, 15, 15, 76, 'Manchester City'),
        P('Joshua Kimmich', 'RB', 'DE', 25, 32, 50, 140, 116, 'RB Leipzig'),
        P('Thiago Alcântara', 'DM', 'ES', 29, 6, 45, 60, 46, 'Barcelona'),
        P('Leon Goretzka', 'DM', 'DE', 25, 18, 74, 55, 73, 'Schalke 04'),
        P('Kingsley Coman', 'LW', 'FR', 24, 29, 90, 100, 61, 'Juventus'),
        P('Thomas Müller', 'AM', 'DE', 30, 25, 285, 270, 131, YOUTH),
        P('Serge Gnabry', 'RW', 'DE', 25, 22, 126, 75, 62, 'Werder Bremen'),
        P('Robert Lewandowski', 'ST', 'PL', 32, 9, 669, 150, 170, 'Borussia Dortmund')
      ]
    },
    {
      id: 'man-city-2023',
      club: 'Manchester City',
      season: '2022–23',
      competitionStage: 'Final',
      result: 'Won 1–0 vs Inter',
      formation: '3-2-4-1',
      manager: 'Pep Guardiola',
      kitColors: { primary: '#6cabdd', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Ederson', 'GK', 'BR', 29, 31, 0, 5, 32, 'Benfica'),
        P('Nathan Aké', 'CB', 'NL', 28, 6, 22, 15, 62, 'Bournemouth'),
        P('Rúben Dias', 'CB', 'PT', 26, 3, 18, 10, 84, 'Benfica'),
        P('Manuel Akanji', 'CB', 'CH', 27, 25, 19, 10, 91, 'Borussia Dortmund'),
        P('Rodri', 'DM', 'ES', 26, 16, 36, 40, 74, 'Atlético Madrid'),
        P('John Stones', 'DM', 'ENG', 29, 5, 21, 10, 94, 'Everton'),
        P('Jack Grealish', 'LW', 'ENG', 27, 10, 56, 80, 39, 'Aston Villa'),
        P('İlkay Gündoğan', 'CM', 'DE', 32, 8, 96, 90, 82, 'Borussia Dortmund'),
        P('Kevin De Bruyne', 'CM', 'BE', 31, 17, 163, 280, 127, 'VfL Wolfsburg'),
        P('Bernardo Silva', 'RW', 'PT', 28, 20, 112, 100, 115, 'Monaco'),
        P('Erling Haaland', 'ST', 'NO', 22, 9, 329, 60, 59, 'Borussia Dortmund')
      ]
    },
    {
      id: 'real-madrid-2024',
      club: 'Real Madrid',
      season: '2023–24',
      competitionStage: 'Final',
      result: 'Won 2–0 vs Borussia Dortmund',
      formation: '4-3-1-2',
      manager: 'Carlo Ancelotti',
      kitColors: { primary: '#f4f4f4', secondary: '#2b2f6b', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Thibaut Courtois', 'GK', 'BE', 32, 1, 0, 1, 115, 'Chelsea'),
        P('Ferland Mendy', 'LB', 'FR', 28, 23, 12, 20, 10, 'Lyon'),
        P('Nacho', 'CB', 'ES', 34, 6, 20, 8, 25, YOUTH),
        P('Antonio Rüdiger', 'CB', 'DE', 31, 22, 29, 10, 86, 'Chelsea'),
        P('Dani Carvajal', 'RB', 'ES', 32, 2, 18, 55, 52, 'Bayer Leverkusen'),
        P('Eduardo Camavinga', 'CM', 'FR', 21, 12, 12, 15, 33, 'Rennes'),
        P('Toni Kroos', 'DM', 'DE', 34, 8, 70, 160, 114, 'Bayern Munich'),
        P('Federico Valverde', 'CM', 'UY', 25, 15, 45, 40, 76, 'Peñarol'),
        P('Jude Bellingham', 'AM', 'ENG', 20, 5, 77, 50, 60, 'Borussia Dortmund'),
        P('Vinícius Júnior', 'ST', 'BR', 23, 7, 147, 90, 57, 'Flamengo'),
        P('Rodrygo', 'ST', 'BR', 23, 11, 90, 60, 37, 'Santos')
      ]
    },

    // ───────────────────────── Additional teams (batch 2) ─────────────────────────
    {
      id: 'ajax-1971',
      club: 'Ajax',
      season: '1970–71',
      competitionStage: 'Final',
      result: 'Won 2–0 vs Panathinaikos',
      formation: '4-2-4',
      manager: 'Rinus Michels',
      kitColors: { primary: '#ffffff', secondary: '#d2122e', pattern: 'band' },
      difficulty: 'hard',
      players: [
        P('Heinz Stuy', 'GK', 'NL', 26, 1, 0, 0, 0, YOUTH),
        P('Wim Suurbier', 'LB', 'NL', 26, 5, 15, 30, 60, YOUTH),
        P('Barry Hulshoff', 'CB', 'NL', 24, 3, 30, 10, 14, YOUTH),
        P('Velibor Vasović', 'SW', 'RS', 31, 4, 40, 20, 32, 'Partizan'),
        P('Johan Neeskens', 'RB', 'NL', 19, 2, 150, 90, 49, 'RCH'),
        P('Nico Rijnders', 'CM', 'NL', 23, 6, 30, 20, 8, 'Go Ahead Eagles'),
        P('Gerrie Mühren', 'CM', 'NL', 25, 8, 60, 70, 10, 'Volendam'),
        P('Piet Keizer', 'LW', 'NL', 27, 11, 190, 150, 34, YOUTH),
        P('Johan Cruyff', 'CF', 'NL', 24, 14, 400, 250, 48, YOUTH),
        P('Dick van Dijk', 'ST', 'NL', 25, 9, 110, 40, 7, 'FC Twente'),
        P('Sjaak Swart', 'RW', 'NL', 32, 7, 230, 120, 31, YOUTH)
      ]
    },
    {
      id: 'bayern-1976',
      club: 'Bayern Munich',
      season: '1975–76',
      competitionStage: 'Final',
      result: 'Won 1–0 vs Saint-Étienne',
      formation: '4-3-3',
      manager: 'Dettmar Cramer',
      kitColors: { primary: '#dc052d', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Sepp Maier', 'GK', 'DE', 32, 1, 0, 0, 95, YOUTH),
        P('Udo Horsmann', 'LB', 'DE', 24, 3, 20, 15, 0, 'SC Herford'),
        P('Franz Beckenbauer', 'SW', 'DE', 30, 5, 110, 150, 103, YOUTH),
        P('Hans-Georg Schwarzenbeck', 'CB', 'DE', 28, 4, 30, 15, 44, YOUTH),
        P('Johnny Hansen', 'RB', 'DK', 32, 2, 20, 20, 8, '1. FC Nürnberg'),
        P('Bernd Dürnberger', 'CM', 'DE', 22, 8, 50, 40, 0, YOUTH),
        P('Franz Roth', 'CM', 'DE', 30, 6, 90, 40, 4, 'SpVgg Kaufbeuren'),
        P('Jupp Kapellmann', 'CM', 'DE', 26, 10, 40, 40, 5, '1. FC Köln'),
        P('Karl-Heinz Rummenigge', 'LW', 'DE', 20, 7, 260, 120, 95, 'Borussia Lippstadt'),
        P('Gerd Müller', 'ST', 'DE', 30, 9, 650, 80, 62, 'TSV 1861 Nördlingen'),
        P('Uli Hoeneß', 'RW', 'DE', 24, 11, 120, 100, 35, 'TSV Ulm 1846')
      ]
    },
    {
      id: 'liverpool-1977',
      club: 'Liverpool',
      season: '1976–77',
      competitionStage: 'Final',
      result: 'Won 3–1 vs Borussia Mönchengladbach',
      formation: '4-4-2',
      manager: 'Bob Paisley',
      kitColors: { primary: '#c8102e', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Ray Clemence', 'GK', 'ENG', 28, 1, 0, 0, 61, 'Scunthorpe United'),
        P('Joey Jones', 'LB', 'WAL', 22, 3, 20, 20, 72, 'Wrexham'),
        P('Emlyn Hughes', 'CB', 'ENG', 29, 6, 50, 40, 62, 'Blackpool'),
        P('Tommy Smith', 'CB', 'ENG', 32, 4, 50, 25, 1, YOUTH),
        P('Phil Neal', 'RB', 'ENG', 26, 2, 70, 60, 50, 'Northampton Town'),
        P('Ray Kennedy', 'LM', 'ENG', 25, 5, 150, 80, 17, 'Arsenal'),
        P('Ian Callaghan', 'CM', 'ENG', 35, 10, 70, 120, 4, YOUTH),
        P('Terry McDermott', 'CM', 'ENG', 25, 11, 90, 70, 25, 'Newcastle United'),
        P('Jimmy Case', 'RM', 'ENG', 23, 8, 70, 50, 0, 'South Liverpool'),
        P('Steve Heighway', 'ST', 'IE', 29, 9, 60, 80, 34, 'Skelmersdale United'),
        P('Kevin Keegan', 'ST', 'ENG', 26, 7, 230, 120, 63, 'Scunthorpe United')
      ]
    },
    {
      id: 'hamburg-1983',
      club: 'Hamburger SV',
      season: '1982–83',
      competitionStage: 'Final',
      result: 'Won 1–0 vs Juventus',
      formation: '4-3-3',
      manager: 'Ernst Happel',
      kitColors: { primary: '#ffffff', secondary: '#d40f23', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Uli Stein', 'GK', 'DE', 28, 1, 0, 0, 6, 'Arminia Bielefeld'),
        P('Bernd Wehmeyer', 'LB', 'DE', 30, 3, 10, 15, 0, 'Hannover 96'),
        P('Ditmar Jakobs', 'CB', 'DE', 29, 4, 30, 10, 0, 'MSV Duisburg'),
        P('Holger Hieronymus', 'CB', 'DE', 24, 5, 5, 5, 3, YOUTH),
        P('Manfred Kaltz', 'RB', 'DE', 30, 2, 90, 120, 69, YOUTH),
        P('Jürgen Groh', 'CM', 'DE', 26, 6, 10, 20, 2, '1. FC Kaiserslautern'),
        P('Wolfgang Rolff', 'CM', 'DE', 23, 8, 40, 30, 37, 'Fortuna Köln'),
        P('Felix Magath', 'AM', 'DE', 29, 10, 60, 90, 43, '1. FC Saarbrücken'),
        P('Lars Bastrup', 'LW', 'DK', 27, 11, 80, 40, 13, 'Kickers Offenbach'),
        P('Horst Hrubesch', 'ST', 'DE', 32, 9, 230, 50, 21, 'Rot-Weiss Essen'),
        P('Jürgen Milewski', 'RW', 'DE', 25, 7, 70, 40, 3, 'Hertha BSC')
      ]
    },
    {
      id: 'real-madrid-1998',
      club: 'Real Madrid',
      season: '1997–98',
      competitionStage: 'Final',
      result: 'Won 1–0 vs Juventus',
      formation: '4-3-1-2',
      manager: 'Jupp Heynckes',
      kitColors: { primary: '#f4f4f4', secondary: '#2b2f6b', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Bodo Illgner', 'GK', 'DE', 31, 1, 0, 0, 54, '1. FC Köln'),
        P('Roberto Carlos', 'LB', 'BR', 25, 3, 110, 140, 125, 'Inter'),
        P('Manolo Sanchís', 'CB', 'ES', 32, 5, 40, 20, 48, YOUTH),
        P('Fernando Hierro', 'CB', 'ES', 30, 4, 130, 40, 89, 'Real Valladolid'),
        P('Christian Panucci', 'RB', 'IT', 25, 2, 50, 30, 57, 'AC Milan'),
        P('Clarence Seedorf', 'CM', 'NL', 22, 10, 135, 130, 87, 'Sampdoria'),
        P('Fernando Redondo', 'DM', 'AR', 28, 6, 20, 40, 29, 'Tenerife'),
        P('Christian Karembeu', 'CM', 'FR', 27, 14, 30, 25, 53, 'Sampdoria'),
        P('Raúl', 'AM', 'ES', 20, 7, 404, 120, 102, YOUTH),
        P('Predrag Mijatović', 'ST', 'ME', 29, 8, 200, 60, 73, 'Valencia'),
        P('Fernando Morientes', 'ST', 'ES', 22, 9, 200, 50, 47, 'Real Zaragoza')
      ]
    },
    {
      id: 'barcelona-2006',
      club: 'Barcelona',
      season: '2005–06',
      competitionStage: 'Final',
      result: 'Won 2–1 vs Arsenal',
      formation: '4-3-3',
      manager: 'Frank Rijkaard',
      kitColors: { primary: '#a50044', secondary: '#004d98', pattern: 'stripes' },
      difficulty: 'easy',
      players: [
        P('Víctor Valdés', 'GK', 'ES', 24, 1, 0, 0, 20, YOUTH),
        P('Giovanni van Bronckhorst', 'LB', 'NL', 31, 12, 60, 40, 106, 'Arsenal'),
        P('Carles Puyol', 'CB', 'ES', 28, 5, 20, 15, 100, YOUTH),
        P('Rafael Márquez', 'CB', 'MX', 27, 4, 40, 20, 147, 'Monaco'),
        P('Oleguer', 'RB', 'ES', 26, 23, 5, 10, 0, YOUTH),
        P('Deco', 'CM', 'PT', 28, 20, 100, 120, 75, 'Porto'),
        P('Edmílson', 'DM', 'BR', 29, 15, 25, 15, 42, 'Lyon'),
        P('Mark van Bommel', 'CM', 'NL', 29, 17, 80, 50, 79, 'PSV Eindhoven'),
        P('Ronaldinho', 'LW', 'BR', 26, 10, 250, 200, 97, 'Paris Saint-Germain'),
        P("Samuel Eto'o", 'ST', 'CM', 25, 9, 380, 110, 118, 'Mallorca'),
        P('Ludovic Giuly', 'RW', 'FR', 29, 8, 130, 80, 17, 'Monaco')
      ]
    },
    {
      id: 'milan-2007',
      club: 'AC Milan',
      season: '2006–07',
      competitionStage: 'Final',
      result: 'Won 2–1 vs Liverpool',
      formation: '4-3-2-1',
      manager: 'Carlo Ancelotti',
      kitColors: { primary: '#c8102e', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'easy',
      players: [
        P('Dida', 'GK', 'BR', 33, 1, 0, 0, 91, 'Corinthians'),
        P('Marek Jankulovski', 'LB', 'CZ', 30, 18, 40, 40, 77, 'Udinese'),
        P('Paolo Maldini', 'CB', 'IT', 38, 3, 33, 40, 126, YOUTH),
        P('Alessandro Nesta', 'CB', 'IT', 31, 13, 13, 10, 78, 'Lazio'),
        P('Massimo Oddo', 'RB', 'IT', 30, 44, 30, 50, 34, 'Lazio'),
        P('Massimo Ambrosini', 'CM', 'IT', 29, 23, 35, 25, 35, 'Cesena'),
        P('Andrea Pirlo', 'DM', 'IT', 28, 21, 73, 120, 116, 'Inter'),
        P('Gennaro Gattuso', 'CM', 'IT', 29, 8, 17, 30, 73, 'Salernitana'),
        P('Clarence Seedorf', 'AM', 'NL', 31, 10, 135, 130, 87, 'Inter'),
        P('Kaká', 'AM', 'BR', 25, 22, 208, 110, 92, 'São Paulo'),
        P('Filippo Inzaghi', 'ST', 'IT', 33, 9, 310, 40, 57, 'Juventus')
      ]
    },
    {
      id: 'atletico-2014',
      club: 'Atlético Madrid',
      season: '2013–14',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 1–4 (a.e.t.) vs Real Madrid',
      formation: '4-4-2',
      manager: 'Diego Simeone',
      kitColors: { primary: '#cb3524', secondary: '#ffffff', pattern: 'stripes' },
      difficulty: 'medium',
      players: [
        P('Thibaut Courtois', 'GK', 'BE', 22, 13, 0, 1, 115, 'Genk'),
        P('Filipe Luís', 'LB', 'BR', 28, 3, 30, 60, 44, 'Deportivo La Coruña'),
        P('Miranda', 'CB', 'BR', 29, 23, 25, 10, 49, 'São Paulo'),
        P('Diego Godín', 'CB', 'UY', 28, 2, 50, 15, 161, 'Villarreal'),
        P('Juanfran', 'RB', 'ES', 29, 20, 20, 40, 22, 'Osasuna'),
        P('Koke', 'LM', 'ES', 22, 6, 57, 120, 70, YOUTH),
        P('Gabi', 'CM', 'ES', 30, 14, 25, 40, 0, 'Real Zaragoza'),
        P('Tiago', 'CM', 'PT', 33, 5, 45, 50, 66, 'Juventus'),
        P('Raúl García', 'RM', 'ES', 27, 8, 120, 60, 0, 'Osasuna'),
        P('David Villa', 'ST', 'ES', 32, 7, 380, 100, 98, 'Barcelona'),
        P('Diego Costa', 'ST', 'ES', 25, 19, 220, 60, 26, 'Braga')
      ]
    },
    {
      id: 'barcelona-2015',
      club: 'Barcelona',
      season: '2014–15',
      competitionStage: 'Final',
      result: 'Won 3–1 vs Juventus',
      formation: '4-3-3',
      manager: 'Luis Enrique',
      kitColors: { primary: '#a50044', secondary: '#004d98', pattern: 'stripes' },
      difficulty: 'easy',
      players: [
        P('Marc-André ter Stegen', 'GK', 'DE', 23, 1, 0, 1, 45, 'Borussia Mönchengladbach'),
        P('Jordi Alba', 'LB', 'ES', 26, 18, 30, 120, 93, 'Valencia'),
        P('Javier Mascherano', 'CB', 'AR', 30, 14, 5, 15, 147, 'Liverpool'),
        P('Gerard Piqué', 'CB', 'ES', 28, 3, 50, 20, 102, 'Manchester United'),
        P('Dani Alves', 'RB', 'BR', 32, 22, 45, 130, 126, 'Sevilla'),
        P('Andrés Iniesta', 'CM', 'ES', 31, 8, 90, 160, 131, YOUTH),
        P('Sergio Busquets', 'DM', 'ES', 26, 5, 20, 45, 143, YOUTH),
        P('Ivan Rakitić', 'CM', 'HR', 27, 4, 110, 90, 106, 'Sevilla'),
        P('Neymar', 'LW', 'BR', 23, 11, 381, 200, 130, 'Santos'),
        P('Luis Suárez', 'ST', 'UY', 28, 9, 546, 230, 143, 'Liverpool'),
        P('Lionel Messi', 'RW', 'AR', 27, 10, 821, 370, 208, YOUTH)
      ]
    },
    {
      id: 'juventus-2015',
      club: 'Juventus',
      season: '2014–15',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 1–3 vs Barcelona',
      formation: '4-3-1-2',
      manager: 'Massimiliano Allegri',
      kitColors: { primary: '#ffffff', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'medium',
      players: [
        P('Gianluigi Buffon', 'GK', 'IT', 37, 1, 0, 0, 176, 'Parma'),
        P('Patrice Evra', 'LB', 'FR', 34, 33, 25, 50, 81, 'Manchester United'),
        P('Leonardo Bonucci', 'CB', 'IT', 28, 19, 50, 15, 121, 'Bari'),
        P('Andrea Barzagli', 'CB', 'IT', 34, 15, 10, 8, 73, 'VfL Wolfsburg'),
        P('Stephan Lichtsteiner', 'RB', 'CH', 31, 26, 30, 50, 108, 'Lazio'),
        P('Paul Pogba', 'CM', 'FR', 22, 6, 90, 90, 91, 'Manchester United'),
        P('Andrea Pirlo', 'DM', 'IT', 36, 21, 73, 120, 116, 'AC Milan'),
        P('Claudio Marchisio', 'CM', 'IT', 29, 8, 40, 40, 55, YOUTH),
        P('Arturo Vidal', 'AM', 'CL', 28, 23, 129, 100, 147, 'Bayer Leverkusen'),
        P('Carlos Tevez', 'ST', 'AR', 31, 10, 320, 120, 76, 'Manchester City'),
        P('Álvaro Morata', 'ST', 'ES', 22, 9, 231, 80, 87, 'Real Madrid')
      ]
    },
    {
      id: 'tottenham-2019',
      club: 'Tottenham Hotspur',
      season: '2018–19',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 0–2 vs Liverpool',
      formation: '4-2-3-1',
      manager: 'Mauricio Pochettino',
      kitColors: { primary: '#ffffff', secondary: '#132257', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Hugo Lloris', 'GK', 'FR', 32, 1, 0, 0, 145, 'Lyon'),
        P('Danny Rose', 'LB', 'ENG', 28, 3, 15, 25, 29, 'Leeds United'),
        P('Jan Vertonghen', 'CB', 'BE', 32, 5, 50, 30, 157, 'Ajax'),
        P('Toby Alderweireld', 'CB', 'BE', 30, 4, 30, 15, 127, 'Atlético Madrid'),
        P('Kieran Trippier', 'RB', 'ENG', 28, 2, 15, 70, 54, 'Burnley'),
        P('Harry Winks', 'DM', 'ENG', 23, 8, 10, 15, 10, YOUTH),
        P('Moussa Sissoko', 'DM', 'FR', 30, 17, 51, 40, 71, 'Newcastle United'),
        P('Son Heung-min', 'LW', 'KR', 26, 7, 244, 110, 151, 'Bayer Leverkusen'),
        P('Dele Alli', 'AM', 'ENG', 23, 20, 70, 60, 37, 'MK Dons'),
        P('Christian Eriksen', 'RW', 'DK', 27, 23, 140, 170, 145, 'Ajax'),
        P('Harry Kane', 'ST', 'ENG', 25, 10, 452, 80, 125, YOUTH)
      ]
    },
    {
      id: 'chelsea-2021',
      club: 'Chelsea',
      season: '2020–21',
      competitionStage: 'Final',
      result: 'Won 1–0 vs Manchester City',
      formation: '3-4-2-1',
      manager: 'Thomas Tuchel',
      kitColors: { primary: '#034694', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Édouard Mendy', 'GK', 'SN', 29, 16, 0, 0, 60, 'Rennes'),
        P('Antonio Rüdiger', 'CB', 'DE', 28, 2, 29, 10, 86, 'Roma'),
        P('Thiago Silva', 'CB', 'BR', 36, 6, 56, 10, 113, 'Paris Saint-Germain'),
        P('César Azpilicueta', 'CB', 'ES', 31, 28, 20, 60, 44, 'Marseille'),
        P('Ben Chilwell', 'LWB', 'ENG', 24, 21, 15, 30, 21, 'Leicester City'),
        P('Jorginho', 'CM', 'IT', 29, 5, 58, 25, 57, 'Napoli'),
        P("N'Golo Kanté", 'CM', 'FR', 30, 7, 36, 25, 69, 'Leicester City'),
        P('Reece James', 'RWB', 'ENG', 21, 24, 20, 30, 29, YOUTH),
        P('Mason Mount', 'AM', 'ENG', 22, 19, 66, 50, 36, YOUTH),
        P('Kai Havertz', 'AM', 'DE', 21, 29, 117, 60, 63, 'Bayer Leverkusen'),
        P('Timo Werner', 'ST', 'DE', 25, 11, 160, 80, 57, 'RB Leipzig')
      ]
    },
    {
      id: 'real-madrid-2022',
      club: 'Real Madrid',
      season: '2021–22',
      competitionStage: 'Final',
      result: 'Won 1–0 vs Liverpool',
      formation: '4-3-3',
      manager: 'Carlo Ancelotti',
      kitColors: { primary: '#f4f4f4', secondary: '#2b2f6b', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Thibaut Courtois', 'GK', 'BE', 30, 1, 0, 1, 115, 'Chelsea'),
        P('Ferland Mendy', 'LB', 'FR', 26, 23, 12, 20, 10, 'Lyon'),
        P('David Alaba', 'CB', 'AT', 29, 4, 41, 70, 117, 'Bayern Munich'),
        P('Éder Militão', 'CB', 'BR', 24, 3, 23, 5, 38, 'Porto'),
        P('Dani Carvajal', 'RB', 'ES', 30, 2, 18, 55, 52, 'Bayer Leverkusen'),
        P('Toni Kroos', 'CM', 'DE', 32, 8, 70, 160, 114, 'Bayern Munich'),
        P('Casemiro', 'DM', 'BR', 30, 14, 77, 40, 91, 'São Paulo'),
        P('Luka Modrić', 'CM', 'HR', 36, 10, 106, 160, 206, 'Tottenham Hotspur'),
        P('Vinícius Júnior', 'LW', 'BR', 21, 20, 147, 90, 57, 'Flamengo'),
        P('Karim Benzema', 'ST', 'FR', 34, 9, 450, 200, 97, 'Lyon'),
        P('Federico Valverde', 'RW', 'UY', 23, 15, 45, 40, 76, 'Peñarol')
      ]
    },
    {
      id: 'psg-2025',
      club: 'Paris Saint-Germain',
      season: '2024–25',
      competitionStage: 'Final',
      result: 'Won 5–0 vs Inter',
      formation: '4-3-3',
      manager: 'Luis Enrique',
      kitColors: { primary: '#004170', secondary: '#da291c', pattern: 'band' },
      difficulty: 'easy',
      players: [
        P('Gianluigi Donnarumma', 'GK', 'IT', 26, 1, 0, 0, 87, 'AC Milan'),
        P('Nuno Mendes', 'LB', 'PT', 22, 25, 15, 25, 53, 'Sporting CP'),
        P('Willian Pacho', 'CB', 'EC', 23, 51, 2, 3, 41, 'Eintracht Frankfurt'),
        P('Marquinhos', 'CB', 'BR', 31, 5, 46, 15, 112, 'Roma'),
        P('Achraf Hakimi', 'RB', 'MA', 26, 2, 50, 80, 103, 'Inter'),
        P('Fabián Ruiz', 'CM', 'ES', 29, 8, 47, 40, 52, 'Napoli'),
        P('Vitinha', 'DM', 'PT', 25, 17, 42, 30, 47, 'Porto'),
        P('João Neves', 'CM', 'PT', 20, 87, 18, 20, 30, 'Benfica'),
        P('Khvicha Kvaratskhelia', 'LW', 'GE', 24, 7, 81, 80, 54, 'Napoli'),
        P('Ousmane Dembélé', 'CF', 'FR', 28, 10, 141, 110, 71, 'Barcelona'),
        P('Désiré Doué', 'RW', 'FR', 19, 14, 43, 20, 19, 'Rennes')
      ]
    },

    // ───────────────────────── Batch 3: famous losing finalists ─────────────────────────
    {
      id: 'bayern-1999',
      club: 'Bayern Munich',
      season: '1998–99',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 1–2 vs Manchester United',
      formation: '3-5-2',
      manager: 'Ottmar Hitzfeld',
      kitColors: { primary: '#dc052d', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Oliver Kahn', 'GK', 'DE', 29, 1, 0, 0, 86, 'Karlsruher SC'),
        P('Thomas Linke', 'CB', 'DE', 29, 25, 25, 10, 43, 'Schalke 04'),
        P('Lothar Matthäus', 'SW', 'DE', 38, 10, 200, 120, 150, 'Inter'),
        P('Samuel Kuffour', 'CB', 'GH', 22, 4, 20, 10, 59, 'Torino'),
        P('Michael Tarnat', 'LM', 'DE', 29, 18, 50, 50, 19, 'Karlsruher SC'),
        P('Stefan Effenberg', 'CM', 'DE', 30, 11, 120, 130, 35, 'Borussia Mönchengladbach'),
        P('Jens Jeremies', 'DM', 'DE', 25, 16, 15, 20, 55, '1860 Munich'),
        P('Mario Basler', 'CM', 'DE', 30, 14, 90, 100, 30, 'Werder Bremen'),
        P('Markus Babbel', 'RM', 'DE', 26, 2, 20, 30, 51, 'Hamburger SV'),
        P('Alexander Zickler', 'ST', 'DE', 25, 21, 90, 40, 12, 'Dynamo Dresden'),
        P('Carsten Jancker', 'ST', 'DE', 24, 19, 90, 50, 33, 'Rapid Wien')
      ]
    },
    {
      id: 'valencia-2000',
      club: 'Valencia',
      season: '1999–2000',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 0–3 vs Real Madrid',
      formation: '4-4-2',
      manager: 'Héctor Cúper',
      kitColors: { primary: '#ffffff', secondary: '#111111', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Santiago Cañizares', 'GK', 'ES', 30, 1, 0, 0, 46, 'Celta Vigo'),
        P('Gerardo', 'LB', 'ES', 27, 3, 5, 10, 0, YOUTH),
        P('Mauricio Pellegrino', 'CB', 'AR', 28, 5, 15, 5, 3, 'Barcelona'),
        P('Miroslav Đukić', 'CB', 'RS', 33, 4, 60, 15, 48, 'Deportivo La Coruña'),
        P('Jocelyn Angloma', 'RB', 'FR', 34, 2, 15, 30, 37, 'Inter'),
        P('Kily González', 'LM', 'AR', 25, 11, 50, 80, 57, 'Real Zaragoza'),
        P('Gerard López', 'CM', 'ES', 21, 10, 40, 30, 6, YOUTH),
        P('Gaizka Mendieta', 'CM', 'ES', 26, 6, 70, 90, 40, 'Castellón'),
        P('Javier Farinós', 'RM', 'ES', 22, 8, 15, 20, 2, YOUTH),
        P('Claudio López', 'ST', 'AR', 25, 9, 130, 60, 55, 'Racing Club'),
        P('Miguel Ángel Angulo', 'ST', 'ES', 23, 17, 60, 40, 11, YOUTH)
      ]
    },
    {
      id: 'arsenal-2006',
      club: 'Arsenal',
      season: '2005–06',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 1–2 vs Barcelona',
      formation: '4-5-1',
      manager: 'Arsène Wenger',
      kitColors: { primary: '#9c1b2f', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Jens Lehmann', 'GK', 'DE', 36, 1, 2, 0, 61, 'Borussia Dortmund'),
        P('Ashley Cole', 'LB', 'ENG', 25, 3, 15, 40, 107, YOUTH),
        P('Sol Campbell', 'CB', 'ENG', 31, 23, 30, 15, 73, 'Tottenham Hotspur'),
        P('Kolo Touré', 'CB', 'CI', 25, 28, 25, 15, 120, 'ASEC Mimosas'),
        P('Emmanuel Eboué', 'RB', 'CI', 23, 27, 20, 30, 79, 'Beveren'),
        P('Robert Pirès', 'LM', 'FR', 33, 7, 170, 150, 79, 'Marseille'),
        P('Cesc Fàbregas', 'CM', 'ES', 19, 15, 120, 250, 110, 'Barcelona'),
        P('Gilberto Silva', 'DM', 'BR', 29, 19, 25, 30, 93, 'Atlético Mineiro'),
        P('Alexander Hleb', 'CM', 'BY', 25, 13, 40, 80, 80, 'VfB Stuttgart'),
        P('Freddie Ljungberg', 'RM', 'SE', 29, 8, 90, 70, 75, 'Halmstads BK'),
        P('Thierry Henry', 'ST', 'FR', 28, 14, 360, 170, 123, 'Juventus')
      ]
    },
    {
      id: 'liverpool-2007',
      club: 'Liverpool',
      season: '2006–07',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 1–2 vs AC Milan',
      formation: '4-4-1-1',
      manager: 'Rafael Benítez',
      kitColors: { primary: '#c8102e', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Pepe Reina', 'GK', 'ES', 24, 25, 0, 2, 36, 'Villarreal'),
        P('John Arne Riise', 'LB', 'NO', 26, 6, 60, 60, 110, 'Monaco'),
        P('Daniel Agger', 'CB', 'DK', 22, 5, 15, 15, 75, 'Brøndby'),
        P('Jamie Carragher', 'CB', 'ENG', 29, 23, 5, 10, 38, YOUTH),
        P('Steve Finnan', 'RB', 'IE', 31, 3, 30, 40, 53, 'Fulham'),
        P('Boudewijn Zenden', 'LM', 'NL', 30, 32, 50, 60, 54, 'Middlesbrough'),
        P('Javier Mascherano', 'DM', 'AR', 22, 20, 5, 15, 147, 'West Ham United'),
        P('Xabi Alonso', 'CM', 'ES', 25, 14, 40, 60, 114, 'Real Sociedad'),
        P('Jermaine Pennant', 'RM', 'ENG', 24, 16, 25, 50, 1, 'Birmingham City'),
        P('Steven Gerrard', 'AM', 'ENG', 26, 8, 200, 150, 114, YOUTH),
        P('Dirk Kuyt', 'ST', 'NL', 26, 18, 230, 100, 104, 'Feyenoord')
      ]
    },
    {
      id: 'chelsea-2008',
      club: 'Chelsea',
      season: '2007–08',
      competitionStage: 'Final (runners-up)',
      result: 'Drew 1–1 vs Manchester United, lost 5–6 on penalties',
      formation: '4-3-3',
      manager: 'Avram Grant',
      kitColors: { primary: '#034694', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Petr Čech', 'GK', 'CZ', 25, 1, 0, 0, 124, 'Rennes'),
        P('Ashley Cole', 'LB', 'ENG', 27, 3, 15, 40, 107, 'Arsenal'),
        P('John Terry', 'CB', 'ENG', 27, 26, 70, 20, 78, YOUTH),
        P('Ricardo Carvalho', 'CB', 'PT', 29, 6, 25, 10, 75, 'Porto'),
        P('Michael Essien', 'RB', 'GH', 25, 5, 60, 40, 58, 'Lyon'),
        P('Michael Ballack', 'CM', 'DE', 31, 13, 149, 100, 98, 'Bayern Munich'),
        P('Claude Makélélé', 'DM', 'FR', 35, 4, 15, 20, 71, 'Real Madrid'),
        P('Frank Lampard', 'CM', 'ENG', 29, 8, 300, 180, 106, 'West Ham United'),
        P('Florent Malouda', 'LW', 'FR', 27, 15, 100, 100, 80, 'Lyon'),
        P('Didier Drogba', 'ST', 'CI', 30, 11, 330, 130, 104, 'Marseille'),
        P('Joe Cole', 'RW', 'ENG', 26, 10, 90, 90, 56, 'West Ham United')
      ]
    },
    {
      id: 'man-united-2009',
      club: 'Manchester United',
      season: '2008–09',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 0–2 vs Barcelona',
      formation: '4-3-3',
      manager: 'Alex Ferguson',
      kitColors: { primary: '#da291c', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('Edwin van der Sar', 'GK', 'NL', 38, 1, 1, 0, 130, 'Fulham'),
        P('Patrice Evra', 'LB', 'FR', 28, 3, 25, 50, 81, 'Monaco'),
        P('Nemanja Vidić', 'CB', 'RS', 27, 15, 30, 8, 56, 'Spartak Moscow'),
        P('Rio Ferdinand', 'CB', 'ENG', 30, 5, 13, 10, 81, 'Leeds United'),
        P("John O'Shea", 'RB', 'IE', 28, 22, 15, 20, 118, YOUTH),
        P('Anderson', 'CM', 'BR', 21, 8, 15, 20, 8, 'Porto'),
        P('Michael Carrick', 'DM', 'ENG', 27, 16, 35, 60, 34, 'Tottenham Hotspur'),
        P('Ryan Giggs', 'CM', 'WAL', 35, 11, 170, 270, 64, YOUTH),
        P('Wayne Rooney', 'LW', 'ENG', 23, 10, 310, 150, 120, 'Everton'),
        P('Cristiano Ronaldo', 'CF', 'PT', 24, 7, 835, 250, 234, 'Sporting CP'),
        P('Park Ji-sung', 'RW', 'KR', 28, 13, 60, 50, 100, 'PSV Eindhoven')
      ]
    },
    {
      id: 'bayern-2010',
      club: 'Bayern Munich',
      season: '2009–10',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 0–2 vs Inter',
      formation: '4-2-3-1',
      manager: 'Louis van Gaal',
      kitColors: { primary: '#dc052d', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Hans-Jörg Butt', 'GK', 'DE', 35, 22, 35, 0, 4, 'Benfica'),
        P('Holger Badstuber', 'LB', 'DE', 21, 28, 10, 10, 31, YOUTH),
        P('Martín Demichelis', 'CB', 'AR', 29, 6, 30, 15, 51, 'River Plate'),
        P('Daniel Van Buyten', 'CB', 'BE', 32, 5, 60, 15, 84, 'Hamburger SV'),
        P('Philipp Lahm', 'RB', 'DE', 26, 21, 30, 90, 113, YOUTH),
        P('Bastian Schweinsteiger', 'DM', 'DE', 25, 31, 85, 100, 121, YOUTH),
        P('Mark van Bommel', 'DM', 'NL', 33, 17, 80, 50, 79, 'Barcelona'),
        P('Hamit Altıntop', 'LW', 'TR', 27, 8, 50, 50, 82, 'Schalke 04'),
        P('Thomas Müller', 'AM', 'DE', 20, 25, 285, 270, 131, YOUTH),
        P('Arjen Robben', 'RW', 'NL', 26, 10, 250, 160, 96, 'Real Madrid'),
        P('Ivica Olić', 'ST', 'HR', 30, 11, 180, 60, 104, 'Hamburger SV')
      ]
    },
    {
      id: 'juventus-2017',
      club: 'Juventus',
      season: '2016–17',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 1–4 vs Real Madrid',
      formation: '3-4-2-1',
      manager: 'Massimiliano Allegri',
      kitColors: { primary: '#ffffff', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'medium',
      players: [
        P('Gianluigi Buffon', 'GK', 'IT', 39, 1, 0, 0, 176, 'Parma'),
        P('Giorgio Chiellini', 'CB', 'IT', 32, 3, 40, 15, 117, 'Fiorentina'),
        P('Leonardo Bonucci', 'CB', 'IT', 30, 19, 50, 15, 121, 'Bari'),
        P('Andrea Barzagli', 'CB', 'IT', 36, 15, 10, 8, 73, 'VfL Wolfsburg'),
        P('Alex Sandro', 'LWB', 'BR', 26, 12, 24, 45, 46, 'Porto'),
        P('Miralem Pjanić', 'CM', 'BA', 27, 5, 90, 120, 115, 'Roma'),
        P('Sami Khedira', 'CM', 'DE', 30, 6, 60, 40, 77, 'Real Madrid'),
        P('Dani Alves', 'RWB', 'BR', 34, 23, 45, 130, 126, 'Barcelona'),
        P('Mario Mandžukić', 'AM', 'HR', 31, 17, 230, 70, 89, 'Atlético Madrid'),
        P('Paulo Dybala', 'AM', 'AR', 23, 21, 198, 90, 40, 'Palermo'),
        P('Gonzalo Higuaín', 'ST', 'AR', 29, 9, 330, 110, 75, 'Napoli')
      ]
    },
    {
      id: 'liverpool-2018',
      club: 'Liverpool',
      season: '2017–18',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 1–3 vs Real Madrid',
      formation: '4-3-3',
      manager: 'Jürgen Klopp',
      kitColors: { primary: '#c8102e', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Loris Karius', 'GK', 'DE', 24, 1, 0, 0, 0, 'Mainz 05'),
        P('Andrew Robertson', 'LB', 'SCO', 24, 26, 26, 80, 101, 'Hull City'),
        P('Virgil van Dijk', 'CB', 'NL', 26, 4, 65, 15, 100, 'Southampton'),
        P('Dejan Lovren', 'CB', 'HR', 28, 6, 20, 10, 64, 'Southampton'),
        P('Trent Alexander-Arnold', 'RB', 'ENG', 19, 66, 23, 95, 36, YOUTH),
        P('Georginio Wijnaldum', 'CM', 'NL', 27, 5, 159, 70, 96, 'Newcastle United'),
        P('Jordan Henderson', 'DM', 'ENG', 27, 14, 43, 80, 91, 'Sunderland'),
        P('James Milner', 'CM', 'ENG', 32, 7, 90, 120, 61, 'Manchester City'),
        P('Sadio Mané', 'LW', 'SN', 26, 19, 259, 110, 132, 'Southampton'),
        P('Roberto Firmino', 'CF', 'BR', 26, 9, 213, 120, 55, 'Hoffenheim'),
        P('Mohamed Salah', 'RW', 'EG', 25, 11, 344, 150, 122, 'Roma')
      ]
    },
    {
      id: 'psg-2020',
      club: 'Paris Saint-Germain',
      season: '2019–20',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 0–1 vs Bayern Munich',
      formation: '4-3-3',
      manager: 'Thomas Tuchel',
      kitColors: { primary: '#004170', secondary: '#da291c', pattern: 'band' },
      difficulty: 'medium',
      players: [
        P('Keylor Navas', 'GK', 'CR', 33, 1, 0, 0, 129, 'Real Madrid'),
        P('Juan Bernat', 'LB', 'ES', 27, 14, 23, 50, 11, 'Bayern Munich'),
        P('Presnel Kimpembe', 'CB', 'FR', 25, 3, 4, 10, 28, YOUTH),
        P('Thiago Silva', 'CB', 'BR', 35, 2, 56, 10, 113, 'AC Milan'),
        P('Thilo Kehrer', 'RB', 'DE', 23, 4, 14, 10, 28, 'Schalke 04'),
        P('Leandro Paredes', 'CM', 'AR', 26, 8, 39, 40, 84, 'Zenit Saint Petersburg'),
        P('Marquinhos', 'DM', 'BR', 26, 5, 46, 15, 112, 'Roma'),
        P('Ander Herrera', 'CM', 'ES', 31, 21, 46, 40, 2, 'Manchester United'),
        P('Neymar', 'LW', 'BR', 28, 10, 381, 200, 130, 'Barcelona'),
        P('Kylian Mbappé', 'CF', 'FR', 21, 7, 385, 140, 107, 'Monaco'),
        P('Ángel Di María', 'RW', 'AR', 32, 11, 218, 260, 145, 'Manchester United')
      ]
    },
    {
      id: 'inter-2023',
      club: 'Inter',
      season: '2022–23',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 0–1 vs Manchester City',
      formation: '3-5-2',
      manager: 'Simone Inzaghi',
      kitColors: { primary: '#0050a0', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'medium',
      players: [
        P('André Onana', 'GK', 'CM', 27, 24, 0, 1, 53, 'Ajax'),
        P('Alessandro Bastoni', 'CB', 'IT', 24, 95, 9, 30, 46, 'Atalanta'),
        P('Francesco Acerbi', 'CB', 'IT', 35, 15, 30, 15, 35, 'Lazio'),
        P('Matteo Darmian', 'CB', 'IT', 33, 36, 22, 30, 46, 'Torino'),
        P('Federico Dimarco', 'LWB', 'IT', 25, 32, 32, 50, 38, YOUTH),
        P('Hakan Çalhanoğlu', 'CM', 'TR', 29, 20, 141, 120, 108, 'AC Milan'),
        P('Marcelo Brozović', 'DM', 'HR', 30, 77, 59, 90, 99, 'Dinamo Zagreb'),
        P('Nicolò Barella', 'CM', 'IT', 26, 23, 36, 80, 73, 'Cagliari'),
        P('Denzel Dumfries', 'RWB', 'NL', 27, 2, 49, 45, 82, 'PSV Eindhoven'),
        P('Lautaro Martínez', 'ST', 'AR', 25, 10, 208, 60, 87, 'Racing Club'),
        P('Edin Džeko', 'ST', 'BA', 37, 9, 389, 120, 152, 'Roma')
      ]
    },
    {
      id: 'dortmund-2024',
      club: 'Borussia Dortmund',
      season: '2023–24',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 0–2 vs Real Madrid',
      formation: '4-2-3-1',
      manager: 'Edin Terzić',
      kitColors: { primary: '#fde100', secondary: '#111111', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Gregor Kobel', 'GK', 'CH', 27, 1, 0, 0, 30, 'VfB Stuttgart'),
        P('Ian Maatsen', 'LB', 'NL', 22, 22, 14, 20, 1, 'Chelsea (loan)'),
        P('Nico Schlotterbeck', 'CB', 'DE', 24, 4, 20, 10, 30, 'SC Freiburg'),
        P('Mats Hummels', 'CB', 'DE', 35, 15, 50, 30, 78, 'Bayern Munich'),
        P('Julian Ryerson', 'RB', 'NO', 26, 26, 17, 40, 50, 'Union Berlin'),
        P('Marcel Sabitzer', 'DM', 'AT', 30, 20, 115, 70, 102, 'Bayern Munich'),
        P('Emre Can', 'DM', 'DE', 30, 23, 49, 30, 48, 'Juventus'),
        P('Jadon Sancho', 'LW', 'ENG', 24, 10, 70, 80, 23, 'Manchester United (loan)'),
        P('Julian Brandt', 'AM', 'DE', 27, 19, 105, 90, 48, 'Bayer Leverkusen'),
        P('Karim Adeyemi', 'RW', 'DE', 22, 27, 88, 30, 13, 'Red Bull Salzburg'),
        P('Niclas Füllkrug', 'ST', 'DE', 31, 14, 133, 40, 24, 'Werder Bremen')
      ]
    },

    // ───────────────── Batch 4: approved semi-finals and finals (line-ups from Wikipedia / match reports) ─────────────────
    {
      id: 'juventus-1996',
      club: 'Juventus',
      season: '1995–96',
      competitionStage: 'Final',
      result: 'Drew 1–1 vs Ajax, won 4–2 on penalties',
      formation: '4-3-3',
      manager: 'Marcello Lippi',
      kitColors: { primary: '#ffffff', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'medium',
      players: [
        P('Angelo Peruzzi', 'GK', 'IT', 26, 1, 0, 0, 31, 'Roma'),
        P('Gianluca Pessotto', 'LB', 'IT', 25, 3, 10, 20, 22, 'Torino'),
        P('Pietro Vierchowod', 'CB', 'IT', 37, 5, 48, 10, 45, 'Sampdoria'),
        P('Ciro Ferrara', 'CB', 'IT', 29, 2, 35, 20, 49, 'Napoli'),
        P('Moreno Torricelli', 'RB', 'IT', 26, 4, 8, 15, 10, 'Caratese'),
        P('Antonio Conte', 'LM', 'IT', 26, 8, 46, 40, 20, 'Lecce'),
        P('Paulo Sousa', 'CM', 'PT', 25, 6, 9, 30, 51, 'Sporting CP'),
        P('Didier Deschamps', 'RM', 'FR', 27, 7, 21, 40, 103, 'Marseille'),
        P('Alessandro Del Piero', 'LF', 'IT', 21, 10, 316, 160, 91, 'Padova'),
        P('Fabrizio Ravanelli', 'CF', 'IT', 27, 11, 247, 60, 22, 'Reggiana'),
        P('Gianluca Vialli', 'RF', 'IT', 31, 9, 259, 90, 59, 'Sampdoria')
      ]
    },
    {
      id: 'leverkusen-2002',
      club: 'Bayer Leverkusen',
      season: '2001–02',
      competitionStage: 'Final (runners-up)',
      result: 'Lost 1–2 vs Real Madrid',
      formation: '4-4-1-1',
      manager: 'Klaus Toppmöller',
      kitColors: { primary: '#e32221', secondary: '#111111', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Hans-Jörg Butt', 'GK', 'DE', 27, 1, 35, 0, 4, 'Hamburger SV'),
        P('Diego Placente', 'LB', 'AR', 25, 35, 10, 25, 22, 'River Plate'),
        P('Lúcio', 'CB', 'BR', 24, 19, 49, 15, 105, 'Internacional'),
        P('Boris Živković', 'CB', 'HR', 26, 6, 17, 10, 39, 'Hrvatski Dragovoljac'),
        P('Zoltán Sebescen', 'RB', 'DE', 26, 26, 23, 15, 1, 'VfL Wolfsburg'),
        P('Thomas Brdarić', 'LM', 'DE', 27, 23, 106, 40, 8, 'Fortuna Köln'),
        P('Michael Ballack', 'CM', 'DE', 25, 13, 149, 100, 98, '1. FC Kaiserslautern'),
        P('Carsten Ramelow', 'DM', 'DE', 28, 28, 40, 30, 46, 'Hertha BSC'),
        P('Bernd Schneider', 'RM', 'DE', 28, 25, 73, 110, 81, 'Eintracht Frankfurt'),
        P('Yıldıray Baştürk', 'AM', 'TR', 23, 10, 52, 70, 49, 'VfL Bochum'),
        P('Oliver Neuville', 'CF', 'DE', 29, 27, 177, 80, 69, 'Hansa Rostock')
      ]
    },
    {
      id: 'juventus-2003',
      club: 'Juventus',
      season: '2002–03',
      competitionStage: 'Final (runners-up)',
      result: 'Drew 0–0 vs AC Milan, lost 2–3 on penalties',
      formation: '4-4-2',
      manager: 'Marcello Lippi',
      kitColors: { primary: '#ffffff', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'medium',
      players: [
        P('Gianluigi Buffon', 'GK', 'IT', 25, 1, 0, 0, 176, 'Parma'),
        P('Paolo Montero', 'LB', 'UY', 31, 4, 9, 10, 61, 'Atalanta'),
        P('Igor Tudor', 'CB', 'HR', 25, 5, 32, 10, 55, 'Hajduk Split'),
        P('Ciro Ferrara', 'CB', 'IT', 36, 2, 35, 20, 49, 'Napoli'),
        P('Lilian Thuram', 'RB', 'FR', 31, 21, 13, 25, 142, 'Parma'),
        P('Gianluca Zambrotta', 'LM', 'IT', 26, 19, 29, 45, 98, 'Bari'),
        P('Edgar Davids', 'CM', 'NL', 30, 26, 39, 50, 74, 'AC Milan'),
        P('Alessio Tacchinardi', 'CM', 'IT', 27, 3, 26, 20, 13, 'Atalanta'),
        P('Mauro Camoranesi', 'RM', 'IT', 26, 16, 82, 70, 55, 'Verona'),
        P('Alessandro Del Piero', 'CF', 'IT', 28, 10, 316, 160, 91, 'Padova'),
        P('David Trezeguet', 'CF', 'FR', 25, 17, 273, 60, 71, 'Monaco')
      ]
    },
    {
      id: 'milan-2005',
      club: 'AC Milan',
      season: '2004–05',
      competitionStage: 'Final (runners-up)',
      result: 'Drew 3–3 vs Liverpool, lost 2–3 on penalties',
      formation: '4-3-1-2',
      manager: 'Carlo Ancelotti',
      kitColors: { primary: '#c8102e', secondary: '#111111', pattern: 'stripes' },
      difficulty: 'easy',
      players: [
        P('Dida', 'GK', 'BR', 31, 1, 0, 0, 91, 'Corinthians'),
        P('Paolo Maldini', 'LB', 'IT', 36, 3, 33, 40, 126, YOUTH),
        P('Alessandro Nesta', 'CB', 'IT', 29, 13, 13, 10, 78, 'Lazio'),
        P('Jaap Stam', 'CB', 'NL', 32, 31, 26, 10, 67, 'Lazio'),
        P('Cafu', 'RB', 'BR', 34, 2, 54, 90, 142, 'Roma'),
        P('Clarence Seedorf', 'LM', 'NL', 29, 20, 135, 130, 87, 'Inter'),
        P('Andrea Pirlo', 'DM', 'IT', 26, 21, 73, 120, 116, 'Inter'),
        P('Gennaro Gattuso', 'RM', 'IT', 27, 8, 17, 30, 73, 'Salernitana'),
        P('Kaká', 'AM', 'BR', 23, 22, 208, 110, 92, 'São Paulo'),
        P('Andriy Shevchenko', 'CF', 'UA', 28, 7, 343, 70, 111, 'Dynamo Kyiv'),
        P('Hernán Crespo', 'CF', 'AR', 29, 11, 272, 60, 64, 'Chelsea (loan)')
      ]
    },
    {
      id: 'psg-2026',
      club: 'Paris Saint-Germain',
      season: '2025–26',
      competitionStage: 'Final',
      result: 'Drew 1–1 (a.e.t.) vs Arsenal, won 4–3 on penalties',
      formation: '4-3-3',
      manager: 'Luis Enrique',
      kitColors: { primary: '#004170', secondary: '#da291c', pattern: 'band' },
      difficulty: 'easy',
      players: [
        P('Matvey Safonov', 'GK', 'RU', 27, 39, 0, 0, 18, 'Krasnodar'),
        P('Nuno Mendes', 'LB', 'PT', 23, 25, 15, 25, 53, 'Sporting CP'),
        P('Willian Pacho', 'CB', 'EC', 24, 51, 2, 3, 41, 'Eintracht Frankfurt'),
        P('Marquinhos', 'CB', 'BR', 32, 5, 46, 15, 112, 'Roma'),
        P('Achraf Hakimi', 'RB', 'MA', 27, 2, 50, 80, 103, 'Inter'),
        P('Fabián Ruiz', 'LM', 'ES', 30, 8, 47, 40, 52, 'Napoli'),
        P('Vitinha', 'CM', 'PT', 26, 17, 42, 30, 47, 'Porto'),
        P('João Neves', 'RM', 'PT', 21, 87, 18, 20, 30, 'Benfica'),
        P('Khvicha Kvaratskhelia', 'LF', 'GE', 25, 7, 81, 80, 54, 'Napoli'),
        P('Ousmane Dembélé', 'CF', 'FR', 29, 10, 141, 110, 71, 'Barcelona'),
        P('Désiré Doué', 'RF', 'FR', 20, 14, 43, 20, 19, 'Rennes')
      ]
    },
    {
      id: 'arsenal-2026',
      club: 'Arsenal',
      season: '2025–26',
      competitionStage: 'Final (runners-up)',
      result: 'Drew 1–1 (a.e.t.) vs Paris Saint-Germain, lost 3–4 on penalties',
      formation: '4-2-3-1',
      manager: 'Mikel Arteta',
      kitColors: { primary: '#ef0107', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'easy',
      players: [
        P('David Raya', 'GK', 'ES', 30, 1, 0, 1, 14, 'Brentford'),
        P('Piero Hincapié', 'LB', 'EC', 24, 5, 8, 10, 56, 'Bayer Leverkusen'),
        P('Gabriel Magalhães', 'CB', 'BR', 28, 6, 28, 5, 24, 'Lille'),
        P('William Saliba', 'CB', 'FR', 25, 2, 9, 5, 38, 'Saint-Étienne'),
        P('Cristhian Mosquera', 'RB', 'ES', 21, 3, 1, 2, 2, 'Valencia'),
        P('Myles Lewis-Skelly', 'CM', 'ENG', 19, 49, 1, 5, 10, YOUTH),
        P('Declan Rice', 'CM', 'ENG', 27, 41, 37, 45, 83, 'West Ham United'),
        P('Leandro Trossard', 'LW', 'BE', 31, 19, 138, 70, 59, 'Brighton & Hove Albion'),
        P('Martin Ødegaard', 'AM', 'NO', 27, 8, 82, 90, 77, 'Real Madrid'),
        P('Bukayo Saka', 'RW', 'ENG', 24, 7, 86, 85, 59, YOUTH),
        P('Kai Havertz', 'CF', 'DE', 26, 29, 117, 60, 63, 'Chelsea')
      ]
    },
    {
      id: 'ajax-2019-sf',
      club: 'Ajax',
      season: '2018–19',
      competitionStage: 'Semi-final',
      result: 'Lost 2–3 vs Tottenham Hotspur (2nd leg; out on away goals, 3–3 agg.)',
      formation: '4-2-3-1',
      manager: 'Erik ten Hag',
      kitColors: { primary: '#ffffff', secondary: '#d2122e', pattern: 'band' },
      difficulty: 'medium',
      players: [
        P('André Onana', 'GK', 'CM', 23, 24, 0, 1, 53, 'Barcelona'),
        P('Nicolás Tagliafico', 'LB', 'AR', 26, 31, 30, 35, 83, 'Independiente'),
        P('Daley Blind', 'CB', 'NL', 29, 17, 22, 45, 108, 'Manchester United'),
        P('Matthijs de Ligt', 'CB', 'NL', 19, 4, 30, 8, 52, YOUTH),
        P('Noussair Mazraoui', 'RB', 'MA', 21, 12, 23, 25, 53, YOUTH),
        P('Frenkie de Jong', 'DM', 'NL', 21, 21, 33, 40, 70, 'Willem II'),
        P('Lasse Schöne', 'DM', 'DK', 32, 20, 121, 90, 51, 'NEC'),
        P('Hakim Ziyech', 'LW', 'MA', 26, 22, 143, 150, 64, 'Twente'),
        P('Donny van de Beek', 'AM', 'NL', 22, 6, 55, 45, 19, YOUTH),
        P('Dušan Tadić', 'RW', 'RS', 30, 10, 240, 220, 115, 'Southampton'),
        P('Kasper Dolberg', 'ST', 'DK', 21, 25, 123, 40, 56, 'Silkeborg')
      ]
    },
    {
      id: 'monaco-2017-sf',
      club: 'Monaco',
      season: '2016–17',
      competitionStage: 'Semi-final',
      result: 'Lost 0–2 vs Juventus (1st leg; 1–4 on aggregate)',
      formation: '4-4-2',
      manager: 'Leonardo Jardim',
      kitColors: { primary: '#e30613', secondary: '#ffffff', pattern: 'diagonal' },
      difficulty: 'medium',
      players: [
        P('Danijel Subašić', 'GK', 'HR', 32, 1, 1, 0, 44, 'Hajduk Split'),
        P('Benjamin Mendy', 'LB', 'FR', 22, 23, 8, 30, 10, 'Marseille'),
        P('Jemerson', 'CB', 'BR', 24, 5, 17, 3, 2, 'Atlético Mineiro'),
        P('Kamil Glik', 'CB', 'PL', 29, 25, 34, 8, 103, 'Torino'),
        P('Nabil Dirar', 'RB', 'MA', 31, 7, 39, 50, 46, 'Club Brugge'),
        P('Thomas Lemar', 'LM', 'FR', 21, 27, 41, 60, 27, 'Caen'),
        P('Tiémoué Bakayoko', 'CM', 'FR', 22, 14, 15, 10, 1, 'Rennes'),
        P('Fabinho', 'CM', 'BR', 23, 2, 51, 30, 36, 'Rio Ave'),
        P('Bernardo Silva', 'RM', 'PT', 22, 10, 112, 100, 115, 'Benfica'),
        P('Kylian Mbappé', 'ST', 'FR', 18, 29, 385, 140, 107, YOUTH),
        P('Radamel Falcao', 'ST', 'CO', 31, 9, 320, 60, 104, 'Atlético Madrid')
      ]
    },
    {
      id: 'deportivo-2004-sf',
      club: 'Deportivo La Coruña',
      season: '2003–04',
      competitionStage: 'Semi-final',
      result: 'Lost 0–1 vs Porto (2nd leg; 0–1 on aggregate)',
      formation: '4-2-3-1',
      manager: 'Javier Irureta',
      kitColors: { primary: '#ffffff', secondary: '#1f4e9c', pattern: 'stripes' },
      difficulty: 'hard',
      players: [
        P('José Francisco Molina', 'GK', 'ES', 33, 1, 0, 0, 9, 'Atlético Madrid'),
        P('Enrique Romero', 'LB', 'ES', 32, 3, 23, 25, 10, 'Mallorca'),
        P('Noureddine Naybet', 'CB', 'MA', 34, 4, 25, 10, 115, 'Sporting CP'),
        P('César Martín', 'CB', 'ES', 27, 5, 17, 8, 15, 'Oviedo'),
        P('Manuel Pablo', 'RB', 'ES', 28, 2, 4, 15, 13, 'Las Palmas'),
        P('Aldo Duscher', 'DM', 'AR', 25, 6, 14, 15, 3, 'Sporting CP'),
        P('Sergio González', 'DM', 'ES', 27, 8, 61, 50, 26, 'Espanyol'),
        P('Albert Luque', 'LW', 'ES', 26, 11, 106, 50, 20, 'Mallorca'),
        P('Juan Carlos Valerón', 'AM', 'ES', 28, 21, 56, 110, 46, 'Atlético Madrid'),
        P('Víctor Sánchez', 'RW', 'ES', 28, 7, 63, 50, 8, 'Racing Santander'),
        P('Walter Pandiani', 'ST', 'UY', 28, 9, 159, 30, 4, 'Peñarol')
      ]
    },

    // ───────────────── Batch 5: approved modern teams (line-ups from Wikipedia / match reports) ─────────────────
    {
      id: 'marseille-1991',
      club: 'Marseille',
      season: '1990–91',
      competitionStage: 'Final (runners-up)',
      result: 'Drew 0–0 (a.e.t.) vs Red Star Belgrade, lost 3–5 on penalties',
      formation: '3-4-3',
      manager: 'Raymond Goethals',
      kitColors: { primary: '#ffffff', secondary: '#2faee0', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Pascal Olmeta', 'GK', 'FR', 30, 1, 2, 0, 0, 'Matra Racing'),
        P('Bernard Casoni', 'CB', 'FR', 29, 7, 15, 10, 30, 'Toulon'),
        P('Carlos Mozer', 'CB', 'BR', 30, 5, 26, 10, 32, 'Benfica'),
        P('Basile Boli', 'CB', 'FR', 24, 4, 39, 5, 45, 'Auxerre'),
        P('Éric Di Meco', 'LM', 'FR', 27, 3, 16, 30, 23, YOUTH),
        P('Bruno Germain', 'CM', 'FR', 31, 6, 16, 15, 1, 'Toulon'),
        P('Laurent Fournier', 'CM', 'FR', 26, 11, 71, 40, 3, 'Saint-Étienne'),
        P('Manuel Amoros', 'RM', 'FR', 29, 2, 51, 50, 82, 'Monaco'),
        P('Abedi Pelé', 'LF', 'GH', 26, 10, 150, 80, 77, 'Lille'),
        P('Jean-Pierre Papin', 'CF', 'FR', 27, 9, 356, 70, 54, 'Club Brugge'),
        P('Chris Waddle', 'RF', 'ENG', 30, 8, 148, 120, 62, 'Tottenham Hotspur')
      ]
    },
    {
      id: 'leeds-2001-sf',
      club: 'Leeds United',
      season: '2000–01',
      competitionStage: 'Semi-final',
      result: 'Drew 0–0 vs Valencia (1st leg; 0–3 on aggregate)',
      formation: '4-4-2',
      manager: "David O'Leary",
      kitColors: { primary: '#ffffff', secondary: '#1d428a', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Nigel Martyn', 'GK', 'ENG', 34, 1, 0, 0, 23, 'Crystal Palace'),
        P('Ian Harte', 'LB', 'IE', 23, 3, 85, 45, 64, YOUTH),
        P('Dominic Matteo', 'CB', 'SCO', 27, 21, 8, 15, 6, 'Liverpool'),
        P('Rio Ferdinand', 'CB', 'ENG', 22, 29, 13, 10, 81, 'West Ham United'),
        P('Danny Mills', 'RB', 'ENG', 23, 18, 9, 15, 19, 'Charlton Athletic'),
        P('Harry Kewell', 'LM', 'AU', 22, 10, 124, 60, 58, YOUTH),
        P('Olivier Dacourt', 'CM', 'FR', 26, 4, 16, 25, 21, 'Lens'),
        P('David Batty', 'CM', 'ENG', 32, 23, 9, 25, 42, 'Newcastle United'),
        P('Lee Bowyer', 'RM', 'ENG', 24, 11, 99, 50, 1, 'Charlton Athletic'),
        P('Alan Smith', 'ST', 'ENG', 20, 17, 72, 40, 19, YOUTH),
        P('Mark Viduka', 'ST', 'AU', 25, 9, 255, 70, 43, 'Celtic')
      ]
    },
    {
      id: 'lyon-2010-sf',
      club: 'Lyon',
      season: '2009–10',
      competitionStage: 'Semi-final',
      result: 'Lost 0–3 vs Bayern Munich (2nd leg; 0–4 on aggregate)',
      formation: '4-2-3-1',
      manager: 'Claude Puel',
      kitColors: { primary: '#ffffff', secondary: '#1d3c87', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Hugo Lloris', 'GK', 'FR', 23, 1, 0, 0, 145, 'Nice'),
        P('Aly Cissokho', 'LB', 'FR', 22, 20, 5, 10, 1, 'Porto'),
        P('Jean-Alain Boumsong', 'CB', 'FR', 30, 4, 21, 8, 27, 'Juventus'),
        P('Cris', 'CB', 'BR', 32, 3, 45, 10, 17, 'Cruzeiro'),
        P('Anthony Réveillère', 'RB', 'FR', 30, 13, 6, 25, 20, 'Rennes'),
        P('Maxime Gonalons', 'DM', 'FR', 21, 41, 16, 20, 8, YOUTH),
        P('Jean Makoun', 'DM', 'CM', 26, 17, 34, 25, 68, 'Lille'),
        P('Michel Bastos', 'LW', 'BR', 26, 7, 117, 70, 10, 'Lille'),
        P('César Delgado', 'AM', 'AR', 28, 19, 122, 60, 20, 'Cruz Azul'),
        P('Sidney Govou', 'RW', 'FR', 30, 14, 67, 60, 49, YOUTH),
        P('Lisandro López', 'ST', 'AR', 27, 9, 262, 70, 7, 'Porto')
      ]
    },
    {
      id: 'schalke-2011-sf',
      club: 'Schalke 04',
      season: '2010–11',
      competitionStage: 'Semi-final',
      result: 'Lost 0–2 vs Manchester United (1st leg; 1–6 on aggregate)',
      formation: '4-4-2',
      manager: 'Ralf Rangnick',
      kitColors: { primary: '#004d9d', secondary: '#ffffff', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Manuel Neuer', 'GK', 'DE', 25, 1, 0, 2, 128, YOUTH),
        P('Hans Sarpei', 'LB', 'GH', 34, 2, 3, 15, 36, 'Bayer Leverkusen'),
        P('Christoph Metzelder', 'CB', 'DE', 30, 21, 4, 5, 47, 'Real Madrid'),
        P('Joël Matip', 'CB', 'CM', 19, 32, 35, 10, 27, YOUTH),
        P('Atsuto Uchida', 'RB', 'JP', 23, 22, 9, 20, 74, 'Kashima Antlers'),
        P('Alexander Baumjohann', 'LM', 'DE', 24, 13, 24, 20, 0, 'Bayern Munich'),
        P('Kyriakos Papadopoulos', 'CM', 'GR', 19, 14, 18, 5, 35, 'Olympiacos'),
        P('José Manuel Jurado', 'CM', 'ES', 24, 18, 49, 50, 0, 'Atlético Madrid'),
        P('Jefferson Farfán', 'RM', 'PE', 26, 17, 187, 90, 102, 'PSV'),
        P('Raúl', 'ST', 'ES', 33, 7, 404, 120, 102, 'Real Madrid'),
        P('Edu', 'ST', 'BR', 29, 9, 143, 40, 0, 'Suwon Samsung Bluewings')
      ]
    },
    {
      id: 'roma-2018-sf',
      club: 'Roma',
      season: '2017–18',
      competitionStage: 'Semi-final',
      result: 'Won 4–2 vs Liverpool (2nd leg; out 6–7 on aggregate)',
      formation: '4-3-3',
      manager: 'Eusebio Di Francesco',
      kitColors: { primary: '#8e1f2f', secondary: '#f0bc42', pattern: 'plain' },
      difficulty: 'medium',
      players: [
        P('Alisson', 'GK', 'BR', 25, 1, 1, 3, 83, 'Internacional'),
        P('Aleksandar Kolarov', 'LB', 'RS', 32, 11, 58, 70, 94, 'Manchester City'),
        P('Federico Fazio', 'CB', 'AR', 31, 20, 32, 10, 10, 'Tottenham Hotspur'),
        P('Kostas Manolas', 'CB', 'GR', 26, 44, 50, 8, 42, 'Olympiacos'),
        P('Alessandro Florenzi', 'RB', 'IT', 27, 24, 44, 50, 49, YOUTH),
        P('Radja Nainggolan', 'CM', 'BE', 29, 4, 77, 60, 30, 'Cagliari'),
        P('Daniele De Rossi', 'DM', 'IT', 34, 16, 64, 50, 117, YOUTH),
        P('Lorenzo Pellegrini', 'CM', 'IT', 21, 7, 72, 50, 36, 'Sassuolo'),
        P('Stephan El Shaarawy', 'LW', 'IT', 25, 92, 109, 50, 32, 'AC Milan'),
        P('Edin Džeko', 'CF', 'BA', 32, 9, 389, 120, 152, 'Manchester City'),
        P('Patrik Schick', 'RW', 'CZ', 22, 14, 153, 30, 56, 'Sampdoria')
      ]
    },
    {
      id: 'villarreal-2022-sf',
      club: 'Villarreal',
      season: '2021–22',
      competitionStage: 'Semi-final',
      result: 'Lost 2–3 vs Liverpool (2nd leg; 2–5 on aggregate)',
      formation: '4-4-2',
      manager: 'Unai Emery',
      kitColors: { primary: '#ffe667', secondary: '#005187', pattern: 'plain' },
      difficulty: 'hard',
      players: [
        P('Gerónimo Rulli', 'GK', 'AR', 29, 13, 0, 0, 9, 'Real Sociedad'),
        P('Pervis Estupiñán', 'LB', 'EC', 24, 12, 11, 25, 58, 'Watford'),
        P('Pau Torres', 'CB', 'ES', 25, 4, 17, 10, 24, YOUTH),
        P('Raúl Albiol', 'CB', 'ES', 36, 3, 23, 15, 58, 'Napoli'),
        P('Juan Foyth', 'RB', 'AR', 24, 8, 6, 8, 22, 'Tottenham Hotspur'),
        P('Giovani Lo Celso', 'LM', 'AR', 26, 17, 51, 40, 68, 'Tottenham Hotspur (loan)'),
        P('Dani Parejo', 'CM', 'ES', 33, 5, 105, 90, 4, 'Valencia'),
        P('Étienne Capoue', 'CM', 'FR', 33, 6, 41, 25, 7, 'Watford'),
        P('Francis Coquelin', 'RM', 'FR', 30, 19, 10, 15, 0, 'Valencia'),
        P('Boulaye Dia', 'ST', 'SN', 25, 16, 88, 20, 40, 'Reims'),
        P('Gerard Moreno', 'ST', 'ES', 30, 7, 230, 70, 21, 'Espanyol')
      ]
    }
  ];

  /**
   * "Famous clubs only" filter: any season of these clubs counts.
   * Names must match the `club` field exactly.
   */
  const famousClubs = [
    'Real Madrid', 'Barcelona', 'Bayern Munich', 'AC Milan', 'Inter', 'Juventus',
    'Liverpool', 'Manchester United', 'Manchester City', 'Chelsea', 'Ajax', 'Paris Saint-Germain'
  ];

  /**
   * Decoy clubs: real clubs that appear in the autocomplete but are not answers.
   * They stop the suggestion list from giving away which clubs are in the dataset.
   * (Plain club names only — no crests, logos or trademarks are used anywhere.)
   */
  const decoyClubs = [
    'Sevilla', 'Real Sociedad', 'Athletic Bilbao', 'Ipswich Town', 'Wolverhampton Wanderers',
    'Lazio', 'Napoli', 'Fiorentina', 'Sampdoria',
    'Parma', 'Borussia Mönchengladbach', 'VfB Stuttgart',
    'Werder Bremen', 'Eintracht Frankfurt', 'RB Leipzig', 'Nantes', 'Bordeaux', 'Saint-Étienne', 'Stade de Reims', 'Everton', 'Newcastle United', 'Rangers',
    'Anderlecht', 'Club Brugge', 'Malmö FF', 'Red Star Belgrade', 'Partizan', 'Dinamo Zagreb',
    'Dynamo Kyiv', 'Spartak Moscow', 'Shakhtar Donetsk', 'Galatasaray', 'Fenerbahçe',
    'Olympiacos', 'Panathinaikos', 'Sporting CP', 'Basel', 'Hajduk Split', 'Leicester City'
  ];

  /** Nicknames / alternate spellings → canonical club name (must match a club or decoy). */
  const clubAliases = {
    'Real': 'Real Madrid',
    'Man Utd': 'Manchester United', 'Man United': 'Manchester United', 'MUFC': 'Manchester United',
    'Man City': 'Manchester City', 'City': 'Manchester City',
    'Barca': 'Barcelona', 'Barça': 'Barcelona', 'FC Barcelona': 'Barcelona',
    'Inter Milan': 'Inter', 'Internazionale': 'Inter',
    'Milan': 'AC Milan',
    'Bayern': 'Bayern Munich', 'FC Bayern': 'Bayern Munich', 'Bayern München': 'Bayern Munich',
    'Dortmund': 'Borussia Dortmund', 'BVB': 'Borussia Dortmund',
    'Forest': 'Nottingham Forest', 'Nottm Forest': 'Nottingham Forest',
    'Villa': 'Aston Villa',
    'LFC': 'Liverpool',
    'PSV': 'PSV Eindhoven',
    'Steaua': 'Steaua București', 'Steaua Bucharest': 'Steaua București', 'FCSB': 'Steaua București',
    'OM': 'Marseille', 'Olympique de Marseille': 'Marseille', 'Olympique Marseille': 'Marseille',
    'AS Monaco': 'Monaco',
    'FC Porto': 'Porto',
    'SL Benfica': 'Benfica',
    'Ajax Amsterdam': 'Ajax',
    'Celtic Glasgow': 'Celtic',
    'Juve': 'Juventus', 'Atleti': 'Atlético Madrid', 'PSG': 'Paris Saint-Germain',
    'Spurs': 'Tottenham Hotspur', 'Gladbach': 'Borussia Mönchengladbach', 'HSV': 'Hamburger SV',
    'Crvena Zvezda': 'Red Star Belgrade'
  };

  /**
   * Country each club plays its league football in (same codes as player nationality).
   * Used to tell the player "right country!" after a wrong club guess.
   * Clubs missing here simply never get that extra hint.
   */
  const clubCountries = {
    'AC Milan': 'IT', 'Inter': 'IT', 'Juventus': 'IT', 'Roma': 'IT', 'Lazio': 'IT', 'Napoli': 'IT',
    'Fiorentina': 'IT', 'Sampdoria': 'IT', 'Parma': 'IT',
    'Real Madrid': 'ES', 'Barcelona': 'ES', 'Atlético Madrid': 'ES', 'Valencia': 'ES', 'Sevilla': 'ES',
    'Villarreal': 'ES', 'Deportivo La Coruña': 'ES', 'Real Sociedad': 'ES', 'Athletic Bilbao': 'ES',
    'Bayern Munich': 'DE', 'Borussia Dortmund': 'DE', 'Hamburger SV': 'DE', 'Bayer Leverkusen': 'DE',
    'Borussia Mönchengladbach': 'DE', 'Schalke 04': 'DE', 'Werder Bremen': 'DE', 'Eintracht Frankfurt': 'DE',
    'RB Leipzig': 'DE', 'VfB Stuttgart': 'DE',
    'Liverpool': 'ENG', 'Manchester United': 'ENG', 'Manchester City': 'ENG', 'Chelsea': 'ENG', 'Arsenal': 'ENG',
    'Tottenham Hotspur': 'ENG', 'Nottingham Forest': 'ENG', 'Aston Villa': 'ENG', 'Leeds United': 'ENG',
    'Everton': 'ENG', 'Newcastle United': 'ENG', 'Leicester City': 'ENG', 'Ipswich Town': 'ENG',
    'Wolverhampton Wanderers': 'ENG',
    'Celtic': 'SCO', 'Rangers': 'SCO',
    'Marseille': 'FR', 'Paris Saint-Germain': 'FR', 'Monaco': 'FR', 'Lyon': 'FR', 'Saint-Étienne': 'FR',
    'Stade de Reims': 'FR', 'Nantes': 'FR', 'Bordeaux': 'FR',
    'Ajax': 'NL', 'Feyenoord': 'NL', 'PSV Eindhoven': 'NL',
    'Benfica': 'PT', 'Porto': 'PT', 'Sporting CP': 'PT',
    'Anderlecht': 'BE', 'Club Brugge': 'BE', 'Basel': 'CH', 'Malmö FF': 'SE',
    'Steaua București': 'RO', 'Red Star Belgrade': 'RS', 'Partizan': 'RS',
    'Dinamo Zagreb': 'HR', 'Hajduk Split': 'HR', 'Dynamo Kyiv': 'UA', 'Shakhtar Donetsk': 'UA',
    'Spartak Moscow': 'RU', 'Galatasaray': 'TR', 'Fenerbahçe': 'TR', 'Olympiacos': 'GR', 'Panathinaikos': 'GR'
  };

  window.STARTING_XI_DATA = { teams, decoyClubs, clubAliases, famousClubs, clubCountries, YOUTH };
})();
