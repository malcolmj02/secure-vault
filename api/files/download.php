<?php
header('Content-Type: application/json');
require_once '../../config/database.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$fileId = $_GET['id'] ?? null;
$userId = $_SESSION['user_id'];

if (!$fileId) {
    http_response_code(400);
    echo json_encode(['error' => 'File ID is required']);
    exit;
}

// Get file details and verify ownership
$stmt = $conn->prepare("SELECT encrypted_path, filename FROM files WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $fileId, $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit;
}

$file = $result->fetch_assoc();
$content = file_get_contents($file['encrypted_path']);

if ($content === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to read file']);
    exit;
}

echo json_encode([
    'content' => $content,
    'filename' => $file['filename']
]);
?>