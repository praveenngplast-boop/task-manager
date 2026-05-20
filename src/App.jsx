import React, { useEffect, useState } from 'react';
import { useTasks, TaskProvider } from './context/TaskContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Component Imports
import Sidebar from './components/Sidebar';
import ToastContainer from './components/ToastContainer';
import CommandPalette from './components/CommandPalette';
import TaskModals from './components/TaskModals';
import ParticleBackground from './components/ParticleBackground';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import KanbanBoard from './components/KanbanBoard';
import NoteTaking from './components/NoteTaking';
import Settings from './components/Settings';

// Icons
import { 
  Sparkles, 
  X, 
  HelpCircle, 
  Search, 
  Clock, 
  CloudLightning, 
  Calendar,
  Layers,
  Activity,
  Menu
} from 'lucide-react';

function AppContent() {
  const {
    // UI state
    activeTab,
    setActiveTab,
    darkMode,
    setDarkMode,
    showOnboarding,
    setShowOnboarding,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isNewTaskModalOpen,
    setIsNewTaskModalOpen,
    isNewDeptModalOpen,
    setIsNewDeptModalOpen,
    showAdvancedFilters,
    setShowAdvancedFilters,
    showShortcutsHelp,
    setShowShortcutsHelp,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    selectedTask,
    autoSaveStatus,
    
    // Actions
    editTask,
    deleteTask,
    exportToExcel,
    exportToPDF,
    addToast,
    undo,
    redo
  } = useTasks();

  // Keyboard shortcut listener attachment
  useKeyboardShortcuts({
    setDarkMode,
    setIsCommandPaletteOpen,
    setActiveTab,
    selectedTask,
    editTask,
    deleteTask,
    exportToExcel,
    exportToPDF,
    addToast,
    setIsNewTaskModalOpen,
    setIsNewDeptModalOpen,
    setShowAdvancedFilters,
    setShowShortcutsHelp,
    setIsSidebarCollapsed,
    undo,
    redo
  });

  // Time Tracker state
  const getDateTime = () => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      day: now.toLocaleDateString(undefined, { weekday: 'short' }),
      date: now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    };
  };

  const [dateInfo, setDateInfo] = useState(getDateTime());
  useEffect(() => {
    const timer = setInterval(() => {
      setDateInfo(getDateTime());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative transition-colors duration-300">
      
      {/* Background Animated Blobs */}
      <ParticleBackground />

      {/* Main Sidebar Drawer */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col relative z-10 print:bg-white print:text-black">
        
        {/* Top Header Navigation Dashboard */}
        <header className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/10 backdrop-blur-md flex items-center justify-between z-10 flex-shrink-0 select-none print:hidden">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm mr-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Open Workspace Menu"
              >
                <Menu size={18} />
              </button>
            )}
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-0.5 rounded-lg">
              {activeTab}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span>Praveen</span>
              <span>/</span>
              <span className="capitalize">{activeTab} View</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Auto save indicator */}
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
              <CloudLightning size={10} className={autoSaveStatus === 'saving' ? 'text-indigo-500 animate-pulse' : 'text-slate-400'} />
              <span>{autoSaveStatus === 'saving' ? 'Auto-saving...' : 'Synced'}</span>
            </div>

            {/* Time and date display */}
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/45">
              <Clock size={12} />
              <div className="leading-none">
                <div className="font-bold text-slate-700 dark:text-slate-100">{dateInfo.time}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{`${dateInfo.day}, ${dateInfo.date}`}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Optional Onboarding Info Panel */}
        {showOnboarding && activeTab === 'dashboard' && (
          <div className="px-6 md:px-8 pt-6 print:hidden">
            <div className="p-4 rounded-2xl border border-indigo-550 bg-indigo-600 text-white flex items-center justify-between shadow-[0_4px_15px_rgba(99,102,241,0.2)]">
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-indigo-200 flex-shrink-0" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold block">Keyboard-First Productivity Workspace</span>
                  <p className="text-indigo-150 leading-relaxed max-w-2xl font-sans">
                    Accelerate your workflow with commands: Press <kbd className="bg-white/20 px-1 py-0.5 rounded text-[10px] font-bold">Ctrl+K</kbd> to open Command Palette, <kbd className="bg-white/20 px-1 py-0.5 rounded text-[10px] font-bold">Ctrl+N</kbd> to compose tasks, or <kbd className="bg-white/20 px-1 py-0.5 rounded text-[10px] font-bold">Ctrl+/</kbd> to open cheatsheet panels.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowOnboarding(false)} 
                className="p-1 hover:bg-white/10 rounded-full text-indigo-200 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Content Body Pages */}
        <main className="p-6 md:p-8 flex-1">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'tasks' && <TaskBoard />}
          {activeTab === 'kanban' && <KanbanBoard />}
          {activeTab === 'notes' && <NoteTaking />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>

      {/* Global Command Palette search bar */}
      <CommandPalette />

      {/* Modal components (Task composer, department manager, detailed preview) */}
      <TaskModals />

      {/* Stacked Toast Notification Alerts */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}
