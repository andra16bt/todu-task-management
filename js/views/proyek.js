/* Layar Proyek: kartu progres per proyek */
import { state } from "../state.js";
import { $, esc, ico } from "../utils.js";
import { byDl, mundur, persen } from "../rules.js";
import { tabs, kosong, mkNama, mkWarna } from "./komponen.js";

export function renderProyek() {
  const ps = state.tugas.filter((t) => t.tipe === "proyek").sort(byDl);
  $("#proyek").innerHTML =
    tabs("p") +
    (ps
      .map((t) => {
        const p = persen(t),
          l = t.langkah || [];
        return `<article class="card big proj" data-act="edit" data-id="${t.id}" tabindex="0">
     <div class="wk-h"><span class="mk2"><i class="dot" style="--c:${mkWarna(t)}"></i>${mkNama(t)}</span><span class="chip ink">${mundur(t)}</span></div>
     <h3>${esc(t.judul)}</h3>${t.catatan ? `<p class="muted">${esc(t.catatan)}</p>` : ""}
     <div class="wk-h"><b>${l.length ? l.filter((x) => x.selesai).length + " dari " + l.length + " langkah selesai" : "Belum ada langkah"}</b><b class="pc">${p}%</b></div>
     <div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" style="--p:${p}%"><i></i></div>
     <div class="steps">${l
       .slice(0, 3)
       .map(
         (x) =>
           `<span class="stp${x.selesai ? " ok" : ""}">${ico(x.selesai ? "check" : "timer")}${esc(x.teks)}</span>`,
       )
       .join("")}</div></article>`;
      })
      .join("") ||
      kosong("Belum ada proyek. Buat tugas bertipe Proyek untuk memantau progres."));
}
