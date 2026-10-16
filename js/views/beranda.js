/* Layar Beranda */
import { state } from "../state.js";
import { NAMA_HARI } from "../config.js";
import { $, esc, ico, tgl } from "../utils.js";
import { mendesak, terlewat, byDl, aktifHari } from "../rules.js";
import { kepala, kartu, kosong } from "./komponen.js";

export function renderBeranda() {
  const now = new Date(),
    hi = tgl(now),
    n = mendesak(),
    sen = new Date(now);
  sen.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // Senin minggu ini
  let ok = 0;
  const week = NAMA_HARI.map((h, i) => {
    const d = new Date(sen);
    d.setDate(sen.getDate() + i);
    const s = tgl(d),
      a = aktifHari(s);
    if (a) ok++;
    return `<div class="day${s === hi ? " today" : ""}"><span>${h}</span><i class="ck${a ? " on" : ""}">${a ? ico("check") : s === hi ? ico("timer") : ""}</i></div>`;
  }).join("");
  const dekat = state.tugas
    .filter((t) => t.status !== "selesai")
    .sort(byDl)
    .slice(0, 3);
  const ban = n.length
    ? `<a class="banner" href="#tugas">${ico("bolt")}<span>${n.length} tugas ${n.some(terlewat) ? "mendesak, ada yang terlambat" : "jatuh tempo dalam 24 jam"}</span>${ico("next")}</a>`
    : "";
  const s = state.streak.jumlah,
    aman = aktifHari(hi);
  $("#beranda").innerHTML =
    kepala(
      `Halo, ${esc(state.profil.nama)}`,
      now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    ) +
    ban +
    `<div class="card big"><div class="wk-h"><h2>Target Pekan Ini</h2><span class="pill">${ok}/7 Hari</span></div><div class="week">${week}</div></div>
  <div class="grid2"><a class="card sum" href="#matkul"><div class="top2"><span class="ic">${ico("book")}</span>${ico("arrow-ne")}</div><div><p class="num">${state.matkul.length}</p><p class="muted"><b>Mata Kuliah Aktif</b></p></div></a>
  <div class="card card-dark sum notch"><div class="top2"><span class="ic">${ico("flame")}</span></div><div><p class="num lime">${s} <small>Hari</small></p><p class="muted-d">Berturut-turut</p></div></div></div>
  <div class="sech"><h2 class="al">${ico("alarm")}Segera Jatuh Tempo</h2><a href="#tugas" class="lnk">Lihat Semua</a></div>
  ${dekat.map((t) => kartu(t, true)).join("") || kosong("Belum ada tugas. Ketuk Tambah Tugas untuk memulai.")}
  <div class="tip"><span class="ic">${ico("school")}</span><div><h3>Jaga Ritme Belajarmu</h3><p class="muted">${aman ? `Streak ${s} hari aman. Pertahankan besok!` : `Selesaikan 1 tugas hari ini untuk ${s ? "amankan streak " + (s + 1) + " hari" : "memulai streak"}.`}</p></div></div>`;
}
