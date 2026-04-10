# Manual Web de Administración - Calculadora KPS Energy

Este documento técnico sirve como guía para configurar y mantener el ecosistema de la Calculadora Solar Inteligente en producción.

## 1. Funcionamiento del Panel (React Admin)
La carpeta `/kps-admin` aloja una aplicación de React independiente de la web institucional. Su propósito es funcionar como un "BackOffice" oculto.

- **Acceso:** Por el momento está oculto detrás del enrutamiento de Vercel en la URL `/kps-admin`.
- **Autenticación:** Requerirá un usuario ("admin") y una clave configurada en las Variables de Entorno.
- **Roles:** El administrador tendrá la capacidad de alterar los Listados Maestros para que la calculadora actualice su inventario y dimensiones en tiempo real en la tienda oficial.

## 2. Cómo gestionar Equipos / Dispositivos
La calculadora funciona consumiendo la API Endpoints (`api/calculator.js`), que en su fase final estará interceptada por **Prisma ORM**.
Para añadir nuevos electrodomésticos (Ejemplo: "Pava eléctrica"):
1. Ingresar en el futuro panel a la pestaña **Dispositivos**.
2. Seleccionar la **Categoría** madre (Ej. Cocina).
3. Especificar el consumo pico (Watts), por ejemplo `2200W`.
4. Asignar un ícono base de FontAwesome, por ejemplo `fa-mug-hot`.
5. Al guardar, esto se inyecta en la Base de Datos y la Calculadora "Frontend" lo tomará dinámicamente sin necesidad de tocar el código HTML (debido al listado por *Fetch* nativo).

## 3. Parametrización del Motor y Costos
El algoritmo de dimensionamiento en `/api/calculator.js` posee constantes físicas fundamentales para Argentina y reglas de negocio comercial.

### Variables Modificables:
- **`horaSolarPico` (HSP):** Fija generalmente en `4.5` (Argentina medio).
- **`eficienciaSistema`:** Porcentaje estimado de pérdida (Cables, inversores). Default `0.8` (Pérdida del 20%).

### Inventario Virtual (Precios)
A través del panel admin (Sección Inventario/Productos), deberás ser capaz de actualizar el precio general de:
- Panel Solar Estándar (Actualmente seteado a 550W).
- Banco de Baterías Base (Actualmente seteado a Litio 4.8kWh).
- Margen estructural: Default calibrado en `1.30` (Aumenta un 30% el costo material neto para cubrir inversor y cables preventivamente).

Cualquier alteración a estos montos disparará instantáneamente un costo final ajustado al "Lead" comercial la próxima vez que un usuario haga click en Cotizar.
