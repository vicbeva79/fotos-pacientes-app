<?php
class FotoController {
    private $conn;
    private $table_name = "fotos";
    private $upload_dir = "../../uploads/";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function upload($sesion_id, $tipo, $file) {
        try {
            // Crear directorio si no existe
            if (!file_exists($this->upload_dir)) {
                mkdir($this->upload_dir, 0777, true);
            }

            // Generar nombre único para el archivo
            $file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $file_name = uniqid() . '.' . $file_extension;
            $target_path = $this->upload_dir . $file_name;

            // Mover el archivo
            if (move_uploaded_file($file['tmp_name'], $target_path)) {
                // Guardar en la base de datos
                $query = "INSERT INTO " . $this->table_name . " 
                         (sesion_id, tipo, ruta_archivo) 
                         VALUES (:sesion_id, :tipo, :ruta_archivo)";

                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":sesion_id", $sesion_id);
                $stmt->bindParam(":tipo", $tipo);
                $stmt->bindParam(":ruta_archivo", $file_name);

                if ($stmt->execute()) {
                    return [
                        "success" => true,
                        "message" => "Foto subida correctamente",
                        "data" => [
                            "id" => $this->conn->lastInsertId(),
                            "ruta_archivo" => $file_name
                        ]
                    ];
                }
            } else {
                // Mostrar el error real de PHP
                $error_code = $file['error'];
                $error_message = 'Error al mover el archivo. Código de error: ' . $error_code;
                return [
                    "success" => false,
                    "message" => $error_message
                ];
            }

            return [
                "success" => false,
                "message" => "Error al subir la foto"
            ];

        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Error: " . $e->getMessage()
            ];
        }
    }

    public function getBySesion($sesion_id) {
        try {
            $query = "SELECT * FROM " . $this->table_name . " 
                     WHERE sesion_id = :sesion_id 
                     ORDER BY created_at DESC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":sesion_id", $sesion_id);
            $stmt->execute();

            return [
                "success" => true,
                "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];

        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Error: " . $e->getMessage()
            ];
        }
    }

    public function delete($id) {
        try {
            // Primero obtener la ruta del archivo
            $query = "SELECT ruta_archivo FROM " . $this->table_name . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $id);
            $stmt->execute();
            $foto = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($foto) {
                // Eliminar el archivo físico
                $file_path = $this->upload_dir . $foto['ruta_archivo'];
                if (file_exists($file_path)) {
                    unlink($file_path);
                }

                // Eliminar de la base de datos
                $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":id", $id);
                
                if ($stmt->execute()) {
                    return [
                        "success" => true,
                        "message" => "Foto eliminada correctamente"
                    ];
                }
            }

            return [
                "success" => false,
                "message" => "No se encontró la foto"
            ];

        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Error: " . $e->getMessage()
            ];
        }
    }
}
?> 