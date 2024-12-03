<?php
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
require_once '../../config/database.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $userId = $_SESSION['user_id'];

    // Get total storage used
    $stmt = $conn->prepare("SELECT COALESCE(SUM(file_size), 0) as total_size FROM files WHERE user_id = ?");
    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param("i", $userId);
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $storageUsed = (int)$row['total_size'];

    // Storage quota (1GB = 1073741824 bytes)
    $storageQuota = 1073741824;

    echo json_encode([
        'used' => $storageUsed,
        'total' => $storageQuota,
        'percentage' => ($storageUsed / $storageQuota) * 100
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to retrieve storage information: ' . $e->getMessage()]);
}
?>