import { Outlet } from 'react-router-dom';

export function BlankLayout() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground font-sans flex items-center justify-center p-4">
      <Outlet />
    </main>
  );
}
