import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Terminal, 
  Settings, 
  FileSpreadsheet, 
  FileText, 
  Moon, 
  Sun, 
  Trash2, 
  Database,
  PlusCircle,
  FolderPlus,
  Compass,
  LayoutDashboard,
  CheckSquare,
  Kanban,
  UserRound
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function CommandPalette() {
  const { 
    isCommandPaletteOpen: isOpen, 
    setIsCommandPaletteOpen: setIsOpen,
    setActiveTab,
    setDarkMode,
    setIsNewTaskModalOpen,
    setIsNewDeptModalOpen,
    exportToExcel,
    exportToCSV,
    exportToPDF,
    exportBackup,
    resetAllData
  } = useTasks();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    { id: 'go-dashboard', title: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => setActiveTab('dashboard') },
    { id: 'go-tasks', title: 'Go to Task Board', category: 'Navigation', icon: CheckSquare, action: () => setActiveTab('tasks') },
    { id: 'go-kanban', title: 'Go to Kanban Board', category: 'Navigation', icon: Kanban, action: () => setActiveTab('kanban') },
    { id: 'go-notes', title: 'Go to Note Taking Desk', category: 'Navigation', icon: FileText, action: () => setActiveTab('notes') },
    { id: 'go-settings', title: 'Go to Settings', category: 'Navigation', icon: Settings, action: () => setActiveTab('settings') },
    
    { id: 'action-new-task', title: 'Create New Task', category: 'Action', icon: PlusCircle, action: () => setIsNewTaskModalOpen(true) },
    { id: 'action-new-dept', title: 'Create New Department', category: 'Action', icon: FolderPlus, action: () => setIsNewDeptModalOpen(true) },
    { id: 'action-toggle-theme', title: 'Toggle Dark / Light Theme', category: 'Action', icon: Moon, action: () => setDarkMode(prev => !prev) },
    
    { id: 'file-excel', title: 'Export Task database to Excel (.xlsx)', category: 'Reporting', icon: FileSpreadsheet, action: () => exportToExcel() },
    { id: 'file-csv', title: 'Export Task database to CSV', category: 'Reporting', icon: FileText, action: () => exportToCSV() },
    { id: 'file-pdf', title: 'Generate PDF Executive Report', category: 'Reporting', icon: FileText, action: () => exportToPDF() },
    { id: 'file-backup', title: 'Download Local Backup config (.json)', category: 'System', icon: Database, action: () => exportBackup() },
    { id: 'system-reset', title: 'Reset all Workspace parameters', category: 'Danger Zone', icon: Trash2, action: () => resetAllData() }
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(search.toLowerCase()) || 
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, setIsOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-start justify-center pt-[15vh] p-4">
        {/* Backdrop Closer */}
        <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <Search size={18} className="text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search command palette or settings..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              className="flex-1 bg-transparent border-0 outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[350px] overflow-y-auto p-2">
            {filteredCommands.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  const isDanger = cmd.category === 'Danger Zone';

                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors text-left ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={isSelected ? 'text-white' : isDanger ? 'text-rose-500' : 'text-slate-400'} />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{cmd.title}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {cmd.category}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <kbd className="text-[10px] bg-indigo-700 text-indigo-100 px-1.5 py-0.5 rounded font-mono font-bold">
                          ENTER
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <Terminal size={32} className="stroke-[1.5] mb-2" />
                <span className="text-xs">No matching system commands found</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
