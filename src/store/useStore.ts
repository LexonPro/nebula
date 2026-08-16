import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, ViewMode } from '../types';
import { MOCK_HABITS, MOCK_ENTRIES } from './mockData';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      habits: MOCK_HABITS,
      entries: MOCK_ENTRIES,
      theme: 'dark',
      viewMode: 'Monthly',
      selectedDate: format(new Date(), 'yyyy-MM-dd'),
      strictMode: false,
      
      setUser: (user) => set({ user }),
      
      fetchUserData: async () => {
        const { user } = get();
        if (!user) return;
        
        const [habitsRes, entriesRes] = await Promise.all([
          supabase.from('habits').select('*').eq('user_id', user.id),
          supabase.from('entries').select('*').eq('user_id', user.id)
        ]);
        
        if (habitsRes.data && habitsRes.data.length > 0) set({ habits: habitsRes.data });
        if (entriesRes.data && entriesRes.data.length > 0) set({ entries: entriesRes.data });
      },
      
      addHabit: async (habit) => {
        const newHabit = { ...habit, id: crypto.randomUUID(), createdAt: format(new Date(), 'yyyy-MM-dd') };
        set((state) => ({ habits: [...state.habits, newHabit] }));
        
        const { user } = get();
        if (user) {
          await supabase.from('habits').insert({ ...newHabit, user_id: user.id });
        }
      },
      
      updateHabit: async (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) => h.id === id ? { ...h, ...updates } : h)
        }));
        
        const { user } = get();
        if (user) {
          await supabase.from('habits').update(updates).eq('id', id).eq('user_id', user.id);
        }
      },
      
      deleteHabit: async (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          entries: state.entries.filter((e) => e.habitId !== id)
        }));
        
        const { user } = get();
        if (user) {
          await supabase.from('habits').delete().eq('id', id).eq('user_id', user.id);
          await supabase.from('entries').delete().eq('habitId', id).eq('user_id', user.id);
        }
      },
      
      toggleHabitEntry: async (habitId, date, mood) => {
        const { entries, user } = get();
        const existingEntry = entries.find((e) => e.habitId === habitId && e.date === date);
        
        if (existingEntry) {
          set((state) => ({ entries: state.entries.filter(e => !(e.habitId === habitId && e.date === date)) }));
          if (user) {
            await supabase.from('entries').delete().eq('habitId', habitId).eq('date', date).eq('user_id', user.id);
          }
        } else {
          const newEntry = { habitId, date, completed: true, mood };
          set((state) => ({ entries: [...state.entries, newEntry] }));
          if (user) {
            await supabase.from('entries').insert({ ...newEntry, user_id: user.id });
          }
        }
      },
      
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
