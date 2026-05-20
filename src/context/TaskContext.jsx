import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import {
  SAMPLE_TASKS,
  SAMPLE_EMPLOYEES,
  SAMPLE_DEPARTMENTS,
  SAMPLE_STICKY_NOTES,
  SAMPLE_HABITS,
  SAMPLE_GOALS,
  SAMPLE_MEETINGS,
  SAMPLE_ANNOUNCEMENTS
} from '../utils/sampleData';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  // --- Core Persistent State ---
  const [tasks, setTasksState] = useState(() => {
    const saved = localStorage.getItem('office_tasks');
    const loaded = saved ? JSON.parse(saved) : SAMPLE_TASKS;
    return loaded.map(t => ({ ...t, status: t.status || 'Todo' }));
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('office_employees');
    const parsed = saved ? JSON.parse(saved) : SAMPLE_EMPLOYEES;
    return parsed.filter(emp => emp.name === 'Praveen');
  });

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('office_departments');
    return saved ? JSON.parse(saved) : SAMPLE_DEPARTMENTS;
  });

  const [stickyNotes, setStickyNotes] = useState(() => {
    const saved = localStorage.getItem('office_sticky_notes');
    return saved ? JSON.parse(saved) : SAMPLE_STICKY_NOTES;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('office_habits');
    return saved ? JSON.parse(saved) : SAMPLE_HABITS;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('office_goals');
    return saved ? JSON.parse(saved) : SAMPLE_GOALS;
  });

  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('office_meetings');
    return saved ? JSON.parse(saved) : SAMPLE_MEETINGS;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('office_announcements');
    return saved ? JSON.parse(saved) : SAMPLE_ANNOUNCEMENTS;
  });

  // --- Extended Office Utilities State ---
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [shifts, setShifts] = useState([]);

  // --- Theme, Settings, & Layouts ---
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('office_dark_mode');
    return saved ? saved === 'true' : true;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('office_sound');
    return saved ? saved === 'true' : true;
  });

  const [showOnboarding, setShowOnboarding] = useState(() => {
    const saved = localStorage.getItem('office_onboarding');
    return saved ? saved === 'true' : true;
  });

  const [dashboardLayout, setDashboardLayout] = useState(() => {
    const saved = localStorage.getItem('office_dashboard_layout');
    return saved ? saved : 'grid'; // grid, focus, executive
  });

  const [customWidgets, setCustomWidgets] = useState(() => {
    const saved = localStorage.getItem('office_widgets');
    return saved ? JSON.parse(saved) : {
      pomodoro: true,
      stickyNotes: true,
      habits: true,
      goals: true,
      meetings: true,
      announcements: true,
      insights: true,
      activity: true
    };
  });

  // --- Automation / System State ---
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]); // Bulk actions
  const [recentDownloads, setRecentDownloads] = useState([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // saved, saving

  // --- Undo/Redo History Stack ---
  const taskHistoryRef = useRef([tasks]);
  const historyIndexRef = useRef(0);

  const setTasks = (newTasks) => {
    // Determine if newTasks is a function
    const resolvedTasks = typeof newTasks === 'function' ? newTasks(tasks) : newTasks;
    
    // Add to history stack
    const currentIndex = historyIndexRef.current;
    const historyStack = taskHistoryRef.current.slice(0, currentIndex + 1);
    historyStack.push(resolvedTasks);
    taskHistoryRef.current = historyStack;
    historyIndexRef.current = historyStack.length - 1;

    setTasksState(resolvedTasks);
  };

  const undo = () => {
    const index = historyIndexRef.current;
    if (index > 0) {
      historyIndexRef.current = index - 1;
      setTasksState(taskHistoryRef.current[index - 1]);
      addToast('Undo Action Triggered', 'info', 'Restored previous state.');
    } else {
      addToast('Nothing to Undo', 'warning');
    }
  };

  const redo = () => {
    const index = historyIndexRef.current;
    const stack = taskHistoryRef.current;
    if (index < stack.length - 1) {
      historyIndexRef.current = index + 1;
      setTasksState(stack[index + 1]);
      addToast('Redo Action Triggered', 'info', 'Restored next state.');
    } else {
      addToast('Nothing to Redo', 'warning');
    }
  };

  // --- UI-only UI view parameters ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: 'All',
    priority: 'All',
    status: 'All',
    starred: 'All'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sorting, setSorting] = useState('dueDateAsc');
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewDeptModalOpen, setIsNewDeptModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // --- Auto-Save simulator ---
  useEffect(() => {
    const interval = setInterval(() => {
      setAutoSaveStatus('saving');
      setTimeout(() => {
        setAutoSaveStatus('saved');
        localStorage.setItem('office_tasks', JSON.stringify(tasks));
        localStorage.setItem('office_employees', JSON.stringify(employees));
        localStorage.setItem('office_departments', JSON.stringify(departments));
        localStorage.setItem('office_sticky_notes', JSON.stringify(stickyNotes));
        localStorage.setItem('office_habits', JSON.stringify(habits));
        localStorage.setItem('office_goals', JSON.stringify(goals));
        localStorage.setItem('office_meetings', JSON.stringify(meetings));
        localStorage.setItem('office_announcements', JSON.stringify(announcements));
        localStorage.setItem('office_attendance', JSON.stringify(attendance));
        localStorage.setItem('office_leaves', JSON.stringify(leaves));
        localStorage.setItem('office_expenses', JSON.stringify(expenses));
        localStorage.setItem('office_shifts', JSON.stringify(shifts));
      }, 800);
    }, 12000);
    return () => clearInterval(interval);
  }, [tasks, employees, departments, stickyNotes, habits, goals, meetings, announcements, attendance, leaves, expenses, shifts]);

  // Sync dark mode style element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('office_dark_mode', String(darkMode));
  }, [darkMode]);

  // Persistent settings save
  useEffect(() => {
    localStorage.setItem('office_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('office_onboarding', String(showOnboarding));
  }, [showOnboarding]);

  useEffect(() => {
    localStorage.setItem('office_dashboard_layout', dashboardLayout);
  }, [dashboardLayout]);

  // --- Sound Effects Synthesizer ---
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'click') {
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'delete') {
        osc.frequency.setValueAtTime(311.13, ctx.currentTime);
        osc.frequency.setValueAtTime(196, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'warning') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn('AudioContext playback blocked/failed:', e);
    }
  };

  // --- Toast Notification Helper ---
  const addToast = (title, type = 'success', description = '') => {
    const id = 'toast-' + Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, title, type, description }]);
    playSound(type === 'error' || type === 'warning' ? 'warning' : 'click');
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // --- Activity Logger ---
  const logActivity = (action) => {
    const newActivity = {
      id: Date.now(),
      action,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRecentActivities(prev => [newActivity, ...prev.slice(0, 19)]);
  };

  // --- File System Operations ---
  const addDownloadHistory = (name, format) => {
    const item = {
      id: Date.now(),
      name,
      format,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRecentDownloads(prev => [item, ...prev.slice(0, 9)]);
  };

  const exportToExcel = (tasksList = tasks) => {
    try {
      const data = tasksList.map(t => ({
        ID: t.id,
        Title: t.title,
        Description: t.description,
        Priority: t.priority,
        Status: t.status,
        'Due Date': t.dueDate,
        Department: t.department,
        Assignee: t.assignee?.name || 'Unassigned',
        Tags: t.tags?.join(', ') || '',
        Progress: `${t.progress}%`,
        Starred: t.starred ? 'Yes' : 'No',
        Recurring: t.isRecurring ? t.recurringFrequency : 'No'
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
      XLSX.writeFile(workbook, `office_tasks_${new Date().toISOString().split('T')[0]}.xlsx`);
      addToast('Excel File Exported', 'success', 'Saved active task sheet to downloads.');
      addDownloadHistory('Active Tasks Sheet', 'xlsx');
      logActivity('Exported task list to Excel workbook');
    } catch (err) {
      addToast('Excel Export Failed', 'error', err.message);
    }
  };

  const exportDepartmentToExcel = (deptName) => {
    const filtered = tasks.filter(t => t.department === deptName);
    if (filtered.length === 0) {
      addToast('No tasks found for department', 'warning', deptName);
      return;
    }
    exportToExcel(filtered);
  };

  const importFromExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) {
          addToast('Import Error', 'error', 'Excel file contains no rows.');
          return;
        }

        const imported = json.map((row, idx) => ({
          id: `task-excel-${Date.now()}-${idx}`,
          title: row.Title || 'Imported Task',
          description: row.Description || '',
          priority: ['Low', 'Medium', 'High', 'Critical'].includes(row.Priority) ? row.Priority : 'Medium',
          status: ['Todo', 'In Progress', 'Review', 'Completed'].includes(row.Status) ? row.Status : 'Todo',
          dueDate: row['Due Date'] || new Date().toISOString().split('T')[0],
          department: row.Department || 'Engineering',
          assignee: employees.find(emp => emp.name === row.Assignee) || employees[0],
          tags: row.Tags ? row.Tags.split(',').map(s => s.trim()) : [],
          progress: parseInt(row.Progress, 10) || 0,
          starred: row.Starred === 'Yes',
          isRecurring: row.Recurring && row.Recurring !== 'No',
          recurringFrequency: row.Recurring !== 'No' ? row.Recurring : 'None',
          archived: false,
          history: [{ timestamp: new Date().toISOString(), action: 'Imported from Excel spreadsheet' }]
        }));

        setTasks(prev => [...imported, ...prev]);
        addToast('Excel Import Success', 'success', `Imported ${imported.length} tasks.`);
        logActivity(`Imported ${imported.length} tasks from Excel`);
      } catch (err) {
        addToast('Excel Import Failed', 'error', 'Invalid file layout.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const exportToCSV = () => {
    try {
      const data = tasks.map(t => [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        t.priority,
        t.status,
        t.dueDate,
        t.department,
        t.assignee?.name || 'Unassigned',
        t.progress
      ]);

      const headers = ['ID', 'Title', 'Description', 'Priority', 'Status', 'Due Date', 'Department', 'Assignee', 'Progress'];
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...data.map(e => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `office_tasks_backup_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('CSV File Exported', 'success', 'Downloaded CSV backup.');
      addDownloadHistory('Tasks Backup', 'csv');
      logActivity('Exported task list to CSV');
    } catch (e) {
      addToast('CSV Export Failed', 'error');
    }
  };

  const exportToPDF = (tasksList = tasks) => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229); // Indigo 600
      doc.text('Office Task Manager - Executive Report', 20, 25);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139); // Slate 500
      doc.text(`Generated On: ${new Date().toLocaleString()}`, 20, 33);
      doc.text(`Workspace Summary: Total Tasks: ${tasksList.length} | Completed: ${tasksList.filter(t => t.status === 'Completed').length}`, 20, 39);

      let y = 50;
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 42, 190, 42);

      tasksList.forEach((t, i) => {
        if (y > 265) {
          doc.addPage();
          y = 25;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42); // Slate 900
        doc.text(`${i + 1}. ${t.title}`, 20, y);
        
        // Priority Badge text alignment
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        const pColor = t.priority === 'Critical' ? [244, 63, 94] : t.priority === 'High' ? [249, 115, 22] : [99, 102, 241];
        doc.setTextColor(pColor[0], pColor[1], pColor[2]);
        doc.text(`[${t.priority}]`, 170, y);

        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text(`Department: ${t.department}  |  Assignee: ${t.assignee?.name || 'Unassigned'}  |  Due: ${t.dueDate}  |  Progress: ${t.progress}%  |  Status: ${t.status}`, 20, y);
        y += 5;

        if (t.description) {
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(9.5);
          const descLines = doc.splitTextToSize(t.description, 165);
          doc.text(descLines, 22, y);
          y += (descLines.length * 5);
        }

        y += 6;
        doc.setDrawColor(241, 245, 249);
        doc.line(20, y - 2, 190, y - 2);
        y += 3;
      });

      doc.save(`office_executive_report_${new Date().toISOString().split('T')[0]}.pdf`);
      addToast('PDF Report Generated', 'success', 'Downloaded PDF overview.');
      addDownloadHistory('Executive Report', 'pdf');
      logActivity('Exported workspace parameters to PDF');
    } catch (err) {
      addToast('PDF Generation Failed', 'error', err.message);
    }
  };

  // --- Task CRUD Operations ---
  const addTask = (taskData) => {
    const newTask = {
      id: 'task-' + Date.now(),
      starred: false,
      progress: 0,
      subtasks: [],
      notes: '',
      history: [{ timestamp: new Date().toISOString(), action: 'Task created' }],
      archived: false,
      status: 'Todo',
      ...taskData
    };

    // Auto-Prioritization simulation
    if (newTask.dueDate) {
      const daysLeft = (new Date(newTask.dueDate) - new Date()) / 86400000;
      if (daysLeft <= 1 && newTask.priority !== 'Critical') {
        newTask.priority = 'Critical';
        newTask.notes = (newTask.notes ? newTask.notes + '\n' : '') + '💡 Auto-prioritized to Critical due to upcoming deadline.';
      }
    }

    // Duplicate detection check
    const isDuplicate = tasks.some(t => t.title.trim().toLowerCase() === newTask.title.trim().toLowerCase() && t.department === newTask.department);
    if (isDuplicate) {
      addToast('Duplicate Task Detected', 'warning', 'A task with this title exists in this department.');
    }

    setTasks((prev) => [newTask, ...prev]);
    addToast('Task Created Successfully', 'success', `"${newTask.title}" added.`);
    logActivity(`Created task: ${newTask.title}`);
  };

  const editTask = (taskId, updatedData) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const history = [...(t.history || [])];
          if (updatedData.status && updatedData.status !== t.status) {
            history.push({ timestamp: new Date().toISOString(), action: `Status changed to ${updatedData.status}` });
            
            // Automatically adjust progress visually regardless of subtasks
            if (updatedData.status === 'Todo') updatedData.progress = 0;
            if (updatedData.status === 'In Progress') updatedData.progress = 25;
            if (updatedData.status === 'Review') updatedData.progress = 75;
          }

          if (updatedData.status === 'Completed' && t.status !== 'Completed') {
            triggerConfetti();
            playSound('success');
            addToast('Task Completed! 🎉', 'success', `"${t.title}" is finished.`);
            updatedData.progress = 100;
            if (updatedData.subtasks) {
              updatedData.subtasks = updatedData.subtasks.map(st => ({ ...st, completed: true }));
            } else if (t.subtasks) {
              updatedData.subtasks = t.subtasks.map(st => ({ ...st, completed: true }));
            }
          }

          // Auto-calculate progress
          if (updatedData.subtasks) {
            const total = updatedData.subtasks.length;
            const completed = updatedData.subtasks.filter(st => st.completed).length;
            updatedData.progress = total > 0 ? Math.round((completed / total) * 100) : updatedData.progress;
            
            if (total > 0 && completed === total && updatedData.status !== 'Completed') {
              updatedData.status = 'Completed';
              triggerConfetti();
              playSound('success');
              addToast('Task Completed! 🎉', 'success', `All subtasks in "${t.title}" completed.`);
            }
          }

          const updatedTask = { ...t, ...updatedData, history };
          if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask(updatedTask);
          }
          return updatedTask;
        }
        return t;
      })
    );
    addToast('Task Updated', 'info', 'Saved changes.');
    logActivity(`Updated task details for ID: ${taskId}`);
  };

  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    // Save to deleted tasks stack for restoration
    setDeletedTasks(prev => [taskToDelete, ...prev.slice(0, 19)]);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
    
    playSound('delete');
    addToast('Task Deleted', 'warning', `"${taskToDelete.title}" removed. Press Ctrl+Z to undo.`);
    logActivity(`Deleted task: ${taskToDelete.title}`);
  };

  const restoreDeletedTask = () => {
    if (deletedTasks.length === 0) {
      addToast('No tasks to restore', 'warning');
      return;
    }
    const [taskToRestore, ...remainingDeleted] = deletedTasks;
    setTasks(prev => [taskToRestore, ...prev]);
    setDeletedTasks(remainingDeleted);
    addToast('Task Restored', 'success', `"${taskToRestore.title}" put back.`);
    logActivity(`Restored task: ${taskToRestore.title}`);
  };

  const toggleTaskStar = (taskId) => {
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, starred: !t.starred } : t)
    );
  };

  const archiveCompletedTasks = () => {
    const completedCount = tasks.filter(t => t.status === 'Completed' && !t.archived).length;
    if (completedCount === 0) {
      addToast('No completed tasks to archive', 'warning');
      return;
    }
    setTasks(prev =>
      prev.map(t => t.status === 'Completed' ? { ...t, archived: true } : t)
    );
    addToast('Tasks Archived', 'success', `${completedCount} tasks moved to archive.`);
    logActivity(`Archived ${completedCount} tasks.`);
  };

  // --- Bulk Operations ---
  const bulkDelete = () => {
    if (selectedTaskIds.length === 0) return;
    const deletedCount = selectedTaskIds.length;
    const tasksToDelete = tasks.filter(t => selectedTaskIds.includes(t.id));
    setDeletedTasks(prev => [...tasksToDelete, ...prev]);
    setTasks(prev => prev.filter(t => !selectedTaskIds.includes(t.id)));
    setSelectedTaskIds([]);
    playSound('delete');
    addToast('Bulk Deletion Success', 'warning', `Removed ${deletedCount} tasks.`);
    logActivity(`Bulk deleted ${deletedCount} tasks`);
  };

  const bulkChangeStatus = (newStatus) => {
    if (selectedTaskIds.length === 0) return;
    setTasks(prev =>
      prev.map(t => selectedTaskIds.includes(t.id) ? { ...t, status: newStatus, progress: newStatus === 'Completed' ? 100 : t.progress } : t)
    );
    addToast('Bulk Status Updated', 'success', `Updated ${selectedTaskIds.length} tasks to ${newStatus}.`);
    logActivity(`Bulk status change for ${selectedTaskIds.length} tasks`);
    setSelectedTaskIds([]);
  };

  const bulkChangePriority = (newPriority) => {
    if (selectedTaskIds.length === 0) return;
    setTasks(prev =>
      prev.map(t => selectedTaskIds.includes(t.id) ? { ...t, priority: newPriority } : t)
    );
    addToast('Bulk Priority Updated', 'success', `Set ${selectedTaskIds.length} tasks to ${newPriority}.`);
    logActivity(`Bulk priority change for ${selectedTaskIds.length} tasks`);
    setSelectedTaskIds([]);
  };

  // --- Department Operations ---
  const addDepartment = (name, color = '#6366f1', icon = 'Briefcase') => {
    const isDup = departments.some(d => d.name.toLowerCase() === name.toLowerCase());
    if (isDup) {
      addToast('Department Exists', 'warning', name);
      return;
    }
    const newDept = {
      id: 'dep-' + Date.now(),
      name,
      color,
      icon
    };
    setDepartments(prev => [...prev, newDept]);
    addToast('Department Created', 'success', `Created "${name}" department.`);
    logActivity(`Created department: ${name}`);
  };

  // --- Sticky Notes CRUD ---
  const addStickyNote = (content = 'New note details', color = '#bfdbfe') => {
    const newNote = { id: 'note-' + Date.now(), content, color };
    setStickyNotes(prev => [newNote, ...prev]);
    logActivity('Added a sticky note');
  };

  const updateStickyNote = (id, content) => {
    setStickyNotes(prev => prev.map(note => note.id === id ? { ...note, content } : note));
  };

  const deleteStickyNote = (id) => {
    setStickyNotes(prev => prev.filter(note => note.id !== id));
    playSound('delete');
  };

  // --- Habit Tracking ---
  const toggleHabit = (id) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const completedToday = !habit.completedToday;
        const streak = completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        if (completedToday) {
          triggerConfetti();
          playSound('success');
          addToast('Habit Checked! 🌟', 'success', `Nice job on "${habit.name}"`);
        }
        return { ...habit, completedToday, streak };
      }
      return habit;
    }));
  };

  const addHabit = (name) => {
    if (!name.trim()) return;
    const newHabit = {
      id: 'habit-' + Date.now(),
      name,
      streak: 0,
      completedToday: false
    };
    setHabits(prev => [...prev, newHabit]);
    addToast('Habit Tracked', 'success', `Started tracking "${name}"`);
    logActivity(`Added habit: ${name}`);
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    playSound('delete');
  };

  // --- Goal Tracking ---
  const updateGoal = (id, currentVal) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const current = Math.min(parseFloat(currentVal) || 0, g.target);
        if (current === g.target && g.current !== g.target) {
          triggerConfetti();
          playSound('success');
          addToast('Goal Achieved! 🏆', 'success', `"${g.title}" completed!`);
        }
        return { ...g, current };
      }
      return g;
    }));
  };

  // --- Meeting Scheduler ---
  const addMeeting = (meetingData) => {
    const newMeeting = {
      id: 'meet-' + Date.now(),
      minutes: '',
      ...meetingData
    };
    setMeetings(prev => [...prev, newMeeting]);
    addToast('Meeting Scheduled', 'success', `"${newMeeting.title}" set for ${newMeeting.time}`);
    logActivity(`Scheduled meeting: ${newMeeting.title}`);
  };

  const updateMeetingMinutes = (id, minutesText) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, minutes: minutesText } : m));
    addToast('Minutes Saved', 'success', 'Saved meeting notes.');
  };

  const cancelMeeting = (id) => {
    const meeting = meetings.find(m => m.id === id);
    setMeetings(prev => prev.filter(m => m.id !== id));
    playSound('delete');
    if (meeting) {
      addToast('Meeting Cancelled', 'warning', `"${meeting.title}" removed.`);
    }
  };

  // --- Approval Flow Simulation ---
  const toggleApprovalStatus = (id, newStatus) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    addToast(`Workflow ${newStatus}`, 'success', `Record status synchronized.`);
    logActivity(`Approval decision [${newStatus}] for ID: ${id}`);
  };

  // --- Confetti helper ---
  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  // --- Reset All Workspace Parameters ---
  const resetAllData = () => {
    if (window.confirm('Reset this workspace to factory defaults? All tasks, employee files, sticky notes, and shifts will be cleared.')) {
      setTasksState([]);
      setEmployees(SAMPLE_EMPLOYEES);
      setDepartments(SAMPLE_DEPARTMENTS);
      setStickyNotes([]);
      setHabits([]);
      setGoals([]);
      setMeetings([]);
      setAnnouncements([]);
      setAttendance([]);
      setLeaves([]);
      setExpenses([]);
      setShifts([]);
      setSelectedTaskIds([]);
      setCustomWidgets({
        pomodoro: true,
        stickyNotes: true,
        habits: true,
        goals: true,
        meetings: true,
        announcements: true,
        insights: true,
        activity: true
      });
      addToast('Workspace Reset Done', 'success', 'Restored corporate default workspace layout.');
      logActivity('Wiped all data, loaded default template');
    }
  };

  // --- Custom backup JSON import/export ---
  const exportBackup = () => {
    const data = {
      tasks,
      employees,
      departments,
      stickyNotes,
      habits,
      goals,
      meetings,
      announcements,
      attendance,
      leaves,
      expenses,
      shifts,
      customWidgets
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `office-suite-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Backup Export Successful', 'success');
  };

  const importBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.tasks) setTasksState(data.tasks);
        if (data.employees) setEmployees(data.employees);
        if (data.departments) setDepartments(data.departments);
        if (data.stickyNotes) setStickyNotes(data.stickyNotes);
        if (data.habits) setHabits(data.habits);
        if (data.goals) setGoals(data.goals);
        if (data.meetings) setMeetings(data.meetings);
        if (data.announcements) setAnnouncements(data.announcements);
        if (data.attendance) setAttendance(data.attendance);
        if (data.leaves) setLeaves(data.leaves);
        if (data.expenses) setExpenses(data.expenses);
        if (data.shifts) setShifts(data.shifts);
        if (data.customWidgets) setCustomWidgets(data.customWidgets);

        triggerConfetti();
        addToast('Workspace Sync Done', 'success', 'All state properties applied.');
      } catch (err) {
        addToast('Import Failed', 'error', 'Invalid JSON backup config.');
      }
    };
    reader.readAsText(file);
  };

  // --- Analytical Computations ---
  const activeTasks = tasks.filter(t => !t.archived);

  const stats = {
    total: activeTasks.length,
    todo: activeTasks.filter(t => t.status === 'Todo').length,
    inProgress: activeTasks.filter(t => t.status === 'In Progress').length,
    review: activeTasks.filter(t => t.status === 'Review').length,
    completed: activeTasks.filter(t => t.status === 'Completed').length,
    starred: activeTasks.filter(t => t.starred).length,
    highPriority: activeTasks.filter(t => t.priority === 'Critical' || t.priority === 'High').length
  };

  // Productivity Score calculation
  const productivityScore = (() => {
    if (activeTasks.length === 0) return 0;
    const completedRatio = stats.completed / activeTasks.length;
    const inProgress = activeTasks.filter(t => t.status === 'In Progress' || t.status === 'Review');
    const averageProgress = inProgress.length > 0
      ? inProgress.reduce((acc, t) => acc + (t.progress || 0), 0) / inProgress.length
      : 0;
    const completedHabitsRatio = habits.length > 0
      ? habits.filter(h => h.completedToday).length / habits.length
      : 0;
    
    return Math.round((completedRatio * 60) + ((averageProgress / 100) * 20) + (completedHabitsRatio * 20));
  })();

  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'Completed' && !t.archived && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const getProductivityInsight = () => {
    if (productivityScore > 85) return "🚀 Masterful work speed! You are performing in deep flow today. All sprints are running on timeline alignment.";
    if (productivityScore > 50) return "📈 Solid momentum. Tackle critical tasks first to secure high performance marks before weekend reviews.";
    if (tasks.filter(t => t.priority === 'Critical' && t.status !== 'Completed').length > 1) return "⚠️ High bottleneck risks: multiple critical assignments require immediate checkouts.";
    return "💡 Warm up for deep work. Start with a 25-minute Pomodoro focus block to get some quick subtasks completed.";
  };

  return (
    <TaskContext.Provider
      value={{
        // State vectors
        tasks,
        employees,
        departments,
        stickyNotes,
        habits,
        goals,
        meetings,
        announcements,
        attendance,
        leaves,
        expenses,
        shifts,
        darkMode,
        soundEnabled,
        showOnboarding,
        customWidgets,
        deletedTasks,
        selectedTaskIds,
        recentDownloads,
        autoSaveStatus,
        dashboardLayout,

        // Setters
        setTasks,
        setEmployees,
        setDepartments,
        setStickyNotes,
        setHabits,
        setGoals,
        setMeetings,
        setAnnouncements,
        setAttendance,
        setLeaves,
        setExpenses,
        setShifts,
        setDarkMode,
        setSoundEnabled,
        setShowOnboarding,
        setCustomWidgets,
        setSelectedTaskIds,
        setDashboardLayout,

        // Handlers
        addTask,
        editTask,
        deleteTask,
        restoreDeletedTask,
        toggleTaskStar,
        archiveCompletedTasks,
        bulkDelete,
        bulkChangeStatus,
        bulkChangePriority,
        addDepartment,
        addStickyNote,
        updateStickyNote,
        deleteStickyNote,
        toggleHabit,
        addHabit,
        deleteHabit,
        updateGoal,
        addMeeting,
        updateMeetingMinutes,
        cancelMeeting,
        toggleApprovalStatus,
        undo,
        redo,

        // File operations
        exportToExcel,
        exportDepartmentToExcel,
        importFromExcel,
        exportToCSV,
        exportToPDF,
        exportBackup,
        importBackup,
        resetAllData,

        // UI toggles
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        showAdvancedFilters,
        setShowAdvancedFilters,
        sorting,
        setSorting,
        notifications,
        recentActivities,
        selectedTask,
        setSelectedTask,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isNewTaskModalOpen,
        setIsNewTaskModalOpen,
        isNewDeptModalOpen,
        setIsNewDeptModalOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        showShortcutsHelp,
        setShowShortcutsHelp,
        addToast,
        removeToast,
        playSound,
        triggerConfetti,

        // Dynamic metrics
        stats,
        productivityScore,
        upcomingDeadlines,
        productivityInsight: getProductivityInsight()
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
