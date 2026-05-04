# Directiva: Creación de Thank You Page y Redirección

## Objetivo
Crear una página de confirmación de contacto (`gracias.html`) que actúe como punto de conversión para Google Ads y Analytics. Modificar el formulario de contacto para redirigir a esta página únicamente tras un envío exitoso.

## Entradas
- El archivo `contacto.html` para tomar como base el layout, navbar y footer.
- El script global `script.js` que contiene la inyección dinámica de Google Tag.

## Salidas
- Nuevo archivo `gracias.html` en la raíz del proyecto.
- Modificación en `contacto.html` (dentro del bloque JavaScript de envío exitoso).

## Procedimiento (Lógica a seguir)
1. **Creación de `gracias.html`:**
   - Mantener estructura HTML5, meta tags, y link a `style.css`.
   - Agregar `<meta name="robots" content="noindex">` para evitar indexación SEO.
   - Replicar el header global y el footer dinámico.
   - En el bloque central (main), mostrar el título "¡Gracias por tu consulta!" y el mensaje de soporte.
   - Proveer dos botones: uno primario ("Volver al inicio" -> `/`) y uno secundario ("Hablar por WhatsApp" con el número correspondiente).
   - Cargar `script.js` al final del body para garantizar el tracking global de Google Ads.

2. **Modificación de `contacto.html`:**
   - Ubicar el evento de fetch en el formulario (`/api/contact`).
   - Dentro del bloque `if (response.ok && json.success)`, reemplazar el mensaje dinámico en pantalla por una redirección utilizando `window.location.href = '/gracias';`.
   - Asegurarse de NO alterar las validaciones de frontend (botcheck, campos requeridos) ni el manejo de errores (bloque `else` o `catch`).

## Reglas Especiales y Casos Borde (Trampas Conocidas)
**Nota: No hacer redirecciones mediante etiquetas meta refresh o en el backend, porque causa pérdida de parámetros UTM o bloquea el tracking del front-end. En su lugar, hacer la redirección vía `window.location.href` explícitamente en el lado del cliente una vez confirmada la respuesta 200 OK del servidor.**

## Restricciones
- El diseño debe mantener consistencia visual con `style.css`.
- URL expuesta debe ser limpia (apoyándose en la configuración `cleanUrls` de Vercel).
- No eliminar el Honeypot ni las validaciones del formulario.
