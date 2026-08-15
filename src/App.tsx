import { useStore } from './store/useStore';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { SpreadsheetDashboard } from './components/spreadsheet/SpreadsheetDashboard';

function App() {
  const { theme } = useStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'dark') {
       root.classList.add('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen bg-background text-foreground selection:bg-brand selection:text-white flex flex-col font-sans ${theme}`}>
      <Header />
      <SpreadsheetDashboard />
    </div>
  );
}

export default App;
