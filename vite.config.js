import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ATUR BASE URL: Ganti 'nama-repositori' dengan nama repositori GitHub Anda secara persis
  // Contoh: jika URL GitHub Pages Anda adalah 'https://andra.github.io/aether-os/',
  // maka ubah bagian di bawah ini menjadi '/aether-os/'
  base: process.env.NODE_ENV === 'production' ? '/diegetic-arg-platform/' : '/',
});