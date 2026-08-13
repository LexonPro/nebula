import { useStore } from '../store/useStore';
import { Flame, Settings, Download, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, addMonths, subMonths } from 'date-fns';

export function Header() {
  const { theme, setTheme, selectedDate, setSelectedDate } = useStore();
  const date = parseISO(selectedDate);

  const handlePrevMonth = () => setSelectedDate(format(subMonths(date, 1), 'yyyy-MM-dd'));
  const handleNextMonth = () => setSelectedDate(format(addMonths(date, 1), 'yyyy-MM-dd'));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-[1600px] mx-auto w-full gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-purple">
            <span className="text-white font-bold font-display">N</span>
          </div>
          <span className="text-xl font-bold font-display hidden sm:inline-block">Nebula</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-4 bg-panel-base/50 rounded-full px-4 py-1.5 border border-white/5">
            <button onClick={handlePrevMonth} className="p-1 hover:text-brand-light transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono font-medium text-lg min-w-[140px] text-center">
              {format(date, 'MMMM yyyy')}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:text-brand-light transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Flame className="w-4 h-4" />
            <span className="font-mono font-bold text-sm">12</span>
          </div>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors hidden sm:block">
            <Download className="w-5 h-5" />
          </button>

          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
