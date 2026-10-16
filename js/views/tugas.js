/* Layar Tugas (tab Harian): timeline Terlewat / Hari Ini / Mendatang */
import { state } from "../state.js";
import { $, ico, tgl } from "../utils.js";
import { terlewat, byDl, dlJam } from "../rules.js";
import { tabs, kartu, kosong } from "./komponen.js";

// Satu baris timeline
function baris(t) {
  const sel = t.status === "selesai",
    tl = terlewat(t),
    d = new Date(t.deadline);
  const w =
    tgl(d) === tgl(new Date())
      ? dlJam(t)
      : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  return `<li><time class="${tl ? "late" : ""}">${w}</time><i class="tdot ${sel ? "ok" : tl ? "late" : t.status === "dikerjakan" ? "prog" : ""}"></i>${kartu(t)}</li>`;
}

export function renderHarian() {
  const hi = tgl(new Date()),
    u = [...state.tugas].sort(byDl);
  const g = {
    Terlewat: u.filter(terlewat),
    "Hari Ini": u.filter((t) => tgl(new Date(t.deadline)) === hi && !terlewat(t)),
    Mendatang: u.filter((t) => t.status !== "selesai" && tgl(new Date(t.deadline)) > hi),
  };
  const hebat =
    g["Hari Ini"].length &&
    g["Hari Ini"].every((t) => t.status === "selesai") &&
    !g["Terlewat"].length;
  $("#tugas").innerHTML =
    tabs("h") +
    (state.tugas.length ? "" : kosong("Belum ada tugas. Ketuk Tambah Tugas untuk memulai.")) +
    (hebat
      ? `<div class="card center">${ico("check")}<h2>Kamu hebat! Istirahat dulu.</h2></div>`
      : "") +
    Object.entries(g)
      .map(([j, l]) =>
        l.length ? `<h2 class="sec">${j}</h2><ol class="tl">${l.map(baris).join("")}</ol>` : "",
      )
      .join("");
}
