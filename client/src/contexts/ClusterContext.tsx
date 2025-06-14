import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface ClusterInfo {
  name: string;
  location: string;
  status: string;
  nodeCount: number;
  network: string;
}

interface ClusterContextType {
  clusters: ClusterInfo[];
  selectedCluster: ClusterInfo | null;
  setSelectedCluster: (cluster: ClusterInfo) => void;
  loading: boolean;
  error: string | null;
}

const ClusterContext = createContext<ClusterContextType | undefined>(undefined);

export const useCluster = () => {
  const context = useContext(ClusterContext);
  if (!context) {
    throw new Error('useCluster must be used within a ClusterProvider');
  }
  return context;
};

interface ClusterProviderProps {
  children: ReactNode;
}

export const ClusterProvider: React.FC<ClusterProviderProps> = ({ children }) => {
  const [clusters, setClusters] = useState<ClusterInfo[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<ClusterInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClusters = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await axios.get<ClusterInfo[]>(`${baseUrl}/api/gke/clusters`);
        setClusters(res.data);
        // Auto-select the first cluster if available
        if (res.data.length > 0) {
          setSelectedCluster(res.data[0]);
        }
      } catch (err) {
        setError(`Failed to fetch clusters: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, []);

  const handleSetSelectedCluster = (cluster: ClusterInfo) => {
    setSelectedCluster(cluster);
  };

  return (
    <ClusterContext.Provider
      value={{
        clusters,
        selectedCluster,
        setSelectedCluster: handleSetSelectedCluster,
        loading,
        error,
      }}
    >
      {children}
    </ClusterContext.Provider>
  );
};

