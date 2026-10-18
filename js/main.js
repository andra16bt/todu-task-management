/* Todu - titik masuk. Semua bagian dihubungkan di sini. */
import { initWelcome } from "./welcome.js";
import { initFormTugas } from "./forms/form-tugas.js";
import { initFormMk } from "./forms/form-matkul.js";
import { initFormAgenda } from "./forms/form-agenda.js";
import { initDialog } from "./dialog.js";
import { initEvents } from "./events.js";
import { initRouter } from "./router.js";

initWelcome();
initFormTugas();
initFormMk();
initFormAgenda();
initDialog();
initEvents();
initRouter(); // paling akhir: langsung menggambar layar
