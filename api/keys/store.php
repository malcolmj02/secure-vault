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
$fileId = $data['fileId'] ?? null;
$encryptionKey = $data['encryptionKey'] ?? null;
$userId = $_SESSION['user_id'];

if (!$fileId || !$encryptionKey) {
    http_response_code(400);
    echo json_encode(['error' => 'File ID and encryption key are required']);
    exit;
}

// Verify file belongs to user
$stmt = $conn->prepare("SELECT id FROM files WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $fileId, $userId);
$stmt->execute();
if ($stmt->get_result()->num_rows === 0) {
    http_response_code(403);
    echo json_encode(['error' => 'File not found or access denied']);
    exit;
}

// Store encryption key
$stmt = $conn->prepare("INSERT INTO encryption_keys (file_id, encryption_key) VALUES (?, ?)");
$stmt->bind_param("is", $fileId, $encryptionKey);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Encryption key stored successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to store encryption key']);
}
?>