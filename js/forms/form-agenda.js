/* Form tambah/ubah agenda (bottom sheet #sheet-agenda) */
import { $, uid, tgl, val, opts, hhmm } from "../utils.js";
import { KATEGORI, INGAT } from "../config.js";
import { state } from "../state.js";
import { setErr, toast } from "../ui.js";
import { semua } from "../actions.js";
import { konfirmasi } from "../dialog.js";

let edit = null; // agenda yang sedang diubah (null = baru)

export function bukaFormAgenda(id) {
  edit = id ? state.agenda.find((a) => a.id === id) : null;
  const a = edit || { judul: "", kategori: "lainnya", lokasi: "", catatan: "", ingat: "1jam" };
  const m = edit ? new Date(edit.mulai) : new Date();
  $("#ag-title").textContent = edit ? "Ubah Agenda" : "Agenda Baru";
  $("#f-ag-judul").value = a.judul;
  $("#f-ag-tgl").value = tgl(m);
  $("#f-ag-mulai").value = edit ? hhmm(m) : "09:00";
  $("#f-ag-selesai").value = edit && edit.selesai ? hhmm(new Date(edit.selesai)) : "";
  $("#f-ag-lokasi").value = a.lokasi;
  $("#f-ag-catatan").value = a.catatan;
  $("#o-kat").innerHTML = opts("kat", KATEGORI, a.kategori);
  $("#o-ingat").innerHTML = opts("ingat", INGAT, a.ingat);
  $("#b-ag-hapus").hidden = !edit;
  setErr("#f-ag-judul", "#e-ag-judul", false);
  setErr("#f-ag-tgl", "#e-ag-waktu", false);
  setErr("#f-ag-selesai", "#e-ag-selesai", false);
}

export function mintaHapusAgenda() {
  const x = edit;
  konfirmasi("Hapus agenda ini?", `Agenda "${x.judul}" akan dihapus permanen.`, () => {
    state.agenda = state.agenda.filter((y) => y.id !== x.id);
  });
}

function simpanForm(e) {
  e.preventDefault();
  const judul = $("#f-ag-judul").value.trim(),
    tg = $("#f-ag-tgl").value,
    jm = $("#f-ag-mulai").value,
    js = $("#f-ag-selesai").value;
  const e1 = !judul,
    e2 = !tg || !jm,
    e3 = !!js && !!jm && js <= jm; // jam selesai harus setelah mulai
  setErr("#f-ag-judul", "#e-ag-judul", e1);
  setErr("#f-ag-tgl", "#e-ag-waktu", e2);
  setErr("#f-ag-selesai", "#e-ag-selesai", e3);
  if (e1 || e2 || e3) {
    (e1 ? $("#f-ag-judul") : e2 ? $("#f-ag-tgl") : $("#f-ag-selesai")).focus();
    return;
  }
  const a = edit || { id: uid("ag") };
  Object.assign(a, {
    judul,
    kategori: val("kat") || "lainnya",
    mulai: new Date(tg + "T" + jm).toISOString(),
    selesai: js ? new Date(tg + "T" + js).toISOString() : null,
    lokasi: $("#f-ag-lokasi").value.trim(),
    catatan: $("#f-ag-catatan").value.trim(),
    ingat: val("ingat") || "none",
  });
  if (!edit) state.agenda.push(a);
  semua();
  toast("Agenda disimpan");
  location.hash = state.kembali;
}

export function initFormAgenda() {
  $("#f-agenda").addEventListener("submit", simpanForm);
}
