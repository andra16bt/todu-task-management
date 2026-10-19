/* Dialog konfirmasi (hapus, pulihkan, bersihkan, dll.) */
import { $ } from "./utils.js";
import { state } from "./state.js";
import { toast } from "./ui.js";
import { semua } from "./actions.js";

let aksiOk = null;
let tujuan = null; // alamat hash tujuan setelah dialog ditutup (null = layar terakhir)
let pesanOk = "Dihapus";

// opsi: ke = tujuan setelah selesai, label = teks tombol, pesan = toast sukses.
// aksi() boleh mengembalikan alamat hash tujuan yang menimpa `ke`.
export function konfirmasi(judul, teks, aksi, { ke = null, label = "Hapus", pesan = "Dihapus" } = {}) {
  $("#dlg-title").textContent = judul;
  $("#dlg-teks").textContent = teks;
  $("#dlg-ok").textContent = label;
  aksiOk = aksi;
  tujuan = ke;
  pesanOk = pesan;
  location.hash = "#dialog";
}

export const tujuanDialog = () => tujuan || state.kembali;

export function initDialog() {
  $("#dlg-ok").addEventListener("click", () => {
    const hasil = aksiOk ? aksiOk() : null,
      ke = hasil || tujuanDialog();
    aksiOk = null;
    tujuan = null;
    semua();
    toast(pesanOk);
    location.hash = ke;
  });
}
