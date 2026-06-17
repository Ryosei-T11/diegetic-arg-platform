import React, { useState } from 'react';

export default function MegaCorpSitus({ url, gameState, onHackMegaCorp, playSound, onNavigate, onOpenWindow }) {
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