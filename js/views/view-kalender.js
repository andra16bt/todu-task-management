/* Layar Kalender: kalender bulanan + detail (agenda, tugas, jam kosong) untuk tanggal yang dipilih */
import { NAMA_HARI, JAM_KOSONG } from "../config.js";
import { $, esc, ico, tgl, p2 } from "../utils.js";
import { terlewat } from "../rules.js";
import { kategori } from "../aturan-agenda.js";
import { agendaHari, tugasHari, statusHari, jamKosong, berikutnya, durasi, hariIni } from "../aturan-kalender.js";
import { kepala, kartu, kartuAgenda } from "./view-komponen.js";

const hm = (d) => p2(d.getHours()) + ":" + p2(d.getMinutes());
const parse = (k) => new Date(...k.split("-").map((v, i) => (i === 1 ? v - 1 : +v)));
const jam = (n) => p2(n) + ":00";

// Keadaan tampilan (tidak disimpan): bulan yang terlihat & tanggal terpilih
let bulan, dipilih;
export function resetKalender() {
  const n = new Date();
  bulan = { y: n.getFullYear(), m: n.getMonth() };
  dipilih = tgl(n);
}
resetKalender();

export function pilihHari(k) {
  const d = parse(k);
  dipilih = k;
  bulan = { y: d.getFullYear(), m: d.getMonth() };
  renderKalender();
}
export function geserBulan(n) {
  const t = new Date(bulan.y, bulan.m + n, 1);
  bulan = { y: t.getFullYear(), m: t.getMonth() };
  renderKalender();
}
export function kembaliHariIni() {
  resetKalender();
  renderKalender();
}

// Titik penanda: agenda = bulat berwarna kategori, tugas = kotak kecil (merah jika terlewat, kosong jika selesai)
function titik(k) {
  const ag = agendaHari(k).map((a) => `<i class="kd" style="--c:${kategori(a.kategori)[2]}"></i>`),
    tg = tugasHari(k).map((t) => `<i class="kd kt${t.status === "selesai" ? " ok" : terlewat(t) ? " late" : ""}"></i>`);
  return [...ag, ...tg].slice(0, 4).join("");
}

function grid(ini) {
  const pertama = new Date(bulan.y, bulan.m, 1),
    off = (pertama.getDay() + 6) % 7, // Senin = 0
    jml = new Date(bulan.y, bulan.m + 1, 0).getDate(),
    sel = [];
  for (let i = 0; i < Math.ceil((off + jml) / 7) * 7; i++) {
    const d = new Date(bulan.y, bulan.m, 1 - off + i),
      k = tgl(d),
      ag = agendaHari(k),
      tg = tugasHari(k),
      padat = ag.length + tg.filter((t) => t.status !== "selesai").length >= 3,
      cls = ["kal-hari", d.getMonth() !== bulan.m && "luar", k === ini && "today", k === dipilih && "pilih", padat && "padat"]
        .filter(Boolean)
        .join(" "),
      aria = `${d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}: ${ag.length} agenda, ${tg.length} tugas`;
    sel.push(
      `<button type="button" class="${cls}" data-act="kal-hari" data-tgl="${k}" aria-label="${aria}" aria-pressed="${k === dipilih}"><span class="n">${d.getDate()}</span><span class="titik">${titik(k)}</span></button>`,
    );
  }
  return sel.join("");
}

const chipSlot = (slots) =>
  `<div class="slots">${slots.map(([a, b]) => `<span class="chip lime">${hm(a)}&ndash;${hm(b)} &middot; ${durasi(b - a)}</span>`).join("")}</div>`;

