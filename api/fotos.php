<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'config/database.php';
include_once 'controllers/FotoController.php';

$database = new Database();
$db = $database->getConnection();
$controller = new FotoController($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        if (isset($_POST['sesion_id']) && isset($_POST['tipo']) && isset($_FILES['foto'])) {
            $result = $controller->upload(
                $_POST['sesion_id'],
                $_POST['tipo'],
                $_FILES['foto']
            );
            echo json_encode($result);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Faltan datos requeridos"
            ]);
        }
        break;

    case 'GET':
        if (isset($_GET['sesion_id'])) {
            $result = $controller->getBySesion($_GET['sesion_id']);
            echo json_encode($result);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Se requiere el ID de la sesión"
            ]);
        }
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $_DELETE);
        if (isset($_DELETE['id'])) {
            $result = $controller->delete($_DELETE['id']);
            echo json_encode($result);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Se requiere el ID de la foto"
            ]);
        }
        break;

    default:
        echo json_encode([
            "success" => false,
            "message" => "Método no permitido"
        ]);
        break;
}
?> 