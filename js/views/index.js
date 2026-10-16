/* Render semua layar sekaligus + badge menu + judul header */
import { $ } from "../utils.js";
import { JUDUL_HALAMAN } from "../config.js";
import { cekStreak, mendesak } from "../rules.js";
import { renderBeranda } from "./beranda.js";
import { renderHarian } from "./tugas.js";
import { renderProyek } from "./proyek.js";
import { renderTarget } from "./target.js";
import { renderMatkul } from "./matkul.js";

export function renderSemua() {
  cekStreak();
  renderBeranda();
  renderHarian();
  renderProyek();
  renderTarget();
  renderMatkul();
  const nt = $('.nav [href="#tugas"]');
  let b = $(".badge", nt); // badge angka di menu Tugas
  if (!b) {
    nt.insertAdjacentHTML("beforeend", '<b class="badge" hidden></b>');
    b = $(".badge", nt);
  }
  const n = mendesak().length;
  b.hidden = !n;
  b.textContent = n;
  $("#judul-hal").textContent = JUDUL_HALAMAN[location.hash] || "Beranda";
}
