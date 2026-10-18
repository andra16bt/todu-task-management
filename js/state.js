/* Data aplikasi (satu objek bersama) + fungsi simpan per bagian */
import { muat, simpan } from "./storage.js";

export const state = {
  profil: muat("profil", { nama: "", sudahOnboarding: false }),
  tugas: muat("tugas", []),
  matkul: muat("matakuliah", []),
  agenda: muat("agenda", []),
  kembali: "#beranda", // layar terakhir sebelum sheet/dialog dibuka
};

export const cariMk = (id) => state.matkul.find((m) => m.id === id);

export const simpanProfil = () => simpan("profil", state.profil);
export const simpanTugas = () => simpan("tugas", state.tugas);
export const simpanMatkul = () => simpan("matakuliah", state.matkul);
export const simpanAgenda = () => simpan("agenda", state.agenda);
