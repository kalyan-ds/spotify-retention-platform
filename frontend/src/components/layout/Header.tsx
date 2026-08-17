import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Typography } from '@/components/typography/Typography';
import { Avatar, AvatarFallback } from '@/components/avatars/Avatar';
import { cn } from '@/utils/cn';
import { HoverAvatar, headerVariant } from '@/components/motion';
import { SearchSystem, NotificationSystem, ExportEngine } from '@/components/systems';

interface HeaderProps {
  title: string;
  dateStr?: string;
  className?: string;
}

export function Header({ title, dateStr = 'Sat, Jun 27, 2026', className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  return (
    <motion.header
      variants={headerVariant}
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between h-20 px-8 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)] border-b border-border/40'
          : 'bg-background border-b border-border',
        className
      )}
    >

      {/* Left side: Title and Date */}
      <div className="flex items-center space-x-4">
        <Typography variant="pageTitle">{title}</Typography>
        <div className="flex items-center space-x-2 bg-secondary/50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-[#1ed760]" />
          <Typography variant="caption" className="font-medium text-muted-foreground">
            {dateStr}
          </Typography>
        </div>
      </div>

      {/* Right side: Search, Actions, Profile */}
      <div className="flex items-center space-x-6">

        <SearchSystem />
        <ExportEngine />

        <div className="flex items-center space-x-4">
          <NotificationSystem />

          <HoverAvatar className="cursor-pointer">
            <Avatar className="h-9 w-9 bg-[#1ed760] text-black">
              <AvatarFallback className="bg-[#1ed760] text-black font-bold">JD</AvatarFallback>
            </Avatar>
          </HoverAvatar>
        </div>
      </div>

    </motion.header>
  );
}
