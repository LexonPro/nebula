import { useStore } from '../../store/useStore';
import { format, getDaysInMonth, startOfMonth, addDays, getWeekOfMonth, isSameDay, parseISO, isAfter, startOfDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { AddHabitDialog } from '../AddHabitDialog';
import { RightSidebar } from './RightSidebar';
import { TopAnalytics } from './TopAnalytics';

export function SpreadsheetDashboard() {
  const { habits, entries, selectedDate, toggleHabitEntry, strictMode } = useStore();
  const date = parseISO(selectedDate);

  // Calculate days for the selected month
  const firstDay = startOfMonth(date);
  const daysCount = getDaysInMonth(date);
  const daysInMonth = Array.from({ length: daysCount }).map((_, i) => addDays(firstDay, i));

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

  const getHabitProgress = (habitId: string) => {
    const completed = entries.filter(e => {
      if (!e.completed || e.habitId !== habitId) return false;
      const d = parseISO(e.date);
      return daysInMonth.some(monthDay => isSameDay(monthDay, d));
    }).length;
    const progress = daysInMonth.length === 0 ? 0 : (completed / daysInMonth.length) * 100;
    return progress.toFixed(1);
  };

  return (
    <div className="flex h-[calc(100vh-5.5rem)] bg-background overflow-hidden text-sm w-full max-w-[1920px] mx-auto">
      {/* Main Grid Area (Left + Middle combined for sync scrolling) */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden relative flex flex-col custom-scrollbar">
        <div className="w-full min-w-max flex flex-col h-full">

          {/* FIXED TOP SECTION (Month, Quote, and Grid Headers) */}
          <div className="z-40 flex flex-col bg-background shadow-md">
            {/* Top Area (Month & Quote) */}
            <div className="flex bg-card">
              <div className="w-56 md:w-64 shrink-0 bg-card border-r border-b border-border p-6 flex flex-col justify-between">
                <div>
                  <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">{format(date, 'MMMM')}</h1>
                  <p className="text-muted-foreground font-mono mt-1 text-xs uppercase tracking-widest">Habit Tracker • {format(date, 'yyyy')}</p>
                </div>
                <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                  </div>
                  <h3 className="font-display font-bold text-lg text-primary relative z-10 leading-tight">trust<br />the<br />process</h3>
                  <p className="text-[10px] text-muted-foreground mt-2 italic relative z-10 border-t border-border pt-2">Focus, intentional, and ready for the month ahead.</p>
                </div>
              </div>
              <div className="flex-1 border-b border-border overflow-hidden bg-card/50">
                <TopAnalytics daysInMonth={daysInMonth} />
              </div>
            </div>

            {/* Grid Header Area */}
            <div className="flex bg-background border-b border-border">
              {/* Top-Left Corner for the Grid */}
              <div className="w-56 md:w-64 shrink-0 bg-card border-r border-border flex flex-col">
                <div className="flex-1 flex flex-col justify-end p-4 pb-3">
                  <AddHabitDialog>
                    <button className="w-full text-primary hover:text-primary/90 transition-all flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 py-2 rounded-lg font-bold text-xs shadow-sm border border-primary/20">
                      <Plus className="w-3.5 h-3.5" /> Add New Habit
                    </button>
                  </AddHabitDialog>
                </div>
                <div className="h-10 px-4 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted border-t border-border">
                  <span>Daily Habits</span>
                  <span>Progress</span>
                </div>
              </div>

            {/* Dates Header */}
            <div className="flex flex-col flex-1">
              {/* Weeks Header Row */}
              <div className="flex h-12 bg-card/50">
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
                    <div key={i} className={`flex items-center justify-center text-xs font-mono font-semibold uppercase tracking-wider ${w.color.bg} ${w.color.text} border-r border-b border-border`} style={{ width: `${(w.span / daysInMonth.length) * 100}%` }}>
                      Week {i + 1}
                    </div>
                  ));
                })()}
              </div>
              {/* Days Header Row */}
              <div className="flex h-10 bg-card border-b border-border">
                {daysInMonth.map((d, i) => {
                  const color = getWeekColor(d);
                  const isToday = isSameDay(d, new Date());
                  return (
                    <div key={i} className={`flex-1 min-w-[24px] border-r border-border flex flex-col items-center justify-center ${color.bg}`}>
                      <span className="text-[9px] font-bold opacity-50">{format(d, 'EE').charAt(0)}</span>
                      <span className={`text-[11px] font-mono font-medium ${isToday ? 'bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center' : ''}`}>{format(d, 'd')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            </div>
          </div>

          {/* Grid Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-background">
            <div className="flex flex-col">

            {/* Habit Rows */}
            {habits.map((habit, rowIndex) => (
              <div key={habit.id} className="flex group hover:bg-muted/50 transition-colors">
                {/* Sticky Habit Name & Progress */}
                <div className="sticky left-0 z-20 w-56 md:w-64 shrink-0 bg-card group-hover:bg-muted border-r border-b border-border px-4 py-2.5 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3 flex-1 overflow-hidden pr-2">
                    <span className="text-[10px] font-mono text-muted-foreground w-4 text-right shrink-0">{rowIndex + 1}</span>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: habit.color }} />
                    <span className="font-medium text-xs truncate text-foreground">{habit.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground shrink-0">{getHabitProgress(habit.id)}%</span>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-1">
                  {daysInMonth.map((d, i) => {
                    const color = getWeekColor(d);
                    const dateStr = format(d, 'yyyy-MM-dd');
                    const entry = entries.find(e => e.habitId === habit.id && e.date === dateStr);
                    const isCompleted = entry?.completed || false;
                    const isToday = isSameDay(d, new Date());
                    const isFuture = isAfter(startOfDay(d), startOfDay(new Date()));
                    const isDisabled = isFuture || (strictMode && !isToday);

                    return (
                      <div key={i} className={`flex-1 min-w-[24px] h-full border-r border-b border-border flex items-center justify-center p-1.5 transition-colors ${isCompleted ? color.bg : ''}`}>
                        <button
                          onClick={() => !isDisabled && toggleHabitEntry(habit.id, dateStr)}
                          disabled={isDisabled}
                          className={`w-full h-full rounded-[4px] flex items-center justify-center transition-all ${isCompleted
                              ? `bg-[${color.activeBg}] text-white shadow-sm ring-1 ring-[${color.activeBg}]/50`
                              : 'bg-transparent border border-dashed border-border/60 hover:border-primary/50'
                            } ${isDisabled ? 'opacity-30 cursor-not-allowed hover:border-border/60' : ''}`}
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

            {/* Ghost Rows to fill empty space (only up to 5 total rows to prevent scrolling on small lists) */}
            {Array.from({ length: Math.max(0, 5 - habits.length) }).map((_, i) => (
              <div key={`ghost-${i}`} className="flex opacity-20 pointer-events-none">
                <div className="sticky left-0 z-20 w-56 md:w-64 shrink-0 bg-card border-r border-b border-border px-4 py-2.5 flex items-center gap-3">
                  <span className="text-[10px] font-mono text-muted-foreground w-4 text-right">{habits.length + i + 1}</span>
                  <div className="w-2 h-2 rounded-full border border-border" />
                  <span className="flex-1 border-b border-dashed border-border/50 h-3" />
                </div>
                <div className="flex flex-1">
                  {daysInMonth.map((_, j) => (
                    <div key={j} className="flex-1 min-w-[24px] h-full border-r border-b border-border p-1.5">
                      <div className="w-full h-full rounded-[4px] border border-dashed border-border/30"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Empty State Overlay */}
            {habits.length === 0 && (
              <div className="absolute inset-0 top-[136px] left-56 md:left-64 flex items-center justify-center pointer-events-none z-10">
                <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-8 flex flex-col items-center justify-center max-w-sm text-center shadow-2xl pointer-events-auto">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">Blank Canvas</h3>
                  <p className="text-sm text-muted-foreground mb-6">Your bullet journal is ready. Add your first habit to start tracking your progress.</p>
                  <AddHabitDialog>
                    <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-glow-purple">
                      <Plus className="w-4 h-4" /> Add First Habit
                    </button>
                  </AddHabitDialog>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Analytics */}
      <div className="hidden lg:block w-72 xl:w-80 shrink-0 border-l border-border bg-card overflow-hidden">
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
