import React from 'react';

export function Window({ 
  id, 
  title, 
  x, 
  y, 
  w, 
  h, 
  zIndex, 
  isActive, 
  onClose, 
  onMinimize, 
  onFocus, 
  onDragStart, 
  children 
}) {
  return (
    <div
      onClick={onFocus}
      className={`absolute rounded-xl border flex flex-col overflow-hidden shadow-2xl backdrop-blur-md transition-shadow duration-150 ${
        isActive 
          ? 'border-emerald-500/50 shadow-emerald-500/5 bg-slate-900/95' 
          : 'border-slate-700/60 shadow-black/50 bg-slate-950/90'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${h}px`,
        zIndex: zIndex
      }}
    >
      {/* WINDOW TITLE BAR */}
      <div
        onPointerDown={onDragStart}
        className={`h-10 px-4 flex items-center justify-between cursor-move select-none border-b ${
          isActive 
            ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 text-emerald-200 border-emerald-900/40' 
            : 'bg-slate-950 text-slate-500 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></span>
          <span className="text-xs font-mono font-bold tracking-wide">{title}</span>
        </div>
        
        {/* WINDOW CONTROLS */}
        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={onMinimize}
            title="Minimize Window"
            className="w-6 h-6 flex items-center justify-center rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
            </svg>
          </button>
          <button
            onClick={onClose}
            title="Tutup Window"
            className="w-6 h-6 flex items-center justify-center rounded-md bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* WINDOW BODY */}
      <div className="flex-1 overflow-auto p-4 text-sm leading-relaxed text-slate-300">
        {children}
      </div>
    </div>
  );
}
