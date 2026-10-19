/* Layar Beranda */
import { state } from "../state.js";
import { NAMA_HARI } from "../config.js";
import { $, esc, ico, tgl } from "../utils.js";
import { mendesak, terlewat, byDl, rangkaianTepatWaktu, tugasPekan, senin } from "../rules.js";
import { byMulai, lewat, pengingatAktif, mundurAgenda } from "../aturan-agenda.js";
import { kepala, kartu, kartuAgenda, kosong } from "./view-komponen.js";

export function renderBeranda() {
  const now = new Date(),
    hi = tgl(now),
    n = mendesak(),
    sen = senin(now);

  // Progres pekan ini: tugas yang jatuh tempo Senin-Minggu
  const pekan = tugasPekan(),
    selesaiP = pekan.filter((t) => t.status === "selesai").length,
    pP = pekan.length ? Math.round((selesaiP / pekan.length) * 100) : 0;
  const week = NAMA_HARI.map((h, i) => {
    const d = new Date(sen);
    d.setDate(sen.getDate() + i);
    const s = tgl(d),
      ada = pekan.filter((t) => tgl(new Date(t.deadline)) === s),
      beres = ada.length > 0 && ada.every((t) => t.status === "selesai");
    return `<div class="day${s === hi ? " today" : ""}"><span>${h}</span><i class="ck${beres ? " on" : ""}">${beres ? ico("check") : ""}</i></div>`;
  }).join("");
  const barP = pekan.length
    ? `<div class="bar" role="progressbar" aria-label="Progres tugas pekan ini" aria-valuenow="${pP}" aria-valuemin="0" aria-valuemax="100" style="--p:${pP}%"><i></i></div>`
    : `<p class="muted">Belum ada tugas jatuh tempo pekan ini.</p>`;

  const dekat = state.tugas
    .filter((t) => t.status !== "selesai")
    .sort(byDl)
    .slice(0, 3);
  const ban = n.length
    ? `<a class="banner" href="#tugas">${ico("bolt")}<span>${n.length} tugas ${n.some(terlewat) ? "mendesak, ada yang terlambat" : "jatuh tempo dalam 24 jam"}</span>${ico("next")}</a>`
    : "";
  const r = rangkaianTepatWaktu(),
    belum = state.tugas.filter((t) => t.status !== "selesai").length;

  // Pengingat agenda + agenda terdekat
  const ing = pengingatAktif(),
    banAg = ing.length
      ? `<a class="banner" href="#agenda">${ico("bell")}<span>${ing.length === 1 ? `${esc(ing[0].judul)} &middot; ${mundurAgenda(ing[0])}` : `${ing.length} agenda segera dimulai`}</span>${ico("next")}</a>`
      : "";
  const agDekat = state.agenda
    .filter((a) => !lewat(a))
    .sort(byMulai)
    .slice(0, 2);
  const secAg = agDekat.length
    ? `<div class="sech"><h2>${ico("bookmark")}Agenda Terdekat</h2><a href="#agenda" class="lnk">Lihat Semua</a></div>${agDekat.map((a) => kartuAgenda(a, true)).join("")}`
    : "";

  $("#beranda").innerHTML =
    kepala(
      "Beranda",
      `Halo, ${esc(state.profil.nama)}`,
      now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    ) +
    ban +
    banAg +
    `<div class="card big"><div class="wk-h"><h2>Progres Pekan Ini</h2><span class="pill">${selesaiP}/${pekan.length} Tugas</span></div><div class="week">${week}</div>${barP}</div>
  <div class="grid2"><a class="card sum" href="#tugas"><div class="top2"><span class="ic">${ico("list")}</span>${ico("arrow-ne")}</div><div><p class="num">${belum}</p><p class="muted"><b>Tugas Belum Selesai</b></p></div></a>
  <div class="card card-dark sum notch"><div class="top2"><span class="ic">${ico("flame")}</span></div><div><p class="num lime">${r} <small>Tugas</small></p><p class="muted-d">Tepat waktu berturut-turut</p></div></div></div>
  <div class="sech"><h2 class="al">${ico("alarm")}Segera Jatuh Tempo</h2><a href="#tugas" class="lnk">Lihat Semua</a></div>
  ${dekat.map((t) => kartu(t, true)).join("") || kosong("Belum ada tugas. Ketuk Tambah Tugas untuk memulai.")}
  ${secAg}
  <div class="tip"><span class="ic">${ico("school")}</span><div><h3>Jaga Ritme Belajarmu</h3><p class="muted">${r ? `${r} tugas berturut-turut selesai tepat waktu. Pertahankan!` : "Selesaikan tugas sebelum deadline untuk memulai rangkaianmu."}</p></div></div>`;
}
