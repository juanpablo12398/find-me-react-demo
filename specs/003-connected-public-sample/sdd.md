# SDD 003 · Recorrido público conectado

## Propósito y límites

Esta especificación describe una muestra nueva y acotada del proyecto Find Me privado. Solo usa registros, ubicaciones, marcas de tiempo y un revisor inventados. No acepta reportes de personas reales, comprueba identidades ni reemplaza una vía institucional. Los SDD 001 y 002 documentan etapas previas; este SDD describe el estado actual integrado.

## Recorrido observable

1. `src/App.jsx` solicita `/api/demo/reports` y `/api/demo/audit` mediante `src/api.js`.
2. `DemoController` lee filas sintéticas desde `DemoStore`, respaldado por PostgreSQL. `schema.sql` crea las tablas y `data.sql` carga cuatro filas ficticias.
3. Una acción de revisión envía estado y motivo a `/api/demo/reports/{id}/state`. `ModerationService` valida la transición, aplica `VisibilityPolicy` y guarda estado y evento de auditoría en una transacción.
4. La UI actualiza la cola y la auditoría. `MapPanel` envía los límites visibles a `/api/demo/map`.
5. `GeoSearchRepository` ejecuta una consulta espacial PostGIS y filtra por visibilidad pública. Leaflet dibuja únicamente los puntos publicados y rotulados como no verificados.

## Contratos y responsabilidades

| Capa | Responsabilidad | Fuera del recorte |
| --- | --- | --- |
| React/Vite | Navegación, filtros, revisión y mapa | Identidad y carga de reportes reales |
| API Spring Boot | Endpoints de muestra y validación de entrada | Autenticación de producción |
| Servicio de moderación | Transiciones, política y auditoría | Procesos institucionales completos |
| PostgreSQL/PostGIS | Persistencia ficticia y consulta por límites | Información personal o geográfica real |

`X-Demo-Reviewer` limita las acciones a la experiencia local; **no constituye autenticación**. El servidor se enlaza a loopback por defecto. No debe desplegarse como producto real.

## Criterios de aceptación

- Los cuatro registros de inicio se obtienen desde la API y se pueden buscar y filtrar.
- Un registro pendiente no aparece en el mapa. Una transición válida lo publica como **no verificado**, crea auditoría y lo hace visible en una consulta espacial posterior.
- Una transición inválida o una escritura sin el encabezado de muestra se rechaza.
- Las pruebas React cubren interacción, cliente HTTP y mapa. Las pruebas Java cubren política, servicio, PostGIS y recorrido HTTP con base real en CI.
- Ningún archivo público contiene datos, secretos, estrategia ni código del producto privado que no corresponda a este recorte autorizado.

## Trazabilidad y límites de evidencia

La [matriz del README](../../README.md#qué-permite-comprobar-del-cv) enlaza cada afirmación técnica con código y pruebas. La selección CID-UBA requiere evidencia externa. El matching asistido por IA se declara planificado. La muestra demuestra una implementación pública del patrón descrito; no permite auditar el sistema privado completo.
