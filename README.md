# MinsaCita — Prototipo Frontend

Prototipo frontend del sistema de citas médicas **MinsaCita**, construido con **HTML + Tailwind CSS (CDN) + JavaScript puro**.

No tiene backend: toda la información (usuarios, citas, especialistas, sedes, médicos) se simula y persiste usando `localStorage` del navegador, mediante la capa `js/storage.js`.

## Cómo abrir el proyecto

1. Descomprime el ZIP.
2. Abre `index.html` directamente en tu navegador (doble clic), o sirve la carpeta con un servidor local, por ejemplo:
   ```bash
   npx serve .
   ```
   o
   ```bash
   python3 -m http.server 8080
   ```
3. Navega desde la pantalla de selección de rol.

## Estructura del proyecto

```
minsacita/
├── index.html                     → Selección de rol (Ciudadano / Especialista)
├── css/
│   └── styles.css                 → Estilos globales
├── js/
│   ├── storage.js                 → "Base de datos" simulada con localStorage
│   └── app.js                     → Navegación y helpers comunes
└── pages/
    ├── login-ciudadano.html       → Login con DNI, contraseña y captcha (Paso 1 de 5)
    ├── bloqueado.html              → Bloqueo temporal tras 3 intentos fallidos
    ├── registro.html               → Registro de nuevo ciudadano
    ├── recuperar-acceso.html       → Recuperar contraseña (simulado)
    ├── dashboard.html              → Inicio del ciudadano con atenciones recientes
    ├── nueva-cita-paso2.html       → Selección de sede y especialidad
    ├── nueva-cita-paso3.html       → Selección de médico
    ├── nueva-cita-paso4.html       → Selección de fecha y hora (calendario)
    ├── nueva-cita-paso5.html       → Resumen y confirmación
    ├── cita-exitosa.html           → Confirmación con código de atención
    ├── mis-citas.html              → Listado completo de citas (cancelar)
    ├── perfil.html                 → Perfil del ciudadano
    ├── login-especialista.html     → Login del personal técnico
    ├── tecnico-dashboard.html      → Panel del técnico con cola de pacientes
    ├── ficha-atencion.html         → Ficha de atención del paciente
    ├── ayuda.html                  → Ayuda y preguntas frecuentes
    └── sin-conexion.html           → Pantalla de error sin conexión
```

## Credenciales de prueba

**Ciudadano**
- DNI: `12345678`
- Contraseña: `1234`

(o regístrate como uno nuevo desde "Regístrate aquí")

**Personal Técnico**
- Código: `TEC001`
- Contraseña: `1234`

## Notas de simulación

- Todos los datos (usuarios, citas, catálogo de sedes/especialidades/médicos) se guardan en `localStorage`, por lo que persisten entre recargas del navegador, pero son locales a cada navegador/dispositivo.
- El captcha de login es una validación visual simulada (no criptográfica).
- Tras 3 intentos fallidos de inicio de sesión, se activa un bloqueo temporal de 15 minutos (`bloqueado.html`), con cuenta regresiva real.
- El botón "Descargar Ticket (PDF)" genera un archivo `.txt` de ejemplo (simulación de descarga, no un PDF real).
- Puedes limpiar todos los datos simulados ejecutando en la consola del navegador:
  ```js
  DB.resetTodo();
  ```
# Minsa_Cita
