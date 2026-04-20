<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "uap_glamping";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Database connection failed"
  ]);
  exit;
}
