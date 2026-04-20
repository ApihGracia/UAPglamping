<?php
ob_clean();
header("Content-Type: application/json; charset=utf-8");

require "db.php";

/* ===============================
   READ JSON INPUT
================================ */
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode([
    "success" => false,
    "message" => "No data received"
  ]);
  exit;
}

$username = trim($data["username"] ?? "");
$password = trim($data["password"] ?? "");

if ($username === "" || $password === "") {
  echo json_encode([
    "success" => false,
    "message" => "Missing username or password"
  ]);
  exit;
}

/* ===============================
   FETCH ADMIN (TABLE: admin)
================================ */
$stmt = $conn->prepare(
  "SELECT password FROM admin WHERE username = ? LIMIT 1"
);

if (!$stmt) {
  echo json_encode([
    "success" => false,
    "message" => "SQL prepare error"
  ]);
  exit;
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if (!$row = $result->fetch_assoc()) {
  echo json_encode([
    "success" => false,
    "message" => "User not found"
  ]);
  exit;
}

/* ===============================
   VERIFY PASSWORD
================================ */
if (!password_verify($password, $row["password"])) {
  echo json_encode([
    "success" => false,
    "message" => "Wrong password"
  ]);
  exit;
}

/* ===============================
   LOGIN SUCCESS
================================ */
echo json_encode([
  "success" => true
]);
exit;
