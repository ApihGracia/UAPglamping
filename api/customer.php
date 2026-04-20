<?php
require "db.php";

$result = $conn->query("
  SELECT 
    email_customer,
    name,
    gender,
    mobile,
    address,
    created_at
  FROM customer
  ORDER BY created_at DESC
");

$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);

