# SDD 002 · Moderación, privacidad y búsqueda espacial

**Etapa histórica:** este recorte Java ya está conectado a la interfaz en el [SDD 003](../003-connected-public-sample/sdd.md).

## Problema y alcance

La demo React 001 prueba únicamente una interfaz. Este recorte publica una parte del diseño Java/Spring de Find Me sin datos de personas ni la aplicación completa. Requisitos: una transición de estado requiere administrador y motivo; deja auditoría; el público ve solo `PUBLICADO_NO_VERIFICADO`; la búsqueda por mapa aplica el mismo filtro.

## Contrato y modelo

`ModerationService.changeState(id, next, reason, reviewerId, isAdmin)` devuelve el `Sighting` revisado o rechaza permiso, motivo, estado o transición. `Store.save(sighting, event)` representa la persistencia conjunta; el adaptador real no se publica. `VisibilityPolicy.canView` permite administrador, reportante o estado publicado. `toPublic` produce un DTO sin `reporterId`. `GeoSearchRepository.findPublicInBounds` devuelve únicamente IDs de puntos dentro de límites WGS84.

## Flujo

1. Se valida administrador e identidad del revisor.
2. Se normaliza motivo y se carga el aporte.
3. Se compara `ReviewState` con la matriz de transiciones adaptada del proyecto privado.
4. Se actualiza el indicador legado como consecuencia del estado, nunca al revés, y se registra un `AuditEvent`.
5. Para vistas públicas se usa el estado aprobado; en mapa el SQL usa `ST_Within` y la misma condición.

## Datos y riesgos

Los objetos de prueba tienen descripciones inventadas, UUID aleatorios y tres puntos geográficos ficticios. No hay fotos, identidad, contacto ni historias reales. La consulta usa parámetros JDBC, valida límites y no forma SQL con texto del usuario. La interfaz y el módulo Java no están integrados. La muestra no implementa HTTP, autenticación ni almacenamiento transaccional; no debe desplegarse como canal de reportes.

## Pruebas y criterios

- Transición válida genera evento con antes/después, revisor y motivo.
- Transición prohibida, usuario no administrador y motivo corto no persisten.
- `RECIBIDO + legacyPublic=true` permanece oculto para terceros.
- La proyección pública omite el identificador del reportante.
- La consulta ejecutada contra PostGIS incluye un punto publicado y descarta uno pendiente y otro fuera del área.

La prueba PostGIS necesita `POSTGIS_JDBC_URL` y se ejecuta en CI. Sin esa variable se declara omitida, no exitosa.

## Trazabilidad

Ver [procedencia y límites](../../docs/02-arquitectura/EXTRACCION_BACKEND.md). El recorte se adapta de clases privadas para hacer posible evaluación independiente; no demuestra la seguridad integral del producto.
