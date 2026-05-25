import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarClock, 
  CheckCircle, 
  Star, 
  AlertTriangle,
  ChevronRight,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function TomorrowView() {
  const { tasks, editTask, setSelectedTask } = useTasks();
  
  // Calculate tomorrow's date string in YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];
  
  // Filter for tomorrow's tasks that are active
  const tomorrowsTasks = tasks.filter(t => 
    !t.archived && 
    t.status !== 'Completed' && 
    t.dueDate === tomorrowString
  );

  const importantTasks = tomorrowsTasks.filter(t => t.priority === 'High' || t.priority === 'Critical' || t.starred);
  const otherTasks = tomorrowsTasks.filter(t => t.priority !== 'High' && t.priority !== 'Critical' && !t.starred);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const markAsCompleted = (id) => {
    editTask(id, { status: 'Completed', progress: 100 });
  };

  const postponeTask = (id) => {
    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);
    editTask(id, { dueDate: nextDay.toISOString().split('T')[0] });
  };

  const renderTaskCard = (t) => (
    <motion.div 
      variants={itemVariants} 
      key={t.id}
      className="glass-card p-4 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 group"
    >
      <div className="flex items-start gap-4 flex-1 cursor-pointer" onClick={() => setSelectedTask(t)}>
        <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${
          t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' :
          t.priority === 'High' ? 'bg-orange-500/10 text-orange-500' :
          'bg-indigo-500/10 text-indigo-500'
        }`}>
          {t.priority === 'Critical' || t.priority === 'High' ? <AlertTriangle size={20} /> : <CalendarClock size={20} />}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-500 transition-colors">
            {t.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500 font-medium">
            <span className="text-indigo-500 font-bold">{t.department}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={10} /> Due Tomorrow</span>
            {t.assignee && (
              <>
                <span>•</span>
                <span>{t.assignee.name}</span>
              </>
            )}
            {t.starred && (
              <>
                <span>•</span>
                <span className="text-yellow-500 flex items-center gap-0.5"><Star size={10} className="fill-yellow-500" /> Starred</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex items-center gap-2 pl-12 md:pl-0">
        <button 
          onClick={() => markAsCompleted(t.id)}
          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
        >
          <CheckCircle size={14} /> Done
        </button>
        <button 
          onClick={() => postponeTask(t.id)}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
          title="Push to the day after tomorrow"
        >
          <ArrowRight size={14} /> Postpone
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarClock className="text-indigo-500" /> Tomorrow's Focus
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Prepare for the day ahead. These tasks are scheduled for tomorrow. Get a head start by completing them early or manage your priorities.
        </p>
      </div>

      {tomorrowsTasks.length === 0 ? (
        <motion.div variants={itemVariants} className="py-20 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 glass-card">
          <CheckCircle size={48} className="stroke-[1] mb-4 text-emerald-500/50" />
          <span className="text-sm font-semibold">Your schedule for tomorrow is clear!</span>
          <p className="text-xs mt-1">Enjoy the peace of mind or start planning new tasks.</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Important Tasks Section */}
          {importantTasks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-rose-500 flex items-center gap-2">
                <AlertTriangle size={16} /> Important & Urgent
              </h2>
              <div className="space-y-3">
                {importantTasks.map(renderTaskCard)}
              </div>
            </div>
          )}

          {/* Other Tasks Section */}
          {otherTasks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CalendarClock size={16} /> Other Planned Tasks
              </h2>
              <div className="space-y-3">
                {otherTasks.map(renderTaskCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
