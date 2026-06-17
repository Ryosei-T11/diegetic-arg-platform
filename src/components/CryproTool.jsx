import React from 'react';

export function CryptoTool({ 
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
        
        {/* CAESAR CIPHER */}
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
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-100 focus:outline-none"
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
            <span className="block text-slate-500 text-[9px] mb-1">HASIL:</span>
            <span className="text-emerald-400 font-bold text-sm tracking-widest block font-mono">
              {caesarOutput || '---'}
            </span>
          </div>
        </div>

        {/* BASE64 DECODER */}
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
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-blue-950/40 text-center mt-4">
            <span className="block text-slate-500 text-[9px] mb-1">HASIL:</span>
            <span className="text-emerald-400 font-bold text-sm tracking-widest block font-mono">
              {base64Output || '---'}
            </span>
          </div>
        </div>

      </div>

      <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
        <span className="text-slate-400">Pecahkan sandi jurnal lalu verifikasi hasilnya:</span>
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
