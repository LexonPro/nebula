import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { useStore } from '../store/useStore';
import { getHabitStreak, getXP, getLevel } from '../lib/stats';
import { Trophy, Zap, Target, TrendingUp, Sparkles, Shield, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export function Sidebar() {
  const { habits, entries } = useStore();
  
  const xp = getXP(entries);
  const level = getLevel(xp);
  const xpForNext = (level * 10) ** 2;
  const progressToNext = (xp / xpForNext) * 100;

  // Generate Smart Insight
  const bestHabit = [...habits].sort((a, b) => {
    const streakA = getHabitStreak(a.id, entries).current;
    const streakB = getHabitStreak(b.id, entries).current;
    return streakB - streakA;
  })[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Gamification Profile */}
      <Card className="relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-32 bg-brand/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-opacity group-hover:bg-brand/20" />
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-panel-elevated to-panel-base border-2 border-brand/50 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                <span className="text-2xl font-bold font-display">Lv.{level}</span>
              </div>
              <motion.div 
                initial={{ rotate: -10 }}
                animate={{ rotate: 10 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
                className="absolute -bottom-2 -right-2 bg-panel-base rounded-full p-1 border border-white/10"
              >
                <Trophy className="w-5 h-5 text-yellow-400" />
              </motion.div>
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">Pathfinder</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3 text-brand-light" /> {xp} XP Total
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>Progress to Lv.{level + 1}</span>
              <span>{Math.round(progressToNext)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-brand rounded-full"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {/* Badge Shelf */}
            <div className="flex-1 bg-white/5 rounded-xl p-3 flex justify-center items-center gap-2 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <Shield className="w-5 h-5 text-brand-light" />
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground">+3</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Insights */}
      <Card className="bg-gradient-to-b from-panel-elevated to-panel-base">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-light" />
            Smart Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground/80">
            You're highly consistent! Your best habit is <strong className="text-white">{bestHabit?.name || '...'}</strong> with a current streak of <strong className="text-brand-light">{getHabitStreak(bestHabit?.id || '', entries).current} days</strong>. 
            Keep it up to unlock the <em>Consistency Champion</em> badge.
          </p>
        </CardContent>
      </Card>

      {/* Stats Table */}
      <Card className="flex-1">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Habit Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 p-0">
          <div className="max-h-[400px] overflow-y-auto px-4 pb-4 space-y-3">
            {habits.map(habit => {
              const streaks = getHabitStreak(habit.id, entries);
              const completedCount = entries.filter(e => e.habitId === habit.id && e.completed).length;
              
              return (
                <div key={habit.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
                    <div>
                      <p className="text-sm font-medium">{habit.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{completedCount} Total</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Current</p>
                      <p className="text-sm font-mono font-medium flex items-center gap-1 justify-end">
                        {streaks.current > 0 ? <Flame className="w-3 h-3 text-orange-500" /> : null}
                        {streaks.current}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Longest</p>
                      <p className="text-sm font-mono font-medium">{streaks.longest}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
