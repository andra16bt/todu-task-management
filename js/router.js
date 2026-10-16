/* Perpindahan layar berbasis hash (#beranda, #tugas, ...) */
import { state } from "./state.js";
import { LAYAR } from "./config.js";
import { renderSemua } from "./views/index.js";

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
  renderSemua();
}

export function initRouter() {
  addEventListener("hashchange", rute);
  if (!LAYAR.includes(location.hash) && location.hash !== "#welcome")
    history.replaceState(null, "", "#beranda");
  rute();
  setInterval(renderSemua, 60000); // segarkan hitung mundur tiap menit
}
