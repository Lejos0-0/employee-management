Employee Management System

Un sistema completo de gestión de empleados con backend en Node.js/Express y frontend en React.
🚀 Características
Backend

    API RESTful con Express.js

    Base de datos SQLite3

    Operaciones CRUD completas

    Endpoints para estadísticas

    Validaciones y manejo de errores

    CORS habilitado

Frontend

    Interfaz moderna con React

    Diseño responsive con Tailwind CSS

    Formularios para crear y editar empleados

    Lista de empleados con acciones

    Estadísticas en tiempo real

    Mobile-friendly

📋 Requisitos

    Node.js (versión 14 o superior)

    npm

🛠️ Instalación
1. Clonar el repositorio
bash

git clone https://github.com/tuusuario/employee-management.git
cd employee-management

2. Configurar el Backend
bash

# Navegar a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Iniciar el servidor
npm start

El backend estará corriendo en: http://localhost:5000
3. Configurar el Frontend
bash

# Abrir una nueva terminal y navegar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar la aplicación React
npm start

El frontend estará corriendo en: http://localhost:3000
📁 Estructura del Proyecto
text

employee-management/
├── backend/
│   ├── node_modules/
│   ├── employees.db          # Base de datos SQLite3
│   ├── server.js             # Servidor Express principal
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── node_modules/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js            # Componente principal React
    │   ├── index.js          # Punto de entrada
    │   ├── index.css         # Estilos con Tailwind
    │   └── ...
    ├── package.json
    ├── tailwind.config.js
    └── package-lock.json

🎯 Uso
Gestión de Empleados

    Ver empleados: La lista principal muestra todos los empleados registrados

    Agregar empleado: Haz clic en "Nuevo Empleado" en el sidebar

    Editar empleado: Usa el botón "Editar" en cualquier registro

    Eliminar empleado: Usa el botón "Eliminar" (con confirmación)

Campos del Empleado

    Nombre completo (texto)

    Email (debe ser único)

    Puesto (texto)

    Departamento (select con opciones predefinidas)

    Salario (número)

    Fecha de contratación (date)

Estadísticas

El sistema muestra en tiempo real:

    Total de empleados

    Nómina total mensual

    Salario promedio

    Distribución por departamentos

🔌 API Endpoints
Empleados

    GET /api/employees - Obtener todos los empleados

    GET /api/employees/:id - Obtener un empleado específico

    POST /api/employees - Crear nuevo empleado

    PUT /api/employees/:id - Actualizar empleado

    DELETE /api/employees/:id - Eliminar empleado

Estadísticas

    GET /api/stats - Obtener estadísticas del sistema

Salud

    GET /api/test - Verificar que la API funciona

🗃️ Base de Datos

La aplicación usa SQLite3 con la siguiente estructura:
sql

CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  salary REAL NOT NULL,
  hire_date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

🎨 Tecnologías Utilizadas
Backend

    Express.js - Framework web para Node.js

    SQLite3 - Base de datos ligera

    CORS - Middleware para cross-origin requests

    Body-parser - Middleware para parsing de requests

Frontend

    React - Biblioteca para interfaces de usuario

    Tailwind CSS - Framework de CSS utility-first

    Axios - Cliente HTTP para las llamadas a la API

🚀 Scripts Disponibles
Backend
bash

npm start          # Iniciar servidor
npm run dev        # Iniciar servidor en modo desarrollo (con nodemon)

Frontend
bash

npm start          # Iniciar servidor de desarrollo
npm run build      # Crear build de producción
npm test           # Ejecutar tests

🔧 Configuración
Puertos

    Backend: 5000

    Frontend: 3000

Variables de Entorno

Actualmente no se requieren variables de entorno. La base de datos se crea automáticamente.
📱 Responsive Design

La aplicación está optimizada para:

    📱 Dispositivos móviles

    💻 Tablets

    🖥️ Desktop

🗂️ Datos de Ejemplo

Al iniciar la aplicación por primera vez, se crearán automáticamente 4 empleados de ejemplo en diferentes departamentos.
🤝 Contribución

    Haz fork del proyecto

    Crea una rama para tu feature (git checkout -b feature/AmazingFeature)

    Commit tus cambios (git commit -m 'Add some AmazingFeature')

    Push a la rama (git push origin feature/AmazingFeature)

    Abre un Pull Request

📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
👥 Autor

Ereddy Marmolejos - ej.marmolejos0.0@gmail.com]
🙏 Agradecimientos

    Express.js

    React

    Tailwind CSS

    SQLite

¡Disfruta usando el sistema de gestión de empleados! 🎉

