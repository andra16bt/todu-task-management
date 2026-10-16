/* Alat bantu kecil (tanpa ketergantungan ke bagian lain) */
export const $ = (s, r = document) => r.querySelector(s);

// Cegah HTML nyasar dari input pengguna
export const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

// Ikon dari sprite assets/icons.svg
export const ico = (n) => `<svg class="i"><use href="assets/icons.svg#i-${n}"/></svg>`;

export const uid = (p) =>
  p + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
export const p2 = (n) => String(n).padStart(2, "0");

// Tanggal LOKAL "2026-10-16"
export const tgl = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;

// Tanggal "YYYY-MM-DD" -> nomor hari (untuk selisih hari)
export const nomorHari = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 864e5;
};

// Nilai radio yang terpilih
export const val = (n) => ($('input[name="' + n + '"]:checked') || {}).value || "";
