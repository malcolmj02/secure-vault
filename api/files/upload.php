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

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$userId = $_SESSION['user_id'];
$file = $_FILES['file'];
$fileSize = $file['size'];

// Check current storage usage
$stmt = $conn->prepare("SELECT COALESCE(SUM(file_size), 0) as total_size FROM files WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$currentUsage = $result->fetch_assoc()['total_size'];

// Storage quota (1GB = 1073741824 bytes)
$storageQuota = 1073741824;

// Check if new file would exceed quota
if (($currentUsage + $fileSize) > $storageQuota) {
    http_response_code(400);
    echo json_encode(['error' => 'Storage quota exceeded. Please delete some files first.']);
    exit;
}

$uploadDir = '../../uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$fileName = basename($file['name']);
$encryptedPath = $uploadDir . uniqid() . '_' . $fileName;

if (move_uploaded_file($file['tmp_name'], $encryptedPath)) {
    $stmt = $conn->prepare("INSERT INTO files (user_id, filename, encrypted_path, file_size) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("issi", $userId, $fileName, $encryptedPath, $fileSize);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'File uploaded successfully',
            'file' => [
                'name' => $fileName,
                'size' => $fileSize
            ]
        ]);
    } else {
        unlink($encryptedPath);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save file information']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to upload file']);
}
?>