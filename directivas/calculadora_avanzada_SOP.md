# SOP: Integración de Calculadora Solar Avanzada en KPS Energy

## 1. Objetivo y Alcance
Reemplazar la calculadora básica en `calculadora.html` por una Calculadora Solar Avanzada que permita seleccionar consumos y sugerir un sistema ideal, respetando estrictamente el ecosistema actual del proyecto.

## 2. Restricciones y Casos Borde (TRAMPAS CONOCIDAS)
- **Ecosistema Estático:** El proyecto actual usa Vanilla JS, Vanilla CSS, e incrusta el pie de página de forma dinámica mediante un `fetch('index.html')`. **NO DESTRUIR ESTA LÓGICA**.
- **Variables CSS:** Todo el diseño depende de variables globales en `style.css` (ej: `--primary-green`, `--bg-light`). **NO usar TailwindCSS u otro framework**. Usa las clases de utilidad provistas (`.btn`, `.btn-primary`, `.form-group`).
- **Arquitectura de Vercel:** Las llamadas a backend (si se implementan) deben ir a funciones ubicadas en `/api/` en la raíz. **NO usar un server en Node como Express**.

## 3. Entradas (Inputs)
- Selección de provincia / tipo de usuario.
- (Opcional) Consumo mensual manual en factura.
- Lista de electrodomésticos interactivos y cantidades.

## 4. Salidas (Outputs)
- Recomendación de kWp (Sistema ideal).
- Creación de un "Lead" en la base de datos (Prisma).
- Redirección o inyección de reporte visual en DOM.

## 5. Lógica del Flujo de Trabajo
1. Generar e integrar componentes visuales usando JavaScript Modular en `assets/js/calculator/`.
2. Modelar base de datos usando Prisma (`schema.prisma` en raíz).
3. Conectar la interfaz gráfica con endpoints a crear dentro de la carpeta `api/`.
4. Documentar en este mismo archivo cualquier error que se descubra durante las ejecuciones futuras de scripts.
