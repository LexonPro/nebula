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
      
      {/* Monthly Progress (Big Donut) */}
      <div className="p-6 border-b border-border flex flex-col items-center justify-center py-10 bg-rose-500/5">
        <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-rose-500/80 mb-6 text-center">Monthly Progress</h2>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Completed</span>
            <span className="text-xl font-bold font-mono text-foreground">{completedThisMonth} <span className="text-muted-foreground">/ {totalPossible}</span></span>
          </div>

          <div className="relative w-32 h-32">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
               {/* Inner and Outer Borders */}
               <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
               <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
               
               {/* Background Track */}
               <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted/10" />
               
               {/* Progress Ring */}
               <circle cx="50" cy="50" r="40" fill="none" stroke="#f43f5e" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * overallProgress) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-2xl font-bold font-display text-rose-500 tracking-tighter">
                 {overallProgress.toFixed(1)}%
               </span>
             </div>
          </div>
        </div>
      </div>

      {/* Top 10 Habits */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-muted-foreground mb-4 text-center">Top 10 Habits</h2>
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
    </div>
  );
}
