/* Tema terang / gelap / otomatis (ikuti pengaturan perangkat) */
import { state } from "./state.js";
import { simpan } from "./storage.js";

const mq =
  typeof matchMedia === "function"
    ? matchMedia("(prefers-color-scheme: dark)")
    : { matches: false, addEventListener() {} };

// Pasang tema ke <html> dan warna bar browser
export function terapkanTema() {
  const gelap = state.tema === "gelap" || (state.tema === "otomatis" && mq.matches);
  document.documentElement.dataset.tema = gelap ? "gelap" : "terang";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", gelap ? "#0e120d" : "#f2fee2");
}

export function setTema(t) {
  state.tema = t;
  simpan("tema", t);
  terapkanTema();
}

export function initTema() {
  terapkanTema();
  mq.addEventListener("change", terapkanTema); // mode otomatis mengikuti perangkat
}
