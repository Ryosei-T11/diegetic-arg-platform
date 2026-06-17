import React, { useState } from 'react';

export default function KorbanBlog({ gameState, onUnlockJournal, playSound, onNavigate }) {
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
          Sandi draf terenkripsinya menggunakan <span className="text-yellow-400">hobi favorit anjingku, Riko</span> (format huruf kapital dipisah garis bawah, misal: <code className="text-emerald-400 font-mono">CONTOH_NAMA_AKTIVITAS</code>). 
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