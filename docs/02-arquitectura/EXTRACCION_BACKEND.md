# Extracción pública del backend

## Procedencia

Muestra adaptada del proyecto académico de Juan Pablo Verdondoni. Se conservan los nombres de estados, las transiciones principales, la auditoría de revisión y el predicado geoespacial `ST_Within` con filtro `PUBLICADO_NO_VERIFICADO`. El código se redujo para poder evaluarlo sin identidad, imágenes, WebSocket, repositorios de casos ni datos personales.

| Muestra | Capacidad mostrada | Alcance |
| --- | --- | --- |
| `ModerationService.java` | Transiciones y auditoría | Repositorio y auditoría inyectados como un puerto |
| `ReviewState.java` | Estados de revisión | Nombres del dominio con tipos reducidos |
| `VisibilityPolicy.java` | Control de acceso | Estado publicado como requisito de acceso público |
| `GeoSearchRepository.java` | Consulta espacial | `ST_Within` y filtro público sobre tabla y proyección reducidas |

No se afirma que el frontend React esté conectado a este backend o que la muestra sea una aplicación Spring Boot desplegable.

## Regla de privacidad de la muestra

El estado de revisión es la fuente de verdad para acceso público. El indicador de compatibilidad no puede ampliar la visibilidad. Las pruebas incluyen indicadores desactualizados para evitar una publicación accidental. Esta política se verifica únicamente en el módulo público.

## Pruebas

- 19 casos de moderación y privacidad: permisos, transición válida/inválida, auditoría, dueño/tercero/admin y proyección sin identificador del reportante.
- 2 casos geoespaciales: validación de límites y consulta real del repositorio contra PostGIS. El segundo se omite localmente cuando no hay `POSTGIS_JDBC_URL`; CI lo ejecuta con un servicio PostGIS.
- Los 7 tests React anteriores verifican solo la UI aislada.

La consulta usa `ST_Within`; no se presenta como `ST_Intersects`. Esta muestra no demuestra índices, rendimiento a escala, seguridad HTTP, integración entre capas, ni casos reales.
