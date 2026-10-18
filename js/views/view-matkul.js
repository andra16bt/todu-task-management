/* Layar Mata Kuliah */
import { state } from "../state.js";
import { $, esc, ico } from "../utils.js";
import { kepala, kosong } from "./view-komponen.js";

export function renderMatkul() {
  const aktif = state.tugas.filter((t) => t.status !== "selesai").length;
  $("#matkul").innerHTML =
    kepala(
      "Matkul",
      "Mata Kuliah",
      `${state.matkul.length} mata kuliah aktif`,
      `<button class="btn btn-ink sm" data-act="tambah-mk">${ico("plus")}Tambah</button>`,
    ) +
    (state.matkul
      .map((m) => {
        const n = state.tugas.filter(
          (t) => t.mataKuliahId === m.id && t.status !== "selesai",
        ).length;
        return `<div class="card sm row"><i class="dot big" style="--c:${m.warna}"></i><div class="grow"><h3>${esc(m.nama)}</h3><p class="muted">${n} tugas aktif</p></div>
     <button class="icon-btn" data-act="hapus-mk" data-id="${m.id}" aria-label="Hapus ${esc(m.nama)}">${ico("trash")}</button></div>`;
      })
      .join("") || kosong("Tambahkan mata kuliahmu dulu agar tugas mudah dikelompokkan.")) +
    (state.matkul.length
      ? `<div class="tip"><span class="ic">${ico("school")}</span><div><h3>Beban Semester</h3><p class="muted">Total ${aktif} tugas aktif di ${state.matkul.length} mata kuliah.</p></div></div>`
      : "");
}
