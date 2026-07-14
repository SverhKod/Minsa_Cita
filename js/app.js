/**
 * app.js
 * Lógica compartida entre pantallas: navegación de roles,
 * protección de rutas según sesión simulada, helpers de UI.
 */

const App = (() => {
  function irA(pagina) {
    window.location.href = pagina;
  }

  function seleccionarRolCiudadano() {
    // El módulo ciudadano pedirá el DNI en la siguiente pantalla
    irA("pages/login-ciudadano.html");
  }

  function seleccionarRolEspecialista() {
    irA("pages/login-especialista.html");
  }

  function requiereSesion(rolEsperado, paginaLogin) {
    const sesion = DB.getSesion();
    if (!sesion || sesion.rol !== rolEsperado) {
      irA(paginaLogin);
      return null;
    }
    return sesion;
  }

  function cerrarSesion(paginaInicio = "../index.html") {
    DB.logout();
    irA(paginaInicio);
  }

  function generarCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < 6; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }

  function formatoFechaLarga(fecha) {
    const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(fecha).toLocaleDateString("es-PE", opciones);
  }

  function iniciales(nombre) {
    return nombre
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function mostrarSoporte() {
    if (document.getElementById("modalSoporte")) return;

    const overlay = document.createElement("div");
    overlay.id = "modalSoporte";
    overlay.className =
      "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
    overlay.innerHTML = `
      <div class="bg-white rounded-xl shadow-lg w-full max-w-xs overflow-hidden fade-in">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span class="font-bold text-blue-900 text-sm">Soporte Técnico MINSA</span>
          <button id="cerrarModalSoporte" class="text-gray-400 text-xl leading-none">&times;</button>
        </div>
        <div class="p-5 text-center">
          <div class="mx-auto mb-3 bg-blue-900 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl">
            📞
          </div>
          <p class="font-bold text-gray-800 mb-2">¿Necesitas ayuda?</p>
          <p class="text-sm text-gray-500 leading-relaxed mb-4">
            Orientación médica gratuita, soporte de salud mental e información sobre sus citas.
            Disponible las 24 horas del día a nivel nacional.
          </p>
          <a href="tel:113" class="block w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg py-3 mb-2">
            Llamar al 113
          </a>
          <button id="verFaqModalSoporte" class="w-full border border-gray-300 text-gray-700 font-semibold rounded-lg py-3 text-sm">
            Ver Preguntas Frecuentes
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const cerrar = () => overlay.remove();
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cerrar();
    });
    document.getElementById("cerrarModalSoporte").addEventListener("click", cerrar);
    document.getElementById("verFaqModalSoporte").addEventListener("click", () => {
      const enPages = window.location.pathname.includes("/pages/");
      window.location.href = enPages ? "ayuda.html" : "pages/ayuda.html";
    });
  }

  return {
    irA,
    seleccionarRolCiudadano,
    seleccionarRolEspecialista,
    requiereSesion,
    cerrarSesion,
    generarCaptcha,
    formatoFechaLarga,
    iniciales,
    mostrarSoporte,
  };
})();