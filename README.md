# Find Me · public engineering sample

![Public demo preview](docs/preview.png)

An isolated **React + Vite** review interface plus a **Java/Spring Boot domain slice** adapted from the private Find Me project. React demonstrates component composition, controlled inputs and review states. The backend slice demonstrates moderation transitions, audit events, role-aware visibility and a PostGIS bounds query.

The full academic application uses React on the frontend, Java/Spring Boot on the backend and PostgreSQL/PostGIS. This repository contains **no real reports, photos, personal coordinates, identity records, integration keys or complete production source**. All sample data is fictional. The React UI and backend slice are deliberately separate; this repo cannot accept reports or verify identities. See [extraction notes](docs/02-arquitectura/EXTRACCION_BACKEND.md) for exact provenance and limits.

Find Me is a complementary academic tool; it is not an official missing person reporting channel. Community observations must never be presented as confirmed sightings before appropriate review.

## Run

```bash
npm install
npm run dev
```

Run `npm test` and `npm run build` for React. Run `mvn -f backend/pom.xml test` for the 21 Java tests. The PostGIS test is skipped locally unless `POSTGIS_JDBC_URL` points to a PostGIS database; GitHub Actions supplies one and runs the repository query against it. These checks validate only this public extraction, not the full private application.

## Documentation

The [documentation index](docs/00-indice/INDICE.md) links the public specification, design (SDD), implementation plan, decisions, user walkthrough and test strategy. Its scope is deliberately limited to this standalone demo; it follows the organization of the full project's documentation without copying private specifications.

## What to inspect

- `src/App.jsx`: filtering and review state in React.
- `src/styles.css`: responsive layout and distinct status treatments.
- The UI makes the demo and unverified status visible throughout the flow.
- `backend/src/main/java/dev/verdondoni/findme`: Spring services adapted from the private moderation and visibility rules, plus a PostGIS query.
- `backend/src/test/java/dev/verdondoni/findme`: transition, audit, privacy, invalid bounds and database-backed query tests.

**Scope:** This repo is a deliberately limited public sample, not the complete product. Designed and implemented by Juan Pablo Verdondoni.

Copyright © Juan Pablo Verdondoni. No reuse license is granted for this public sample.
