// src/hooks/useFetchMetrics.ts
import axios from 'axios';
import { useState, useEffect } from 'react';

// Define types locally instead of importing from server
interface MetricPoint {
  interval?: {
    endTime?: {
      seconds?: string;
    };
  };
  value?: {
    doubleValue?: number;
  };
}

export interface TimeSeries {
  points?: MetricPoint[];
}

interface ClusterInfo {
  name: string;
  location: string;
}

export const useFetchMetrics = (
  metricType: string, 
  duration: number, 
  cluster?: ClusterInfo | null
) => {
  const [data, setData] = useState<TimeSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const params: any = { metricType, duration };
        
        // Add cluster parameters if cluster is provided
        if (cluster) {
          params.clusterName = cluster.name;
          params.clusterLocation = cluster.location;
        }
        
        const res = await axios.get<TimeSeries[]>(`${baseUrl}/api/metrics`, {
          params,
        });
        setData(res.data);
      } catch (err) {
        setError(`Failed to fetch metrics, ${err}`);
      } finally {
        setLoading(false);
      }
    };

    if (metricType) fetchData();
  }, [metricType, duration, cluster?.name, cluster?.location]);

  return { data, loading, error };
};
