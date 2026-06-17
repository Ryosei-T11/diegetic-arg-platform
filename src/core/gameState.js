/**
 * Penyimpanan Data Surel Fiktif & Konfigurasi Awal State Game ARG
 */

export const INITIAL_EMAILS = [
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