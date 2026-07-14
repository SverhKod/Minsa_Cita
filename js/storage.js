/**
 * storage.js
 * Simula una base de datos local usando localStorage.
 * Todas las pantallas del proyecto deben usar este objeto DB
 * para leer/guardar datos, así todo queda centralizado y persiste
 * entre recargas del navegador (no hay backend real).
 */

const DB = (() => {
  const KEYS = {
    USUARIOS: "minsacita_usuarios",
    CITAS: "minsacita_citas",
    ESPECIALISTAS: "minsacita_especialistas",
    SESION: "minsacita_sesion",
    SEDES: "minsacita_sedes",
    ESPECIALIDADES: "minsacita_especialidades",
    MEDICOS: "minsacita_medicos",
    WIZARD: "minsacita_wizard_cita",
    INTENTOS: "minsacita_intentos_login",
    TECNICOS: "minsacita_tecnicos",
    COLA_PACIENTES: "minsacita_cola_pacientes",
  };

  // ---------- Helpers genéricos ----------
  function _get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("Error leyendo", key, e);
      return fallback;
    }
  }

  function _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Error guardando", key, e);
      return false;
    }
  }

  function _uid(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  // ---------- Inicialización con datos de ejemplo ----------
  function init() {
    if (_get(KEYS.USUARIOS, null) === null) {
      _set(KEYS.USUARIOS, [
        { dni: "12345678", nombre: "Juan Pérez", telefono: "999111222" },
      ]);
    }
    if (_get(KEYS.ESPECIALISTAS, null) === null) {
      _set(KEYS.ESPECIALISTAS, [
        {
          codigo: "TEC001",
          nombre: "Dra. María López",
          especialidad: "Medicina General",
          establecimiento: "Posta de Salud San Juan",
        },
      ]);
    }
    if (_get(KEYS.CITAS, null) === null) {
      _set(KEYS.CITAS, []);
    }
    if (_get(KEYS.SEDES, null) === null) {
      _set(KEYS.SEDES, [
        { id: "sede1", nombre: "Hospital Nacional Dos de Mayo" },
        { id: "sede2", nombre: "Hospital Loayza" },
        { id: "sede3", nombre: "Centro de Salud San Borja" },
        { id: "sede4", nombre: "Posta de Salud San Juan" },
      ]);
    }
    if (_get(KEYS.ESPECIALIDADES, null) === null) {
      _set(KEYS.ESPECIALIDADES, [
        { id: "esp1", nombre: "Cardiología General", sedes: ["sede1", "sede2"] },
        { id: "esp2", nombre: "Cardiología Pediátrica", sedes: ["sede1"] },
        { id: "esp3", nombre: "Cardiología Intervencionista", sedes: ["sede1", "sede2"] },
        { id: "esp4", nombre: "Medicina General", sedes: ["sede3", "sede4"] },
        { id: "esp5", nombre: "Oftalmología", sedes: ["sede2", "sede3"] },
      ]);
    }
    if (_get(KEYS.MEDICOS, null) === null) {
      _set(KEYS.MEDICOS, [
        {
          id: "med1",
          nombre: "Dr. Juan Pérez",
          especialidadId: "esp1",
          consultorio: "204",
          foto:
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=faces",
        },
        {
          id: "med2",
          nombre: "Dra. María Gómez",
          especialidadId: "esp2",
          consultorio: "105",
          foto:
            "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=faces",
        },
        {
          id: "med3",
          nombre: "Dr. Carlos Mendoza",
          especialidadId: "esp3",
          consultorio: "312",
          foto: "",
        },
      ]);
    }
    if (_get(KEYS.TECNICOS, null) === null) {
      _set(KEYS.TECNICOS, [
        {
          codigo: "TEC001",
          password: "1234",
          nombre: "Carlos Sanchez",
          consultorio: "104 - Triaje",
        },
      ]);
    }
    if (_get(KEYS.INTENTOS, null) === null) {
      _set(KEYS.INTENTOS, { fallidos: 0, bloqueadoHasta: null });
    }
    if (_get(KEYS.COLA_PACIENTES, null) === null) {
      _set(KEYS.COLA_PACIENTES, [
        {
          orden: 1, hora: "08:00 AM", nombre: "María Gonzales Perez", dni: "45678912",
          edad: 68, motivo: "Paciente acude por control de hipertensión arterial. Refiere mareos ocasionales por las mañanas durante la última semana. Requiere renovación de receta médica.",
          estado: "espera",
        },
        {
          orden: 2, hora: "08:15 AM", nombre: "Juan Carlos Ramirez", dni: "78912345",
          edad: 45, motivo: "Paciente refiere dolor lumbar de una semana de evolución. Sin antecedentes de trauma. Solicita evaluación y posible derivación a fisioterapia.",
          estado: "espera",
        },
        {
          orden: 3, hora: "08:30 AM", nombre: "Luis Fernando Vargas", dni: "12345678",
          edad: 52, motivo: "Control de rutina. Paciente no se presentó a la hora asignada.",
          estado: "ausente",
        },
        {
          orden: 4, hora: "08:45 AM", nombre: "Ana Sofia Mendoza", dni: "98765432",
          edad: 34, motivo: "Paciente acude por chequeo general y renovación de carné de sanidad.",
          estado: "espera",
        },
      ]);
    }
  }

  // ---------- Usuarios (Ciudadano) ----------
  function getUsuarios() {
    return _get(KEYS.USUARIOS, []);
  }

  function getUsuarioPorDni(dni) {
    return getUsuarios().find((u) => u.dni === dni) || null;
  }

  function guardarUsuario(usuario) {
    const usuarios = getUsuarios();
    const idx = usuarios.findIndex((u) => u.dni === usuario.dni);
    if (idx >= 0) {
      usuarios[idx] = { ...usuarios[idx], ...usuario };
    } else {
      usuarios.push(usuario);
    }
    _set(KEYS.USUARIOS, usuarios);
    return usuario;
  }

  // ---------- Especialistas (Personal Técnico) ----------
  function getEspecialistas() {
    return _get(KEYS.ESPECIALISTAS, []);
  }

  function getEspecialistaPorCodigo(codigo) {
    return getEspecialistas().find((e) => e.codigo === codigo) || null;
  }

  // ---------- Citas ----------
  function getCitas() {
    return _get(KEYS.CITAS, []);
  }

  function getCitasPorDni(dni) {
    return getCitas().filter((c) => c.dniPaciente === dni);
  }

  function getCitasPorEspecialista(codigo) {
    return getCitas().filter((c) => c.codigoEspecialista === codigo);
  }

  function crearCita(cita) {
    const citas = getCitas();
    const nueva = {
      id: _uid("cita"),
      estado: "pendiente", // pendiente | confirmada | atendida | cancelada
      creadoEn: new Date().toISOString(),
      ...cita,
    };
    citas.push(nueva);
    _set(KEYS.CITAS, citas);
    return nueva;
  }

  function actualizarCita(id, cambios) {
    const citas = getCitas();
    const idx = citas.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    citas[idx] = { ...citas[idx], ...cambios };
    _set(KEYS.CITAS, citas);
    return citas[idx];
  }

  function eliminarCita(id) {
    const citas = getCitas().filter((c) => c.id !== id);
    _set(KEYS.CITAS, citas);
  }

  // ---------- Catálogo: Sedes / Especialidades / Médicos ----------
  function getSedes() {
    return _get(KEYS.SEDES, []);
  }

  function getEspecialidadesPorSede(sedeId) {
    return _get(KEYS.ESPECIALIDADES, []).filter((e) => e.sedes.includes(sedeId));
  }

  function getEspecialidadPorId(id) {
    return _get(KEYS.ESPECIALIDADES, []).find((e) => e.id === id) || null;
  }

  function getSedePorId(id) {
    return getSedes().find((s) => s.id === id) || null;
  }

  function getMedicosPorEspecialidad(especialidadId) {
    return _get(KEYS.MEDICOS, []).filter((m) => m.especialidadId === especialidadId);
  }

  function getMedicoPorId(id) {
    return _get(KEYS.MEDICOS, []).find((m) => m.id === id) || null;
  }

  // ---------- Técnicos (Personal Especialista) ----------
  function getTecnicos() {
    return _get(KEYS.TECNICOS, []);
  }

  function getTecnicoPorCodigo(codigo) {
    return getTecnicos().find((t) => t.codigo === codigo) || null;
  }

  // ---------- Wizard de nueva cita (estado temporal entre pasos) ----------
  function guardarWizard(datos) {
    const actual = getWizard();
    _set(KEYS.WIZARD, { ...actual, ...datos });
  }

  function getWizard() {
    return _get(KEYS.WIZARD, {});
  }

  function limpiarWizard() {
    localStorage.removeItem(KEYS.WIZARD);
  }

  // ---------- Intentos de login / bloqueo temporal ----------
  function getIntentos() {
    return _get(KEYS.INTENTOS, { fallidos: 0, bloqueadoHasta: null });
  }

  function registrarIntentoFallido() {
    const intentos = getIntentos();
    intentos.fallidos += 1;
    if (intentos.fallidos >= 3) {
      intentos.bloqueadoHasta = Date.now() + 15 * 60 * 1000; // 15 min
    }
    _set(KEYS.INTENTOS, intentos);
    return intentos;
  }

  function resetIntentos() {
    _set(KEYS.INTENTOS, { fallidos: 0, bloqueadoHasta: null });
  }

  // ---------- Cola de pacientes del técnico ----------
  function getColaPacientes() {
    return _get(KEYS.COLA_PACIENTES, []);
  }

  function actualizarPacienteEnCola(dni, cambios) {
    const cola = getColaPacientes();
    const idx = cola.findIndex((p) => p.dni === dni);
    if (idx === -1) return null;
    cola[idx] = { ...cola[idx], ...cambios };
    _set(KEYS.COLA_PACIENTES, cola);
    return cola[idx];
  }

  function getPacienteDeColaPorDni(dni) {
    return getColaPacientes().find((p) => p.dni === dni) || null;
  }

  // ---------- Sesión (rol activo) ----------
  function login(rol, datos) {
    const sesion = { rol, datos, iniciadoEn: new Date().toISOString() };
    _set(KEYS.SESION, sesion);
    return sesion;
  }

  function getSesion() {
    return _get(KEYS.SESION, null);
  }

  function logout() {
    localStorage.removeItem(KEYS.SESION);
  }

  // ---------- Utilidad de desarrollo ----------
  function resetTodo() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    init();
  }

  return {
    init,
    getUsuarios,
    getUsuarioPorDni,
    guardarUsuario,
    getEspecialistas,
    getEspecialistaPorCodigo,
    getCitas,
    getCitasPorDni,
    getCitasPorEspecialista,
    crearCita,
    actualizarCita,
    eliminarCita,
    login,
    getSesion,
    logout,
    resetTodo,
    getSedes,
    getEspecialidadesPorSede,
    getEspecialidadPorId,
    getSedePorId,
    getMedicosPorEspecialidad,
    getMedicoPorId,
    getTecnicos,
    getTecnicoPorCodigo,
    guardarWizard,
    getWizard,
    limpiarWizard,
    getIntentos,
    registrarIntentoFallido,
    resetIntentos,
    getColaPacientes,
    actualizarPacienteEnCola,
    getPacienteDeColaPorDni,
  };
})();

// Inicializa datos de ejemplo la primera vez que carga cualquier página
DB.init();