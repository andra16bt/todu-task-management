/* Elemen UI kecil yang dipakai di banyak tempat: toast & pesan error form */
import { $ } from "./utils.js";

let tmr;
export function toast(s) {
  const e = $("#toast");
  e.textContent = s;
  e.hidden = true; // matikan dulu supaya animasi muncul diulang
  void e.offsetWidth;
  e.hidden = false;
  clearTimeout(tmr);
  tmr = setTimeout(() => (e.hidden = true), 2500);
}

// Tampilkan/sembunyikan pesan error untuk sebuah input
export function setErr(inp, msg, bad) {
  $(msg).hidden = !bad;
  $(inp).setAttribute("aria-invalid", bad);
}
