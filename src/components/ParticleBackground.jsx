import React from 'react';

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Glow Blob 1 */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] animate-drift-slow" 
        style={{ animationDelay: '0s' }}
      />
      {/* Glow Blob 2 */}
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[110px] animate-drift-slow"
        style={{ animationDelay: '-6s' }}
      />
      {/* Glow Blob 3 */}
      <div 
        className="absolute top-[30%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-pink-500/5 dark:bg-pink-500/3 blur-[90px] animate-drift-slow"
        style={{ animationDelay: '-12s' }}
      />
    </div>
  );
}
