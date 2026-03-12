// Mock data for development before Google Sheets is connected

export const mockPlayers = [
  { player_id: '1', name: 'N. Himes' },
  { player_id: '2', name: 'A. Chambers' },
  { player_id: '3', name: 'J. Warfield' },
  { player_id: '4', name: 'T. Hartle' },
  { player_id: '5', name: 'B. Keller' },
  { player_id: '6', name: 'R. Kumsher' },
  { player_id: '7', name: 'Z. Woodward' },
  { player_id: '8', name: 'M. Kaetzel' },
];

export const mockSchedule = [
  { round_id: '1', date: '2026-03-20', course: 'TPC Myrtle Beach', tee_time: '8:00 AM', type: 'individual', scramble_format: '', par: 72 },
  { round_id: '2', date: '2026-03-21', course: 'Caledonia Golf & Fish Club', tee_time: '8:30 AM', type: 'individual', scramble_format: '', par: 70 },
  { round_id: '3', date: '2026-03-21', course: 'True Blue Golf Plantation', tee_time: '1:30 PM', type: 'scramble', scramble_format: '2v2v2v2', par: 72 },
  { round_id: '4', date: '2026-03-22', course: 'Barefoot Resort - Dye Course', tee_time: '8:00 AM', type: 'individual', scramble_format: '', par: 72 },
  { round_id: '5', date: '2026-03-22', course: 'Barefoot Resort - Love Course', tee_time: '1:30 PM', type: 'scramble', scramble_format: '4v4', par: 72 },
  { round_id: '6', date: '2026-03-23', course: 'Grande Dunes Resort Course', tee_time: '8:30 AM', type: 'individual', scramble_format: '', par: 72 },
  { round_id: '7', date: '2026-03-23', course: 'Tidewater Golf Club', tee_time: '1:30 PM', type: 'scramble', scramble_format: '2v2v2v2', par: 72 },
  { round_id: '8', date: '2026-03-24', course: 'Pawleys Plantation', tee_time: '8:00 AM', type: 'individual', scramble_format: '', par: 72 },
  { round_id: '9', date: '2026-03-24', course: 'Litchfield Country Club', tee_time: '1:30 PM', type: 'scramble', scramble_format: '2v2v2v2', par: 72 },
];

// Generate realistic hole pars for a course
function generateCoursePars(roundId, totalPar) {
  // Standard distribution: four par 3s, four par 5s, ten par 4s = 72
  const pars = [4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 3, 4, 5];
  if (totalPar === 70) {
    pars[1] = 3; pars[10] = 3; // convert two par 4s to par 3s
  }
  return pars.map((par, i) => ({
    round_id: roundId,
    hole: i + 1,
    par,
    is_ctp: par === 3 ? '1' : '0',
    is_ld: i === 13 ? '1' : '0', // hole 14 is LD hole
  }));
}

export const mockCourseHoles = mockSchedule.flatMap(r =>
  generateCoursePars(r.round_id, r.par)
);

// Generate realistic scores (strokes) for a player on a course
function generateScores(pars, skill) {
  // skill: 0 = scratch, 1 = bogey golfer
  return pars.map(par => {
    const rand = Math.random();
    const base = par + Math.round(skill * 1.2);
    if (rand < 0.02) return par - 2; // eagle
    if (rand < 0.12) return par - 1; // birdie
    if (rand < 0.45) return par;     // par
    if (rand < 0.80) return par + 1; // bogey
    if (rand < 0.95) return par + 2; // double
    return base + 2; // triple+
  });
}

// Player skill levels (0-1 scale, lower = better)
const skills = [0.3, 0.4, 0.5, 0.35, 0.6, 0.55, 0.45, 0.65];

// Generate individual scores for all individual rounds
export const mockIndividualScores = [];
const individualRounds = mockSchedule.filter(r => r.type === 'individual');
for (const round of individualRounds) {
  const pars = mockCourseHoles
    .filter(h => h.round_id === round.round_id)
    .map(h => h.par);

  for (let p = 0; p < 8; p++) {
    const scores = generateScores(pars, skills[p]);
    const row = {
      round_id: round.round_id,
      player_id: String(p + 1),
    };
    scores.forEach((s, i) => { row[`hole_${i + 1}`] = String(s); });
    mockIndividualScores.push(row);
  }
}

// Generate scramble teams and scores
export const mockScrambleTeams = [];
export const mockScrambleScores = [];

const scrambleRounds = mockSchedule.filter(r => r.type === 'scramble');
for (const round of scrambleRounds) {
  const pars = mockCourseHoles
    .filter(h => h.round_id === round.round_id)
    .map(h => h.par);

  if (round.scramble_format === '2v2v2v2') {
    // 4 teams of 2
    const teams = [
      { team_id: '1', player_1: '1', player_2: '2', player_3: '', player_4: '' },
      { team_id: '2', player_1: '3', player_2: '4', player_3: '', player_4: '' },
      { team_id: '3', player_1: '5', player_2: '6', player_3: '', player_4: '' },
      { team_id: '4', player_1: '7', player_2: '8', player_3: '', player_4: '' },
    ];
    for (const team of teams) {
      mockScrambleTeams.push({ round_id: round.round_id, ...team });
      const scores = generateScores(pars, 0.15); // scramble = better scores
      const row = { round_id: round.round_id, team_id: team.team_id };
      scores.forEach((s, i) => { row[`hole_${i + 1}`] = String(s); });
      mockScrambleScores.push(row);
    }
  } else {
    // 4v4: 2 teams of 4
    const teams = [
      { team_id: '1', player_1: '1', player_2: '2', player_3: '3', player_4: '4' },
      { team_id: '2', player_1: '5', player_2: '6', player_3: '7', player_4: '8' },
    ];
    for (const team of teams) {
      mockScrambleTeams.push({ round_id: round.round_id, ...team });
      const scores = generateScores(pars, 0.1);
      const row = { round_id: round.round_id, team_id: team.team_id };
      scores.forEach((s, i) => { row[`hole_${i + 1}`] = String(s); });
      mockScrambleScores.push(row);
    }
  }
}

// Generate bonus points for scramble rounds
export const mockBonusPoints = [];
for (const round of scrambleRounds) {
  const ctpHoles = mockCourseHoles.filter(
    h => h.round_id === round.round_id && h.is_ctp === '1'
  );
  for (const hole of ctpHoles) {
    const winnerId = String(Math.floor(Math.random() * 8) + 1);
    mockBonusPoints.push({
      round_id: round.round_id,
      hole: String(hole.hole),
      bonus_type: 'ctp',
      winner_player_id: winnerId,
      detail: `${Math.floor(Math.random() * 15) + 2}' ${Math.floor(Math.random() * 12)}"`,
      points: '2',
    });
  }
  // LD
  const ldHole = mockCourseHoles.find(
    h => h.round_id === round.round_id && h.is_ld === '1'
  );
  if (ldHole) {
    const winnerId = String(Math.floor(Math.random() * 8) + 1);
    mockBonusPoints.push({
      round_id: round.round_id,
      hole: String(ldHole.hole),
      bonus_type: 'ld',
      winner_player_id: winnerId,
      detail: `${260 + Math.floor(Math.random() * 50)} yards`,
      points: '2',
    });
  }
}
