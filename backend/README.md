# Backend

API REST desarrollada con Java 25, Spring Boot 4.1.1, Spring Data JPA y MySQL 8+.

## Configuración

Se conecta mediante las variables `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`. El valor por defecto del proyecto usa `root` y `alumno2008`, pero puedes configurar cualquier usuario y contraseña de MySQL en tu equipo. Hibernate crea o actualiza las tablas con `spring.jpa.hibernate.ddl-auto=update`.

## Comandos

```bash
./mvnw test
./mvnw spring-boot:run
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

`clean package` construye el frontend React y lo copia dentro de los recursos estáticos del JAR. La aplicación unificada queda disponible en `http://localhost:8080`, y la API en `http://localhost:8080/api`.