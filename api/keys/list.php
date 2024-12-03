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

$userId = $_SESSION['user_id'];
$stmt = $conn->prepare("
    SELECT k.id, k.file_id, f.filename, f.upload_date 
    FROM encryption_keys k 
    JOIN files f ON k.file_id = f.id 
    WHERE f.user_id = ? 
    ORDER BY f.upload_date DESC
");

$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$keys = [];
while ($row = $result->fetch_assoc()) {
    $keys[] = [
        'id' => $row['id'],
        'fileId' => $row['file_id'],
        'filename' => $row['filename'],
        'uploadDate' => date('Y-m-d H:i:s', strtotime($row['upload_date']))
    ];
}

echo json_encode(['keys' => $keys]);
?>