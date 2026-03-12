import { calcStablefordPoints } from '../config';

export default function StablefordBadge({ strokes, par }) {
  if (!strokes || !par) return <span className="stableford-circle stableford-par">–</span>;

  const points = calcStablefordPoints(strokes, par);
  const diff = strokes - par;

  let className = 'stableford-circle ';
  if (diff <= -2) className += 'stableford-eagle';
  else if (diff === -1) className += 'stableford-birdie';
  else if (diff === 0) className += 'stableford-par';
  else if (diff === 1) className += 'stableford-bogey';
  else className += 'stableford-double';

  return (
    <span className={className} title={`${strokes} strokes (${points} pts)`}>
      {strokes}
    </span>
  );
}
