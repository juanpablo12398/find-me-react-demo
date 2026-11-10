# Estrategia de pruebas · Alcance público

La referencia metodológica es la separación de pruebas de frontend y backend del Find Me completo. Esta suite cubre **la muestra React y el recorte Java/PostGIS**, no la aplicación completa.

| Riesgo público | Prueba | Evidencia |
| --- | --- | --- |
| Mostrar datos como confirmados | Advertencia y cero publicaciones iniciales | `starts with fictional...` |
| Filtro o búsqueda incorrectos | Combinación y estado vacío | `search and status filter...` |
| Cambiar otro registro o no actualizar métricas | Selección, estado y pendiente | `review changes...` |
| Confundir contexto solicitado con revisión | Transición a `Needs context` | `requesting context...` |
| Publicar una observación pendiente | Estado `RECIBIDO` con indicador legado `publico=true` sigue oculto | `VisibilityPolicyTest` |
| Exponer identificador del reportante | Proyección pública sin `reporterId` | `VisibilityPolicyTest` |
| Transición o permiso indebidos | Matriz de estados, administrador, motivo y evento de auditoría | `ModerationServiceTest` |
| Mostrar punto privado en mapa | Consulta del repositorio real con tres puntos ficticios sobre PostGIS | `GeoSearchRepositoryTest` en CI |

## Ejecución

```bash
npm ci
npm test
npm run test:coverage
npm run build
mvn -f backend/pom.xml test
```

Vitest, Testing Library y jsdom ejercitan el DOM y las interacciones. GitHub Actions ejecuta los tres comandos en cada push o pull request. La compilación comprueba que Vite produce un bundle; no sustituye una prueba de accesibilidad completa ni una prueba de navegador real.

La suite contiene **7 casos React y 21 casos Java**. En `src/App.jsx` la medición local con V8 dio 100 % de sentencias, funciones y líneas instrumentadas y 92,3 % de ramas. CI exige al menos 90 % en cada categoría. La rama restante es el texto de respaldo si no hubiera registro seleccionado; la semilla y los controles de esta muestra siempre mantienen una selección válida. La prueba Java contra PostGIS se omite localmente sin Docker y se ejecuta en GitHub Actions.

**Límites:** el recorte Java no ofrece API HTTP, autenticación, persistencia de casos reales, carga, notificaciones o publicación. El porcentaje corresponde al archivo `App.jsx` transformado e instrumentado, no a toda la aplicación académica ni a la calidad visual, accesibilidad o seguridad. La suite privada de Find Me debe evaluarse por separado.
