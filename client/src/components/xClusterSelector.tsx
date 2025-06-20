// ----------------------------------------------------------
// >> CLUSTER SELECTOR << //
// ----------------------------------------------------------
// * Added to navigation bar for better UX

import React, { useState } from 'react';
import { useCluster } from '@/contexts/ClusterContext';
import { ServerIcon, ChevronDownIcon, CheckIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ClusterSelector: React.FC = () => {
  const { clusters, selectedCluster, setSelectedCluster, loading } =
    useCluster();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-4">
        <ServerIcon className="text-primary h-5 w-5" />
        <span className="text-muted-foreground">Loading clusters...</span>
      </div>
    );
  }

  if (clusters.length === 0) {
    return (
      <div className="flex items-center gap-3 py-4">
        <ServerIcon className="text-primary h-5 w-5" />
        <span className="text-muted-foreground">No clusters available</span>
      </div>
    );
  }

  const handleClusterSelect = (cluster: any) => {
    setSelectedCluster(cluster);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      {/* <div className="flex items-center gap-2 text-sm font-medium">
        <ServerIcon className="text-primary h-4 w-4" />
        <span>Connected to</span>
      </div> */}

      {/* Custom Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="border-input shadow-xs hover:bg-accent hover:text-accent-foreground focus:border-ring focus:ring-ring/50 flex w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2"
        >
          <div className="flex items-center gap-2">
            {selectedCluster ? (
              <div className="flex flex-col items-start">
                <span className="font-medium">{selectedCluster.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Select a cluster</span>
            )}
          </div>
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="border-input bg-popover absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border shadow-md"
            >
              {clusters.map((cluster) => {
                const isSelected =
                  selectedCluster?.name === cluster.name &&
                  selectedCluster?.location === cluster.location;

                return (
                  <button
                    key={`${cluster.name}-${cluster.location}`}
                    onClick={() => handleClusterSelect(cluster)}
                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex w-full items-center gap-2 px-3 py-2 text-left text-sm focus:outline-none"
                  >
                    <div className="flex flex-1 flex-col">
                      <span className="font-medium">{cluster.name}</span>
                    </div>
                    {isSelected && (
                      <CheckIcon className="text-primary h-4 w-4" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay to close dropdown when clicking outside */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ClusterSelector;
