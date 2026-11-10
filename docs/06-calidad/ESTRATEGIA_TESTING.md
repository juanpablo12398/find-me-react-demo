# Estrategia de pruebas · Find Me público

Las pruebas cubren el **recorrido publicado**, no el proyecto privado completo. La cobertura de frontend se mide sobre `App.jsx`, `MapPanel.jsx` y `api.js`.

| Riesgo | Prueba |
| --- | --- |
| La UI muestra datos locales sin API | Tests de `App.jsx` y `api.js` comprueban cargas, solicitudes y errores. |
| Una revisión no actualiza cola, mapa o auditoría | Tests de interacción y `DemoApiIntegrationTest` ejercitan estado y evento HTTP. |
| Un registro no publicado llega al mapa | `VisibilityPolicyTest`, `GeoSearchRepositoryTest` y prueba HTTP con PostGIS. |
| Se filtra un identificador sensible | La proyección pública y su prueba excluyen el reportante. |
| Se acepta una transición o escritura indebida | `ModerationServiceTest` y prueba HTTP de encabezado ausente. |
| Leaflet solicita límites erróneos | `MapPanel.test.jsx` comprueba la solicitud y el renderizado. |

```bash
npm ci
npm run test:coverage
npm run build
mvn -f backend/pom.xml test
```

La suite actual contiene **14 pruebas React** y pruebas Java de servicio, política y repositorio; dos pruebas HTTP integradas y la consulta espacial se ejecutan con PostGIS en CI. Sin `POSTGIS_JDBC_URL` se omiten las pruebas que requieren base. En la última medición local, los tres archivos frontend instrumentados alcanzaron 92,55 % de sentencias, 84,48 % de ramas, 88,63 % de funciones y 95,18 % de líneas; CI exige mínimos de 75/65/75/75 %.

Los porcentajes no demuestran accesibilidad completa, autenticación real, carga, protección de identidad ni calidad del sistema privado. El encabezado de revisor es deliberadamente de demostración.
