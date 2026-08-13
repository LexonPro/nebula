import { Habit, HabitEntry } from '../types';
import { isSameDay, subDays, startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth, parseISO } from 'date-fns';

export function getHabitStreak(habitId: string, entries: HabitEntry[]) {
  const habitEntries = entries
    .filter(e => e.habitId === habitId && e.completed)
    .map(e => parseISO(e.date))
    .sort((a, b) => b.getTime() - a.getTime());

  if (habitEntries.length === 0) return { current: 0, longest: 0 };

  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  let lastDate = new Date();

  // For a real app, logic would consider "weekly goals", but strict consecutive days is easier for a start
  // We'll just count consecutive days backwards from today or yesterday
  
  // Calculate longest
  let currentRun = 1;
  for (let i = 0; i < habitEntries.length - 1; i++) {
    const diff = Math.abs(habitEntries[i].getTime() - habitEntries[i+1].getTime());
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentRun++;
    } else if (diffDays > 1) {
      if (currentRun > longest) longest = currentRun;
      currentRun = 1;
    }
  }
  if (currentRun > longest) longest = currentRun;

  // Calculate current streak
  let checkDate = new Date();
  while (true) {
    const hasEntry = habitEntries.some(d => isSameDay(d, checkDate));
    if (hasEntry) {
      current++;
      checkDate = subDays(checkDate, 1);
    } else {
      // If we miss today, check if yesterday was the streak
      if (current === 0 && isSameDay(checkDate, new Date())) {
        checkDate = subDays(checkDate, 1);
        continue;
      }
      break;
    }
  }

  return { current, longest: Math.max(longest, current) };
}

export function getXP(entries: HabitEntry[]) {
  return entries.length * 10;
}

export function getLevel(xp: number) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getDailyProgress(date: Date, habits: Habit[], entries: HabitEntry[]) {
  if (habits.length === 0) return { completed: 0, total: 0, percentage: 0 };
  
  const total = habits.length;
  const completed = habits.filter(h => 
    entries.some(e => e.habitId === h.id && isSameDay(parseISO(e.date), date) && e.completed)
  ).length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100)
  };
}
