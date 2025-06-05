// ----------------------------------------------------------
// >> GCP KUBERNETES METRICS WITH REAL PEAK CALCULATION << //
// ----------------------------------------------------------

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  ResponsiveContainer,
  RadialBarChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useFetchMetrics } from '../hooks/hookMetric';
import { motion } from 'motion/react';

const metricConfigs = [
  {
    name: 'CPU',
    metricType: 'compute.googleapis.com/instance/cpu/utilization',
    fill: 'var(--chart-1)',
    convertToPercentage: true,
    gradient: 'from-orange-400 to-red-500',
  },
  {
    name: 'Memory',
    metricType: 'kubernetes.io/container/memory/limit_utilization',
    fill: 'var(--chart-2)',
    convertToPercentage: false,
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    name: 'CPU Request',
    metricType: 'kubernetes.io/container/cpu/request_utilization',
    fill: 'var(--chart-3)',
    convertToPercentage: false,
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    name: 'CPU Limit',
    metricType: 'kubernetes.io/container/cpu/limit_utilization',
    fill: 'var(--chart-4)',
    convertToPercentage: true,
    gradient: 'from-purple-400 to-pink-500',
  },
];

const chartConfig = {
  cpu: {
    label: 'CPU Utilization',
    color: 'var(--chart-1)',
  },
  memory: {
    label: 'Memory Usage',
    color: 'var(--chart-2)',
  },
  request: {
    label: 'CPU Request Utilization',
    color: 'var(--chart-3)',
  },
  limit: {
    label: 'CPU Limit Utilization',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

// Helper function to calculate real peak from historical data
const calculatePeak24h = (
  timeSeries: any[],
  convertToPercentage: boolean,
): number => {
  if (!timeSeries || !timeSeries[0]?.points) return 0;

  const points = timeSeries[0].points;
  if (points.length === 0) return 0;

  // Get all values and find the maximum
  const values = points.map((point: any) => {
    const rawValue = point.value?.doubleValue ?? 0;
    return convertToPercentage ? rawValue * 100 : rawValue;
  });

  return Math.max(...values);
};

// Helper function to calculate average from historical data
const calculateAverage24h = (
  timeSeries: any[],
  convertToPercentage: boolean,
): number => {
  if (!timeSeries || !timeSeries[0]?.points) return 0;

  const points = timeSeries[0].points;
  if (points.length === 0) return 0;

  const values = points.map((point: any) => {
    const rawValue = point.value?.doubleValue ?? 0;
    return convertToPercentage ? rawValue * 100 : rawValue;
  });

  const sum = values.reduce((acc: number, val: number) => acc + val, 0);
  return sum / values.length;
};

const EnhancedOriginalMetricCard = ({
  metric,
  index,
  value,
  peak24h,
  average24h,
  loading,
}: {
  metric: (typeof metricConfigs)[0];
  index: number;
  value: number;
  peak24h: number;
  average24h: number;
  loading: boolean;
}) => {
  // Calculate the end angle for the radial chart
  const percentage = Math.min(value, 100);
  const endAngle = 180 - (360 * percentage) / 100;

  const chartData = [{ name: metric.name, value: percentage }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col"
    >
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"></CardHeader>

        <CardContent className="flex-1">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[180px]"
          >
            <ResponsiveContainer width="10%" height="10%">
              <RadialBarChart
                data={chartData}
                startAngle={180}
                endAngle={endAngle}
                innerRadius={80}
                outerRadius={130}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[86, 74]}
                />
                <RadialBar
                  dataKey="value"
                  background
                  fill={metric.fill}
                  className="drop-shadow-sm"
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-2xl font-semibold"
                            >
                              {loading ? '...' : value.toFixed(0)}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground text-sm font-semibold"
                            >
                              {metric.name}
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Additional info below chart with REAL data */}
          <div className="mt-4 space-y-2 text-center">
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>Peak (24h)</span>
              <span className="font-medium">
                {loading ? '...' : `${peak24h.toFixed(1)}%`}
              </span>
            </div>
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>Avg (24h)</span>
              <span className="font-medium">
                {loading ? '...' : `${average24h.toFixed(1)}%`}
              </span>
            </div>
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>Threshold</span>
              <span className="font-medium">80%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ResourceUsageRadialCharts: React.FC = () => {
  // Fetch metrics using the custom hook for each metric (24 hours = 1440 minutes)
  const cpuMetrics = useFetchMetrics(metricConfigs[0].metricType, 1440);
  const memoryMetrics = useFetchMetrics(metricConfigs[1].metricType, 1440);
  const requestMetrics = useFetchMetrics(metricConfigs[2].metricType, 1440);
  const limitMetrics = useFetchMetrics(metricConfigs[3].metricType, 1440);

  // Process metrics data
  const metricsData = metricConfigs.map((config, index) => {
    const metricData = [
      cpuMetrics,
      memoryMetrics,
      requestMetrics,
      limitMetrics,
    ][index] || { data: [], loading: false, error: null };

    // Process the latest data point (current value)
    let value = 0;
    let lastUpdated = '';

    if (metricData.data?.[0]?.points?.[0]) {
      const point = metricData.data[0].points[0];
      const rawValue = point.value?.doubleValue ?? 0;
      value = config.convertToPercentage ? rawValue * 100 : rawValue;
      lastUpdated = new Date(
        Number(point.interval?.endTime?.seconds) * 1000,
      ).toLocaleString();
    }

    // Calculate real peak and average from historical data
    const peak24h = calculatePeak24h(
      metricData.data,
      config.convertToPercentage,
    );
    const average24h = calculateAverage24h(
      metricData.data,
      config.convertToPercentage,
    );

    return {
      ...config,
      value,
      peak24h,
      average24h,
      lastUpdated,
      loading: metricData.loading,
      error: metricData.error,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-2xl border shadow-md transition-shadow duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-base font-bold text-transparent md:text-2xl">
                <span className="hidden md:inline">
                  GCP Cloud Monitoring System Resource Utilization
                </span>
                <span className="inline md:hidden">
                  System Resource Utilization
                </span>
              </CardTitle>
            </div>
            <div className="text-muted-foreground text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metricsData.map((metric, index) => (
              <EnhancedOriginalMetricCard
                key={metric.name}
                metric={metric}
                index={index}
                value={metric.value}
                peak24h={metric.peak24h}
                average24h={metric.average24h}
                loading={metric.loading}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResourceUsageRadialCharts;
