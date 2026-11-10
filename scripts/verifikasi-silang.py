#!/usr/bin/env python3
"""Verifikasi silang INDEPENDEN untuk KalenderKerja.

Implementasi kedua yang ditulis dari nol (Python, hanya membaca pasangan
tanggal+jenis dari src/lib/libur.js lewat regex) untuk memeriksa pustaka
JavaScript src/lib/hitung.js. Keduanya harus menghasilkan angka yang sama.

Jalankan: python3 scripts/verifikasi-silang.py
Lawan JS-nya: node scripts/hitung-ceksilang.mjs
Keduanya mencetak JSON dengan kunci yang sama; bandingkan keluarannya.
"""
import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path

LIBUR_JS = Path(__file__).resolve().parent.parent / "src" / "lib" / "libur.js"
teks = LIBUR_JS.read_text(encoding="utf-8")

LIBUR = {}
for m in re.finditer(r"tanggal:\s*'(\d{4}-\d{2}-\d{2})'.*?jenis:\s*'(\w+)'", teks, re.S):
    LIBUR[m.group(1)] = m.group(2)

assert len([1 for j in LIBUR.values() if j == "nasional"]) == 35, "nasional 2026+2027 harus 17+18=35"
assert len([1 for j in LIBUR.values() if j == "bersama"]) == 16, "bersama 2026+2027 harus 8+8=16"


def d(iso):
    y, m, dd = map(int, iso.split("-"))
    return date(y, m, dd)


def fmt(dt):
    return dt.isoformat()


def hari_kerja(iso, sabtu_kerja=False, cuti_bersama_libur=True):
    dt = d(iso)
    wd = dt.weekday()  # Senin=0 … Minggu=6
    if wd == 6:
        return False
    if wd == 5 and not sabtu_kerja:
        return False
    jenis = LIBUR.get(iso)
    if jenis == "nasional":
        return False
    if jenis == "bersama" and cuti_bersama_libur:
        return False
    return True


def hitung_rentang(a, b):
    awal, akhir = d(a), d(b)
    total = (akhir - awal).days + 1
    kerja = sabtu = minggu = 0
    daftar = []
    for i in range(total):
        iso = fmt(awal + timedelta(days=i))
        wd = (awal + timedelta(days=i)).weekday()
        if wd == 5:
            sabtu += 1
        if wd == 6:
            minggu += 1
        if iso in LIBUR:
            daftar.append(iso)
        if hari_kerja(iso):
            kerja += 1
    return {
        "totalKalender": total,
        "hariKerja": kerja,
        "sabtu": sabtu,
        "minggu": minggu,
        "daftarLibur": daftar,
    }


def tambah_hari_kerja(iso, n):
    arah = 1 if n > 0 else -1
    sisa = abs(n)
    kini = d(iso)
    while sisa > 0:
        kini += timedelta(days=arah)
        if hari_kerja(fmt(kini)):
            sisa -= 1
    return fmt(kini)


def jendela_dari_cuti(cuti_list):
    """Simulasi: hari cuti dianggap libur; cari rangkaian memuat hari cuti pertama."""
    set_cuti = set(cuti_list)

    def libur(iso):
        return (not hari_kerja(iso)) or iso in set_cuti

    mulai = d(sorted(set_cuti)[0])
    while libur(fmt(mulai - timedelta(days=1))):
        mulai -= timedelta(days=1)
    selesai = d(sorted(set_cuti)[-1])
    while libur(fmt(selesai + timedelta(days=1))):
        selesai += timedelta(days=1)
    return {"mulai": fmt(mulai), "selesai": fmt(selesai), "jumlahHari": (selesai - mulai).days + 1}


hasil = {}

# Kasus 1: hari kerja Januari 2026 (1 Jan 2026 = Kamis & libur nasional).
jan = hitung_rentang("2026-01-01", "2026-01-31")
hasil["januari2026"] = {
    "totalKalender": jan["totalKalender"],
    "hariKerja": jan["hariKerja"],
    "sabtu": jan["sabtu"],
    "minggu": jan["minggu"],
    "daftarLibur": jan["daftarLibur"],
}

# Kasus 2: rentang melintasi Idulfitri 2026, 16–27 Maret 2026.
lintas = hitung_rentang("2026-03-16", "2026-03-27")
hasil["lintasIdulfitri"] = {
    "totalKalender": lintas["totalKalender"],
    "hariKerja": lintas["hariKerja"],
    "daftarLibur": lintas["daftarLibur"],
}

# Kasus 3: +10 hari kerja dari Jumat 8 Mei 2026 (melintasi 14–15 Mei).
hasil["tambah10"] = {"hasil": tambah_hari_kerja("2026-05-08", 10)}

# Kasus 4: dua jendela pengoptimal diturunkan ulang dari data mentah.
def _ef(x):
    return int(x) if float(x).is_integer() else x


j1 = jendela_dari_cuti(["2026-05-13"])
j1["efisiensi"] = _ef(j1["jumlahHari"] / 1)
hasil["jendela13Mei2026"] = j1
j2 = jendela_dari_cuti(["2026-05-29"])
j2["efisiensi"] = _ef(j2["jumlahHari"] / 1)
hasil["jendela29Mei2026"] = j2

print(json.dumps(hasil, indent=2, ensure_ascii=False))
