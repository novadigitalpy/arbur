# ============================================================
# ARBUR — MASTER DEVELOPMENT INSTRUCTIONS
# ============================================================

## 1. IDENTIDAD DEL PROYECTO

El proyecto se llama:

# ARBUR

ARBUR es una plataforma paraguaya que conecta CLIENTES con PROFESIONALES para contratar servicios, principalmente trabajos a domicilio.

La visión del producto es:

CLIENTE
    ↓
Busca lo que necesita
    ↓
Encuentra profesionales
    ↓
Compara perfiles
    ↓
Ve servicios
    ↓
Ve trabajos realizados
    ↓
Ve calificaciones
    ↓
Contacta / solicita servicio
    ↓
Profesional realiza el trabajo
    ↓
Cliente confirma
    ↓
Cliente califica al profesional

ARBUR debe convertirse progresivamente en un marketplace profesional de servicios para Paraguay.

La plataforma debe sentirse:

- moderna
- profesional
- confiable
- fácil de utilizar
- rápida
- visual
- intuitiva
- segura
- preparada para crecer

ARBUR debe tener identidad propia.

NO copiar literalmente el diseño de otras plataformas.

Se pueden utilizar ideas y patrones conocidos de marketplaces, pero la experiencia, arquitectura visual y marca deben ser propias de ARBUR y adaptadas al mercado paraguayo.

============================================================
2. MERCADO OBJETIVO
============================================================

ARBUR está pensado inicialmente para Paraguay.

Por lo tanto, considerar desde la arquitectura:

- Paraguay
- departamentos
- ciudades
- barrios
- teléfonos paraguayos
- WhatsApp
- moneda Guaraní (Gs.)
- servicios a domicilio
- profesionales independientes
- pequeños negocios
- empresas de servicios

Ejemplos de profesionales:

- electricistas
- plomeros
- técnicos
- pintores
- limpiadores
- jardineros
- profesionales automotrices
- técnicos informáticos
- peluqueros
- especialistas en belleza
- reparadores
- albañiles
- profesionales del hogar
- etc.

La arquitectura debe permitir agregar nuevas categorías sin tener que modificar el código.

============================================================
3. STACK TECNOLÓGICO
============================================================

Frontend:

- Next.js 14
- React
- TypeScript
- App Router
- Tailwind CSS

Backend:

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security (RLS)

No cambiar el stack tecnológico sin una razón técnica real y sin autorización.

No migrar a otra base de datos simplemente por preferencia.

No reemplazar Supabase.

============================================================
4. PRINCIPIO FUNDAMENTAL
============================================================

REGLA PRINCIPAL:

# NO ROMPER LO QUE YA FUNCIONA.

Antes de modificar cualquier archivo:

1. Leer el código existente.
2. Entender su funcionamiento.
3. Identificar dependencias.
4. Identificar tablas relacionadas.
5. Identificar políticas RLS relacionadas.
6. Identificar qué funcionalidades podrían verse afectadas.
7. Hacer el cambio más pequeño posible.
8. Probar.
9. Ejecutar build.
10. Informar exactamente qué se modificó.

Nunca reemplazar código funcional por una implementación nueva solamente porque parece más limpia.

Nunca eliminar funcionalidad existente sin autorización explícita.

============================================================
5. METODOLOGÍA DE DESARROLLO
============================================================

ARBUR se desarrolla por fases.

NO intentar construir todo el sistema de una sola vez.

Cada módulo debe seguir:

ANALIZAR
    ↓
PLANIFICAR
    ↓
IMPLEMENTAR
    ↓
PROBAR
    ↓
BUILD
    ↓
VERIFICAR SEGURIDAD
    ↓
CONTINUAR

Si existe una duda sobre la arquitectura:

NO inventar.

Primero inspeccionar el código y la base existente.

Si todavía existe una ambigüedad importante:

PREGUNTAR antes de realizar cambios destructivos.

============================================================
6. ESTADO ACTUAL DEL PROYECTO
============================================================

Actualmente ARBUR ya tiene una base funcional.

Existe:

