import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Users,
  DollarSign,
  LineChart,
  Heart,
  Brain,
  Target,
  PieChart,
  FileText,
  Settings
} from 'lucide-react';
import { Typography } from '@/components/typography/Typography';
import { Avatar, AvatarFallback } from '@/components/avatars/Avatar';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/utils/routes';
import { sidebarVariant, iconHoverVariant, TRANSITIONS, HoverAvatar } from '@/components/motion';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid, path: '/' },
  { id: 'users', label: 'Users', icon: Users, path: '/users' },
  { id: 'revenue', label: 'Revenue', icon: DollarSign, path: '/revenue' },
  { id: 'retention', label: 'Retention', icon: LineChart, path: ROUTES.retention },
  { id: 'engagement', label: 'Engagement', icon: Heart, path: ROUTES.engagement },
  { id: 'ai-models', label: 'AI Models', icon: Brain, path: ROUTES.aiModels },
  { id: 'predictions', label: 'Predictions', icon: Target, path: ROUTES.predictions },
  { id: 'segments', label: 'Segments', icon: PieChart, path: '/segments' },
  { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const MotionNavLink = motion.create(NavLink);

export function Sidebar({ className }: { className?: string }) {
  return (
    <motion.aside
      variants={sidebarVariant}
      className={cn('flex flex-col h-screen w-64 border-r border-border bg-background relative z-20', className)}
    >

      {/* Logo Area */}
      <div className="flex items-center h-20 px-6 py-6 mb-2">
        <div className="flex items-center space-x-3">
          <div className="bg-[#1ed760] h-8 w-8 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(30,215,96,0.3)]">
            <div className="w-4 h-4 bg-black rounded-full" />
          </div>
          <div>
            <Typography variant="cardTitle" className="font-bold text-lg leading-tight">Retention IQ</Typography>
            <Typography variant="smallText" className="text-[10px] text-muted-foreground tracking-widest">INTELLIGENCE PLATFORM</Typography>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-1 relative">
        {navItems.map((item) => (
          <MotionNavLink
            key={item.id}
            to={item.path}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className={({ isActive }) =>
              cn(
                'relative flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 group overflow-hidden',
                isActive
                  ? 'text-[#1ed760]'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-[#1ed760]/10 rounded-lg"
                    transition={TRANSITIONS.springElastic}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
                )}

                <div className="relative z-10 flex items-center w-full">
                  <motion.div variants={iconHoverVariant}>
                    <item.icon className={cn(
                      'mr-4 h-5 w-5',
                      isActive ? 'text-[#1ed760]' : 'text-muted-foreground group-hover:text-foreground'
                    )} />
                  </motion.div>
                  <span className="relative">{item.label}</span>
                </div>
              </>
            )}
          </MotionNavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 mt-auto border-t border-border">
        <motion.div
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className="flex items-center px-2 py-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer group"
        >
          <HoverAvatar>
            <Avatar className="h-9 w-9 bg-[#1ed760] text-black">
              <AvatarFallback className="bg-[#1ed760] text-black font-semibold">JD</AvatarFallback>
            </Avatar>
          </HoverAvatar>
          <div className="ml-3">
            <Typography variant="cardTitle" className="text-sm group-hover:text-[#1ed760] transition-colors">Jane Doe</Typography>
            <Typography variant="caption">Head of Analytics</Typography>
          </div>
        </motion.div>
      </div>

    </motion.aside>
  );
}
