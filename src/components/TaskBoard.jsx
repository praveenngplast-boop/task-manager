import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  List, 
  Grid, 
  Table, 
  Search, 
  SlidersHorizontal, 
  Star, 
  Calendar, 
  Trash2, 
  CheckCircle, 
  Archive,
  ChevronDown,
  User,
  ExternalLink,
  Sparkles,
  ArrowUpDown,
  Layers,
  Flag
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function TaskBoard() {
  const {
    tasks,
    employees,
    departments,
    setSelectedTask,
    setIsNewTaskModalOpen,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    showAdvancedFilters,
    setShowAdvancedFilters,
    sorting,
    setSorting,
    toggleTaskStar,
    selectedTaskIds,
    setSelectedTaskIds,
    bulkDelete,
    bulkChangeStatus,
    bulkChangePriority,
    archiveCompletedTasks
  } = useTasks();

  const [viewMode, setViewMode] = useState('list'); // list, card, table

  // Filter & Sort Logic
  const filteredTasks = tasks.filter(t => {
    if (t.archived) return false;

    // Search query matches title, description, or tags
    const searchMatch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Advanced filters
    const deptMatch = filters.department === 'All' || t.department === filters.department;
    const priorityMatch = filters.priority === 'All' || t.priority === filters.priority;
    const statusMatch = filters.status === 'All' || t.status === filters.status;
    const starMatch = filters.starred === 'All' || (filters.starred === 'Starred' ? t.starred : !t.starred);

    return searchMatch && deptMatch && priorityMatch && statusMatch && starMatch;
  }).sort((a, b) => {
    if (sorting === 'dueDateAsc') return new Date(a.dueDate) - new Date(b.dueDate);
    if (sorting === 'dueDateDesc') return new Date(b.dueDate) - new Date(a.dueDate);
    if (sorting === 'priorityDesc') {
      const priorityMap = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    }
    if (sorting === 'progressDesc') return b.progress - a.progress;
    if (sorting === 'starred') return (b.starred ? 1 : 0) - (a.starred ? 1 : 0);
    return 0;
  });

  // Handle Multi-Select toggling
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTaskIds(filteredTasks.map(t => t.id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  const handleSelectOne = (taskId) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
  };

  return (
    <div className="space-y-6">
      {/* Search and view toggle row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            id="search-bar-input"
            type="text"
            placeholder="Search tasks, descriptions, or tags... (Ctrl+F)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${showAdvancedFilters ? 'bg-indigo-600 text-white border-transparent' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'}`}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-500' : 'text-slate-400 hover:text-slate-600'}`}><List size={16} /></button>
            <button onClick={() => setViewMode('card')} className={`p-2.5 ${viewMode === 'card' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-500' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={16} /></button>
            <button onClick={() => setViewMode('table')} className={`p-2.5 ${viewMode === 'table' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-500' : 'text-slate-400 hover:text-slate-600'}`}><Table size={16} /></button>
          </div>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            + Task
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/35 border border-slate-100 dark:border-slate-800/80 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none text-slate-700 dark:text-slate-350"
                >
                  <option value="All">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none text-slate-700 dark:text-slate-350"
                >
                  <option value="All">All Priorities</option>
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🟠 High</option>
                  <option value="Critical">🔴 Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sprint Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none text-slate-700 dark:text-slate-350"
                >
                  <option value="All">All Queues</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sort Parameter</label>
                <select
                  value={sorting}
                  onChange={(e) => setSorting(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none text-slate-700 dark:text-slate-350"
                >
                  <option value="dueDateAsc">📆 Due Date: Ascending</option>
                  <option value="dueDateDesc">📆 Due Date: Descending</option>
                  <option value="priorityDesc">🔥 Priority: Critical First</option>
                  <option value="progressDesc">📊 Progress: Highest First</option>
                  <option value="starred">⭐️ Starred First</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Panel */}
      {selectedTaskIds.length > 0 && (
        <div className="p-3.5 bg-indigo-650 text-white rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <span className="text-xs font-bold">{selectedTaskIds.length} tasks selected for batch action</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => bulkChangeStatus('Completed')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <CheckCircle size={12} /> Mark Completed
            </button>
            <select
              onChange={(e) => bulkChangePriority(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-xs font-semibold px-2 py-1.5 rounded-lg outline-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled className="text-slate-800">Set Priority...</option>
              <option value="Low" className="text-slate-800">Low</option>
              <option value="Medium" className="text-slate-800">Medium</option>
              <option value="High" className="text-slate-800">High</option>
              <option value="Critical" className="text-slate-800">Critical</option>
            </select>
            <button
              onClick={bulkDelete}
              className="px-3 py-1.5 bg-rose-500/25 hover:bg-rose-500/40 text-rose-200 border border-rose-500/30 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Trash2 size={12} /> Delete Selected
            </button>
            <button onClick={() => setSelectedTaskIds([])} className="text-xs text-indigo-200 hover:text-white px-2 py-1">Cancel</button>
          </div>
        </div>
      )}

      {/* Primary List View */}
      {filteredTasks.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {/* Header Row for Multi Select checkbox if in list mode */}
          {viewMode === 'list' && (
            <div className="flex items-center px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0}
                className="rounded border-slate-350 mr-4 cursor-pointer"
              />
              <div className="grid grid-cols-12 w-full gap-4">
                <div className="col-span-11 md:col-span-5 text-left">Task Details</div>
                <div className="hidden md:block col-span-2 text-center">Assignee</div>
                <div className="hidden md:block col-span-2 text-center">Timeline</div>
                <div className="hidden md:block col-span-2 text-center">Progress</div>
                <div className="hidden md:block col-span-1 text-center">Star</div>
              </div>
            </div>
          )}

          {/* Render List items */}
          {viewMode === 'list' && filteredTasks.map((t) => (
            <motion.div
              variants={itemVariants}
              key={t.id}
              onDoubleClick={() => setSelectedTask(t)}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 hover:scale-[1.005] hover:border-indigo-500/30 shadow-sm transition-all duration-200 cursor-pointer flex items-center"
            >
              <input
                type="checkbox"
                checked={selectedTaskIds.includes(t.id)}
                onChange={() => handleSelectOne(t.id)}
                className="rounded border-slate-300 mr-4 cursor-pointer"
              />

              <div className="grid grid-cols-12 w-full gap-4 items-center">
                {/* Title, tags, and inline mobile metrics */}
                <div className="col-span-11 md:col-span-5 text-left min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block text-sm">{t.title}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' :
                      t.priority === 'High' ? 'bg-orange-500/10 text-orange-500' :
                      t.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-slate-500/10 text-slate-500'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-indigo-500 dark:text-indigo-400">{t.department}</span>
                    <span className="md:hidden">•</span>
                    <span className="md:hidden flex items-center gap-0.5"><Calendar size={10} /> {t.dueDate}</span>
                    {t.assignee && (
                      <>
                        <span className="md:hidden">•</span>
                        <span className="md:hidden">Assignee: {t.assignee.name.split(' ')[0]}</span>
                      </>
                    )}
                    <span className="md:hidden">•</span>
                    <span className="md:hidden font-bold text-slate-500 dark:text-slate-350">{t.progress}% ({t.status})</span>
                  </div>
                </div>

                {/* Assignee */}
                <div className="hidden md:flex col-span-2 justify-center">
                  {t.assignee ? (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[80px]">{t.assignee.name.split(' ')[0]}</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                  )}
                </div>

                {/* Timeline */}
                <div className="hidden md:flex col-span-2 flex-col items-center">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1"><Calendar size={11} /> {t.dueDate}</span>
                  {t.isRecurring && <span className="text-[9px] text-indigo-500 mt-0.5 font-bold">🔁 {t.recurringFrequency}</span>}
                </div>

                {/* Progress bar */}
                <div className="hidden md:block col-span-2 px-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>{t.progress}%</span>
                    <span>{t.status}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${t.progress}%` }} />
                  </div>
                </div>

                {/* Star toggle */}
                <div className="col-span-1 flex justify-center">
                  <button onClick={(e) => { e.stopPropagation(); toggleTaskStar(t.id); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                    <Star size={16} className={t.starred ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Render Card Grid view */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((t) => (
                <motion.div
                  variants={itemVariants}
                  key={t.id}
                  onDoubleClick={() => setSelectedTask(t)}
                  className="glass-card p-5 hover:scale-[1.01] hover:border-indigo-500/30 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[190px]"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' :
                        t.priority === 'High' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-indigo-500/10 text-indigo-500'
                      }`}>
                        {t.priority}
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); toggleTaskStar(t.id); }} className="text-slate-400 hover:text-yellow-500">
                        <Star size={16} className={t.starred ? 'fill-yellow-500 text-yellow-500' : ''} />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2">{t.title}</h4>
                    <p className="text-[10px] text-slate-400">{t.department}</p>
                  </div>

                  <div className="space-y-3.5 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold"><Calendar size={12} /> {t.dueDate}</span>
                      {t.assignee && <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{t.assignee.name.split(' ')[0]}</span>}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>Sprint Progress</span>
                        <span>{t.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-805 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${t.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Render Table Spreadsheet View */}
          {viewMode === 'table' && (
            <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
              <table className="w-full border-collapse text-xs text-left bg-white/40 dark:bg-slate-900/40">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-3 w-8"><input type="checkbox" onChange={handleSelectAll} checked={selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0} className="rounded" /></th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Assignee</th>
                    <th className="p-3">Progress</th>
                    <th className="p-3 text-right">Starred</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => (
                    <tr
                      key={t.id}
                      onDoubleClick={() => setSelectedTask(t)}
                      className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer"
                    >
                      <td className="p-3"><input type="checkbox" checked={selectedTaskIds.includes(t.id)} onChange={() => handleSelectOne(t.id)} className="rounded" /></td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">{t.title}</td>
                      <td className="p-3 text-slate-500">{t.department}</td>
                      <td className="p-3">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' :
                          t.priority === 'High' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-indigo-500/10 text-indigo-500'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-semibold">{t.dueDate}</td>
                      <td className="p-3 text-slate-500">{t.assignee?.name || 'Unassigned'}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[10px] text-indigo-500">{t.progress}%</span>
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${t.progress}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={(e) => { e.stopPropagation(); toggleTaskStar(t.id); }} className="text-slate-400 hover:text-yellow-500">
                          <Star size={14} className={t.starred ? 'fill-yellow-500 text-yellow-500' : ''} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
          <List size={40} className="stroke-[1.5] mb-2" />
          <span className="text-sm">No tasks matched your search or filters.</span>
        </div>
      )}
    </div>
  );
}
