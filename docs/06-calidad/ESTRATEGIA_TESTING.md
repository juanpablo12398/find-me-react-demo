# Estrategia de pruebas · Alcance público

La referencia metodológica es la separación de pruebas de frontend y backend del Find Me completo. **Esta suite pertenece sólo a la muestra React**. No se trasplantan tests privados de Java, PostGIS ni de la aplicación completa.

| Riesgo público | Prueba | Evidencia |
| --- | --- | --- |
| Mostrar datos como confirmados | Advertencia y cero publicaciones iniciales | `starts with fictional...` |
| Filtro o búsqueda incorrectos | Combinación y estado vacío | `search and status filter...` |
| Cambiar otro registro o no actualizar métricas | Selección, estado y pendiente | `review changes...` |
| Confundir contexto solicitado con revisión | Transición a `Needs context` | `requesting context...` |

## Ejecución

```bash
npm ci
npm test
npm run build
```

Vitest, Testing Library y jsdom ejercitan el DOM y las interacciones. GitHub Actions ejecuta los tres comandos en cada push o pull request. La compilación comprueba que Vite produce un bundle; no sustituye una prueba de accesibilidad completa ni una prueba de navegador real.

**Límites:** sin API, autenticación, persistencia, carga, notificaciones o publicación; no hay una ruta real de backend para probar. La suite privada de Find Me debe evaluarse por separado y no se le asigna una cobertura porcentual a esta demo.
