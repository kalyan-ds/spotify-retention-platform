
import { Typography } from '@/components/typography/Typography';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion';

export interface HeatmapDataPoint {
  day: string;
  hour: string;
  value: number; // 0 to 100 representing intensity
}

interface ActivityHeatmapProps {
  data: HeatmapDataPoint[];
  className?: string;
  delay?: number;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm', '12am'];

export function ActivityHeatmap({ data, className, delay = 0 }: ActivityHeatmapProps) {

  const getIntensityColor = (value: number) => {
    if (value === 0) return 'bg-secondary/30';
    if (value < 20) return 'bg-[#1ed760]/20';
    if (value < 40) return 'bg-[#1ed760]/40';
    if (value < 60) return 'bg-[#1ed760]/60';
    if (value < 80) return 'bg-[#1ed760]/80';
    return 'bg-[#1ed760]';
  };

  const getValue = (day: string, hour: string) => {
    const pt = data.find(d => d.day === day && d.hour === hour);
    return pt ? pt.value : 0;
  };

  return (
    <FadeIn delay={delay}>
      <div className={cn("flex flex-col w-full overflow-x-auto", className)}>
        <div className="flex w-full mb-2">
          <div className="w-12 shrink-0"></div>
          {DAYS.map(day => (
            <div key={day} className="flex-1 text-center">
              <Typography variant="smallText" className="text-muted-foreground">{day}</Typography>
            </div>
          ))}
        </div>

        {HOURS.map((hour, rIndex) => (
          <div key={hour} className="flex w-full mb-1 items-center">
            <div className="w-12 shrink-0 text-right pr-2">
              <Typography variant="smallText" className="text-muted-foreground text-[10px] uppercase tracking-wider">{hour}</Typography>
            </div>
            {DAYS.map((day, cIndex) => {
              const val = getValue(day, hour);
              return (
                <div key={`${day}-${hour}`} className="flex-1 px-[2px]">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.25, zIndex: 10, transition: { duration: 0.2, ease: "easeOut" } }}
                    transition={{ delay: delay + (rIndex * 0.02) + (cIndex * 0.02), duration: 0.4, ease: "easeOut" }}
                    className={cn("w-full h-8 rounded-sm group relative cursor-pointer transition-colors duration-300", getIntensityColor(val))}
                    style={{ willChange: 'transform' }}
                  >
                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#09090b]/90 backdrop-blur-md border border-border/50 shadow-xl text-white text-xs px-2.5 py-1.5 rounded pointer-events-none whitespace-nowrap z-50 transition-all duration-200 transform scale-95 group-hover:scale-100 group-hover:-translate-y-1">
                      <span className="font-medium text-white">{val.toFixed(0)}</span> <span className="text-muted-foreground">activity on</span> {day} {hour}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
