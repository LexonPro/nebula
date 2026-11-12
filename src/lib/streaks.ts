import { Habit, HabitEntry } from '../types';
import { format, subDays } from 'date-fns';

export function calculateStreak(habits: Habit[], entries: HabitEntry[]): number {
  if (habits.length === 0) return 0;

  // Pre-index completed entries by "habitId:date" for O(1) lookups
  const completedLookup = new Set<string>();
  entries.forEach(e => {
    if (e.completed) {
      completedLookup.add(`${e.habitId}:${e.date}`);
    }
  });

  const isDayComplete = (dateStr: string): boolean => {
    // Only habits created on or before this date (and not archived) count
    const activeHabits = habits.filter(
      h => (!h.createdAt || h.createdAt <= dateStr) && !h.archived
    );

    if (activeHabits.length === 0) return false;

    // Check if every active habit has a completed entry on this date
    return activeHabits.every(h => completedLookup.has(`${h.id}:${dateStr}`));
  };

  let streak = 0;
  let checkDate = new Date(); // Start with today

  const todayStr = format(checkDate, 'yyyy-MM-dd');
  const todayCompleted = isDayComplete(todayStr);

  if (todayCompleted) {
    streak++;
  }

  // Check backwards starting from yesterday
  checkDate = subDays(checkDate, 1);

  // Maximum lookback guard (e.g. 5 years = 1825 days) to prevent infinite loops
  const maxDays = 1825;
  let daysChecked = 0;

  while (daysChecked < maxDays) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    
    // Check if there were any active habits on this historical date
    const hadActiveHabits = habits.some(
      h => (!h.createdAt || h.createdAt <= dateStr) && !h.archived
    );

    // If we've reached a date before any habits were created, stop counting
    if (!hadActiveHabits) {
      break;
    }

    if (isDayComplete(dateStr)) {
      streak++;
      checkDate = subDays(checkDate, 1);
      daysChecked++;
    } else {
      // Streak is broken
      break;
    }
  }

  return streak;
}

