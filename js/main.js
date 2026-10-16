/* TODU Kampus - titik masuk. Semua bagian dihubungkan di sini. */
import { initWelcome } from "./welcome.js";
import { initFormTugas } from "./forms/tugas.js";
import { initFormMk } from "./forms/matkul.js";
import { initDialog } from "./dialog.js";
import { initEvents } from "./events.js";
import { initRouter } from "./router.js";

initWelcome();
initFormTugas();
initFormMk();
initDialog();
initEvents();
initRouter(); // paling akhir: langsung menggambar layar
