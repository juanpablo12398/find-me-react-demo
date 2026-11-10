# Especificación · Cola de revisión pública

**Estado:** implementada en este repositorio. **Tipo:** muestra de portfolio independiente. **Origen:** conceptos generales del flujo de moderación de Find Me; código y datos creados para esta demo.

## Problema y propósito

Un evaluador técnico necesita ver cómo se presenta un flujo sensible de revisión en React sin recibir acceso a casos, identidades o integraciones reales. La pantalla permite filtrar y examinar registros inventados y cambiar su estado local. Debe evitar que una observación comunitaria parezca un avistamiento confirmado.

## Requisitos funcionales

1. Mostrar cuatro registros ficticios y un resumen del total, pendientes y registros públicos.
2. Filtrar por estado y buscar por identificador, área o categoría; combinar ambos controles.
3. Seleccionar un registro para ver el detalle y marcarlo `Reviewed` o `Needs context`.
4. Recalcular la cifra de pendientes cuando cambia el estado.
5. Mostrar una cola vacía cuando ningún registro coincide.

## Requisitos de seguridad y comunicación

- Informar en la interfaz que la información es ficticia y no verificada.
- No pedir ni guardar nombres, fotos, ubicación precisa, documentos o datos de contacto.
- Mantener todos los cambios en memoria; recargar la página restablece el escenario.
- No afirmar que esta demo valida identidades, publica casos o recibe denuncias.

## Fuera de alcance

Autenticación, permisos reales, backend Java, PostGIS, mapa, notificaciones, persistencia, carga de archivos, datos de personas e integración institucional. Esas capacidades del proyecto completo no se prueban aquí.

## Criterios de aceptación

| ID | Resultado observable |
| --- | --- |
| FM-01 | Al abrir, hay cuatro registros y cero informes públicos. |
| FM-02 | Búsqueda y filtro reducen la cola y muestran un mensaje si no hay coincidencias. |
| FM-03 | Las acciones cambian sólo el registro seleccionado y el contador pendiente se actualiza. |
| FM-04 | La advertencia de información no verificada sigue visible en el detalle. |
| FM-05 | `npm test` y `npm run build` terminan correctamente. |