- autenticación
- registro
- login
- perfil profesional
- dashboard profesional
- servicios profesionales
- creación de servicios
- activación/desactivación de servicios
- eliminación de servicios

También existe una base para:

- edición del perfil profesional
- perfil público profesional

El sistema debe conservar estas funcionalidades.

NO recrearlas desde cero.

NO reemplazarlas sin necesidad.

============================================================
7. ARQUITECTURA DE USUARIOS
============================================================

ARBUR tendrá tres grandes roles:

1. CLIENTE
2. PROFESIONAL
3. ADMINISTRADOR

------------------------------------------------------------
CLIENTE
------------------------------------------------------------

Puede:

- registrarse
- iniciar sesión
- completar perfil
- buscar profesionales
- buscar servicios
- filtrar resultados
- ver perfiles públicos
- ver trabajos realizados
- ver servicios
- ver calificaciones
- solicitar servicios
- consultar profesionales
- gestionar solicitudes
- confirmar trabajos
- calificar trabajos terminados
- administrar favoritos
- administrar su cuenta

------------------------------------------------------------
PROFESIONAL
------------------------------------------------------------

Puede:

- registrarse
- crear perfil profesional
- editar perfil
- agregar foto
- definir categoría
- describir experiencia
- definir zona de trabajo
- agregar servicios
- definir precios
- activar/desactivar servicios
- mostrar trabajos realizados
- recibir solicitudes
- aceptar solicitudes
- rechazar solicitudes
- gestionar trabajos
- ver clientes relacionados con sus trabajos
- recibir calificaciones
- gestionar disponibilidad

------------------------------------------------------------
ADMINISTRADOR
------------------------------------------------------------

Puede:

- administrar usuarios
- administrar profesionales
- administrar categorías
- administrar servicios
- administrar solicitudes
- administrar calificaciones
- administrar reportes
- moderar contenido
- suspender usuarios
- suspender profesionales
- gestionar configuración
- consultar estadísticas

============================================================
8. ESTRUCTURA PRINCIPAL DE NAVEGACIÓN
============================================================

La navegación debe ser diferente según el rol.

------------------------------------------------------------
CLIENTE
------------------------------------------------------------

Inicio
Buscar profesionales
Mis solicitudes
Mis favoritos
Mensajes
Mi perfil
Configuración

------------------------------------------------------------
PROFESIONAL
------------------------------------------------------------

Inicio
Mi perfil
Mis servicios
Solicitudes
Mis trabajos
Clientes
Calificaciones
Configuración

------------------------------------------------------------
ADMIN
------------------------------------------------------------

Dashboard
Usuarios
Profesionales
Categorías
Servicios
Solicitudes
Calificaciones
Reportes
Configuración

La navegación puede evolucionar.

No agregar módulos innecesarios solamente para llenar el menú.

La prioridad es facilidad de uso.

============================================================
9. ARQUITECTURA DE DATOS EXISTENTE
============================================================

IMPORTANTE:

Ya existe una estructura funcional en Supabase.

Entre las tablas existentes están:

professional_profiles

services

professional_services

categories

No crear tablas duplicadas si ya existe una tabla que cumple la función.

------------------------------------------------------------
professional_profiles
------------------------------------------------------------

Actualmente contiene información como:

id
user_id
business_name
professional_name
category
description
phone
whatsapp
country
department
city
neighborhood
address
latitude
longitude
profile_image_url
is_available

Esta tabla representa el perfil profesional.

IMPORTANTE:

Un usuario profesional debe tener un único perfil profesional.

La relación se realiza mediante:

user_id

No crear perfiles duplicados para el mismo usuario.

------------------------------------------------------------
professional_services
------------------------------------------------------------

Esta tabla relaciona:

PROFESIONAL
    ↓
SERVICIO

Utiliza:

professional_id
service_id

Además contiene información propia del servicio profesional como:

name
description
price
category
is_available

IMPORTANTE:

Las operaciones de actualizar, activar/desactivar y eliminar servicios deben verificar:

professional_id

además de:

service_id

Esto evita que un profesional pueda modificar servicios de otro profesional.

NO modificar esta lógica sin una razón técnica y autorización.

