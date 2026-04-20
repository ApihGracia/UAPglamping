<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

require __DIR__ . "/db.php";

$data = [
  "total_customers"  => 0,
  "total_bookings"   => 0,
  "total_activities" => 0,
  "total_packages"   => 0
];

// CUSTOMER
$q = $conn->query("SELECT COUNT(*) AS total FROM customer");
if ($q) $data["total_customers"] = (int)$q->fetch_assoc()["total"];

// BOOKING
$q = $conn->query("SELECT COUNT(*) AS total FROM booking");
if ($q) $data["total_bookings"] = (int)$q->fetch_assoc()["total"];

// ACTIVITY
$q = $conn->query("SELECT COUNT(*) AS total FROM activity");
if ($q) $data["total_activities"] = (int)$q->fetch_assoc()["total"];

// PACKAGE
$q = $conn->query("SELECT COUNT(*) AS total FROM package");
if ($q) $data["total_packages"] = (int)$q->fetch_assoc()["total"];

echo json_encode($data);
?>