# Aplicación de Fotos de Pacientes

Esta aplicación permite gestionar fotos de pacientes para un consultorio dental.

## Requisitos

- XAMPP (Apache + MySQL + PHP)
- Node.js y npm
- Navegador web moderno

## Instalación

1. Clonar el repositorio en la carpeta htdocs de XAMPP:
   ```bash
   cd C:/xampp/htdocs
   git clone [URL_DEL_REPOSITORIO] fotos-pacientes-app
   ```

2. Crear la base de datos:
   - Abrir phpMyAdmin (http://localhost/phpmyadmin)
   - Crear una nueva base de datos llamada `fotos_pacientes`
   - Importar el archivo `api/config/database.sql`

3. Configurar los permisos:
   - Asegurarse de que la carpeta `api/uploads` tenga permisos de escritura
   - En Windows, hacer clic derecho en la carpeta → Propiedades → Seguridad → Editar → Agregar → Everyone → Control total

4. Instalar las dependencias del frontend:
   ```bash
   cd fotos-pacientes-app
   npm install
   ```

5. Construir el frontend:
   ```bash
   npm run build
   ```

6. Configurar el virtual host (opcional):
   - Abrir `C:/xampp/apache/conf/extra/httpd-vhosts.conf`
   - Agregar:
     ```apache
     <VirtualHost *:80>
         DocumentRoot "C:/xampp/htdocs/fotos-pacientes-app"
         ServerName fotos-pacientes.local
         <Directory "C:/xampp/htdocs/fotos-pacientes-app">
             Options Indexes FollowSymLinks
             AllowOverride All
             Require all granted
         </Directory>
     </VirtualHost>
     ```
   - Agregar `127.0.0.1 fotos-pacientes.local` al archivo `C:/Windows/System32/drivers/etc/hosts`

## Uso

1. Iniciar XAMPP (Apache y MySQL)
2. Acceder a la aplicación:
   - Si configuraste el virtual host: http://fotos-pacientes.local
   - Si no: http://localhost/fotos-pacientes-app

## Estructura del Proyecto

```
fotos-pacientes-app/
├── api/                    # Backend PHP
│   ├── config/            # Configuración de BD
│   ├── controllers/       # Controladores PHP
│   ├── uploads/          # Carpeta para las fotos
│   └── database.php      # Conexión a MySQL
├── src/                   # Frontend React
└── public/               # Archivos estáticos
```

## Desarrollo

Para desarrollo local:

1. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. La aplicación estará disponible en http://localhost:5173

## Notas

- Las fotos se almacenan en el servidor en la carpeta `api/uploads`
- La base de datos se encuentra en MySQL
- El frontend está construido con React y Vite
- El backend está construido con PHP
