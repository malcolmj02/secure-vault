<?php
header('Content-Type: application/json');
require_once '../../config/database.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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

// Get file path before deletion
$stmt = $conn->prepare("SELECT encrypted_path FROM files WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $fileId, $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit;
}

$file = $result->fetch_assoc();

// Delete from database
$stmt = $conn->prepare("DELETE FROM files WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $fileId, $userId);

if ($stmt->execute()) {
    // Delete physical file
    if (file_exists($file['encrypted_path'])) {
        unlink($file['encrypted_path']);
    }
    echo json_encode(['success' => true, 'message' => 'File deleted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete file']);
}
?>