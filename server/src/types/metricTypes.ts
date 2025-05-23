import type { protos } from '@google-cloud/monitoring';

export type TimeSeries = protos.google.monitoring.v3.ITimeSeries;
export type Metric = protos.google.api.IMetric;
export type Resource = protos.google.api.IMonitoredResource;
export type Point = protos.google.monitoring.v3.IPoint;