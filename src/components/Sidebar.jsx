import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Kanban, 
  Keyboard, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Command,
  Sun,
  Moon,
  Menu,
  FileText,
  Settings as SettingsIcon
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    stats, 
    darkMode, 
    setDarkMode,
    isSidebarCollapsed: isCollapsed,
    setIsSidebarCollapsed: setIsCollapsed,
    showShortcutsHelp,
    setShowShortcutsHelp
  } = useTasks();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsCollapsed]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'tasks', label: 'Task Board', icon: CheckSquare, badge: stats.todo + stats.inProgress },
    { id: 'kanban', label: 'Kanban Board', icon: Kanban, badge: null },
    { id: 'notes', label: 'Note Taking', icon: FileText, badge: null },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, badge: null }
  ];

  const shortcutsList = [
    { keys: ['Ctrl', 'N'], desc: 'Create a new task' },
    { keys: ['Ctrl', 'F'], desc: 'Focus instant search' },
    { keys: ['Ctrl', 'D'], desc: 'Toggle dark / light mode' },
    { keys: ['Ctrl', 'K'], desc: 'Open Command Palette' },
    { keys: ['Ctrl', 'Shift', 'C'], desc: 'Mark selected task complete' },
    { keys: ['Alt', '1-5'], desc: 'Switch workspace tabs' },
    { keys: ['Delete'], desc: 'Delete highlighted task' }
  ];

  return (
    <>
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <motion.aside
        animate={{ width: isCollapsed ? (isMobile ? 0 : 76) : 260 }}
        className={`h-screen border-r flex flex-col justify-between py-6 relative select-none flex-shrink-0 z-40 transition-colors duration-200 ${
          darkMode 
            ? 'bg-slate-900 border-slate-800 text-slate-400' 
            : 'bg-white border-slate-200 text-slate-600'
        } ${
          isMobile ? 'fixed left-0 top-0 shadow-2xl' : 'relative'
        } ${isCollapsed && isMobile ? 'pointer-events-none border-r-0' : ''}`}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        {/* Toggle Collapse Button */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute -right-3 top-7 w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg border z-30 transition-transform ${
              darkMode ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        {/* Top Branding Section */}
        <div className="px-4">
          <div className="flex items-center justify-between px-2 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-500/20">
                <Sparkles size={18} />
              </div>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col"
                >
                  <span className={`font-bold tracking-wide text-sm font-sans ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    PERSONAL
                  </span>
                  <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold tracking-wider uppercase">
                    Workspace
                  </span>
                </motion.div>
              )}
            </div>
            {isMobile && !isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className={`p-1 rounded transition-colors ${
                  darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full py-2.5 px-3.5 rounded-xl flex items-center justify-between transition-all duration-200 relative group ${
                    isActive 
                      ? `${darkMode ? 'text-white bg-gradient-to-r from-indigo-500/25 to-purple-500/5 border-indigo-500/20' : 'text-indigo-650 bg-indigo-50/70 border-indigo-200/50'} font-semibold border shadow-inner` 
                      : `${darkMode ? 'hover:text-slate-200 hover:bg-slate-800/40 text-slate-400' : 'hover:text-slate-900 hover:bg-slate-100 text-slate-600'}`
                  }`}
                >
                  {/* Active Indicator Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute left-0 w-1 h-5 rounded-r bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,1)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center gap-3">
                    <IconComponent 
                      size={20} 
                      className={`transition-colors duration-200 ${
                        isActive 
                          ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') 
                          : (darkMode ? 'text-slate-400 group-hover:text-indigo-400' : 'text-slate-500 group-hover:text-indigo-600')
                      }`} 
                    />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-sans"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </div>

                  {/* Badge */}
                  {!isCollapsed && item.badge > 0 && (
                    <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.4)]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="px-4 flex flex-col gap-2">
          {/* Command Palette Indicator */}
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' });
              window.dispatchEvent(event);
            }}
            className={`w-full py-2 px-3 rounded-lg border flex items-center justify-between text-xs transition-all ${
              darkMode 
                ? 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900 text-slate-500' 
                : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <Command size={14} />
              {!isCollapsed && <span>Search Commands</span>}
            </div>
            {!isCollapsed && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-650'
              }`}>
                Ctrl+K
              </span>
            )}
          </button>


          {/* User Profile Name Only */}
          <div className={`pt-4 border-t flex items-center justify-center px-2 ${
            darkMode ? 'border-slate-800' : 'border-slate-200'
          }`}>
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 overflow-hidden py-1"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className={`text-xs font-bold font-sans ${darkMode ? 'text-white' : 'text-slate-850'}`}>
                  Praveen
                </span>
              </motion.div>
            ) : (
              <span className={`text-xs font-bold font-mono ${darkMode ? 'text-indigo-400' : 'text-indigo-650'}`}>
                P
              </span>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Keyboard Shortcuts Dialog Backdrop */}
      <AnimatePresence>
        {showShortcutsHelp && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Keyboard className="text-indigo-500" /> Keyboard Shortcut System
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Navigate the workspace at peak speed. The active keybindings below run context actions from any page.
              </p>

              <div className="flex flex-col gap-3">
                {shortcutsList.map((sc, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 text-sm">
                    <span className="text-slate-650 dark:text-slate-300 font-sans">{sc.desc}</span>
                    <div className="flex items-center gap-1">
                      {sc.keys.map((key, ki) => (
                        <kbd key={ki} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-250 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowShortcutsHelp(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
