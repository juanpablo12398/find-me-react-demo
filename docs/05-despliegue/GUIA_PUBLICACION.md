# Publicación de la muestra estática

El repositorio está publicado como **código fuente**. No se afirma que exista una URL de aplicación alojada. Para crear un bundle estático local:

```bash
npm ci
npm test
npm run build
```

Vite escribe los archivos en `dist/`; ese directorio no se versiona. Un hosting estático puede servirlo sin backend ni variables de entorno. Antes de alojarlo, comprobar que el aviso de demo es visible, que no se agregaron datos reales y que la URL no se presenta como canal oficial de reportes. El workflow de GitHub ejecuta test y build, pero no despliega automáticamente.
