// ----------------------------------------------------------
// >> CPU & MEMORY UTILIZATION << //
// ----------------------------------------------------------

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFetchMetrics } from '../hooks/hookMetric';
import { useCluster } from '@/contexts/ClusterContext';

type Range = '1d' | '7d' | '14d';

const rangeToMinutes: Record<Range, number> = {
  '1d': 1440,
  '7d': 10080,
  '14d': 43200,
};

const chartConfig: ChartConfig = {
  memory: {
    label: 'Memory Utilization',
    color: 'var(--chart-1)',
  },
  utilization: {
    label: 'CPU Utilization (%)',
    color: 'var(--chart-2)',
  },
};

const CpuMemoryUtilization: React.FC = () => {
  const [range, setRange] = React.useState<Range>('1d');
  const now = React.useMemo(() => new Date(), []);
  const { selectedCluster } = useCluster();

  // Fetch metrics with appropriate filtering
  const { data: memoryData, loading: memoryLoading } = useFetchMetrics(
    'kubernetes.io/container/memory/limit_utilization',
    rangeToMinutes[range],
    selectedCluster, // Kubernetes metrics ARE cluster-specific
  );
  const { data: utilizationData, loading: utilizationLoading } =
    useFetchMetrics(
      'compute.googleapis.com/instance/cpu/utilization',
      rangeToMinutes[range],
      // Instance metrics are NOT cluster-specific
    );

  // Combine and transform data
  const chartData = React.useMemo(() => {
    if (memoryLoading || utilizationLoading) return [];

    const dataMap = new Map<
      string,
      {
        date: string;
        memory: number;
        utilization: number;
        displayTime: string;
      }
    >();

    // Process CPU memory data
    memoryData?.[0]?.points?.forEach((point) => {
      const timestamp = new Date(
        Number(point.interval?.endTime?.seconds) * 1000,
      );
      const dateKey = timestamp.toISOString();
      const value = point.value?.doubleValue ?? 0; // Convert to percentage

      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, {
          date: dateKey,
          memory: 0,
          utilization: 0,
          displayTime: timestamp.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(range === '1d' && { hour: '2-digit', minute: '2-digit' }),
          }),
        });
      }

      const entry = dataMap.get(dateKey);
      if (entry) entry.memory = value;
    });

    // Process CPU Utilization data
    utilizationData?.[0]?.points?.forEach((point) => {
      const timestamp = new Date(
        Number(point.interval?.endTime?.seconds) * 1000,
      );
      const dateKey = timestamp.toISOString();
      const value = (point.value?.doubleValue ?? 0) * 100; // Convert to percentage

      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, {
          date: dateKey,
          memory: 0,
          utilization: 0,
          displayTime: timestamp.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(range === '1d' && { hour: '2-digit', minute: '2-digit' }),
          }),
        });
      }

      const entry = dataMap.get(dateKey);
      if (entry) entry.utilization = value;
    });

    // Sort by date and filter recent data
    return Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter((point) => {
        const pointDate = new Date(point.date);
        return (
          pointDate >= new Date(now.getTime() - rangeToMinutes[range] * 60000)
        );
      });
  }, [
    memoryData,
    utilizationData,
    range,
    now,
    memoryLoading,
    utilizationLoading,
  ]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>CPU and Memory Utilization</CardTitle>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as Range)}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 2 Weeks" />
          </SelectTrigger>

          <SelectContent className="rounded-xl">
            <SelectItem value="14d" className="rounded-lg">
              Last 14 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="1d" className="rounded-lg">
              Last 1 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {memoryLoading || utilizationLoading ? (
          <div className="text-muted-foreground flex h-[250px] items-center justify-center text-sm">
            Loading metrics...
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillUtilization"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="displayTime"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={Math.max(1, Math.floor(chartData.length / 5))}
              />
              {/* Left Y-axis for CPU Utilization */}
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
                tickFormatter={(value) => `${value}%`}
              />

              {/* Right Y-axis (0-1) for CPU memory */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                domain={[0, 50]}
                tickFormatter={(value: number) => value.toFixed(2)}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const point = chartData.find((p) => p.date === value);
                      return point?.displayTime || value;
                    }}
                  />
                }
              />

              <Area
                dataKey="memory"
                type="natural"
                fill="url(#fillMemory)"
                className="area-memory"
                stroke="var(--color-memory)"
                stackId="a"
              />
              <Area
                dataKey="utilization"
                type="natural"
                fill="url(#fillUtilization)"
                stroke="var(--color-utilization)"
                stackId="b"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CpuMemoryUtilization;
