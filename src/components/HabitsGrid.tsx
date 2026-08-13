import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { useStore } from '../store/useStore';
import { format, subDays, isSameDay, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, GripVertical } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { AddHabitDialog } from './AddHabitDialog';

// Confetti effect placeholder - could use canvas-confetti in real app
const ConfettiBurst = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full h-full bg-brand rounded-md z-50 mix-blend-screen"
      />
    </div>
  );
};

export function HabitsGrid() {
  const { habits, entries, selectedDate, toggleHabitEntry } = useStore();
  const date = parseISO(selectedDate);
  
  // Show 14 days in the grid for space reasons, ending on selectedDate
  const days = Array.from({ length: 14 }).map((_, i) => subDays(date, 13 - i));
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<boolean | null>(null);

  const handlePointerDown = (habitId: string, dateStr: string, currentState: boolean) => {
    setIsDragging(true);
    setDragAction(!currentState);
    toggleHabitEntry(habitId, dateStr);
  };

  const handlePointerEnter = (habitId: string, dateStr: string, currentState: boolean) => {
    if (isDragging && dragAction !== null && currentState !== dragAction) {
      toggleHabitEntry(habitId, dateStr);
    }
  };

  useEffect(() => {
    const handlePointerUp = () => {
      setIsDragging(false);
      setDragAction(null);
    };
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  return (
    <Card className="flex-1 flex flex-col min-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-white/5">
        <CardTitle>Daily Habits</CardTitle>
        <AddHabitDialog>
          <button className="bg-brand/20 text-brand-light hover:bg-brand/30 transition-colors p-1.5 rounded-md flex items-center gap-1 text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Habit
          </button>
        </AddHabitDialog>
      </CardHeader>
      
      <CardContent className="p-0 overflow-x-auto select-none touch-none">
        <div className="min-w-[800px] p-4">
          {/* Header Row (Dates) */}
          <div className="flex mb-4 pl-[200px]">
            {days.map((d, i) => {
              const isToday = isSameDay(d, new Date());
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground font-medium mb-1">{format(d, 'EE')}</span>
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-mono ${isToday ? 'bg-brand text-white font-bold' : 'text-foreground/80'}`}>
                    {format(d, 'd')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Habits Rows */}
          <div className="flex flex-col gap-3">
            {habits.map((habit) => {
              // Calculate completion for this row to determine glow intensity
              const completedInPeriod = days.filter(d => 
                entries.some(e => e.habitId === habit.id && isSameDay(parseISO(e.date), d) && e.completed)
              ).length;
              const intensity = Math.min(completedInPeriod / 14, 1);
              
              return (
                <div key={habit.id} className="flex items-center group">
                  {/* Habit Info */}
                  <div className="w-[200px] shrink-0 flex items-center gap-3 pr-4">
                    <GripVertical className="w-4 h-4 text-white/10 opacity-0 group-hover:opacity-100 cursor-grab transition-opacity" />
                    <div 
                      className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(var(--color),0.5)]" 
                      style={{ backgroundColor: habit.color, '--color': habit.color } as any}
                    />
                    <span className="font-medium text-sm truncate">{habit.name}</span>
                  </div>
                  
                  {/* Checkboxes */}
                  <div className="flex-1 flex">
                    {days.map((d, i) => {
                      const dateStr = format(d, 'yyyy-MM-dd');
                      const entry = entries.find(e => e.habitId === habit.id && e.date === dateStr);
                      const isCompleted = entry?.completed || false;
                      
                      // Calculate heat intensity color
                      const baseColor = habit.color;
                      const opacity = isCompleted ? Math.max(0.4, intensity) : 0.05;
                      
                      return (
                        <div key={i} className="flex-1 flex justify-center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onPointerDown={(e) => {
                              // Only handle left clicks
                              if (e.button === 0) {
                                handlePointerDown(habit.id, dateStr, isCompleted);
                              }
                            }}
                            onPointerEnter={() => handlePointerEnter(habit.id, dateStr, isCompleted)}
                            className="w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center relative transition-all duration-300"
                            style={{ 
                              backgroundColor: isCompleted ? baseColor : 'rgba(255,255,255,0.03)',
                              boxShadow: isCompleted ? `0 0 15px -2px ${baseColor}60` : 'none',
                              opacity: isCompleted ? opacity : 1,
                              border: isCompleted ? 'none' : '1px solid rgba(255,255,255,0.05)'
                            }}
                          >
                            <AnimatePresence>
                              {isCompleted && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <Check className="w-5 h-5 text-white drop-shadow-md" strokeWidth={3} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                            {/* Fake Confetti for this row if today is completed and streak is long */}
                            {isCompleted && i === days.length - 1 && intensity > 0.8 && (
                              <ConfettiBurst active={true} />
                            )}
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
