/* Aturan agenda: waktu, status berlangsung/lewat, pengingat */
import { state } from "./state.js";
import { KATEGORI, INGAT_MS } from "./config.js";
import { p2, tgl, nomorHari } from "./utils.js";

export const kategori = (id) => KATEGORI.find((k) => k[0] === id) || KATEGORI[KATEGORI.length - 1];
export const byMulai = (a, b) => new Date(a.mulai) - new Date(b.mulai);

// Tanpa jam selesai dianggap berlangsung 1 jam
export const akhir = (a) => new Date(a.selesai || new Date(a.mulai).getTime() + 36e5);
export const berlangsung = (a) => new Date(a.mulai) <= Date.now() && Date.now() < akhir(a);
export const lewat = (a) => akhir(a) <= Date.now();

const jam = (d) => p2(d.getHours()) + ":" + p2(d.getMinutes());
export const jamAgenda = (a) => jam(new Date(a.mulai)) + (a.selesai ? "–" + jam(new Date(a.selesai)) : "");

// Teks hitung mundur agenda
export function mundurAgenda(a) {
  if (berlangsung(a)) return "Berlangsung";
  if (lewat(a)) return "Selesai";
  const mulai = new Date(a.mulai),
    ms = mulai - Date.now();
  if (ms < 36e5) return Math.max(1, Math.ceil(ms / 6e4)) + " menit lagi";
  const h = nomorHari(tgl(mulai)) - nomorHari(tgl(new Date()));
  if (h === 0) return Math.floor(ms / 36e5) + " jam lagi";
  if (h === 1) return "Besok";
  return h + " hari lagi";
}

// Pengingat aktif: sudah masuk waktu pengingat tapi agenda belum mulai
export const ingatAktif = (a) => {
  const ms = INGAT_MS[a.ingat];
  if (!ms) return false;
  const mulai = new Date(a.mulai).getTime();
  return Date.now() >= mulai - ms && Date.now() < mulai;
};
export const pengingatAktif = () => state.agenda.filter(ingatAktif).sort(byMulai);
