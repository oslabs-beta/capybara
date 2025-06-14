
// ------------------------------------------------------------------------------------------------
// >> METRIC CLIENT
// ------------------------------------------------------------------------------------------------import getSecretKeys from '../appSecrets';
import Monitoring from '@google-cloud/monitoring';
import type { TimeSeries, Point, Metric, Resource } from '../types/metricTypes';

type FetchMetricOptions = {
  metricType: string;
  duration?: number;
  clusterName?: string;
  clusterLocation?: string;
};

// Create Monitoring client instance
const client = new Monitoring.MetricServiceClient();

const fetchGCPMetric = async ({
  metricType, // ('container.googleapis.com/container/cpu/utilization')
  duration = 5,
  clusterName,
  clusterLocation,
}: FetchMetricOptions): Promise<TimeSeries[]> => {
  try {
    const projectId = await client.getProjectId();

    const endTimeSeconds = Math.floor(Date.now() / 1000);
    const startTimeSeconds = endTimeSeconds - duration * 60;

    // Build filter with optional cluster filtering
    let filter = `metric.type="${metricType}"`;
    
    // Add cluster filtering if cluster information is provided
    if (clusterName && clusterLocation) {
      filter += ` AND resource.labels.cluster_name="${clusterName}"`;
      filter += ` AND resource.labels.location="${clusterLocation}"`;
    }

    // Write time series data
    const [timeSeries] = await client.listTimeSeries({
      name: client.projectPath(projectId),
      filter, // Filter by metric types and optionally by cluster
      interval: {
        startTime: { seconds: startTimeSeconds },
        endTime: { seconds: endTimeSeconds },
      },
      aggregation: {
        alignmentPeriod: {
          seconds: 60, // Align data points to 1-minute intervals
        },
        perSeriesAligner: 'ALIGN_SUM', // Sum values within each alignment period
        crossSeriesReducer: 'REDUCE_SUM', // Sum across all time series
        groupByFields: [], // Empty array to sum all series together
      },
      view: 'FULL', // Return full data including labels and points
    });

    if (!timeSeries.length) {
      console.log(
        `[Metrics] No data found for ${metricType} in the last ${duration} minutes.`,
      );
      return [];
    }

    // timeSeries.forEach((series: TimeSeries) => {
    //   const metric: Metric = series.metric!;
    //   const resource: Resource = series.resource!;
    //   const points: Point[] = series.points!;

    //   // * CONSOLE LOGS
    //   console.log('Metric:', metric?.labels); // (e.g. container name, namespace)
    //   console.log('Resource:', resource?.labels); // (e.g. instance ID, zone)
    //   points.forEach((point) => {
    //     console.log(JSON.stringify(point.value)); // (e.g. Usage percentages)
    //   });
    // });
    
    return timeSeries;
  } catch (error) {
    console.error(`[Metrics] ❌ Failed to fetch ${metricType}:`, error);
    throw error;
  }
};

export default fetchGCPMetric;