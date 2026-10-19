/* Perpindahan layar berbasis hash (#beranda, #tugas, ...) */
import { state } from "./state.js";
import { LAYAR } from "./config.js";
import { $ } from "./utils.js";
import { segarkanProfil } from "./profil.js";
import { renderSemua } from "./views/view-index.js";

const URUTAN = LAYAR.map((h) => h.slice(1)); // urutan layar untuk arah geser
let layarKini = null;

// Ganti layar aktif: atur data-layar, menu bawah, dan animasi masuk
function pindahLayar(layar) {
  if (layar === layarKini) return; // mis. sheet dibuka: layar di belakangnya tetap
  const dari = URUTAN.indexOf(layarKini),
    ke = URUTAN.indexOf(layar);
  layarKini = layar;
  $(".app").dataset.layar = layar;

  // menu bawah: tandai aktif + geser lingkaran hitam (tab Proyek termasuk menu Tugas)
  const menu = "#" + (layar === "proyek" ? "tugas" : layar),
    links = [...document.querySelectorAll(".nav a")];
  links.forEach((a) =>
    a.getAttribute("href") === menu
      ? a.setAttribute("aria-current", "page")
      : a.removeAttribute("aria-current"),
  );
  $(".nav").style.setProperty("--n", Math.max(0, links.findIndex((a) => a.getAttribute("href") === menu)));

  if (layar === "profil") segarkanProfil();

  // animasi masuk layar (geser dari arah tab tujuan)
  const el = $("#" + layar),
    geser = dari < 0 || ke < 0 ? 0 : ke > dari ? 18 : -18;
  el.style.setProperty("--geser", geser + "px");
  el.classList.remove("masuk");
  void el.offsetWidth; // mulai ulang animasi
  el.classList.add("masuk");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("masuk"), 800);
}

function rute() {
  const h = location.hash;
  if (!state.profil.sudahOnboarding && h !== "#welcome") {
    location.hash = "#welcome"; // belum onboarding -> Welcome
    return;
  }
  if (state.profil.sudahOnboarding && h === "#welcome") {
    location.hash = "#beranda";
    return;
  }
  if (LAYAR.includes(h)) state.kembali = h;
  // Layar aktif tetap yang terakhir dibuka walau sheet/dialog sedang terbuka
  pindahLayar(h === "#welcome" ? "welcome" : state.kembali.slice(1));
  renderSemua();
}

export function initRouter() {
  addEventListener("hashchange", rute);
  if (!LAYAR.includes(location.hash) && location.hash !== "#welcome")
    history.replaceState(null, "", "#beranda");
  rute();
  void $(".nav").offsetWidth;
  $(".nav").classList.add("siap"); // aktifkan transisi lingkaran menu setelah posisi awal terpasang
  setInterval(renderSemua, 60000); // segarkan hitung mundur tiap menit
}
