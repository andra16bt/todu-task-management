/* Form tambah/ubah tugas (bottom sheet #sheet) */
import { $, esc, ico, uid, tgl, val } from "../utils.js";
import { TIPE, PRIO, STATUS } from "../config.js";
import { state } from "../state.js";
import { dlJam, setStatus } from "../rules.js";
import { setErr, toast } from "../ui.js";
import { semua } from "../actions.js";
import { konfirmasi } from "../dialog.js";

let edit = null; // tugas yang sedang diubah (null = tugas baru)
let lk = []; // langkah-langkah proyek pada form

const opts = (name, arr, sel) =>
  arr
    .map(
      ([v, l, c]) =>
        `<label class="opt"><input type="radio" name="${name}" value="${esc(v)}"${v === sel ? " checked" : ""}><span>${c ? `<i class="dot" style="--c:${c}"></i>` : ""}${esc(l)}</span></label>`,
    )
    .join("");

function rMkOpts(sel) {
  $("#o-mk").innerHTML = opts(
    "mk",
    state.matkul.map((m) => [m.id, m.nama, m.warna]),
    sel,
  );
  $("#mk-kosong").hidden = state.matkul.length > 0; // petunjuk jika belum ada mata kuliah
}

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
    prioritas: "sedang",
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
  $("#o-prio").innerHTML = opts("prio", PRIO, t.prioritas);
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
}
export function toggleLangkah(i) {
  lk[i].selesai = !lk[i].selesai;
  rLangkah();
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
    prioritas: val("prio"),
    catatan: $("#f-catatan").value.trim(),
    langkah: tipe === "proyek" ? lk : [],
  });
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
