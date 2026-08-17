import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../cards/Card';
import { ActivityResponse } from '@/api/engagement';

interface UserActivityHeatmapProps {
  activityData?: ActivityResponse;
  isLoading?: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];

export const UserActivityHeatmap: React.FC<UserActivityHeatmapProps> = ({ activityData, isLoading }) => {
  const timeSlots = activityData?.time_slot_breakdown ?? {
    'Morning (06-12)': 14200,
    'Afternoon (12-18)': 28500,
    'Evening (18-24)': 39100,
    'Night (00-06)': 8200
  };

  const getHeatmapColor = (val: number) => {
    if (val >= 200) return 'bg-emerald-500 text-zinc-950 font-bold';
    if (val >= 140) return 'bg-emerald-600/80 text-white';
    if (val >= 80) return 'bg-emerald-700/60 text-emerald-100';
    if (val >= 40) return 'bg-emerald-900/50 text-emerald-300';
    return 'bg-zinc-800/40 text-zinc-400';
  };

  return (
    <Card className="bg-zinc-950/70 border-zinc-800/80 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-zinc-100 flex items-center justify-between">
          <span>Hourly Active User Activity Heatmap</span>
          <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            Peak Window: Evening (18:00 - 24:00)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 bg-zinc-900/40 animate-pulse rounded-lg" />
        ) : (
          <div className="space-y-6">
            {/* Time Slot Summary Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(timeSlots).map(([slot, count]) => (
                <div key={slot} className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
                  <span className="text-xs text-zinc-400 font-medium block">{slot}</span>
                  <span className="text-lg font-bold text-zinc-100 mt-1 block">{count.toLocaleString()} Users</span>
                </div>
              ))}
            </div>

            {/* 2D Heatmap Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="text-zinc-400 font-medium border-b border-zinc-800">
                    <th className="py-2 px-3 text-left">Day</th>
                    {HOURS.map((h) => (
                      <th key={h} className="py-2 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((day, dIdx) => (
                    <tr key={day} className="border-b border-zinc-800/40">
                      <td className="py-2 px-3 text-left font-semibold text-zinc-200">{day}</td>
                      {HOURS.map((_, hIdx) => {
                        const sampleVal = (hIdx * 35 + dIdx * 45) % 240 + 20;
                        return (
                          <td key={hIdx} className="py-2 px-2">
                            <div className={`py-1.5 rounded-md transition-all hover:scale-105 ${getHeatmapColor(sampleVal)}`}>
                              {sampleVal}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
