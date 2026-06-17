/**
 * Modul Utilitas Kriptografi Forensik Tingkat Lanjut AetherOS
 */

/**
 * Mendekripsi sandi Caesar dengan pergeseran mundur (shift) tertentu.
 * Hanya memproses huruf alfabet (A-Z) dan mempertahankan karakter lain.
 */
export const caesarDecrypt = (str, shift) => {
  return str.toUpperCase().split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) { // A - Z
      return String.fromCharCode(((code - 65 - shift + 26 * 2) % 26) + 65);
    }
    return char;
  }).join('');
};

/**
 * Mengenkripsi teks biasa menjadi sandi Caesar dengan pergeseran maju.
 */
export const caesarEncrypt = (str, shift) => {
  return str.toUpperCase().split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    }
    return char;
  }).join('');
};

/**
 * Mendekripsi sandi ROT13 (Caesar dengan pergeseran tetap 13)
 */
export const rot13Decrypt = (str) => {
  return caesarDecrypt(str, 13);
};

/**
 * Mendekripsi sandi Vigenere menggunakan kunci tertentu
 */
export const vigenereDecrypt = (text, key) => {
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

/**
 * Mendekripsi teks berformat Base64 secara aman tanpa merusak UI jika terjadi kegagalan.
 */
export const base64Decode = (str) => {
  try {
    return atob(str);
  } catch (e) {
    return 'FORMAT_INVALID';
  }
};

/**
 * Simulasi Deteksi Steganografi (StegTool) berbasis kata sandi fiktif
 * Memeriksa apakah gambar siber tertentu menyimpan pesan rahasia terenkripsi
 */
export const stegExtract = (imageName, password) => {
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

/**
 * Simulasi Inspeksi EXIF Metadata Gambar Forensik
 */
export const getExifMetadata = (imageName) => {
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

/**
 * Kamus Database Bocoran Hash fiktif (MD5 / SHA-256) untuk detektif siber
 */
const HASH_LEAK_DATABASE = {
  // MD5 hashes
  'eb823528b17b6ab86ba11b6b55979c53': 'APEX_GENESIS_2026',
  '3f48a1926640822998a4427b5e85f403': 'VANCE_SECRET_99',
  '098f6bcd4621d373cade4e832627b4f6': 'test',
  
  // SHA-256 hashes
  '9080757a2cf1dc5b0cfbe9618b105d15a51a9a46014fb05663673c66fae999eb': 'PROJECT_GENESIS',
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8': 'password',
  '79ebc8261df02e3b97b095eb13881ee28e679b39cfb7ef38787c80f4f9f44db4': 'ANDRA_BERMAIN_BOLA'
};

/**
 * Mencocokkan nilai hash (MD5/SHA-256) ke dalam database kebocoran publik fiktif
 */
export const crackHash = (hashStr) => {
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
