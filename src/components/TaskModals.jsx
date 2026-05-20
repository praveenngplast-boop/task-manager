import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  User, 
  Tag, 
  ListTodo, 
  FileText, 
  Star, 
  Trash2, 
  Archive,
  History,
  Plus,
  RefreshCw,
  Award,
  Layers,
  Flag
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function TaskModals() {
  const {
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    isNewDeptModalOpen,
    setIsNewDeptModalOpen,
    selectedTask,
    setSelectedTask,
    addTask,
    editTask,
    deleteTask,
    employees,
    departments,
    addDepartment
  } = useTasks();

  return (
    <>
      <NewTaskModal isOpen={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)} />
      <NewDeptModal isOpen={isNewDeptModalOpen} onClose={() => setIsNewDeptModalOpen(false)} />
      <TaskPreviewModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </>
  );
}

// ----------------- NEW TASK MODAL -----------------
function NewTaskModal({ isOpen, onClose }) {
  const { employees, departments, addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [assigneeId, setAssigneeId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('None');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // Tomorrow default
      setDepartment(departments[0]?.name || 'Engineering');
      setAssigneeId(employees[0]?.id || '');
      setTags([]);
      setSubtasks([]);
      setNotes('');
      setIsRecurring(false);
      setRecurringFrequency('None');
    }
  }, [isOpen, departments, employees]);

  if (!isOpen) return null;

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/,/g, '');
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, idx) => idx !== index));
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([...subtasks, {
        id: 'sub-' + Date.now() + Math.random(),
        title: newSubtaskTitle.trim(),
        completed: false
      }]);
      setNewSubtaskTitle('');
    }
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignee = employees.find(emp => emp.id === assigneeId) || null;

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      department,
      assignee,
      tags,
      subtasks,
      notes: notes.trim(),
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : 'None'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl z-10 relative p-6 text-slate-800 dark:text-slate-200"
      >
        <button onClick={onClose} className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Layers className="text-indigo-500" /> New Office Task Composer
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Redesign dashboard metrics layout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm outline-none"
              >
                <option value="Low">🟢 Low Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="High">🟠 High Priority</option>
                <option value="Critical">🔴 Critical Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Owner</label>
              <div className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/85 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                Praveen (Project Admin)
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Provide deep details about instructions and goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Tags (press Enter / comma to add)</label>
            <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/80 rounded-xl">
              {tags.map((tg, i) => (
                <span key={i} className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg flex items-center gap-1 font-semibold">
                  {tg}
                  <button type="button" onClick={() => handleRemoveTag(i)} className="text-slate-400 hover:text-slate-600"><X size={12} /></button>
                </span>
              ))}
              <input
                type="text"
                placeholder={tags.length === 0 ? "e.g. AWS, Hotfix" : ""}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="bg-transparent border-0 outline-none text-sm flex-1 min-w-[100px] text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Subtasks Builder */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Subtask Checklist</label>
            <div className="space-y-2">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/20 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-600 dark:text-slate-300">{st.title}</span>
                  <button type="button" onClick={() => handleRemoveSubtask(st.id)} className="text-rose-500 hover:text-rose-600 text-xs"><Trash2 size={12} /></button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Profile database indices"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-xs flex-1 outline-none text-slate-800 dark:text-slate-100"
                />
                <button type="button" onClick={handleAddSubtask} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-indigo-600 hover:text-white transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Recurring details */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              Recurring Schedule
            </label>
            {isRecurring && (
              <select
                value={recurringFrequency}
                onChange={(e) => setRecurringFrequency(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs outline-none"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Additional Reference Notes</label>
            <input
              type="text"
              placeholder="Access passwords, files directories, contact numbers..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ----------------- NEW DEPT MODAL -----------------
function NewDeptModal({ isOpen, onClose }) {
  const { addDepartment } = useTasks();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('Briefcase');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      addDepartment(name.trim(), color, icon);
      onClose();
    }
  };

  const colors = ['#6366f1', '#ec4899', '#14b8a6', '#eab308', '#f97316', '#3b82f6', '#8b5cf6', '#22c55e'];
  const icons = ['Code', 'Layers', 'Palette', 'TrendingUp', 'Users', 'Briefcase', 'Cpu', 'Activity'];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-slate-800 dark:text-slate-200"
      >
        <button onClick={onClose} className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create New Department</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Department Name</label>
            <input
              type="text"
              required
              placeholder="e.g. QA testing, Marketing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Accent Theme Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 rounded-lg border-2 ${color === c ? 'border-indigo-600 dark:border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Symbol Representation</label>
            <div className="grid grid-cols-4 gap-2">
              {icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`py-1.5 rounded-lg border text-xs font-semibold ${icon === ic ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ----------------- DETAILED PREVIEW & EDIT MODAL -----------------
function TaskPreviewModal({ task, onClose }) {
  const { editTask, deleteTask, employees, departments } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [department, setDepartment] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [notes, setNotes] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setDepartment(task.department);
      setAssigneeId(task.assignee?.id || '');
      setNotes(task.notes || '');
      setIsEditing(false);
    }
  }, [task]);

  if (!task) return null;

  const handleSubtaskToggle = (subtaskId) => {
    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    editTask(task.id, { subtasks: updatedSubtasks });
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const updatedSubtasks = [
        ...(task.subtasks || []),
        { id: 'sub-' + Date.now(), title: newSubtask.trim(), completed: false }
      ];
      editTask(task.id, { subtasks: updatedSubtasks });
      setNewSubtask('');
    }
  };

  const handleSaveEdits = () => {
    const assignee = employees.find(emp => emp.id === assigneeId) || null;
    editTask(task.id, {
      title,
      description,
      status,
      priority,
      dueDate,
      department,
      assignee,
      notes
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl z-10 p-6 relative text-slate-800 dark:text-slate-200"
      >
        <button onClick={onClose} className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
          <X size={20} />
        </button>

        {/* Header Action Row */}
        <div className="flex flex-wrap items-center gap-2 mb-6 pr-8">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
            task.status === 'Review' ? 'bg-amber-500/10 text-amber-500' :
            task.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-500' :
            'bg-slate-500/10 text-slate-500'
          }`}>
            {task.status}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            task.priority === 'Critical' ? 'bg-rose-500/10 text-rose-500' :
            task.priority === 'High' ? 'bg-orange-500/10 text-orange-500' :
            task.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
            'bg-slate-500/10 text-slate-500'
          }`}>
            {task.priority} Priority
          </span>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Calendar size={10} /> Due: {task.dueDate}
          </span>
        </div>

        {isEditing ? (
          /* EDITING STATE WRITER */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Owner</label>
                <div className="w-full bg-slate-105 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/85 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Praveen
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold">
                Discard
              </button>
              <button onClick={handleSaveEdits} className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          /* READ/PREVIEW STATE VISUALIZER */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Content (Title, Description, Checklist) */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{task.title}</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Department: <span className="font-semibold text-indigo-500">{task.department}</span></p>
              </div>

              {task.description && (
                <div className="bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Description</span>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{task.description}</p>
                </div>
              )}

              {/* Progress and Subtasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Subtask Progress</span>
                  <span className="text-xs font-bold text-indigo-500">{task.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4">
                  <div className="h-full bg-indigo-500" style={{ width: `${task.progress}%` }} />
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                  {task.subtasks?.map(st => (
                    <label
                      key={st.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => handleSubtaskToggle(st.id)}
                          className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={`text-slate-700 dark:text-slate-300 ${st.completed ? 'line-through opacity-50' : ''}`}>
                          {st.title}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Add quick subtask inline */}
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Quick add subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none"
                  />
                  <button onClick={handleAddSubtask} className="px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-indigo-600 hover:text-white">
                    Add
                  </button>
                </div>
              </div>

              {/* Tag badges */}
              {task.tags?.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Workspace Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map((tg, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Info & Timeline */}
            <div className="border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-6 space-y-6">
              {/* Workspace Owner */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Workspace Owner</span>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-550 flex items-center justify-center font-bold text-xs">P</div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Praveen</span>
                    <span className="text-[10px] text-slate-400 truncate">Workspace Admin</span>
                  </div>
                </div>
              </div>

              {/* Reference notes */}
              {task.notes && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Reference Notes</span>
                  <div className="text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono break-all">
                    {task.notes}
                  </div>
                </div>
              )}

              {/* History Timeline */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-1">
                  <History size={12} /> Audit Timeline
                </span>
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                  {task.history?.map((act, i) => (
                    <div key={i} className="flex gap-2.5 text-[10px] items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 flex-shrink-0" />
                      <div className="flex flex-col text-left">
                        <span className="text-slate-600 dark:text-slate-300 font-sans">{act.action}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  Edit Specifications
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => editTask(task.id, { archived: true })}
                    className="py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <Archive size={12} /> Archive
                  </button>
                  <button
                    onClick={handleDelete}
                    className="py-2 border border-rose-200 dark:border-rose-950 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
