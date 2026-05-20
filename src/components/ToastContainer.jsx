import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X, Volume2, VolumeX } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export default function ToastContainer() {
  const { notifications, soundEnabled, setSoundEnabled } = useTasks();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {/* Sound Toggle Button */}
      <div className="flex justify-end mb-2 pointer-events-auto">
        <button
          onClick={() => setSoundEnabled(prev => !prev)}
          className="p-2 rounded-full glass border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 shadow-md hover:scale-105 transition-all duration-200"
          title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {notifications.map((notif) => {
          let bgColor = 'bg-white/90 dark:bg-slate-900/90';
          let borderColor = 'border-slate-200 dark:border-slate-800';
          let iconColor = 'text-indigo-500';
          let Icon = Info;

          if (notif.type === 'success') {
            borderColor = 'border-emerald-500/30';
            iconColor = 'text-emerald-500';
            Icon = CheckCircle;
          } else if (notif.type === 'warning') {
            borderColor = 'border-amber-500/30';
            iconColor = 'text-amber-500';
            Icon = AlertTriangle;
          } else if (notif.type === 'error') {
            borderColor = 'border-rose-500/30';
            iconColor = 'text-rose-500';
            Icon = AlertTriangle;
          }

          return (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
              className={`p-4 rounded-xl border ${borderColor} ${bgColor} shadow-lg backdrop-blur-md pointer-events-auto flex items-start gap-3`}
            >
              <div className={`mt-0.5 ${iconColor}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {notif.title}
                </h4>
                {notif.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {notif.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
