/* Form tambah mata kuliah (bottom sheet #sheet-mk) + hapus mata kuliah */
import { $, ico, uid, val } from "../utils.js";
import { WARNA } from "../config.js";
import { state, cariMk } from "../state.js";
import { setErr, toast } from "../ui.js";
import { semua } from "../actions.js";
import { konfirmasi } from "../dialog.js";

export function bukaMk() {
  $("#f-mk-nama").value = "";
  setErr("#f-mk-nama", "#e-mk", false);
  // warna default: yang belum dipakai mata kuliah lain
  const pakai = (WARNA.find((w) => !state.matkul.some((m) => m.warna === w[1])) || WARNA[0])[1];
  $("#o-warna").innerHTML = WARNA.map(
    ([n, h]) =>
      `<label class="opt sw"><input type="radio" name="warna" value="${h}"${h === pakai ? " checked" : ""} aria-label="${n}"><span style="background:${h}">${ico("check")}</span></label>`,
  ).join("");
}

// Menghapus mata kuliah ikut menghapus tugas di dalamnya
export function mintaHapusMk(id) {
  const m = cariMk(id),
    n = state.tugas.filter((x) => x.mataKuliahId === id).length;
  konfirmasi(
    "Hapus mata kuliah?",
    n
      ? `"${m.nama}" dan ${n} tugas di dalamnya akan dihapus permanen.`
      : `"${m.nama}" akan dihapus.`,
    () => {
      state.matkul = state.matkul.filter((x) => x.id !== id);
      state.tugas = state.tugas.filter((x) => x.mataKuliahId !== id);
    },
  );
}

export function initFormMk() {
  $("#f-mk").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = $("#f-mk-nama").value.trim();
    setErr("#f-mk-nama", "#e-mk", !nama);
    if (!nama) {
      $("#f-mk-nama").focus();
      return;
    }
    state.matkul.push({ id: uid("mk"), nama, warna: val("warna") || WARNA[0][1] });
    semua();
    toast("Mata kuliah ditambahkan");
    location.hash = "#matkul";
  });
}
