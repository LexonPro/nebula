import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { AreaChart, Area, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { getDailyProgress } from '../lib/stats';
import { parseISO, format, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

const quotes = [
  "We are what we repeatedly do.",
  "Small disciplines repeated with consistency every day lead to great achievements.",
  "The secret of your future is hidden in your daily routine.",
  "Motivation is what gets you started. Habit is what keeps you going."
];

export function Hero() {
  const { habits, entries, selectedDate } = useStore();
  const date = parseISO(selectedDate);
  const progress = getDailyProgress(date, habits, entries);

  // Generate 30 days of data for the area chart
  const areaData = Array.from({ length: 30 }).map((_, i) => {
    const d = subDays(date, 29 - i);
    const p = getDailyProgress(d, habits, entries);
    return { name: format(d, 'MMM dd'), value: p.percentage };
  });

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const radialData = [
    { name: 'Progress', value: progress.percentage, fill: '#7C3AED' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 overflow-hidden relative">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Monthly Consistency</CardTitle>
        </CardHeader>
        <CardContent className="h-[140px] p-0 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#A78BFA" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 relative overflow-hidden flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-panel-elevated to-panel-base border-t-brand/50">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-light via-transparent to-transparent pointer-events-none" />
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <p className="font-display font-medium text-lg leading-relaxed italic text-white/90">
              "{quotes[quoteIndex]}"
            </p>
          </motion.div>
        </AnimatePresence>
      </Card>

      <Card className="md:col-span-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-4 left-4">
          <h3 className="text-lg font-semibold font-display">Today</h3>
          <p className="text-sm text-muted-foreground font-mono">{format(date, 'MMM dd')}</p>
        </div>
        
        <div className="w-[140px] h-[140px] relative mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" cy="50%" 
              innerRadius="75%" outerRadius="100%" 
              barSize={10} 
              data={radialData} 
              startAngle={90} endAngle={-270}
            >
              <RadialBar
                background={{ fill: 'rgba(255,255,255,0.05)' }}
                dataKey="value"
                cornerRadius={10}
                animationDuration={2000}
                animationEasing="ease-out"
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-display font-bold text-white">{progress.percentage}%</span>
            <span className="text-xs text-muted-foreground font-mono">{progress.completed}/{progress.total}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
