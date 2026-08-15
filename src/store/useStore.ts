import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, ViewMode } from '../types';
import { MOCK_HABITS, MOCK_ENTRIES } from './mockData';
import { format } from 'date-fns';

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      habits: MOCK_HABITS,
      entries: MOCK_ENTRIES,
      theme: 'dark',
      viewMode: 'Monthly',
      selectedDate: format(new Date(), 'yyyy-MM-dd'),
      strictMode: false,
      
      addHabit: (habit) => set((state) => ({
        habits: [...state.habits, { ...habit, id: crypto.randomUUID(), createdAt: format(new Date(), 'yyyy-MM-dd') }]
      })),
      
      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map((h) => h.id === id ? { ...h, ...updates } : h)
      })),
      
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
        entries: state.entries.filter((e) => e.habitId !== id)
      })),
      
      toggleHabitEntry: (habitId, date, mood) => set((state) => {
        const existingEntryIndex = state.entries.findIndex(
          (e) => e.habitId === habitId && e.date === date
        );
        
        if (existingEntryIndex >= 0) {
          // Remove if exists
          const newEntries = [...state.entries];
          newEntries.splice(existingEntryIndex, 1);
          return { entries: newEntries };
        } else {
          // Add new entry
          return {
            entries: [...state.entries, { habitId, date, completed: true, mood }]
          };
        }
      }),
      
      setTheme: (theme) => set({ theme }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      toggleStrictMode: () => set((state) => ({ strictMode: !state.strictMode })),
    }),
    {
      name: 'nebula-habit-tracker-storage',
      version: 1,
    }
  )
);
