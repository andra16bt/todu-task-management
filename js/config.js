/* Konstanta aplikasi */
export const PREFIX = "todukampus:v1:"; // awalan kunci localStorage

export const WARNA = [
  ["Jingga", "#E8743B"],
  ["Biru", "#3B8EEA"],
  ["Ungu", "#8B5CF6"],
  ["Kuning", "#EAB308"],
  ["Teal", "#1FA37A"],
  ["Pink", "#EC4899"],
  ["Merah", "#D94B4B"],
  ["Olive", "#4F6600"],
];
export const TIPE = [
  ["tugas", "Tugas"],
  ["ujian", "Ujian"],
  ["quiz", "Quiz"],
  ["proyek", "Proyek"],
];
export const JENIS = [
  ["individu", "Individu"],
  ["kelompok", "Kelompok"],
];
export const TEMA = [
  ["otomatis", "Otomatis"],
  ["terang", "Terang"],
  ["gelap", "Gelap"],
];
export const STATUS = [
  ["belum", "Belum"],
  ["dikerjakan", "Dikerjakan"],
  ["selesai", "Selesai"],
];
export const NAMA_HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
export const LAYAR = ["#beranda", "#tugas", "#proyek", "#agenda", "#profil"];

// Agenda: kategori berwarna (id, nama, warna) & pilihan pengingat
export const KATEGORI = [
  ["wawancara", "Wawancara", "#3B8EEA"],
  ["panitia", "Panitia", "#8B5CF6"],
  ["organisasi", "Organisasi", "#E8743B"],
  ["pribadi", "Pribadi", "#EC4899"],
  ["lainnya", "Lainnya", "#1FA37A"],
];
export const INGAT = [
  ["none", "Tanpa"],
  ["1jam", "1 jam sebelum"],
  ["1hari", "1 hari sebelum"],
];
export const INGAT_MS = { "1jam": 36e5, "1hari": 864e5 };
