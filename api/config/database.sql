-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS fotos_pacientes;
USE fotos_pacientes;

-- Tabla pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla sesiones
CREATE TABLE IF NOT EXISTS sesiones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    fecha DATE NOT NULL,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- Tabla fotos
CREATE TABLE IF NOT EXISTS fotos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sesion_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    ruta_archivo VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sesion_id) REFERENCES sesiones(id) ON DELETE CASCADE
); 