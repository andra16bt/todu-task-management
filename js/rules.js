/* Aturan bisnis: status tugas, tenggat, progres, rangkaian tepat waktu */
import { state } from "./state.js";
import { p2, tgl, nomorHari } from "./utils.js";

export const byDl = (a, b) => new Date(a.deadline) - new Date(b.deadline);

export const dlJam = (t) => {
  const d = new Date(t.deadline);
  return p2(d.getHours()) + ":" + p2(d.getMinutes());
};

// Dihitung, tidak disimpan
export const terlewat = (t) => t.status !== "selesai" && new Date(t.deadline) < new Date();

// Belum selesai & jatuh tempo <= 24 jam
export const mendesak = () =>
  state.tugas.filter((t) => t.status !== "selesai" && new Date(t.deadline) - Date.now() <= 864e5);

// Teks hitung mundur deadline
export function mundur(t) {
  const dl = new Date(t.deadline),
    now = new Date();
  const h = nomorHari(tgl(dl)) - nomorHari(tgl(now));
  if (h > 1) return h + " hari lagi";
  if (h === 1) return "Besok";
  if (h === 0)
    return dl >= now
      ? "Hari ini"
      : "Terlambat " + Math.max(1, Math.floor((now - dl) / 36e5)) + " jam";
  return "Terlambat " + -h + " hari";
}

export function setStatus(t, st) {
  t.status = st;
  t.selesaiPada = st === "selesai" ? t.selesaiPada || new Date().toISOString() : null;
}

// Persentase progres (dari langkah, atau 0/100 jika tanpa langkah)
export const persen = (t) => {
  const l = t.langkah || [];
  return l.length
    ? Math.round((l.filter((x) => x.selesai).length / l.length) * 100)
    : t.status === "selesai"
      ? 100
      : 0;
};

/* ----- Rangkaian tepat waktu & progres pekan ----- */

// Jumlah tugas berturut-turut yang selesai sebelum deadline.
// Dihitung dari data (tidak disimpan). Putus oleh tugas yang selesai terlambat
// atau belum selesai padahal deadline lewat. Tugas yang belum jatuh tempo dilewati.
export function rangkaianTepatWaktu() {
  let n = 0;
  for (const t of [...state.tugas].sort(byDl).reverse()) {
    if (t.status === "selesai") {
      if (t.selesaiPada && new Date(t.selesaiPada) <= new Date(t.deadline)) n++;
      else break;
    } else if (terlewat(t)) break;
  }
  return n;
}

// Senin 00:00 pekan ini
export function senin(now = new Date()) {
  const s = new Date(now);
  s.setHours(0, 0, 0, 0);
  s.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return s;
}

// Tugas yang jatuh tempo pekan ini (Senin-Minggu)
export function tugasPekan() {
  const a = senin(),
    b = new Date(a);
  b.setDate(a.getDate() + 7);
  return state.tugas.filter((t) => {
    const d = new Date(t.deadline);
    return d >= a && d < b;
  });
}