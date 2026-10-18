/* Satu pendengar klik + keyboard untuk semua tombol ber-atribut data-act */
import { state } from "./state.js";
import { toggleSelesai } from "./actions.js";
import { tujuanDialog } from "./dialog.js";
import {
  bukaForm,
  tambahLangkah,
  toggleLangkah,
  hapusLangkah,
  mintaHapusTugas,
} from "./forms/form-tugas.js";
import { bukaMk, mintaHapusMk } from "./forms/form-matkul.js";
import { bukaFormAgenda, mintaHapusAgenda } from "./forms/form-agenda.js";

export function initEvents() {
  document.addEventListener("click", (e) => {
    const tutup = e.target.closest("[data-tutup]");
    if (tutup) {
      e.preventDefault();
      // data-ke: tujuan khusus (mis. sheet mata kuliah kembali ke form tugas)
      location.hash = tutup.dataset.ke || (tutup.closest("#dialog") ? tujuanDialog() : state.kembali);
      return;
    }
    if (e.target.closest("#addbar")) {
      bukaForm(null);
      return;
    }
    if (e.target.closest("#addbar-agenda")) {
      bukaFormAgenda(null);
      return;
    }
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const { act, id } = el.dataset,
      i = +el.dataset.i;
    switch (act) {
      case "cek":
        return toggleSelesai(id);
      case "edit":
        bukaForm(id);
        location.hash = "#sheet";
        return;
      case "minta-hapus":
        return mintaHapusTugas();
      case "edit-agenda":
        bukaFormAgenda(id);
        location.hash = "#sheet-agenda";
        return;
      case "minta-hapus-agenda":
        return mintaHapusAgenda();
      case "tambah-mk":
        bukaMk();
        location.hash = "#sheet-mk";
        return;
      case "hapus-mk":
        return mintaHapusMk(id);
      case "tambah-langkah":
        return tambahLangkah();
      case "cek-langkah":
        return toggleLangkah(i);
      case "hapus-langkah":
        return hapusLangkah(i);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (e.target.matches("[data-act^=edit]")) e.target.click(); // Enter pada kartu = buka
    if (e.target.id === "f-langkah") {
      e.preventDefault(); // jangan submit form tugas
      tambahLangkah();
    }
  });
}