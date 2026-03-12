import { Link } from 'react-router-dom';

export default function PlayerCard({ player, isLeader }) {
  return (
    <tr className={`border-b border-masters-gold/20 hover:bg-masters-gold/5 transition-colors ${
      isLeader ? 'bg-masters-green/5' : ''
    }`}>
      <td className="py-3 px-3 text-center font-semibold">
        {isLeader ? (
          <span title="Leader — Green Jacket">🧥 {player.rank}</span>
        ) : (
          player.rank
        )}
      </td>
      <td className="py-3 px-3 font-semibold">
        <Link
          to={`/player/${player.playerId}`}
          className="text-masters-green hover:text-masters-green-dark no-underline hover:underline"
        >
          {player.name}
        </Link>
      </td>
      <td className="py-3 px-3 text-center">{player.individualPoints.toFixed(1)}</td>
      <td className="py-3 px-3 text-center">{player.scramblePoints.toFixed(1)}</td>
      <td className="py-3 px-3 text-center">{player.bonusPointsTotal}</td>
      <td className="py-3 px-3 text-center font-bold text-lg text-masters-green">
        {player.totalPoints.toFixed(1)}
      </td>
    </tr>
  );
}
