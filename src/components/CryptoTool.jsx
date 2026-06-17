import React, { useState, useEffect } from 'react';
import { 
  caesarDecrypt, 
  rot13Decrypt, 
  vigenereDecrypt, 
  base64Decode, 
  stegExtract, 
  getExifMetadata, 
  crackHash 
} from '../core/crypto';

export function CryptoTool({ 
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
  
  // States for Vigenere Tab
  const [vigText, setVigText] = useState('XGTMGF_XGTSKTM_RSTF');
  const [vigKey, setVigKey] = useState('GOLDEN');
  const [vigOutput, setVigOutput] = useState('');

  // States for Steg Tab
  const [stegFile, setStegFile] = useState('foto_hewan.png');
  const [stegPass, setStegPass] = useState('');
  const [stegOutput, setStegOutput] = useState('');

  // States for Metadata Tab
  const [metaFile, setMetaFile] = useState('foto_rontgen_lab.png');
  const [metadata, setMetadata] = useState(null);

  // States for Hash Tab
  const [hashInput, setHashInput] = useState('eb823528b17b6ab86ba11b6b55979c53');
  const [hashResult, setHashResult] = useState(null);

  // Side-effects to auto-decrypt Vigenere when key/text changes
  useEffect(() => {
    setVigOutput(vigenereDecrypt(vigText, vigKey));
  }, [vigText, vigKey]);

  // Update Metadata when file selection changes
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
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 py-1 rounded border border-slate-800 font-bold"
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
