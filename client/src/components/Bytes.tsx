// ----------------------------------------------------------
// >> DISK I/O OPERATIONS AND NETWORK TRAFFIC << //
// ----------------------------------------------------------

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

// Add proper type definitions
interface Point {
  interval?: {
    endTime?: {
      seconds?: string | number | null;
    } | null;
    startTime?: {
      seconds?: string | number | null;
    } | null;
  } | null;
  value?: {
    int64Value?: string;
    doubleValue?: number;
  };
}

type Range = '1d' | '7d' | '14d';

const rangeToMinutes: Record<Range, number> = {
  '1d': 1440,
  '7d': 10080,
  '14d': 43200,
};

const chartConfig: ChartConfig = {
  read: {
    label: 'Disk Read Bytes',
    color: 'var(--chart-1)',
  },
  write: {
    label: 'Disk Write Bytes',
    color: 'var(--chart-2)',
  },
  received: {
    label: 'Network Received Bytes Count',
    color: 'var(--chart-3)',
  },
  sent: {
    label: 'Network Sent Bytes Count',
    color: 'var(--chart-4)',
  },
};

const Bytes: React.FC = () => {
  const [range, setRange] = React.useState<Range>('1d');
  const now = React.useMemo(() => new Date(), []);
  const { selectedCluster } = useCluster();

  // Fetch metrics with cluster filtering
  const { data: readData, loading: readLoading } = useFetchMetrics(
    'compute.googleapis.com/instance/disk/read_bytes_count',
    rangeToMinutes[range],
    selectedCluster,
  );
  const { data: writeData, loading: writeLoading } = useFetchMetrics(
    'compute.googleapis.com/instance/disk/write_bytes_count',
    rangeToMinutes[range],
    selectedCluster,
  );
  const { data: receivedData, loading: receivedLoading } = useFetchMetrics(
    'compute.googleapis.com/instance/network/received_bytes_count',
    rangeToMinutes[range],
    selectedCluster,
  );
  const { data: sentData, loading: sentLoading } = useFetchMetrics(
    'compute.googleapis.com/instance/network/sent_bytes_count',
    rangeToMinutes[range],
    selectedCluster,
  );

  // Combine and transform data
  const chartData = React.useMemo(() => {
    if (readLoading || writeLoading || receivedLoading || sentLoading)
      return [];

    const dataMap = new Map<
      string,
      {
        date: string;
        read: number;
        write: number;
        received: number;
        sent: number;
        displayTime: string;
      }
    >();

    // Helper function to calculate Kib/s
    const calculateKibPerSecond = (bytes: number, intervalSeconds: number) => {
      if (intervalSeconds <= 0) return 0;
      return bytes / 1024 / intervalSeconds; // Convert bytes to Kibibytes and then to per second
    };

    // Process disk read data
    (readData?.[0]?.points as Point[])?.forEach((point: Point) => {
      const timestamp = new Date(
        Number(point.interval?.endTime?.seconds) * 1000,
      );
      const dateKey = timestamp.toISOString();
      const bytes = Number(point.value?.int64Value ?? 0);
      const intervalSeconds =
        Number(point.interval?.endTime?.seconds) -
          Number(point.interval?.startTime?.seconds) || 60;
      const value = calculateKibPerSecond(bytes, intervalSeconds);

      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, {
          date: dateKey,
          read: 0,
          write: 0,
          received: 0,
          sent: 0,
          displayTime: timestamp.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(range === '1d' && { hour: '2-digit', minute: '2-digit' }),
          }),
        });
      }

      const entry = dataMap.get(dateKey);
      if (entry) entry.read = value;
    });

    // Process disk write data
    (writeData?.[0]?.points as Point[])?.forEach((point: Point) => {
      const timestamp = new Date(
        Number(point.interval?.endTime?.seconds) * 1000,
      );
      const dateKey = timestamp.toISOString();
      const bytes = Number(point.value?.int64Value ?? 0);
      const intervalSeconds =
        Number(point.interval?.endTime?.seconds) -
          Number(point.interval?.startTime?.seconds) || 60;
      const value = calculateKibPerSecond(bytes, intervalSeconds);

      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, {
          date: dateKey,
          read: 0,
          write: 0,
          received: 0,
          sent: 0,
          displayTime: timestamp.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(range === '1d' && { hour: '2-digit', minute: '2-digit' }),
          }),
        });
      }

      const entry = dataMap.get(dateKey);
      if (entry) entry.write = value;
    });

    // Process network received data
    (receivedData?.[0]?.points as Point[])?.forEach((point: Point) => {
      const timestamp = new Date(
        Number(point.interval?.endTime?.seconds) * 1000,
      );
      const dateKey = timestamp.toISOString();
      const bytes = Number(point.value?.int64Value ?? 0);
      const intervalSeconds =
        Number(point.interval?.endTime?.seconds) -
          Number(point.interval?.startTime?.seconds) || 60;
      const value = calculateKibPerSecond(bytes, intervalSeconds);
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, {
          date: dateKey,
          read: 0,
          write: 0,
          received: 0,
          sent: 0,
          displayTime: timestamp.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(range === '1d' && { hour: '2-digit', minute: '2-digit' }),
          }),
        });
      }

      const entry = dataMap.get(dateKey);
      if (entry) entry.received = value;
    });

    // Process network sent data
    (sentData?.[0]?.points as Point[])?.forEach((point: Point) => {
      const timestamp = new Date(
        Number(point.interval?.endTime?.seconds) * 1000,
      );
      const dateKey = timestamp.toISOString();
      const bytes = Number(point.value?.int64Value ?? 0);
      const intervalSeconds =
        Number(point.interval?.endTime?.seconds) -
          Number(point.interval?.startTime?.seconds) || 60;
      const value = calculateKibPerSecond(bytes, intervalSeconds);

      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, {
          date: dateKey,
          read: 0,
          write: 0,
          received: 0,
          sent: 0,
          displayTime: timestamp.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(range === '1d' && { hour: '2-digit', minute: '2-digit' }),
          }),
        });
      }

      const entry = dataMap.get(dateKey);
      if (entry) entry.sent = value;
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
    readData,
    writeData,
    receivedData,
    sentData,
    range,
    now,
    readLoading,
    writeLoading,
    receivedLoading,
    sentLoading,
  ]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Disk I/O Operations and Network Traffic</CardTitle>
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
        {readLoading || writeLoading || receivedLoading || sentLoading ? (
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
                <linearGradient id="fillRead" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="fillWrite" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="fillReceived" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-3)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-3)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillSent" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-4)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-4)"
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

              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
                tickFormatter={(value) => `${value.toFixed(2)}`}
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
                dataKey="read"
                type="natural"
                fill="url(#fillRead)"
                className="area-read"
                stroke="var(--color-read)"
                stackId="1"
              />
              <Area
                dataKey="write"
                type="natural"
                fill="url(#fillWrite)"
                stroke="var(--color-write)"
                stackId="2"
              />
              <Area
                dataKey="received"
                type="natural"
                fill="url(#fillReceived)"
                stroke="var(--chart-3)"
                stackId="3"
              />
              <Area
                dataKey="sent"
                type="natural"
                fill="url(#fillSent)"
                stroke="var(--chart-4)"
                stackId="4"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default Bytes;
