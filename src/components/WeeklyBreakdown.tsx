import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { getDailyProgress } from '../lib/stats';
import { parseISO, subDays, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';

const colors = ['#3B82F6', '#F472B6', '#22D3EE', '#FBBF24', '#A78BFA'];

export function WeeklyBreakdown() {
  const { habits, entries, selectedDate } = useStore();
  const date = parseISO(selectedDate);
  
  // Get last 4 weeks
  const weeks = Array.from({ length: 4 }).map((_, i) => {
    const weekStart = startOfWeek(subDays(date, i * 7), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const weekData = days.map((d, index) => {
      const progress = getDailyProgress(d, habits, entries);
      return {
        day: format(d, 'EEE'),
        value: progress.percentage,
        index
      };
    });

    const weekAvg = Math.round(weekData.reduce((acc, curr) => acc + curr.value, 0) / 7);

    return {
      label: `Week ${4 - i}`,
      data: weekData,
      avg: weekAvg,
      color: colors[i % colors.length]
    };
  }).reverse();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Weekly Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {weeks.map((week, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-sm font-medium mb-4 text-muted-foreground">{week.label}</span>
              
              <div className="w-full h-[80px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={week.data}>
                    <Bar dataKey="value" radius={[2, 2, 0, 0]} animationDuration={1000}>
                      {week.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={week.color} fillOpacity={0.8 + (entry.value / 500)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Fake radial mini-ring via conic-gradient for simplicity and performance */}
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-panel-base"
                   style={{
                     background: `conic-gradient(${week.color} ${week.avg}%, transparent 0)`
                   }}>
                <div className="absolute inset-1 bg-panel-elevated rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold font-mono">{week.avg}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