------------------------------------------------------------
services
------------------------------------------------------------

Representa el servicio base.

Actualmente se relaciona con categorías.

Al crear un servicio profesional se crea el servicio base y posteriormente la relación profesional → servicio.

NO romper esta relación.

------------------------------------------------------------
categories
------------------------------------------------------------

Contiene las categorías disponibles.

Las categorías deben poder crecer desde la administración.

No hardcodear categorías innecesariamente en múltiples partes del sistema.

============================================================
10. SEGURIDAD
============================================================

La seguridad es una prioridad máxima.

No confiar únicamente en validaciones del frontend.

La seguridad real debe existir en:

- Supabase Auth
- PostgreSQL
- RLS
- constraints
- validaciones
- permisos

Nunca asumir que esconder un botón equivale a seguridad.

------------------------------------------------------------
REGLA DE PROPIEDAD
------------------------------------------------------------

Un profesional solamente puede modificar:

- su propio perfil
- sus propios servicios
- sus propios trabajos
- sus propios datos

Un cliente solamente puede modificar:

- sus propios datos
- sus propias solicitudes
- sus propias acciones permitidas

Un usuario no puede modificar información perteneciente a otro usuario.

------------------------------------------------------------
RLS
------------------------------------------------------------

Antes de cambiar una tabla:

1. Revisar sus políticas RLS.
2. Entender quién puede SELECT.
3. Entender quién puede INSERT.
4. Entender quién puede UPDATE.
5. Entender quién puede DELETE.

No crear políticas excesivamente permisivas.

NO utilizar políticas como:

auth.uid() IS NOT NULL

cuando la operación debería limitarse al propietario.

Siempre buscar la relación correcta entre:

auth.uid()

y el registro correspondiente.

============================================================
11. PERFIL PÚBLICO
============================================================

El perfil público será una pieza fundamental de ARBUR.

Un cliente debe poder ver:

- foto
- nombre comercial
- nombre profesional
- categoría
- descripción
- ubicación
- ciudad
- departamento
- barrio/zona cuando corresponda
- disponibilidad
- servicios activos
- precios
- trabajos realizados
- calificaciones

El perfil público NO debe permitir modificar información.

El cliente solamente podrá visualizar información que haya sido definida como pública.

No exponer datos privados innecesarios.

============================================================
12. SERVICIOS PÚBLICOS
============================================================

Cuando un cliente visite un perfil profesional:

mostrar solamente servicios disponibles.

Es decir:

is_available = true

Los servicios desactivados por el profesional no deben aparecer públicamente.

No modificar los servicios existentes para conseguir esto.

Utilizar las relaciones existentes.

============================================================
13. PORTAFOLIO PROFESIONAL
============================================================

ARBUR tendrá un módulo de trabajos realizados.

Ejemplo:

Trabajo:
"Pulido completo"

Categoría:
Automotriz

Descripción:
Pulido completo y tratamiento de pintura.

Imágenes:

ANTES
DESPUÉS

El profesional podrá mostrar evidencia visual de su trabajo.

Las imágenes deberán utilizar Supabase Storage.

NO guardar archivos binarios directamente en PostgreSQL.

La base de datos debe almacenar referencias a los archivos.

============================================================
14. SISTEMA DE SOLICITUDES
============================================================

ARBUR deberá permitir:

CLIENTE
    ↓
Solicita servicio
    ↓
PROFESIONAL
    ↓
Acepta / rechaza
    ↓
Trabajo
    ↓
Completado
    ↓
Calificación

Estados posibles:

pending
accepted
rejected
in_progress
completed
cancelled

Los nombres finales pueden adaptarse al idioma/código del proyecto, pero mantener consistencia.

No permitir transiciones de estado inválidas.

Por ejemplo:

cancelled
NO debería pasar automáticamente a completed.

============================================================
15. SISTEMA DE CALIFICACIONES
============================================================

Este sistema es MUY importante.

Un usuario NO debe poder entrar al perfil de cualquier profesional y dejar una calificación falsa.

Una calificación debe estar vinculada a una experiencia real.

Flujo:

CLIENTE
    ↓
