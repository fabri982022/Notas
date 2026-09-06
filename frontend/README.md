# Frontend

SPA de notas desarrollada con React 19, Vite 8, Axios y Bootstrap 5.

## Configuración

En desarrollo, Vite redirige `/api` al backend en `http://localhost:8080`. Para usar otra URL, crea un archivo `.env` con:

```bash
VITE_API_URL=http://localhost:8080/api
```

## Comandos

```bash
npm install
npm run dev
npm run build
```

La aplicación se publica en `http://localhost:5173`.

## Funcionalidades

Crear, editar, eliminar, archivar y desarchivar notas; crear categorías; asignar varias categorías y filtrar notas por categoría.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
