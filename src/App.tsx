import { useStore } from './store/useStore';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HabitsGrid } from './components/HabitsGrid';
import { Sidebar } from './components/Sidebar';
import { WeeklyBreakdown } from './components/WeeklyBreakdown';
import { Leaderboard } from './components/Leaderboard';
import { Heatmap } from './components/Heatmap';
import { ViewMode } from './types';
import { Calendar, LayoutGrid, CalendarDays } from 'lucide-react';

function App() {
  const { theme, viewMode, setViewMode } = useStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand selection:text-white flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 md:p-6 lg:p-8 flex flex-col xl:flex-row gap-6 mb-20">
        {/* Left/Main Column */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <Hero />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              {viewMode !== 'Yearly' && <WeeklyBreakdown />}
              {viewMode === 'Yearly' && <Heatmap />}
              <HabitsGrid />
            </div>
            
            <div className="lg:col-span-1">
              <Leaderboard />
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="xl:w-[400px] w-full shrink-0 flex flex-col gap-6">
          <Sidebar />
        </div>
      </main>

      {/* Bottom Tab Switcher */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-panel-base/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-full flex items-center gap-1 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          {(['Weekly', 'Monthly', 'Yearly'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === mode 
                  ? 'bg-gradient-brand text-white shadow-glow-purple' 
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              {mode === 'Weekly' && <Calendar className="w-4 h-4" />}
              {mode === 'Monthly' && <LayoutGrid className="w-4 h-4" />}
              {mode === 'Yearly' && <CalendarDays className="w-4 h-4" />}
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
