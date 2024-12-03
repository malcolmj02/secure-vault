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
$key = $data['key'] ?? null;
$label = $data['label'] ?? '';
$userId = $_SESSION['user_id'];

if (!$key) {
    http_response_code(400);
    echo json_encode(['error' => 'Encryption key is required']);
    exit;
}

// Store standalone encryption key
$stmt = $conn->prepare("INSERT INTO encryption_keys (user_id, encryption_key, label, created_at) VALUES (?, ?, ?, NOW())");
$stmt->bind_param("iss", $userId, $key, $label);

if ($stmt->execute()) {
    $keyId = $stmt->insert_id;
    echo json_encode([
        'success' => true,
        'message' => 'Key created successfully',
        'keyId' => $keyId
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create key']);
}
?>