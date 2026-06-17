/**
 * Modul Utilitas Kriptografi Forensik AetherOS
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
 * Mendekripsi teks berformat Base64 secara aman tanpa merusak UI jika terjadi kegagalan.
 */
export const base64Decode = (str) => {
  try {
    return atob(str);
  } catch (e) {
    return 'FORMAT_INVALID';
  }
};
