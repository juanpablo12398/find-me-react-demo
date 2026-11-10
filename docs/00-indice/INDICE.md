# Documentación pública · Find Me React demo

Este índice toma como referencia la separación entre gestión, arquitectura, desarrollo, uso y calidad de la documentación del proyecto Find Me completo. **Describe únicamente este repositorio público**. No reproduce los SDD privados ni pretende documentar el backend Java.

| Sección | Documento | Propósito |
| --- | --- | --- |
| 01 · Alcance | [Especificación](../../specs/001-public-review-demo/spec.md) | Objetivos, exclusiones y criterios de aceptación de la muestra. |
| 02 · Diseño | [SDD del flujo público](../../specs/001-public-review-demo/sdd.md) | Estado, datos ficticios, transiciones y trazabilidad. |
| 03 · Ejecución | [Plan y tareas](../../specs/001-public-review-demo/tasks.md) | Entregables y verificación del alcance implementado. |
| 03 · Desarrollo | [Guía local](../03-desarrollo/GUIA_LOCAL.md) | Instalación, comandos y estructura del código. |
| 04 · Decisiones | [ADR 001](../08-adr/001-demo-aislada.md) | Por qué esta muestra es autónoma y no conecta con el sistema real. |
| 05 · Uso | [Recorrido](../04-usuario/RECORRIDO.md) | Qué puede probar una persona que evalúa el repositorio. |
| 06 · Calidad | [Estrategia de pruebas](../06-calidad/ESTRATEGIA_TESTING.md) | Matriz de pruebas, comandos y límites de cobertura. |
| 07 · Publicación | [Guía de publicación](../05-despliegue/GUIA_PUBLICACION.md) | Bundle estático y validación previa. |

## Evidencia pública

- Código: `src/App.jsx`, `src/styles.css` y `src/main.jsx`.
- Pruebas: `src/App.test.jsx`, ejecutadas por GitHub Actions.
- Vista previa: `docs/preview.png`.

**Estado:** muestra implementada. Todas las personas y registros mostrados son inventados; no se aceptan reportes reales.
