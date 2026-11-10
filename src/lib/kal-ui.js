// kal-ui.js — pembantu tampilan kalender untuk skrip peramban.
// Dipakai halaman-halaman perkakas untuk menggambar grid bulan dari libur.js
// + hitung.js. Murni menghasilkan string HTML; pemanggil yang memasangnya.
import {
  gridBulan, formatPanjang, formatSingkat, NAMA_BULAN, NAMA_HARI_SINGKAT,
} from './hitung.js';
import { PETA_LIBUR } from './libur.js';

export function gridHTML(tahun, bulanIdx, opsi, { mini = false, hariIni = null } = {}) {
  const minggu = gridBulan(tahun, bulanIdx, opsi);
  const kepala = NAMA_HARI_SINGKAT.map(
    (h, i) => `<th${i === 0 ? ' class="minggu-kolom"' : ''}>${h}</th>`,
  ).join('');
  const baris = minggu
    .map((m) => {
      const sel = m
        .map((s) => {
          if (!s) return '<td class="kosong"></td>';
          const kelas = [];
          if (s.minggu || s.libur?.jenis === 'nasional') kelas.push('merah');
          if (s.libur?.jenis === 'nasional') kelas.push('libur');
          if (s.libur?.jenis === 'bersama') kelas.push('bersama');
          if (hariIni && s.iso === hariIni) kelas.push('hari-ini');
          const label =
            !mini && s.libur
              ? `<span class="kal-label">${s.libur.nama.replace(/^Cuti Bersama /, 'CB ')}</span>`
              : '';
          const judul = s.libur ? ` title="${s.libur.nama}"` : '';
          return `<td class="${kelas.join(' ')}"${judul}><span class="kal-angka">${s.tanggal}</span>${label}</td>`;
        })
        .join('');
      return `<tr>${sel}</tr>`;
    })
    .join('');
  return `<table class="kal${mini ? ' kal-mini' : ''}"><thead><tr>${kepala}</tr></thead><tbody>${baris}</tbody></table>`;
}

export function daftarLiburBulanHTML(tahun, bulanIdx) {
  const awalan = `${tahun}-${String(bulanIdx + 1).padStart(2, '0')}`;
  const isi = [...PETA_LIBUR.values()]
    .filter((e) => e.tanggal.startsWith(awalan))
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  if (!isi.length)
    return `<p class="kecil">Tidak ada libur nasional atau cuti bersama pada ${NAMA_BULAN[bulanIdx]} ${tahun}.</p>`;
  const baris = isi
    .map(
      (e) =>
        `<tr><td>${formatPanjang(e.tanggal)}</td><td>${e.nama}</td><td><span class="badge ${e.jenis}">${e.jenis === 'nasional' ? 'Libur Nasional' : 'Cuti Bersama'}</span></td></tr>`,
    )
    .join('');
  return `<div class="tabel-bungkus"><table class="tabel"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Jenis</th></tr></thead><tbody>${baris}</tbody></table></div>`;
}

export { formatPanjang, formatSingkat, NAMA_BULAN };
