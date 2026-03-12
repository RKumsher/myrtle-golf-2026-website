export default function ScoringPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <h2 className="text-3xl font-heading text-masters-green">How Scoring Works</h2>

      {/* Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h3 className="text-xl font-heading text-masters-green">Trip Overview</h3>
        <p className="text-gray-700">
          9 rounds over 5 days. Each day features a morning <strong>individual Stableford</strong> round
          and an afternoon <strong>scramble</strong> — except Day 1 which is individual only.
          Points accumulate across all rounds. The player with the most total points at the end wins.
        </p>
      </div>

      {/* Stableford */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-heading text-masters-green">Individual Rounds — Stableford Scoring</h3>
        <p className="text-gray-700">
          Each hole is scored relative to par using the Modified Stableford system:
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-masters-green/20">
              <th className="py-2 text-left text-gray-600">Score</th>
              <th className="py-2 text-center text-gray-600">Stableford Points</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Albatross (3 under)', '5', 'stableford-eagle'],
              ['Eagle (2 under)', '4', 'stableford-eagle'],
              ['Birdie (1 under)', '3', 'stableford-birdie'],
              ['Par', '2', 'stableford-par'],
              ['Bogey (1 over)', '1', 'stableford-bogey'],
              ['Double Bogey+ (2+ over)', '0', 'stableford-double'],
            ].map(([label, pts, cls]) => (
              <tr key={label} className="border-b border-gray-100">
                <td className="py-2">{label}</td>
                <td className="py-2 text-center">
                  <span className={`stableford-circle ${cls}`}>{pts}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-gray-700">
          After 18 holes, players are ranked by total Stableford points (highest wins).
          Trip points are awarded by finish position:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            ['1st', '10'],
            ['2nd', '7'],
            ['3rd', '5'],
            ['4th', '3'],
            ['5th', '2'],
            ['6th–8th', '1'],
          ].map(([pos, pts]) => (
            <div key={pos} className="bg-masters-cream rounded px-3 py-2 text-center">
              <div className="text-xs text-gray-500">{pos}</div>
              <div className="font-bold text-masters-green">{pts}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          Ties split points — e.g., two players tied for 1st each get (10+7)/2 = 8.5 points.
        </p>
      </div>

      {/* Scramble */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-heading text-masters-green">Scramble Rounds</h3>
        <p className="text-gray-700">
          Afternoon rounds are played as team scrambles. Teams are scored by total strokes (lowest wins).
          Two formats are used:
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-masters-cream rounded-lg p-4">
            <h4 className="font-semibold text-masters-green-dark mb-2">2v2v2v2</h4>
            <p className="text-sm text-gray-600 mb-2">4 teams of 2 players</p>
            <div className="space-y-1 text-sm">
              {[['1st place', '8 pts/player'], ['2nd place', '5 pts/player'], ['3rd place', '3 pts/player'], ['4th place', '1 pt/player']].map(([pos, pts]) => (
                <div key={pos} className="flex justify-between">
                  <span>{pos}</span>
                  <span className="font-semibold text-masters-green">{pts}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-masters-cream rounded-lg p-4">
            <h4 className="font-semibold text-masters-green-dark mb-2">4v4</h4>
            <p className="text-sm text-gray-600 mb-2">2 teams of 4 players</p>
            <div className="space-y-1 text-sm">
              {[['Winners', '6 pts/player'], ['Losers', '2 pts/player']].map(([pos, pts]) => (
                <div key={pos} className="flex justify-between">
                  <span>{pos}</span>
                  <span className="font-semibold text-masters-green">{pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Ties split points — same as individual rounds.
        </p>
      </div>

      {/* Bonus */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h3 className="text-xl font-heading text-masters-green">Bonus Points</h3>
        <p className="text-gray-700">
          Bonus points are awarded during scramble rounds only and go to the <strong>individual player</strong>, not the team.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="font-semibold">Closest to Pin (CTP)</div>
              <div className="text-sm text-gray-600">2 points — on all par 3 holes</div>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 rounded-lg p-4">
            <span className="text-2xl">💪</span>
            <div>
              <div className="font-semibold">Longest Drive (LD)</div>
              <div className="text-sm text-gray-600">2 points — 1 designated hole per round</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
