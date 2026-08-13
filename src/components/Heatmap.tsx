import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { useStore } from '../store/useStore';
import { getDailyProgress } from '../lib/stats';
import { eachDayOfInterval, subYears, format, parseISO, startOfWeek, endOfWeek, getDay } from 'date-fns';
import { motion } from 'framer-motion';

export function Heatmap() {
  const { habits, entries, selectedDate } = useStore();
  const endDate = parseISO(selectedDate);
  const startDate = subYears(endDate, 1);
  
  // Align start to the beginning of that week
  const gridStart = startOfWeek(startDate, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(endDate, { weekStartsOn: 0 });
  
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  
  // Group days into weeks
  const weeks = [];
  let currentWeek: Date[] = [];
  
  days.forEach((day) => {
    currentWeek.push(day);
    if (getDay(day) === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Yearly Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-4">
        <div className="min-w-[800px] flex gap-1">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1">
              {week.map((day, dIndex) => {
                const isFuture = day > new Date();
                let opacity = 0.05; // Base color (white/5)
                let color = 'rgba(255, 255, 255, 0.05)';
                let glow = 'none';
                
                if (!isFuture) {
                  const p = getDailyProgress(day, habits, entries);
                  if (p.completed > 0) {
                    opacity = Math.max(0.3, p.percentage / 100);
                    color = `rgba(124, 58, 237, ${opacity})`; // brand color
                    glow = `0 0 8px rgba(124, 58, 237, ${opacity * 0.5})`;
                  }
                }
                
                return (
                  <div
                    key={dIndex}
                    className="w-3 h-3 rounded-sm transition-all hover:scale-125 hover:z-10 cursor-default"
                    style={{ 
                      backgroundColor: color,
                      boxShadow: glow
                    }}
                    title={`${format(day, 'MMM dd, yyyy')}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
