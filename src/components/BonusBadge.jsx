export default function BonusBadge({ type, detail }) {
  const isCtp = type === 'ctp';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
      isCtp ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
    }`}>
      {isCtp ? '🎯 CTP' : '💪 LD'}
      {detail && <span className="font-normal">— {detail}</span>}
    </span>
  );
}
