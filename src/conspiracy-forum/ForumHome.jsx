import React, { useState } from 'react';

export default function ForumHome({ playSound, onNavigate }) {
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