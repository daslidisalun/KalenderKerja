// hitung-ceksilang.mjs — sisi JavaScript dari verifikasi silang.
// Mencetak JSON dengan kunci yang sama persis dengan scripts/verifikasi-silang.py
// agar kedua keluaran dapat dibandingkan kata per kata.
import { hitungRentang, tambahHariKerja, adalahHariKerja, tambahHari, selisihHari, OPSI_BAKU } from '../src/lib/hitung.js';

function jendelaDariCuti(cutiList) {
  const setCuti = new Set(cutiList);
  const libur = (iso) => !adalahHariKerja(iso, OPSI_BAKU) || setCuti.has(iso);
  const urut = [...cutiList].sort();
  let mulai = urut[0];
  while (libur(tambahHari(mulai, -1))) mulai = tambahHari(mulai, -1);
  let selesai = urut[urut.length - 1];
  while (libur(tambahHari(selesai, 1))) selesai = tambahHari(selesai, 1);
  return { mulai, selesai, jumlahHari: selisihHari(mulai, selesai) + 1 };
}

const jan = hitungRentang('2026-01-01', '2026-01-31', OPSI_BAKU);
const lintas = hitungRentang('2026-03-16', '2026-03-27', OPSI_BAKU);
const j1 = jendelaDariCuti(['2026-05-13']);
j1.efisiensi = j1.jumlahHari / 1;
const j2 = jendelaDariCuti(['2026-05-29']);
j2.efisiensi = j2.jumlahHari / 1;

const hasil = {
  januari2026: {
    totalKalender: jan.totalKalender,
    hariKerja: jan.hariKerja,
    sabtu: jan.sabtu,
    minggu: jan.minggu,
    daftarLibur: jan.daftarLibur.map((e) => e.tanggal),
  },
  lintasIdulfitri: {
    totalKalender: lintas.totalKalender,
    hariKerja: lintas.hariKerja,
    daftarLibur: lintas.daftarLibur.map((e) => e.tanggal),
  },
  tambah10: { hasil: tambahHariKerja('2026-05-08', 10, OPSI_BAKU).hasil },
  jendela13Mei2026: j1,
  jendela29Mei2026: j2,
};
console.log(JSON.stringify(hasil, null, 2));
