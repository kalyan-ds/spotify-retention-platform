import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { CohortRow } from '@/api/retention';

interface CohortHeatmapGridProps {
  cohortData?: CohortRow[];
  isLoading?: boolean;
}

export const CohortHeatmapGrid: React.FC<CohortHeatmapGridProps> = ({ cohortData, isLoading }) => {
  const sampleCohorts: CohortRow[] = cohortData && cohortData.length > 0 ? cohortData : [
    {
      cohort_date: '2026-01',
      initial_size: 2500,
      cells: [
        { period: 0, active_users: 2500, retention_percentage: 100 },
        { period: 1, active_users: 2125, retention_percentage: 85.0 },
        { period: 2, active_users: 1875, retention_percentage: 75.0 },
        { period: 3, active_users: 1700, retention_percentage: 68.0 },
        { period: 4, active_users: 1625, retention_percentage: 65.0 },
      ]
    },
    {
      cohort_date: '2026-02',
      initial_size: 3100,
      cells: [
        { period: 0, active_users: 3100, retention_percentage: 100 },
        { period: 1, active_users: 2728, retention_percentage: 88.0 },
        { period: 2, active_users: 2418, retention_percentage: 78.0 },
        { period: 3, active_users: 2232, retention_percentage: 72.0 },
      ]
    },
    {
      cohort_date: '2026-03',
      initial_size: 2800,
      cells: [
        { period: 0, active_users: 2800, retention_percentage: 100 },
        { period: 1, active_users: 2492, retention_percentage: 89.0 },
        { period: 2, active_users: 2268, retention_percentage: 81.0 },
      ]
    },
  ];

  const getHeatmapColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-emerald-500 text-zinc-950 font-bold';
    if (percentage >= 75) return 'bg-emerald-600/80 text-white';
    if (percentage >= 65) return 'bg-emerald-700/60 text-emerald-100';
    if (percentage >= 50) return 'bg-emerald-900/50 text-emerald-300';
    return 'bg-zinc-800/40 text-zinc-400';
  };

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span>Month-over-Month Cohort Retention Heatmap</span>
          <span className="text-xs font-normal text-zinc-400">Monthly Decay (%)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-48 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-zinc-300 border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-medium">
                  <th className="py-2.5 px-3">Cohort</th>
                  <th className="py-2.5 px-3">Users</th>
                  <th className="py-2.5 px-3 text-center">Month 0</th>
                  <th className="py-2.5 px-3 text-center">Month 1</th>
                  <th className="py-2.5 px-3 text-center">Month 2</th>
                  <th className="py-2.5 px-3 text-center">Month 3</th>
                  <th className="py-2.5 px-3 text-center">Month 4</th>
                </tr>
              </thead>
              <tbody>
                {sampleCohorts.map((row) => (
                  <tr key={row.cohort_date} className="border-b border-zinc-800/40 hover:bg-zinc-900/30 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-zinc-200">{row.cohort_date}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{row.initial_size.toLocaleString()}</td>
                    {[0, 1, 2, 3, 4].map((period) => {
                      const cell = row.cells.find((c) => c.period === period);
                      if (!cell) {
                        return <td key={period} className="py-2.5 px-3 text-center text-zinc-600">-</td>;
                      }
                      return (
                        <td key={period} className="py-2.5 px-3 text-center">
                          <div className={`py-1.5 px-2.5 rounded-md text-xs transition-all hover:scale-105 ${getHeatmapColor(cell.retention_percentage)}`}>
                            {cell.retention_percentage}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
