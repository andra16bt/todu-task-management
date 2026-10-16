/* Potongan tampilan yang dipakai beberapa layar */
import { state, cariMk } from "../state.js";
import { PRIO } from "../config.js";
import { esc, ico } from "../utils.js";
import { terlewat, mundur, dlJam } from "../rules.js";

export const kosong = (t) =>
  `<div class="card center">${ico("list")}<p class="muted">${t}</p></div>`;

export const kepala = (j, s, x = "") =>
  `<div class="pagehead"><div><h1>${j}</h1><p class="muted">${s}</p></div>${x}</div>`;

export const mkNama = (t) => {
  const m = cariMk(t.mataKuliahId);
  return m ? esc(m.nama) : "Tanpa mata kuliah"; // cadangan untuk data lama
};
export const mkWarna = (t) => {
  const m = cariMk(t.mataKuliahId);
  return m ? m.warna : "#9AA89A";
};

export const sisa = () =>
  state.tugas.filter((t) => t.status !== "selesai").length + " tugas tersisa";

// Header + tab Harian/Proyek (a = "h" atau "p")
export const tabs = (a) =>
  kepala("Daftar Tugas", sisa()) +
  `<div class="tabs" role="tablist"><a role="tab" aria-selected="${a === "h"}" href="#tugas">${ico("cal")}Harian</a><a role="tab" aria-selected="${a === "p"}" href="#proyek">${ico("folder")}Proyek</a></div>`;

// Satu kartu tugas. g=true: paksa gelap
export function kartu(t, g) {
  const sel = t.status === "selesai",
    tl = terlewat(t),
    dk = !sel && (g || tl || t.status === "dikerjakan");
  const pr = PRIO.find((p) => p[0] === t.prioritas);
  const meta = sel
    ? '<span class="chip prog">Selesai</span>'
    : (tl
        ? `<span class="chip err">${ico("warn")}${mundur(t)}</span>`
        : `<span class="chip lime">${dlJam(t)} &middot; ${mundur(t)}</span>`) +
      (t.status === "dikerjakan"
        ? `<span class="chip prog">${ico("timer")}Dikerjakan</span>`
        : "") +
      (pr ? `<span class="chip pr ${pr[0]}">${pr[1]}</span>` : "");
  return `<article class="tcard ${sel ? "done" : dk ? "card-dark notch" : "lite"}" data-act="edit" data-id="${t.id}" tabindex="0">
   <div class="tmeta">${meta}</div><h3>${esc(t.judul)}</h3>
   <div class="trow"><span class="mk"><i class="dot" style="--c:${mkWarna(t)}"></i>${mkNama(t)}</span>
   <button class="check${t.status === "dikerjakan" ? " prog" : ""}" role="checkbox" aria-checked="${sel}" aria-label="${sel ? "Batalkan selesai" : "Tandai selesai"}: ${esc(t.judul)}" data-act="cek" data-id="${t.id}">${ico("check")}</button></div></article>`;
}
