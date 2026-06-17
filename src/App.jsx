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

// Database Sistem Berkas Lokal Simulasi (Virtual File System)
const FILE_SYSTEM = {
  'root': {
    id: 'root',
    name: 'Sistem Drive C:',
    type: 'dir',
    children: ['folder-pribadi', 'folder-forensik']
  },
  'folder-pribadi': {
    id: 'folder-pribadi',
    name: 'Dokumen Pribadi',
    type: 'dir',
    parent: 'root',
    children: ['file-jurnal', 'file-kontak']
  },
  'folder-forensik': {
    id: 'folder-forensik',
    name: 'Hasil Forensik Lab',
    type: 'dir',
    parent: 'root',
    children: ['img-denah', 'img-rontgen']
  },
  'file-jurnal': {
    id: 'file-jurnal',
    name: 'jurnal_andra.txt',
    type: 'file',
    parent: 'folder-pribadi',
    content: 'XGTMGF_XGTSKTM_RSTF\n\nCatatan Tambahan:\nHobi favorit Riko adalah bermain bola tenis di taman belakang. Jika aku menghilang, pastikan sandi ini di-decrypt di SolverSandi dengan pergeseran tanggal jadian Riko.'
  },
  'file-kontak': {
    id: 'file-kontak',
    name: 'kontak_darurat.csv',
    type: 'file',
    parent: 'folder-pribadi',
    content: 'Nama,Hubungan,Kontak\nAndra Kirana,Korban Penculikan,andra@apex-corp.org\nRiko,Anjing Golden Retriever,Adopsi: 19 Juni 2024\nWhistleblower99,Kontak Gelap,whistleblower99@proton.me'
  },
  'img-denah': {
    id: 'img-denah',
    name: 'denah_apex_corp.png',
    type: 'img',
    parent: 'folder-forensik',
    imgType: 'blueprint'
  },
  'img-rontgen': {
    id: 'img-rontgen',
    name: 'foto_rontgen_lab.png',
    type: 'img',
    parent: 'folder-forensik',
    imgType: 'rontgen'
  }
};

