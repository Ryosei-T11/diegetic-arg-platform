import React, { useState, useEffect, useRef } from 'react';

// =========================================================================
// 1. DATABASE & DATA STATIS FIKTIF (DIEGETIK)
// =========================================================================

const INITIAL_EMAILS = [
  {
    id: 'mail-1',
    sender: 'system@aether-os.net',
    subject: '[PENTING] Protokol Mati Darurat (Dead Man Switch)',
    date: '12 Juni 2026',
    body: `Sistem mendeteksi protokol mati darurat (Dead Man Switch) diaktifkan oleh pengguna: Andra Kirana.\n\nAkun Anda telah didelegasikan sebagai kontak tepercaya untuk memulihkan enkripsi drive luar miliknya.\n\nAndra meninggalkan sebuah berkas terenkripsi bernama 'jurnal_andra.txt' di dalam desktop (dan Folder Dokumen Pribadi di Explorer.exe).\n\nDia menulis catatan berikut:\n"Kunci untuk membaca draf jurnal ini adalah tanggal hari jadi anjing kesayanganku, Riko, dengan pergeseran mundur (Caesar Cipher) sebanyak tanggal tersebut."`,
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

const SEARCH_DATABASE = {
  'apex': [
    {
      title: 'Skandal Genetika Apex Corp di Sektor S2',
      url: 'netwatchers-leak-database',
      snippet: 'Laporan eksklusif mengenai uji klinis modifikasi sel manusia ilegal tanpa persetujuan subjek di fasilitas Sektor S2.',
      content: 'BOCORAN NETWATCHERS: Dokumen internal berkode rahasia mengindikasikan Dr. Jonathan Vance menandatangani otorisasi eksperimen Sektor S2. Kunci enkripsi cadangan sistem draf didefinisikan menggunakan hash dari nama sandi rahasia miliknya. Hash MD5 sandi CEO adalah: eb823528b17b6ab86ba11b6b55979c53'
    }
  ],
  'skandal': [
    {
      title: 'Skandal Genetika Apex Corp di Sektor S2',
      url: 'netwatchers-leak-database',
      snippet: 'Laporan eksklusif mengenai uji klinis modifikasi sel manusia ilegal tanpa persetujuan subjek di Sektor S2.',
      content: 'BOCORAN NETWATCHERS: Dokumen internal berkode rahasia mengindikasikan Dr. Jonathan Vance menandatangani otorisasi eksperimen Sektor S2. Kunci enkripsi cadangan sistem draf didefinisikan menggunakan hash dari nama sandi rahasia miliknya. Hash MD5 sandi CEO adalah: eb823528b17b6ab86ba11b6b55979c53'
    }
  ],
  'vance': [
    {
      title: 'Profil Dr. Jonathan Vance (CEO Apex Corp)',
      url: 'apex-corp.org/executives',
      snippet: 'Jonathan Vance, pelopor bioteknologi siber trans-humanis, kini memimpin pengembangan program terapi genetika rahasia.',
      content: 'BIOGRAFI RESMI: Dr. Jonathan Vance telah memimpin Apex Corp sejak 2018. Ia sangat tertutup mengenai protokol keamanan pribadinya, tetapi tim intel kami mendeteksi ia menggunakan kata sandi MD5 hash publik: "eb823528b17b6ab86ba11b6b55979c53". Jika dipecahkan menggunakan Hash Decrypter SolverSandi, sandi aslinya adalah kunci gerbang admin!'
    }
  ],
  'andra': [
    {
      title: 'Jurnal Pribadi Andra Kirana',
      url: 'andra-journal.net',
      snippet: 'Wadah pemikiran pribadi Andra Kirana bebas sensor internal mengenai penelitian genetika.',
      content: 'Navigasi langsung ke alamat blog pribadi Andra Kirana.'
    }
  ],
  'riko': [
    {
      title: 'Anjing Kebebasan: Shelter Adopsi Riko',
      url: 'andra-journal.net',
      snippet: 'Tempat Andra mengadopsi Riko, anjing Golden Retriever kesayangannya yang berulang tahun tanggal 19 Juni.',
      content: 'Laporan adopsi Riko dari shelter penyelamatan hewan liar.'
    }
  ]
};

// =========================================================================
// 2. UTILITAS KRIPTOGRAFI LENGKAP
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

const vigenereDecrypt = (text, key) => {
  if (!key) return text.toUpperCase();
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (key.length === 0) return text.toUpperCase();

  let keyIndex = 0;
  return text.toUpperCase().split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      const shift = key.charCodeAt(keyIndex % key.length) - 65;
      keyIndex++;
      return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
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

const stegExtract = (imageName, password) => {
  const cleanPass = password.trim().toUpperCase();
  if (imageName === 'foto_hewan.png') {
    if (cleanPass === 'RIKO') {
      return '🔓 [STEG_OK] Ditemukan pesan tersembunyi: "Pecahkan sandi Vigenere di komputer dengan kunci: GOLDEN"';
    }
    return '❌ [STEG_ERR] Kata sandi enkripsi steganografi salah.';
  }
  if (imageName === 'denah_apex_corp.png') {
    if (cleanPass === 'GENESIS') {
      return '🔓 [STEG_OK] Ditemukan cetak biru cadangan: "Akses pintu laboratorium darurat disandikan dengan koordinat GPS penangkapan."';
    }
    return '❌ [STEG_ERR] Kata sandi enkripsi steganografi salah.';
  }
  return '⚠️ [STEG_WARN] File gambar ini tidak mengandung anomali piksel steganografi.';
};

const getExifMetadata = (imageName) => {
  const baseMeta = {
    camera: 'Unknown Corp Cam v1.2',
    date: '14 Juni 2026',
    software: 'Aether OS Metadata Exporter',
    gps: 'Tidak Ada Data GPS (Metadata Dihapus)'
  };
  if (imageName === 'foto_rontgen_lab.png') {
    return {
      ...baseMeta,
      camera: 'MediScan XR-900',
      date: '10 April 2026 14:22:10 UTC',
      gps: '6°12\'53.2"S 106°48\'11.4"E (Gudang Logistik Sektor 4, Jakarta)'
    };
  }
  if (imageName === 'denah_apex_corp.png') {
    return {
      ...baseMeta,
      camera: 'VectorDraw Engine v9',
      date: '02 Januari 2026 09:00:15 UTC',
      gps: '6°15\'22.1"S 106°49\'45.8"E (Kantor Pusat Administrasi Apex Corp)'
    };
  }
  return baseMeta;
};

const HASH_LEAK_DATABASE = {
  'eb823528b17b6ab86ba11b6b55979c53': 'APEX_GENESIS_2026',
  '3f48a1926640822998a4427b5e85f403': 'VANCE_SECRET_99',
  '79ebc8261df02e3b97b095eb13881ee28e679b39cfb7ef38787c80f4f9f44db4': 'ANDRA_BERMAIN_BOLA'
};

const crackHash = (hashStr) => {
  const cleanHash = hashStr.trim().toLowerCase();
  if (HASH_LEAK_DATABASE[cleanHash]) {
    return {
      success: true,
      result: HASH_LEAK_DATABASE[cleanHash],
      msg: '🔓 [MATCH_FOUND] Hash berhasil dicocokkan dengan database kebocoran siber NetWatchers!'
    };
  }
  return {
    success: false,
    result: null,
    msg: '❌ [MATCH_FAILED] Hash tidak ditemukan di basis data kebocoran publik.'
  };
};

// =========================================================================
// 3. AUDIO SYNTHESIZER RETRO (WEB AUDIO API)
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
    } else if (type === 'alarm') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(350, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    }
  } catch (e) {
    // Autoplay browser safety bypass
  }
};

// =========================================================================
// 4. SUB-KOMPONEN UI FORENSIK INTEGRAL (INLINE)
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
// 5. PENERJEMAH FILE TEXT INTERAKTIF DENGAN STABILO (BUKU CATATAN)
// =========================================================================

