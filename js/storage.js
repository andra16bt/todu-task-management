/* Penyimpanan: localStorage dengan cadangan di memori jika gagal */
import { PREFIX } from "./config.js";
import { toast } from "./ui.js";

const mem = {};

export function muat(k, def) {
  try {
    const v = localStorage.getItem(PREFIX + k);
    return v ? JSON.parse(v) : def;
  } catch (e) {
    return k in mem ? mem[k] : def;
  }
}

export function simpan(k, v) {
  mem[k] = v;
  try {
    localStorage.setItem(PREFIX + k, JSON.stringify(v));
  } catch (e) {
    toast("Penyimpanan tidak tersedia, data hanya sementara");
  }
}
