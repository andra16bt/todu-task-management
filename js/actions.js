/* Aksi bersama: simpan semua data lalu render ulang */
import { state, simpanTugas, simpanMatkul } from "./state.js";
import { setStatus, updateStreak } from "./rules.js";
import { toast } from "./ui.js";
import { renderSemua } from "./views/index.js";

export function semua() {
  simpanTugas();
  simpanMatkul();
  updateStreak();
  renderSemua();
}

// Centang / batalkan centang sebuah tugas
export function toggleSelesai(id) {
  const t = state.tugas.find((x) => x.id === id);
  if (!t) return;
  setStatus(t, t.status === "selesai" ? "belum" : "selesai");
  semua();
  toast(t.status === "selesai" ? "Tugas selesai" : "Selesai dibatalkan");
}
