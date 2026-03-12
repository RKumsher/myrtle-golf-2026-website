import PlayerCard from './PlayerCard';

export default function Leaderboard({ standings }) {
  if (!standings || standings.length === 0) {
    return <p className="text-gray-500 text-center py-8">No standings data available yet.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-masters-green px-4 py-3">
        <h2 className="text-white text-xl font-heading m-0">Overall Standings</h2>
      </div>
      <div className="scorecard-scroll">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-masters-green-dark text-white text-xs uppercase tracking-wider">
              <th className="py-2 px-3 text-center w-16">Pos</th>
              <th className="py-2 px-3 text-left">Player</th>
              <th className="py-2 px-3 text-center">Individual</th>
              <th className="py-2 px-3 text-center">Scramble</th>
              <th className="py-2 px-3 text-center">Bonus</th>
              <th className="py-2 px-3 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {standings.map(player => (
              <PlayerCard
                key={player.playerId}
                player={player}
                isLeader={player.rank === 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
