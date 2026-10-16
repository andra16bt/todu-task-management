/* Dialog konfirmasi hapus */
import { $ } from "./utils.js";
import { state } from "./state.js";
import { toast } from "./ui.js";
import { semua } from "./actions.js";

let aksiHapus = null;

export function konfirmasi(judul, teks, aksi) {
  $("#dlg-title").textContent = judul;
  $("#dlg-teks").textContent = teks;
  aksiHapus = aksi;
  location.hash = "#dialog";
}

export function initDialog() {
  $("#dlg-ok").addEventListener("click", () => {
    if (aksiHapus) aksiHapus();
    aksiHapus = null;
    semua();
    toast("Dihapus");
    location.hash = state.kembali;
  });
}
