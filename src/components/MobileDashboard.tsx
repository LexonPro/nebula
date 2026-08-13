import { useState } from 'react';
import { useStore } from '../store/useStore';
import { format, parseISO, isSameDay } from 'date-fns';
import { Check, ChevronDown, ChevronUp, GripVertical, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Hero } from './Hero';
import { WeeklyBreakdown } from './WeeklyBreakdown';
import { Leaderboard } from './Leaderboard';
import { Heatmap } from './Heatmap';
import { getHabitStreak } from '../lib/stats';
import { AddHabitDialog } from './AddHabitDialog';
import { ViewMode } from '../types';
import { Calendar, LayoutGrid, CalendarDays, Plus } from 'lucide-react';

export function MobileDashboard() {
  const { habits, entries, selectedDate, toggleHabitEntry, viewMode, setViewMode } = useStore();
  const date = parseISO(selectedDate);
  const dateStr = format(date, 'yyyy-MM-dd');
  
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <main className="flex-1 w-full px-4 py-6 flex flex-col gap-6 pb-24 max-w-md mx-auto">
      {/* Today's Checklist Section (Always Visible) */}
      <Card className="border-brand/20 shadow-[0_0_20px_rgba(124,58,237,0.1)]">
        <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Today's Goals</CardTitle>
            <p className="text-sm text-muted-foreground font-mono mt-1">{format(date, 'EEEE, MMM d')}</p>
          </div>
          <AddHabitDialog>
            <button className="bg-brand/20 text-brand-light hover:bg-brand/30 transition-colors p-2 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.2)]">
              <Plus className="w-5 h-5" />
            </button>
          </AddHabitDialog>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3">
            {habits.map(habit => {
              const isCompleted = entries.some(e => e.habitId === habit.id && e.date === dateStr && e.completed);
              const streak = getHabitStreak(habit.id, entries).current;

              return (
                <motion.div 
                  key={habit.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleHabitEntry(habit.id, dateStr)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                    isCompleted 
                      ? 'bg-brand/10 border-brand/30 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted ? 'bg-brand text-white' : 'bg-panel-base text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />}
                    </div>
                    <div>
                      <h4 className={`font-medium ${isCompleted ? 'text-white' : 'text-foreground/90'}`}>
                        {habit.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-mono">
                        {streak > 0 ? `${streak} day streak 🔥` : 'Start a streak'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Expand/Collapse Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 py-3 bg-panel-elevated rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
      >
        {isExpanded ? (
          <>
            Hide Analytics <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            View Full Analytics <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Expanded Data View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-6 overflow-hidden"
          >
            <Hero />
            
            <div className="bg-panel-elevated/50 p-1.5 rounded-full flex items-center gap-1 border border-white/10 self-center">
              {(['Weekly', 'Monthly', 'Yearly'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    viewMode === mode 
                      ? 'bg-gradient-brand text-white shadow-glow-purple' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {mode === 'Weekly' && <Calendar className="w-3 h-3" />}
                  {mode === 'Monthly' && <LayoutGrid className="w-3 h-3" />}
                  {mode === 'Yearly' && <CalendarDays className="w-3 h-3" />}
                  {mode}
                </button>
              ))}
            </div>

            {viewMode !== 'Yearly' && <WeeklyBreakdown />}
            {viewMode === 'Yearly' && <Heatmap />}
            <Leaderboard />
            
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
