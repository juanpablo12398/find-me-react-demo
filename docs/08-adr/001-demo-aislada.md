# ADR 001 · Interfaz pública aislada (etapa inicial)

**Estado:** reemplazada para el recorrido actual por el [SDD 003](../../specs/003-connected-public-sample/sdd.md).

## Contexto

El primer recorte del portfolio necesitaba mostrar revisión sin copiar identidades o datos de personas.

## Decisión inicial

Se publicó una SPA React con registros inventados y transiciones en memoria. Esa etapa permitió validar el diseño de interacción.

## Evolución

La muestra actual conecta React con una API Spring Boot y PostgreSQL/PostGIS de datos ficticios. La política, las transiciones, la auditoría y el filtrado geográfico se pueden revisar y probar. La identidad y los flujos reales permanecen fuera de este repositorio. El encabezado de muestra no es autenticación de producción.
