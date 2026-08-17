import { MetricTrend } from './types';

export class AnalyticsEngine {
  /**
   * Helper to format a large number into abbreviated format (K, M, B)
   */
  static formatNumber(value: number): string {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  }

  /**
   * Helper to format currency
   */
  static formatCurrency(value: number): string {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  }

  static calculateGrowth(current: number, previous: number): MetricTrend {
    if (previous === 0) return { value: '+0.0%', direction: 'neutral' };
    const pct = ((current - previous) / previous) * 100;
    const direction = pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral';
    const sign = pct > 0 ? '+' : '';
    return { value: `${sign}${pct.toFixed(1)}%`, direction };
  }

  static calculateMRR(base: number, growthRate: number): number {
    return base * (1 + growthRate);
  }

  static calculateARR(mrr: number): number {
    return mrr * 12;
  }

  static calculateARPU(revenue: number, activeUsers: number): number {
    return revenue / activeUsers;
  }

  static calculateChurn(lostUsers: number, startUsers: number): number {
    return (lostUsers / startUsers) * 100;
  }
}
