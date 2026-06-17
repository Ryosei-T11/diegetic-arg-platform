import React, { useState } from 'react';

// ==========================================
// 1. SUB-KOMPONEN SITUS: BLOG KORBAN (andra-journal.net)
// ==========================================
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
          Kunci geser mundurnya (offset) adalah <span className="text-emerald-300 font-bold">tanggal hari jadi Riko</span> (abaikan bulan/tahun, ambil nilai numerik tanggalnya saja).
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

// ==========================================
// 2. SUB-KOMPONEN SITUS: FORUM (konspirasi-forum.id)
// ==========================================
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

// ==========================================
// 3. SUB-KOMPONEN SITUS: APEX CORP (apex-corp.org)
// ==========================================
function MegaCorpSitus({ url, gameState, onHackMegaCorp, playSound, onNavigate, onOpenWindow }) {
  const [megaCorpPassword, setMegaCorpPassword] = useState('');
  const [megaCorpError, setMegaCorpError] = useState('');

  return (
    <div className="space-y-6 max-w-2xl mx-auto font-sans text-xs">
      {/* HEADER SITUS */}
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

      {/* SUB NAVIGASI */}
      <div className="flex gap-4 border-b border-slate-800/80 pb-2 font-mono text-[11px]">
        <span className={`cursor-pointer ${url === 'apex-corp.org' ? 'text-blue-400 font-bold border-b-2 border-blue-400 pb-2' : 'text-slate-500'}`} onClick={() => onNavigate('apex-corp.org')}>Portal Utama</span>
        <span className={`cursor-pointer ${url === 'apex-corp.org/about' ? 'text-blue-400 font-bold border-b-2 border-blue-400 pb-2' : 'text-slate-500'}`} onClick={() => onNavigate('apex-corp.org/about')}>Tentang Kami</span>
        <span className={`cursor-pointer ${url === 'apex-corp.org/admin' ? 'text-blue-400 font-bold border-b-2 border-blue-400 pb-2' : 'text-slate-500'}`} onClick={() => onNavigate('apex-corp.org/admin')}>Portal Admin</span>
      </div>

      {/* RENDER PAGES BERDASARKAN URL */}
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

// ==========================================
// 4. MAIN BROWSER WRAPPER COMPONENT
// ==========================================
export function Browser({ 
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
        {/* Navigation Arrows */}
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
        
        {/* Address Bar */}
        <div className="flex-1 bg-slate-900 rounded-lg px-3 py-1 flex items-center gap-2 border border-slate-800">
          <span className="text-emerald-500 font-mono text-[10px] font-bold select-none">HTTP://</span>
          <input 
            type="text" 
            value={url} 
            onChange={(e) => onNavigate(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-mono text-slate-200 focus:ring-0 p-0"
          />
        </div>
        
        {/* Bookmarks */}
        <div className="flex gap-1.5 font-mono text-[10px]">
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
        {url !== 'andra-journal.net' && url !== 'konspirasi-forum.id' && !url.startsWith('apex-corp.org') && (
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