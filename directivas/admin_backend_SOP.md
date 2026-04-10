# SOP: Creación de Admin Panel React (KPS Energy)

## 1. Objetivo y Alcance
Construir un dashboard privado (`/kps-admin`) operando bajo tecnología React (Vite) conectado a un backend de Serverless Functions (Vercel) para la gestión completa mediante CRUD (Create, Read, Update, Delete) de dispositivos solares y visualización de Leads.

## 2. Restricciones y Casos Borde (TRAMPAS CONOCIDAS)
- **Persistencia en Producción (Vercel):** La app está en Vercel, el uso de `.db` de SQLite está terminantemente prohibido para producción debido a que Vercel rompe el disco tras cada reinicio de Serverless. Siempre se requiere PostgresSQL.
- **Ruta de APIs Serverless:** En un esquema híbrido (React App / Static Front) hosteado en Vercel, todos los endpoints del backend se encontrarán en el directorio de la carpeta RAÍZ `/api/admin/`. **NO** mezclar React Frontend Logic con Backenf Server Logic, los datos viajan mediante JS `fetch`.
- **Rutas de Vite:** La aplicación Vite se debe construir apuntando un origin base como `base: '/kps-admin/'` para evitar sobreescribir los *assets* principales del root original (`/assets/`).

## 3. Entradas
- Interacción de interfaz de React.
- Envío de variables `user` y `password` crudas desde Frontend a `/api/admin/auth`.
- Carga de nuevos dispositivos, parámetros, productos.

## 4. Salidas
- Token de autenticación retornado tras validación exitosa.
- DB actualizada usando `@prisma/client`.

## 5. Lógica de Flujo Recomendado
1. Modelar los schemas en `/prisma/schema.prisma`.
2. Lanzar `prisma db push` / `prisma generate`.
3. Escribir Vercel API Endpoints.
4. Construir React Forms & Tables interceptando llamadas fetch a la API.
