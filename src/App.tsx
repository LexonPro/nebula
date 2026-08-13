import { useStore } from './store/useStore';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { DesktopDashboard } from './components/DesktopDashboard';
import { MobileDashboard } from './components/MobileDashboard';
import { useMediaQuery } from './hooks/useMediaQuery';

function App() {
  const { theme } = useStore();
  const isMobile = useMediaQuery('(max-width: 1024px)'); // Tailwind 'lg' breakpoint

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand selection:text-white flex flex-col font-sans">
      <Header />
      {isMobile ? <MobileDashboard /> : <DesktopDashboard />}
    </div>
  );
}

export default App;
