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
        
        // Check if saved cluster still exists in the fetched clusters
        const savedCluster = localStorage.getItem('selectedCluster');
        let clusterFound = false;
        
        if (savedCluster) {
          try {
            const parsedCluster = JSON.parse(savedCluster);
            const existingCluster = res.data.find(
              (cluster) => cluster.name === parsedCluster.name && cluster.location === parsedCluster.location
            );
            
            if (existingCluster) {
              setSelectedCluster(existingCluster);
              clusterFound = true;
            } else {
              // Remove invalid saved cluster
              localStorage.removeItem('selectedCluster');
            }
          } catch (error) {
            console.error('Failed to parse saved cluster:', error);
            localStorage.removeItem('selectedCluster');
          }
        }
        
        // If no valid saved cluster, auto-select the first available cluster
        if (!clusterFound && res.data.length > 0) {
          const firstCluster = res.data[0];
          setSelectedCluster(firstCluster);
          // Save the first cluster as default
          localStorage.setItem('selectedCluster', JSON.stringify(firstCluster));
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
    // Save selected cluster to localStorage
    localStorage.setItem('selectedCluster', JSON.stringify(cluster));
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

