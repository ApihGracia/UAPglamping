<?php
require "db.php";
header("Content-Type: application/json; charset=UTF-8");

$sql = "
  SELECT
    b.id_billing,
    b.customer_name,
    b.customer_email,
    b.amount,
    b.payment_method,
    b.billing_date,
    bk.payment_proof
  FROM billing b
  LEFT JOIN booking bk
    ON b.id_booking = bk.id_booking
";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
