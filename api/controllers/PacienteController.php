<?php
class PacienteController {
    private $conn;
    private $table_name = "pacientes";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " (nombre, apellidos, ficha, doctor) VALUES (:nombre, :apellidos, :ficha, :doctor)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nombre", $data['nombre']);
        $stmt->bindParam(":apellidos", $data['apellidos']);
        $stmt->bindParam(":ficha", $data['ficha']);
        $stmt->bindParam(":doctor", $data['doctor']);
        if ($stmt->execute()) {
            return [
                "success" => true,
                "id" => $this->conn->lastInsertId()
            ];
        }
        return ["success" => false, "message" => "Error al crear paciente"];
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . " SET nombre = :nombre, apellidos = :apellidos, ficha = :ficha, doctor = :doctor WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nombre", $data['nombre']);
        $stmt->bindParam(":apellidos", $data['apellidos']);
        $stmt->bindParam(":ficha", $data['ficha']);
        $stmt->bindParam(":doctor", $data['doctor']);
        $stmt->bindParam(":id", $id);
        if ($stmt->execute()) {
            return ["success" => true];
        }
        return ["success" => false, "message" => "Error al actualizar paciente"];
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if ($stmt->execute()) {
            return ["success" => true];
        }
        return ["success" => false, "message" => "Error al eliminar paciente"];
    }
}
?> 