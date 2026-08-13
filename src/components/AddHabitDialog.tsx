import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from './ui/Dialog';
import { Plus } from 'lucide-react';
import { requestNotificationPermission, scheduleReminder } from '../lib/reminders';

export function AddHabitDialog({ children }: { children: React.ReactNode }) {
  const addHabit = useStore((state) => state.addHabit);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Health');
  const [color, setColor] = useState('#7C3AED');
  const [reminderTime, setReminderTime] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    if (reminderTime) {
      await requestNotificationPermission();
      scheduleReminder(name, reminderTime);
    }
    
    addHabit({
      name,
      category,
      color,
      icon: 'star',
      weeklyGoalDays: 7,
      archived: false,
      reminderTime: reminderTime || undefined,
    });
    
    setName('');
    setReminderTime('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Read 20 pages"
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-transparent"
              >
                <option value="Health">Health</option>
                <option value="Mindfulness">Mindfulness</option>
                <option value="Learning">Learning</option>
                <option value="Work">Work</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="time" className="text-sm font-medium">Daily Reminder (Optional)</label>
              <input
                id="time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Color Label</label>
              <div className="flex gap-2">
                {['#7C3AED', '#3B82F6', '#22D3EE', '#34D399', '#FBBF24', '#F87171', '#F472B6'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      color === c ? 'border-white scale-110' : 'border-transparent hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button type="button" className="px-4 py-2 rounded-md hover:bg-white/10 transition-colors text-sm font-medium">
                Cancel
              </button>
            </DialogClose>
            <button type="submit" className="px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-light transition-colors text-sm font-medium shadow-glow-purple">
              Save Habit
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
