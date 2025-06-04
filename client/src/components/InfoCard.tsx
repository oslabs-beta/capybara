'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CpuIcon, NetworkIcon, ServerIcon } from 'lucide-react';

type GKEClusterInfo = {
  name: string;
  location: string;
  status: string;
  nodeCount: number;
  cpu: string;
  memory: string;
  network: string;
};

const clusterData: GKEClusterInfo = {
  name: 'danger-noodle-cluster',
  location: 'us-central1',
  status: 'RUNNING',
  nodeCount: 4,
  cpu: '16 vCPUs',
  memory: '64 GB',
  network: '10.0.0.0/14',
};

const GKEClusterCard: React.FC = () => {
  const { name, location, nodeCount, cpu, memory, network } =
    clusterData;

  return (
    <Card className="rounded-2xl border shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">GKE Cluster</CardTitle>
            <p className="text-muted-foreground text-sm">{location}</p>
          </div>
          {/* <Badge
            variant={status === 'RUNNING' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {status}
          </Badge> */}
        </div>
      </CardHeader>

      <CardContent className="text-muted-foreground grid gap-4 text-sm">
        <div className="flex items-center gap-2">
          <ServerIcon className="text-primary h-4 w-4" />
          <span>
            Cluster: <strong className="text-foreground">{name}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CpuIcon className="text-primary h-4 w-4" />
          <span>
            vCPU: <strong className="text-foreground">{cpu}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* <MemoryIcon className="text-primary h-4 w-4" /> */}
          <span>
            RAM: <strong className="text-foreground">{memory}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <NetworkIcon className="text-primary h-4 w-4" />
          <span>
            Network: <strong className="text-foreground">{network}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ServerIcon className="text-primary h-4 w-4" />
          <span>
            Nodes: <strong className="text-foreground">{nodeCount}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GKEClusterCard;
