import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, ViewMode } from '../types';
import { MOCK_HABITS, MOCK_ENTRIES } from './mockData';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

// Set to track in-flight checkbox toggles to prevent race conditions
const inFlightToggles = new Set<string>();

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
        
        try {
          const [habitsRes, entriesRes] = await Promise.all([
            supabase.from('habits').select('*').eq('user_id', user.id),
            supabase.from('entries').select('*').eq('user_id', user.id)
          ]);
          
          if (habitsRes.error) throw habitsRes.error;
          if (entriesRes.error) throw entriesRes.error;
          
          const remoteHabits = habitsRes.data || [];
          const remoteEntries = entriesRes.data || [];
          
          // If remote user has habits, sync them down
          if (remoteHabits.length > 0) {
            set({ habits: remoteHabits, entries: remoteEntries });
            return;
          }
          
          // If remote is empty, check if user had local habits created in guest mode
          const { habits: localHabits, entries: localEntries } = get();
          
          // Check if local habits are user-created/customized (not strictly unchanged MOCK_HABITS)
          const isDefaultMock = localHabits.length === MOCK_HABITS.length &&
            localHabits.every((h, i) => h.id === MOCK_HABITS[i]?.id && h.name === MOCK_HABITS[i]?.name);
            
          if (!isDefaultMock && localHabits.length > 0) {
            // Migrate local habits to Supabase with valid UUIDs
            const idMap = new Map<string, string>();
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            
            const migratedHabits = localHabits.map((h) => {
              const targetId = uuidRegex.test(h.id) ? h.id : crypto.randomUUID();
              idMap.set(h.id, targetId);
              return {
                id: targetId,
                name: h.name,
                icon: h.icon,
                category: h.category,
                color: h.color,
                weeklyGoalDays: h.weeklyGoalDays,
                createdAt: h.createdAt || format(new Date(), 'yyyy-MM-dd'),
                archived: h.archived || false,
                reminderTime: h.reminderTime || null,
                user_id: user.id,
              };
            });
            
            const migratedEntries = localEntries
              .filter(e => idMap.has(e.habitId))
              .map(e => ({
                habitId: idMap.get(e.habitId)!,
                date: e.date,
                completed: e.completed,
                mood: e.mood || null,
                user_id: user.id,
              }));
              
            await Promise.all([
              supabase.from('habits').insert(migratedHabits),
              migratedEntries.length > 0 ? supabase.from('entries').insert(migratedEntries) : Promise.resolve(),
            ]);
            
            set({ habits: migratedHabits, entries: migratedEntries });
          }
        } catch (err) {
          console.error('Error fetching/migrating user data:', err);
        }
      },
      
      clearUserData: () => set({ user: null }),
      
      addHabit: async (habit) => {
        const newHabit = { ...habit, id: crypto.randomUUID(), createdAt: format(new Date(), 'yyyy-MM-dd') };
        const prevHabits = get().habits;
        set((state) => ({ habits: [...state.habits, newHabit] }));
        
        const { user } = get();
        if (user) {
          try {
            const { error } = await supabase.from('habits').insert({ ...newHabit, user_id: user.id });
            if (error) throw error;
          } catch (err) {
            console.error('Failed to save habit to database, rolling back:', err);
            set({ habits: prevHabits });
          }
        }
      },
      
      updateHabit: async (id, updates) => {
        const prevHabits = get().habits;
        set((state) => ({
          habits: state.habits.map((h) => h.id === id ? { ...h, ...updates } : h)
        }));
        
        const { user } = get();
        if (user) {
          try {
            const { error } = await supabase.from('habits').update(updates).eq('id', id).eq('user_id', user.id);
            if (error) throw error;
          } catch (err) {
            console.error('Failed to update habit in database, rolling back:', err);
            set({ habits: prevHabits });
          }
        }
      },
      
      deleteHabit: async (id) => {
        const prevHabits = get().habits;
        const prevEntries = get().entries;
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          entries: state.entries.filter((e) => e.habitId !== id)
        }));
        
        const { user } = get();
        if (user) {
          try {
            const [entriesDel, habitDel] = await Promise.all([
              supabase.from('entries').delete().eq('habitId', id).eq('user_id', user.id),
              supabase.from('habits').delete().eq('id', id).eq('user_id', user.id)
            ]);
            if (entriesDel.error) throw entriesDel.error;
            if (habitDel.error) throw habitDel.error;
          } catch (err) {
            console.error('Failed to delete habit from database, rolling back:', err);
            set({ habits: prevHabits, entries: prevEntries });
          }
        }
      },
      
      toggleHabitEntry: async (habitId, date, mood) => {
        const toggleKey = `${habitId}:${date}`;
        if (inFlightToggles.has(toggleKey)) return;
        inFlightToggles.add(toggleKey);

        const { entries, user } = get();
        const existingEntry = entries.find((e) => e.habitId === habitId && e.date === date);
        const prevEntries = entries;
        
        if (existingEntry) {
          set((state) => ({ entries: state.entries.filter(e => !(e.habitId === habitId && e.date === date)) }));
        } else {
          const newEntry = { habitId, date, completed: true, mood };
          set((state) => ({ entries: [...state.entries, newEntry] }));
        }

        if (user) {
          try {
            if (existingEntry) {
              const { error } = await supabase.from('entries').delete().eq('habitId', habitId).eq('date', date).eq('user_id', user.id);
              if (error) throw error;
            } else {
              const newEntry = { habitId, date, completed: true, mood };
              const { error } = await supabase.from('entries').insert({ ...newEntry, user_id: user.id });
              if (error) throw error;
            }
          } catch (err) {
            console.error('Failed to sync entry to database, rolling back:', err);
            set({ entries: prevEntries });
          } finally {
            inFlightToggles.delete(toggleKey);
          }
        } else {
          inFlightToggles.delete(toggleKey);
        }
      },
      
      setTheme: (theme) => set({ theme }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      toggleStrictMode: () => set((state) => ({ strictMode: !state.strictMode })),
    }),
    {
      name: 'nebula-habit-tracker-storage',
      version: 2,
      partialize: (state) => ({
        habits: state.habits,
        entries: state.entries,
        theme: state.theme,
        strictMode: state.strictMode,
      }),
    }
  )
);
