/* Aksi bersama: simpan semua data lalu render ulang */
import { state, simpanTugas, simpanMatkul, simpanAgenda } from "./state.js";
import { setStatus } from "./rules.js";
import { toast } from "./ui.js";
import { renderSemua } from "./views/view-index.js";

export function semua() {
  simpanTugas();
  simpanMatkul();
  simpanAgenda();
  renderSemua();
}

// Centang / batalkan centang sebuah tugas
export function toggleSelesai(id) {
  const t = state.tugas.find((x) => x.id === id);
  if (!t) return;
  setStatus(t, t.status === "selesai" ? "belum" : "selesai");
  semua();
  // efek "pop" pada centang yang baru ditekan (tombol dibuat ulang saat render)
  document
    .querySelectorAll(`[data-act="cek"][data-id="${id}"]`)
    .forEach((b) => b.classList.add("pop"));
  toast(t.status === "selesai" ? "Tugas selesai" : "Selesai dibatalkan");
}