// Database Hasil Pencarian Fiktif Dinamis (AetherSearch Index Database)
const SEARCH_DATABASE = [
  {
    id: 'search-1',
    title: '🔴 INVESTIGASI: Kebocoran Dokumen Uji Klinis Ilegal Sektor S2 Apex Corp',
    url: 'konspirasi-forum.id',
    snippet: 'Beberapa informan independen membocorkan manipulasi data klinis bersandi "Genesis" yang diduga memicu mutasi genetik berbahaya. Whistleblower Andra Kirana mengklaim memiliki bukti forensik blueprint bypass di forum NetWatchers...',
    keywords: ['apex', 'apex corp', 'skandal', 'genetika', 'genesis', 'uji coba', 'sektor s2', 'ilegal']
  },
  {
    id: 'search-2',
    title: '👤 Profil Dr. Jonathan Vance: Kebangkitan Raksasa Biomedis & Rumor Sandi Database',
    url: 'andra-journal.net',
    snippet: 'Jonathan Vance (CEO Apex Corp) dikenal sebagai figur penyelamat medis. Namun, peretas siber mengklaim menemukan tanda tangan digital MD5 hash rahasia miliknya yang mengunci gerbang administratif utama: eb823528b17b6ab86ba11b6b55979c53...',
    keywords: ['jonathan', 'vance', 'rumor', 'ceo', 'hash', 'sandi', 'database', 'administrator']
  },
  {
    id: 'search-3',
    title: '🔍 Misteri Keberadaan Andra Kirana: Hilang Secara Tiba-tiba Pasca Kebocoran Data',
    url: 'konspirasi-forum.id',
    snippet: 'Pihak berwajib terkesan mengulur waktu untuk mengusut kasus hilangnya Andra Kirana. Sahabat terdekatnya menyatakan bahwa Andra mengunci berkas investigasinya menggunakan teka-teki nama hobi dan hari jadi anjing peliharaannya...',
    keywords: ['andra', 'kirana', 'hilang', 'penculikan', 'anjing', 'riko']
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
// 3. KOMPONEN ELEMEN JENDELA OS (DRAGGABLE & ACTIVE)
// =========================================================================

function Window({ 
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

// =========================================================================
// 4. SUB-KOMPONEN APLIKASI UTAMA
// =========================================================================

// A. TERMINAL FORENSIK COMMAND-LINE
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

          return (
            <div key={idx} className={`${textClass} whitespace-pre-wrap leading-relaxed`}>
              {item.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

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
          placeholder='Ketik perintah forensik di sini... (atau "help")'
        />
      </form>
    </div>
  );
}

// B. CLIENT EMAIL KOORDINASI
function EmailClient({ emails, activeEmailId, onSelectEmail, playSound }) {
  const activeMail = emails.find(m => m.id === activeEmailId);

  return (
    <div className="h-full flex gap-4 text-xs font-mono">
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

// C. SOLVER SANDI & PENGURAI BASE64
function CryptoTool({ 
  caesarInput, 
  onCaesarInputChange, 
  caesarShift, 
  onCaesarShiftChange, 
  caesarOutput, 
  base64Input, 
  onBase64InputChange, 
  base64Output, 
  onVerifySecret 
}) {
  return (
    <div className="h-full flex flex-col gap-4 text-xs font-mono">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-rose-400 font-bold border-b border-slate-900 pb-1.5 mb-3 flex justify-between">
              <span>SOLVER: CAESAR CIPHER</span>
              <span className="text-[9px] text-slate-500">Geser Alfabet</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Teks Sandi:</label>
                <input 
                  type="text" 
                  value={caesarInput}
                  onChange={(e) => onCaesarInputChange(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-100 focus:outline-none focus:border-rose-500/40"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Pergeseran Mundur: {caesarShift}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="25" 
                  value={caesarShift}
                  onChange={(e) => onCaesarShiftChange(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="p-3 bg-slate-900 rounded-lg border border-rose-950/40 text-center mt-4">
            <span className="block text-slate-500 text-[9px] mb-1">HASIL DEKRIPSI:</span>
            <span className="text-emerald-400 font-bold text-sm tracking-widest block font-mono">
              {caesarOutput || '---'}
            </span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-blue-400 font-bold border-b border-slate-900 pb-1.5 mb-3 flex justify-between">
              <span>SOLVER: BASE64 DECODER</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 text-[10px] mb-1">String Terkompresi (Base64):</label>
                <input 
                  type="text" 
                  value={base64Input}
                  onChange={(e) => onBase64InputChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-100 focus:outline-none focus:border-blue-500/40"
                />
              </div>
            </div>
          </div>
          <div className="p-3 bg-slate-900 rounded-lg border border-blue-950/40 text-center mt-4">
            <span className="block text-slate-500 text-[9px] mb-1">HASIL DEKRIPSI:</span>
            <span className="text-emerald-400 font-bold text-sm tracking-widest block font-mono">
              {base64Output || '---'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
        <span className="text-slate-400">Klik verifikasi jika Anda yakin hasil pergeseran bernilai valid:</span>
        <button 
          onClick={onVerifySecret}
          className="px-4 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-900/50 rounded-md font-bold transition-colors"
        >
          Verifikasi Kunci
        </button>
      </div>
    </div>
  );
}

// D. PENJELAJAH BERKAS VISUAL (FileExplorer.exe)
function FileExplorer({ currentFolderId, onNavigate, onOpenFile, playSound }) {
  const currentFolder = FILE_SYSTEM[currentFolderId];
  const items = currentFolder.children.map(id => FILE_SYSTEM[id]);

  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs select-none">
      {/* Path Breadcrumb */}
      <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentFolder.parent && (
            <button 
              onClick={() => {
                if (playSound) playSound('click');
                onNavigate(currentFolder.parent);
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold"
            >
              ◀ Kembali
            </button>
          )}
          <span className="text-slate-400">Lokasi:</span>
          <span className="text-emerald-400 font-bold">/root/{currentFolderId === 'root' ? '' : currentFolder.name}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-semibold">Total: {items.length} Berkas</span>
      </div>

      {/* Grid List Berkas */}
      <div className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-auto">
        {items.map((item) => {
          let icon = '📄';
          let colorClass = 'text-slate-300 border-slate-900 hover:bg-slate-900/40 hover:border-slate-800';
          
          if (item.type === 'dir') {
            icon = '📁';
            colorClass = 'text-yellow-400 border-slate-900 hover:bg-yellow-950/10 hover:border-yellow-900/20';
          } else if (item.type === 'img') {
            icon = '🖼️';
            colorClass = 'text-blue-400 border-slate-900 hover:bg-blue-950/10 hover:border-blue-900/20';
          } else if (item.type === 'file' && item.name.endsWith('.txt')) {
            icon = '📝';
            colorClass = 'text-emerald-400 border-slate-900 hover:bg-emerald-950/10 hover:border-emerald-900/20';
          }

          return (
            <div
              key={item.id}
              onDoubleClick={() => {
                if (playSound) playSound('beep');
                if (item.type === 'dir') {
                  onNavigate(item.id);
                } else {
                  onOpenFile(item);
                }
              }}
              onClick={() => { if (playSound) playSound('click'); }}
              className={`p-3.5 border rounded-xl flex flex-col items-center text-center gap-2 cursor-pointer transition-all ${colorClass}`}
            >
              <span className="text-3xl">{icon}</span>
              <span className="font-semibold text-[11px] truncate max-w-full leading-tight">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// E. BUKU CATATAN TEKS DENGAN FITUR STABILO (Text Notepad / Editor)
function BukuCatatan({ activeFile, onClose, playSound }) {
  const [highlights, setHighlights] = useState({});

  if (!activeFile) return null;

  // Membagi teks menjadi kata-kata terpisah agar bisa di-stabilo secara interaktif
  const words = activeFile.content.split(/(\s+)/);

  const toggleHighlight = (idx) => {
    if (playSound) playSound('click');
    setHighlights(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs select-text">
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
        <span className="text-emerald-400 font-bold">📝 Penampil Teks: {activeFile.name}</span>
        <span className="text-[10px] text-slate-500">Klik sebuah kata untuk menandai/stabilo siber</span>
      </div>
      <div className="flex-1 p-5 leading-relaxed overflow-auto text-slate-300">
        {words.map((word, idx) => {
          if (word.trim() === '') return word; // Biarkan spasi/baris kosong tetap normal
          const isHighlighted = highlights[idx];
          return (
            <span
              key={idx}
              onClick={() => toggleHighlight(idx)}
              className={`cursor-pointer rounded px-0.5 transition-colors ${
                isHighlighted 
                  ? 'bg-yellow-500/30 text-yellow-200 border-b border-yellow-400 font-bold' 
                  : 'hover:bg-slate-800'
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// F. PENAMPIL GAMBAR FORENSIK DENGAN BLUEPRINT INTERNAL (Image Viewer)
function PenampilGambar({ imgType, onClose }) {
  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs select-none">
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
        <span className="text-blue-400 font-bold">🖼️ Penampil Gambar Forensik</span>
      </div>
      <div className="flex-1 p-4 flex items-center justify-center bg-slate-950 overflow-auto">
        {imgType === 'blueprint' ? (
          /* SVG Blueprint Denah Lab Apex Corp */
          <div className="w-full max-w-md border border-blue-900/40 p-4 bg-slate-950 rounded-xl space-y-3 shadow-2xl">
            <div className="flex justify-between items-center text-[10px] text-blue-500 border-b border-blue-950 pb-2">
              <span>CETAK_BIRU: APEX CORP LAB SYSTEM</span>
              <span>DRAFT_V2.01</span>
            </div>
            <svg viewBox="0 0 400 240" className="w-full h-auto stroke-blue-500 stroke-[1.5] fill-none">
              {/* Ruangan-ruangan Lab */}
              <rect x="10" y="10" width="120" height="90" className="stroke-blue-900" />
              <rect x="130" y="10" width="140" height="90" />
              <rect x="270" y="10" width="120" height="90" className="stroke-blue-900" />
              <rect x="10" y="140" width="180" height="90" />
              <rect x="190" y="140" width="200" height="90" />
              {/* Pintu lab */}
              <path d="M130 50 h 10" className="stroke-rose-500 stroke-2" />
              <path d="M270 50 h 10" className="stroke-rose-500 stroke-2" />
              <path d="M190 180 h 10" className="stroke-emerald-500 stroke-2" />
              {/* Label ruangan */}
              <text x="70" y="60" textAnchor="middle" fill="#3b82f6" fontSize="10" stroke="none">LAB ALPHA</text>
              <text x="200" y="60" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="bold" stroke="none">CORE REACTOR</text>
              <text x="330" y="60" textAnchor="middle" fill="#3b82f6" fontSize="10" stroke="none">LAB BETA</text>
              <text x="100" y="190" textAnchor="middle" fill="#3b82f6" fontSize="10" stroke="none">PENYIMPANAN</text>
              <text x="290" y="195" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold" stroke="none" className="animate-pulse">X-REACTOR CELL</text>
              {/* Teks sandi siber tersembunyi */}
              <text x="20" y="220" fill="#fbbf24" fontSize="10" fontWeight="bold" stroke="none" className="animate-pulse">GATE_X2_OFFSET = 19_SHIFTS</text>
            </svg>
            <div className="p-2.5 bg-blue-950/20 rounded border border-blue-950/40 text-[10px] text-blue-400">
              <strong>LOG TEKNIS:</strong> Sistem mengidentifikasi sinyal anomali pada pintu keamanan X-Reactor. Pergeseran bypass sandi gerbang (Gate X2) disetel sebesar 19 pergeseran mundur.
            </div>
          </div>
        ) : (
          /* SVG Pindaian Rontgen Subjek Andra Kirana */
          <div className="w-full max-w-sm border border-emerald-950/60 p-4 bg-slate-950 rounded-xl space-y-3 shadow-2xl">
            <div className="flex justify-between items-center text-[10px] text-emerald-500 border-b border-emerald-950 pb-2">
              <span>MEDIS: SECURE_XRAY_CORE</span>
              <span>PATIENT_ID: ANDRA_K</span>
            </div>
            <svg viewBox="0 0 300 240" className="w-full h-auto stroke-emerald-500 stroke-[1.5] fill-none">
              {/* Gambar Struktur Tulang Tangan Vektor */}
              <rect x="5" y="5" width="290" height="230" rx="10" className="stroke-emerald-950" />
              <path d="M150 230 C150 180, 140 140, 150 100" className="stroke-emerald-800" />
              <path d="M150 100 C150 80, 130 50, 120 20" />
              <path d="M150 100 C155 80, 145 50, 145 15" />
              <path d="M150 100 C160 85, 165 55, 170 25" />
              <path d="M150 100 C165 90, 180 65, 195 35" />
              <path d="M135 140 C110 135, 95 120, 80 105" />
              {/* Chip fiktif tertanam */}
              <rect x="135" y="115" width="25" height="15" rx="3" fill="#10b981" className="animate-pulse" />
              <text x="138" y="126" fill="#020617" fontSize="8" stroke="none" fontWeight="bold">CHIP</text>
              {/* Garis pemindai sensor */}
              <line x1="10" y1="90" x2="290" y2="90" className="stroke-emerald-400 stroke-[0.8] opacity-60" />
              {/* Data Overlay */}
              <text x="20" y="30" fill="#34d399" fontSize="10" fontWeight="bold" stroke="none">STATUS: SECURED</text>
              <text x="20" y="45" fill="#10b981" fontSize="9" stroke="none">MUTATION_INDEX: 42%</text>
              <text x="20" y="60" fill="#10b981" fontSize="9" stroke="none">LOC: APEX_BASE_S2</text>
            </svg>
            <div className="p-2.5 bg-emerald-950/20 rounded border border-emerald-950/40 text-[10px] text-emerald-400">
              <strong>CATATAN RADIOLOGI:</strong> Ditemukan benda asing berupa transponder pelacak terenkripsi di pergelangan tangan kiri. Memancarkan koordinat fiktif Apex Base S2.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// G. INTERNET SIMULASI: MESIN PENCARI FIKTIF "AETHERSEARCH"
function AetherSearch({ onNavigate, playSound }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (playSound) playSound('click');

    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) {
      setResults([]);
      setSearched(false);
      return;
    }

    // Filter database artikel pencarian berdasarkan kecocokan kata kunci fiktif
    const filtered = SEARCH_DATABASE.filter(item => {
      return item.keywords.some(keyword => cleanQuery.includes(keyword)) ||
             item.title.toLowerCase().includes(cleanQuery) ||
             item.snippet.toLowerCase().includes(cleanQuery);
    });

    setResults(filtered);
    setSearched(true);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto font-mono text-xs text-slate-300">
      {/* Brand Header */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
          ⚡ AETHER_SEARCH
        </h1>
        <p className="text-[10px] text-slate-500">Pusat Indeksasi Kueri & DNS Publik Terenkripsi Jaringan AetherOS</p>
      </div>

      {/* Input Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input 
          type="text"
          placeholder="Ketik kata kunci pencarian (misal: 'Apex Corp', 'Vance', 'Andra Kirana')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500/60"
        />
        <button 
          type="submit"
          className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/40 px-5 rounded-lg font-bold transition-all hover:scale-105"
        >
          Cari
        </button>
      </form>

      {/* Trending Topics (Awal) */}
      {!searched && (
        <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800/60 text-center space-y-2">
          <span className="text-slate-500 text-[9px] uppercase font-bold block">Pencarian Terpopuler Saat Ini:</span>
          <div className="flex justify-center gap-2 flex-wrap">
            {['Apex Corp skandal genetika', 'Jonathan Vance rumor', 'Andra Kirana hilang'].map((kw) => (
              <button 
                key={kw}
                onClick={() => {
                  setQuery(kw);
                  // Trigger search manual
                  setTimeout(() => {
                    const cleanQuery = kw.toLowerCase().trim();
                    const filtered = SEARCH_DATABASE.filter(item => {
                      return item.keywords.some(keyword => cleanQuery.includes(keyword)) ||
                             item.title.toLowerCase().includes(cleanQuery) ||
                             item.snippet.toLowerCase().includes(cleanQuery);
                    });
                    setResults(filtered);
                    setSearched(true);
                  }, 50);
                }}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] text-emerald-400 hover:border-emerald-700 hover:bg-slate-900"
              >
                "{kw}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hasil Kueri */}
      {searched && (
        <div className="space-y-4">
          <div className="text-[10px] text-slate-500 border-b border-slate-900 pb-2 flex justify-between">
            <span>HASIL KUERI UNTUK: "{query}"</span>
            <span>Ditemukan: {results.length} artikel</span>
          </div>

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((item) => (
                <div key={item.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-800/80 hover:border-emerald-900/40 transition-colors space-y-2">
                  <span 
                    onClick={() => onNavigate(item.url)}
                    className="text-sm font-bold text-emerald-400 hover:underline cursor-pointer block"
                  >
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-500 block">HTTP://{item.url}</span>
                  <p className="text-slate-300 leading-relaxed text-[11px] font-sans">{item.snippet}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <span className="text-rose-500 text-2xl block">🕵️‍♂️</span>
              <p className="text-slate-400 font-bold">Kueri Tidak Mengembalikan Data</p>
              <p className="text-slate-500 text-[10px]">Tips: Gunakan kueri fiktif yang umum di dunia AetherOS, seperti "Apex", "Vance", "Andra", atau "Genetika".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// H. INTERNET SIMULASI: SITUS BLOG KORBAN (andra-journal.net)
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
          Riko suka sekali bermain lempar bola tenis di pekarangan. Dia satu-satunya alasanku tetap waras setelah tumpukan lembur gila-gilaan di departemen TI Apex Corp.
        </p>
      </article>

      <article className="p-4 bg-slate-900/50 rounded-lg border border-slate-800/80 space-y-2">
        <div className="flex justify-between text-slate-500 font-mono text-[10px]">
          <span className="font-bold text-emerald-500">UTAS #042</span>
          <span>Diterbitkan: 10 Mei 2026</span>
        </div>
        <h2 className="text-sm font-bold text-slate-100 font-mono">Ada yang tidak beres dengan "Project Genesis"</h2>
        <p className="text-slate-300 leading-relaxed">
          Aku tidak sengaja mengekstrak log kegagalan klinis server pusat. Jumlah mutasi jaringan seluler subjek uji coba disembunyikan dari rilis dewan pers!
          Aku mengunci jurnal forensik rapiku di komputer kerja (di dalam desktop dengan nama berkas <code className="bg-slate-950 px-1 py-0.5 text-yellow-400 rounded">jurnal_andra.txt</code>).
          Sandi draf terenkripsinya menggunakan <span className="text-yellow-400">hobi favorit anjingku, Riko</span> (format huruf kapital dipisah garis bawah, misal: <code className="text-emerald-400 font-mono">ANDRA_BERMAIN_BOLA</code>). 
          Kunci geser mundurnya (offset) adalah <span className="text-emerald-300 font-bold">tanggal hari jadi Riko</span> (yaitu tanggal 19).
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
            <p className="text-slate-400 mb-3.5 max-w-md mx-auto">
              Masukkan hasil teks dekripsi jurnal Andra yang berhasil Anda pecahkan dari berkas desktop (menggunakan dekripsi Caesar di SolverSandi):
            </p>
            <div className="flex justify-center gap-2 max-w-sm mx-auto">
              <input 
                type="text" 
                placeholder="TEKS_DEKRIPSI_ASLI"
                value={blogPassInput}
                onChange={(e) => setBlogPassInput(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 font-mono text-center text-xs flex-1 uppercase text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <button 
                onClick={() => {
                  if (blogPassInput.trim().toUpperCase() === 'ANDRA_BERMAIN_BOLA') {
                    onUnlockJournal();
                    if (playSound) playSound('success');
                  } else {
                    if (playSound) playSound('error');
                    alert('Kata kunci dekripsi salah! Pastikan Anda melakukan decrypt Caesar pada isi jurnal_andra.txt secara teliti.');
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
              Jika kamu berhasil membuka bagian ini, berarti kamu adalah sahabatku yang cerdas. Aku sedang dalam pelarian saat ini. 
              Aku telah menyelundupkan bypass gerbang utama ke dalam forum anonim <code className="text-purple-400 underline cursor-pointer" onClick={() => onNavigate('konspirasi-forum.id')}>konspirasi-forum.id</code> menggunakan akun samaran <span className="font-bold text-yellow-400">"ShadowPuppet"</span>. 
              Aku menyembunyikan sandi autentikasi administrator dalam bentuk string **Base64** di salah satu kolom balasan thread tentang penangkapan diriku. Pecahkan itu, lalu retas panel administrator mereka!
            </p>
          </div>
        )}
      </article>
    </div>
  );
}

// I. INTERNET SIMULASI: FORUM (konspirasi-forum.id)
function ForumHome({ playSound, onNavigate }) {
  const [forumComment, setForumComment] = useState('');
  const [forumThreads, setForumThreads] = useState([
    {
      id: 'thread-1',
      author: 'AsepConspiracy',
      content: 'Apex Corp mengklaim mereka membuat vaksin flu terbaru. Tapi bibi tetanggaku kerja di sana, dia bilang laboratorium bawah tanah mereka ditutup sangat rapat dan dijaga militer bersenjata lengkap! Apa ini aman?'
    }
  ]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-mono text-xs">
      <div className="border-b border-purple-900/50 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-purple-400 tracking-wider">NETWATCHERS v0.8b</h1>
          <p className="text-slate-500 text-[10px] mt-0.5">Jalur Komunikasi Rahasia Hacker & Whistleblower Indonesia</p>
        </div>
        <span className="text-[9px] text-purple-400 font-bold bg-purple-950/30 border border-purple-900/40 px-2 py-1 rounded-md animate-pulse">
          CHANNEL_SECURED_SSL
        </span>
      </div>

      <div className="p-4 bg-slate-900/60 rounded-xl border border-purple-950/60 space-y-3.5">
        <div className="flex justify-between items-center text-slate-500 border-b border-slate-800 pb-2.5">
          <span className="text-purple-400 font-bold">[UTAS ID: #88921]</span>
          <span>Penulis: TruthSeeker99</span>
        </div>
        <h2 className="text-sm font-bold text-slate-100">KASUS DETEKTIF: HILANGNYA ENGINEER APEX CORP SECARA TIBA-TIBA</h2>
        <p className="text-slate-300 text-xs leading-relaxed">
          Adakah hacker di sini yang punya info perihal Andra Kirana? Dia dikabarkan menghilang dari kompleks huniannya minggu kemarin setelah diduga memegang berkas internal rahasia berkode "Genesis". Kepolisian setempat terkesan menunda-nunda investigasi! Ada konspirasi besar?
        </p>
        
        <div className="pl-4 border-l-2 border-purple-900 space-y-4 bg-slate-950/50 p-4 rounded-lg">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span className="font-extrabold text-amber-500">Anonymous_A</span>
              <span>12 Juni 2026</span>
            </div>
            <p className="text-slate-300">Aku melihat tim taktis hitam menjemput paksa seseorang di lobi apartemen Andra tengah malam. Mereka menggunakan van gelap tanpa plat nomor!</p>
          </div>

          <div className="pt-3 border-t border-slate-900 space-y-2">
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span className="font-extrabold text-emerald-400">ShadowPuppet (Andra Kirana) 🌟</span>
              <span>13 Juni 2026</span>
            </div>
            <p className="text-emerald-300 font-bold">
              MEREKA MERETAS SEMUA PERANGKAT SAYA. JANGAN MENCARI KEBERADAAN FISIK SAYA SAAT INI.
              Bagi siapapun yang ditunujuk sebagai kontak pemulihan darurat dariku, gunakan dekripsi Base64 di Terminal atau SolverSandi untuk memecahkan bypass administrator ini:
            </p>
            
            <div className="p-4 bg-slate-950 text-center rounded-lg border border-purple-900/50 select-all font-mono font-bold text-sm tracking-wider text-purple-300 my-2">
              QVBFWF9HRU5FU0lTXzIwMjY=
            </div>
            
            <p className="text-slate-300">
              Hasil dekripsi di atas adalah kunci bypass gerbang utama Apex Corp yang terletak di: <code className="text-blue-400 underline cursor-pointer" onClick={() => onNavigate('apex-corp.org/admin')}>apex-corp.org/admin</code> atau ketik <code className="bg-slate-900 px-1 py-0.5 rounded text-yellow-300">secret-hack [hasil_dekripsi]</code> langsung di Terminal!
            </p>
          </div>

          {forumThreads.map((t, index) => (
            <div key={index} className="pt-3 border-t border-slate-900 space-y-1">
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span className="font-bold text-purple-400">{t.author}</span>
                <span>Hari Ini</span>
              </div>
              <p className="text-slate-300">{t.content}</p>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-800">
          <p className="text-slate-500 mb-1.5 text-[10px] uppercase font-bold">Balas Utas Ini secara Anonim:</p>
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="Tulis opini konspirasimu di sini..."
              value={forumComment}
              onChange={(e) => setForumComment(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-600"
            />
            <button
              onClick={() => {
                if (!forumComment.trim()) return;
                if (playSound) playSound('click');
                setForumThreads([...forumThreads, {
                  id: `custom-${Date.now()}`,
                  author: 'HackerSiber99',
                  content: forumComment
                }]);
                setForumComment('');
              }}
              className="bg-purple-950 hover:bg-purple-900 text-purple-300 hover:text-white border border-purple-900/50 rounded-md px-4 py-1 font-bold"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// J. INTERNET SIMULASI: SITUS MEGACORP (apex-corp.org)
function MegaCorpSitus({ url, gameState, onHackMegaCorp, playSound, onNavigate, onOpenWindow }) {
  const [megaCorpPassword, setMegaCorpPassword] = useState('');
  const [megaCorpError, setMegaCorpError] = useState('');

  return (
    <div className="space-y-6 max-w-2xl mx-auto font-sans text-xs">
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800/80 flex justify-between items-center shadow-lg">
        <div>
          <span className="text-[9px] tracking-widest text-blue-500 font-mono font-bold uppercase block mb-1">Apex Biotech Corporation</span>
          <h1 className="text-2xl font-black text-slate-100 font-mono tracking-tight">APEX CORP</h1>
          <p className="text-slate-400 text-xs mt-1">"Merekayasa Terapi Genetik & Ekosistem Biomedis Hari Esok."</p>
        </div>
        <div className="w-16 h-16 bg-blue-500/10 rounded-full border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-2xl font-mono">
          Λ
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-800/80 pb-2 font-mono text-[11px]">
        <span className={`cursor-pointer ${url === 'apex-corp.org' ? 'text-blue-400 font-bold border-b-2 border-blue-400 pb-2' : 'text-slate-500'}`} onClick={() => onNavigate('apex-corp.org')}>Portal Utama</span>
        <span className={`cursor-pointer ${url === 'apex-corp.org/about' ? 'text-blue-400 font-bold border-b-2 border-blue-400 pb-2' : 'text-slate-500'}`} onClick={() => onNavigate('apex-corp.org/about')}>Tentang Kami</span>
        <span className={`cursor-pointer ${url === 'apex-corp.org/admin' ? 'text-blue-400 font-bold border-b-2 border-blue-400 pb-2' : 'text-slate-500'}`} onClick={() => onNavigate('apex-corp.org/admin')}>Portal Admin</span>
      </div>

      {url === 'apex-corp.org' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-800/80 space-y-2">
            <h3 className="font-bold text-blue-400 font-mono text-xs">Vaksinasi Sel Pintar</h3>
            <p className="text-slate-400 leading-relaxed">
              Mengembangkan serum pertahanan sel darah otomatis yang telah dipatenkan secara global untuk melawan mutasi virus masa depan.
            </p>
          </div>
          <div className="p-4 bg-slate-900/30 rounded-lg border border-slate-800/80 space-y-2">
            <h3 className="font-bold text-blue-400 font-mono text-xs">Pernyataan Dewan Direksi</h3>
            <p className="text-slate-400 leading-relaxed">
              "Kami mengutamakan etika riset medis serta transparansi publik pada seluruh ekosistem Apex Corp." — Dr. Jonathan Vance, CEO.
            </p>
          </div>
        </div>
      )}

      {url === 'apex-corp.org/about' && (
        <div className="bg-slate-900/40 p-5 rounded-lg border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-blue-400 font-mono">Profil Komitmen & Etika Biomedis</h2>
          <p className="text-slate-300 leading-relaxed">
            Sejak didirikan pada tahun 2008, Apex Corporation berkomitmen melahirkan inovasi terapetik terdepan. Seluruh uji klinis hewan maupun manusia diklaim telah melalui evaluasi komite etik internasional secara sukarela.
          </p>
        </div>
      )}

      {url === 'apex-corp.org/admin' && (
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-slate-900 p-6 rounded-xl border border-blue-900/40 space-y-4 shadow-xl">
            <div className="text-center border-b border-slate-800/80 pb-4">
              <span className="text-rose-500 font-bold font-mono text-[9px] tracking-widest block mb-1">APEX SECURE CORE SYSTEM</span>
              <h2 className="text-lg font-bold font-mono text-slate-100">BYPASS OTENTIKASI ADMIN</h2>
            </div>

            {!gameState.hackedMegaCorp ? (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Kunci Bypass Administrator (Base64 Result):</label>
                  <input 
                    type="password"
                    value={megaCorpPassword}
                    onChange={(e) => setMegaCorpPassword(e.target.value)}
                    placeholder="KATA SANDI DEKRIPSI"
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 font-mono text-center tracking-widest text-emerald-400 uppercase focus:outline-none"
                  />
                </div>

                {megaCorpError && (
                  <p className="text-rose-500 text-center font-mono text-[10px] font-bold">{megaCorpError}</p>
                )}

                <button 
                  onClick={() => {
                    if (megaCorpPassword.trim().toUpperCase() === 'APEX_GENESIS_2026') {
                      onHackMegaCorp();
                      if (playSound) playSound('success');
                      setMegaCorpError('');
                    } else {
                      if (playSound) playSound('error');
                      setMegaCorpError('KODE AUTENTIKASI TIDAK VALID!');
                    }
                  }}
                  className="w-full bg-blue-950 hover:bg-blue-900 text-blue-400 hover:text-white border border-blue-800/30 font-bold py-2.5 rounded-md text-xs font-mono transition-colors"
                >
                  VALIDASI KUNCI ADMIN
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-emerald-400 font-mono text-xs font-bold text-center animate-pulse">
                  🔓 SISTEM TERRETAS! STATUS: ADMIN_ACC_OVERRIDE
                </div>
                
                <div className="text-left space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <h3 className="font-bold text-rose-500 font-mono text-xs border-b border-slate-900 pb-1.5">
                    📁 FILE_RAHASIA: Genesis_Clinical_Failsafe.bin
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong>DESKRIPSI:</strong> Berkas log ini membuktikan manipulasi data genetik ilegal oleh Apex Corp pada subjek manusia tanpa izin.
                  </p>
                  <div className="mt-4 pt-2.5 border-t border-slate-900 flex justify-between items-center">
                    <span className="text-[10px] text-amber-400 font-bold">Status Kasus: Siap Dikirim</span>
                    <button 
                      onClick={() => {
                        onOpenWindow('victory', 'BUKTI_TERKUMPUL.TXT', 520, 390);
                      }}
                      className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900 rounded-md font-bold font-mono text-[10px]"
                    >
                      Buka & Kirim Bukti
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// K. FRAME UTAMA BROWSER (MENGATUR NAVIGASI & ROUTING INTERNET)
function Browser({ 
  url, 
  onNavigate, 
  history, 
  historyIndex, 
  onBack, 
  onForward, 
  gameState, 
  onUnlockJournal, 
  onHackMegaCorp, 
  onOpenWindow,
  playSound
}) {
  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden text-xs">
      {/* BROWSER TOP BAR */}
      <div className="bg-slate-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center gap-3">
        <div className="flex gap-1.5">
          <button 
            onClick={onBack}
            disabled={historyIndex === 0}
            className="w-7 h-7 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-30 flex items-center justify-center text-slate-300 font-bold"
          >
            ◀
          </button>
          <button 
            onClick={onForward}
            disabled={historyIndex === history.length - 1}
            className="w-7 h-7 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-30 flex items-center justify-center text-slate-300 font-bold"
          >
            ▶
          </button>
        </div>
        
        <div className="flex-1 bg-slate-900 rounded-lg px-3 py-1 flex items-center gap-2 border border-slate-800">
          <span className="text-emerald-500 font-mono text-[10px] font-bold select-none">HTTP://</span>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => onNavigate(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-mono text-slate-200 focus:ring-0 p-0"
          />
        </div>
        
        {/* Bookmarks bar */}
        <div className="flex gap-1.5 font-mono text-[10px]">
          <button 
            onClick={() => onNavigate('aethersearch.net')}
            className={`px-2.5 py-1 rounded-md border ${url === 'aethersearch.net' ? 'bg-emerald-950 text-emerald-400 border-emerald-900/60' : 'bg-slate-900 text-slate-400'}`}
          >
            🔍 Search
          </button>
          <button 
            onClick={() => onNavigate('andra-journal.net')}
            className={`px-2.5 py-1 rounded-md border ${url === 'andra-journal.net' ? 'bg-emerald-950 text-emerald-400 border-emerald-900/60' : 'bg-slate-900 text-slate-400'}`}
          >
            📔 AndraBlog
          </button>
          <button 
            onClick={() => onNavigate('konspirasi-forum.id')}
            className={`px-2.5 py-1 rounded-md border ${url === 'konspirasi-forum.id' ? 'bg-purple-950 text-purple-400 border-purple-900/60' : 'bg-slate-900 text-slate-400'}`}
          >
            👽 NetWatchers
          </button>
          <button 
            onClick={() => onNavigate('apex-corp.org')}
            className={`px-2.5 py-1 rounded-md border ${url.startsWith('apex-corp.org') ? 'bg-blue-950 text-blue-400 border-blue-900/60' : 'bg-slate-900 text-slate-400'}`}
          >
            🏢 ApexCorp
          </button>
        </div>
      </div>

      {/* VIEWPORT AREA */}
      <div className="flex-1 overflow-auto bg-slate-950 p-6 select-text">
        {url === 'aethersearch.net' && (
          <AetherSearch 
            onNavigate={onNavigate} 
            playSound={playSound} 
          />
        )}

        {url === 'andra-journal.net' && (
          <KorbanBlog 
            gameState={gameState} 
            onUnlockJournal={onUnlockJournal} 
            playSound={playSound} 
            onNavigate={onNavigate} 
          />
        )}

        {url === 'konspirasi-forum.id' && (
          <ForumHome 
            playSound={playSound} 
            onNavigate={onNavigate} 
          />
        )}

        {url.startsWith('apex-corp.org') && (
          <MegaCorpSitus 
            url={url} 
            gameState={gameState} 
            onHackMegaCorp={onHackMegaCorp} 
            playSound={playSound} 
            onNavigate={onNavigate} 
            onOpenWindow={onOpenWindow} 
          />
        )}

        {/* DNS NXDOMAIN Error */}
        {url !== 'aethersearch.net' && url !== 'andra-journal.net' && url !== 'konspirasi-forum.id' && !url.startsWith('apex-corp.org') && (
          <div className="text-center py-12 space-y-3 font-mono">
            <span className="text-rose-500 text-3xl block">🚫</span>
            <h2 className="text-sm font-bold text-slate-100">Situs Tidak Ditemukan</h2>
            <p className="text-slate-400 text-xs">DNS AetherOS tidak dapat menemukan alamat <strong>http://{url}</strong>.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 5. APLIKASI UTAMA (STATE MANAGEMENT & WORKSPACE OS)
// =========================================================================

export default function App() {
  const [windows, setWindows] = useState([
    { id: 'readme', title: 'README.txt', x: 60, y: 80, w: 520, h: 390, zIndex: 10, minimized: false, content: 'readme' }
  ]);
  const [activeWindow, setActiveWindow] = useState('readme');
  
  // Game State Progress (Synchronized with localStorage)
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('arg_game_state_v105');
    return saved ? JSON.parse(saved) : {
      unlockedAndraJournal: false, 
      unlockedBase64: false,       
      hackedMegaCorp: false,       
      gameCompleted: false,        
    };
  });

  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('arg_emails_v105');
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });

  const [activeEmailId, setActiveEmailId] = useState('mail-1');

  // File system states
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [activeTextFile, setActiveTextFile] = useState(null);
  const [activeImageFileType, setActiveImageFileType] = useState(null); // 'blueprint' atau 'rontgen'

  // Terminal History State
  const [terminalHistory, setTerminalHistory] = useState([
    { text: 'AETHER FORENSIC OS [Version 1.05.90]', type: 'system' },
    { text: 'SISTEM DETEKSI PROTOKOL MATI DARURAT AKTIF.', type: 'warning' },
    { text: 'Ketik "help" untuk melihat daftar instruksi siber.', type: 'system' },
    { text: '', type: 'blank' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef(null);

  // Browser Navigation State (Default dialihkan ke Mesin Pencari Fiktif AetherSearch)
  const [browserUrl, setBrowserUrl] = useState('aethersearch.net');
  const [browserHistory, setBrowserHistory] = useState(['aethersearch.net']);
  const [browserHistoryIndex, setBrowserHistoryIndex] = useState(0);

  // Crypto Solver Inputs (Base64 sengaja dikosongkan agar dicari manual lewat search engine)
  const [caesarInput, setCaesarInput] = useState('XGTMGF_XGTSKTM_RSTF');
  const [caesarShift, setCaesarShift] = useState(7);
  const [caesarOutput, setCaesarOutput] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');

  // Dragging Windows Logic States
  const [dragStart, setDragStart] = useState(null);
  const [draggingWinId, setDraggingWinId] = useState(null);

  // Sync state & crypto solvers
  useEffect(() => {
    localStorage.setItem('arg_game_state_v105', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('arg_emails_v105', JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    setCaesarOutput(caesarDecrypt(caesarInput.toUpperCase(), caesarShift));
  }, [caesarInput, caesarShift]);

  useEffect(() => {
    setBase64Output(base64Decode(base64Input));
  }, [base64Input]);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  const openWindow = (id, title, wWidth = 600, wHeight = 440) => {
    playSound('click');
    const exists = windows.find(w => w.id === id);
    const nextZ = getHighestZ() + 1;
    
    if (exists) {
      setWindows(windows.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w));
      setActiveWindow(id);
    } else {
      const offset = (windows.length * 28) % 180;
      const newWin = {
        id,
        title,
        x: 100 + offset,
        y: 100 + offset,
        w: wWidth,
        h: wHeight,
        zIndex: nextZ,
        minimized: false,
        content: id
      };
      setWindows([...windows, newWin]);
      setActiveWindow(id);
    }
  };

  const closeWindow = (id) => {
    playSound('click');
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const minimizeWindow = (id) => {
    playSound('click');
    setWindows(windows.map(w => w.id === id ? { ...w, minimized: true } : w));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const focusWindow = (id) => {
    if (activeWindow !== id) {
      const nextZ = getHighestZ() + 1;
      setWindows(windows.map(w => w.id === id ? { ...w, zIndex: nextZ } : w));
      setActiveWindow(id);
    }
  };

  const getHighestZ = () => {
    if (windows.length === 0) return 0;
    return Math.max(...windows.map(w => w.zIndex || 0));
  };

  const handleDragStart = (e, winId) => {
    focusWindow(winId);
    const win = windows.find(w => w.id === winId);
    if (!win) return;
    setDragStart({
      startX: e.clientX,
      startY: e.clientY,
      winX: win.x,
      winY: win.y
    });
    setDraggingWinId(winId);
  };

  const handlePointerMove = (e) => {
    if (!dragStart || !draggingWinId) return;
    const dx = e.clientX - dragStart.startX;
    const dy = e.clientY - dragStart.startY;
    
    setWindows(windows.map(w => w.id === draggingWinId ? {
      ...w,
      x: Math.max(0, dragStart.winX + dx),
      y: Math.max(0, dragStart.winY + dy)
    } : w));
  };

  const handlePointerUp = () => {
    setDragStart(null);
    setDraggingWinId(null);
  };

  // PEMROSESAN PERINTAH TERMINAL
  const runCommand = (cmdStr) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = [];

    switch (cmd) {
      case 'help':
        output = [
          { text: 'Daftar Perintah Forensik:', type: 'title' },
          { text: '  ls                 - Menampilkan daftar berkas lokal.', type: 'info' },
          { text: '  cat [nama_berkas]  - Membaca konten teks dokumen fiktif.', type: 'info' },
          { text: '  decrypt [teks] [x] - Menghitung sandi Caesar mundur x langkah.', type: 'info' },
          { text: '  base64 [teks_sandi]- Menerjemahkan sandi Base64.', type: 'info' },
          { text: '  secret-hack [kunci]- Membuka bypass gerbang administratif secara cepat.', type: 'info' },
          { text: '  status             - Meninjau progres pemecahan kasus ARG.', type: 'info' },
          { text: '  clear              - Membersihkan histori log layar.', type: 'info' }
        ];
        break;

      case 'ls':
        output = [
          { text: 'Direktori: /user/andra/documents/', type: 'title' },
          { text: '  - README.txt          [Berkas Sistem]', type: 'info' },
          { text: '  - jurnal_andra.txt    [Terenkripsi Caesar]', type: 'warning' },
          { text: '  - kontak_darurat.csv  [Data Teks Kontak]', type: 'info' }
        ];
        break;

      case 'cat':
        const fileParam = args[0] ? args[0].toLowerCase() : '';
        if (fileParam === 'readme.txt') {
          output = [
            { text: 'Konten README.txt:', type: 'title' },
            { text: 'Sistem Forensik Darurat AetherOS v1.05.', type: 'info' },
            { text: 'Misi Anda: Selidiki penculikan Andra Kirana dan kumpulkan bukti kejahatan klinis Apex Corp.', type: 'info' }
          ];
        } else if (fileParam === 'jurnal_andra.txt') {
          output = [
            { text: 'Konten jurnal_andra.txt (DEKIP_KEY_REQUIRED):', type: 'title' },
            { text: '----------------------------------------', type: 'blank' },
            { text: '  XGTMGF_XGTSKTM_RSTF', type: 'error' },
            { text: '----------------------------------------', type: 'blank' },
            { text: 'Petunjuk Geser Mundur: Gunakan tanggal lahir/hari jadian anjing kesayangan Andra (Riko).', type: 'warning' },
            { text: 'Gunakan: decrypt XGTMGF_XGTSKTM_RSTF [geser]', type: 'info' }
          ];
        } else if (fileParam === 'kontak_darurat.csv') {
          output = [
            { text: 'Konten kontak_darurat.csv:', type: 'title' },
            { text: 'Andra Kirana, Korban, andra@apex-corp.org', type: 'info' },
            { text: 'Riko (Golden Retriever), Peliharaan, -', type: 'info' },
            { text: 'Whistleblower99, Sumber Anonim, whistleblower99@proton.me', type: 'info' }
          ];
        } else {
          output = [{ text: `Error: Berkas "${args[0] || ''}" tidak ditemukan di direktori saat ini.`, type: 'error' }];
        }
        break;

      case 'decrypt':
        if (args.length < 2) {
          output = [{ text: 'Format Perintah: decrypt [teks_sandi] [pergeseran_mundur]', type: 'error' }];
        } else {
          const cipherText = args[0].toUpperCase();
          const shiftValue = parseInt(args[1], 10);
          if (isNaN(shiftValue)) {
            output = [{ text: 'Error: Pergeseran harus berupa nilai angka bulat positif.', type: 'error' }];
          } else {
            const dec = caesarDecrypt(cipherText, shiftValue);
            output = [
              { text: 'Hasil Analisis Dekripsi Caesar:', type: 'title' },
              { text: `Teks Terang: ${dec}`, type: 'success' }
            ];
            
            if (dec === 'ANDRA_BERMAIN_BOLA' && shiftValue === 19) {
              setGameState(prev => ({ ...prev, unlockedAndraJournal: true }));
              playSound('success');
              output.push({ text: 'SISTEM: Kunci terverifikasi! Jurnal Andra kini dapat diakses di Browser.', type: 'success' });
            }
          }
        }
        break;

      case 'base64':
        if (!args[0]) {
          output = [{ text: 'Format Perintah: base64 [string_base64]', type: 'error' }];
        } else {
          const decoded = base64Decode(args[0]);
          if (decoded === 'FORMAT_INVALID') {
            output = [{ text: 'Error: Format kompresi string Base64 tidak valid.', type: 'error' }];
          } else {
            output = [
              { text: 'Hasil Dekripsi Base64:', type: 'title' },
              { text: `Teks Terang: ${decoded}`, type: 'success' }
            ];
            if (decoded === 'APEX_GENESIS_2026') {
              setGameState(prev => ({ ...prev, unlockedBase64: true }));
              playSound('success');
              output.push({ text: 'SISTEM: Sandi Otentikasi Apex Corp Genesis valid!', type: 'success' });
            }
          }
        }
        break;

      case 'secret-hack':
        if (!args[0]) {
          output = [{ text: 'Format Perintah: secret-hack [kunci_bypass_admin]', type: 'error' }];
        } else {
          if (args[0].toUpperCase() === 'APEX_GENESIS_2026') {
            setGameState(prev => ({ ...prev, hackedMegaCorp: true }));
            playSound('success');
            output = [
              { text: 'MENGONTROL AKSES GERBANG APEX...', type: 'warning' },
              { text: 'Bypass Otentikasi Berhasil! Dashboard administrator kini dapat dibuka.', type: 'success' }
            ];
          } else {
            playSound('error');
            output = [{ text: 'AKSES DITOLAK: Kunci Bypass tidak cocok dengan signature server.', type: 'error' }];
          }
        }
        break;

      case 'status':
        const solveCount = Object.values(gameState).filter(Boolean).length;
        output = [
          { text: '==== LAPORAN KEMAJUAN DETEKTIF ====', type: 'title' },
          { text: `1. Dekripsi Jurnal Andra: ${gameState.unlockedAndraJournal ? 'BERHASIL' : 'BELUM SELESAI'}`, type: gameState.unlockedAndraJournal ? 'success' : 'warning' },
          { text: `2. Dekripsi Kunci Admin Base64: ${gameState.unlockedBase64 ? 'BERHASIL' : 'BELUM SELESAI'}`, type: gameState.unlockedBase64 ? 'success' : 'warning' },
          { text: `3. Meretas Gerbang Utama Apex Corp: ${gameState.hackedMegaCorp ? 'BERHASIL' : 'BELUM SELESAI'}`, type: gameState.hackedMegaCorp ? 'success' : 'warning' },
          { text: `Sektor Kasus Selesai: ${solveCount} dari 4 fase`, type: 'info' }
        ];
        break;

      case 'clear':
        setTerminalHistory([]);
        return;

      default:
        output = [{ text: `Error: Perintah "${cmd}" tidak terdaftar. Ketik "help" untuk bantuan.`, type: 'error' }];
    }

    setTerminalHistory(prev => [
      ...prev,
      { text: `User@AetherOS:~$ ${cmdStr}`, type: 'input' },
      ...output,
      { text: '', type: 'blank' }
    ]);
  };

  // Navigasi Browser
  const handleBrowserNavigate = (newUrl) => {
    playSound('click');
    setBrowserUrl(newUrl);
    const newHistory = browserHistory.slice(0, browserHistoryIndex + 1);
    setBrowserHistory([...newHistory, newUrl]);
    setBrowserHistoryIndex(newHistory.length);
  };

  const handleBrowserBack = () => {
    if (browserHistoryIndex > 0) {
      playSound('click');
      const idx = browserHistoryIndex - 1;
      setBrowserHistoryIndex(idx);
      setBrowserUrl(browserHistory[idx]);
    }
  };

  const handleBrowserForward = () => {
    if (browserHistoryIndex < browserHistory.length - 1) {
      playSound('click');
      const idx = browserHistoryIndex + 1;
      setBrowserHistoryIndex(idx);
      setBrowserUrl(browserHistory[idx]);
    }
  };

  // Menangani Pembukaan File dari File Explorer
  const handleOpenFileFromExplorer = (fileObj) => {
    if (fileObj.type === 'file') {
      setActiveTextFile(fileObj);
      openWindow('notepad', `BukuCatatan: ${fileObj.name}`, 460, 360);
    } else if (fileObj.type === 'img') {
      setActiveImageFileType(fileObj.imgType);
      openWindow('imageviewer', `PenampilGambar: ${fileObj.name}`, 460, 410);
    }
  };

  // Reset Permainan
  const handleResetGame = () => {
    if (window.confirm('Hapus seluruh memori analisis siber dan progres permainan?')) {
      playSound('error');
      localStorage.removeItem('arg_game_state_v105');
      localStorage.removeItem('arg_emails_v105');
      setGameState({
        unlockedAndraJournal: false,
        unlockedBase64: false,
        hackedMegaCorp: false,
        gameCompleted: false,
      });
      setEmails(INITIAL_EMAILS);
      setWindows([{ id: 'readme', title: 'README.txt', x: 60, y: 80, w: 520, h: 390, zIndex: 10, minimized: false, content: 'readme' }]);
      setActiveWindow('readme');
      setBrowserUrl('aethersearch.net');
    }
  };

  return (
    <div 
      className="relative w-screen h-screen bg-[#070b13] text-slate-200 overflow-hidden font-sans select-none"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #111827 0%, #070b13 100%)'
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* SCANLINES retro effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

      {/* TOP BAR OS */}
      <header className="absolute top-0 left-0 right-0 h-11 bg-slate-950/80 border-b border-slate-800/60 flex items-center justify-between px-5 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-extrabold tracking-widest text-xs font-mono text-emerald-400">AETHER_FORENSIC_OS</span>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">STATUS: FORENSIC_DECRYPT</span>
        </div>
        
        <div className="flex items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-emerald-400 font-bold">KASUS_PROGRES: {Math.round((Object.values(gameState).filter(Boolean).length / 4) * 100)}%</span>
          </div>
          <button onClick={handleResetGame} className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 rounded transition-colors text-xs">
            Hapus Cache Game
          </button>
        </div>
      </header>

      {/* WORKSPACE DESKTOP ICONS */}
      <main className="absolute inset-0 pt-16 pb-16 px-6 flex flex-col gap-4 items-start content-start flex-wrap z-10">
        
        {/* Readme Icon */}
        <button onDoubleClick={() => openWindow('readme', 'README.txt', 520, 390)} onClick={() => playSound('click')} className="group w-20 flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-slate-900/40 text-center">
          <div className="w-12 h-12 bg-amber-500/10 rounded-lg border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg text-2xl">
            📔
          </div>
          <span className="text-[11px] font-mono text-amber-200">README.txt</span>
        </button>

        {/* File Explorer Icon */}
        <button onDoubleClick={() => openWindow('explorer', 'Penjelajah Berkas (C:)', 560, 430)} onClick={() => playSound('click')} className="group w-20 flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-slate-900/40 text-center">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-lg border border-yellow-500/30 flex items-center justify-center text-yellow-400 shadow-lg text-2xl">
            📁
          </div>
          <span className="text-[11px] font-mono text-yellow-200">Explorer.exe</span>
        </button>

        {/* Terminal Icon */}
        <button onDoubleClick={() => openWindow('terminal', 'Emulator Terminal Kriptografi', 700, 480)} onClick={() => playSound('click')} className="group w-20 flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-slate-900/40 text-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-lg border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg text-2xl">
            💻
          </div>
          <span className="text-[11px] font-mono text-emerald-200">Terminal.exe</span>
        </button>

        {/* Web Browser Icon */}
        <button onDoubleClick={() => openWindow('browser', 'Aether Web Browser', 860, 560)} onClick={() => playSound('click')} className="group w-20 flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-slate-900/40 text-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg text-2xl">
            🌐
          </div>
          <span className="text-[11px] font-mono text-blue-200">Browser.sys</span>
        </button>

        {/* Email Icon */}
        <button onDoubleClick={() => openWindow('email', 'Klien Surel Forensik', 760, 480)} onClick={() => playSound('click')} className="group w-20 flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-slate-900/40 text-center">
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg text-2xl">
            ✉️
          </div>
          <span className="text-[11px] font-mono text-purple-200">SurelBox</span>
        </button>

        {/* SolverSandi Icon */}
        <button onDoubleClick={() => openWindow('cryptotool', 'Utilitas Pemecah Sandi', 600, 430)} onClick={() => playSound('click')} className="group w-20 flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-slate-900/40 text-center">
          <div className="w-12 h-12 bg-rose-500/10 rounded-lg border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg text-2xl">
            🔑
          </div>
          <span className="text-[11px] font-mono text-rose-200">SolverSandi</span>
        </button>

      </main>

      {/* ACTIVE WINDOWS RENDERING ENGINE */}
      {windows.map((win) => {
        if (win.minimized) return null;
        const isActive = activeWindow === win.id;

        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            x={win.x}
            y={win.y}
            w={win.w}
            h={win.h}
            zIndex={win.zIndex}
            isActive={isActive}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onDragStart={(e) => handleDragStart(e, win.id)}
          >
            {win.content === 'readme' && (
              <div className="space-y-4 font-mono text-xs select-text">
                <div className="p-3.5 bg-amber-950/20 text-amber-300 border border-amber-900/30 rounded-lg">
                  🚨 <strong>BERKAS UTAMA: MISSING_PERSON_FORENSIC</strong>
                  <p className="mt-1 leading-relaxed">
                    Andra Kirana diculik dari kediamannya. Dia meninggalkan jejak digital penting di drive cadangan darurat ini.
                  </p>
                </div>
                <h3 className="text-emerald-400 font-bold border-b border-slate-800 pb-1">PETUNJUK ANALISIS FORENSIK:</h3>
                <ol className="list-decimal pl-4 space-y-2 leading-relaxed text-slate-300">
                  <li>Buka <span className="text-purple-400 font-bold">SurelBox</span> untuk mengidentifikasi detail masalah darurat.</li>
                  <li>Buka <span className="text-blue-400 font-bold">Browser.sys</span> dan gunakan mesin pencari **AetherSearch** untuk meneliti data korban secara mendalam.</li>
                  <li>Ketik kata kunci forensik seperti <code className="text-amber-400 font-bold">"Andra Kirana"</code> atau <code className="text-amber-400 font-bold">"Apex Corp"</code> di kolom pencarian untuk menemukan koordinat lokasi dan tautan blog pribadinya.</li>
                  <li>Gunakan <span className="text-rose-400 font-bold">SolverSandi</span> (atau terminal via `decrypt`) untuk memecahkan sandi Caesar dengan pergeseran tanggal jadi peliharaan Riko yang tercantum di <span className="text-emerald-400 underline cursor-pointer" onClick={() => openWindow('browser', 'Aether Web Browser', 860, 560)}>andra-journal.net</span>.</li>
                  <li>Masukkan hasil dekripsi ke draf blog korban untuk membongkar kunci autentikasi server administrator milik Apex Corp!</li>
                </ol>
              </div>
            )}

            {win.content === 'explorer' && (
              <FileExplorer
                currentFolderId={currentFolderId}
                onNavigate={setCurrentFolderId}
                onOpenFile={handleOpenFileFromExplorer}
                playSound={playSound}
              />
            )}

            {win.content === 'notepad' && (
              <BukuCatatan
                activeFile={activeTextFile}
                onClose={() => closeWindow('notepad')}
                playSound={playSound}
              />
            )}

            {win.content === 'imageviewer' && (
              <PenampilGambar
                imgType={activeImageFileType}
                onClose={() => closeWindow('imageviewer')}
              />
            )}

            {win.content === 'terminal' && (
              <Terminal
                history={terminalHistory}
                currentInput={terminalInput}
                onInputChange={setTerminalInput}
                onSubmitCommand={() => {
                  runCommand(terminalInput);
                  setTerminalInput('');
                }}
                bottomRef={terminalBottomRef}
                playSound={playSound}
              />
            )}

            {win.content === 'email' && (
              <EmailClient
                emails={emails}
                activeEmailId={activeEmailId}
                onSelectEmail={(id) => {
                  setActiveEmailId(id);
                  setEmails(emails.map(m => m.id === id ? { ...m, read: true } : m));
                }}
                playSound={playSound}
              />
            )}

            {win.content === 'browser' && (
              <Browser
                url={browserUrl}
                onNavigate={handleBrowserNavigate}
                history={browserHistory}
                historyIndex={browserHistoryIndex}
                onBack={handleBrowserBack}
                onForward={handleBrowserForward}
                gameState={gameState}
                onUnlockJournal={() => setGameState(prev => ({ ...prev, unlockedAndraJournal: true }))}
                onHackMegaCorp={() => setGameState(prev => ({ ...prev, hackedMegaCorp: true }))}
                onOpenWindow={openWindow}
                playSound={playSound}
              />
            )}

            {win.content === 'cryptotool' && (
              <CryptoTool
                caesarInput={caesarInput}
                onCaesarInputChange={setCaesarInput}
                caesarShift={caesarShift}
                onCaesarShiftChange={setCaesarShift}
                caesarOutput={caesarOutput}
                base64Input={base64Input}
                onBase64InputChange={setBase64Input}
                base64Output={base64Output}
                onVerifySecret={() => {
                  if (caesarOutput === 'ANDRA_BERMAIN_BOLA' && caesarShift === 19) {
                    setGameState(prev => ({ ...prev, unlockedAndraJournal: true }));
                    playSound('success');
                    alert('Sukses! Sandi Jurnal berhasil dipecahkan. Silakan buka blognya kembali!');
                  } else {
                    playSound('error');
                    alert('Sandi dekripsi Anda belum tepat!');
                  }
                }}
              />
            )}

            {win.content === 'victory' && (
              <div className="h-full flex flex-col justify-between p-4 bg-emerald-950/10 text-center font-mono space-y-4">
                <div className="space-y-3">
                  <span className="text-4xl block animate-bounce">🏆</span>
                  <h2 className="text-lg font-black text-emerald-400">MISI SUKSES!</h2>
                  <p className="text-slate-300 text-xs">Anda berhasil mengunduh berkas rahasia <strong>"Genesis_Clinical_Failsafe.bin"</strong>!</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Bukti kejahatan genetika Apex Corp telah didistribusikan ke publik. Andra Kirana berhasil dievakuasi dengan selamat dari penyekapan!
                  </p>
                </div>
              </div>
            )}
          </Window>
        );
      })}

      {/* FOOTER TASKBAR */}
      <footer className="absolute bottom-0 left-0 right-0 h-13 bg-slate-950/90 border-t border-slate-800/60 flex items-center justify-between px-4 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button onClick={() => playSound('click')} className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-md text-xs font-mono font-black text-slate-950 transition-all active:scale-95">
            ❖ AETHER
          </button>
          
          <div className="w-px h-6 bg-slate-800 mx-2"></div>
          
          {/* TASKBAR APPLICATIONS LIST */}
          <div className="flex gap-2">
            {['readme', 'explorer', 'terminal', 'browser', 'email', 'cryptotool'].map((id) => {
              const isOpen = windows.some(w => w.id === id);
              const isActive = activeWindow === id && isOpen;
              const buttonLabel = {
                readme: '📔 Readme',
                explorer: '📁 Explorer',
                terminal: '💻 Terminal',
                browser: '🌐 Browser',
                email: '✉️ SurelBox',
                cryptotool: '🔑 SolverSandi'
              };

              return (
                <button
                  key={id}
                  onClick={() => {
                    if (isOpen) {
                      if (isActive) {
                        minimizeWindow(id);
                      } else {
                        focusWindow(id);
                        setWindows(windows.map(w => w.id === id ? { ...w, minimized: false } : w));
                      }
                    } else {
                      let title = 'App';
                      if (id === 'readme') title = 'README.txt';
                      if (id === 'explorer') title = 'Penjelajah Berkas (C:)';
                      if (id === 'terminal') title = 'Terminal siber';
                      if (id === 'browser') title = 'Aether Web Browser';
                      if (id === 'email') title = 'Klien Surel Forensik';
                      if (id === 'cryptotool') title = 'Utilitas Pemecah Sandi';
                      openWindow(id, title);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border ${
                    isActive 
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60' 
                      : isOpen 
                        ? 'bg-slate-900 text-slate-300 border-slate-800' 
                        : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-900/30'
                  }`}
                >
                  {buttonLabel[id]}
                </button>
              );
            })}
          </div>
        </div>

        {/* SYSTEM TIME STATUS */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pr-1.5">
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/40 px-3 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>OS_SECURE: PASS</span>
          </div>
          <span className="text-slate-400">11:54 PM</span>
        </div>
      </footer>
    </div>
  );
}
