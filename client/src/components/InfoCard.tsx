'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CpuIcon, HardHatIcon, MemoryStickIcon, NetworkIcon, ServerIcon } from 'lucide-react';
import { useFetchMetrics } from '../hooks/hookMetric';
import axios from 'axios';

const duration = 5;

 interface ClusterInfo {
  name: string;
  location: string;
  status: string;
  nodeCount: number;
  network: string;
}

const useClusterInfo = () => {
  const [data, setData] = useState<ClusterInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCluster = async () => {
      setLoading(true);
      try {
        const res = await axios.get<ClusterInfo>('/api/gke/cluster');
        setData(res.data);
      } catch (err) {
        setError(`Failed to fetch cluster info, ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCluster();
  }, []);

  return { data, loading, error };
};

const GKEClusterCard: React.FC = () => {
  const { data: cluster, loading: clusterLoading } = useClusterInfo();

  const cpuMetric = 'kubernetes.io/container/cpu/limit_utilization';
  const memMetric = 'kubernetes.io/container/memory/request_utilization';

  const { data: cpuData, loading: cpuLoading } = useFetchMetrics(
    cpuMetric,
    duration,
  );
  const { data: memData, loading: memLoading } = useFetchMetrics(
    memMetric,
    duration,
  );

  const [cpu, setCpu] = useState('...');
  const [memory, setMemory] = useState('...');

  useEffect(() => {
    const cpuVal = cpuData?.[0]?.points?.[0]?.value?.doubleValue;
    const memVal = memData?.[0]?.points?.[0]?.value?.doubleValue;

    if (cpuVal != null) setCpu(`${(cpuVal * 100).toFixed(2)}%`);
    if (memVal != null) setMemory(`${(memVal).toFixed(2)}%`);
  }, [cpuData, memData]);

  if (clusterLoading) return <p>Loading cluster info...</p>;
  if (!cluster) return <p>Cluster data not available</p>;

  const { name, location, status, nodeCount, network } = cluster;

  return (
    <Card className="rounded-2xl border shadow-md hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">GKE Cluster</CardTitle>
            <p className="text-muted-foreground text-sm">{location}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="text-muted-foreground grid gap-4 text-sm">
        <div className="flex items-center gap-2">
          <ServerIcon className="text-primary h-4 w-4" />
          Cluster: <strong className="text-foreground">{name}</strong>
        </div>
        <div className="flex items-center gap-2">
          <HardHatIcon className="text-primary h-4 w-4" />
          Status: <strong className="text-foreground">{status}</strong>
        </div>
        <div className="flex items-center gap-2">
          <CpuIcon className="text-primary h-4 w-4" />
          CPU:{' '}
          <strong className="text-foreground">
            {cpuLoading ? 'Loading...' : cpu}
          </strong>
        </div>
        <div className="flex items-center gap-2">
          <MemoryStickIcon className="text-primary h-4 w-4" />
          RAM:{' '}
          <strong className="text-foreground">
            {memLoading ? 'Loading...' : memory}
          </strong>
        </div>
        <div className="flex items-center gap-2">
          <NetworkIcon className="text-primary h-4 w-4" />
          Network: <strong className="text-foreground">{network}</strong>
        </div>
        <div className="flex items-center gap-2">
          <ServerIcon className="text-primary h-4 w-4" />
          Nodes: <strong className="text-foreground">{nodeCount}</strong>
        </div>
      </CardContent>
    </Card>
  );
};

export default GKEClusterCard;
