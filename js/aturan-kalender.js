/* Aturan kalender: isi per tanggal, status "free", dan jam kosong di antara agenda */
import { state } from "./state.js";
import { JAM_KOSONG } from "./config.js";
import { tgl } from "./utils.js";
import { akhir as akhirAgenda, byMulai, lewat } from "./aturan-agenda.js";
import { byDl } from "./rules.js";

export const hariIni = () => tgl(new Date());
export const agendaHari = (k) => state.agenda.filter((a) => tgl(new Date(a.mulai)) === k).sort(byMulai);
export const tugasHari = (k) => state.tugas.filter((t) => tgl(new Date(t.deadline)) === k).sort(byDl);

// Status sebuah tanggal (k = "YYYY-MM-DD").
// free = tidak ada agenda dan tidak ada tugas yang belum selesai. Hari ini: agenda yang sudah berakhir tidak dihitung.
export function statusHari(k) {
  const ini = hariIni(),
    agenda = agendaHari(k),
    tugas = tugasHari(k),
    agAktif = agenda.filter((a) => k !== ini || !lewat(a)),
    tgBelum = tugas.filter((t) => t.status !== "selesai"),
    lalu = k < ini;
  return { agenda, tugas, agAktif, tgBelum, lalu, free: !lalu && !agAktif.length && !tgBelum.length };
}

// Jam kosong di antara agenda pada tanggal k, dalam rentang JAM_KOSONG. Hari ini dihitung mulai sekarang.
// Mengembalikan [[Date mulai, Date selesai], ...], slot yang lebih pendek dari batas minimal dibuang.
export function jamKosong(k) {
  const { awal, akhir, min } = JAM_KOSONG,
    ini = hariIni();
  if (k < ini) return [];
  const [y, m, d] = k.split("-").map(Number),
    batas = new Date(y, m - 1, d, akhir);
  let kursor = new Date(y, m - 1, d, awal);
  if (k === ini) {
    const r = new Date(Math.ceil(Date.now() / 9e5) * 9e5); // bulatkan ke atas per 15 menit
    if (r > kursor) kursor = r;
  }
  const sibuk = agendaHari(k)
    .map((a) => [new Date(a.mulai), akhirAgenda(a)])
    .sort((p, q) => p[0] - q[0]);
  const hasil = [];
  for (const [s, e] of sibuk) {
    if (kursor >= batas) break;
    if (e <= kursor) continue;
    if (s > kursor) hasil.push([kursor, s < batas ? s : batas]);
    if (e > kursor) kursor = e;
  }
  if (kursor < batas) hasil.push([kursor, batas]);
  return hasil.filter(([a, b]) => b - a >= min * 6e4);
}

// Kegiatan terdekat setelah tanggal k (agenda atau tugas belum selesai)
export function berikutnya(k) {
  const [y, m, d] = k.split("-").map(Number),
    sejak = new Date(y, m - 1, d + 1);
  return (
    [
      ...state.agenda.filter((a) => new Date(a.mulai) >= sejak).map((a) => ({ judul: a.judul, waktu: new Date(a.mulai) })),
      ...state.tugas
        .filter((t) => t.status !== "selesai" && new Date(t.deadline) >= sejak)
        .map((t) => ({ judul: t.judul, waktu: new Date(t.deadline) })),
    ].sort((p, q) => p.waktu - q.waktu)[0] || null
  );
}

// 90 menit -> "1 j 30 mnt"
export function durasi(ms) {
  const m = Math.round(ms / 6e4),
    j = Math.floor(m / 60),
    s = m % 60;
  return j ? (s ? `${j} j ${s} mnt` : `${j} j`) : `${s} mnt`;
}