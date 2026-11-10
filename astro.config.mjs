import { defineConfig } from 'astro/config';

// Demo ini diterbitkan sebagai GitHub Pages project site:
// https://daslidisalun.github.io/KalenderKerja/
// Saat naik ke domain produksi sendiri (kalenderkerja.click), kembalikan
// site ke 'https://kalenderkerja.click' dan hapus/kosongkan base.
// Semua URL internal dibangun lewat helper u() di src/lib/base.js yang
// membaca base dari konfigurasi ini.
export default defineConfig({
  site: 'https://daslidisalun.github.io',
  base: '/KalenderKerja/',
  trailingSlash: 'always',
});
