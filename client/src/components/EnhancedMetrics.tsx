// ----------------------------------------------------------
// >> METRICS CARD << //
// ----------------------------------------------------------
import { motion } from 'motion/react';
import EnhancedRecentUsage from './EnhancedRecentUsage';
import EnhancedGKEClusterCard from './EnhancedInfoCard';

const EnhancedMetrics: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col space-y-3"
    >
      {/* Enhanced cluster info card - more compact */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-shrink-0"
      >
        <EnhancedGKEClusterCard />
      </motion.div>

      {/* Enhanced metrics grid - takes remaining space */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-0 min-h-0"
      >
        <EnhancedRecentUsage />
      </motion.div>
    </motion.div>
  );
};

export default EnhancedMetrics;
