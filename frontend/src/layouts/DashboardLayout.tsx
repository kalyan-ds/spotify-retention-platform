import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { usePageTitle } from '@/hooks/usePageTitle';
import { LoadingScreen } from '@/components/system/LoadingScreen';
import { MotionLayout, PageChoreography } from '@/components/motion';

export function DashboardLayout() {
  const title = usePageTitle();
  const location = useLocation();

  return (
    <PageChoreography>
      <div className="flex h-screen w-full bg-background overflow-hidden text-foreground font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header title={title} />
          <main className="flex-1 overflow-y-auto no-scrollbar p-8 relative">
            <Suspense fallback={<LoadingScreen />}>
              <MotionLayout key={location.pathname}>
                <Outlet />
              </MotionLayout>
            </Suspense>
          </main>
        </div>
      </div>
    </PageChoreography>
  );
}
