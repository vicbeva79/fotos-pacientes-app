<?php
class SesionController {
    private $conn;
    private $table_name = "sesiones";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getByPaciente($paciente_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE paciente_id = :paciente_id ORDER BY fecha DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":paciente_id", $paciente_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " (paciente_id, nombre, fecha, comentarios) VALUES (:paciente_id, :nombre, :fecha, :comentarios)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":paciente_id", $data['paciente_id']);
        $stmt->bindParam(":nombre", $data['nombre']);
        $stmt->bindParam(":fecha", $data['fecha']);
        $stmt->bindParam(":comentarios", $data['comentarios']);
        if ($stmt->execute()) {
            return [
                "success" => true,
                "id" => $this->conn->lastInsertId()
            ];
        }
        return ["success" => false, "message" => "Error al crear sesión"];
    }

    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . " SET nombre = :nombre, fecha = :fecha, comentarios = :comentarios WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nombre", $data['nombre']);
        $stmt->bindParam(":fecha", $data['fecha']);
        $stmt->bindParam(":comentarios", $data['comentarios']);
        $stmt->bindParam(":id", $id);
        if ($stmt->execute()) {
            return ["success" => true];
        }
        return ["success" => false, "message" => "Error al actualizar sesión"];
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        if ($stmt->execute()) {
            return ["success" => true];
        }
        return ["success" => false, "message" => "Error al eliminar sesión"];
    }
}
?>