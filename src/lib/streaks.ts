import { Habit, HabitEntry } from '../types';
import { format, subDays, parseISO } from 'date-fns';

export function calculateStreak(habits: Habit[], entries: HabitEntry[]): number {
  if (habits.length === 0) return 0;

  // Create a fast lookup for entries per date
  const entriesByDate: Record<string, number> = {};
  entries.forEach(e => {
    if (e.completed) {
      entriesByDate[e.date] = (entriesByDate[e.date] || 0) + 1;
    }
  });

  const totalHabits = habits.length;
  let streak = 0;
  let currentDate = new Date(); // Start with today

  // Check today first
  const todayStr = format(currentDate, 'yyyy-MM-dd');
  const todayCompleted = entriesByDate[todayStr] || 0;
  
  if (todayCompleted === totalHabits) {
    streak++;
  }

  // Move to yesterday and start loop
  currentDate = subDays(currentDate, 1);

  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const completedCount = entriesByDate[dateStr] || 0;

    if (completedCount === totalHabits) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break; // Streak broken
    }
  }

  return streak;
}
