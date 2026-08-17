import { useState, useEffect } from 'react';

export type NetworkStatus = 'Online' | 'Offline' | 'Reconnecting';

export function useOnlineStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() =>
    navigator.onLine ? 'Online' : 'Offline'
  );

  useEffect(() => {
    const handleOnline = () => {
      setStatus('Reconnecting');
      const timer = setTimeout(() => {
        setStatus('Online');
      }, 1500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setStatus('Offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}
