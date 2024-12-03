<?php
header('Content-Type: application/json');
require_once '../../config/database.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$keyId = $data['keyId'] ?? '';
$password = $data['password'] ?? '';
$userId = $_SESSION['user_id'];

if (empty($keyId) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Key ID and password are required']);
    exit;
}

// Verify password
$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid password']);
    exit;
}

// Get encryption key
$stmt = $conn->prepare("
    SELECT k.encryption_key 
    FROM encryption_keys k 
    JOIN files f ON k.file_id = f.id 
    WHERE k.id = ? AND f.user_id = ?
");
$stmt->bind_param("ii", $keyId, $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Key not found']);
    exit;
}

$key = $result->fetch_assoc();
echo json_encode(['key' => $key['encryption_key']]);
?>