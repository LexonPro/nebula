import { useStore } from '../../store/useStore';
import { format, getDaysInMonth, startOfMonth, addDays, getWeekOfMonth, isSameDay, parseISO } from 'date-fns';
import { RightSidebar } from './RightSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { AddHabitDialog } from '../AddHabitDialog';

export function SpreadsheetDashboard() {
  const { habits, entries, selectedDate, toggleHabitEntry } = useStore();
  const date = parseISO(selectedDate);
  
  // Calculate days for the selected month
  const firstDay = startOfMonth(date);
  const daysCount = getDaysInMonth(date);
  const daysInMonth = Array.from({ length: daysCount }).map((_, i) => addDays(firstDay, i));

  // Premium colors for weeks (using tailwind colors)
  const getWeekColor = (date: Date) => {
    const week = getWeekOfMonth(date);
    switch (week % 5) {
      case 1: return { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20', activeBg: '#6366f1' };
      case 2: return { bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/20', activeBg: '#06b6d4' };
      case 3: return { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', activeBg: '#10b981' };
      case 4: return { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', activeBg: '#f59e0b' };
      case 0: return { bg: 'bg-rose-500/10 dark:bg-rose-500/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20', activeBg: '#f43f5e' };
      default: return { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20', activeBg: '#64748b' };
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden text-sm w-full max-w-[1920px] mx-auto">
      {/* Main Grid Area (Left + Middle combined for sync scrolling) */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <div className="min-w-max flex flex-col pb-20">
          
          {/* Header Area */}
          <div className="flex sticky top-0 z-30 bg-background border-b border-border shadow-sm">
            {/* Sticky Top-Left Corner */}
            <div className="sticky left-0 z-40 w-64 md:w-80 shrink-0 bg-card border-r border-border p-6 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">{format(date, 'MMMM')}</h1>
                <p className="text-muted-foreground font-mono mt-1 text-xs uppercase tracking-widest">Habit Tracker • {format(date, 'yyyy')}</p>
              </div>
              <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                </div>
                <h3 className="font-display font-bold text-lg text-primary relative z-10 leading-tight">trust<br/>the<br/>process</h3>
                <p className="text-[10px] text-muted-foreground mt-2 italic relative z-10 border-t border-border pt-2">Focus, intentional, and ready for the month ahead.</p>
              </div>
            </div>

            {/* Dates Header */}
            <div className="flex flex-col flex-1">
              {/* Weeks Header Row */}
              <div className="flex h-12 border-b border-border bg-card/50">
                 {/* Calculate weeks span */}
                 {(() => {
                    const weeks: { weekNum: number, span: number, color: any }[] = [];
                    let currentWeek = getWeekOfMonth(daysInMonth[0]);
                    let span = 0;
                    daysInMonth.forEach(d => {
                      const w = getWeekOfMonth(d);
                      if (w !== currentWeek) {
                        weeks.push({ weekNum: currentWeek, span, color: getWeekColor(subDays(d, 1)) });
                        currentWeek = w;
                        span = 1;
                      } else {
                        span++;
                      }
                    });
                    weeks.push({ weekNum: currentWeek, span, color: getWeekColor(daysInMonth[daysInMonth.length - 1]) });
                    
                    return weeks.map((w, i) => (
                      <div key={i} className={`flex items-center justify-center text-xs font-mono font-semibold uppercase tracking-wider ${w.color.bg} ${w.color.text} border-r border-border`} style={{ width: `${w.span * 40}px` }}>
                        Week {i + 1}
                      </div>
                    ));
                 })()}
              </div>
              {/* Days Header Row */}
              <div className="flex h-10 bg-card">
                {daysInMonth.map((d, i) => {
                  const color = getWeekColor(d);
                  const isToday = isSameDay(d, new Date());
                  return (
                    <div key={i} className={`w-[40px] shrink-0 border-r border-border flex flex-col items-center justify-center ${color.bg}`}>
                      <span className="text-[9px] font-bold opacity-50">{format(d, 'EE').charAt(0)}</span>
                      <span className={`text-[11px] font-mono font-medium ${isToday ? 'bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center' : ''}`}>{format(d, 'd')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid Body */}
          <div className="flex flex-col">
            {/* Column Headers for List */}
            <div className="flex sticky left-0 z-20 bg-muted/30 border-b border-border h-8">
              <div className="w-64 md:w-80 shrink-0 px-4 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-r border-border">
                <span>Daily Habits</span>
                <AddHabitDialog>
                   <button className="hover:text-primary transition-colors flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
                </AddHabitDialog>
              </div>
              <div className="flex-1"></div>
            </div>

            {/* Habit Rows */}
            {habits.map((habit, rowIndex) => (
              <div key={habit.id} className="flex group hover:bg-muted/10 transition-colors">
                {/* Sticky Habit Name */}
                <div className="sticky left-0 z-20 w-64 md:w-80 shrink-0 bg-card group-hover:bg-muted/20 border-r border-b border-border px-4 py-2.5 flex items-center gap-3 transition-colors">
                  <span className="text-[10px] font-mono text-muted-foreground w-4 text-right">{rowIndex + 1}</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
                  <span className="font-medium text-xs truncate flex-1 text-foreground">{habit.name}</span>
                </div>
                
                {/* Checkboxes */}
                <div className="flex">
                  {daysInMonth.map((d, i) => {
                    const color = getWeekColor(d);
                    const dateStr = format(d, 'yyyy-MM-dd');
                    const entry = entries.find(e => e.habitId === habit.id && e.date === dateStr);
                    const isCompleted = entry?.completed || false;
                    
                    return (
                      <div key={i} className={`w-[40px] h-full shrink-0 border-r border-b border-border flex items-center justify-center p-1.5 transition-colors ${isCompleted ? color.bg : ''}`}>
                        <button
                          onClick={() => toggleHabitEntry(habit.id, dateStr)}
                          className={`w-full h-full rounded-[4px] flex items-center justify-center transition-all ${
                            isCompleted 
                              ? `bg-[${color.activeBg}] text-white shadow-sm ring-1 ring-[${color.activeBg}]/50` 
                              : 'bg-transparent border border-dashed border-border/60 hover:border-primary/50'
                          }`}
                          style={{ backgroundColor: isCompleted ? color.activeBg : undefined }}
                        >
                          <AnimatePresence>
                            {isCompleted && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              >
                                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {habits.length === 0 && (
              <div className="sticky left-0 w-full p-8 text-center text-muted-foreground border-b border-border text-sm">
                No habits added yet. Click "+ Add" to create your first habit.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Analytics */}
      <div className="hidden xl:block w-80 shrink-0 border-l border-border bg-card overflow-y-auto custom-scrollbar">
        <RightSidebar daysInMonth={daysInMonth} />
      </div>
    </div>
  );
}

// Helper to get subDays (since it wasn't imported at top to avoid clutter)
function subDays(date: Date, amount: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - amount);
  return newDate;
}
