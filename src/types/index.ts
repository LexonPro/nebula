export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  color: string;
  weeklyGoalDays: number; // e.g. 5 of 7
  createdAt: string;
  archived: boolean;
  reminderTime?: string;
}

export interface HabitEntry {
  habitId: string;
  date: string; // ISO yyyy-MM-dd
  completed: boolean;
  mood?: 1 | 2 | 3 | 4 | 5;
}

export type ViewMode = 'Weekly' | 'Monthly' | 'Yearly';

export interface AppState {
  user: any | null; // We can use User from @supabase/supabase-js later, any for now to avoid breaking imports
  habits: Habit[];
  entries: HabitEntry[];
  theme: 'dark' | 'light';
  viewMode: ViewMode;
  selectedDate: string; // ISO yyyy-MM-dd
  strictMode: boolean;
  
  // Actions
  setUser: (user: any | null) => void;
  fetchUserData: () => Promise<void>;
  clearUserData: () => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitEntry: (habitId: string, date: string, mood?: 1|2|3|4|5) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedDate: (date: string) => void;
  toggleStrictMode: () => void;
}
