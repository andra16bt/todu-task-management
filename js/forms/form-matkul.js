/* Sheet "Mata Kuliah Baru": nama + warna, plus daftar mata kuliah untuk dihapus.
   Dibuka dari tombol + di form tugas, dan kembali ke form tugas setelah selesai. */
import { $, esc, ico, uid, val } from "../utils.js";
import { WARNA } from "../config.js";
import { state, cariMk } from "../state.js";
import { setErr, toast } from "../ui.js";
import { semua } from "../actions.js";
import { konfirmasi } from "../dialog.js";
import { rMkOpts, tugasDiedit } from "./form-tugas.js";

// Daftar mata kuliah yang sudah ada (dengan tombol hapus)
function rDaftarMk() {
  $("#g-daftar-mk").hidden = !state.matkul.length;
  $("#l-daftar-mk").innerHTML = state.matkul
    .map((m) => {
      const n = state.tugas.filter((t) => t.mataKuliahId === m.id).length;
      return `<div class="mk-row"><i class="dot big" style="--c:${m.warna}"></i><div class="grow"><b>${esc(m.nama)}</b><p class="muted">${n} tugas</p></div>
     <button type="button" class="icon-btn" data-act="hapus-mk" data-id="${m.id}" aria-label="Hapus ${esc(m.nama)}">${ico("trash")}</button></div>`;
    })
    .join("");
}

export function bukaMk() {
  $("#f-mk-nama").value = "";
  setErr("#f-mk-nama", "#e-mk", false);
  // warna default: yang belum dipakai mata kuliah lain
  const pakai = (WARNA.find((w) => !state.matkul.some((m) => m.warna === w[1])) || WARNA[0])[1];
  $("#o-warna").innerHTML = WARNA.map(
    ([n, h]) =>
      `<label class="opt sw"><input type="radio" name="warna" value="${h}"${h === pakai ? " checked" : ""} aria-label="${n}"><span style="background:${h}">${ico("check")}</span></label>`,
  ).join("");
  rDaftarMk();
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
      const dibuka = tugasDiedit();
      state.matkul = state.matkul.filter((x) => x.id !== id);
      state.tugas = state.tugas.filter((x) => x.mataKuliahId !== id);
      rDaftarMk();
      rMkOpts();
      // jika tugas yang sedang dibuka di form ikut terhapus, tutup form tugas
      return dibuka && dibuka.mataKuliahId === id ? state.kembali : "#sheet-mk";
    },
    { ke: "#sheet-mk" },
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
    const m = { id: uid("mk"), nama, warna: val("warna") || WARNA[0][1] };
    state.matkul.push(m);
    semua();
    rMkOpts(m.id); // mata kuliah baru langsung terpilih di form tugas
    toast("Mata kuliah ditambahkan");
    location.hash = "#sheet";
  });
}