SOLICITUD
    ↓
PROFESIONAL
    ↓
TRABAJO COMPLETADO
    ↓
CLIENTE CALIFICA

La calificación puede contener:

- estrellas 1–5
- comentario
- fecha
- profesional
- cliente
- solicitud relacionada

Posteriormente puede agregarse:

- calidad
- puntualidad
- trato
- relación calidad/precio

Pero no crear complejidad innecesaria en la primera versión.

============================================================
16. BÚSQUEDA
============================================================

La búsqueda será una función principal de ARBUR.

Ejemplo:

¿Qué necesitás?

Electricista

¿Dónde?

Ciudad del Este

BUSCAR

Resultados:

Profesional
Foto
Categoría
Ciudad
Calificación
Disponibilidad
Servicios

Filtros futuros:

- categoría
- ciudad
- departamento
- barrio
- disponibilidad
- calificación
- precio
- distancia

La búsqueda debe ser rápida y fácil de utilizar.

============================================================
17. UBICACIÓN
============================================================

La arquitectura debe prepararse para:

- país
- departamento
- ciudad
- barrio
- dirección
- latitude
- longitude

Posteriormente:

- mapa
- distancia
- profesionales cercanos
- "cerca de mí"

No implementar geolocalización avanzada antes de que la arquitectura básica esté estable.

============================================================
18. WHATSAPP
============================================================

WhatsApp será importante para Paraguay.

Inicialmente se puede utilizar contacto directo mediante:

https://wa.me/

Pero no asumir que esto reemplaza para siempre un sistema interno de solicitudes.

WhatsApp puede ser un canal de contacto.

Las solicitudes internas deben permanecer dentro de ARBUR cuando implementemos el módulo correspondiente.

============================================================
19. STORAGE
============================================================

Supabase Storage será utilizado para:

- fotos de perfil
- fotos de trabajos
- imágenes del portafolio
- otras imágenes necesarias

Antes de crear un bucket:

1. revisar buckets existentes
2. revisar políticas
3. definir estructura
4. definir quién puede subir
5. definir quién puede leer
6. definir quién puede eliminar

No crear buckets duplicados.

============================================================
20. ARQUITECTURA DE CARPETAS OBJETIVO
============================================================

La arquitectura puede evolucionar hacia:

src/
│
├── app/
│   │
│   ├── page.tsx
│   │
│   ├── login/
│   ├── register/
│   │
│   ├── search/
│   │
│   ├── professionals/
│   │   └── [id]/
│   │
│   ├── professional/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── services/
│   │   ├── requests/
│   │   ├── portfolio/
│   │   ├── clients/
│   │   ├── reviews/
│   │   └── settings/
│   │
│   └── admin/
│       ├── dashboard/
│       ├── users/
│       ├── professionals/
│       ├── categories/
│       ├── services/
│       ├── requests/
│       ├── reviews/
│       └── settings/
│
├── components/
│   ├── ui/
│   ├── professional/
│   ├── client/
│   ├── search/
│   └── shared/
│
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── validations/
│   └── utils/
│
└── types/

IMPORTANTE:

Esta es una arquitectura objetivo.

NO crear todas estas carpetas inmediatamente.

Crear únicamente lo necesario para la fase actual.

============================================================
21. DISEÑO VISUAL
============================================================

ARBUR debe tener una identidad visual propia.

Características deseadas:

- moderno
- premium
- tecnológico
- profesional
- amigable
- claro
- visual
- responsive

Identidad visual base:

- fondo oscuro/deep purple
- violeta
- naranja
- dorado
- blanco
- negro según contexto

Utilizar:

- gradientes
- sombras
- profundidad
- tarjetas
- microinteracciones
- hover
- animaciones suaves
- iconografía clara
- fotografías
- estados visuales

NO convertir la aplicación en una interfaz llena de efectos.

Las animaciones deben mejorar la experiencia.

La prioridad siempre será:

USABILIDAD > DECORACIÓN.

============================================================
22. DISEÑO PARA USUARIOS NO TÉCNICOS
============================================================

ARBUR debe ser fácil de entender.

Evitar:

