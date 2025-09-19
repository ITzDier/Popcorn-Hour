## Popcorn-Hour 🍿
# ¡Critica de Películas!

Plataforma web para compartir, calificar y comentar sobre películas y series. Permite a los usuarios agregar favoritos, dejar opiniones y a los moderadores gestionar el catálogo de contenido.

## Características

- Catálogo de películas y series con información detallada.
- Sistema de usuario: registro, inicio de sesión y roles (usuario estándar y moderador).
- Moderadores pueden agregar y eliminar contenido.
- Valoraciones por estrellas y promedio por película/serie.
- Sistema de comentarios por usuario.
- Favoritos personales por usuario.
- Subida de imágenes/posters.
- Interfaz moderna y responsiva.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/ITzDier/Popcorn-Hour.git
   cd Popcorn-Hour
   ```

2. Instala dependencias del frontend y backend:

   ```bash
   cd frontend
   npm install
   cd ../backend
   pip install -r requirements.txt
   ```

3. Configura el backend:
   - Crea tu archivo `.env` con tus variables de entorno necesarias (ejemplo: conexión a la base de datos, clave JWT, etc.)

4. Inicia el backend:

   ```bash
   python app.py
   ```

5. Inicia el frontend:

   ```bash
   cd frontend
   npm start
   ```

## Uso

- Accede al catálogo, busca y filtra películas/series.
- Regístrate o inicia sesión para comentar y guardar favoritos.
- Si eres moderador, puedes agregar nuevos títulos o eliminar contenido.
- Valora títulos y participa en los comentarios.

## Roles

- **Usuario estándar**: Puede ver, comentar, valorar y guardar favoritos.
- **Moderador**: Además puede agregar y eliminar contenido.

## Tecnologías

- **Frontend:** React.js
- **Backend:** Flask (Python) + MongoDB
- **Autenticación:** JWT
- **Estilos:** CSS puro y componentes estilizados

## Licencia

Este proyecto está bajo la licencia MIT.

---
NOTA: Consulta README.md popcorn-hour-fronted para información detallada extra acerca de documentación y dependencias.

**¡Disfruta Popcorn-Hour y comparte tu opinión sobre tus películas y series favoritas!**


# EN

# Popcorn-Hour 🍿
Cinema Reviews!

A web platform to share, rate, and comment on movies and series. Users can add favorites, leave reviews, and moderators can manage the content catalog.

## Features

- Catalog of movies and series with detailed information.
- User system: registration, login, and roles (standard user and moderator).
- Moderators can add and remove content.
- Star ratings and average rating per movie/series.
- User comment system.
- Personal favorites for each user.
- Image/poster uploads.
- Modern and responsive interface.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ITzDier/Popcorn-Hour.git
   cd Popcorn-Hour
   ```

2. Install frontend and backend dependencies:

   ```bash
   cd frontend
   npm install
   cd ../backend
   pip install -r requirements.txt
   ```

3. Configure the backend:
   - Create your `.env` file with the necessary environment variables (e.g., database connection, JWT key, etc.)

4. Start the backend:

   ```bash
   python app.py
   ```

5. Start the frontend:

   ```bash
   cd frontend
   npm start
   ```

## Usage

- Access the catalog, search and filter movies/series.
- Register or log in to comment and save favorites.
- If you are a moderator, you can add new titles or remove content.
- Rate titles and participate in comments.

## Roles

- **Standard user**: Can view, comment, rate, and save favorites.
- **Moderator**: Can also add and remove content.

## Technologies

- **Frontend:** React.js
- **Backend:** Flask (Python) + MongoDB
- **Authentication:** JWT
- **Styles:** Pure CSS and styled components

## License

This project is licensed under the MIT License.

---
NOTE: Also see README.md popcorn-hour-frontend for additional detailed information about documentation and dependencies.

**Enjoy Popcorn-Hour and share your opinion about your favorite movies and series!**