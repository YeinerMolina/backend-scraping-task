# Tarea de Scraping de Backend

Este proyecto es una aplicación de backend NestJS diseñada para extraer información de libros de un sitio web y almacenarla en una base de datos PostgreSQL. También proporciona una API para acceder a los datos extraídos.

## Tabla de Contenidos
- [Configuración Inicial](#configuración-inicial)
- [Variables de Entorno](#variables-de-entorno)
- [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
- [Ejecución de la Aplicación](#ejecución-de-la-aplicación)
- [Endpoints de la API](#endpoints-de-la-api)

## Configuración Inicial

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/your-repo/backend-scraping-task.git
    cd backend-scraping-task
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto copiando `example.env`:

```bash
cp example.env .env
```

Edita el archivo `.env` con tus configuraciones específicas. Aquí tienes un desglose de cada variable:

-   `DB_HOST`: El nombre de host o la dirección IP de tu servidor de base de datos PostgreSQL (ej. `localhost`).
-   `DB_PORT`: El número de puerto en el que se está ejecutando tu base de datos PostgreSQL (ej. `5432`).
-   `DB_USER`: El nombre de usuario para conectarse a tu base de datos PostgreSQL (ej. `postgres`).
-   `DB_PASS`: La contraseña para el usuario de la base de datos especificado (ej. `1234`).
-   `DB_NAME`: El nombre de la base de datos a la que conectarse (ej. `nest_books`).
-   `DB_SYNC`: Establece en `true` para sincronizar automáticamente el esquema de la base de datos con las entidades de TypeORM (ej. `false`)
-   `SCRAPER_PARALEL_JOBS`: Número de trabajos paralelos (páginas simultaneas) para el scraper de libros (ej. `1`).

## Configuración de la Base de Datos

Este proyecto utiliza PostgreSQL. Asegúrate de tener un servidor PostgreSQL en ejecución y una base de datos creada con el nombre especificado en `DB_NAME` en tu archivo `.env`.

## Ejecución de la Aplicación

1.  **Iniciar la aplicación en modo desarrollo:**
    ```bash
    npm run start:dev
    ```
    La aplicación se ejecutará típicamente en `http://localhost:3000`.

2.  **Compilar y ejecutar en modo producción:**
    ```bash
    npm run build
    npm run start:prod
    ```

## Endpoints de la API

-   **GET /books**
    -   Recupera todos los libros.
    -   **Parámetros de consulta:**
        -   `category` (opcional): Filtra libros por categoría.
        -   `min` (opcional): Filtra libros con `priceNumber` mayor o igual a este valor.
        -   `max` (opcional): Filtra libros con `priceNumber` menor o igual a este valor.
    -   **Ejemplo:** `GET /books?category=fiction&min=10.00&max=50.00`

-   **GET /books/categories**
    -   Recupera una lista de todas las categorías de libros únicas.

-   **GET /books/:id**
    -   Recupera un solo libro por su ID.
    -   **Ejemplo:** `GET /books/1`

-   **DELETE /books/:id**
    -   Elimina un libro por su ID.
    -   **Ejemplo:** `DELETE /books/1`

-   **GET /book-scraper**
    -   Activa el proceso de scraping de libros. Esto obtendrá nuevos datos de libros y los guardará en la base de datos.
