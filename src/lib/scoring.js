import { calcStablefordPoints, INDIVIDUAL_POINTS, SCRAMBLE_2v2v2v2_POINTS, SCRAMBLE_4v4_POINTS } from '../config';

/**
 * Check if a score row has real data (not all zeros/empty)
 */
function hasRealScores(row) {
  for (let i = 1; i <= 18; i++) {
    const val = Number(row[`hole_${i}`]);
    if (val > 0) return true;
  }
  return false;
}

/**
 * Calculate Stableford points for a full round
 * @param {number[]} strokes - Array of 18 stroke counts
 * @param {number[]} pars - Array of 18 hole pars
 * @returns {number[]} Array of 18 Stableford points
 */
export function calcRoundStableford(strokes, pars) {
  return strokes.map((s, i) => calcStablefordPoints(s, pars[i]));
}

/**
 * Rank players by total Stableford points (descending)
 * Returns array of { playerId, total, position }
 * Ties get the same position (e.g., two 1sts, then 3rd)
 */
export function rankByStableford(playerScores, pars) {
  const validScores = playerScores.filter(hasRealScores);
  if (validScores.length === 0) return [];

  const results = validScores.map(ps => {
    const strokes = [];
    for (let i = 1; i <= 18; i++) {
      strokes.push(Number(ps[`hole_${i}`]) || 0);
    }
    const stablefordPoints = calcRoundStableford(strokes, pars);
    const total = stablefordPoints.reduce((a, b) => a + b, 0);
    return { playerId: ps.player_id, strokes, stablefordPoints, total };
  });

  // Sort descending by total
  results.sort((a, b) => b.total - a.total);

  // Assign positions with tie handling
  let pos = 1;
  for (let i = 0; i < results.length; i++) {
    if (i > 0 && results[i].total < results[i - 1].total) {
      pos = i + 1;
    }
    results[i].position = pos;
  }

  return results;
}

/**
 * Allocate trip points based on positions with tie-splitting
 * @param {{ playerId: string, position: number }[]} ranked
 * @param {number[]} pointScale - Points for each position (1st, 2nd, ...)
 * @returns {{ playerId: string, tripPoints: number }[]}
 */
export function allocatePoints(ranked, pointScale) {
  const result = [];

  let i = 0;
  while (i < ranked.length) {
    // Find all players tied at this position
    const pos = ranked[i].position;
    const tiedPlayers = [];
    while (i < ranked.length && ranked[i].position === pos) {
      tiedPlayers.push(ranked[i]);
      i++;
    }

    // Average the points for the tied positions
    let totalPoints = 0;
    for (let j = pos - 1; j < pos - 1 + tiedPlayers.length && j < pointScale.length; j++) {
      totalPoints += pointScale[j];
    }
    const avgPoints = totalPoints / tiedPlayers.length;

    for (const player of tiedPlayers) {
      result.push({ playerId: player.playerId, tripPoints: avgPoints });
    }
  }

  return result;
}

/**
 * Rank scramble teams by total strokes (ascending)
 */
export function rankScrambleTeams(teamScores) {
  const validScores = teamScores.filter(hasRealScores);
  if (validScores.length === 0) return [];

  const results = validScores.map(ts => {
    const strokes = [];
    for (let i = 1; i <= 18; i++) {
      strokes.push(Number(ts[`hole_${i}`]) || 0);
    }
    const total = strokes.reduce((a, b) => a + b, 0);
    return { teamId: ts.team_id, strokes, total };
  });

  results.sort((a, b) => a.total - b.total);

  let pos = 1;
  for (let i = 0; i < results.length; i++) {
    if (i > 0 && results[i].total > results[i - 1].total) {
      pos = i + 1;
    }
    results[i].position = pos;
  }

  return results;
}

/**
 * Allocate scramble points to individual players
 */
