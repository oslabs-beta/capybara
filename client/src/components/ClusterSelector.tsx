import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCluster } from '@/contexts/ClusterContext';
import { ServerIcon } from 'lucide-react';

const ClusterSelector: React.FC = () => {
  const { clusters, selectedCluster, setSelectedCluster, loading } =
    useCluster();

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <ServerIcon className="h-4 w-4" />
        Loading clusters...
      </div>
    );
  }

  if (clusters.length === 0) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <ServerIcon className="h-4 w-4" />
        No clusters available
      </div>
    );
  }

  const handleClusterChange = (value: string) => {
    const [name, location] = value.split('|');
    const cluster = clusters.find(
      (c) => c.name === name && c.location === location,
    );
    if (cluster) {
      setSelectedCluster(cluster);
    }
  };

  const selectedValue = selectedCluster
    ? `${selectedCluster.name}|${selectedCluster.location}`
    : '';

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <ServerIcon className="text-primary h-4 w-4" />
        <span>Connected to</span>
      </div>
      <Select value={selectedValue} onValueChange={handleClusterChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a cluster" />
        </SelectTrigger>
        <SelectContent>
          {clusters.map((cluster) => {
            const value = `${cluster.name}|${cluster.location}`;
            return (
              <SelectItem key={value} value={value}>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{cluster.name}</span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClusterSelector;
