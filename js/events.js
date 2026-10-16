/* Satu pendengar klik + keyboard untuk semua tombol ber-atribut data-act */
import { state } from "./state.js";
import { toggleSelesai } from "./actions.js";
import {
  bukaForm,
  tambahLangkah,
  toggleLangkah,
  hapusLangkah,
  mintaHapusTugas,
} from "./forms/tugas.js";
import { bukaMk, mintaHapusMk } from "./forms/matkul.js";

export function initEvents() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-tutup]")) {
      e.preventDefault();
      location.hash = state.kembali;
      return;
    }
    if (e.target.closest("#addbar")) {
      bukaForm(null);
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
    if (e.target.matches("[data-act=edit]")) e.target.click(); // Enter pada kartu = buka
    if (e.target.id === "f-langkah") {
      e.preventDefault(); // jangan submit form tugas
      tambahLangkah();
    }
  });
}
