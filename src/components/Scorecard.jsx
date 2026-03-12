import StablefordBadge from './StablefordBadge';
import { calcStablefordPoints } from '../config';

export default function Scorecard({ players, scores, pars, isIndividual = true }) {
  if (!pars || pars.length === 0) return null;

  const front9 = pars.slice(0, 9);
  const back9 = pars.slice(9, 18);

  return (
    <div className="scorecard-scroll">
      <table className="w-full text-xs border-collapse min-w-[700px]">
        <thead>
          {/* Hole numbers */}
          <tr className="bg-masters-green text-white">
            <th className="py-2 px-2 text-left sticky left-0 bg-masters-green z-10 min-w-[80px]">Hole</th>
            {[...Array(9)].map((_, i) => (
              <th key={i} className="py-2 px-1 text-center w-8">{i + 1}</th>
            ))}
            <th className="py-2 px-1 text-center font-bold bg-masters-green-dark">Out</th>
            {[...Array(9)].map((_, i) => (
              <th key={i + 9} className="py-2 px-1 text-center w-8">{i + 10}</th>
            ))}
            <th className="py-2 px-1 text-center font-bold bg-masters-green-dark">In</th>
            <th className="py-2 px-1 text-center font-bold bg-masters-green-dark">Tot</th>
            {isIndividual && <th className="py-2 px-1 text-center font-bold bg-masters-green-dark">Pts</th>}
          </tr>
          {/* Par row */}
          <tr className="bg-gray-100 text-gray-600">
            <td className="py-1 px-2 font-semibold sticky left-0 bg-gray-100 z-10">Par</td>
            {front9.map((p, i) => (
              <td key={i} className="py-1 px-1 text-center">{p}</td>
            ))}
            <td className="py-1 px-1 text-center font-bold">{front9.reduce((a, b) => a + b, 0)}</td>
            {back9.map((p, i) => (
              <td key={i + 9} className="py-1 px-1 text-center">{p}</td>
            ))}
            <td className="py-1 px-1 text-center font-bold">{back9.reduce((a, b) => a + b, 0)}</td>
            <td className="py-1 px-1 text-center font-bold">{pars.reduce((a, b) => a + b, 0)}</td>
            {isIndividual && <td className="py-1 px-1 text-center">—</td>}
          </tr>
        </thead>
        <tbody>
          {scores.map((row, idx) => {
            const name = players
              ? (players.find(p => p.player_id === row.player_id)?.name || row.team_id || `Player ${idx + 1}`)
              : (row.label || `Team ${row.team_id || idx + 1}`);

            const holeScores = [];
            for (let i = 1; i <= 18; i++) {
              holeScores.push(Number(row[`hole_${i}`]) || 0);
            }

            const front = holeScores.slice(0, 9);
            const back = holeScores.slice(9, 18);
            const frontTotal = front.reduce((a, b) => a + b, 0);
            const backTotal = back.reduce((a, b) => a + b, 0);
            const total = frontTotal + backTotal;

            let stablefordTotal = 0;
            if (isIndividual) {
              for (let i = 0; i < 18; i++) {
                stablefordTotal += calcStablefordPoints(holeScores[i], pars[i]);
              }
            }

            return (
              <tr key={row.player_id || row.team_id || idx} className="border-b border-gray-200 hover:bg-masters-gold/5">
                <td className="py-2 px-2 font-semibold sticky left-0 bg-white z-10">{name}</td>
                {front.map((s, i) => (
                  <td key={i} className="py-1 px-1 text-center">
                    {isIndividual ? <StablefordBadge strokes={s} par={pars[i]} /> : s}
                  </td>
                ))}
                <td className="py-1 px-1 text-center font-bold bg-gray-50">{frontTotal}</td>
                {back.map((s, i) => (
                  <td key={i + 9} className="py-1 px-1 text-center">
                    {isIndividual ? <StablefordBadge strokes={s} par={pars[i + 9]} /> : s}
                  </td>
                ))}
                <td className="py-1 px-1 text-center font-bold bg-gray-50">{backTotal}</td>
                <td className="py-1 px-1 text-center font-bold bg-gray-50">{total}</td>
                {isIndividual && (
                  <td className="py-1 px-1 text-center font-bold text-masters-green bg-gray-50">{stablefordTotal}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
