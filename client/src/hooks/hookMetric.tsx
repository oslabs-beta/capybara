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

export const useFetchMetrics = (metricType: string, duration: number) => {
  const [data, setData] = useState<TimeSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get<TimeSeries[]>('/api/metrics', {
          params: { metricType, duration },
        });
        setData(res.data);
      } catch (err) {
        setError(`Failed to fetch metrics, ${err}`);
      } finally {
        setLoading(false);
      }
    };

    if (metricType) fetchData();
  }, [metricType, duration]);

  return { data, loading, error };
};
