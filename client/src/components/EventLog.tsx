import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from './ui/chart';

import { useFetchMetrics } from '../hooks/hookMetric';

// Add proper type definitions
interface Point {
  interval?: {
    endTime?: { seconds?: string };
    startTime?: { seconds?: string };
  };
  value?: {
    int64Value?: string;
    doubleValue?: number;
  };
}

const chartConfig: ChartConfig = {
  bytes: {
    label: ' Log Bytes',
    color: 'var(--chart-1)',
  },
  entries: {
    label: 'Log Entries',
    color: 'var(--chart-2)',
  },
};

const EventLog: React.FC = () => {
  // Fetch both metrics
  const { data: bytesData, loading: bytesLoading } = useFetchMetrics(
    'logging.googleapis.com/byte_count',
    43200,
  );
  const { data: entriesData, loading: entriesLoading } = useFetchMetrics(
    'logging.googleapis.com/log_entry_count',
    43200,
  );

  const getMetricValue = (point: Point): number => {
    if (point.value?.int64Value !== undefined) {
      return Number(point.value.int64Value);
    }
    return 0;
  };

  // Combine and transform data
  const chartData = React.useMemo(() => {
    if (bytesLoading || entriesLoading) return [];

    const dataMap = new Map<
      string,
      {
        date: string;
        bytes: number;
        entries: number;
        displayTime: string;
      }
    >();

    // Process bytes data
    (bytesData?.[0]?.points as Point[])
      ?.filter(Boolean)
      .forEach((point: Point) => {
        const timestamp = new Date(
          Number(point.interval?.endTime?.seconds) * 1000,
        );
        const dateKey = timestamp.toISOString();
        const value = getMetricValue(point);

        if (!dataMap.has(dateKey)) {
          dataMap.set(dateKey, {
            date: dateKey,
            bytes: value,
            entries: 0,
            displayTime: timestamp.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        } else {
          const entry = dataMap.get(dateKey);
          if (entry) entry.bytes = value;
        }
      });

    // Process entries data
    (entriesData?.[0]?.points as Point[])
      ?.filter(Boolean)
      .forEach((point: Point) => {
        const timestamp = new Date(
          Number(point.interval?.endTime?.seconds) * 1000,
        );
        const dateKey = timestamp.toISOString();
        const value = getMetricValue(point);

        if (!dataMap.has(dateKey)) {
          dataMap.set(dateKey, {
            date: dateKey,
            bytes: 0,
            entries: value,
            displayTime: timestamp.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
          });
        } else {
          const entry = dataMap.get(dateKey);
          if (entry) entry.entries = value;
        }
      });

    // Sort by date and return array
    return Array.from(dataMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [bytesData, entriesData, bytesLoading, entriesLoading]);

  return (
    <div>
      <h1>Bar Chart Example</h1>
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] w-1/5 border"
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="displayTime"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="bytes" fill="var(--color-bytes)" radius={4} />
          <Bar dataKey="entries" fill="var(--color-entries)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default EventLog;
