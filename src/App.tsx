import { useStore } from './store/useStore';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { SpreadsheetDashboard } from './components/spreadsheet/SpreadsheetDashboard';
import { supabase } from './lib/supabase';

function App() {
  const { theme, setUser, fetchUserData } = useStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'dark') {
       root.classList.add('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Check active session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, fetchUserData]);

  return (
    <div className={`min-h-screen bg-background text-foreground selection:bg-brand selection:text-white flex flex-col font-sans overflow-hidden ${theme}`}>
      <Header />
      <SpreadsheetDashboard />
      <footer className="h-6 border-t border-border bg-card flex items-center justify-center text-[10px] text-muted-foreground font-mono tracking-widest shrink-0 z-50">
         NEBULA HABIT TRACKER © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
