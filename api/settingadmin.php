<?php
ob_clean();
header("Content-Type: application/json; charset=utf-8");

require "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  echo json_encode(["success" => false, "message" => "Invalid request"]);
  exit;
}

$newPassword = $_POST["newPassword"] ?? "";

if (strlen($newPassword) < 8) {
  echo json_encode([
    "success" => false,
    "message" => "Password too short"
  ]);
  exit;
}

// 🔐 HASH PASSWORD
$hashed = password_hash($newPassword, PASSWORD_DEFAULT);

// ⚠️ ADMIN USERNAME TETAP
$username = "adminGlamping";

$stmt = $conn->prepare("
  UPDATE admin
  SET password = ?
  WHERE username = ?
");

$stmt->bind_param("ss", $hashed, $username);
$stmt->execute();

if ($stmt->affected_rows === 1) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Update failed"
  ]);
}
exit;
