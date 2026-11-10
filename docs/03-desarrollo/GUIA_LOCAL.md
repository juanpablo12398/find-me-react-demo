# Guía de desarrollo local

**Requisito:** Node.js 24 y npm. No hace falta Java, PostGIS, cuenta externa ni archivo `.env` para esta muestra.

```bash
npm ci
npm run dev
npm test
npm run build
npm run preview
```

`src/App.jsx` contiene las cuatro entradas inventadas, filtros, selección y transiciones en memoria. `src/styles.css` da el diseño adaptable. `src/App.test.jsx` prueba el comportamiento visible. `vitest.config.js` configura jsdom. `index.html` monta la aplicación mediante `src/main.jsx`.

No añadir casos, fotos, ubicaciones precisas ni claves al conjunto ficticio. Si se amplía la UI, actualizar primero el SDD y los criterios de aceptación, y añadir una prueba de la interacción nueva. La recarga restablece siempre el escenario.
