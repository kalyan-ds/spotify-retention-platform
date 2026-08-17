import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Typography } from '@/components/typography/Typography';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

export type NotificationType = 'alert' | 'success' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  time: string;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'alert', title: 'High Churn Risk', message: 'Brazil segment shows 15% increase in churn.', read: false, time: '10m ago' },
  { id: '2', type: 'success', title: 'Target Achieved', message: 'Q3 Revenue target exceeded by 12%.', read: false, time: '1h ago' },
];

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="relative p-2 rounded-full hover:bg-secondary/80 transition-colors outline-none cursor-pointer group"
        >
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background shadow-[0_0_8px_rgba(233,20,41,0.6)] animate-pulse" />
          )}
        </motion.button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-80 bg-[#09090b]/90 backdrop-blur-xl border border-border/50 shadow-2xl rounded-xl p-2 z-50 mr-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-200"
          align="end"
          sideOffset={8}
        >
          <div className="flex justify-between items-center p-2 mb-2 border-b border-border/50">
            <Typography variant="body" className="font-semibold text-foreground">Notifications</Typography>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-muted-foreground hover:text-[#1ed760] transition-colors cursor-pointer">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-1">
            <AnimatePresence>
              {notifications.length === 0 ? (
                <div key="no-notifications" className="p-4 text-center">
                  <Typography variant="smallText" className="text-muted-foreground">No notifications</Typography>
                </div>
              ) : (
                notifications.map(n => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`relative p-3 rounded-lg flex space-x-3 group ${n.read ? 'opacity-60' : 'bg-secondary/30'}`}
                  >
                    <div className="flex-1">
                      <Typography variant="smallText" className="font-semibold text-foreground">{n.title}</Typography>
                      <Typography variant="smallText" className="text-muted-foreground mt-0.5">{n.message}</Typography>
                      <Typography variant="smallText" className="text-muted-foreground/50 text-[10px] mt-1 uppercase tracking-wider">{n.time}</Typography>
                    </div>
                    <button onClick={() => dismiss(n.id)} className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
