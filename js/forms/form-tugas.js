/* Form tambah/ubah tugas (bottom sheet #sheet) */
import { $, esc, ico, uid, tgl, val, opts } from "../utils.js";
import { TIPE, JENIS, STATUS } from "../config.js";
import { state } from "../state.js";
import { dlJam, setStatus } from "../rules.js";
import { setErr, toast } from "../ui.js";
import { semua } from "../actions.js";
import { konfirmasi } from "../dialog.js";

let edit = null; // tugas yang sedang diubah (null = tugas baru)
let lk = []; // langkah-langkah proyek pada form

// Gambar ulang pilihan mata kuliah + tombol "+" (tanpa argumen: pertahankan pilihan saat ini)
export function rMkOpts(sel = val("mk")) {
  $("#o-mk").innerHTML =
    opts(
      "mk",
      state.matkul.map((m) => [m.id, m.nama, m.warna]),
      sel,
    ) +
    `<button type="button" class="opt-add" data-act="tambah-mk" aria-label="Tambah mata kuliah baru">${ico("plus")}</button>`;
  $("#mk-kosong").hidden = state.matkul.length > 0; // petunjuk jika belum ada mata kuliah
}

export const tugasDiedit = () => edit; // tugas yang sedang dibuka di form (null = tugas baru)

const aturLangkah = () => ($("#g-langkah").hidden = val("tipe") !== "proyek"); // langkah hanya untuk Proyek

function rLangkah() {
  $("#l-langkah").innerHTML = lk
    .map(
      (l, i) => `<div class="lrow"><button type="button" class="check" role="checkbox" aria-checked="${l.selesai}" aria-label="Langkah: ${esc(l.teks)}" data-act="cek-langkah" data-i="${i}">${ico("check")}</button>
   <span class="grow${l.selesai ? " coret" : ""}">${esc(l.teks)}</span><button type="button" class="icon-btn" aria-label="Hapus langkah" data-act="hapus-langkah" data-i="${i}">${ico("close")}</button></div>`,
    )
    .join("");
}

export function bukaForm(id) {
  edit = id ? state.tugas.find((t) => t.id === id) : null;
  const t = edit || {
    tipe: "tugas",
    jenis: "individu",
    mataKuliahId: state.matkul[0] ? state.matkul[0].id : "",
    status: "belum",
    judul: "",
    catatan: "",
    langkah: [],
  };
  const d = edit ? new Date(t.deadline) : null;
  $("#sheet-title").textContent = edit ? "Ubah Tugas" : "Tugas Baru";
  $("#f-judul").value = t.judul;
  $("#f-catatan").value = t.catatan;
  $("#f-tgl").value = tgl(d || new Date());
  $("#f-jam").value = d ? dlJam(t) : "23:59";
  $("#o-tipe").innerHTML = opts("tipe", TIPE, t.tipe);
  rMkOpts(t.mataKuliahId);
  $("#e-mk-pilih").hidden = true;
  $("#o-jenis").innerHTML = opts("jenis", JENIS, t.jenis || "individu");
  $("#o-status").innerHTML = opts("status", STATUS, t.status);
  $("#g-status").hidden = $("#b-hapus").hidden = !edit;
  lk = JSON.parse(JSON.stringify(t.langkah || []));
  rLangkah();
  aturLangkah();
  setErr("#f-judul", "#e-judul", false);
  setErr("#f-tgl", "#e-dl", false);
}

/* ----- Aksi langkah & hapus (dipanggil dari events.js) ----- */
export function tambahLangkah() {
  const f = $("#f-langkah"),
    s = f.value.trim();
  if (!s) return;
  lk.push({ id: uid("l"), teks: s, selesai: false });
  f.value = "";
  rLangkah();
  $("#l-langkah").lastElementChild.classList.add("baru");
}
export function toggleLangkah(i) {
  lk[i].selesai = !lk[i].selesai;
  rLangkah();
  $(`[data-act="cek-langkah"][data-i="${i}"]`).classList.add("pop");
}
export function hapusLangkah(i) {
  lk.splice(i, 1);
  rLangkah();
}
export function mintaHapusTugas() {
  const x = edit;
  konfirmasi("Hapus tugas ini?", `Tugas "${x.judul}" akan dihapus permanen.`, () => {
    state.tugas = state.tugas.filter((y) => y.id !== x.id);
  });
}

/* ----- Simpan ----- */
function simpanForm(e) {
  e.preventDefault();
  const judul = $("#f-judul").value.trim(),
    tg = $("#f-tgl").value,
    jm = $("#f-jam").value;
  const e1 = !judul,
    e2 = !tg || !jm,
    e3 = !val("mk"); // mata kuliah wajib dipilih
  setErr("#f-judul", "#e-judul", e1);
  setErr("#f-tgl", "#e-dl", e2);
  $("#e-mk-pilih").hidden = !e3;
  if (e1 || e2 || e3) {
    if (e1) $("#f-judul").focus();
    else if (e2) $("#f-tgl").focus();
    else $("#e-mk-pilih").scrollIntoView({ block: "center" });
    return;
  }
  const tipe = val("tipe"),
    t = edit || {
      id: uid("t"),
      dibuatPada: new Date().toISOString(),
      selesaiPada: null,
      status: "belum",
    };
  Object.assign(t, {
    judul,
    mataKuliahId: val("mk"),
    tipe,
    deadline: new Date(tg + "T" + jm).toISOString(),
    jenis: val("jenis") || "individu",
    catatan: $("#f-catatan").value.trim(),
    langkah: tipe === "proyek" ? lk : [],
  });
  delete t.prioritas; // kolom lama, sudah diganti jenis
  let st = edit ? val("status") : "belum";
  if (tipe === "proyek" && lk.length && lk.every((l) => l.selesai)) st = "selesai"; // semua langkah beres = proyek selesai
  setStatus(t, st);
  if (!edit) state.tugas.push(t);
  semua();
  toast("Tugas disimpan");
  location.hash = state.kembali;
}

export function initFormTugas() {
  $("#o-tipe").addEventListener("change", aturLangkah);
  $("#o-mk").addEventListener("change", () => ($("#e-mk-pilih").hidden = true));
  $("#f-tugas").addEventListener("submit", simpanForm);
}
