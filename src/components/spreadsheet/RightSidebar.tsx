import { useStore } from '../../store/useStore';
import { format, isSameDay, getWeekOfMonth, subDays, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function RightSidebar({ daysInMonth }: { daysInMonth: Date[] }) {
  const { habits, entries, theme } = useStore();
  
  // -- Bar Chart Data (Daily Tracking) --
  const dailyData = daysInMonth.map(d => {
    const dateStr = format(d, 'yyyy-MM-dd');
    const completedCount = entries.filter(e => e.date === dateStr && e.completed).length;
    return {
      name: format(d, 'd'), // Just the day number
      completed: completedCount,
      fullDate: format(d, 'MMM d, yyyy')
    };
  });

  // -- Donut Chart Data (Weekly Percentages) --
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

  // Tooltip component for Bar Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-xl">
          <p className="text-xs text-muted-foreground mb-1 font-medium">{payload[0].payload.fullDate}</p>
          <p className="text-sm font-bold text-foreground">
            {payload[0].value} <span className="text-muted-foreground font-normal">habits completed</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-card">
      
      {/* Daily Bar Chart Section */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center">Daily Tracking</h2>
        <div className="h-48 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 9, fill: 'currentColor', opacity: 0.5 }} 
                axisLine={false} 
                tickLine={false}
                tickMargin={10}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: 9, fill: 'currentColor', opacity: 0.5 }} 
                axisLine={false} 
                tickLine={false}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} 
              />
              <Bar 
                dataKey="completed" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Donut Charts Section */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-muted-foreground mb-6 text-center">Weekly Progress</h2>
        
        <div className="grid grid-cols-2 gap-y-8 gap-x-4">
          {weeklyData.map(w => (
             <div key={w.name} className="flex flex-col items-center gap-3">
                
                {/* SVG Donut Chart */}
                <div className="relative w-20 h-20">
                   <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                     {/* Background Circle */}
                     <circle 
                       cx="50" 
                       cy="50" 
                       r="40" 
                       fill="none" 
                       stroke="currentColor" 
                       strokeWidth="12" 
                       className="text-muted/30" 
                     />
                     {/* Progress Circle */}
                     <circle 
                       cx="50" 
                       cy="50" 
                       r="40" 
                       fill="none" 
                       stroke={w.color} 
                       strokeWidth="12" 
                       strokeDasharray="251.2" 
                       strokeDashoffset={251.2 - (251.2 * w.percentage) / 100} 
                       strokeLinecap="round" 
                       className="transition-all duration-1000 ease-out" 
                     />
                   </svg>
                   {/* Center Text */}
                   <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-[13px] font-bold font-mono tracking-tighter" style={{ color: w.color }}>
                       {w.percentage}%
                     </span>
                   </div>
                </div>
                
                {/* Week Label */}
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground" style={{ color: w.color }}>
                  {w.name}
                </span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
