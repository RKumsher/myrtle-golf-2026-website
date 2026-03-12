export default function StatBlock({ label, value, sub }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-center">
      <div className="text-2xl font-bold text-masters-green">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}
