<?php
include 'config.php';

$selectedDate = $_GET['date'] ?? date('Y-m-d');
$nights = (int)($_GET['nights'] ?? 1);

$rentals = [];

$sql = "
SELECT 
  p.*,
  (p.quantity - IFNULL(MAX(pa.booked_qty), 0)) AS available_qty

FROM package p
LEFT JOIN package_availability pa
  ON pa.id_package = p.id_package
  AND pa.book_date BETWEEN ? AND DATE_ADD(?, INTERVAL ? DAY)
WHERE p.is_active = 1
GROUP BY p.id_package
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $selectedDate, $selectedDate, $nights);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {

  $id = $row['id_package'];

  $price_sql = "SELECT user_category, day_type, price FROM price WHERE id_package = ?";
  $pstmt = $conn->prepare($price_sql);
  $pstmt->bind_param("i", $id);
  $pstmt->execute();
  $price_result = $pstmt->get_result();

  $prices = [
    'upsi' => ['weekday'=>0,'weekend'=>0],
    'public' => ['weekday'=>0,'weekend'=>0]
  ];

  while ($p = $price_result->fetch_assoc()) {
    $prices[$p['user_category']][$p['day_type']] = (float)$p['price'];
  }

  $rentals[] = [
    'id' => $id,
    'title' => $row['name_package'],
    'pax' => $row['capacity'],
    'qty' => max(0, (int)$row['available_qty']),
    'price' => $prices,
    'facilities' => $row['facility'],
    'img' => '../imej/' . $row['image_package']
  ];
}

header("Content-Type: application/json");
echo json_encode($rentals);
