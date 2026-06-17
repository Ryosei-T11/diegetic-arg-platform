import React from 'react';

export function EmailClient({ emails, activeEmailId, onSelectEmail, playSound }) {
  const activeMail = emails.find(m => m.id === activeEmailId);

  return (
    <div className="h-full flex gap-4 text-xs font-mono">
      {/* DAFTAR SUREL */}
      <div className="w-1/3 border-r border-slate-800/80 pr-3.5 flex flex-col gap-2 overflow-auto">
        <span className="text-slate-500 font-bold tracking-wider text-[10px] uppercase border-b border-slate-800/80 pb-2">
          Kotak Masuk
        </span>
        {emails.map((mail) => (
          <div 
            key={mail.id}
            onClick={() => {
              if (playSound) playSound('click');
              onSelectEmail(mail.id);
            }}
            className={`p-3 rounded-lg cursor-pointer border transition-all duration-200 ${
              mail.id === activeEmailId
                ? 'bg-emerald-950/30 border-emerald-500/50 text-slate-100 shadow-lg shadow-emerald-900/10'
                : mail.read 
                  ? 'bg-slate-950/40 border-slate-800 text-slate-500 hover:bg-slate-900/60' 
                  : 'bg-emerald-950/15 border-emerald-900/40 text-slate-200 font-bold hover:bg-emerald-950/25 animate-pulse'
            }`}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-extrabold text-emerald-400 truncate max-w-[110px]">
                {mail.sender.split('@')[0]}
              </span>
              <span className="text-[9px] text-slate-500">{mail.date}</span>
            </div>
            <p className="truncate text-slate-300 font-semibold">{mail.subject}</p>
          </div>
        ))}
      </div>

      {/* DETAIL CONTENT */}
      <div className="flex-1 bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 flex flex-col select-text">
        {activeMail ? (
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="border-b border-slate-800/80 pb-3 space-y-1">
              <p className="text-slate-400">
                <span className="text-emerald-500 font-bold">DARI:</span> {activeMail.sender}
              </p>
              <p className="text-slate-300">
                <span className="text-emerald-500 font-bold">SUBJEK:</span> {activeMail.subject}
              </p>
              <p className="text-slate-500 text-[10px]">Diterima: {activeMail.date}</p>
            </div>
            <div className="flex-1 whitespace-pre-wrap text-slate-300 leading-relaxed text-xs overflow-auto pr-1">
              {activeMail.body}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2.5 py-12">
            <p className="text-xs">Silakan pilih surel untuk dianalisis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
