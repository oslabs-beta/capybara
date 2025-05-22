
// ------------------------------------------------------------------------------------------------
// >> METRIC CLIENT
// ------------------------------------------------------------------------------------------------import getSecretKeys from '../appSecrets';
import Monitoring from '@google-cloud/monitoring';
import type { protos } from '@google-cloud/monitoring';

type FetchMetricOptions = {
  metricType: string;
  minutesAgo?: number;
};

const client = new Monitoring.MetricServiceClient();

const fetchGCPMetric = async ({
  metricType,
  minutesAgo = 5,
}: FetchMetricOptions): Promise<void> => {
  try {
    const projectId = await client.getProjectId();

    const endTimeSeconds = Math.floor(Date.now() / 1000);
    const startTimeSeconds = endTimeSeconds - minutesAgo * 60;

    const [timeSeries] = await client.listTimeSeries({
      name: client.projectPath(projectId),
      filter: `metric.type="${metricType}"`,
      interval: {
        endTime: { seconds: endTimeSeconds },
        startTime: { seconds: startTimeSeconds },
      },
      view: 'FULL',
    });

    if (!timeSeries.length) {
      console.log(
        `[Metrics] No data found for ${metricType} in the last ${minutesAgo} minutes.`,
      );
      return;
    }

    timeSeries.forEach((series: protos.google.monitoring.v3.ITimeSeries) => {
      console.log('Metric:', series.metric?.labels);
      console.log('Resource:', series.resource?.labels);
      console.log(
        'Points:',
        series.points?.map((p) => p.value),
      );
    });
  } catch (error) {
    console.error(`[Metrics] Failed to fetch ${metricType}:`, error);
  }
};

export default fetchGCPMetric;