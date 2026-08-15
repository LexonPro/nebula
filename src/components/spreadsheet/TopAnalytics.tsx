import { useStore } from '../../store/useStore';
import { format, getWeekOfMonth, subDays } from 'date-fns';
import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export function TopAnalytics({ daysInMonth }: { daysInMonth: Date[] }) {
  const { habits, entries, theme } = useStore();
  
  const getWeekColor = (date: Date) => {
    const week = getWeekOfMonth(date);
    switch (week % 5) {
      case 1: return '#6366f1'; // Indigo
      case 2: return '#06b6d4'; // Cyan
      case 3: return '#10b981'; // Emerald
      case 4: return '#f59e0b'; // Amber
      case 0: return '#f43f5e'; // Rose
      default: return '#64748b'; // Slate
    }
  };

  // -- Bar Chart Data (Daily Tracking) --
  const dailyData = daysInMonth.map(d => {
    const dateStr = format(d, 'yyyy-MM-dd');
    const completedCount = entries.filter(e => e.date === dateStr && e.completed).length;
    return {
      name: format(d, 'd'),
      completed: completedCount,
      fullDate: format(d, 'MMM d, yyyy'),
      color: getWeekColor(d)
    };
  });

  // -- Donut Chart Data (Weekly Percentages) --
  const weeks: { weekNum: number, days: Date[], color: string }[] = [];
  if (daysInMonth.length > 0) {
    let currentWeekNum = getWeekOfMonth(daysInMonth[0]);
    let currentDays: Date[] = [];

    daysInMonth.forEach(d => {
      const w = getWeekOfMonth(d);
      if (w !== currentWeekNum) {
        weeks.push({ 
           weekNum: currentWeekNum, 
           days: currentDays, 
           color: getWeekColor(subDays(d, 1))
        });
        currentWeekNum = w;
        currentDays = [d];
      } else {
        currentDays.push(d);
      }
    });
    if (currentDays.length > 0) {
      weeks.push({ 
         weekNum: currentWeekNum, 
         days: currentDays, 
         color: getWeekColor(currentDays[currentDays.length - 1])
      });
    }
  }

  const weeklyData = weeks.map((w, i) => {
     const totalPossible = habits.length * w.days.length;
     const completed = entries.filter(e => {
         if (!e.completed) return false;
         return w.days.some(d => format(d, 'yyyy-MM-dd') === e.date);
     }).length;
     const percentage = totalPossible === 0 ? 0 : Math.round((completed / totalPossible) * 100);
     return { ...w, percentage, name: `WEEK ${i + 1}` };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-2 rounded-md shadow-xl text-center">
          <p className="text-[10px] text-muted-foreground mb-0.5 font-medium">{payload[0].payload.fullDate}</p>
          <p className="text-xs font-bold text-foreground">
            {payload[0].value} <span className="text-[10px] text-muted-foreground font-normal">habits</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col w-full h-full p-6 justify-between gap-6 bg-background">
      
      {/* Top Half: Daily Bar Chart */}
      <div className="w-full h-32 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} 
            />
            <Bar 
              dataKey="completed" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={16}
            >
              {dailyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Custom X Axis labels underneath bars to perfectly match the reference */}
        <div className="flex justify-between w-full mt-2 px-[2%]">
          {dailyData.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[9px] font-mono text-muted-foreground font-medium">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Half: Weekly Donuts */}
      <div className="flex justify-around items-center w-full mt-2 divide-x divide-border border-y border-border bg-card/20">
        {weeklyData.map(w => (
           <div key={w.name} className="flex flex-col items-center gap-3 flex-1 py-4">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: w.color }}>
                {w.name}
              </span>
              <div className="relative w-16 h-16">
                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                   {/* Inner and Outer Borders */}
                   <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
                   <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
                   
                   {/* Background Track */}
                   <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/10" />
                   
                   {/* Progress Ring */}
                   <circle cx="50" cy="50" r="40" fill="none" stroke={w.color} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * w.percentage) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-[12px] font-bold font-mono tracking-tighter" style={{ color: w.color }}>
                     {w.percentage}%
                   </span>
                 </div>
              </div>
           </div>
        ))}
      </div>

    </div>
  );
}
