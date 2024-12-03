<?php
header('Content-Type: application/json');
require_once '../../config/database.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$keyId = $data['keyId'] ?? null;
$label = $data['label'] ?? '';
$userId = $_SESSION['user_id'];

if (!$keyId) {
    http_response_code(400);
    echo json_encode(['error' => 'Key ID is required']);
    exit;
}

// Update key label
$stmt = $conn->prepare("UPDATE encryption_keys SET label = ? WHERE id = ? AND user_id = ?");
$stmt->bind_param("sii", $label, $keyId, $userId);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Key label updated successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update key label']);
}
?>