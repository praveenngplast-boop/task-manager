import React from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Sparkles,
  Download,
  Printer,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function Dashboard() {
  const { 
    tasks, 
    employees, 
    productivityScore, 
    productivityInsight, 
    upcomingDeadlines,
    recentActivities,
    exportToPDF,
    dashboardLayout,
    setDashboardLayout,
    customWidgets,
    setCustomWidgets,
    stats,
    setSelectedTask
  } = useTasks();

  // Dynamic Greeting based on current time
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning ☀️';
    if (hr < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  // Prepare Chart Data
  // 1. Department Task Distributions
  const deptData = Object.values(
    tasks.reduce((acc, task) => {
      const dept = task.department;
      if (!acc[dept]) {
        acc[dept] = { name: dept, completed: 0, active: 0 };
      }
      if (task.status === 'Completed') {
        acc[dept].completed += 1;
      } else {
        acc[dept].active += 1;
      }
      return acc;
    }, {})
  );

  // 2. Productivity Analytics Area Chart (Simulated Timeline)
  const timelineData = [
    { day: 'Mon', completed: 2, efficiency: 65 },
    { day: 'Tue', completed: 4, efficiency: 78 },
    { day: 'Wed', completed: 3, efficiency: 72 },
    { day: 'Thu', completed: 5, efficiency: 88 },
    { day: 'Fri', completed: stats.completed, efficiency: productivityScore }
  ];

  // Pie chart variables
  const statusPieData = [
    { name: 'Todo', value: stats.todo, color: '#94a3b8' },
    { name: 'In Progress', value: stats.inProgress, color: '#6366f1' },
    { name: 'Review', value: stats.review, color: '#f59e0b' },
    { name: 'Completed', value: stats.completed, color: '#10b981' }
  ].filter(d => d.value > 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Render Layouts

  // --- DEFAULT GRID LAYOUT ---
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <motion.div 
        variants={itemVariants} 
        className="glass-card p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/10 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {getGreeting()}, Praveen
            </h1>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
              className="text-xl"
            >
              👋
            </motion.div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xl font-sans leading-relaxed">
            Welcome back to the dashboard control center. You have <span className="text-indigo-500 font-bold">{stats.todo + stats.inProgress} tasks</span> pending assignment parameters today. Let's make it productive!
          </p>
        </div>

        {/* Global Toolbar Options */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToPDF()}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-900 hover:scale-105 transition-all shadow-sm"
            title="Download PDF report (Ctrl+Shift+D)"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-900 hover:scale-105 transition-all shadow-sm"
            title="Print Friendly Dashboard (Ctrl+P)"
          >
            <Printer size={16} />
          </button>

        </div>
      </motion.div>

      {/* KPI Cards Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="glass-card p-5 relative overflow-hidden flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Sprints</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100 block mt-0.5">{stats.todo + stats.inProgress + stats.review}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-5 relative overflow-hidden flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Completed Tasks</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100 block mt-0.5">{stats.completed}</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-5 relative overflow-hidden flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <AlertCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Critical Issues</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100 block mt-0.5">{stats.highPriority}</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-card p-5 bg-indigo-600 text-white relative overflow-hidden flex items-center gap-4 border-none shadow-[0_4px_20px_rgba(99,102,241,0.35)]">
          <div className="p-3 bg-white/20 text-white rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block">Productivity Score</span>
            <span className="text-xl font-black block mt-0.5">{productivityScore}%</span>
          </div>
        </div>
      </motion.div>

      {/* Analytics Graph Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Area Chart */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Weekly Efficiency Profile</span>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-indigo-500" /> Efficiency</span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc' }} />
                <Area type="monotone" dataKey="efficiency" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEff)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Sidebar Widget */}
        <div className="glass-card p-6 bg-gradient-to-b from-white to-slate-50/20 dark:from-slate-900 dark:to-slate-900/30 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500 animate-pulse" /> Workspace Insights
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium">
                {productivityInsight}
              </p>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between text-xs text-slate-400">
              <span>Goal completions:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">82% (Excellent)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Deadlines & Activity Timelines */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deadlines */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-500 animate-pulse" /> Critical Deadlines
          </h3>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10 hover:border-indigo-500/20 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{t.title}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">{t.department}  •  {t.priority} Priority</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] bg-rose-500/10 text-rose-500 font-bold px-2 py-0.5 rounded-full">
                      Due: {t.dueDate}
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center text-slate-400">
              <CheckCircle size={32} className="text-emerald-500 mb-2 stroke-[1.5]" />
              <span className="text-xs">No upcoming due task bottlenecks found!</span>
            </div>
          )}
        </div>

        {/* Activity timelines */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity size={16} className="text-indigo-500" /> Activity Feed
          </h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-slate-700 dark:text-slate-300 font-medium truncate">{act.action}</p>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center text-slate-400">
              <FolderOpen size={32} className="stroke-[1.5] mb-2 text-slate-350" />
              <span className="text-xs">No actions logged in current runtime session.</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
