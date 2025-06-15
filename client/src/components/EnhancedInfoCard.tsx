// Enhanced InfoCard.tsx - Keeping your original theme with gradient header
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CpuIcon,
  MemoryStickIcon,
  NetworkIcon,
  ServerIcon,
  Activity,
} from 'lucide-react';
import { useFetchMetrics } from '../hooks/hookMetric';
import { motion } from 'motion/react';
import { useCluster } from '@/contexts/ClusterContext';

const duration = 5;

const StatusBadge = ({ status }: { status: string }) => {
  const isRunning = status.toLowerCase() === 'running';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        isRunning
          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
      }`}
    >
      <motion.div
        className={`h-2 w-2 rounded-full ${
          isRunning ? 'bg-green-500' : 'bg-yellow-500'
        }`}
        animate={isRunning ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {status}
    </motion.div>
  );
};

const GKEClusterCard: React.FC = () => {
  const {
    selectedCluster: cluster,
    loading: clusterLoading,
    error,
  } = useCluster();

  const cpuMetric = 'kubernetes.io/container/cpu/limit_utilization';
  const memMetric = 'kubernetes.io/container/memory/limit_utilization';

  const { data: cpuData, loading: cpuLoading } = useFetchMetrics(
    cpuMetric,
    duration,
    cluster,
  );
  const { data: memData, loading: memLoading } = useFetchMetrics(
    memMetric,
    duration,
    cluster,
  );

  const [cpu, setCpu] = useState('...');
  const [memory, setMemory] = useState('...');

  useEffect(() => {
    const cpuVal = cpuData?.[0]?.points?.[0]?.value?.doubleValue;
    const memVal = memData?.[0]?.points?.[0]?.value?.doubleValue;

    if (cpuVal != null) setCpu(`${(cpuVal * 100).toFixed(2)}%`);
    if (memVal != null) setMemory(`${memVal.toFixed(2)}%`);
  }, [cpuData, memData]);

  if (clusterLoading) return <p>Loading cluster info...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cluster) return <p>No cluster selected</p>;

  const { name, location, status, nodeCount, network } = cluster;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden rounded-2xl border shadow-md transition-shadow duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-base font-bold text-transparent md:text-2xl">
                  <span className="hidden md:inline">
                    Google Kubernetes Engine Cluster Health
                  </span>
                  <span className="inline md:hidden">GKE Cluster Health</span>
                </CardTitle>
                {/* <p className="text-muted-foreground mt-1">
                  Real-time monitoring and metrics for your GKE cluster
                </p> */}
                <p className="text-muted-foreground text-sm">
                  Region: {location}
                </p>
              </div>
              <StatusBadge status={status} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="text-muted-foreground text-sm">
          {/* Grid layout for better space utilization - 3 columns on medium+ screens */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ServerIcon className="text-primary h-4 w-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-muted-foreground">Cluster</span>
                <div className="text-foreground truncate font-semibold">
                  {name}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Activity className="text-primary h-4 w-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-muted-foreground">Status</span>
                <div className="text-foreground font-semibold">{status}</div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CpuIcon className="text-primary h-4 w-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-muted-foreground">CPU</span>
                <div className="text-foreground font-semibold">
                  {cpuLoading ? 'Loading...' : cpu}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MemoryStickIcon className="text-primary h-4 w-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-muted-foreground">RAM</span>
                <div className="text-foreground font-semibold">
                  {memLoading ? 'Loading...' : memory}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <NetworkIcon className="text-primary h-4 w-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-muted-foreground">Network</span>
                <div className="text-foreground truncate font-semibold">
                  {network}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Activity className="text-primary h-4 w-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-muted-foreground">Nodes</span>
                <div className="text-foreground font-semibold">{nodeCount}</div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GKEClusterCard;
