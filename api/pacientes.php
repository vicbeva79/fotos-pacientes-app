<?php
header("Content-Type: application/json");
require_once __DIR__ . "/config/database.php";
require_once __DIR__ . "/controllers/PacienteController.php";

$database = new Database();
$db = $database->getConnection();
$controller = new PacienteController($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $controller->getAll();
        echo json_encode(["success" => true, "data" => $result]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $controller->create($data);
        echo json_encode($result);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? null;
        if ($id) {
            $result = $controller->update($id, $data);
            echo json_encode($result);
        } else {
            echo json_encode(["success" => false, "message" => "ID requerido"]);
        }
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $_DELETE);
        $id = $_DELETE['id'] ?? null;
        if ($id) {
            $result = $controller->delete($id);
            echo json_encode($result);
        } else {
            echo json_encode(["success" => false, "message" => "ID requerido"]);
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Método no permitido"]);
        break;
}
?> 