/* Layar Target (statistik ringkas) */
import { state } from "../state.js";
import { $ } from "../utils.js";
import { terlewat } from "../rules.js";
import { kepala } from "./view-komponen.js";

export function renderTarget() {
  const c = (f) => state.tugas.filter(f).length;
  $("#statistik").innerHTML =
    kepala("Target", "Ringkasan", "Perkembangan tugasmu") +
    `<div class="grid3">
   <div class="card card-dark sm"><p class="num lime">${c((t) => t.status === "selesai")}</p><p class="muted-d">Selesai</p></div>
   <div class="card sm"><p class="num">${c((t) => t.status === "dikerjakan" && !terlewat(t))}</p><p class="muted">Dikerjakan</p></div>
   <div class="card sm"><p class="num late-m">${c(terlewat)}</p><p class="muted">Terlewat</p></div></div>`;
}
