# ADR 001 · Demo de revisión aislada

**Estado:** aceptada para el repositorio público.

## Contexto

Find Me maneja un tema sensible. Un portfolio debe permitir inspeccionar la capacidad de diseñar una interfaz de moderación sin exponer información de personas ni abrir un canal informal de reportes.

## Decisión

Publicar una SPA React/Vite nueva con registros ficticios y transiciones en memoria. La UI advierte que no verifica identidades ni recibe denuncias. No se copia el backend ni se añade configuración para conectarlo.

## Consecuencias

El evaluador puede reproducir filtros y estados con `npm run dev`, y verificar el comportamiento con `npm test`. Esta muestra no sirve para medir seguridad, persistencia, moderación institucional o desempeño del producto privado. Cualquier extensión futura que implique datos reales requeriría un diseño y una revisión separados.
