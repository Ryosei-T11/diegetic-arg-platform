import React, { useState, useEffect, useRef } from 'react';

// =========================================================================
// 1. LOGIKA INTI & UTILITAS KRIPTOGRAFI
// =========================================================================

const caesarDecrypt = (str, shift) => {
  return str.toUpperCase().split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) { // A - Z
      return String.fromCharCode(((code - 65 - shift + 26 * 2) % 26) + 65);
    }
    return char;
  }).join('');
};

const base64Decode = (str) => {
  try {
    return atob(str);
  } catch (e) {
    return 'FORMAT_INVALID';
  }
};

const INITIAL_EMAILS = [
  {
    id: 'mail-1',
    sender: 'system@aether-os.net',
    subject: '[PENTING] Protokol Mati Darurat (Dead Man Switch)',
    date: '12 Juni 2026',
    body: `Sistem mendeteksi protokol mati darurat (Dead Man Switch) diaktifkan oleh pengguna: Andra Kirana.\n\nAkun Anda telah didelegasikan sebagai kontak tepercaya untuk memulihkan enkripsi drive luar miliknya.\n\nAndra meninggalkan sebuah berkas di desktop bernama 'jurnal_andra.txt' yang terenkripsi. Dia menulis catatan berikut:\n"Kunci untuk membaca draf jurnal ini adalah tanggal hari jadi anjing kesayanganku, Riko, dengan pergeseran mundur (Caesar Cipher) sebanyak tanggal tersebut."`,
    read: false,
  },
  {
    id: 'mail-2',
    sender: 'whistleblower99@proton.me',
    subject: 'Mereka mengawasimu. Jangan percaya siapapun.',
    date: '14 Juni 2026',
    body: `Halo rekan,\n\nJika kamu membaca surel enkripsi otomatis ini, berarti Andra benar-benar telah 'dihilangkan' oleh tim penertiban Apex Corp. Dia menemukan sesuatu yang sangat mengerikan di server riset genetika rahasia mereka.\n\nSatu-satunya petunjuk untuk membongkar gerbang keamanan Apex Corp ada di forum gelap (konspirasi-forum.id). Cari thread tentang "Apex Project Genesis". Salah satu informan kami menyelipkan sebuah kode Base64 penting di dalam utas diskusi tersebut.\n\nJangan gunakan peramban (browser) biasa di luar sistem AetherOS. Mereka menyadap jaringan publik.\n\n- W99`,
    read: false,
  }
];

// =========================================================================
// 2. AUDIO WEB API RETRO SYNTHESIZER
// =========================================================================

const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'beep') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.setValueAtTime(780, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(1040, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.38);
    } else if (type === 'keystroke') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 + Math.random() * 150, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (e) {
    // Diabaikan jika browser melarang autoplay
  }
};

// =========================================================================
// 3. KOMPONEN UI DIEDETIK UTAMA
// =========================================================================

