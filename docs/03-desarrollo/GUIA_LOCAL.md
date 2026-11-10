# Guía de desarrollo local

Requisitos: Java 17+, Maven, Node.js, npm y Docker con Compose. El servidor y la base se enlazan a loopback; los datos son ficticios.

```bash
docker compose up -d
mvn -f backend/pom.xml spring-boot:run
```

En otra terminal:

```bash
npm ci
npm run dev
```

Abrir `http://localhost:5173`. Vite reenvía `/api` al servidor Java en `127.0.0.1:8081`. `schema.sql` y `data.sql` preparan cuatro registros sintéticos. La UI consulta la API, persiste una revisión y vuelve a leer auditoría y mapa. Las modificaciones persisten en el volumen de la base local.

```bash
npm run test:coverage
npm run build
mvn -f backend/pom.xml test
```

Para ejecutar también las pruebas Java de integración en local, definir `POSTGIS_JDBC_URL=jdbc:postgresql://127.0.0.1:5432/findme_public_demo`. GitHub Actions configura su propia base PostGIS de prueba. El encabezado `X-Demo-Reviewer` sirve solo al escenario ficticio, no a una instalación de producción. No introducir casos, fotos, coordenadas, identidades ni claves reales.
