/* Layar Agenda: Berlangsung / Hari Ini / Mendatang / Sudah Lewat */
import { state } from "../state.js";
import { $, ico, tgl } from "../utils.js";
import { byMulai, berlangsung, lewat } from "../aturan-agenda.js";
import { kepala, kartuAgenda, kosong } from "./view-komponen.js";

export function renderAgenda() {
  const hi = tgl(new Date()),
    u = [...state.agenda].sort(byMulai),
    aktif = u.filter((a) => !lewat(a));
  const g = {
    Berlangsung: aktif.filter(berlangsung),
    "Hari Ini": aktif.filter((a) => !berlangsung(a) && tgl(new Date(a.mulai)) === hi),
    Mendatang: aktif.filter((a) => !berlangsung(a) && tgl(new Date(a.mulai)) > hi),
    "Sudah Lewat": u.filter(lewat).reverse().slice(0, 5), // 5 terakhir saja
  };
  $("#agenda").innerHTML =
    kepala("Agenda", "Kegiatanmu", `${aktif.length} agenda mendatang`) +
    (state.agenda.length
      ? ""
      : kosong("Belum ada agenda. Ketuk Tambah Agenda untuk mencatat wawancara, rapat panitia, atau kegiatan lain.")) +
    Object.entries(g)
      .map(([j, l]) => (l.length ? `<h2 class="sec">${j}</h2>${l.map((a) => kartuAgenda(a)).join("")}` : ""))
      .join("");
}
