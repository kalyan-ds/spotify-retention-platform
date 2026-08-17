export type TrendDirection = 'up' | 'down' | 'neutral';

export interface MetricTrend {
  value: string;
  direction: TrendDirection;
  label?: string;
}

export interface BaseKPI {
  id: string;
  title: string;
  value: string | number;
  trend: MetricTrend;
}
