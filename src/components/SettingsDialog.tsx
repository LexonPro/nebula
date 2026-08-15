import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/Dialog';
import { Trash2, AlertTriangle, Moon, Sun, ShieldCheck } from 'lucide-react';

export function SettingsDialog({ children }: { children: React.ReactNode }) {
  const { habits, deleteHabit, theme, setTheme, strictMode, toggleStrictMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'habits' | 'general'>('habits');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="p-6 border-b border-border bg-card/50">
          <DialogTitle className="text-xl font-display font-bold">Settings</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden min-h-[400px]">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-border bg-muted/20 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('habits')}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'habits' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            >
              Manage Habits
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            >
              General
            </button>
          </div>

          {/* Content Area */}
          <div className="w-2/3 p-6 overflow-y-auto custom-scrollbar bg-background">
            {activeTab === 'habits' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Your Habits</h3>
                  <p className="text-xs text-muted-foreground mb-4">Click the trash icon to permanently delete a habit and all its history.</p>
                </div>

                {habits.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No habits added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {habits.map((habit) => (
                      <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card group">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
                          <span className="font-medium text-sm">{habit.name}</span>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${habit.name}"? This cannot be undone.`)) {
                              deleteHabit(habit.id);
                            }
                          }}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete habit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Appearance</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                    <span className="text-sm font-medium">Theme Preference</span>
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm"
                    >
                      {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Anti-Cheat</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                    <div>
                      <span className="text-sm font-medium">Strict Mode</span>
                      <p className="text-xs text-muted-foreground mt-1">When enabled, you can only check off habits for the current day. Past and future days are locked.</p>
                    </div>
                    <button
                      onClick={() => toggleStrictMode()}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${strictMode ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${strictMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                  </h3>
                  <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-destructive">Reset Application</h4>
                      <p className="text-xs text-muted-foreground mt-1">Permanently delete all habits, history, and settings. This action cannot be reversed.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you absolutely sure? This will delete ALL your data forever!")) {
                          localStorage.removeItem('nebula-habit-tracker-storage');
                          window.location.reload();
                        }
                      }}
                      className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-bold hover:bg-destructive/90 transition-colors"
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
