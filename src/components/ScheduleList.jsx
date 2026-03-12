import { Link } from 'react-router-dom';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function ScheduleList({ schedule }) {
  if (!schedule || schedule.length === 0) return null;

  // Group by date
  const grouped = {};
  for (const round of schedule) {
    if (!grouped[round.date]) grouped[round.date] = [];
    grouped[round.date].push(round);
  }

  return (
    <div>
      <h2 className="text-2xl font-heading text-masters-green mb-4">Schedule</h2>
      <div className="space-y-4">
        {Object.entries(grouped).map(([date, rounds], dayIdx) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-masters-green-dark uppercase tracking-wider mb-2">
              Day {dayIdx + 1} — {formatDate(date)}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {rounds.map(round => (
                <Link
                  key={round.round_id}
                  to={`/round/${round.round_id}`}
                  className="block no-underline"
                >
                  <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border-l-4 border-masters-green">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-gray-900">{round.course}</div>
                        <div className="text-sm text-gray-500 mt-1">{round.tee_time} · Par {round.par}</div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        round.type === 'individual'
                          ? 'bg-masters-green/10 text-masters-green'
                          : 'bg-masters-gold/20 text-amber-800'
                      }`}>
                        {round.type === 'individual' ? 'Individual' : `Scramble ${round.scramble_format}`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
