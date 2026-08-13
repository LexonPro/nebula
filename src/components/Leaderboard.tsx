import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { useStore } from '../store/useStore';
import { getHabitStreak } from '../lib/stats';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export function Leaderboard() {
  const { habits, entries } = useStore();
  
  // Rank habits by completion count or current streak
  const rankedHabits = [...habits].map(habit => {
    const completedCount = entries.filter(e => e.habitId === habit.id && e.completed).length;
    // Simulate a trend
    const trend = Math.random() > 0.6 ? 1 : Math.random() > 0.5 ? -1 : 0;
    return { ...habit, score: completedCount, trend };
  }).sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 border-b border-white/5">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          Top Habits
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {rankedHabits.map((habit, index) => {
            const maxScore = Math.max(...rankedHabits.map(h => h.score));
            const widthPct = maxScore > 0 ? (habit.score / maxScore) * 100 : 0;
            
            return (
              <motion.div 
                key={habit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col gap-2"
              >
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-muted-foreground w-4">{index + 1}.</span>
                    <span className="font-medium truncate max-w-[150px]">{habit.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{habit.score}</span>
                    {habit.trend === 1 && <TrendingUp className="w-3 h-3 text-status-success" />}
                    {habit.trend === -1 && <TrendingDown className="w-3 h-3 text-status-danger" />}
                    {habit.trend === 0 && <Minus className="w-3 h-3 text-muted-foreground" />}
                  </div>
                </div>
                
                {/* Mini progress bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
