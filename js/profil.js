/* Layar Profil: nama panggilan, tema, dan kelola data (cadangan, bersihkan, hapus semua) */
import { $, opts, tgl } from "./utils.js";
import { TEMA } from "./config.js";
import { state } from "./state.js";
import { setErr, toast } from "./ui.js";
import { konfirmasi } from "./dialog.js";
import { semua } from "./actions.js";
import { setTema } from "./tema.js";

// Isi ulang tampilan profil dari data (dipanggil saat tab dibuka, bukan tiap render,
// supaya ketikan di kolom nama tidak terhapus)
export function segarkanProfil() {
  const n = state.profil.nama || "";
  $("#pf-avatar").textContent = ([...n.trim()][0] || "?").toUpperCase();
  $("#pf-nama").textContent = n;
  $("#f-pf-nama").value = n;
  setErr("#f-pf-nama", "#e-pf-nama", false);
  $("#o-tema").innerHTML = opts("tema", TEMA, state.tema);
}

/* ----- Cadangan ----- */
export async function eksporData() {
  const isi = JSON.stringify(
    {
      app: "todu",
      versi: 1,
      diekspor: new Date().toISOString(),
      data: {
        profil: state.profil,
        tugas: state.tugas,
        matkul: state.matkul,
        agenda: state.agenda,
        tema: state.tema,
      },
    },
    null,
    2,
  );
  const nama = `todu-cadangan-${tgl(new Date())}.json`,
    file = new File([isi], nama, { type: "application/json" });
  try {
    // iPhone: lembar bagikan (simpan ke Files, AirDrop, dll.)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: "Cadangan Todu" });
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return; // pengguna membatalkan
  }
  const url = URL.createObjectURL(file),
    a = document.createElement("a");
  a.href = url;
  a.download = nama;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Cadangan diunduh");
}

export const pilihFileImpor = () => $("#in-impor").click();

const idOk = (x) => !!x && typeof x.id === "string" && /^[\w-]{1,48}$/.test(x.id);
const tglOk = (s) => typeof s === "string" && !isNaN(new Date(s));
const hexOk = (s) => typeof s === "string" && /^#[0-9a-f]{6}$/i.test(s);

// Baca & bersihkan isi file cadangan; null jika bukan cadangan Todu
export function bacaCadangan(teks) {
  let j;
  try {
    j = JSON.parse(teks);
  } catch (e) {
    return null;
  }
  const d = j && (j.data || j);
  if (!d || !Array.isArray(d.tugas) || !Array.isArray(d.matkul)) return null;
  const langkah = (l) =>
    (Array.isArray(l) ? l : [])
      .filter((x) => x && typeof x.teks === "string")
      .map((x) => ({ id: String(x.id || "").replace(/[^\w-]/g, "").slice(0, 48), teks: x.teks, selesai: x.selesai === true }));
  return {
    matkul: d.matkul.filter((m) => idOk(m) && typeof m.nama === "string" && hexOk(m.warna)),
    tugas: d.tugas
      .filter((t) => idOk(t) && typeof t.judul === "string" && tglOk(t.deadline))
      .map((t) => ({ ...t, langkah: langkah(t.langkah) })),
    agenda: (Array.isArray(d.agenda) ? d.agenda : []).filter(
      (a) => idOk(a) && typeof a.judul === "string" && tglOk(a.mulai),
    ),
    tema: TEMA.some((x) => x[0] === d.tema) ? d.tema : null,
  };
}

/* ----- Bersihkan & hapus ----- */
export function bersihkanSelesai() {
  const n = state.tugas.filter((t) => t.status === "selesai").length;
  if (!n) return toast("Belum ada tugas yang selesai");
  konfirmasi(
    "Bersihkan tugas selesai?",
    `${n} tugas yang sudah selesai akan dihapus. Rangkaian tepat waktu juga mulai dari nol, karena dihitung dari tugas yang tersimpan.`,
    () => {
      state.tugas = state.tugas.filter((t) => t.status !== "selesai");
    },
    { label: "Bersihkan", pesan: "Tugas selesai dibersihkan" },
  );
}

export function hapusSemua() {
  konfirmasi(
    "Hapus semua data?",
    "Semua tugas, agenda, dan mata kuliah akan dihapus permanen. Nama dan tema tetap. Buat cadangan dulu kalau masih perlu.",
    () => {
      state.tugas = [];
      state.matkul = [];
      state.agenda = [];
    },
    { label: "Hapus semua", pesan: "Semua data dihapus" },
  );
}

export function initProfil() {
  $("#f-profil").addEventListener("submit", (e) => {
    e.preventDefault();
    const n = $("#f-pf-nama").value.trim();
    setErr("#f-pf-nama", "#e-pf-nama", !n);
    if (!n) return $("#f-pf-nama").focus();
    state.profil = { ...state.profil, nama: n };
    semua(); // simpan + perbarui sapaan di Beranda
    segarkanProfil();
    toast("Nama diperbarui");
  });

  $("#o-tema").addEventListener("change", (e) => setTema(e.target.value));

  $("#in-impor").addEventListener("change", async (e) => {
    const f = e.target.files[0];
    e.target.value = ""; // supaya file yang sama bisa dipilih lagi
    if (!f) return;
    let teks = "";
    try {
      teks = await f.text();
    } catch (err) {}
    const c = bacaCadangan(teks);
    if (!c) return toast("File cadangan tidak valid");
    konfirmasi(
      "Pulihkan cadangan?",
      `Berisi ${c.tugas.length} tugas, ${c.matkul.length} mata kuliah, dan ${c.agenda.length} agenda. Data saat ini akan diganti.`,
      () => {
        state.tugas = c.tugas;
        state.matkul = c.matkul;
        state.agenda = c.agenda;
        if (c.tema) setTema(c.tema);
        segarkanProfil();
      },
      { label: "Pulihkan", pesan: "Cadangan dipulihkan" },
    );
  });
}
