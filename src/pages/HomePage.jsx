import { useMemo } from 'react';
import Leaderboard from '../components/Leaderboard';
import ScheduleList from '../components/ScheduleList';
import { computeLeaderboard } from '../lib/scoring';

export default function HomePage({ data }) {
  const standings = useMemo(() => {
    if (!data) return [];
    return computeLeaderboard(data);
  }, [data]);

  return (
    <div className="space-y-8">
      <Leaderboard standings={standings} />
      <ScheduleList schedule={data?.schedule} />
    </div>
  );
}
