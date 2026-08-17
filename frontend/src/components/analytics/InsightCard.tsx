
import { Typography } from '@/components/typography/Typography';
import { cn } from '@/utils/cn';
import { Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeIn, TRANSITIONS, DURATIONS } from '@/components/motion';

export type InsightType = 'recommendation' | 'alert' | 'summary';

export interface InsightCardProps {
  type: InsightType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  delay?: number;
}

const styles = {
  recommendation: {
    icon: Sparkles,
    iconColor: 'text-[#1ed760]',
    bg: 'bg-[#1ed760]/5 border-[#1ed760]/20',
  },
  alert: {
    icon: AlertCircle,
    iconColor: 'text-destructive',
    bg: 'bg-destructive/5 border-destructive/20',
  },
  summary: {
    icon: Sparkles,
    iconColor: 'text-[#3b82f6]',
    bg: 'bg-[#3b82f6]/5 border-[#3b82f6]/20',
  }
};

export function InsightCard({ type, title, description, actionText, onAction, className, delay = 0 }: InsightCardProps) {
  const config = styles[type];
  const Icon = config.icon;

  return (
    <FadeIn delay={delay}>
      <motion.div
        whileHover="hover"
        className={cn(
          "relative overflow-hidden p-5 rounded-xl border flex flex-col space-y-3 group cursor-pointer",
          config.bg,
          className
        )}
        transition={TRANSITIONS.hover}
      >
        <motion.div
          className="absolute inset-y-0 left-0 w-1 bg-current opacity-0"
          variants={{ hover: { opacity: 1, scaleY: [0, 1] } }}
          transition={TRANSITIONS.coreSpring}
          style={{ color: config.bg.split(' ')[0].replace('bg-[', '').replace(']/5', '').replace('bg-destructive/5', '#e91429') }}
        />

        <motion.div
          className="absolute inset-0 bg-white/5 opacity-0"
          variants={{ hover: { opacity: 1 } }}
          transition={{ duration: DURATIONS.medium }}
        />
        <div className="flex items-center space-x-2 relative z-10">
          <motion.div
            variants={{ hover: { scale: 1.1, rotate: [0, -5, 5, 0] } }}
            transition={{ ...TRANSITIONS.coreSpring, repeat: Infinity, repeatDelay: DURATIONS.ambient }}
          >
            <Icon className={cn("w-5 h-5", config.iconColor)} />
          </motion.div>
          <Typography variant="smallText" className="font-semibold tracking-wide uppercase text-foreground">
            {title}
          </Typography>
        </div>
        <Typography variant="body" className="text-sm text-muted-foreground leading-relaxed relative z-10">
          {description}
        </Typography>
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="flex items-center space-x-1 text-sm font-medium text-foreground transition-colors mt-2 w-fit group-hover:text-[#1ed760] relative z-10"
          >
            <span>{actionText}</span>
            <motion.div
              variants={{ hover: { x: 4 } }}
              transition={TRANSITIONS.coreSpring}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </button>
        )}
      </motion.div>
    </FadeIn>
  );
}
