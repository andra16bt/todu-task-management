/* Dialog konfirmasi hapus */
import { $ } from "./utils.js";
import { state } from "./state.js";
import { toast } from "./ui.js";
import { semua } from "./actions.js";

let aksiHapus = null;
let tujuan = null; // alamat hash tujuan setelah dialog ditutup (null = layar terakhir)

// aksi() boleh mengembalikan alamat hash tujuan yang menimpa `ke`
export function konfirmasi(judul, teks, aksi, ke = null) {
  $("#dlg-title").textContent = judul;
  $("#dlg-teks").textContent = teks;
  aksiHapus = aksi;
  tujuan = ke;
  location.hash = "#dialog";
}

export const tujuanDialog = () => tujuan || state.kembali;

export function initDialog() {
  $("#dlg-ok").addEventListener("click", () => {
    const hasil = aksiHapus ? aksiHapus() : null,
      ke = hasil || tujuanDialog();
    aksiHapus = null;
    tujuan = null;
    semua();
    toast("Dihapus");
    location.hash = ke;
  });
}