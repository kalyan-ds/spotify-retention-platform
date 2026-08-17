import { logger } from './logger';

export class PerformanceMonitor {
  public static mark(markName: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark(markName);
    }
  }

  public static measure(measureName: string, startMark: string, endMark: string): number | null {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        window.performance.measure(measureName, startMark, endMark);
        const entries = window.performance.getEntriesByName(measureName);
        const duration = entries[entries.length - 1]?.duration ?? null;
        if (duration !== null) {
          logger.debug(`Performance Measurement [${measureName}]: ${duration.toFixed(2)}ms`);
        }
        return duration;
      } catch (err) {
        logger.warn(`Failed to measure performance mark [${measureName}]`, { err });
      }
    }
    return null;
  }

  public static trackApiLatency(endpoint: string, durationMs: number): void {
    logger.info(`API Response Timing: [${endpoint}] finished in ${durationMs.toFixed(2)}ms`);
  }
}
