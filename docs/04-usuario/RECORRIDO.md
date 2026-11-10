# Recorrido de la muestra conectada

1. Iniciar PostGIS, Spring Boot y Vite según la [guía local](../03-desarrollo/GUIA_LOCAL.md).
2. Abrir la cola. Los cuatro registros ficticios llegan desde la API; buscar por ID o zona y filtrar por estado.
3. Abrir **Public map**. Al inicio aparece solo el punto marcado como publicado y no verificado. El mapa consulta por los límites visibles.
4. Volver a la cola, elegir un registro pendiente y pulsar **Publish unverified**. La API valida y guarda el nuevo estado.
5. Abrir **Audit trail** para comprobar el evento de transición. Volver al mapa y comprobar el punto adicional.
6. Probar **Request context** y **Resume review** con otro registro; las transiciones se guardan en PostgreSQL.

Todo el contenido es inventado. La muestra no recibe reportes reales ni confirma avistamientos. El mapa excluye los registros pendientes y restringidos.
