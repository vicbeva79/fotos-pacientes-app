<?php
// Mostrar todos los errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Verificar si el archivo database.php existe
if (!file_exists('config/database.php')) {
    die('Error: No se encuentra el archivo database.php');
}

echo "<h1>Prueba de Conexión</h1>";

try {
    require_once 'config/database.php';
    
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "<p style='color: green;'>✅ Conexión exitosa a la base de datos</p>";
        
        // Probar una consulta simple
        $query = "SHOW TABLES";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        echo "<h2>Tablas en la base de datos:</h2>";
        echo "<ul>";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "<li>" . $row[0] . "</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: red;'>❌ Error al conectar a la base de datos</p>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
    echo "<pre>";
    print_r($e->getTrace());
    echo "</pre>";
}
?> 