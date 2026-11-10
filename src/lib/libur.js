// libur.js — DATA RESMI hari libur nasional & cuti bersama Indonesia.
//
// SUMBER (diteliti & diverifikasi silang 10 November 2026):
// • 2026: SKB Menteri Agama No. 1497 Tahun 2025, Menteri Ketenagakerjaan
//   No. 2 Tahun 2025, dan Menteri PANRB No. 5 Tahun 2025 tentang Hari Libur
//   Nasional dan Cuti Bersama Tahun 2026 — ditandatangani 19 September 2025.
//   Daftar di bawah diambil dari rilis resmi Sekretariat Negara (setneg.go.id)
//   dan dicocokkan satu per satu dengan kalenderlengkap.id serta SatuTim
//   (tools.satutim.id): ketiga sumber sepakat 17 libur nasional + 8 cuti
//   bersama. (Satu situs pendidikan sempat menulis 15+6 — keliru; angka resmi
//   menurut SKB adalah 17+8.)
// • 2027: SKB Menteri Agama No. 1205 Tahun 2026, Menteri Ketenagakerjaan
//   No. 3 Tahun 2026, dan Menteri PANRB No. 2 Tahun 2026 tentang Hari Libur
//   Nasional dan Cuti Bersama Tahun 2027 — ditandatangani 15 September 2026.
//   Daftar diambil dari rilis resmi Sekretariat Negara dan dicocokkan dengan
//   berandainspirasi.id serta weefer.co.id: sepakat 18 libur nasional
//   (17 butir; Idulfitri dua hari) + 8 cuti bersama. Keunikan 2027: Isra
//   Mikraj jatuh dua kali (5 Januari = 1448 H, 26 Desember = 1449 H) karena
//   tahun Hijriah lebih pendek dari tahun Masehi.
// • Catatan SKB untuk kedua tahun: penetapan tanggal 1 Ramadan, Idulfitri,
//   dan Iduladha pada akhirnya mengikuti Keputusan Menteri Agama (sidang
//   isbat), sehingga tanggal-tanggal hari raya Islam dapat bergeser mengikuti
//   keputusan tersebut. Data di sini adalah data SKB sebagaimana diterbitkan.
//
// jenis: 'nasional' = libur nasional, 'bersama' = cuti bersama.

export const SUMBER = {
  2026: {
    tahun: 2026,
    skb: 'SKB Menteri Agama No. 1497 Tahun 2025, Menteri Ketenagakerjaan No. 2 Tahun 2025, dan Menteri PANRB No. 5 Tahun 2025',
    judul: 'Hari Libur Nasional dan Cuti Bersama Tahun 2026',
    ditetapkan: '19 September 2025',
    jumlahNasional: 17,
    jumlahBersama: 8,
    status: 'resmi',
    catatan:
      'Penetapan 1 Ramadan 1447 H, Idulfitri 1447 H, dan Iduladha 1447 H mengikuti Keputusan Menteri Agama setelah sidang isbat.',
  },
  2027: {
    tahun: 2027,
    skb: 'SKB Menteri Agama No. 1205 Tahun 2026, Menteri Ketenagakerjaan No. 3 Tahun 2026, dan Menteri PANRB No. 2 Tahun 2026',
    judul: 'Hari Libur Nasional dan Cuti Bersama Tahun 2027',
    ditetapkan: '15 September 2026',
    jumlahNasional: 18,
    jumlahBersama: 8,
    status: 'resmi',
    catatan:
      'Penetapan 1 Ramadan 1448 H, Idulfitri 1448 H, dan Iduladha 1448 H mengikuti Keputusan Menteri Agama setelah sidang isbat.',
  },
};

