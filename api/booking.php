<?php
require "db.php";

$sql = "
SELECT 
  b.id_booking,
  b.email_customer,
  c.name AS customer_name,
  b.booking_date,
  b.days,
  b.total_payment,
  b.payment_proof,

  GROUP_CONCAT(
    CONCAT(p.name_package, ' (x', bd.qty, ')')
    SEPARATOR '<br>'
  ) AS package_list,

  SUM(bd.qty) AS total_qty

FROM booking b
JOIN customer c 
  ON b.email_customer = c.email_customer

JOIN booking_detail bd 
  ON b.id_booking = bd.id_booking

JOIN package p 
  ON bd.id_package = p.id_package

GROUP BY b.id_booking
ORDER BY b.booking_date DESC
";

$result = $conn->query($sql);
$data = [];

if ($result) {
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }
}

echo json_encode($data);
