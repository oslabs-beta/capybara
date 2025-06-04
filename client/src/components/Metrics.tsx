// ----------------------------------------------------------
// >> METRICS << //
// ----------------------------------------------------------
import RecentUsage from './RecentUsage';
import GKEClusterCard from './InfoCard';

const Metrics: React.FC = () => {
  return (
    <div className="space-y-3">
      <GKEClusterCard />
      <RecentUsage />
    </div>
  );
};

export default Metrics;
