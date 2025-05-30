import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useFetchMetrics } from '../hooks/hookMetric';
// import type { TimeSeries } from '../../../server/src/types/metricTypes';

Chart.register(...registerables);

export const CpuChart = () => {
  const { data, loading, error } = useFetchMetrics(
    'kubernetes.io/container/cpu/limit_utilization',
    30, // past 30 minutes
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Safely transform data for Chart.js
  const chartData = {
    labels: data?.[0]?.points?.map((p) =>
        new Date(
          Number(p.interval?.endTime?.seconds) * 1000,
        ).toLocaleTimeString(),
      ) || [],
    datasets: [
      {
        label: 'CPU Limit Utilization (%)',
        data:
          data?.[0]?.points?.map((p) => (p.value?.doubleValue ?? 0) * 100) ||
          [],
        borderColor: 'rgb(0, 0, 0)',
        tension: 0.1,
      },
    ],
  };
  console.log(chartData);

  return <Line data={chartData} />;
};
