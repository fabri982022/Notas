# Ensolvers Notes

Aplicación SPA para crear, editar, eliminar, archivar y etiquetar notas. La información se persiste en MySQL mediante Spring Data JPA.

## Tecnologías

- Java 25 y Spring Boot 4.1.1
- Maven Wrapper incluido en `backend`
- MySQL 8.0 o superior
- Node.js 20 o superior y npm 10 o superior
- React 19, Vite 8, Axios y Bootstrap 5

## Ejecución rápida

1. Crea una base de datos MySQL (el nombre por defecto es `ensolver_notes`) y asegúrate de que el servidor esté activo.
2. Desde la raíz, copia `.env.example` como `.env` y configura las credenciales de tu instalación:

```bash
cp .env.example .env
```

En tu entorno actual, el archivo `.env` ya está configurado con `DB_USERNAME=root` y `DB_PASSWORD=alumno2008`. Ese archivo está excluido de Git para no publicar credenciales.

3. Ejecuta el script correspondiente. Ambos cargan `.env` automáticamente:

```bash
# Linux/macOS/Git Bash
./run.sh

# Windows PowerShell
.\run.ps1
```

El backend quedará en `http://localhost:8080` y el frontend en `http://localhost:5173`.

También puedes arrancar cada aplicación por separado siguiendo sus respectivos README.

### JAR unificado

Maven construye automáticamente el frontend y lo incluye dentro del JAR de Spring Boot:

```bash
cd backend
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

En Windows puedes usar `mvnw.cmd` en lugar de `./mvnw`. En este modo la aplicación completa queda disponible en `http://localhost:8080`.

## Variables de entorno

Backend: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `SERVER_PORT` y `FRONTEND_URL`. Si se ejecuta directamente con Maven sin `run.sh`, estas variables deben existir en el sistema operativo.

Frontend: `VITE_API_URL`, cuyo valor por defecto en desarrollo y despliegue unificado es `/api`.

## API principal

- `GET /api/notes?archived=false&categoryId=1`
- `POST /api/notes`, `PUT /api/notes/{id}`, `DELETE /api/notes/{id}`
- `PATCH /api/notes/{id}/archive?archived=true`
- `GET /api/categories`, `POST /api/categories`

El backend está separado en controladores, servicios, repositorios, DTOs y entidades JPA.
