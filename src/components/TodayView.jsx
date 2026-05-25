import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  Plus,
  ArrowRight,
  Trash2,
  Sparkles,
  Clock
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function TodayView() {
  const { tasks, addTask, editTask, deleteTask, setSelectedTask } = useTasks();
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const todaysTasks = tasks.filter((t) => !t.archived && t.dueDate === todayString);
  const activeTasks = todaysTasks.filter((t) => t.status !== 'Completed');
  const completedTasks = todaysTasks.filter((t) => t.status === 'Completed');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: todayString,
      status: 'Todo'
    });

    setTitle('');
    setDescription('');
    setPriority('Medium');
  };

  const markComplete = (id) => {
    editTask(id, { status: 'Completed', progress: 100 });
  };

  const postponeTask = (id) => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    editTask(id, { dueDate: tomorrow.toISOString().split('T')[0], status: 'In Progress' });
  };

  const renderTaskItem = (task) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 shadow-sm flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={() => setSelectedTask(task)}
          className="text-left flex-1"
        >
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-indigo-500" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
              {task.title}
            </h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
            {task.description || 'No extra details provided.'}
          </p>
        </button>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            {task.priority}
          </span>
          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {task.status}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Clock size={12} /> Due today
        </span>
        {task.starred && (
          <span className="flex items-center gap-1 text-amber-500">
            <Sparkles size={12} /> Starred
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => markComplete(task.id)}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 px-3 py-2 text-xs font-semibold transition"
        >
          <CheckCircle2 size={14} /> Complete
        </button>
        <button
          type="button"
          onClick={() => postponeTask(task.id)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 text-xs font-semibold transition"
        >
          <ArrowRight size={14} /> Move to tomorrow
        </button>
        <button
          type="button"
          onClick={() => deleteTask(task.id)}
          className="inline-flex items-center gap-2 rounded-2xl bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 px-3 py-2 text-xs font-semibold transition"
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      <section className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              <Sparkles size={14} /> Today’s Plan
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Add tasks for today
            </h1>
            <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Quickly capture today’s priorities and keep your focus page clean without opening the full task board.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 shadow-sm">
            <div className="text-xs uppercase tracking-[0.24em] font-semibold text-slate-400">Today</div>
            <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              {today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Quick add task</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Add a new plan item for today in one step.</p>
            </div>
            <div className="text-xs uppercase tracking-[0.24em] font-semibold text-slate-400">
              {activeTasks.length} active • {completedTasks.length} done
            </div>
          </div>

          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Task title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Type your next priority..."
                className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Optional note for the task..."
                className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="flex items-end justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-indigo-600 text-white px-5 py-3 text-sm font-semibold hover:bg-indigo-500 transition"
                >
                  <Plus size={16} /> Add to today
                </button>
              </div>
            </div>
          </form>
        </section>

        <aside className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Today's summary</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Stay focused by tracking just today.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-200 px-3 py-1 text-xs font-semibold">
                <Sparkles size={14} /> {todaysTasks.length}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4 text-sm text-slate-700 dark:text-slate-200">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">Open tasks</div>
                <div className="text-3xl font-bold">{activeTasks.length}</div>
              </div>
              <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4 text-sm text-slate-700 dark:text-slate-200">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">Completed</div>
                <div className="text-3xl font-bold">{completedTasks.length}</div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-4 text-white shadow-lg">
              <p className="text-sm font-semibold">Need more capacity?</p>
              <p className="text-xs text-indigo-100/90 mt-2 leading-relaxed">
                Add your priority, complete it, and keep today focused. This page is meant to be lightweight and mobile-first.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Tasks due today</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Review what still needs to be completed now.</p>
            </div>
            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{activeTasks.length} pending</span>
          </div>
          <div className="space-y-4">
            {activeTasks.length > 0 ? activeTasks.map(renderTaskItem) : (
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No active tasks due today yet. Use the quick add form to capture your plan.
              </div>
            )}
          </div>
        </section>

        <section className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Completed today</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">See what you’ve already finished.</p>
            </div>
            <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{completedTasks.length} done</span>
          </div>
          <div className="space-y-4">
            {completedTasks.length > 0 ? completedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{task.priority} priority • completed today</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 px-2 py-1 text-[11px] font-semibold">
                    <CheckCircle2 size={12} /> Done
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <button onClick={() => setSelectedTask(task)} className="underline text-slate-600 dark:text-slate-300">View details</button>
                  <button onClick={() => deleteTask(task.id)} className="text-rose-500">Remove</button>
                </div>
              </motion.div>
            )) : (
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No completed tasks have been logged for today yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
