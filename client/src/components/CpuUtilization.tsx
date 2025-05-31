// ----------------------------------------------------------
// >> AREA CHART - INTERACTIVE << //
// ----------------------------------------------------------
'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
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

const chartData = [
  { date: '2024-04-01', utilization: 222, mobile: 150 },
  { date: '2024-04-02', utilization: 97, mobile: 180 },
  { date: '2024-04-03', utilization: 167, mobile: 120 },
  { date: '2024-04-04', utilization: 242, mobile: 260 },
  { date: '2024-04-05', utilization: 373, mobile: 290 },
  { date: '2024-04-06', utilization: 301, mobile: 340 },
  { date: '2024-04-07', utilization: 245, mobile: 180 },
  { date: '2024-04-08', utilization: 409, mobile: 320 },
  { date: '2024-04-09', utilization: 59, mobile: 110 },
  { date: '2024-04-10', utilization: 261, mobile: 190 },
  { date: '2024-04-11', utilization: 327, mobile: 350 },
  { date: '2024-04-12', utilization: 292, mobile: 210 },
  { date: '2024-04-13', utilization: 342, mobile: 380 },
  { date: '2024-04-14', utilization: 137, mobile: 220 },
  { date: '2024-04-15', utilization: 120, mobile: 170 },
  { date: '2024-04-16', utilization: 138, mobile: 190 },
  { date: '2024-04-17', utilization: 446, mobile: 360 },
  { date: '2024-04-18', utilization: 364, mobile: 410 },
  { date: '2024-04-19', utilization: 243, mobile: 180 },
  { date: '2024-04-20', utilization: 89, mobile: 150 },
  { date: '2024-04-21', utilization: 137, mobile: 200 },
  { date: '2024-04-22', utilization: 224, mobile: 170 },
  { date: '2024-04-23', utilization: 138, mobile: 230 },
  { date: '2024-04-24', utilization: 387, mobile: 290 },
  { date: '2024-04-25', utilization: 215, mobile: 250 },
  { date: '2024-04-26', utilization: 75, mobile: 130 },
  { date: '2024-04-27', utilization: 383, mobile: 420 },
  { date: '2024-04-28', utilization: 122, mobile: 180 },
  { date: '2024-04-29', utilization: 315, mobile: 240 },
  { date: '2024-04-30', utilization: 454, mobile: 380 },
  { date: '2024-05-01', utilization: 165, mobile: 220 },
  { date: '2024-05-02', utilization: 293, mobile: 310 },
  { date: '2024-05-03', utilization: 247, mobile: 190 },
  { date: '2024-05-04', utilization: 385, mobile: 420 },
  { date: '2024-05-05', utilization: 481, mobile: 390 },
  { date: '2024-05-06', utilization: 498, mobile: 520 },
  { date: '2024-05-07', utilization: 388, mobile: 300 },
  { date: '2024-05-08', utilization: 149, mobile: 210 },
  { date: '2024-05-09', utilization: 227, mobile: 180 },
  { date: '2024-05-10', utilization: 293, mobile: 330 },
  { date: '2024-05-11', utilization: 335, mobile: 270 },
  { date: '2024-05-12', utilization: 197, mobile: 240 },
  { date: '2024-05-13', utilization: 197, mobile: 160 },
  { date: '2024-05-14', utilization: 448, mobile: 490 },
  { date: '2024-05-15', utilization: 473, mobile: 380 },
  { date: '2024-05-16', utilization: 338, mobile: 400 },
  { date: '2024-05-17', utilization: 499, mobile: 420 },
  { date: '2024-05-18', utilization: 315, mobile: 350 },
  { date: '2024-05-19', utilization: 235, mobile: 180 },
  { date: '2024-05-20', utilization: 177, mobile: 230 },
  { date: '2024-05-21', utilization: 82, mobile: 140 },
  { date: '2024-05-22', utilization: 81, mobile: 120 },
  { date: '2024-05-23', utilization: 252, mobile: 290 },
  { date: '2024-05-24', utilization: 294, mobile: 220 },
  { date: '2024-05-25', utilization: 201, mobile: 250 },
  { date: '2024-05-26', utilization: 213, mobile: 170 },
  { date: '2024-05-27', utilization: 420, mobile: 460 },
  { date: '2024-05-28', utilization: 233, mobile: 190 },
  { date: '2024-05-29', utilization: 78, mobile: 130 },
  { date: '2024-05-30', utilization: 340, mobile: 280 },
  { date: '2024-05-31', utilization: 178, mobile: 230 },
  { date: '2024-06-01', utilization: 178, mobile: 200 },
  { date: '2024-06-02', utilization: 470, mobile: 410 },
  { date: '2024-06-03', utilization: 103, mobile: 160 },
  { date: '2024-06-04', utilization: 439, mobile: 380 },
  { date: '2024-06-05', utilization: 88, mobile: 140 },
  { date: '2024-06-06', utilization: 294, mobile: 250 },
  { date: '2024-06-07', utilization: 323, mobile: 370 },
  { date: '2024-06-08', utilization: 385, mobile: 320 },
  { date: '2024-06-09', utilization: 438, mobile: 480 },
  { date: '2024-06-10', utilization: 155, mobile: 200 },
  { date: '2024-06-11', utilization: 92, mobile: 150 },
  { date: '2024-06-12', utilization: 492, mobile: 420 },
  { date: '2024-06-13', utilization: 81, mobile: 130 },
  { date: '2024-06-14', utilization: 426, mobile: 380 },
  { date: '2024-06-15', utilization: 307, mobile: 350 },
  { date: '2024-06-16', utilization: 371, mobile: 310 },
  { date: '2024-06-17', utilization: 475, mobile: 520 },
  { date: '2024-06-18', utilization: 107, mobile: 170 },
  { date: '2024-06-19', utilization: 341, mobile: 290 },
  { date: '2024-06-20', utilization: 408, mobile: 450 },
  { date: '2024-06-21', utilization: 169, mobile: 210 },
  { date: '2024-06-22', utilization: 317, mobile: 270 },
  { date: '2024-06-23', utilization: 480, mobile: 530 },
  { date: '2024-06-24', utilization: 132, mobile: 180 },
  { date: '2024-06-25', utilization: 141, mobile: 190 },
  { date: '2024-06-26', utilization: 434, mobile: 380 },
  { date: '2024-06-27', utilization: 448, mobile: 490 },
  { date: '2024-06-28', utilization: 149, mobile: 200 },
  { date: '2024-06-29', utilization: 103, mobile: 160 },
  { date: '2024-06-30', utilization: 446, mobile: 400 },
];

// * Chart Configuration
const chartConfig = {
  utilization: {
    label: 'CPU',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const CpuUtilization: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('90d');
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date('2024-06-30');
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
  return (
    <Card className="pt-0">
      <h1>Area Chart Example</h1>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>CPU Utilization vs. Memory Utilization</CardTitle>
          <CardDescription>
            {/* Showing total visitors for the last 3 months */}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCPU" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-utilization)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-utilization)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              className="area-mobile"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="utilization"
              type="natural"
              fill="url(#fillCPU)"
              stroke="var(--color-utilization)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CpuUtilization;