export function allocateScramblePoints(rankedTeams, teams, format) {
  const pointScale = format === '2v2v2v2' ? SCRAMBLE_2v2v2v2_POINTS : null;
  const playerPoints = [];

  if (format === '2v2v2v2') {
    // Allocate with tie-splitting
    let i = 0;
    while (i < rankedTeams.length) {
      const pos = rankedTeams[i].position;
      const tiedTeams = [];
      while (i < rankedTeams.length && rankedTeams[i].position === pos) {
        tiedTeams.push(rankedTeams[i]);
        i++;
      }

      let totalPts = 0;
      for (let j = pos - 1; j < pos - 1 + tiedTeams.length && j < pointScale.length; j++) {
        totalPts += pointScale[j];
      }
      const avgPts = totalPts / tiedTeams.length;

      for (const team of tiedTeams) {
        const teamData = teams.find(t => t.team_id === team.teamId);
        if (teamData) {
          const members = [teamData.player_1, teamData.player_2, teamData.player_3, teamData.player_4].filter(Boolean);
          for (const pid of members) {
            playerPoints.push({ playerId: pid, scramblePoints: avgPts });
          }
        }
      }
    }
  } else if (format === '4v4') {
    // Win/lose
    if (rankedTeams.length === 2) {
      const [first, second] = rankedTeams;
      const isTie = first.total === second.total;

      for (const rt of rankedTeams) {
        const teamData = teams.find(t => t.team_id === rt.teamId);
        if (teamData) {
          const members = [teamData.player_1, teamData.player_2, teamData.player_3, teamData.player_4].filter(Boolean);
          const pts = isTie
            ? (SCRAMBLE_4v4_POINTS.win + SCRAMBLE_4v4_POINTS.lose) / 2
            : rt.position === 1 ? SCRAMBLE_4v4_POINTS.win : SCRAMBLE_4v4_POINTS.lose;
          for (const pid of members) {
            playerPoints.push({ playerId: pid, scramblePoints: pts });
          }
        }
      }
    }
  }

  return playerPoints;
}

/**
 * Compute full leaderboard from all data
 */
export function computeLeaderboard(data) {
  const { players, schedule, courseHoles, individualScores, scrambleTeams, scrambleScores, bonusPoints } = data;

  const leaderboard = players.map(p => ({
    playerId: p.player_id,
    name: p.name,
    individualPoints: 0,
    scramblePoints: 0,
    bonusPointsTotal: 0,
    totalPoints: 0,
    roundResults: [],
  }));

  const playerMap = Object.fromEntries(leaderboard.map(p => [p.playerId, p]));

  // Process individual rounds
  const individualRounds = schedule.filter(r => r.type === 'individual');
  for (const round of individualRounds) {
    const pars = courseHoles
      .filter(h => h.round_id === round.round_id)
      .sort((a, b) => Number(a.hole) - Number(b.hole))
      .map(h => Number(h.par));

    if (pars.length === 0) continue;

    const roundScores = individualScores.filter(s => s.round_id === round.round_id);
    if (roundScores.length === 0) continue;

    const ranked = rankByStableford(roundScores, pars);
    const points = allocatePoints(ranked, INDIVIDUAL_POINTS);

    for (const pt of points) {
      if (playerMap[pt.playerId]) {
        playerMap[pt.playerId].individualPoints += pt.tripPoints;
        const rankInfo = ranked.find(r => r.playerId === pt.playerId);
        playerMap[pt.playerId].roundResults.push({
          roundId: round.round_id,
          type: 'individual',
          position: rankInfo?.position,
          stablefordTotal: rankInfo?.total,
          tripPoints: pt.tripPoints,
          totalStrokes: rankInfo?.strokes.reduce((a, b) => a + b, 0),
        });
      }
    }
  }

  // Process scramble rounds
  const scrambleRounds = schedule.filter(r => r.type === 'scramble');
  for (const round of scrambleRounds) {
    const roundTeams = scrambleTeams.filter(t => t.round_id === round.round_id);
    const roundScores = scrambleScores.filter(s => s.round_id === round.round_id);

    if (roundTeams.length === 0 || roundScores.length === 0) continue;

    const ranked = rankScrambleTeams(roundScores);
    const playerPts = allocateScramblePoints(ranked, roundTeams, round.scramble_format);

    for (const pp of playerPts) {
      if (playerMap[pp.playerId]) {
        playerMap[pp.playerId].scramblePoints += pp.scramblePoints;

        const team = roundTeams.find(t =>
          [t.player_1, t.player_2, t.player_3, t.player_4].includes(pp.playerId)
        );
        const rankedTeam = team ? ranked.find(r => r.teamId === team.team_id) : null;

        playerMap[pp.playerId].roundResults.push({
          roundId: round.round_id,
          type: 'scramble',
          teamId: team?.team_id,
          position: rankedTeam?.position,
          teamTotal: rankedTeam?.total,
          scramblePoints: pp.scramblePoints,
        });
      }
    }
  }

  // Process bonus points
  for (const bp of bonusPoints) {
    if (playerMap[bp.winner_player_id]) {
      playerMap[bp.winner_player_id].bonusPointsTotal += Number(bp.points) || 0;
    }
  }

  // Compute totals and rank
  for (const p of leaderboard) {
    p.totalPoints = p.individualPoints + p.scramblePoints + p.bonusPointsTotal;
  }

  leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

  let rank = 1;
  for (let i = 0; i < leaderboard.length; i++) {
    if (i > 0 && leaderboard[i].totalPoints < leaderboard[i - 1].totalPoints) {
      rank = i + 1;
    }
    leaderboard[i].rank = rank;
  }

  return leaderboard;
}