function BukuCatatan({ fileName, content, playSound }) {
  const [highlightedWords, setHighlightedWords] = useState(new Set());

  // Membagi teks menjadi kata-kata agar bisa diklik dan diberi stabilo kuning siber
  const words = content.split(/(\s+)/);

  const toggleHighlight = (word, idx) => {
    const key = `${word}-${idx}`;
    const nextSet = new Set(highlightedWords);
    if (nextSet.has(key)) {
      nextSet.delete(key);
    } else {
      if (playSound) playSound('click');
      nextSet.add(key);
    }
    setHighlightedWords(nextSet);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 font-mono text-xs text-slate-300 rounded-lg border border-slate-800 p-4">
      <div className="border-b border-slate-800 pb-2 mb-3 flex justify-between text-[10px] text-slate-500">
        <span>EDITING: {fileName}</span>
        <span>KLIK KATA UNTUK MENANDAI STABILO SIBER 🖍️</span>
      </div>
      <div className="flex-1 overflow-auto whitespace-pre-wrap leading-relaxed select-text pr-1">
        {words.map((part, idx) => {
          // Jika bagian tersebut spasi, langsung tampilkan
          if (/\s+/.test(part)) return part;

          const key = `${part}-${idx}`;
          const isHighlighted = highlightedWords.has(key);

          return (
            <span
              key={key}
              onClick={() => toggleHighlight(part, idx)}
              className={`cursor-pointer px-0.5 rounded transition-colors duration-150 ${
                isHighlighted 
                  ? 'bg-yellow-400 text-slate-950 font-bold border-b border-yellow-600' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {part}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================================
// 6. PENAMPIL GAMBAR FORENSIK VECTOR SVG (IMAGE VIEWER)
// =========================================================================

function ImageViewer({ imageName }) {
  return (
    <div className="h-full flex flex-col bg-slate-950 text-xs font-mono border border-slate-800 rounded-lg overflow-hidden">
      <div className="bg-slate-900 px-3.5 py-2 border-b border-slate-800 text-slate-400 flex justify-between text-[10px]">
        <span>PREVIEW: {imageName}</span>
        <span className="text-emerald-500 font-bold">DIAMANKAN (CYBER-RESOLVED)</span>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
        {imageName === 'denah_apex_corp.png' ? (
          <div className="w-full max-w-sm space-y-4 text-center">
            {/* Embedded SVG Blueprint denah Apex Corp */}
            <svg viewBox="0 0 400 300" className="w-full h-auto border border-emerald-900/40 rounded bg-slate-900">
              {/* Grid Background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.15" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Outer Walls */}
              <rect x="30" y="30" width="340" height="240" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.8" />
              {/* Sectors */}
              <line x1="200" y1="30" x2="200" y2="270" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,5" />
              <line x1="30" y1="150" x2="370" y2="150" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,5" />
              {/* Lab Rooms */}
              <rect x="50" y="50" width="120" height="80" fill="none" stroke="#10b981" strokeWidth="1.5" />
              <text x="60" y="75" fill="#10b981" fontSize="11" fontWeight="bold">Sektor S1 (Bio-Riset)</text>
              
              <rect x="230" y="50" width="120" height="80" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="240" y="75" fill="#f43f5e" fontSize="11" fontWeight="bold">Sektor S2 (Lab Gen)</text>
              <text x="240" y="95" fill="#f43f5e" fontSize="9" opacity="0.8">Ex-Eksperimen Manusia</text>
              
              <rect x="50" y="170" width="120" height="80" fill="none" stroke="#10b981" strokeWidth="1.5" />
              <text x="60" y="195" fill="#10b981" fontSize="11" fontWeight="bold">Sektor S3 (Server)</text>
              
              {/* Steg Key and GPS Hidden Hints */}
              <text x="240" y="210" fill="#a855f7" fontSize="11" fontWeight="bold">STEG_KEY = GENESIS</text>
              <text x="240" y="230" fill="#3b82f6" fontSize="10" fontWeight="bold">GATE_X2 = 19_SHIFTS</text>
              
              {/* Blueprint Labels */}
              <text x="140" y="285" fill="#10b981" fontSize="9" opacity="0.6">APEX CORP BLUEPRINT v12 - INTERNAL ONLY</text>
            </svg>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Denah Arsitektur Sektor Rahasia Apex Corp. Ditemukan petunjuk kunci steganografi: <span className="text-purple-400 font-bold">"GENESIS"</span> dan sandi pergeseran gerbang: <span className="text-blue-400 font-bold">"19_SHIFTS"</span>.
            </p>
          </div>
        ) : imageName === 'foto_rontgen_lab.png' ? (
          <div className="w-full max-w-sm space-y-4 text-center">
            {/* Embedded SVG Glowing Medical X-Ray */}
            <svg viewBox="0 0 400 300" className="w-full h-auto border border-cyan-900/40 rounded bg-slate-900">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#glow)" />
              {/* Chest Bones Structure Simulation */}
              <path d="M 200 40 L 200 260 M 200 80 Q 250 100 200 120 M 200 80 Q 150 100 200 120 M 200 120 Q 260 140 200 160 M 200 120 Q 140 140 200 160 M 200 160 Q 270 180 200 200 M 200 160 Q 130 180 200 200 M 200 200 Q 280 220 200 240 M 200 200 Q 120 220 200 240" fill="none" stroke="#22d3ee" strokeWidth="4.5" opacity="0.75" />
              {/* Biohazard Indicator */}
              <circle cx="200" cy="140" r="15" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
              <text x="220" y="145" fill="#ef4444" fontSize="10" fontWeight="bold">ANOMALI REKAYASA</text>
              {/* Subject Data overlay */}
              <text x="30" y="50" fill="#22d3ee" fontSize="10" fontWeight="bold">SUBJECT_ID: ANDRA_K</text>
              <text x="30" y="70" fill="#22d3ee" fontSize="9" opacity="0.8">TANGGAL PINDAI: 10/04/2026</text>
              <text x="30" y="90" fill="#ef4444" fontSize="9" fontWeight="bold">MUTASI RATE: 94.2%</text>
              
              {/* GPS Koordinat fiktif penyekapan */}
              <text x="30" y="260" fill="#22d3ee" fontSize="9" fontWeight="bold">METADATA GPS: 6°12'53.2"S 106°48'11.4"E</text>
              <text x="30" y="280" fill="#06b6d4" fontSize="8" opacity="0.6">ORGAN_MEDIS: MEDISCAN SYSTEM V4</text>
            </svg>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Berkas Pindaian Rontgen Paru-paru Andra Kirana. Terdapat tanda bahaya radiasi genetik dan metadata koordinat GPS terenkripsi di baris bawah: <span className="text-cyan-400 font-bold">6°12'53.2"S 106°48'11.4"E</span>.
            </p>
          </div>
        ) : (
          <div className="text-slate-500 py-12 text-center">
            Format gambar tidak didukung oleh pemetaan siber visual.
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 7. PENJELAJAH BERKAS VISUAL (FILE EXPLORER)
// =========================================================================

function FileExplorer({ onOpenFile, playSound }) {
  const [currentPath, setCurrentPath] = useState('/'); // '/' , '/pribadi', '/forensik'

  const navigateTo = (path) => {
    if (playSound) playSound('click');
    setCurrentPath(path);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 font-mono text-xs text-slate-300 rounded-lg border border-slate-800 overflow-hidden">
      {/* HEADER NAVIGASI */}
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center gap-2.5">
        <button 
          onClick={() => navigateTo('/')} 
          disabled={currentPath === '/'}
          className="w-6 h-6 rounded bg-slate-950 hover:bg-slate-800 disabled:opacity-30 flex items-center justify-center font-bold text-slate-300"
        >
          ◀
        </button>
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1 font-mono text-emerald-400 text-[11px]">
          <span>C:\AetherOS\Desktop{currentPath === '/' ? '' : currentPath === '/pribadi' ? '\\Dokumen Pribadi' : '\\Hasil Forensik Lab'}</span>
        </div>
      </div>

      {/* VIEW GRID FILES */}
      <div className="flex-1 p-5 overflow-auto">
        {currentPath === '/' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 text-center">
            <div 
              onDoubleClick={() => navigateTo('/pribadi')}
              className="group cursor-pointer p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition-all"
            >
              <div className="text-3xl mb-1 text-yellow-500">📁</div>
              <span className="block text-[11px] font-semibold truncate">Dokumen Pribadi</span>
            </div>
            <div 
              onDoubleClick={() => navigateTo('/forensik')}
              className="group cursor-pointer p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition-all"
            >
              <div className="text-3xl mb-1 text-cyan-500">📁</div>
              <span className="block text-[11px] font-semibold truncate">Hasil Forensik Lab</span>
            </div>
            <div 
              onDoubleClick={() => onOpenFile('readme', 'README.txt', 'readme')}
              className="group cursor-pointer p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition-all"
            >
              <div className="text-3xl mb-1 text-slate-400">📄</div>
              <span className="block text-[11px] font-semibold truncate">README.txt</span>
            </div>
          </div>
        )}

        {currentPath === '/pribadi' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 text-center">
            <div 
              onDoubleClick={() => onOpenFile('jurnal_andra', 'jurnal_andra.txt', 'txt_jurnal')}
              className="group cursor-pointer p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition-all"
            >
              <div className="text-3xl mb-1 text-amber-500">📝</div>
              <span className="block text-[11px] font-semibold truncate">jurnal_andra.txt</span>
            </div>
            <div 
              onDoubleClick={() => onOpenFile('catatan_riko', 'catatan_riko.txt', 'txt_riko')}
              className="group cursor-pointer p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition-all"
            >
              <div className="text-3xl mb-1 text-slate-300">📝</div>
              <span className="block text-[11px] font-semibold truncate">catatan_riko.txt</span>
            </div>
          </div>
        )}

        {currentPath === '/forensik' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 text-center">
            <div 
              onDoubleClick={() => onOpenFile('denah_apex', 'denah_apex_corp.png', 'img_denah')}
              className="group cursor-pointer p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition-all"
            >
              <div className="text-3xl mb-1 text-purple-400">🖼️</div>
              <span className="block text-[11px] font-semibold truncate">denah_apex_corp.png</span>
            </div>
            <div 
              onDoubleClick={() => onOpenFile('foto_rontgen', 'foto_rontgen_lab.png', 'img_rontgen')}
              className="group cursor-pointer p-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition-all"
            >
              <div className="text-3xl mb-1 text-cyan-400">🖼️</div>
              <span className="block text-[11px] font-semibold truncate">foto_rontgen_lab.png</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 8. MESIN PENCARIAN SIBER DINAMIS (AETHERSEARCH) & BROWSING SITES
// =========================================================================

function AetherSearch({ onSearchNavigate, playSound }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    if (playSound) playSound('click');
    setSearched(true);

    // Filter database berdasarkan kata kunci fiktif
    const cleanQ = searchQuery.toLowerCase().trim();
    let matches = [];

    Object.keys(SEARCH_DATABASE).forEach(key => {
      if (cleanQ.includes(key) || key.includes(cleanQ)) {
        matches = [...matches, ...SEARCH_DATABASE[key]];
      }
    });

    // Menghilangkan duplikasi jika ada
    const uniqueMatches = Array.from(new Set(matches.map(a => a.title)))
      .map(title => matches.find(a => a.title === title));

    setSearchResults(uniqueMatches);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto font-sans text-xs text-slate-300">
      <div className="text-center py-6 space-y-2">
        <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 font-mono">
          AetherSearch
        </h1>
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-mono">
          Mesin Pencari Jaringan Bebas Sensor & Rahasia v2.10
        </p>
      </div>

      {/* FORM PENCARIAN */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ketik kata kunci siber (misal: 'Apex', 'Vance', 'Riko')..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50 text-xs"
        />
        <button 
          type="submit"
          className="bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/40 font-mono font-bold px-5 rounded-lg text-xs"
        >
          CARI
        </button>
      </form>

      {/* TRENDING SEARCH SHORTCUTS */}
      <div className="text-center text-[10px] text-slate-500 font-mono space-x-2">
        <span>Kueri Terpopuler:</span>
        <button type="button" onClick={() => { setSearchQuery('Apex Corp'); }} className="text-emerald-500 hover:underline">"Apex Corp"</button>
        <span>•</span>
        <button type="button" onClick={() => { setSearchQuery('Jonathan Vance'); }} className="text-emerald-500 hover:underline">"Jonathan Vance"</button>
        <span>•</span>
        <button type="button" onClick={() => { setSearchQuery('Riko adopsi'); }} className="text-emerald-500 hover:underline">"Riko"</button>
      </div>

      {/* LIST HASIL PENCARIAN */}
      {searched && (
        <div className="space-y-4 border-t border-slate-900 pt-4 font-mono animate-fade-in">
          <span className="text-[10px] text-slate-500">Ditemukan {searchResults.length} hasil investigasi siber:</span>
          
          {searchResults.length > 0 ? (
            searchResults.map((res, idx) => (
              <div key={idx} className="p-4 bg-slate-900/40 rounded-lg border border-slate-800/80 space-y-1.5">
                <h3 
                  onClick={() => onSearchNavigate(res.url)}
                  className="text-emerald-400 font-bold text-sm hover:underline cursor-pointer"
                >
                  {res.title}
                </h3>
                <span className="text-[10px] text-blue-500 block">HTTP://{res.url}</span>
                <p className="text-slate-300 leading-relaxed text-xs">{res.snippet}</p>
                {res.content && (
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-yellow-300 leading-relaxed select-text mt-2.5">
                    {res.content}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 border border-slate-900 rounded-lg bg-slate-900/10">
              ❌ Pencarian gagal. Kueri tersebut tidak terdeteksi di database kebocoran siber NetWatchers atau situs publik mana pun.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
  return (
    <div className="space-y-6 max-w-3xl mx-auto font-mono text-xs text-slate-300">
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
            <p className="text-slate-300 text-center">Hasil dekripsi adalah kunci bypass di <code className="text-blue-400 underline cursor-pointer" onClick={() => onNavigate('apex-corp.org/admin')}>apex-corp.org/admin</code>!</p>
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
    <div className="space-y-6 max-w-2xl mx-auto font-sans text-xs text-slate-300">
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

      {url === 'apex-corp.org/admin' ? (
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-slate-900 p-6 rounded-xl border border-blue-900/40 space-y-4 shadow-xl">
            {!gameState.hackedMegaCorp ? (
              <div className="space-y-3.5">
                <span className="block text-[9px] uppercase tracking-wider text-rose-500 font-bold text-center">🔐 SISTEM TERKUNCI (DATABASE PASWORD)</span>
                <input 
                  type="password"
                  value={megaCorpPassword}
                  onChange={(e) => setMegaCorpPassword(e.target.value)}
                  placeholder="KATA SANDI DEKRIPSI ADMIN"
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
                  className="w-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 py-2 rounded font-mono font-bold hover:bg-emerald-900"
                >
                  Buka & Kirim Bukti
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 font-mono leading-relaxed bg-slate-900/30 p-5 rounded-lg border border-slate-800">
          <h2 className="text-emerald-400 font-bold text-sm">Menuju Trans-Humanisme Generasi Baru</h2>
          <p className="text-slate-300">
            Misi kami di Apex Corp adalah menggabungkan teknologi siber rekayasa klinis dengan DNA manusia modern demi melahirkan generasi manusia bebas penyakit, berumur panjang, dan bertenaga optimal.
          </p>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-md text-[10px] text-slate-500">
            Situs dilindungi oleh proteksi administrasi ketat Sektor S3.
          </div>
        </div>
      )}
    </div>
  );
}

function Browser({ url, onNavigate, history, historyIndex, onBack, onForward, gameState, onUnlockJournal, onHackMegaCorp, onOpenWindow, playSound }) {
  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden text-xs">
      {/* NAVIGATION BAR */}
      <div className="bg-slate-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center gap-3">
        <div className="flex gap-1.5">
          <button 
            onClick={onBack} 
            disabled={historyIndex === 0} 
            className="w-7 h-7 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-30 flex items-center justify-center text-slate-300"
          >
            ◀
          </button>
          <button 
            onClick={onForward} 
            disabled={historyIndex === history.length - 1} 
            className="w-7 h-7 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-30 flex items-center justify-center text-slate-300"
          >
            ▶
          </button>
        </div>
        <div className="flex-1 bg-slate-900 rounded-lg px-3 py-1 flex items-center border border-slate-800">
          <span className="text-emerald-500 font-mono text-[10px] font-bold">HTTP://</span>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => onNavigate(e.target.value)} 
            className="flex-1 bg-transparent border-none outline-none font-mono text-slate-200 focus:ring-0 p-0 text-xs" 
          />
        </div>
      </div>

      {/* WEB VIEWPORT */}
      <div className="flex-1 overflow-auto bg-slate-950 p-6">
        {url === 'aethersearch.net' && (
          <AetherSearch onSearchNavigate={onNavigate} playSound={playSound} />
        )}
        {url === 'andra-journal.net' && (
          <KorbanBlog gameState={gameState} onUnlockJournal={onUnlockJournal} playSound={playSound} onNavigate={onNavigate} />
        )}
        {url === 'konspirasi-forum.id' && (
          <ForumHome playSound={playSound} onNavigate={onNavigate} />
        )}
        {url.startsWith('apex-corp.org') && (
          <MegaCorpSitus url={url} gameState={gameState} onHackMegaCorp={onHackMegaCorp} playSound={playSound} onNavigate={onNavigate} onOpenWindow={onOpenWindow} />
        )}
      </div>
    </div>
  );
}

function CryptoTool({ 
  caesarInput, 
  onCaesarInputChange, 
  caesarShift, 
  onCaesarShiftChange, 
  caesarOutput, 
  base64Input, 
  onBase64InputChange, 
  base64Output, 
  onVerifySecret,
  playSound 
}) {
  const [activeTab, setActiveTab] = useState('classic'); // 'classic', 'vigenere', 'steg', 'metadata', 'hash'
  
  // States untuk Vigenere
  const [vigText, setVigText] = useState('XGTMGF_XGTSKTM_RSTF');
  const [vigKey, setVigKey] = useState('GOLDEN');
  const [vigOutput, setVigOutput] = useState('');

  // States untuk Steganografi
  const [stegFile, setStegFile] = useState('foto_hewan.png');
  const [stegPass, setStegPass] = useState('');
  const [stegOutput, setStegOutput] = useState('');

  // States untuk Metadata GPS
  const [metaFile, setMetaFile] = useState('foto_rontgen_lab.png');
  const [metadata, setMetadata] = useState(null);

  // States untuk Hash Decrypter
  const [hashInput, setHashInput] = useState('eb823528b17b6ab86ba11b6b55979c53');
  const [hashResult, setHashResult] = useState(null);

  useEffect(() => {
    setVigOutput(vigenereDecrypt(vigText, vigKey));
  }, [vigText, vigKey]);

  useEffect(() => {
    setMetadata(getExifMetadata(metaFile));
  }, [metaFile]);

  const handleTabChange = (tabId) => {
    if (playSound) playSound('click');
    setActiveTab(tabId);
  };

  const runStegExtraction = () => {
    if (playSound) playSound('click');
    const result = stegExtract(stegFile, stegPass);
    setStegOutput(result);
    if (result.includes('[STEG_OK]')) {
      if (playSound) playSound('success');
    } else {
      if (playSound) playSound('error');
    }
  };

  const runHashCrack = () => {
    if (playSound) playSound('click');
    const res = crackHash(hashInput);
    setHashResult(res);
    if (res.success) {
      if (playSound) playSound('success');
    } else {
      if (playSound) playSound('error');
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 text-xs font-mono text-slate-300">
      
      {/* TABS HEADER */}
      <div className="flex border-b border-slate-800 pb-2 overflow-x-auto gap-1">
        <button 
          onClick={() => handleTabChange('classic')}
          className={`px-3 py-1.5 rounded-t-lg font-bold transition-all ${activeTab === 'classic' ? 'bg-rose-950/40 text-rose-400 border-b-2 border-rose-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          🔑 Caesar & ROT13
        </button>
        <button 
          onClick={() => handleTabChange('vigenere')}
          className={`px-3 py-1.5 rounded-t-lg font-bold transition-all ${activeTab === 'vigenere' ? 'bg-blue-950/40 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          📝 Vigenere Cipher
        </button>
        <button 
          onClick={() => handleTabChange('steg')}
          className={`px-3 py-1.5 rounded-t-lg font-bold transition-all ${activeTab === 'steg' ? 'bg-purple-950/40 text-purple-400 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          📷 StegTool
        </button>
        <button 
          onClick={() => handleTabChange('metadata')}
          className={`px-3 py-1.5 rounded-t-lg font-bold transition-all ${activeTab === 'metadata' ? 'bg-emerald-950/40 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          🗺️ EXIF GPS Viewer
        </button>
        <button 
          onClick={() => handleTabChange('hash')}
          className={`px-3 py-1.5 rounded-t-lg font-bold transition-all ${activeTab === 'hash' ? 'bg-amber-950/40 text-amber-400 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          🛡️ Hash Decrypter
        </button>
      </div>

      {/* VIEWPORT TAB CONTENT */}
      <div className="flex-1 overflow-auto">
        
        {/* TAB 1: CAESAR & ROT13 */}
        {activeTab === 'classic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-rose-400 font-bold border-b border-slate-900 pb-1.5 mb-2">SOLVER: CAESAR CIPHER</h3>
                <div>
                  <label className="block text-slate-500 text-[10px] mb-1">Teks Sandi (Chipertext):</label>
                  <input 
                    type="text" 
                    value={caesarInput}
                    onChange={(e) => onCaesarInputChange(e.target.value.toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-100 focus:outline-none focus:border-rose-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] mb-1">Pergeseran Mundur: {caesarShift}</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="25" 
                    value={caesarShift}
                    onChange={(e) => onCaesarShiftChange(parseInt(e.target.value, 10))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { onCaesarShiftChange(13); if (playSound) playSound('click'); }}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 py-1 rounded border border-slate-800 font-bold text-[10px]"
                  >
                    Set ke ROT13 (Geser 13)
                  </button>
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-rose-950/40 text-center mt-4">
                <span className="block text-slate-500 text-[9px] mb-1">HASIL DEKRIPSI CAESAR:</span>
                <span className="text-emerald-400 font-bold text-sm tracking-widest block">{caesarOutput || '---'}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-blue-400 font-bold border-b border-slate-900 pb-1.5 mb-2">SOLVER: BASE64 DECODER</h3>
                <div>
                  <label className="block text-slate-500 text-[10px] mb-1">String Terkompresi (Base64):</label>
                  <input 
                    type="text" 
                    value={base64Input}
                    onChange={(e) => onBase64InputChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-100 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-blue-950/40 text-center mt-4">
                <span className="block text-slate-500 text-[9px] mb-1">HASIL DEKRIPSI BASE64:</span>
                <span className="text-emerald-400 font-bold text-sm tracking-widest block">{base64Output || '---'}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VIGENERE CIPHER */}
        {activeTab === 'vigenere' && (
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between h-full max-w-xl mx-auto">
            <div className="space-y-3">
              <h3 className="text-blue-400 font-bold border-b border-slate-900 pb-1.5 mb-2">VIGENERE DECRYPTER</h3>
              <div>
                <label className="block text-slate-500 text-[10px] mb-1">Teks Sandi (Chipertext):</label>
                <input 
                  type="text" 
                  value={vigText}
                  onChange={(e) => setVigText(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] mb-1">Kunci Rahasia (Key):</label>
                <input 
                  type="text" 
                  value={vigKey}
                  onChange={(e) => setVigKey(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-blue-950/40 text-center mt-6">
              <span className="block text-slate-500 text-[9px] mb-1">HASIL DEKRIPSI VIGENERE:</span>
              <span className="text-emerald-400 font-bold text-base tracking-widest block">{vigOutput || '---'}</span>
            </div>
          </div>
        )}

        {/* TAB 3: STEGANOGRAPHY */}
        {activeTab === 'steg' && (
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between h-full max-w-xl mx-auto">
            <div className="space-y-3.5">
              <h3 className="text-purple-400 font-bold border-b border-slate-900 pb-1.5 mb-2">STEGANOGRAPHY SCANNER (STEGTOOL)</h3>
              <div>
                <label className="block text-slate-500 text-[10px] mb-1">Pilih File Gambar:</label>
                <select 
                  value={stegFile}
                  onChange={(e) => setStegFile(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-slate-300 focus:outline-none"
                >
                  <option value="foto_hewan.png">foto_hewan.png (Gambar Anjing Riko)</option>
                  <option value="denah_apex_corp.png">denah_apex_corp.png (Cetak Biru Lab)</option>
                  <option value="foto_rontgen_lab.png">foto_rontgen_lab.png (Pindaian Medis)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 text-[10px] mb-1">Kunci Sandi Ekstraksi:</label>
                <input 
                  type="text" 
                  placeholder="Masukkan password untuk membuka enkripsi steganografi..."
                  value={stegPass}
                  onChange={(e) => setStegPass(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-purple-600"
                />
              </div>
              <button 
                onClick={runStegExtraction}
                className="w-full py-2 bg-purple-900/50 hover:bg-purple-900 border border-purple-800/40 text-purple-300 font-bold rounded-md transition-colors"
              >
                Mulai Ekstraksi Piksel Rahasia
              </button>
            </div>
            {stegOutput && (
              <div className="p-3 bg-slate-900 rounded-lg border border-purple-950/40 text-left mt-4 text-[11px] font-mono leading-relaxed">
                {stegOutput}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: EXIF GPS METADATA */}
        {activeTab === 'metadata' && (
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between h-full max-w-xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-emerald-400 font-bold border-b border-slate-900 pb-1.5 mb-2">METADATA EXIF INSPECTOR & GPS TRACKER</h3>
              <div>
                <label className="block text-slate-500 text-[10px] mb-1">Pilih File untuk Diinspeksi:</label>
                <select 
                  value={metaFile}
                  onChange={(e) => setMetaFile(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-slate-300 focus:outline-none"
                >
                  <option value="foto_rontgen_lab.png">foto_rontgen_lab.png</option>
                  <option value="denah_apex_corp.png">denah_apex_corp.png</option>
                </select>
              </div>

              {metadata && (
                <div className="space-y-2 bg-slate-900/60 p-4 rounded-lg border border-slate-800/60 text-[11px] font-mono">
                  <p><span className="text-emerald-500 font-bold">KAMERA PERANGKAT :</span> {metadata.camera}</p>
                  <p><span className="text-emerald-500 font-bold">WAKTU DIAMBIL    :</span> {metadata.date}</p>
                  <p><span className="text-emerald-500 font-bold">SOFTWARE EXPORT  :</span> {metadata.software}</p>
                  <p className="border-t border-slate-800 pt-2.5 mt-2.5">
                    <span className="text-rose-400 font-bold block mb-1">KOORDINAT LOKASI (GPS DATA):</span>
                    <span className="bg-slate-950 px-2 py-1.5 rounded block text-center font-bold text-emerald-400 text-xs border border-slate-800/80 select-all">
                      {metadata.gps}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: HASH CRACKER */}
        {activeTab === 'hash' && (
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between h-full max-w-xl mx-auto">
            <div className="space-y-3.5">
              <h3 className="text-amber-400 font-bold border-b border-slate-900 pb-1.5 mb-2">HASH REVERSE DECRYPTER (DATABASE LEAK MATCH)</h3>
              <div>
                <label className="block text-slate-500 text-[10px] mb-1">Masukkan Nilai MD5 atau SHA-256 Hash:</label>
                <input 
                  type="text" 
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-600"
                />
              </div>
              <button 
                onClick={runHashCrack}
                className="w-full py-2 bg-amber-900/50 hover:bg-amber-900 border border-amber-800/40 text-amber-300 font-bold rounded-md transition-colors"
              >
                Cari Kecocokan di Database Bocoran Siber
              </button>
            </div>
            {hashResult && (
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 mt-4 text-[11px] font-mono space-y-2">
                <p className={`${hashResult.success ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}`}>{hashResult.msg}</p>
                {hashResult.success && (
                  <p className="bg-slate-950 p-2 rounded text-center text-xs font-bold text-amber-400 border border-slate-800 select-all">
                    TEKS ASLI: {hashResult.result}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* FOOTER VERIFIKASI */}
      <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
        <span className="text-slate-500 hidden sm:inline">Pecahkan sandi jurnal lalu verifikasi hasilnya:</span>
        <button 
          onClick={onVerifySecret}
          className="w-full sm:w-auto px-5 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-900/50 rounded-md font-bold transition-all hover:scale-105 active:scale-95"
        >
          Verifikasi Kunci Forensik
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// 9. APLIKASI UTAMA (DEFAULT EXPORT)
// =========================================================================

export default function App() {
  // Pengaturan Windows Desktop Awal
  const [windows, setWindows] = useState([
    { 
      id: 'readme', 
      title: 'README.txt', 
      x: 60, 
      y: 80, 
      w: 520, 
      h: 390, 
      zIndex: 10, 
      minimized: false, 
      content: 'readme' 
    },
    { 
      id: 'terminal', 
      title: 'Terminal Forensik v1.05', 
      x: 480, 
      y: 120, 
      w: 620, 
      h: 400, 
      zIndex: 5, 
      minimized: false, 
      content: 'terminal' 
    }
  ]);

  const [activeWindow, setActiveWindow] = useState('readme');
  
  // State Game
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('aether_game_state_v2');
    return saved ? JSON.parse(saved) : { 
      unlockedAndraJournal: false, 
      unlockedBase64: false, 
      hackedMegaCorp: false, 
      gameCompleted: false,
      chosenEnding: null // 'whistleblower', 'blackmail', 'corporate'
    };
  });

  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('aether_emails_v2');
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });

  const [activeEmailId, setActiveEmailId] = useState('mail-1');
  const [terminalHistory, setTerminalHistory] = useState([
    { text: '==================================================', type: 'system' },
    { text: 'AETHER FORENSIC OPERATING SYSTEM [Version 1.05.90]', type: 'system' },
    { text: 'DEPARTEMEN TEKNOLOGI FORENSIK INDEPENDEN - NETWATCHERS', type: 'system' },
    { text: '==================================================', type: 'system' },
    { text: 'Sistem mendeteksi 2 surel darurat baru dalam antrean.', type: 'warning' },
    { text: 'Ketik "help" untuk melihat daftar instruksi siber.', type: 'system' },
    { text: '', type: 'blank' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef(null);

  // States untuk Browser & SolverSandi
  const [browserUrl, setBrowserUrl] = useState('aethersearch.net'); // Memulai dari search engine dinamis
  const [browserHistory, setBrowserHistory] = useState(['aethersearch.net']);
  const [browserHistoryIndex, setBrowserHistoryIndex] = useState(0);

  const [caesarInput, setCaesarInput] = useState('XGTMGF_XGTSKTM_RSTF');
  const [caesarShift, setCaesarShift] = useState(7);
  const [caesarOutput, setCaesarOutput] = useState('');
  const [base64Input, setBase64Input] = useState('QVBFWF9HRU5FU0lTXzIwMjY=');
  const [base64Output, setBase64Output] = useState('');

  // Sesi Dragging Window
  const [dragStart, setDragStart] = useState(null);
  const [draggingWinId, setDraggingWinId] = useState(null);

  // Auto Scroll Terminal
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  // Sinkronisasi Caesar & Base64 secara instan
  useEffect(() => {
    setCaesarOutput(caesarDecrypt(caesarInput.toUpperCase(), caesarShift));
  }, [caesarInput, caesarShift]);

  useEffect(() => {
    setBase64Output(base64Decode(base64Input));
  }, [base64Input]);

  // Simpan data state secara lokal
  useEffect(() => {
    localStorage.setItem('aether_game_state_v2', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('aether_emails_v2', JSON.stringify(emails));
  }, [emails]);

  // Manajemen Z-Index Window desktop
  const getHighestZ = () => {
    if (windows.length === 0) return 0;
    return Math.max(...windows.map(w => w.zIndex || 0));
  };

  const focusWindow = (id) => {
    setActiveWindow(id);
    const highestZ = getHighestZ();
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: highestZ + 1, minimized: false } : w));
  };

  const openWindow = (id, title, wWidth = 600, wHeight = 440) => {
    playSound('click');
    const exists = windows.find(w => w.id === id);
    const nextZ = getHighestZ() + 1;

    if (exists) {
      setWindows(windows.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w));
      setActiveWindow(id);
    } else {
      const offset = (windows.length * 28) % 180;
      setWindows([
        ...windows, 
        { 
          id, 
          title, 
          x: 120 + offset, 
          y: 90 + offset, 
          w: wWidth, 
          h: wHeight, 
          zIndex: nextZ, 
          minimized: false, 
          content: id 
        }
      ]);
      setActiveWindow(id);
    }
  };

  const closeWindow = (id) => {
    playSound('click');
    setWindows(windows.filter(w => w.id !== id));
  };

  const minimizeWindow = (id) => {
    playSound('click');
    setWindows(windows.map(w => w.id === id ? { ...w, minimized: true } : w));
  };

  // Handler khusus untuk membuka berkas dari File Explorer
  const handleOpenFileFromExplorer = (fileId, fileName, fileType) => {
    playSound('beep');
    if (fileType === 'readme') {
      openWindow('readme', 'README.txt', 520, 390);
    } else if (fileType === 'txt_jurnal') {
      openWindow('buku_catatan_jurnal', 'BukuCatatan - jurnal_andra.txt', 540, 410);
    } else if (fileType === 'txt_riko') {
      openWindow('buku_catatan_riko', 'BukuCatatan - catatan_riko.txt', 540, 410);
    } else if (fileType === 'img_denah') {
      openWindow('img_view_denah', 'Penampil Gambar - denah_apex_corp.png', 480, 490);
    } else if (fileType === 'img_rontgen') {
      openWindow('img_view_rontgen', 'Penampil Gambar - foto_rontgen_lab.png', 480, 490);
    }
  };

  // Navigasi URL Browser Internal
  const handleBrowserNavigate = (newUrl) => {
    const cleanUrl = newUrl.trim().toLowerCase();
    setBrowserUrl(cleanUrl);
    const nextHistory = browserHistory.slice(0, browserHistoryIndex + 1);
    setBrowserHistory([...nextHistory, cleanUrl]);
    setBrowserHistoryIndex(nextHistory.length);
  };

  // Eksekusi Konsol Terminal
  const handleCommandSubmit = () => {
    const input = terminalInput.trim().toLowerCase();
    if (!input) return;

    setTerminalHistory(prev => [...prev, { text: `User@AetherOS:~$ ${terminalInput}`, type: 'input' }]);
    setTerminalInput('');

    const args = input.split(' ');
    const cmd = args[0];

    switch (cmd) {
      case 'help':
        setTerminalHistory(prev => [
          ...prev,
          { text: '--- DAFTAR PERINTAH FORENSIK DISEDIAKAN ---', type: 'title' },
          { text: 'ls           : Melihat isi direktori desktop aktif.', type: 'system' },
          { text: 'cat [file]   : Membaca berkas dokumen teks secara langsung.', type: 'system' },
          { text: 'decrypt-c    : Menjalankan utilitas brute-force Caesar Cipher.', type: 'system' },
          { text: 'secret-hack  : Membuka gerbang administrator Apex Corp lewat terminal.', type: 'system' },
          { text: 'emails       : Membuka aplikasi Klien Surel lokal.', type: 'system' },
          { text: 'explorer     : Membuka program visual penjelajah berkas (File Explorer).', type: 'system' },
          { text: 'clear        : Membersihkan seluruh log riwayat terminal.', type: 'system' }
        ]);
        break;

      case 'ls':
        setTerminalHistory(prev => [
          ...prev,
          { text: 'Direktori: /home/user/desktop', type: 'title' },
          { text: '-rwxr-xr-x   README.txt  (240 bytes)', type: 'system' },
          { text: '-r--r--r--   jurnal_andra.txt  (TERENKRIPSI - CAESAR OFFSET)', type: 'warning' },
          { text: '-rwxr-xr-x   Explorer.exe  (Aplikasi Penjelajah Berkas)', type: 'success' }
        ]);
        break;

      case 'cat':
        if (args[1] === 'readme.txt' || args[1] === 'readme') {
          setTerminalHistory(prev => [
            ...prev,
            { text: '=== AETHER OS SECURE INSTRUCTIONS ===\nSelamat datang rekan investigator. Gunakan modul "SolverSandi" di desktop untuk menganalisis dokumen jurnal yang diwariskan oleh Andra Kirana.\nMata-mata korporat Apex Corp terus mengamati jalur lalu lintas web kita. Selesaikan enkripsinya!', type: 'system' }
          ]);
        } else if (args[1] === 'jurnal_andra.txt' || args[1] === 'jurnal_andra') {
          setTerminalHistory(prev => [
            ...prev,
            { text: '=== ISI BERKAS: jurnal_andra.txt ===\nTEKS ASLI TERKUNCI ENKRIPSI CAESAR (OFFSET KEDATANGAN RIKO).\n\nTeks Terenkripsi:\n"XGTMGF_XGTSKTM_RSTF"\n\nGunakan SolverSandi di desktop Anda untuk memecahkan sandi geser mundur ini!', type: 'warning' }
          ]);
        } else {
          setTerminalHistory(prev => [...prev, { text: `cat: berkas "${args[1] || ''}" tidak ditemukan.`, type: 'error' }]);
        }
        break;

      case 'decrypt-c':
        setTerminalHistory(prev => [
          ...prev,
          { text: 'Membuka aplikasi sandi eksternal...', type: 'system' }
        ]);
        openWindow('cryptotool', 'Solver Sandi', 600, 430);
        break;

      case 'emails':
        setTerminalHistory(prev => [...prev, { text: 'Membuka MailClient...', type: 'system' }]);
        openWindow('emails', 'Klien Surel Forensik', 720, 420);
        break;

      case 'explorer':
        setTerminalHistory(prev => [...prev, { text: 'Membuka program FileExplorer visual...', type: 'system' }]);
        openWindow('explorer', 'Penjelajah Berkas (Explorer.exe)', 620, 420);
        break;

      case 'secret-hack':
        const secretCode = args[1];
        if (secretCode === 'apex_genesis_2026') {
          playSound('success');
          setGameState(prev => ({ ...prev, hackedMegaCorp: true }));
          setTerminalHistory(prev => [
            ...prev,
            { text: '🔓 [BYPASS SUCCESS] Hak akses Administrator Apex Corp berhasil diambil alih!', type: 'success' },
            { text: 'Log bukti klinis fiktif telah diekstraksi ke desktop. Membuka gerbang utama...', type: 'system' }
          ]);
          openWindow('browser', 'Web Browser', 860, 560);
          setBrowserUrl('apex-corp.org/admin');
        } else {
          playSound('error');
          setTerminalHistory(prev => [
            ...prev,
            { text: '❌ [AUTENTIKASI GAGAL] Kode verifikasi gerbang korporat salah atau kadaluarsa!', type: 'error' }
          ]);
        }
        break;

      case 'clear':
        setTerminalHistory([]);
        break;

      default:
        setTerminalHistory(prev => [
          ...prev,
          { text: `Perintah "${cmd}" tidak dikenali oleh AetherOS. Ketik "help" untuk bantuan instruksi.`, type: 'error' }
        ]);
    }
  };

  // Logika Drag & Drop Window Desktop
  const handlePointerDown = (e, winId) => {
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

    setWindows(windows.map(w => {
      if (w.id === draggingWinId) {
        return {
          ...w,
          x: Math.max(0, dragStart.winX + dx),
          y: Math.max(0, dragStart.winY + dy)
        };
      }
      return w;
    }));
  };

  const handlePointerUp = () => {
    setDragStart(null);
    setDraggingWinId(null);
  };

  // Skenario Akhir Cerita (Multi-Ending Handler)
  const chooseGameEnding = (endingType) => {
    playSound('alarm');
    setGameState(prev => ({
      ...prev,
      gameCompleted: true,
      chosenEnding: endingType
    }));
  };

  const resetGameSystem = () => {
    playSound('success');
    setGameState({
      unlockedAndraJournal: false,
      unlockedBase64: false,
      hackedMegaCorp: false,
      gameCompleted: false,
      chosenEnding: null
    });
    setWindows([
      { id: 'readme', title: 'README.txt', x: 60, y: 80, w: 520, h: 390, zIndex: 10, minimized: false, content: 'readme' },
      { id: 'terminal', title: 'Terminal Forensik v1.05', x: 480, y: 120, w: 620, h: 400, zIndex: 5, minimized: false, content: 'terminal' }
    ]);
    setBrowserUrl('aethersearch.net');
    localStorage.removeItem('aether_game_state_v2');
    localStorage.removeItem('aether_emails_v2');
  };

  return (
    <div 
      className="relative w-screen h-screen bg-[#070b13] overflow-hidden select-none"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* TAMPILAN KHUSUS CUTSCENE ENDING PERMAINAN */}
      {gameState.gameCompleted && gameState.chosenEnding && (
        <div className="absolute inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-6 font-mono">
          <div className="max-w-xl w-full bg-slate-900 border-2 border-emerald-500/30 p-8 rounded-2xl shadow-2xl shadow-emerald-950/20 space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-900/40 pb-4">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping"></span>
              <h1 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">
                Laporan Transmisi Akhir: AetherOS
              </h1>
            </div>

            {/* SELEKSI OUTPUT ENDING BERDASARKAN KEPUTUSAN PEMAIN */}
            {gameState.chosenEnding === 'whistleblower' && (
              <div className="space-y-4 leading-relaxed text-xs">
                <h2 className="text-base font-black text-emerald-400">ENDING 1: JALUR WHISTLEBLOWER (KEBENARAN PUBLIK)</h2>
                <p className="text-slate-300">
                  Anda menolak semua tawaran uang suap dan menyebarkan berkas <code className="text-yellow-400">Genesis_Clinical_Failsafe.bin</code> langsung ke portal jurnalisme global dan jaringan NetWatchers.
                </p>
                <p className="text-slate-400">
                  Dalam kurun waktu 12 jam, bukti klinis manipulasi genetika ilegal pada manusia oleh Apex Corp menjadi viral di seluruh dunia. Publik mengamuk. Investigasi federal resmi dibuka dan memaksa Dr. Jonathan Vance mengundurkan diri dalam kehinaan. Komite Etik menuntut penutupan laboratorium Sektor S2.
                </p>
                <p className="text-amber-400 font-bold">
                  KONSEKUENSI: Apex Corp runtuh. Namun, tim taktis tak dikenal mendatangi apartemen Anda. Keselamatan fisik Andra Kirana berada di bawah perlindungan darurat hacker siber, namun ia harus menghabiskan sisa hidupnya dalam pelarian rahasia di bawah tanah.
                </p>
              </div>
            )}

            {gameState.chosenEnding === 'blackmail' && (
              <div className="space-y-4 leading-relaxed text-xs">
                <h2 className="text-base font-black text-amber-400">ENDING 2: JALUR BLACKMAIL (PEMERASAN PEMILIK)</h2>
                <p className="text-slate-300">
                  Anda memutuskan untuk bersikap egois. Anda mengunci seluruh berkas bukti klinis fiktif di server lokal luar, lalu mengirim surel enkripsi balik kepada CEO Apex Corp, meminta tebusan sebesar <code className="text-yellow-400">500 Bitcoin</code>.
                </p>
                <p className="text-slate-400">
                  Menerima ancaman kehancuran reputasi korporat raksasanya, Dr. Jonathan Vance menyetujui transaksi tersembunyi tersebut secara instan. Saldo dompet kripto anonim Anda melonjak drastis dalam hitungan menit.
                </p>
                <p className="text-rose-400 font-bold">
                  KONSEKUENSI: Anda kini menjadi milyarder baru yang tinggal di pulau tropis bebas ekstradisi. Tetapi, Andra Kirana dinyatakan 'hilang secara permanen' dari semua basis data publik korporasi. Jurnal digital miliknya dihapus dari internet, dan rasa bersalah akan membayangi tidur nyenyak Anda selamanya.
                </p>
              </div>
            )}

            {gameState.chosenEnding === 'corporate' && (
              <div className="space-y-4 leading-relaxed text-xs">
                <h2 className="text-base font-black text-blue-400">ENDING 3: JALUR AGEN KORPORAT (KONTRAPAKSI)</h2>
                <p className="text-slate-300">
                  Anda memilih jalur loyalitas baru. Anda menghubungi saluran darurat keamanan internal Apex Corp, menyerahkan seluruh dekripsi data siber, dan menghapus sisa file cadangan di laptop Andra Kirana dari jaringan publik.
                </p>
                <p className="text-slate-400">
                  Dr. Jonathan Vance sangat terkesan dengan efisiensi kerja forensik Anda. Kebocoran siber ini berhasil ditambal rapat-rapat tanpa sempat menyentuh permukaan pers korporat.
                </p>
                <p className="text-emerald-400 font-bold">
                  KONSEKUENSI: Anda secara resmi direkrut sebagai Direktur Keamanan Informasi Baru di Apex Biotech Corp dengan kompensasi gaji tak terbatas. Proyek mutasi sel manusia rahasia "Genesis" berlanjut tanpa hambatan. Andra Kirana dideportasi ke fasilitas isolasi medis fiktif milik korporat tanpa ada yang pernah mencarinya lagi.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-emerald-900/40 flex justify-center">
              <button 
                onClick={resetGameSystem}
                className="px-6 py-2.5 bg-slate-950 border border-emerald-500/30 hover:bg-emerald-950 hover:border-emerald-400 text-emerald-400 hover:text-white rounded-md text-xs font-bold font-mono transition-all uppercase"
              >
                🔄 Boot Ulang Sistem AetherOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BAR ATAS OS (BAR STATUS) */}
      <header className="absolute top-0 inset-x-0 h-11 bg-slate-950/80 border-b border-slate-900/60 backdrop-blur-md z-30 px-6 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="font-extrabold text-emerald-400 tracking-wider flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            AETHER-OS v2.10
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">Kontak Darurat: Andra Kirana</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-slate-500 flex gap-2">
            <span>RAM: <strong className="text-emerald-500">38%</strong></span>
            <span>PING: <strong className="text-cyan-500">18ms</strong></span>
          </div>
          <button 
            onClick={resetGameSystem}
            className="text-red-400 bg-red-950/30 hover:bg-red-900 hover:text-white border border-red-900/40 px-3 py-1 rounded transition-colors text-[10px]"
          >
            RESET GAME
          </button>
        </div>
      </header>

      {/* MAIN DESKTOP PANEL */}
      <main className="absolute inset-0 pt-16 pb-16 px-6 flex flex-col gap-6 items-start content-start flex-wrap z-10">
        {/* Ikon Desktop README.txt */}
        <button 
          onDoubleClick={() => openWindow('readme', 'README.txt', 520, 390)}
          className="w-20 group text-center focus:outline-none"
        >
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 rounded-xl flex items-center justify-center text-xl text-amber-400 mx-auto transition-all shadow-lg">
            📄
          </div>
          <span className="text-[11px] font-mono text-slate-300 block mt-1.5 truncate font-semibold">
            README.txt
          </span>
        </button>

        {/* Ikon Desktop Terminal.sys */}
        <button 
          onDoubleClick={() => openWindow('terminal', 'Terminal Forensik v1.05', 620, 400)}
          className="w-20 group text-center focus:outline-none"
        >
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 rounded-xl flex items-center justify-center text-xl text-emerald-400 mx-auto transition-all shadow-lg">
            💻
          </div>
          <span className="text-[11px] font-mono text-slate-300 block mt-1.5 truncate font-semibold">
            Terminal.sys
          </span>
        </button>

        {/* Ikon Desktop Explorer.exe */}
        <button 
          onDoubleClick={() => openWindow('explorer', 'Penjelajah Berkas (Explorer.exe)', 620, 420)}
          className="w-20 group text-center focus:outline-none"
        >
          <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/40 rounded-xl flex items-center justify-center text-xl text-yellow-500 mx-auto transition-all shadow-lg">
            📁
          </div>
          <span className="text-[11px] font-mono text-slate-300 block mt-1.5 truncate font-semibold">
            Explorer.exe
          </span>
        </button>

        {/* Ikon Desktop Surel.exe */}
        <button 
          onDoubleClick={() => openWindow('emails', 'Klien Surel Forensik', 720, 420)}
          className="w-20 group text-center focus:outline-none"
        >
          <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 rounded-xl flex items-center justify-center text-xl text-purple-400 mx-auto transition-all shadow-lg">
            📬
          </div>
          <span className="text-[11px] font-mono text-slate-300 block mt-1.5 truncate font-semibold">
            Surel.exe
          </span>
        </button>

        {/* Ikon Desktop Browser.sys */}
        <button 
          onDoubleClick={() => openWindow('browser', 'Web Browser', 860, 560)}
          className="w-20 group text-center focus:outline-none"
        >
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 rounded-xl flex items-center justify-center text-xl text-blue-400 mx-auto transition-all shadow-lg">
            🌐
          </div>
          <span className="text-[11px] font-mono text-slate-300 block mt-1.5 truncate font-semibold">
            Browser.sys
          </span>
        </button>

        {/* Ikon Desktop SolverSandi */}
        <button 
          onDoubleClick={() => openWindow('cryptotool', 'Solver Sandi', 600, 430)}
          className="w-20 group text-center focus:outline-none"
        >
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 group-hover:bg-rose-500/20 group-hover:border-rose-500/40 rounded-xl flex items-center justify-center text-xl text-rose-400 mx-auto transition-all shadow-lg">
            🔑
          </div>
          <span className="text-[11px] font-mono text-slate-300 block mt-1.5 truncate font-semibold">
            SolverSandi
          </span>
        </button>

        {/* Ikon Desktop BUKTI KORPORAT (Terbuka setelah meretas Apex Corp) */}
        {gameState.hackedMegaCorp && (
          <button 
            onDoubleClick={() => openWindow('victory', 'BUKTI_TERKUMPUL.TXT', 520, 390)}
            className="w-20 group text-center focus:outline-none animate-bounce"
          >
            <div className="w-12 h-12 bg-red-500/20 border-2 border-red-500/60 rounded-xl flex items-center justify-center text-xl text-red-500 mx-auto transition-all shadow-lg shadow-red-500/20">
              📁
            </div>
            <span className="text-[11px] font-mono text-red-400 block mt-1.5 truncate font-extrabold">
              BUKTI_APEX
            </span>
          </button>
        )}
      </main>

      {/* RENDER WINDOWS SECARA DINAMIS */}
      {windows.map((win) => {
        if (win.minimized) return null;

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
            isActive={activeWindow === win.id}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onDragStart={(e) => handlePointerDown(e, win.id)}
          >
            {/* KONTEN: README.TXT */}
            {win.content === 'readme' && (
              <div className="font-mono text-xs text-slate-300 leading-relaxed space-y-3.5 select-text">
                <div className="border-b border-slate-800 pb-2 flex justify-between text-[10px] text-slate-500">
                  <span>BERKAS: README.txt</span>
                  <span>UKURAN: 240 Bytes</span>
                </div>
                <h3 className="text-emerald-400 font-bold text-sm">PROTOKOL ANALISIS SOSIAL SIBER:</h3>
                <p>
                  Sistem pemulihan mati darurat mendeteksi hilangnya Andra Kirana. Berkas enkripsi jurnal miliknya ditinggalkan di dalam sistem desktop.
                </p>
                <p className="bg-slate-950 p-2.5 rounded border border-slate-800 text-yellow-300 font-bold">
                  KUNCI UTAMA: "Tanggal hari jadi anjing kesayanganku, Riko, dengan pergeseran mundur (Caesar) sebanyak tanggal tersebut."
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-1 text-slate-400">
                  <p>1. Buka <strong>Browser.sys</strong> untuk mencari petunjuk fiktif di mesin pencari <code className="text-blue-400">AetherSearch</code>.</p>
                  <p>2. Cari data mengenai hobi Riko dan tanggal kedatangannya untuk meretas berkas jurnal.</p>
                  <p>3. Masukkan teks bersandi ke <strong>SolverSandi</strong> untuk memecahkan sandi Caesar, Vigenere, Steganografi, hingga Hash database.</p>
                </div>
              </div>
            )}

            {/* KONTEN: TERMINAL CONSOLE */}
            {win.content === 'terminal' && (
              <Terminal
                history={terminalHistory}
                currentInput={terminalInput}
                onInputChange={setTerminalInput}
                onSubmitCommand={handleCommandSubmit}
                bottomRef={terminalBottomRef}
                playSound={playSound}
              />
            )}

            {/* KONTEN: FILE EXPLORER (EXPLORER.EXE) */}
            {win.content === 'explorer' && (
              <FileExplorer
                onOpenFile={handleOpenFileFromExplorer}
                playSound={playSound}
              />
            )}

            {/* KONTEN: BUKU CATATAN (INTERACTIVE HIGHLIGHTER) */}
            {win.content === 'buku_catatan_jurnal' && (
              <BukuCatatan
                fileName="jurnal_andra.txt"
                content='PROTOKOL FORENSIK JURNAL ANDRA KIRANA:\n\nSandi dekripsi utama draf ini adalah: "ANDRA_BERMAIN_BOLA".\nAku telah menyembunyikan kunci siber di dalam forum konspirasi-forum.id pada utas ShadowPuppet. Pastikan kamu memecahkan sandi Base64 di forum itu lalu lakukan bypass admin di situs apex-corp.org/admin menggunakan nilai terenkripsi tersebut!'
                playSound={playSound}
              />
            )}

            {win.content === 'buku_catatan_riko' && (
              <BukuCatatan
                fileName="catatan_riko.txt"
                content="Laporan Keseharian Riko:\nHobi utama Riko adalah bermain bola! Dia suka sekali menangkap bola tenis hijau di taman bermain belakang shelter adopsi.\n\nMasukkan kata sandi 'RIKO' ke dalam utilitas StegTool pada tab SolverSandi dengan mengunggah foto_hewan.png untuk melacak koordinat GPS penangkapan rahasia!"
                playSound={playSound}
              />
            )}

            {/* KONTEN: IMAGE VIEWER */}
            {win.content === 'img_view_denah' && (
              <ImageViewer imageName="denah_apex_corp.png" />
            )}

            {win.content === 'img_view_rontgen' && (
              <ImageViewer imageName="foto_rontgen_lab.png" />
            )}

            {/* KONTEN: MAIL CLIENT */}
            {win.content === 'emails' && (
              <EmailClient
                emails={emails}
                activeEmailId={activeEmailId}
                onSelectEmail={setActiveEmailId}
                playSound={playSound}
              />
            )}

            {/* KONTEN: WEB BROWSER */}
            {win.content === 'browser' && (
              <Browser
                url={browserUrl}
                onNavigate={handleBrowserNavigate}
                history={browserHistory}
                historyIndex={browserHistoryIndex}
                onBack={() => {
                  if (browserHistoryIndex > 0) {
                    setBrowserHistoryIndex(browserHistoryIndex - 1);
                    setBrowserUrl(browserHistory[browserHistoryIndex - 1]);
                  }
                }}
                onForward={() => {
                  if (browserHistoryIndex < browserHistory.length - 1) {
                    setBrowserHistoryIndex(browserHistoryIndex + 1);
                    setBrowserUrl(browserHistory[browserHistoryIndex + 1]);
                  }
                }}
                gameState={gameState}
                onUnlockJournal={() => setGameState(prev => ({ ...prev, unlockedAndraJournal: true }))}
                onHackMegaCorp={() => setGameState(prev => ({ ...prev, hackedMegaCorp: true }))}
                onOpenWindow={openWindow}
                playSound={playSound}
              />
            )}

            {/* KONTEN: SOLVER SANDI (CRYPTOTOOL) */}
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
                  if (caesarOutput === 'ANDRA_BERMAIN_BOLA') {
                    playSound('success');
                    setGameState(prev => ({ ...prev, unlockedAndraJournal: true }));
                    alert('🔓 DEKRIPSI COCOK! Jurnal rahasia Andra Kirana di Browser berhasil dibuka otomatis!');
                  } else {
                    playSound('error');
                    alert('❌ HASIL DEKRIPSI TIDAK VALID. Periksa kembali teks input dan pergeseran mundur!');
                  }
                }}
                playSound={playSound}
              />
            )}

            {/* KONTEN WINDOWS VICTORY (ALUR CERITA BERCABANG) */}
            {win.content === 'victory' && (
              <div className="font-mono text-xs space-y-4 text-slate-300 select-text leading-relaxed">
                <div className="border-b border-red-950 pb-2 text-center">
                  <span className="text-red-500 font-bold block animate-pulse">
                    🚨 SYSTEM ALARM: BUKTI UTAMA REKAYASA GENETIKA APEX CORP TERKUMPUL 🚨
                  </span>
                </div>
                <p>
                  Anda telah mengunduh paket logs klinis komprehensif <code className="text-yellow-400">Genesis_Clinical_Failsafe.bin</code> dari basis data admin Apex Biotech. Bukti ini membuktikan manipulasi data gen manusia ilegal.
                </p>
                <div className="p-3 bg-slate-950 rounded-lg border border-red-900/40">
                  <span className="text-rose-500 font-bold block mb-1">DATA ANALISIS PEMILIK (CEO):</span>
                  <p className="text-[11px] text-slate-400">
                    Dr. Jonathan Vance mengesahkan uji klinis mematikan di Sektor S2 demi keuntungan korporasi bernilai jutaan dolar.
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <span className="text-slate-400 font-bold block mb-2 uppercase text-[10px]">
                    TENTUKAN PILIHAN AKHIR DETEKTIF ANDA:
                  </span>

                  {/* ENDING PILIHAN 1 */}
                  <button 
                    onClick={() => chooseGameEnding('whistleblower')}
                    className="w-full text-left p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 hover:bg-emerald-950/40 transition-colors group flex items-start gap-3 focus:outline-none"
                  >
                    <span className="bg-emerald-950 text-emerald-400 px-2 py-1 rounded font-bold text-[10px]">#1</span>
                    <div>
                      <strong className="text-emerald-400 group-hover:underline">Publish ke Publik (Whistleblower)</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Sebarkan berkas klinis ke situs publik & siber dunia bebas. Runtuhkan Apex Corp!</p>
                    </div>
                  </button>

                  {/* ENDING PILIHAN 2 */}
                  <button 
                    onClick={() => chooseGameEnding('blackmail')}
                    className="w-full text-left p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 hover:bg-amber-950/40 transition-colors group flex items-start gap-3 focus:outline-none"
                  >
                    <span className="bg-amber-950 text-amber-400 px-2 py-1 rounded font-bold text-[10px]">#2</span>
                    <div>
                      <strong className="text-amber-400 group-hover:underline">Peras CEO Apex Corp (Blackmail)</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Minta tebusan senilai 500 BTC kepada Dr. Jonathan Vance demi keuntungan saku pribadi Anda.</p>
                    </div>
                  </button>

                  {/* ENDING PILIHAN 3 */}
                  <button 
                    onClick={() => chooseGameEnding('corporate')}
                    className="w-full text-left p-3 rounded-lg bg-blue-950/20 border border-blue-900/40 hover:bg-blue-950/40 transition-colors group flex items-start gap-3 focus:outline-none"
                  >
                    <span className="bg-blue-950 text-blue-400 px-2 py-1 rounded font-bold text-[10px]">#3</span>
                    <div>
                      <strong className="text-blue-400 group-hover:underline">Jual ke Apex Corp (Corporate Agent)</strong>
                      <p className="text-[10px] text-slate-400 mt-0.5">Bantu tutup kebocoran, hapus jejak Andra Kirana, dapatkan posisi direktur tinggi.</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </Window>
        );
      })}

      {/* BAR BAWAH OS (TASKBAR) */}
      <footer className="absolute bottom-0 inset-x-0 h-12 bg-slate-950 border-t border-slate-900 flex items-center justify-between px-6 z-30 font-mono text-xs">
        <div className="flex items-center gap-1.5">
          {/* Tombol Start Menu */}
          <button 
            onClick={() => { playSound('beep'); alert('AetherOS Start Menu v2.10\nSistem dilindungi enkripsi NetWatchers.'); }}
            className="h-8 px-4 rounded-md bg-emerald-950/40 hover:bg-emerald-950 text-emerald-400 border border-emerald-900/40 font-bold transition-all flex items-center gap-1.5"
          >
            <span className="text-xs">⚙️</span> Aether
          </button>
          
          <span className="text-slate-800 mx-2">|</span>

          {/* Windows Taskbar Shortcut Buttons */}
          <div className="flex gap-1.5">
            {windows.map(w => (
              <button
                key={w.id}
                onClick={() => focusWindow(w.id)}
                className={`h-8 px-3 rounded-md border text-[11px] transition-all flex items-center gap-1.5 ${
                  activeWindow === w.id 
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' 
                    : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:bg-slate-900'
                }`}
              >
                <span>{w.id === 'readme' ? '📄' : w.id === 'terminal' ? '💻' : w.id === 'emails' ? '📬' : w.id === 'browser' ? '🌐' : w.id === 'cryptotool' ? '🔑' : '📁'}</span>
                <span className="hidden sm:inline">{w.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tampilan Jam Digital */}
        <div className="text-slate-500 text-[11px]">
          <span>📅 Jun 17, 2026</span>
          <span className="ml-3 font-bold text-slate-400">19:35 WITA</span>
        </div>
      </footer>
    </div>
  );
}
