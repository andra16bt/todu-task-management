/* Layar Welcome (tampil sekali, pertama kali buka) */
import { $ } from "./utils.js";
import { state, simpanProfil } from "./state.js";

export function initWelcome() {
  if (state.profil.nama) $("#in-nama").value = state.profil.nama;
  $("#btn-mulai").addEventListener("click", (e) => {
    const n = $("#in-nama").value.trim();
    if (!n) {
      e.preventDefault();
      $("#in-nama").focus();
      return;
    }
    state.profil = { nama: n, sudahOnboarding: true };
    simpanProfil();
  });
}
