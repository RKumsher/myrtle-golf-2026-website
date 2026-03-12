export default function TeamCard({ team, players, ranked, points }) {
  const members = [team.player_1, team.player_2, team.player_3, team.player_4].filter(Boolean);
  const memberNames = members.map(id => players.find(p => p.player_id === id)?.name || id);
  const teamRank = ranked?.find(r => r.teamId === team.team_id);

  const posLabels = ['1st', '2nd', '3rd', '4th'];
  const posLabel = teamRank ? posLabels[teamRank.position - 1] || `${teamRank.position}th` : '—';

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-masters-gold">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-900">Team {team.team_id}</div>
        <div className="flex items-center gap-3">
          {teamRank && (
            <span className="text-sm text-gray-500">{teamRank.total} strokes</span>
          )}
          <span className={`text-sm font-bold px-2 py-0.5 rounded ${
            teamRank?.position === 1 ? 'bg-masters-gold/20 text-amber-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {posLabel}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {memberNames.map((name, i) => (
          <span key={i} className="text-sm bg-masters-cream px-2 py-1 rounded">
            {name}
            {points != null && (
              <span className="ml-1 text-masters-green font-semibold">+{points}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
