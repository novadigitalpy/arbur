# ARBUR — HANDOFF DE SESIÓN

## Objetivo
Continuar ARBUR en una nueva sesión de Claude con acceso al navegador real. Antes de modificar código, leer este archivo y auditar el estado actual.

## Stack
Next.js 14 + React + TypeScript + Tailwind + Supabase Auth/PostgreSQL/RLS/Storage.

## Regla principal
NO romper lo que funciona. Inspeccionar antes de cambiar. No inventar tablas/columnas/relaciones. No cambiar stack, RLS, esquema o diseño sin autorización. Probar y ejecutar build después de cambios importantes.

## Funcionalidad existente
Registro, login, setup profesional, dashboard profesional, perfil profesional, servicios (crear, activar/desactivar, editar/eliminar) y perfil público inicial.

Tablas principales: professional_profiles, professional_services, services, categories.

Existe además un esquema paralelo (profiles, professionals, service_requests, reviews, professional_photos). NO migrarlo ni conectarlo todavía.

## Fase 1.5
- FK professional_services.professional_id -> professional_profiles.user_id: CERRADO.
- Vista public.professional_profiles_public: CERRADO.
- SELECT de professional_services demasiado permisivo: CERRADO. La política única es public_or_owner_can_view_services: anon/authenticated ven activos; el dueño ve sus propios activos e inactivos.
- Esquema paralelo: PENDIENTE.
- handle_new_user SECURITY DEFINER/RPC: PENDIENTE.
- Políticas duplicadas: PENDIENTE / baja prioridad.

Datos existentes verificados:
- Detailing — 449997 — activo.
- PULIDO — 500000 — activo.

## Bug D
Se corrigió el flujo para que un profesional existente no vuelva a setup ni intente insertar un perfil duplicado:
- Login consulta professional_profiles por user_id.
- Si existe -> /professional/dashboard.
- Si no existe -> /professional/setup.
- Setup vuelve a comprobar antes del INSERT y redirige al dashboard si ya existe.
- No usar upsert.

## IMPORTANTE — navegador
La sesión anterior de Claude no podía llegar a Supabase por restricciones de red del sandbox. El navegador del usuario sí mostró "Supabase conectado correctamente". Esta nueva sesión debe intentar abrir http://localhost:3000 con el navegador real/local si está disponible.

## Orden obligatorio
1. Leer este archivo.
2. Revisar git/estado remoto y código actual.
3. Abrir http://localhost:3000.
4. NO modificar nada al inicio.
5. Probar login con profesional existente.
6. Confirmar dashboard, no setup.
7. Si es posible, probar un profesional nuevo sin profile.
8. Probar perfil público anónimo.
9. Probar servicios activos/inactivos.
10. Reportar resultados antes de hacer nuevos cambios.

## Identidad visual futura
La identidad prevista es blanco + verde (#16a34a, #15803d, #dcfce7). NO iniciar rebranding hasta cerrar la validación funcional y de seguridad.

## Estado remoto
El repositorio remoto main contiene ahora los cambios del Bug D. No hacer reset, force push, rebase ni squash.

## No continuar todavía
No comenzar diseño, portafolio, búsqueda, solicitudes, pagos ni administración hasta cerrar esta auditoría.
