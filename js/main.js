/* Todu - titik masuk. Semua bagian dihubungkan di sini. */
import { initSplash } from "./splash.js";
import { initTema } from "./tema.js";
import { initWelcome } from "./welcome.js";
import { initProfil } from "./profil.js";
import { initFormTugas } from "./forms/form-tugas.js";
import { initFormMk } from "./forms/form-matkul.js";
import { initFormAgenda } from "./forms/form-agenda.js";
import { initDialog } from "./dialog.js";
import { initEvents } from "./events.js";
import { initRouter } from "./router.js";

initSplash();
initTema();
initWelcome();
initProfil();
initFormTugas();
initFormMk();
initFormAgenda();
initDialog();
initEvents();
initRouter(); // paling akhir: langsung menggambar layar    