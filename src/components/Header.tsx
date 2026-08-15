import { useStore } from '../store/useStore';
import { Flame, Settings, Download, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, addMonths, subMonths } from 'date-fns';
import { toPng } from 'html-to-image';
import { SettingsDialog } from './SettingsDialog';
import { calculateStreak } from '../lib/streaks';

export function Header() {
  const { theme, setTheme, selectedDate, setSelectedDate, entries, habits } = useStore();
  const currentStreak = calculateStreak(habits, entries);
  const date = parseISO(selectedDate);

  const handlePrevMonth = () => setSelectedDate(format(subMonths(date, 1), 'yyyy-MM-dd'));
  const handleNextMonth = () => setSelectedDate(format(addMonths(date, 1), 'yyyy-MM-dd'));

  const handleExport = async () => {
    try {
      const dataUrl = await toPng(document.body, { quality: 0.95, backgroundColor: theme === 'dark' ? '#0B0A10' : '#ffffff' });
      const link = document.createElement('a');
      link.download = `nebula-dashboard-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-[1600px] mx-auto w-full gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-purple">
            <span className="text-white font-bold font-display">N</span>
          </div>
          <span className="text-xl font-bold font-display hidden sm:inline-block">Nebula</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-4 bg-muted/50 rounded-full px-4 py-1.5 border border-border">
            <button onClick={handlePrevMonth} className="p-1 hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono font-medium text-lg min-w-[140px] text-center">
              {format(date, 'MMMM yyyy')}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:text-primary transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20" title={`${currentStreak} Day Streak!`}>
            <Flame className="w-4 h-4" />
            <span className="font-mono font-bold text-sm">{currentStreak}</span>
          </div>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button onClick={handleExport} className="p-2 rounded-full hover:bg-muted transition-colors hidden sm:block text-foreground" title="Export as PNG">
            <Download className="w-5 h-5" />
          </button>

          <SettingsDialog>
            <button className="p-2 rounded-full hover:bg-muted transition-colors text-foreground">
              <Settings className="w-5 h-5" />
            </button>
          </SettingsDialog>
        </div>
      </div>
    </header>
  );
}
