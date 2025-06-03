'use client';

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

const metricConfigs = [
  {
    name: 'CPU',
    metricType: 'compute.googleapis.com/instance/cpu/utilization',
    fill: 'var(--chart-1)',
    convertToPercentage: true,
  },
  {
    name: 'Memory',
    metricType: 'kubernetes.io/container/memory/limit_utilization',
    fill: 'var(--chart-2)',
    convertToPercentage: false,
  },
  {
    name: 'Request',
    metricType: 'kubernetes.io/container/cpu/request_utilization',
    fill: 'var(--chart-3)',
    convertToPercentage: false,
  },
  {
    name: 'Limit',
    metricType: 'kubernetes.io/container/cpu/limit_utilization',
    fill: 'var(--chart-4)',
    convertToPercentage: true,
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
    label: 'Request Utilization',
    color: 'var(--chart-3)',
  },
  limit: {
    label: 'Limit Utilization',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

const ResourceUsageRadialCharts: React.FC = () => {
  // Fetch metrics using the custom hook for each metric
  const cpuMetrics = useFetchMetrics(metricConfigs[0].metricType, 5);
  const memoryMetrics = useFetchMetrics(metricConfigs[1].metricType, 5);
  const requestMetrics = useFetchMetrics(metricConfigs[2].metricType, 5);
  const limitMetrics = useFetchMetrics(metricConfigs[3].metricType, 5);

  // Process metrics data
  const metricsData = metricConfigs.map((config, index) => {
    const metricData = [
      cpuMetrics,
      memoryMetrics,
      requestMetrics,
      limitMetrics,
    ][index] || { data: [], loading: false, error: null };

    // Process the latest data point
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
    return {
      ...config,
      value,
      lastUpdated,
      loading: metricData.loading,
      error: metricData.error,
    };
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* <CardTitle className="text-sm font-medium">
        System Resource Utilization
      </CardTitle> */}
      {metricsData.map((metric) => {
        const endAngle = 180 - 360 * (metric.value / 100);
        return (
          <Card key={metric.name} className="flex flex-col">
            <CardHeader className="items-center pb-0">
              {/* <CardTitle className="text-sm font-medium">
                {metric.name}
              </CardTitle> */}
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="area-chart mx-auto aspect-square max-h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    data={[metric]}
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
                    <RadialBar dataKey="value" background fill={metric.fill} />
                    <PolarRadiusAxis
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                    >
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
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {metric.value.toFixed(0)}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ResourceUsageRadialCharts;