- textos técnicos
- menús complicados
- formularios interminables
- exceso de botones
- pantallas saturadas

Preferir:

- acciones claras
- botones evidentes
- iconos
- tarjetas
- estados
- mensajes sencillos
- formularios progresivos

Un usuario debe saber qué hacer sin leer un manual.

============================================================
23. RESPONSIVE
============================================================

ARBUR debe funcionar correctamente en:

- Android
- iPhone
- tablets
- notebooks
- desktop

La experiencia móvil es MUY importante.

No diseñar primero únicamente para desktop.

Cada pantalla debe revisarse en:

mobile
tablet
desktop

============================================================
24. VALIDACIONES
============================================================

Validar siempre:

- campos obligatorios
- formatos
- números
- precios
- teléfonos
- URLs
- IDs
- permisos
- sesión

Nunca confiar solamente en el navegador.

Cuando corresponda, validar también en backend/database.

============================================================
25. MANEJO DE ERRORES
============================================================

Nunca mostrar errores técnicos innecesarios al usuario.

Internamente:

registrar el error real.

Al usuario:

mostrar un mensaje comprensible.

Ejemplo:

NO:

"PostgrestError: 23505 duplicate key..."

Preferir:

"Este perfil ya está registrado."

Pero durante desarrollo informar el error técnico al desarrollador cuando sea necesario para depurar.

============================================================
26. CAMBIOS DE BASE DE DATOS
============================================================

REGLA CRÍTICA:

Antes de crear o modificar una tabla:

1. inspeccionar estructura actual
2. revisar columnas
3. revisar relaciones
4. revisar constraints
5. revisar índices
6. revisar RLS
7. revisar dependencias

NO crear una tabla nueva si ya existe una equivalente.

NO cambiar nombres de columnas sin necesidad.

NO eliminar columnas utilizadas por código existente.

NO eliminar constraints para solucionar errores rápidamente.

NO desactivar RLS para "hacer funcionar" una funcionalidad.

Si una migración es necesaria:

explicar:

- qué cambia
- por qué
- qué tablas afecta
- qué código afecta
- cómo se revierte

============================================================
27. REGLA SOBRE SERVICIOS EXISTENTES
============================================================

La funcionalidad actual de servicios está funcionando.

NO modificarla innecesariamente.

Se debe preservar:

- creación
- lectura
- activación
- desactivación
- eliminación

La relación:

professional_id
+
service_id

es importante.

Nunca eliminarla.

============================================================
28. REGLA SOBRE PERFILES
============================================================

Cada profesional tiene un perfil.

El perfil se relaciona con:

user_id

Para editar:

UPDATE

No crear un nuevo perfil cada vez que el usuario edita información.

Evitar duplicados.

============================================================
29. NO SOBREENINGENIERÍA
============================================================

No agregar:

- Redux
- Zustand
- GraphQL
- microservicios
- APIs innecesarias
- librerías innecesarias
- sistemas complejos

solamente porque podrían ser útiles en el futuro.

Utilizar la solución más sencilla que permita crecer correctamente.

ARBUR debe ser:

simple ahora
pero preparado para crecer.

============================================================
30. PERFORMANCE
============================================================

Evitar:

- consultas duplicadas
- renders innecesarios
- cargar datos que no se necesitan
- imágenes gigantes
- componentes excesivamente pesados

Utilizar:

- paginación cuando corresponda
- imágenes optimizadas
- consultas específicas
- índices adecuados
- carga progresiva

No optimizar prematuramente.

Primero funcionalidad correcta.

============================================================
31. GIT
============================================================

Antes de hacer cambios importantes:

revisar estado del repositorio.

Después de completar una fase:

hacer build.

Si existe un sistema de ramas establecido:

respetarlo.

No ejecutar comandos destructivos como:

git reset --hard

git clean -fd

o similares

sin autorización explícita.

============================================================
32. BUILD OBLIGATORIO
============================================================

Después de cambios importantes ejecutar:

npm run build

Si falla:

NO continuar agregando nuevas funcionalidades.

Primero solucionar el error.

Después volver a ejecutar:

npm run build

