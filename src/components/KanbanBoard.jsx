import React from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, MessageSquare, CheckSquare, Layers } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function KanbanBoard() {
  const { tasks, editTask, setSelectedTask, addToast, playSound } = useTasks();

  const columns = [
    { id: 'Todo', title: 'To Do', color: 'bg-slate-500/10 text-slate-700 dark:text-slate-300' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400' },
    { id: 'Review', title: 'In Review', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { id: 'Completed', title: 'Completed', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' }
  ];

  const activeTasks = tasks.filter(t => !t.archived);

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    playSound('click');
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow dropping
  };

  const handleDrop = (e, columnStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== columnStatus) {
      editTask(taskId, { status: columnStatus });
      addToast(
        'Task Relocated', 
        'info', 
        `"${task.title}" shifted to ${columnStatus.toUpperCase()}`
      );
    }
  };

  return (
    <div className="space-y-6 select-none">
      <div>
        <h1 className="text-xl font-bold dark:text-white">Workspace Kanban Boards</h1>
        <p className="text-xs text-slate-400 mt-1">Drag and drop cards across pipeline status divisions to synchronize progress metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const colTasks = activeTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="flex flex-col rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-4 min-h-[500px]"
            >
              {/* Column Title Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{colTasks.length} tasks</span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {colTasks.length > 0 ? (
                  colTasks.map((task) => (
                    <motion.div
                      layout
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDoubleClick={() => setSelectedTask(task)}
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing hover:border-indigo-500/20 transition-all duration-150 relative group"
                    >
                      <div className="space-y-3">
                        {/* Priority row */}
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            task.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' :
                            task.priority === 'High' ? 'bg-orange-500/10 text-orange-500' :
                            'bg-indigo-500/10 text-indigo-500'
                          }`}>
                            {task.priority} Priority
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight break-words">
                          {task.title}
                        </h4>

                        {/* Description */}
                        {task.description && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-3 break-words">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center py-12 text-slate-350 dark:text-slate-650 text-[10px] uppercase font-bold tracking-wider">
                    Empty Queue
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