// Detail tanggal yang dipilih
function detail(ini) {
  const s = statusHari(dipilih),
    d = parse(dipilih),
    slots = jamKosong(dipilih),
    total = s.agenda.length + s.tugas.length,
    label = (dipilih === ini ? "Hari ini &middot; " : "") + d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" }),
    chip = s.lalu
      ? total
        ? ""
        : '<span class="chip pr">Kosong</span>'
      : s.free
        ? '<span class="chip lime">Free</span>'
        : `<span class="chip ink">${total} kegiatan</span>`;

  let atas = "";
  if (s.free) {
    const nx = berikutnya(dipilih);
    atas = `<div class="card center kal-free"><span class="ic">${ico("check")}</span>
      <h2>${dipilih === ini ? "Free hari ini" : "Free seharian"}</h2>
      <p class="muted">Tidak ada agenda maupun tugas yang jatuh tempo.</p>
      ${slots.length ? chipSlot(slots) : '<p class="muted">Rentang jam kegiatan hari ini sudah lewat.</p>'}
      ${nx ? `<p class="muted">Berikutnya: <b>${esc(nx.judul)}</b> &middot; ${nx.waktu.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}, ${hm(nx.waktu)}</p>` : ""}</div>`;
  } else if (!s.lalu) {
    atas = `<h3 class="kal-sub">Jam kosong</h3><div class="card kal-slot">
      ${slots.length ? chipSlot(slots) : `<p class="muted">Tidak ada jam kosong antara ${jam(JAM_KOSONG.awal)} dan ${jam(JAM_KOSONG.akhir)}.</p>`}
      <p class="muted">Dihitung dari agenda, antara ${jam(JAM_KOSONG.awal)}&ndash;${jam(JAM_KOSONG.akhir)}.</p></div>`;
  } else if (!total) {
    atas = `<div class="card center"><p class="muted">Tidak ada kegiatan di tanggal ini.</p></div>`;
  }

  return `<div class="sech"><h2>${label}</h2>${chip}</div>${atas}
    ${s.agenda.length ? `<h3 class="kal-sub">Agenda</h3>${s.agenda.map((a) => kartuAgenda(a)).join("")}` : ""}
    ${s.tugas.length ? `<h3 class="kal-sub">Tugas jatuh tempo</h3>${s.tugas.map((t) => kartu(t)).join("")}` : ""}`;
}

// Ringkasan "hari ini" di bawah judul halaman
function ringkas() {
  const s = statusHari(hariIni());
  if (s.free) return "Hari ini free, tidak ada agenda maupun tugas yang jatuh tempo";
  const b = [];
  if (s.agAktif.length) b.push(`${s.agAktif.length} agenda`);
  if (s.tgBelum.length) b.push(`${s.tgBelum.length} tugas belum selesai`);
  return "Hari ini: " + b.join(" &middot; ");
}

export function renderKalender() {
  const ini = hariIni(),
    sekarang = new Date(),
    bukanIni = dipilih !== ini || bulan.y !== sekarang.getFullYear() || bulan.m !== sekarang.getMonth();
  $("#kalender").innerHTML =
    kepala("Kalender", "Jadwalmu", ringkas()) +
    `<div class="kal">
      <div class="kal-top"><h2>${new Date(bulan.y, bulan.m, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</h2>
        <div class="kal-nav">${bukanIni ? '<button type="button" class="chip lime" data-act="kal-hariini">Hari ini</button>' : ""}
          <button type="button" class="icon-btn" data-act="kal-bulan" data-d="-1" aria-label="Bulan sebelumnya">${ico("prev")}</button>
          <button type="button" class="icon-btn" data-act="kal-bulan" data-d="1" aria-label="Bulan berikutnya">${ico("next")}</button></div></div>
      <div class="kal-week">${NAMA_HARI.map((h) => `<span>${h}</span>`).join("")}</div>
      <div class="kal-grid">${grid(ini)}</div>
      <p class="muted kal-legenda"><i class="kd" style="--c:var(--olive)"></i> Agenda <i class="kd kt"></i> Tugas <i class="kd kt late"></i> Terlewat</p>
    </div>` +
    detail(ini);
}