No considerar una fase terminada mientras existan errores de compilación relacionados con los cambios realizados.

============================================================
33. FORMA DE TRABAJO CON EL USUARIO
============================================================

El usuario NO es desarrollador profesional.

Por eso:

- explicar de forma sencilla
- evitar tecnicismos innecesarios
- dar instrucciones claras
- cuando sea necesario reemplazar código, entregar el archivo COMPLETO
- no pedir al usuario que edite 15 lugares manualmente
- evitar cambios fragmentados cuando un archivo completo sea más seguro

Cuando el usuario diga:

"pasame el código completo"

entregar el archivo completo listo para copiar y pegar.

============================================================
34. ANTES DE PROGRAMAR
============================================================

Cuando el usuario solicite una nueva funcionalidad:

NO comenzar inmediatamente a escribir código.

Primero:

1. revisar arquitectura actual
2. revisar archivos relacionados
3. revisar tablas
4. revisar relaciones
5. revisar RLS
6. determinar el impacto
7. implementar

Si el cambio es pequeño:

hacerlo pequeño.

Si el cambio requiere arquitectura:

explicarlo antes.

============================================================
35. REGLA DE NO SUPOSICIÓN
============================================================

Nunca asumir:

- nombres de tablas
- nombres de columnas
- políticas RLS
- rutas
- componentes
- funciones
- variables
- relaciones

si no fueron verificadas.

Si existe en el proyecto:

utilizar lo existente.

Si no existe:

proponerlo.

============================================================
36. ROADMAP OFICIAL
============================================================

FASE 1
Base tecnológica
- Next.js
- Supabase
- Auth

FASE 2
Profesionales
- perfil
- dashboard
- servicios

FASE 3
Perfil público

FASE 4
Búsqueda de profesionales

FASE 5
Portafolio

FASE 6
Solicitudes

FASE 7
Trabajos

FASE 8
Calificaciones

FASE 9
Ubicación avanzada

FASE 10
Mensajería / comunicación

FASE 11
Panel administrativo

FASE 12
Moderación

FASE 13
Monetización

FASE 14
Optimización y escalabilidad

No saltar de fase innecesariamente.

============================================================
37. PRINCIPIO DE PRODUCTO
============================================================

ARBUR NO debe convertirse simplemente en:

"una lista de profesionales."

Debe convertirse en:

"una plataforma confiable para encontrar, contratar y evaluar profesionales."

La confianza será uno de los pilares del producto.

Por eso serán importantes:

- perfiles completos
- fotografías
- trabajos realizados
- calificaciones reales
- ubicación
- disponibilidad
- historial de trabajos
- identidad del profesional
- moderación
- seguridad

============================================================
38. VISIÓN FUTURA
============================================================

A largo plazo ARBUR podría incorporar:

- favoritos
- notificaciones
- chat
- mapas
- geolocalización
- profesionales verificados
- insignias
- reputación
- historial
- promociones
- agenda
- disponibilidad horaria
- pagos
- membresías
- perfiles destacados
- estadísticas para profesionales
- estadísticas para administradores
- aplicación móvil

PERO:

No implementar funcionalidades futuras antes de que la base actual esté estable.

============================================================
39. REGLA FINAL
============================================================

Antes de cada modificación preguntate:

"¿Esto mantiene funcionando todo lo que ya existe?"

Si la respuesta es NO:

detenerse.

Analizar.

Proponer una solución segura.

Si la respuesta es SÍ:

implementar.

============================================================
40. OBJETIVO FINAL
============================================================

Construir ARBUR como una plataforma profesional, segura, escalable y fácil de utilizar para Paraguay.

La experiencia debe ser:

CLIENTE:

"Necesito un profesional."

ARBUR:

"Encontralo fácilmente."

PROFESIONAL:

"Necesito conseguir clientes."

ARBUR:

"Mostrá tu trabajo y conectate con ellos."

La aplicación debe transmitir:

CONFIANZA
+
PROFESIONALISMO
+
SIMPLICIDAD
+
TECNOLOGÍA
+
IDENTIDAD PARAGUAYA

# FIN DEL MASTER PROMPT