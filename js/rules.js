/* Aturan bisnis: status tugas, tenggat, progres, streak */
import { state, simpanStreak } from "./state.js";
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

/* ----- Streak ----- */

// Ada tugas selesai di hari d?
export const aktifHari = (d) =>
  state.tugas.some((t) => t.selesaiPada && tgl(new Date(t.selesaiPada)) === d);

// Dipanggil tiap render: reset jika ada hari yang terlewat
export function cekStreak() {
  const s = state.streak;
  if (s.terakhirAktif && nomorHari(tgl(new Date())) - nomorHari(s.terakhirAktif) > 1) {
    state.streak = { jumlah: 0, terakhirAktif: null };
    simpanStreak();
  }
}

// Dipanggil tiap centang berubah
export function updateStreak() {
  const hi = tgl(new Date()),
    s = state.streak;
  if (aktifHari(hi)) {
    if (s.terakhirAktif !== hi) {
      const lanjut = s.terakhirAktif && nomorHari(hi) - nomorHari(s.terakhirAktif) === 1;
      state.streak = { jumlah: (lanjut ? s.jumlah : 0) + 1, terakhirAktif: hi };
    }
  } else if (s.terakhirAktif === hi) {
    // centang dibatalkan & tidak ada lagi tugas selesai hari ini
    const j = Math.max(0, s.jumlah - 1);
    state.streak = {
      jumlah: j,
      terakhirAktif: j ? tgl(new Date(Date.now() - 864e5)) : null,
    };
  }
  simpanStreak();
}
