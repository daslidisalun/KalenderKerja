// hitung.js — pustaka hitung hari kerja Indonesia (murni, tanpa dependensi UI).
// Semua tanggal berupa string ISO 'YYYY-MM-DD'; perhitungan memakai UTC agar
// tidak terpengaruh zona waktu perangkat. Dipakai bersama oleh peramban
// (perkakas interaktif) dan — lewat data yang sama — diverifikasi silang oleh
// skrip Python di scripts/verifikasi-silang.py.
import { LIBUR, PETA_LIBUR } from './libur.js';

export const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const NAMA_HARI_SINGKAT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
export const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
export const NAMA_BULAN_SINGKAT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export const OPSI_BAKU = { sabtuKerja: false, cutiBersamaLibur: true };

const MS_HARI = 86400000;

export const keTanggal = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
export const keISO = (date) => date.toISOString().slice(0, 10);
export const tambahHari = (iso, n) => keISO(new Date(keTanggal(iso).getTime() + n * MS_HARI));
export const selisihHari = (dari, sampai) =>
  Math.round((keTanggal(sampai) - keTanggal(dari)) / MS_HARI);
export const hariKe = (iso) => keTanggal(iso).getUTCDay(); // 0=Minggu … 6=Sabtu

export const formatPanjang = (iso) => {
  const d = keTanggal(iso);
  return `${NAMA_HARI[d.getUTCDay()]}, ${d.getUTCDate()} ${NAMA_BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
export const formatSingkat = (iso) => {
  const d = keTanggal(iso);
  return `${d.getUTCDate()} ${NAMA_BULAN_SINGKAT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
export const isoHariIni = () => {
  const s = new Date();
  const mm = String(s.getMonth() + 1).padStart(2, '0');
  const dd = String(s.getDate()).padStart(2, '0');
  return `${s.getFullYear()}-${mm}-${dd}`;
};

// Status satu tanggal: { iso, dow, libur (entri|null), akhirPekan, sabtu, minggu }
export function infoHari(iso) {
  const dow = hariKe(iso);
  return {
    iso,
    dow,
    libur: PETA_LIBUR.get(iso) ?? null,
    minggu: dow === 0,
    sabtu: dow === 6,
    akhirPekan: dow === 0 || dow === 6,
  };
}

// Hari kerja? Aturan baku Indonesia: Senin–Jumat, bukan libur nasional, dan —
// bila opsi cutiBersamaLibur aktif — bukan cuti bersama. Sabtu hanya kerja
// bila opsi sabtuKerja aktif (dan bukan libur).
export function adalahHariKerja(iso, opsi = OPSI_BAKU) {
  const info = infoHari(iso);
  if (info.minggu) return false;
  if (info.sabtu && !opsi.sabtuKerja) return false;
  if (info.libur?.jenis === 'nasional') return false;
  if (info.libur?.jenis === 'bersama' && opsi.cutiBersamaLibur) return false;
  return true;
}

export function alasanLibur(iso, opsi = OPSI_BAKU) {
  const info = infoHari(iso);
  if (info.libur) return info.libur.nama;
  if (info.minggu) return 'Hari Minggu (akhir pekan)';
  if (info.sabtu && !opsi.sabtuKerja) return 'Hari Sabtu (akhir pekan)';
  return null;
}

// Hitung rentang inklusif [dari, sampai]. Urutan terbalik ditukar otomatis.
export function hitungRentang(dari, sampai, opsi = OPSI_BAKU) {
  let a = dari;
  let b = sampai;
  let tertukar = false;
  if (selisihHari(a, b) < 0) {
    [a, b] = [b, a];
    tertukar = true;
  }
  const totalKalender = selisihHari(a, b) + 1;
  let hariKerja = 0;
  let sabtu = 0;
  let minggu = 0;
  const daftarLibur = [];
  for (let i = 0; i < totalKalender; i++) {
    const iso = tambahHari(a, i);
    const info = infoHari(iso);
    if (info.sabtu) sabtu++;
    if (info.minggu) minggu++;
    if (info.libur) daftarLibur.push(info.libur);
    if (adalahHariKerja(iso, opsi)) hariKerja++;
  }
  return {
    dari: a,
    sampai: b,
    tertukar,
    totalKalender,
    hariKerja,
    sabtu,
    minggu,
    akhirPekan: sabtu + minggu,
    liburNasional: daftarLibur.filter((e) => e.jenis === 'nasional').length,
    cutiBersama: daftarLibur.filter((e) => e.jenis === 'bersama').length,
    daftarLibur,
  };
}

// Tambah/kurang N hari kerja dari tanggal awal. Tanggal awal TIDAK dihitung;
// hasil adalah hari kerja ke-N sesudahnya (N positif) / sebelumnya (N negatif).
// Mengembalikan daftar hari libur yang dilewati beserta alasannya.
export function tambahHariKerja(iso, n, opsi = OPSI_BAKU) {
  if (n === 0) return { hasil: iso, dilewati: [] };
  const arah = n > 0 ? 1 : -1;
  let sisa = Math.abs(n);
  let kini = iso;
  const dilewati = [];
  while (sisa > 0) {
    kini = tambahHari(kini, arah);
    if (adalahHariKerja(kini, opsi)) {
      sisa--;
    } else {
      dilewati.push({ tanggal: kini, alasan: alasanLibur(kini, opsi) });
    }
  }
  if (arah < 0) dilewati.reverse();
  return { hasil: kini, dilewati };
}

// Tambah/kurang N hari kalender polos.
export function tambahHariKalender(iso, n) {
  return tambahHari(iso, n);
}

// Selisih dua tanggal: total hari (absolut), minggu+sisa, uraian tahun-bulan-hari,
// dan hari kerja pada rentang (awal, akhir].
export function selisihTanggal(a, b, opsi = OPSI_BAKU) {
  let dari = a;
  let sampai = b;
  if (selisihHari(dari, sampai) < 0) [dari, sampai] = [sampai, dari];
  const total = selisihHari(dari, sampai);
  const minggu = Math.floor(total / 7);
  const sisaHari = total % 7;
  // Uraian tahun-bulan-hari (pinjam seperti pengurangan tanggal lazim).
  const da = keTanggal(dari);
  const db = keTanggal(sampai);
  let tahun = db.getUTCFullYear() - da.getUTCFullYear();
  let bulan = db.getUTCMonth() - da.getUTCMonth();
  let hari = db.getUTCDate() - da.getUTCDate();
  if (hari < 0) {
    bulan--;
    const blnSebelum = new Date(Date.UTC(db.getUTCFullYear(), db.getUTCMonth(), 0));
    hari += blnSebelum.getUTCDate();
  }
  if (bulan < 0) {
    tahun--;
    bulan += 12;
  }
  let hariKerja = 0;
  for (let i = 1; i <= total; i++) {
    if (adalahHariKerja(tambahHari(dari, i), opsi)) hariKerja++;
  }
  return { dari, sampai, total, minggu, sisaHari, tahun, bulan, hari, hariKerja };
}

// Semua rangkaian hari NON-kerja berurutan (menurut opsi) yang menyentuh tahun
// tertentu, minimal minHari hari. Jendela hitung diperlebar ±20 hari ke tahun
// tetangga agar rangkaian yang menyeberang tahun tetap utuh; data libur di
// luar cakupan libur.js diperlakukan sebagai bukan hari libur.
export function rangkaianLibur(tahun, opsi = OPSI_BAKU, minHari = 3) {
  const awal = `${tahun - 1}-12-20`;
  const akhir = `${tahun + 1}-01-20`;
  const total = selisihHari(awal, akhir);
  const hasil = [];
  let run = null;
  for (let i = 0; i <= total; i++) {
    const iso = tambahHari(awal, i);
    if (!adalahHariKerja(iso, opsi)) {
      if (!run) run = { mulai: iso, selesai: iso, jumlahHari: 0, liburDiDalam: [] };
      run.selesai = iso;
      run.jumlahHari++;
      const l = PETA_LIBUR.get(iso);
      if (l) run.liburDiDalam.push(l);
    } else {
      if (run && run.jumlahHari >= minHari) hasil.push(run);
      run = null;
    }
  }
  if (run && run.jumlahHari >= minHari) hasil.push(run);
  return hasil.filter(
    (r) => r.mulai <= `${tahun}-12-31` && r.selesai >= `${tahun}-01-01`,
  );
}

// PENGOPTIMAL CUTI — cari jendela libur terbaik pada satu tahun: mengambil
// k (1–3) hari cuti tahunan pada hari kerja yang menempel rangkaian libur yang
// sudah ada, menghasilkan ≥4 hari libur berurutan. Efisiensi = total hari
// libur ÷ hari cuti yang dipakai.
export function jendelaCuti(tahun, opsi = OPSI_BAKU, maksCuti = 3, minTotal = 4) {
  const awalTahun = `${tahun}-01-01`;
  const akhirTahun = `${tahun}-12-31`;
  // Kumpulkan rangkaian non-kerja alami di sekitar tahun ini.
  const awal = `${tahun - 1}-12-20`;
  const akhir = `${tahun + 1}-01-20`;
  const total = selisihHari(awal, akhir);
  const runs = [];
  let run = null;
  for (let i = 0; i <= total; i++) {
    const iso = tambahHari(awal, i);
    if (!adalahHariKerja(iso, opsi)) {
      if (!run) run = { mulai: iso, selesai: iso, adaLiburResmi: false };
      run.selesai = iso;
      if (PETA_LIBUR.has(iso)) run.adaLiburResmi = true;
    } else if (run) {
      runs.push(run);
      run = null;
    }
  }
  if (run) runs.push(run);

  const terbaik = new Map(); // kunci mulai|selesai → jendela dg cuti tersedikit
  for (const r of runs) {
    if (r.selesai < awalTahun || r.mulai > akhirTahun) continue;
    // Hanya jendela yang berjangkar pada rangkaian berisi libur resmi yang
    // dianggap "jendela cuti" — perpanjangan akhir pekan biasa bukan kejepit.
    if (!r.adaLiburResmi) continue;
    for (let k = 1; k <= maksCuti; k++) {
      for (let a = 0; a <= k; a++) {
        const b = k - a;
        const cuti = [];
        let gagal = false;
        // a hari kerja tepat sebelum rangkaian
        let d = r.mulai;
        for (let j = 0; j < a && !gagal; j++) {
          d = tambahHari(d, -1);
          while (!adalahHariKerja(d, opsi)) d = tambahHari(d, -1);
          if (d < awalTahun) gagal = true;
          else cuti.push(d);
        }
        // b hari kerja tepat sesudah rangkaian
        d = r.selesai;
        for (let j = 0; j < b && !gagal; j++) {
          d = tambahHari(d, 1);
          while (!adalahHariKerja(d, opsi)) d = tambahHari(d, 1);
          if (d > akhirTahun) gagal = true;
          else cuti.push(d);
        }
        if (gagal) continue;
        // Simulasi: hari cuti dianggap libur, cari rangkaian yang memuat r.
        const setCuti = new Set(cuti);
        const kerja = (iso) => adalahHariKerja(iso, opsi) && !setCuti.has(iso);
        let mulai = r.mulai;
        while (!kerja(tambahHari(mulai, -1))) mulai = tambahHari(mulai, -1);
        let selesai = r.selesai;
        while (!kerja(tambahHari(selesai, 1))) selesai = tambahHari(selesai, 1);
        const jumlahHari = selisihHari(mulai, selesai) + 1;
        if (jumlahHari < minTotal) continue;
        if (mulai < awalTahun || selesai > akhirTahun) continue;
        cuti.sort();
        const kunci = `${mulai}|${selesai}`;
        const efisiensi = jumlahHari / k;
        const lama = terbaik.get(kunci);
        if (!lama || k < lama.cuti.length) {
          terbaik.set(kunci, {
            mulai,
            selesai,
            jumlahHari,
            cuti,
            efisiensi: Math.round(efisiensi * 10) / 10,
          });
        }
      }
    }
  }
  return [...terbaik.values()].sort(
    (x, y) =>
      y.efisiensi - x.efisiensi ||
      y.jumlahHari - x.jumlahHari ||
      x.mulai.localeCompare(y.mulai),
  );
}

// Libur resmi (nasional/bersama) berikutnya setelah tanggal iso.
export function liburBerikutnya(iso) {
  for (const e of LIBUR) {
    if (e.tanggal > iso) return { ...e, selisih: selisihHari(iso, e.tanggal) };
  }
  return null;
}

// Bangun grid satu bulan untuk tampilan kalender.
// Mengembalikan larik minggu; tiap sel: null (di luar bulan) atau info hari.
export function gridBulan(tahun, bulanIdx, opsi = OPSI_BAKU) {
  const pertama = keISO(new Date(Date.UTC(tahun, bulanIdx, 1)));
  const jumlahHariBulan = new Date(Date.UTC(tahun, bulanIdx + 1, 0)).getUTCDate();
  const geser = hariKe(pertama); // kolom Minggu = 0
  const sel = [];
  for (let i = 0; i < geser; i++) sel.push(null);
  for (let t = 1; t <= jumlahHariBulan; t++) {
    const iso = keISO(new Date(Date.UTC(tahun, bulanIdx, t)));
    sel.push({ ...infoHari(iso), tanggal: t, kerja: adalahHariKerja(iso, opsi) });
  }
  while (sel.length % 7 !== 0) sel.push(null);
  const minggu = [];
  for (let i = 0; i < sel.length; i += 7) minggu.push(sel.slice(i, i + 7));
  return minggu;
}
