# Directiva: Integración Global de Google Ads (Global Site Tag)

## Objetivo
Integrar el script de Google Ads (gtag.js) con ID `AW-18118830571` en todas las páginas públicas del proyecto KPS Energy. Preparar la estructura para futuras mediciones de conversiones y eventos.

## Entradas
- Archivo global JS (`script.js`).
- ID de medición: `AW-18118830571`.

## Salidas
- Inserción dinámica programática en `script.js` para asegurar que cargue globalmente en todas las páginas públicas de frontend sin intervención manual.

## Procedimiento (Lógica a seguir)
1. **Punto de Inyección:** Utilizar `script.js` como único punto de entrada de Javascript global de marketing para la arquitectura Vanilla HTML del frontend.
2. **Método de Carga:** Inyectar el tag `gtag.js` en el DOM (`document.head`) durante el evento `DOMContentLoaded`.
3. **Evitar Duplicaciones:** Implementar una verificación (`document.querySelector`) para asegurar que el Tag ID no se inyecte si ya existe de otra fuente (ej. GTM manual ad-hoc).
4. **Initializar config y eventos:** Llamar a la inicialización clásica de Google Tag pero preparar la lista comentada de futuros posibles eventos en el script (`form_submit`, `whatsapp_click`, `quote_request`, `contact_specialist`).

## Reglas Especiales y Casos Borde (Trampas Conocidas)

**Nota: No inyectar el código estáticamente en múltiples archivos `.html` de forma repetida ni asumir automáticamente que el proyecto es un SSG/SSR solo por usar Vercel. Hacerlo inyectando bloque por bloque manualmente en los `.html` causa la sensación visual/arquitectónica de estar editando un sitio "estático a la antigua", lo cual en un proyecto en evolución levanta alarmas de malas prácticas (duplicación de código, riesgo de unmount y rehidratación asíncrona no deseada).**
**En su lugar: Centralizar el código. Si el sitio público delega comportamiento dinámico a `script.js`, el Google Tag DEBE introducirse dinámicamente desde `script.js`. Para la app privada (`kps-admin`), Vite se maneja separado. Las integraciones de Ads y Marketing siempre deben quedar abstraídas y modulares.**

## Restricciones
- No utilizar inserciones dinámicas en componentes React de `kps-admin` a menos que sea requerido (Ads para admin no tiene sentido).
- No duplicar el bloque de Google Tag.
- No alterar otros comportamientos `DOMContentLoaded` existentes.
