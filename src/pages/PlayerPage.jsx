import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import StatBlock from '../components/StatBlock';
import BonusBadge from '../components/BonusBadge';
import { computeLeaderboard, computePlayerStats } from '../lib/scoring';

export default function PlayerPage({ data }) {
  const { playerId } = useParams();

  const player = data?.players?.find(p => p.player_id === playerId);

  const standings = useMemo(() => {
    if (!data) return [];
    return computeLeaderboard(data);
  }, [data]);

  const playerStanding = standings.find(s => s.playerId === playerId);

  const stats = useMemo(() => {
    if (!data) return null;
    return computePlayerStats(playerId, data.individualScores, data.courseHoles, data.schedule);
  }, [data, playerId]);

  const bonuses = useMemo(() => {
    if (!data) return [];
    return data.bonusPoints.filter(b => b.winner_player_id === playerId);
  }, [data, playerId]);

  // Scramble info
  const scrambleInfo = useMemo(() => {
    if (!data || !playerStanding) return [];
    return playerStanding.roundResults.filter(r => r.type === 'scramble');
  }, [data, playerStanding]);

  if (!player) {
    return <p className="text-center py-8 text-gray-500">Player not found.</p>;
  }

  const distColors = {
    eagle: 'bg-masters-red',
    birdie: 'bg-red-400',
    par: 'bg-masters-green',
    bogey: 'bg-gray-400',
    doublePlus: 'bg-gray-600',
  };
  const distLabels = {
    eagle: 'Eagle+',
    birdie: 'Birdie',
    par: 'Par',
    bogey: 'Bogey',
    doublePlus: 'Double+',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading text-masters-green">
            {playerStanding?.rank === 1 && <span title="Leader">🧥 </span>}
            {player.name}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Rank #{playerStanding?.rank || '—'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-masters-green">
            {playerStanding?.totalPoints.toFixed(1) || '0'}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Total Points</div>
        </div>
      </div>

      {/* Points Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <StatBlock label="Individual" value={playerStanding?.individualPoints.toFixed(1) || '0'} />
        <StatBlock label="Scramble" value={playerStanding?.scramblePoints.toFixed(1) || '0'} />
        <StatBlock label="Bonus" value={playerStanding?.bonusPointsTotal || '0'} />
      </div>

      {/* Round Results */}
      {playerStanding && playerStanding.roundResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-masters-green px-4 py-2">
            <h3 className="text-white text-lg font-heading m-0">Round by Round</h3>
          </div>
          <div className="scorecard-scroll">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-masters-green-dark text-white text-xs uppercase">
                <th className="py-2 px-3 text-left">Round</th>
                <th className="py-2 px-3 text-center">Type</th>
                <th className="py-2 px-3 text-center">Pos</th>
                <th className="py-2 px-3 text-center">Score</th>
                <th className="py-2 px-3 text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              {playerStanding.roundResults.map((rr, i) => {
                const round = data.schedule.find(r => r.round_id === rr.roundId);
                return (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-2 px-3">
                      <Link to={`/round/${rr.roundId}`} className="text-masters-green no-underline hover:underline">
                        {round?.course || `Round ${rr.roundId}`}
                      </Link>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        rr.type === 'individual' ? 'bg-masters-green/10 text-masters-green' : 'bg-masters-gold/20 text-amber-800'
                      }`}>
                        {rr.type === 'individual' ? 'Individual' : 'Scramble'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center font-semibold">{rr.position || '—'}</td>
                    <td className="py-2 px-3 text-center">
                      {rr.type === 'individual'
                        ? `${rr.stablefordTotal} Stableford / ${rr.totalStrokes} strokes`
                        : `${rr.teamTotal || '—'} strokes`
                      }
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-masters-green">
                      +{(rr.tripPoints || rr.scramblePoints || 0).toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Individual Stats */}
      {stats && (
        <>
          <h3 className="text-xl font-heading text-masters-green">Individual Stats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBlock label="Avg Strokes" value={stats.avgStrokes.toFixed(1)} />
            <StatBlock label="Avg vs Par" value={(stats.avgVsPar >= 0 ? '+' : '') + stats.avgVsPar.toFixed(1)} />
            <StatBlock label="Avg Stableford" value={stats.avgStableford.toFixed(1)} sub="per round" />
            <StatBlock label="Rounds Played" value={stats.rounds} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatBlock label="Par 3 Avg" value={stats.parTypeAvg[3].toFixed(2)} />
            <StatBlock label="Par 4 Avg" value={stats.parTypeAvg[4].toFixed(2)} />
            <StatBlock label="Par 5 Avg" value={stats.parTypeAvg[5].toFixed(2)} />
          </div>

          {stats.bestRound && (
            <div className="grid grid-cols-2 gap-3">
              <StatBlock
                label="Best Round"
                value={stats.bestRound.stableford + ' pts'}
                sub={stats.bestRound.course}
              />
              <StatBlock
                label="Worst Round"
                value={stats.worstRound.stableford + ' pts'}
                sub={stats.worstRound.course}
              />
            </div>
          )}

          {/* Scoring Distribution */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-md font-heading text-masters-green mb-3">Scoring Distribution</h4>
            <div className="space-y-2">
              {Object.entries(distLabels).map(([key, label]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-right text-gray-600">{label}</div>
                  <div className="flex-1 bg-gray-100 rounded h-5 relative">
                    <div
                      className={`stat-bar ${distColors[key]}`}
                      style={{ width: `${stats.distributionPct[key]}%` }}
                    />
                  </div>
                  <div className="w-16 text-xs text-gray-600">
                    {stats.distribution[key]} ({stats.distributionPct[key].toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Scramble Stats */}
      {scrambleInfo.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h4 className="text-md font-heading text-masters-green mb-3">Scramble Results</h4>
          <div className="text-sm text-gray-600">
            {scrambleInfo.length} scramble{scrambleInfo.length !== 1 ? 's' : ''} played ·{' '}
            {playerStanding?.scramblePoints.toFixed(1)} points earned
          </div>
        </div>
      )}

      {/* Bonus Points */}
      {bonuses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h4 className="text-md font-heading text-masters-green mb-3">Bonus Points</h4>
          <div className="space-y-2">
            {bonuses.map((b, i) => {
              const round = data.schedule.find(r => r.round_id === b.round_id);
              return (
                <div key={i} className="flex items-center gap-3">
                  <BonusBadge type={b.bonus_type} detail={b.detail} />
                  <span className="text-sm text-gray-600">
                    Hole {b.hole} · {round?.course || `Round ${b.round_id}`} (+{b.points} pts)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
