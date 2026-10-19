/* Animasi pembuka: tampil di index.html dan hilang sendiri lewat CSS.
   Ketuk untuk melewati juga ditangani di HTML (onpointerdown) agar tidak menunggu JS dimuat.
   Di sini hanya membuang elemennya setelah selesai. */
import { $ } from "./utils.js";

export function initSplash() {
  const el = $("#splash");
  if (!el) return;
  const buang = (e) => e.target === el && el.remove();
  el.addEventListener("animationend", buang); // animasi selesai (juga saat "kurangi gerakan")
  el.addEventListener("transitionend", buang); // dilewati lewat ketukan
  setTimeout(() => el.remove(), 3000); // cadangan terakhir
}