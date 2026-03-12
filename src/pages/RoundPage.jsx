import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import Scorecard from '../components/Scorecard';
import TeamCard from '../components/TeamCard';
import BonusBadge from '../components/BonusBadge';
import { rankByStableford, allocatePoints, rankScrambleTeams, allocateScramblePoints } from '../lib/scoring';
import { INDIVIDUAL_POINTS } from '../config';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function RoundPage({ data }) {
  const { roundId } = useParams();

  const round = data?.schedule?.find(r => r.round_id === roundId);
  const pars = useMemo(() => {
    if (!data) return [];
    return data.courseHoles
      .filter(h => h.round_id === roundId)
      .sort((a, b) => Number(a.hole) - Number(b.hole))
      .map(h => Number(h.par));
  }, [data, roundId]);

  const isIndividual = round?.type === 'individual';

  // Individual round data
  const individualResults = useMemo(() => {
    if (!isIndividual || !data || pars.length === 0) return null;
    const scores = data.individualScores.filter(s => s.round_id === roundId);
    if (scores.length === 0) return null;
    const ranked = rankByStableford(scores, pars);
    const points = allocatePoints(ranked, INDIVIDUAL_POINTS);
    return { scores, ranked, points };
  }, [data, roundId, pars, isIndividual]);

  // Scramble round data
  const scrambleResults = useMemo(() => {
    if (isIndividual || !data) return null;
    const teams = data.scrambleTeams.filter(t => t.round_id === roundId);
    const scores = data.scrambleScores.filter(s => s.round_id === roundId);
    if (teams.length === 0 || scores.length === 0) return null;
    const ranked = rankScrambleTeams(scores);
    const playerPts = allocateScramblePoints(ranked, teams, round.scramble_format);
    return { teams, scores, ranked, playerPts };
  }, [data, roundId, isIndividual, round]);

  const bonuses = useMemo(() => {
    if (!data) return [];
    return data.bonusPoints.filter(b => b.round_id === roundId);
  }, [data, roundId]);

  if (!round) {
    return <p className="text-center py-8 text-gray-500">Round not found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading text-masters-green">{round.course}</h2>
        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
          <span>{formatDate(round.date)}</span>
          <span>·</span>
          <span>{round.tee_time}</span>
          <span>·</span>
          <span>Par {round.par}</span>
          <span className={`font-semibold px-2 py-0.5 rounded ${
            isIndividual
              ? 'bg-masters-green/10 text-masters-green'
              : 'bg-masters-gold/20 text-amber-800'
          }`}>
            {isIndividual ? 'Individual Stableford' : `Scramble ${round.scramble_format}`}
          </span>
        </div>
      </div>

      {/* Individual Round */}
      {isIndividual && individualResults && (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-masters-green px-4 py-2">
              <h3 className="text-white text-lg font-heading m-0">Scorecard</h3>
            </div>
            <Scorecard
              players={data.players}
              scores={data.individualScores.filter(s => s.round_id === roundId)}
              pars={pars}
              isIndividual={true}
            />
          </div>

          {/* Results table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-masters-green px-4 py-2">
              <h3 className="text-white text-lg font-heading m-0">Results</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-masters-green-dark text-white text-xs uppercase">
                  <th className="py-2 px-3 text-center">Pos</th>
                  <th className="py-2 px-3 text-left">Player</th>
                  <th className="py-2 px-3 text-center">Stableford</th>
                  <th className="py-2 px-3 text-center">Strokes</th>
                  <th className="py-2 px-3 text-center">Trip Pts</th>
                </tr>
              </thead>
              <tbody>
                {individualResults.ranked.map(r => {
                  const pt = individualResults.points.find(p => p.playerId === r.playerId);
                  const player = data.players.find(p => p.player_id === r.playerId);
                  const totalStrokes = r.strokes.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={r.playerId} className="border-b border-gray-200">
                      <td className="py-2 px-3 text-center font-semibold">{r.position}</td>
                      <td className="py-2 px-3">
                        <Link to={`/player/${r.playerId}`} className="text-masters-green hover:underline no-underline">
                          {player?.name || r.playerId}
                        </Link>
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-masters-green">{r.total}</td>
                      <td className="py-2 px-3 text-center">{totalStrokes}</td>
                      <td className="py-2 px-3 text-center font-bold text-masters-gold">{pt?.tripPoints.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Scramble Round */}
      {!isIndividual && scrambleResults && (
        <>
          {/* Teams */}
          <div>
            <h3 className="text-lg font-heading text-masters-green mb-3">Teams</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {scrambleResults.teams.map(team => {
                const pp = scrambleResults.playerPts.find(p =>
                  [team.player_1, team.player_2, team.player_3, team.player_4].includes(p.playerId)
                );
                return (
                  <TeamCard
                    key={team.team_id}
                    team={team}
                    players={data.players}
                    ranked={scrambleResults.ranked}
                    points={pp?.scramblePoints}
                  />
                );
              })}
            </div>
          </div>

          {/* Scramble Scorecard */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-masters-green px-4 py-2">
              <h3 className="text-white text-lg font-heading m-0">Team Scorecards</h3>
            </div>
            <Scorecard
              scores={scrambleResults.scores.map(s => ({ ...s, label: `Team ${s.team_id}` }))}
              pars={pars}
              isIndividual={false}
            />
          </div>

          {/* Bonus winners */}
          {bonuses.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-heading text-masters-green mb-3">Bonus Points</h3>
              <div className="space-y-2">
                {bonuses.map((b, i) => {
                  const winner = data.players.find(p => p.player_id === b.winner_player_id);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <BonusBadge type={b.bonus_type} detail={b.detail} />
                      <span className="text-sm">
                        Hole {b.hole} —{' '}
                        <Link to={`/player/${b.winner_player_id}`} className="text-masters-green font-semibold no-underline hover:underline">
                          {winner?.name || b.winner_player_id}
                        </Link>
                        {' '}(+{b.points} pts)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
