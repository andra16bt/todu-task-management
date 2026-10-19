/* Render semua layar sekaligus + lencana angka di menu bawah */
import { $ } from "../utils.js";
import { mendesak } from "../rules.js";
import { pengingatAktif } from "../aturan-agenda.js";
import { renderBeranda } from "./view-beranda.js";
import { renderHarian } from "./view-tugas.js";
import { renderProyek } from "./view-proyek.js";
import { renderAgenda } from "./view-agenda.js";

// Lencana angka merah di menu (disembunyikan jika 0)
function lencana(href, n) {
  const menu = $(`.nav [href="${href}"]`);
  let b = $(".badge", menu);
  if (!b) {
    menu.insertAdjacentHTML("beforeend", '<b class="badge" hidden></b>');
    b = $(".badge", menu);
  }
  b.hidden = !n;
  b.textContent = n;
}

export function renderSemua() {
  renderBeranda();
  renderHarian();
  renderProyek();
  renderAgenda();
  lencana("#tugas", mendesak().length);
  lencana("#agenda", pengingatAktif().length);
}
