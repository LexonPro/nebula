import { useStore } from '../../store/useStore';
import { format, isSameDay, parseISO } from 'date-fns';

export function RightSidebar({ daysInMonth }: { daysInMonth: Date[] }) {
  const { habits, entries } = useStore();
  
  // Calculate total possible entries for this month
  const totalPossible = habits.length * daysInMonth.length;
  
  // Calculate completed entries for this month
  const completedThisMonth = entries.filter(e => {
    const d = parseISO(e.date);
    return e.completed && daysInMonth.some(monthDay => isSameDay(monthDay, d));
  }).length;
  
  const overallProgress = totalPossible === 0 ? 0 : (completedThisMonth / totalPossible) * 100;

  // Calculate stats per habit
  const habitStats = habits.map(habit => {
    const completed = entries.filter(e => {
      if (!e.completed || e.habitId !== habit.id) return false;
      const d = parseISO(e.date);
      return daysInMonth.some(monthDay => isSameDay(monthDay, d));
    }).length;
    const progress = daysInMonth.length === 0 ? 0 : (completed / daysInMonth.length) * 100;
    return { ...habit, completed, progress };
  }).sort((a, b) => b.progress - a.progress);

  const topHabits = habitStats.slice(0, 10);

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border">
        <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center">Daily Progress</h2>
        <div className="flex items-center justify-between bg-muted/20 p-4 rounded-2xl border border-border">
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-primary font-display">{overallProgress.toFixed(2)}%</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Progress</span>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground font-mono">{completedThisMonth} <span className="text-sm text-muted-foreground">/ {totalPossible}</span></span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Habits</span>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-border">
        <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center">Top Habits</h2>
        <div className="bg-muted/10 rounded-xl border border-border overflow-hidden">
          <div className="flex text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/30 px-3 py-2 border-b border-border">
             <div className="w-6">#</div>
             <div className="flex-1">Daily Habit</div>
             <div className="text-right">Progress</div>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {topHabits.length > 0 ? topHabits.map((h, i) => (
              <div key={h.id} className="flex text-xs px-3 py-2.5 items-center hover:bg-muted/20 transition-colors">
                 <div className="w-6 text-[10px] font-mono text-muted-foreground">{i + 1}</div>
                 <div className="flex-1 font-medium truncate pr-2">{h.name}</div>
                 <div className="text-[10px] font-mono font-bold">{h.progress.toFixed(1)}%</div>
              </div>
            )) : (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">No data available</div>
            )}
          </div>
        </div>
        {habits.length > 0 && overallProgress === 100 && (
          <p className="text-[10px] text-center mt-4 italic text-primary/80 font-medium">Over 100% on 0 habits — keep going!</p>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center">Habit Progress</h2>
        <div className="flex flex-col gap-4">
          <div className="flex text-[9px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 px-1">
             <div className="w-12">Goal</div>
             <div className="flex-1 text-center">Percentage</div>
             <div className="w-16 text-right">Count</div>
          </div>
          {habitStats.map(h => (
            <div key={h.id} className="flex items-center text-xs px-1 gap-2">
              <div className="w-12 font-mono text-[10px] text-muted-foreground">{h.progress.toFixed(0)}%</div>
              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${h.progress}%`, backgroundColor: h.color }}
                />
              </div>
              <div className="w-16 text-right font-mono text-[10px]">
                <span className="text-foreground">{h.completed}</span>
                <span className="text-muted-foreground"> / {daysInMonth.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
