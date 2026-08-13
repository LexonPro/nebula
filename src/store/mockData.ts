import { Habit, HabitEntry } from '../types';
import { format, subDays, subMonths } from 'date-fns';

const today = new Date();

export const MOCK_HABITS: Habit[] = [
  {
    id: 'h1',
    name: 'Read 1 Hour',
    icon: 'book',
    category: 'Learning',
    color: '#7C3AED',
    weeklyGoalDays: 7,
    createdAt: format(subMonths(today, 2), 'yyyy-MM-dd'),
    archived: false,
  },
  {
    id: 'h2',
    name: 'Morning Workout',
    icon: 'dumbbell',
    category: 'Health',
    color: '#22D3EE',
    weeklyGoalDays: 5,
    createdAt: format(subMonths(today, 1), 'yyyy-MM-dd'),
    archived: false,
  },
  {
    id: 'h3',
    name: 'Meditate',
    icon: 'brain',
    category: 'Mindfulness',
    color: '#34D399',
    weeklyGoalDays: 7,
    createdAt: format(subMonths(today, 3), 'yyyy-MM-dd'),
    archived: false,
  },
  {
    id: 'h4',
    name: 'Drink 2L Water',
    icon: 'droplet',
    category: 'Health',
    color: '#3B82F6',
    weeklyGoalDays: 7,
    createdAt: format(subMonths(today, 1), 'yyyy-MM-dd'),
    archived: false,
  },
  {
    id: 'h5',
    name: 'Deep Work Session',
    icon: 'zap',
    category: 'Work',
    color: '#FBBF24',
    weeklyGoalDays: 5,
    createdAt: format(subMonths(today, 4), 'yyyy-MM-dd'),
    archived: false,
  },
  {
    id: 'h6',
    name: 'Journal',
    icon: 'pen-tool',
    category: 'Mindfulness',
    color: '#F472B6',
    weeklyGoalDays: 3,
    createdAt: format(subMonths(today, 1), 'yyyy-MM-dd'),
    archived: false,
  },
  {
    id: 'h7',
    name: 'Learn Spanish',
    icon: 'languages',
    category: 'Learning',
    color: '#A78BFA',
    weeklyGoalDays: 4,
    createdAt: format(subMonths(today, 2), 'yyyy-MM-dd'),
    archived: false,
  },
  {
    id: 'h8',
    name: 'No Sugar',
    icon: 'cookie',
    category: 'Health',
    color: '#F87171',
    weeklyGoalDays: 7,
    createdAt: format(subMonths(today, 1), 'yyyy-MM-dd'),
    archived: false,
  }
];

export const generateMockEntries = (habits: Habit[]): HabitEntry[] => {
  const entries: HabitEntry[] = [];
  
  habits.forEach(habit => {
    // Generate entries for the last 60 days
    for (let i = 0; i < 60; i++) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Believable pattern: more consistent on some habits than others
      let chance = 0.7; // 70% default chance
      if (habit.id === 'h1') chance = 0.9;
      if (habit.id === 'h2' && (date.getDay() === 0 || date.getDay() === 6)) chance = 0.2; // weekend workout drops
      if (habit.id === 'h5' && (date.getDay() === 0 || date.getDay() === 6)) chance = 0.05; // deep work on weekends
      
      if (Math.random() < chance) {
        entries.push({
          habitId: habit.id,
          date: dateStr,
          completed: true,
          mood: Math.floor(Math.random() * 5) + 1 as 1|2|3|4|5
        });
      }
    }
  });
  
  return entries;
};

export const MOCK_ENTRIES = generateMockEntries(MOCK_HABITS);