/**
 * Compute player stats from individual scores
 */
export function computePlayerStats(playerId, individualScores, courseHoles, schedule) {
  const playerScores = individualScores.filter(s => s.player_id === playerId && hasRealScores(s));

  if (playerScores.length === 0) return null;

  let totalStrokes = 0;
  let totalHoles = 0;
  let totalPar = 0;
  let totalStableford = 0;
  const distribution = { eagle: 0, birdie: 0, par: 0, bogey: 0, doublePlus: 0 };
  const parTypeScoring = { 3: { strokes: 0, holes: 0 }, 4: { strokes: 0, holes: 0 }, 5: { strokes: 0, holes: 0 } };
  let front9Total = 0, back9Total = 0, front9Holes = 0, back9Holes = 0;

  const roundTotals = [];

  for (const ps of playerScores) {
    const pars = courseHoles
      .filter(h => h.round_id === ps.round_id)
      .sort((a, b) => Number(a.hole) - Number(b.hole))
      .map(h => Number(h.par));

    if (pars.length === 0) continue;

    let roundStrokes = 0;
    let roundStableford = 0;
    const round = schedule.find(r => r.round_id === ps.round_id);

    for (let i = 0; i < 18; i++) {
      const strokes = Number(ps[`hole_${i + 1}`]);
      if (!strokes) continue;

      const par = pars[i];
      const diff = strokes - par;
      const stab = calcStablefordPoints(strokes, par);

      totalStrokes += strokes;
      totalPar += par;
      totalHoles++;
      totalStableford += stab;
      roundStrokes += strokes;
      roundStableford += stab;

      if (diff <= -2) distribution.eagle++;
      else if (diff === -1) distribution.birdie++;
      else if (diff === 0) distribution.par++;
      else if (diff === 1) distribution.bogey++;
      else distribution.doublePlus++;

      if (parTypeScoring[par]) {
        parTypeScoring[par].strokes += strokes;
        parTypeScoring[par].holes++;
      }

      if (i < 9) { front9Total += stab; front9Holes++; }
      else { back9Total += stab; back9Holes++; }
    }

    roundTotals.push({
      roundId: ps.round_id,
      course: round?.course,
      strokes: roundStrokes,
      stableford: roundStableford,
      par: pars.reduce((a, b) => a + b, 0),
    });
  }

  const rounds = playerScores.length;
  return {
    rounds,
    totalStrokes,
    totalPar,
    avgStrokes: rounds ? totalStrokes / rounds : 0,
    avgVsPar: rounds ? (totalStrokes - totalPar) / rounds : 0,
    avgStableford: rounds ? totalStableford / rounds : 0,
    distribution,
    distributionPct: {
      eagle: totalHoles ? (distribution.eagle / totalHoles * 100) : 0,
      birdie: totalHoles ? (distribution.birdie / totalHoles * 100) : 0,
      par: totalHoles ? (distribution.par / totalHoles * 100) : 0,
      bogey: totalHoles ? (distribution.bogey / totalHoles * 100) : 0,
      doublePlus: totalHoles ? (distribution.doublePlus / totalHoles * 100) : 0,
    },
    parTypeAvg: {
      3: parTypeScoring[3].holes ? parTypeScoring[3].strokes / parTypeScoring[3].holes : 0,
      4: parTypeScoring[4].holes ? parTypeScoring[4].strokes / parTypeScoring[4].holes : 0,
      5: parTypeScoring[5].holes ? parTypeScoring[5].strokes / parTypeScoring[5].holes : 0,
    },
    front9Avg: front9Holes ? front9Total / (front9Holes / 9) : 0,
    back9Avg: back9Holes ? back9Total / (back9Holes / 9) : 0,
    bestRound: roundTotals.length ? roundTotals.reduce((a, b) => a.stableford > b.stableford ? a : b) : null,
    worstRound: roundTotals.length ? roundTotals.reduce((a, b) => a.stableford < b.stableford ? a : b) : null,
    roundTotals,
  };
}
