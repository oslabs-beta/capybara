// ----------------------------------------------------------
// >> METRICS << //
// ----------------------------------------------------------
import RecentUsage from './RecentUsage';
import GKEClusterCard from './InfoCard';

const Metrics: React.FC = () => {
  return (
    <div>
      <RecentUsage />
      <GKEClusterCard />
    </div>
  );
};

export default Metrics;
