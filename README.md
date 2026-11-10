# Find Me · muestra pública conectada

Muestra **ejecutable de extremo a extremo** de Find Me: React/Vite consulta un servidor Java/Spring Boot; PostgreSQL/PostGIS conserva registros ficticios y filtra los puntos que Leaflet dibuja en el mapa. Una revisión cambia el estado en la base y deja un evento de auditoría. El [código del corte académico demo-estable](https://github.com/juanpablo12398/find-me-stable) también está publicado; las versiones posteriores permanecen privadas.

**Todos los registros, coordenadas e identificadores aquí son ficticios.** Find Me no es un canal oficial de denuncias ni confirma avistamientos. Esta muestra no recibe reportes reales ni verifica identidades.

## Qué permite comprobar del CV

| Afirmación | Evidencia pública | Límite |
| --- | --- | --- |
| React/Vite y revisión de casos | [Interfaz](src/App.jsx), [cliente API](src/api.js), [pruebas de interacción](src/App.test.jsx) | El acceso de revisor es solo para datos ficticios |
| Java/Spring Boot y estados | [API](backend/src/main/java/dev/verdondoni/findme/DemoController.java), [servicio de moderación](backend/src/main/java/dev/verdondoni/findme/ModerationService.java) | Se excluye la identidad y seguridad del producto completo |
| PostgreSQL/PostGIS y mapas | [consulta espacial](backend/src/main/java/dev/verdondoni/findme/GeoSearchRepository.java), [Leaflet](src/MapPanel.jsx), [prueba real con PostGIS](backend/src/test/java/dev/verdondoni/findme/GeoSearchRepositoryTest.java) | Solo puntos inventados |
| Auditoría y privacidad | [persistencia](backend/src/main/java/dev/verdondoni/findme/DemoStore.java), [política pública](backend/src/main/java/dev/verdondoni/findme/VisibilityPolicy.java), [prueba HTTP integrada](backend/src/test/java/dev/verdondoni/findme/DemoApiIntegrationTest.java) | No equivale a una auditoría de seguridad del proyecto privado |

La selección para incubación CID-UBA es un reconocimiento externo, no una función comprobable en código. El matching asistido por IA está **planificado** y no se presenta como implementado.

## Ejecutar localmente

Requisitos: Java 17+, Maven, Node.js y Docker.

```bash
docker compose up -d
mvn -f backend/pom.xml spring-boot:run
```

En otra terminal:

```bash
npm ci
npm run dev
```

Abrí `http://localhost:5173`. El frontend usa el proxy de Vite hacia `127.0.0.1:8081`. La base local contiene cuatro registros sintéticos; se puede publicar uno, ver su evento de auditoría y encontrarlo en el mapa. El encabezado `X-Demo-Reviewer` solo controla la experiencia ficticia: **no es autenticación de producción**. El servidor se enlaza a loopback por defecto.

## Verificación

```bash
npm run test:coverage
npm run build
mvn -f backend/pom.xml test
```

La suite de PostGIS se ejecuta completa en [GitHub Actions](.github/workflows/verify.yml). Localmente, las pruebas que necesitan PostgreSQL/PostGIS se omiten si no se define `POSTGIS_JDBC_URL`. La [documentación](docs/00-indice/INDICE.md) incluye los SDD por etapa, contratos, decisiones, matriz de pruebas y límites de la extracción.

**Alcance de publicación:** código adaptado para esta muestra, separado del [snapshot estable](https://github.com/juanpablo12398/find-me-stable); las personas, datos reales y versiones posteriores permanecen privados. Copyright © Juan Pablo Verdondoni. No se concede licencia de reutilización.
