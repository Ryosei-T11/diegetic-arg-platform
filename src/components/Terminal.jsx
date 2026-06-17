import React from 'react';

export function Terminal({ history, onSubmitCommand, currentInput, onInputChange, bottomRef, playSound }) {
  return (
    <div className="h-full flex flex-col bg-slate-950 font-mono text-xs p-3 rounded-lg border border-slate-800 text-emerald-400">
      {/* HISTORI LOG */}
      <div className="flex-1 overflow-auto space-y-1.5 mb-2 pr-1 select-text scrollbar-thin">
        {history.map((item, idx) => {
          if (item.type === 'blank') return <div key={idx} className="h-2" />;
          
          let textClass = 'text-slate-300';
          if (item.type === 'system') textClass = 'text-emerald-500 font-bold';
          if (item.type === 'input') textClass = 'text-blue-400 font-semibold';
          if (item.type === 'error') textClass = 'text-rose-500 font-bold';
          if (item.type === 'warning') textClass = 'text-amber-400';
          if (item.type === 'success') textClass = 'text-emerald-400 font-extrabold';
          if (item.type === 'title') textClass = 'text-emerald-300 underline font-bold border-b border-emerald-950 pb-0.5';

          return (
            <div key={idx} className={`${textClass} whitespace-pre-wrap leading-relaxed`}>
              {item.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT FORM */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitCommand();
        }}
        className="flex items-center border-t border-slate-800/80 pt-2.5"
      >
        <span className="text-blue-400 font-bold mr-2.5">User@AetherOS:~$</span>
        <input
          type="text"
          value={currentInput}
          onChange={(e) => {
            if (playSound) playSound('keystroke');
            onInputChange(e.target.value);
          }}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-emerald-400 caret-emerald-400 font-mono text-xs p-0"
          autoFocus
          placeholder='Ketik perintah forensik di sini... (atau "help" untuk bantuan)'
        />
      </form>
    </div>
  );
}