function Window({ id, title, x, y, w, h, zIndex, isActive, onClose, onMinimize, onFocus, onDragStart, children }) {
  return (
    <div
      onClick={onFocus}
      className={`absolute rounded-xl border flex flex-col overflow-hidden shadow-2xl backdrop-blur-md transition-shadow duration-150 ${
        isActive 
          ? 'border-emerald-500/50 shadow-emerald-500/5 bg-slate-900/95' 
          : 'border-slate-700/60 shadow-black/50 bg-slate-950/90'
      }`}
      style={{ left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, zIndex: zIndex }}
    >
      <div
        onPointerDown={onDragStart}
        className={`h-10 px-4 flex items-center justify-between cursor-move select-none border-b ${
          isActive ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 text-emerald-200 border-emerald-900/40' : 'bg-slate-950 text-slate-500 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></span>
          <span className="text-xs font-mono font-bold tracking-wide">{title}</span>
        </div>
        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={onMinimize} className="w-6 h-6 flex items-center justify-center rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
            </svg>
          </button>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-md bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  );
}

function Terminal({ history, onSubmitCommand, currentInput, onInputChange, bottomRef, playSound }) {
  return (
    <div className="h-full flex flex-col bg-slate-950 font-mono text-xs p-3 rounded-lg border border-slate-800 text-emerald-400">
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

          return <div key={idx} className={`${textClass} whitespace-pre-wrap leading-relaxed`}>{item.text}</div>;
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSubmitCommand(); }} className="flex items-center border-t border-slate-800/80 pt-2.5">
        <span className="text-blue-400 font-bold mr-2.5">User@AetherOS:~$</span>
        <input
          type="text"
          value={currentInput}
          onChange={(e) => { if (playSound) playSound('keystroke'); onInputChange(e.target.value); }}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-emerald-400 caret-emerald-400 font-mono text-xs p-0"
          autoFocus
          placeholder='Ketik perintah forensik di sini...'
        />
      </form>
    </div>
  );
}

function EmailClient({ emails, activeEmailId, onSelectEmail, playSound }) {
  const activeMail = emails.find(m => m.id === activeEmailId);

  return (
    <div className="h-full flex gap-4 text-xs font-mono">
      <div className="w-1/3 border-r border-slate-800/80 pr-3.5 flex flex-col gap-2 overflow-auto">
        <span className="text-slate-500 font-bold tracking-wider text-[10px] uppercase border-b border-slate-800/80 pb-2">Kotak Masuk</span>
        {emails.map((mail) => (
          <div 
            key={mail.id}
            onClick={() => { if (playSound) playSound('click'); onSelectEmail(mail.id); }}
            className={`p-3 rounded-lg cursor-pointer border transition-all duration-200 ${
              mail.id === activeEmailId
                ? 'bg-emerald-950/30 border-emerald-500/50 text-slate-100 shadow-lg shadow-emerald-900/10'
                : mail.read ? 'bg-slate-950/40 border-slate-800 text-slate-500 hover:bg-slate-900/60' : 'bg-emerald-950/15 border-emerald-900/40 text-slate-200 font-bold hover:bg-emerald-950/25 animate-pulse'
            }`}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-extrabold text-emerald-400 truncate max-w-[110px]">{mail.sender.split('@')[0]}</span>
              <span className="text-[9px] text-slate-500">{mail.date}</span>
            </div>
            <p className="truncate text-slate-300 font-semibold">{mail.subject}</p>
          </div>
        ))}
      </div>
      <div className="flex-1 bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 flex flex-col select-text">
        {activeMail ? (
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="border-b border-slate-800/80 pb-3 space-y-1">
              <p className="text-slate-400"><span className="text-emerald-500 font-bold">DARI:</span> {activeMail.sender}</p>
              <p className="text-slate-300"><span className="text-emerald-500 font-bold">SUBJEK:</span> {activeMail.subject}</p>
              <p className="text-slate-500 text-[10px]">Diterima: {activeMail.date}</p>
            </div>
            <div className="flex-1 whitespace-pre-wrap text-slate-300 leading-relaxed text-xs overflow-auto pr-1">{activeMail.body}</div>
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

// =========================================================================
// 4. MOCK INTERNET WEBSITES & BROWSER COMPONENTS
// =========================================================================

function KorbanBlog({ gameState, onUnlockJournal, playSound, onNavigate }) {
  const [blogPassInput, setBlogPassInput] = useState('');

  return (
    <div className="space-y-6 max-w-2xl mx-auto font-sans text-xs">
      <div className="border-b border-emerald-900/40 pb-4">
        <h1 className="text-2xl font-black font-mono text-emerald-400 tracking-tight">KIRANA CHRONICLES</h1>
        <p className="text-slate-400 text-xs mt-1">Wadah pemikiran pribadi Andra Kirana bebas sensor internal.</p>
      </div>
      <article className="p-4 bg-slate-900/50 rounded-lg border border-slate-800/80 space-y-2">
        <div className="flex justify-between text-slate-500 font-mono text-[10px]">
          <span className="font-bold text-emerald-500">UTAS #041</span>
          <span>Diterbitkan: 04 April 2026</span>
        </div>
        <h2 className="text-sm font-bold text-slate-100 font-mono">Ulang Tahun si Riko! 🐶</h2>
        <p className="text-slate-300 leading-relaxed">
          Hari ini genap dua tahun aku mengadopsi Riko dari shelter penyelamatan hewan liar. Anjing golden retriever terlucu dan paling hyperaktif sedunia!
          Aku mencatat tanggal resmi kedatangannya di kamarku: <span className="text-emerald-400 font-bold font-mono bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-900/30">19 Juni 2024</span>.
        </p>
      </article>

      <article className="p-4 bg-slate-900/50 rounded-lg border border-slate-800/80 space-y-2">
        <div className="flex justify-between text-slate-500 font-mono text-[10px]">
          <span className="font-bold text-emerald-500">UTAS #042</span>
          <span>Diterbitkan: 10 Mei 2026</span>
        </div>
        <h2 className="text-sm font-bold text-slate-100 font-mono">Ada yang tidak beres dengan "Project Genesis"</h2>
        <p className="text-slate-300 leading-relaxed">
          Aku mengunci jurnal forensik rapiku di komputer kerja (di dalam desktop dengan nama berkas <code className="bg-slate-950 px-1 py-0.5 text-yellow-400 rounded">jurnal_andra.txt</code>).
          Sandi draf terenkripsinya menggunakan <span className="text-yellow-400">hobi favorit anjingku, Riko</span> (format huruf kapital dipisah garis bawah, misal: <code className="text-emerald-400 font-mono">ANDRA_BERMAIN_BOLA</code>).
          Kunci geser mundurnya (offset) adalah <span className="text-emerald-300 font-bold">tanggal hari jadi Riko</span>.
        </p>
      </article>

      <article className="p-4 bg-slate-900/30 rounded-lg border border-red-950/40 space-y-3">
        <div className="flex justify-between text-red-500 text-[10px] font-mono font-bold uppercase">
          <span>UTAS #043 [DIAMANKAN]</span>
          <span>Status: Terenkripsi</span>
        </div>
        {!gameState.unlockedAndraJournal ? (
          <div className="py-4 text-center">
            <span className="text-red-400 block mb-1.5 font-bold">🔒 Draf Terkunci Enkripsi Lanjut</span>
            <div className="flex justify-center gap-2 max-w-sm mx-auto mt-2">
              <input 
                type="text" 
                placeholder="TEKS_DEKRIPSI_ASLI"
                value={blogPassInput}
                onChange={(e) => setBlogPassInput(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 font-mono text-center text-xs flex-1 uppercase text-emerald-400 focus:outline-none"
              />
              <button 
                onClick={() => {
                  if (blogPassInput.trim().toUpperCase() === 'ANDRA_BERMAIN_BOLA') {
                    onUnlockJournal();
                    if (playSound) playSound('success');
                  } else {
                    if (playSound) playSound('error');
                    alert('Kata kunci dekripsi salah!');
                  }
                }}
                className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/40 rounded-md px-4 py-1.5 font-mono font-bold"
              >
                Buka
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-emerald-400 font-mono">🔓 Berkas Rahasia: Akses Server Korporat</h2>
            <p className="text-slate-300 leading-relaxed">
              Aku telah menyelundupkan bypass gerbang utama ke dalam forum anonim <code className="text-purple-400 underline cursor-pointer" onClick={() => onNavigate('konspirasi-forum.id')}>konspirasi-forum.id</code> menggunakan akun samaran <span className="font-bold text-yellow-400">"ShadowPuppet"</span>. Pecahkan kode Base64 penting di sana, lalu retas panel administrator mereka di <code className="text-blue-400 underline" onClick={() => onNavigate('apex-corp.org/admin')}>apex-corp.org/admin</code>!
            </p>
          </div>
        )}
      </article>
    </div>
  );
}

function ForumHome({ playSound, onNavigate }) {
  const [forumComment, setForumComment] = useState('');
  const [forumThreads, setForumThreads] = useState([
    {
      id: 'thread-1',
      author: 'AsepConspiracy',
      content: 'Apex Corp mengklaim mereka membuat vaksin flu terbaru. Tapi bibi tetanggaku kerja di sana, dia bilang laboratorium bawah tanah mereka ditutup sangat rapat!'
    }
  ]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-mono text-xs">
      <div className="border-b border-purple-900/50 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-purple-400 tracking-wider">NETWATCHERS v0.8b</h1>
          <p className="text-slate-500 text-[10px] mt-0.5">Jalur Komunikasi Rahasia Hacker & Whistleblower Indonesia</p>
        </div>
      </div>

      <div className="p-4 bg-slate-900/60 rounded-xl border border-purple-950/60 space-y-3.5">
        <h2 className="text-sm font-bold text-slate-100">KASUS DETEKTIF: HILANGNYA ENGINEER APEX CORP SECARA TIBA-TIBA</h2>
        <div className="pl-4 border-l-2 border-purple-900 space-y-4 bg-slate-950/50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span className="font-extrabold text-emerald-400">ShadowPuppet (Andra Kirana) 🌟</span>
              <span>13 Juni 2026</span>
            </div>
            <p className="text-emerald-300 font-bold">Gunakan dekripsi Base64 di Terminal atau SolverSandi untuk memecahkan bypass administrator ini:</p>
            <div className="p-4 bg-slate-950 text-center rounded-lg border border-purple-900/50 select-all font-mono font-bold text-sm tracking-wider text-purple-300 my-2">
              QVBFWF9HRU5FU0lTXzIwMjY=
            </div>
            <p className="text-slate-300">Hasil dekripsi adalah kunci bypass di <code className="text-blue-400 underline cursor-pointer" onClick={() => onNavigate('apex-corp.org/admin')}>apex-corp.org/admin</code>!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MegaCorpSitus({ url, gameState, onHackMegaCorp, playSound, onNavigate, onOpenWindow }) {
  const [megaCorpPassword, setMegaCorpPassword] = useState('');
  const [megaCorpError, setMegaCorpError] = useState('');

  return (
    <div className="space-y-6 max-w-2xl mx-auto font-sans text-xs">
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800/80 flex justify-between items-center shadow-lg">
        <div>
          <span className="text-[9px] tracking-widest text-blue-500 font-mono font-bold uppercase block mb-1">Apex Biotech Corporation</span>
          <h1 className="text-2xl font-black text-slate-100 font-mono tracking-tight">APEX CORP</h1>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-800/80 pb-2 font-mono text-[11px]">
        <span className={`cursor-pointer ${url === 'apex-corp.org' ? 'text-blue-400 font-bold border-b-2 border-blue-400 pb-2' : 'text-slate-500'}`} onClick={() => onNavigate('apex-corp.org')}>Portal Utama</span>
        <span className={`cursor-pointer ${url === 'apex-corp.org/admin' ? 'text-blue-400 font-bold border-b-2 border-blue-400 pb-2' : 'text-slate-500'}`} onClick={() => onNavigate('apex-corp.org/admin')}>Portal Admin</span>
      </div>

      {url === 'apex-corp.org/admin' && (
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-slate-900 p-6 rounded-xl border border-blue-900/40 space-y-4 shadow-xl">
            {!gameState.hackedMegaCorp ? (
              <div className="space-y-3.5">
                <input 
                  type="password"
                  value={megaCorpPassword}
                  onChange={(e) => setMegaCorpPassword(e.target.value)}
                  placeholder="KATA SANDI DEKRIPSI"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 font-mono text-center text-emerald-400 focus:outline-none"
                />
                {megaCorpError && <p className="text-rose-500 text-center font-mono text-[10px] font-bold">{megaCorpError}</p>}
                <button 
                  onClick={() => {
                    if (megaCorpPassword.trim().toUpperCase() === 'APEX_GENESIS_2026') {
                      onHackMegaCorp();
                      if (playSound) playSound('success');
                    } else {
                      if (playSound) playSound('error');
                      setMegaCorpError('KODE AUTENTIKASI TIDAK VALID!');
                    }
                  }}
                  className="w-full bg-blue-950 hover:bg-blue-900 text-blue-400 hover:text-white border border-blue-800/30 font-bold py-2.5 rounded-md text-xs font-mono"
                >
                  VALIDASI KUNCI ADMIN
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-emerald-400 font-mono text-xs font-bold text-center">🔓 SISTEM TERRETAS!</div>
                <button 
                  onClick={() => onOpenWindow('victory', 'BUKTI_TERKUMPUL.TXT', 520, 390)}
                  className="w-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 py-2 rounded font-mono font-bold"
                >
                  Buka & Kirim Bukti
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Browser({ url, onNavigate, history, historyIndex, onBack, onForward, gameState, onUnlockJournal, onHackMegaCorp, onOpenWindow, playSound }) {
  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden text-xs">
      <div className="bg-slate-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center gap-3">
        <div className="flex gap-1.5">
          <button onClick={onBack} disabled={historyIndex === 0} className="w-7 h-7 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-30 flex items-center justify-center text-slate-300">◀</button>
          <button onClick={onForward} disabled={historyIndex === history.length - 1} className="w-7 h-7 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-30 flex items-center justify-center text-slate-300">▶</button>
        </div>
        <div className="flex-1 bg-slate-900 rounded-lg px-3 py-1 flex items-center border border-slate-800">
          <span className="text-emerald-500 font-mono text-[10px] font-bold">HTTP://</span>
          <input type="text" value={url} onChange={(e) => onNavigate(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-mono text-slate-200 focus:ring-0 p-0" />
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-slate-950 p-6">
        {url === 'andra-journal.net' && <KorbanBlog gameState={gameState} onUnlockJournal={onUnlockJournal} playSound={playSound} onNavigate={onNavigate} />}
        {url === 'konspirasi-forum.id' && <ForumHome playSound={playSound} onNavigate={onNavigate} />}
        {url.startsWith('apex-corp.org') && <MegaCorpSitus url={url} gameState={gameState} onHackMegaCorp={onHackMegaCorp} playSound={playSound} onNavigate={onNavigate} onOpenWindow={onOpenWindow} />}
      </div>
    </div>
  );
}

function CryptoTool({ caesarInput, onCaesarInputChange, caesarShift, onCaesarShiftChange, caesarOutput, base64Input, onBase64InputChange, base64Output, onVerifySecret }) {
  return (
    <div className="h-full flex flex-col gap-4 text-xs font-mono">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <h3 className="text-rose-400 font-bold border-b border-slate-900 pb-1.5 mb-3">SOLVER: CAESAR CIPHER</h3>
          <input type="text" value={caesarInput} onChange={(e) => onCaesarInputChange(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-2 text-slate-100" />
          <input type="range" min="0" max="25" value={caesarShift} onChange={(e) => onCaesarShiftChange(parseInt(e.target.value))} className="w-full mt-2" />
          <div className="text-center text-emerald-400 font-bold mt-2">Hasil: {caesarOutput}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <h3 className="text-blue-400 font-bold border-b border-slate-900 pb-1.5 mb-3">SOLVER: BASE64 DECODER</h3>
          <input type="text" value={base64Input} onChange={(e) => onBase64InputChange(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-2 text-slate-100" />
          <div className="text-center text-emerald-400 font-bold mt-4">Hasil: {base64Output}</div>
        </div>
      </div>
      <button onClick={onVerifySecret} className="w-full py-2 bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-900/50 rounded-md font-bold">Verifikasi Kunci</button>
    </div>
  );
}

// =========================================================================
// 5. APLIKASI UTAMA (Default Export)
// =========================================================================

export default function App() {
  const [windows, setWindows] = useState([{ id: 'readme', title: 'README.txt', x: 60, y: 80, w: 520, h: 390, zIndex: 10, minimized: false, content: 'readme' }]);
  const [activeWindow, setActiveWindow] = useState('readme');
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('arg_game_state_v105');
    return saved ? JSON.parse(saved) : { unlockedAndraJournal: false, unlockedBase64: false, hackedMegaCorp: false, gameCompleted: false };
  });
  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('arg_emails_v105');
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });
  const [activeEmailId, setActiveEmailId] = useState('mail-1');
  const [terminalHistory, setTerminalHistory] = useState([
    { text: 'AETHER FORENSIC OS [Version 1.05.90]', type: 'system' },
    { text: 'Ketik "help" untuk melihat daftar instruksi siber.', type: 'system' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef(null);
  const [browserUrl, setBrowserUrl] = useState('andra-journal.net');
  const [browserHistory, setBrowserHistory] = useState(['andra-journal.net']);
  const [browserHistoryIndex, setBrowserHistoryIndex] = useState(0);
  const [caesarInput, setCaesarInput] = useState('XGTMGF_XGTSKTM_RSTF');
  const [caesarShift, setCaesarShift] = useState(7);
  const [caesarOutput, setCaesarOutput] = useState('');
  const [base64Input, setBase64Input] = useState('QVBFWF9HRU5FU0lTXzIwMjY=');
  const [base64Output, setBase64Output] = useState('');
  const [dragStart, setDragStart] = useState(null);
  const [draggingWinId, setDraggingWinId] = useState(null);

  useEffect(() => { localStorage.setItem('arg_game_state_v105', JSON.stringify(gameState)); }, [gameState]);
  useEffect(() => { localStorage.setItem('arg_emails_v105', JSON.stringify(emails)); }, [emails]);
  useEffect(() => { setCaesarOutput(caesarDecrypt(caesarInput.toUpperCase(), caesarShift)); }, [caesarInput, caesarShift]);
  useEffect(() => { setBase64Output(base64Decode(base64Input)); }, [base64Input]);

  const openWindow = (id, title, wWidth = 600, wHeight = 440) => {
    const exists = windows.find(w => w.id === id);
    const nextZ = getHighestZ() + 1;
    if (exists) {
      setWindows(windows.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w));
      setActiveWindow(id);
    } else {
      const offset = (windows.length * 28) % 180;
      setWindows([...windows, { id, title, x: 100 + offset, y: 100 + offset, w: wWidth, h: wHeight, zIndex: nextZ, minimized: false, content: id }]);
      setActiveWindow(id);
    }
  };

  const getHighestZ = () => windows.length === 0 ? 0 : Math.max(...windows.map(w => w.zIndex || 0));

  const handleDragStart = (e, winId) => {
    const win = windows.find(w => w.id === winId);
    if (!win) return;
    setDragStart({ startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y });
    setDraggingWinId(winId);
  };

  const handlePointerMove = (e) => {
    if (!dragStart || !draggingWinId) return;
    const dx = e.clientX - dragStart.startX;
    const dy = e.clientY - dragStart.startY;
    setWindows(windows.map(w => w.id === draggingWinId ? { ...w, x: Math.max(0, dragStart.winX + dx), y: Math.max(0, dragStart.winY + dy) } : w));
  };

  return (
    <div className="relative w-screen h-screen bg-[#070b13] overflow-hidden select-none" onPointerMove={handlePointerMove} onPointerUp={() => { setDragStart(null); setDraggingWinId(null); }}>
      <main className="absolute inset-0 pt-16 pb-16 px-6 flex flex-col gap-5 items-start content-start flex-wrap z-10">
        <button onDoubleClick={() => openWindow('readme', 'README.txt', 520, 390)} className="w-20 text-center">
          <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 mx-auto">📔</div>
          <span className="text-[11px] font-mono text-amber-200 block mt-1">README.txt</span>
        </button>
        <button onDoubleClick={() => openWindow('browser', 'Web Browser', 860, 560)} className="w-20 text-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mx-auto">🌐</div>
          <span className="text-[11px] font-mono text-blue-200 block mt-1">Browser.sys</span>
        </button>
        <button onDoubleClick={() => openWindow('cryptotool', 'Solver Sandi', 600, 430)} className="w-20 text-center">
          <div className="w-12 h-12 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-400 mx-auto">🔑</div>
          <span className="text-[11px] font-mono text-rose-200 block mt-1">SolverSandi</span>
        </button>
      </main>

      {windows.map((win) => {
        if (win.minimized) return null;
        return (
          <Window key={win.id} id={win.id} title={win.title} x={win.x} y={win.y} w={win.w} h={win.h} zIndex={win.zIndex} isActive={activeWindow === win.id} onClose={() => setWindows(windows.filter(w => w.id !== win.id))} onMinimize={() => setWindows(windows.map(w => w.id === win.id ? { ...w, minimized: true } : w))} onFocus={() => setActiveWindow(win.id)} onDragStart={(e) => handleDragStart(e, win.id)}>
            {win.content === 'readme' && <div className="font-mono text-xs">Petunjuk: Cari tanggal jadi peliharaan Riko di andra-journal.net lalu lakukan dekripsi jurnal Andra menggunakan SolverSandi.</div>}
            {win.content === 'browser' && <Browser url={browserUrl} onNavigate={setBrowserUrl} history={browserHistory} historyIndex={browserHistoryIndex} onBack={() => {}} onForward={() => {}} gameState={gameState} onUnlockJournal={() => setGameState(prev => ({ ...prev, unlockedAndraJournal: true }))} onHackMegaCorp={() => setGameState(prev => ({ ...prev, hackedMegaCorp: true }))} onOpenWindow={openWindow} />}
            {win.content === 'cryptotool' && <CryptoTool caesarInput={caesarInput} onCaesarInputChange={setCaesarInput} caesarShift={caesarShift} onCaesarShiftChange={setCaesarShift} caesarOutput={caesarOutput} base64Input={base64Input} onBase64InputChange={setBase64Input} base64Output={base64Output} onVerifySecret={() => {}} />}
          </Window>
        );
      })}
    </div>
  );
}