export const LIBUR = [
  // ===== 2026 — libur nasional (17) =====
  { tanggal: '2026-01-01', nama: 'Tahun Baru 2026 Masehi', jenis: 'nasional' },
  { tanggal: '2026-01-16', nama: 'Isra Mikraj Nabi Muhammad SAW', jenis: 'nasional' },
  { tanggal: '2026-02-17', nama: 'Tahun Baru Imlek 2577 Kongzili', jenis: 'nasional' },
  { tanggal: '2026-03-19', nama: 'Hari Suci Nyepi (Tahun Baru Saka 1948)', jenis: 'nasional' },
  { tanggal: '2026-03-21', nama: 'Hari Raya Idulfitri 1447 Hijriah', jenis: 'nasional' },
  { tanggal: '2026-03-22', nama: 'Hari Raya Idulfitri 1447 Hijriah', jenis: 'nasional' },
  { tanggal: '2026-04-03', nama: 'Wafat Yesus Kristus', jenis: 'nasional' },
  { tanggal: '2026-04-05', nama: 'Kebangkitan Yesus Kristus (Paskah)', jenis: 'nasional' },
  { tanggal: '2026-05-01', nama: 'Hari Buruh Internasional', jenis: 'nasional' },
  { tanggal: '2026-05-14', nama: 'Kenaikan Yesus Kristus', jenis: 'nasional' },
  { tanggal: '2026-05-27', nama: 'Hari Raya Iduladha 1447 Hijriah', jenis: 'nasional' },
  { tanggal: '2026-05-31', nama: 'Hari Raya Waisak 2570 BE', jenis: 'nasional' },
  { tanggal: '2026-06-01', nama: 'Hari Lahir Pancasila', jenis: 'nasional' },
  { tanggal: '2026-06-16', nama: '1 Muharam Tahun Baru Islam 1448 Hijriah', jenis: 'nasional' },
  { tanggal: '2026-08-17', nama: 'Proklamasi Kemerdekaan', jenis: 'nasional' },
  { tanggal: '2026-08-25', nama: 'Maulid Nabi Muhammad SAW', jenis: 'nasional' },
  { tanggal: '2026-12-25', nama: 'Kelahiran Yesus Kristus (Natal)', jenis: 'nasional' },
  // ===== 2026 — cuti bersama (8) =====
  { tanggal: '2026-02-16', nama: 'Cuti Bersama Tahun Baru Imlek 2577 Kongzili', jenis: 'bersama' },
  { tanggal: '2026-03-18', nama: 'Cuti Bersama Hari Suci Nyepi (Tahun Baru Saka 1948)', jenis: 'bersama' },
  { tanggal: '2026-03-20', nama: 'Cuti Bersama Idulfitri 1447 Hijriah', jenis: 'bersama' },
  { tanggal: '2026-03-23', nama: 'Cuti Bersama Idulfitri 1447 Hijriah', jenis: 'bersama' },
  { tanggal: '2026-03-24', nama: 'Cuti Bersama Idulfitri 1447 Hijriah', jenis: 'bersama' },
  { tanggal: '2026-05-15', nama: 'Cuti Bersama Kenaikan Yesus Kristus', jenis: 'bersama' },
  { tanggal: '2026-05-28', nama: 'Cuti Bersama Iduladha 1447 Hijriah', jenis: 'bersama' },
  { tanggal: '2026-12-24', nama: 'Cuti Bersama Kelahiran Yesus Kristus (Natal)', jenis: 'bersama' },
  // ===== 2027 — libur nasional (18) =====
  { tanggal: '2027-01-01', nama: 'Tahun Baru 2027 Masehi', jenis: 'nasional' },
  { tanggal: '2027-01-05', nama: 'Isra Mikraj Nabi Muhammad SAW (1448 Hijriah)', jenis: 'nasional' },
  { tanggal: '2027-02-06', nama: 'Tahun Baru Imlek 2578 Kongzili', jenis: 'nasional' },
  { tanggal: '2027-03-08', nama: 'Hari Suci Nyepi (Tahun Baru Saka 1949)', jenis: 'nasional' },
  { tanggal: '2027-03-10', nama: 'Hari Raya Idulfitri 1448 Hijriah', jenis: 'nasional' },
  { tanggal: '2027-03-11', nama: 'Hari Raya Idulfitri 1448 Hijriah', jenis: 'nasional' },
  { tanggal: '2027-03-26', nama: 'Wafat Yesus Kristus', jenis: 'nasional' },
  { tanggal: '2027-03-28', nama: 'Kebangkitan Yesus Kristus (Paskah)', jenis: 'nasional' },
  { tanggal: '2027-05-01', nama: 'Hari Buruh Internasional', jenis: 'nasional' },
  { tanggal: '2027-05-06', nama: 'Kenaikan Yesus Kristus', jenis: 'nasional' },
  { tanggal: '2027-05-17', nama: 'Hari Raya Iduladha 1448 Hijriah', jenis: 'nasional' },
  { tanggal: '2027-05-20', nama: 'Hari Raya Waisak 2571 BE', jenis: 'nasional' },
  { tanggal: '2027-06-01', nama: 'Hari Lahir Pancasila', jenis: 'nasional' },
  { tanggal: '2027-06-06', nama: '1 Muharam Tahun Baru Islam 1449 Hijriah', jenis: 'nasional' },
  { tanggal: '2027-08-15', nama: 'Maulid Nabi Muhammad SAW', jenis: 'nasional' },
  { tanggal: '2027-08-17', nama: 'Proklamasi Kemerdekaan', jenis: 'nasional' },
  { tanggal: '2027-12-25', nama: 'Kelahiran Yesus Kristus (Natal)', jenis: 'nasional' },
  { tanggal: '2027-12-26', nama: 'Isra Mikraj Nabi Muhammad SAW (1449 Hijriah)', jenis: 'nasional' },
  // ===== 2027 — cuti bersama (8) =====
  { tanggal: '2027-02-05', nama: 'Cuti Bersama Tahun Baru Imlek 2578 Kongzili', jenis: 'bersama' },
  { tanggal: '2027-03-09', nama: 'Cuti Bersama Idulfitri 1448 Hijriah', jenis: 'bersama' },
  { tanggal: '2027-03-12', nama: 'Cuti Bersama Idulfitri 1448 Hijriah', jenis: 'bersama' },
  { tanggal: '2027-03-15', nama: 'Cuti Bersama Idulfitri 1448 Hijriah', jenis: 'bersama' },
  { tanggal: '2027-03-25', nama: 'Cuti Bersama Wafat Yesus Kristus', jenis: 'bersama' },
  { tanggal: '2027-05-18', nama: 'Cuti Bersama Iduladha 1448 Hijriah', jenis: 'bersama' },
  { tanggal: '2027-05-19', nama: 'Cuti Bersama Hari Raya Waisak 2571 BE', jenis: 'bersama' },
  { tanggal: '2027-12-24', nama: 'Cuti Bersama Kelahiran Yesus Kristus (Natal)', jenis: 'bersama' },
];

// Peta cepat: 'YYYY-MM-DD' → entri libur.
export const PETA_LIBUR = new Map(LIBUR.map((e) => [e.tanggal, e]));

export const liburPada = (iso) => PETA_LIBUR.get(iso) ?? null;

export const liburTahun = (tahun, jenis = null) =>
  LIBUR.filter(
    (e) => e.tanggal.startsWith(String(tahun)) && (jenis === null || e.jenis === jenis),
  );
