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
npm run test:coverage
npm run build
```

Vitest, Testing Library y jsdom ejercitan el DOM y las interacciones. GitHub Actions ejecuta los tres comandos en cada push o pull request. La compilación comprueba que Vite produce un bundle; no sustituye una prueba de accesibilidad completa ni una prueba de navegador real.

La suite actual contiene **7 casos**. En `src/App.jsx` la medición local con V8 dio 100 % de sentencias, funciones y líneas instrumentadas y 92,3 % de ramas. CI exige al menos 90 % en cada categoría. La rama restante es el texto de respaldo si no hubiera registro seleccionado; la semilla y los controles de esta muestra siempre mantienen una selección válida.

**Límites:** sin API, autenticación, persistencia, carga, notificaciones o publicación; no hay una ruta real de backend para probar. El porcentaje corresponde al archivo `App.jsx` transformado e instrumentado, no a toda la aplicación académica ni a la calidad visual, accesibilidad o seguridad. La suite privada de Find Me debe evaluarse por separado.
