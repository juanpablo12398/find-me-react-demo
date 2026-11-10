# Publicación del código de muestra

El repositorio está publicado como **código fuente**, sin URL alojada declarada. La interfaz actual necesita el backend Java y PostgreSQL/PostGIS para funcionar. Para verificarla localmente, seguir la [guía local](../03-desarrollo/GUIA_LOCAL.md). Para producir el bundle:

```bash
npm ci
npm test
npm run build
```

Vite escribe `dist/`; ese directorio no se versiona. Un hosting estático aislado no ofrece la experiencia conectada. Este servidor de muestra carece de autenticación de producción y no se debe exponer públicamente como canal de reportes. Antes de compartir el código, comprobar que los datos siguen siendo inventados y que no hay claves o archivos privados. GitHub Actions ejecuta pruebas y build, pero no despliega.
