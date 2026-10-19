/* Potongan tampilan yang dipakai beberapa layar */
import { state, cariMk } from "../state.js";
import { TIPE, JENIS } from "../config.js";
import { esc, ico, tgl } from "../utils.js";
import { terlewat, mundur, dlJam } from "../rules.js";
import { kategori, lewat, berlangsung, ingatAktif, jamAgenda, mundurAgenda } from "../aturan-agenda.js";

export const kosong = (t) =>
  `<div class="card center">${ico("list")}<p class="muted">${t}</p></div>`;

// p = penanda tab (label kecil di atas judul), j = judul, s = keterangan, x = tombol opsional
export const kepala = (p, j, s, x = "") =>
  `<div class="pagehead"><div><span class="eyebrow">${p}</span><h1>${j}</h1><p class="muted">${s}</p></div>${x}</div>`;

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
  kepala("Tugas", "Daftar Tugas", sisa()) +
  `<div class="tabs" role="tablist"><a role="tab" aria-selected="${a === "h"}" href="#tugas">${ico("cal")}Harian</a><a role="tab" aria-selected="${a === "p"}" href="#proyek">${ico("folder")}Proyek</a></div>`;

// Satu kartu tugas. g=true: paksa gelap
export function kartu(t, g) {
  const sel = t.status === "selesai",
    tl = terlewat(t),
    dk = !sel && (g || tl || t.status === "dikerjakan");
  const tp = TIPE.find((x) => x[0] === t.tipe),
    jn = JENIS.find((x) => x[0] === (t.jenis || "individu"));
  const status = sel
    ? '<span class="chip prog">Selesai</span>'
    : (tl
        ? `<span class="chip err">${ico("warn")}${mundur(t)}</span>`
        : `<span class="chip lime">${dlJam(t)} &middot; ${mundur(t)}</span>`) +
      (t.status === "dikerjakan"
        ? `<span class="chip prog">${ico("timer")}Dikerjakan</span>`
        : "");
  // tipe (Tugas/Ujian/Quiz/Proyek) dan jenis (Individu/Kelompok)
  const meta =
    status +
    (tp ? `<span class="chip pr">${tp[1]}</span>` : "") +
    (jn ? `<span class="chip pr">${ico(jn[0] === "kelompok" ? "group" : "person")}${jn[1]}</span>` : "");
  return `<article class="tcard ${sel ? "done" : dk ? "card-dark notch" : "lite"}" data-act="edit" data-id="${t.id}" tabindex="0">
   <div class="tmeta">${meta}</div><h3>${esc(t.judul)}</h3>${t.catatan ? `<p class="cat">${esc(t.catatan)}</p>` : ""}
   <div class="trow"><span class="mk"><i class="dot" style="--c:${mkWarna(t)}"></i>${mkNama(t)}</span>
   <button class="check${t.status === "dikerjakan" ? " prog" : ""}" role="checkbox" aria-checked="${sel}" aria-label="${sel ? "Batalkan selesai" : "Tandai selesai"}: ${esc(t.judul)}" data-act="cek" data-id="${t.id}">${ico("check")}</button></div></article>`;
}

// Satu kartu agenda. g=true: paksa gelap
export function kartuAgenda(a, g) {
  const k = kategori(a.kategori),
    lw = lewat(a),
    dk = !lw && (g || berlangsung(a) || ingatAktif(a));
  const d = new Date(a.mulai),
    tglTeks =
      tgl(d) === tgl(new Date())
        ? ""
        : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }) + " &middot; ";
  return `<article class="tcard ${dk ? "card-dark notch" : "lite" + (lw ? " lewat" : "")}" data-act="edit-agenda" data-id="${a.id}" tabindex="0">
   <div class="tmeta"><span class="chip lime">${tglTeks}${jamAgenda(a)}</span><span class="chip pr"><i class="dot" style="--c:${k[2]}"></i>${k[1]}</span></div>
   <h3>${esc(a.judul)}</h3>${a.catatan ? `<p class="cat">${esc(a.catatan)}</p>` : ""}
   <div class="trow"><span class="mk">${a.lokasi ? ico("pin") + esc(a.lokasi) : ""}</span><b class="am">${mundurAgenda(a)}</b></div></article>`;
}
