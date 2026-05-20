import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Sun, 
  Moon, 
  Keyboard, 
  Trash2, 
  HelpCircle, 
  Eye, 
  EyeOff,
  CloudLightning,
  Sparkles
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function Settings() {
  const {
    darkMode,
    setDarkMode,
    showOnboarding,
    setShowOnboarding,
    resetAllData,
    addToast
  } = useTasks();

  const shortcutsList = [
    { keys: ['Ctrl', 'N'], desc: 'Create a new task' },
    { keys: ['Ctrl', 'F'], desc: 'Focus instant search' },
    { keys: ['Ctrl', 'D'], desc: 'Toggle dark / light mode' },
    { keys: ['Ctrl', 'K'], desc: 'Open Command Palette' },
    { keys: ['Ctrl', 'Shift', 'C'], desc: 'Mark selected task complete' },
    { keys: ['Alt', '1-5'], desc: 'Switch workspace tabs' },
    { keys: ['Delete'], desc: 'Delete highlighted task' }
  ];

  const handleReset = () => {
    if (window.confirm('Are you sure you want to wipe all tasks, notes, habits, and reset the database? This cannot be undone.')) {
      resetAllData();
      addToast('Workspace Reset', 'success', 'All local storage data has been cleared.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Title Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight dark:text-white flex items-center gap-2">
            <SettingsIcon className="text-indigo-500" /> Workspace Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Configure system themes, review command shortcut mapping, and perform database diagnostics.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Preferences */}
        <div className="space-y-6">
          {/* Visual Preferences Card */}
          <motion.div variants={itemVariants} className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500" /> Workspace Theme
            </h3>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-250 block">Light / Dark toggle</span>
                <span className="text-[10px] text-slate-400">Switch between dark glassmorphism and clear styling.</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700 text-amber-400' 
                    : 'bg-indigo-50 border-indigo-100 text-indigo-650'
                }`}
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
            </div>

            {/* Onboarding Help toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-250 block">Onboarding Helper Banner</span>
                <span className="text-[10px] text-slate-400">Show the keyboard shortcut assistant panel on pages.</span>
              </div>
              <button
                onClick={() => setShowOnboarding(!showOnboarding)}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                  showOnboarding 
                    ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' 
                    : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                {showOnboarding ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{showOnboarding ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </motion.div>

          {/* Database Diagnostics & Maintenance Card */}
          <motion.div variants={itemVariants} className="glass-card p-6 border-rose-500/10">
            <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Trash2 size={16} /> Danger Zone
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">
              Diagnostic wipes completely purge the React State and clear all keys registered in Local Storage.
            </p>

            <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 flex items-center justify-between">
              <div className="space-y-0.5 pr-4">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 block">Reset Workspace database</span>
                <span className="text-[10px] text-rose-500/80 leading-relaxed">Permanently clears tasks, note databases, lists, and counters.</span>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex-shrink-0"
              >
                Reset Database
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Shortcuts Map */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Keyboard size={16} className="text-indigo-500" /> Keyboard Shortcuts Mapping
          </h3>
          <p className="text-xs text-slate-400 mb-6 font-sans">
            Quickly trigger context flows by executing key combinations from anywhere within the browser tab.
          </p>

          <div className="flex flex-col gap-3.5">
            {shortcutsList.map((sc, i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 text-xs">
                <span className="text-slate-650 dark:text-slate-300 font-medium font-sans">{sc.desc}</span>
                <div className="flex items-center gap-1">
                  {sc.keys.map((key, ki) => (
                    <kbd key={ki} className="px-1.5 py-0.5 rounded bg-slate-150 dark:bg-slate-800 text-slate-850 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-semibold">
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
