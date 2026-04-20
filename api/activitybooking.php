<?php
require "db.php";

/* =====================================================
   EXPORT PDF (PALING SELAMAT – TIDAK GANGGU AJAX)
===================================================== */
if (
  $_SERVER["REQUEST_METHOD"] === "GET" &&
  isset($_GET["action"]) &&
  $_GET["action"] === "export"
) {

  require __DIR__ . "/fpdf/fpdf.php";

  // ===== FETCH DATA =====
  $sql = "SELECT * FROM activity_booking ORDER BY activity_date DESC";
  $res = $conn->query($sql);

  // ===== PDF SETUP =====
  $pdf = new FPDF("L", "mm", "A4");
  $pdf->AddPage();
  $pdf->SetMargins(10, 10, 10);
  $pdf->SetAutoPageBreak(true, 10);

  // ===== HEADER =====
  $pdf->SetFont("Arial", "B", 16);
  $pdf->Cell(0, 10, "Extra Activities Bookings", 0, 1, "C");

  $pdf->SetFont("Arial", "", 10);
  $pdf->Cell(0, 8, "Exported on: " . date("d M Y | h:i A"), 0, 1, "C");
  $pdf->Ln(5);

  // ===== TABLE HEADER =====
  $pdf->SetFont("Arial", "B", 10);

  $headers = ["Name", "Email", "Phone", "Activity", "Date", "Time", "Pax", "Payment Ref"];
  $widths  = [45, 70, 35, 40, 30, 25, 15, 35];

  foreach ($headers as $i => $h) {
    $pdf->Cell($widths[$i], 8, $h, 1, 0, "C");
  }
  $pdf->Ln();

  // ===== TABLE DATA =====
  $pdf->SetFont("Arial", "", 9);

  while ($row = $res->fetch_assoc()) {
    $pdf->Cell(45, 8, $row["customer_name"], 1);
    $pdf->Cell(70, 8, $row["customer_email"], 1);
    $pdf->Cell(35, 8, $row["customer_phone"], 1);
    $pdf->Cell(40, 8, $row["activity_name"], 1);
    $pdf->Cell(30, 8, $row["activity_date"], 1);
    $pdf->Cell(25, 8, $row["activity_time"], 1);
    $pdf->Cell(15, 8, $row["participants"], 1, 0, "C");
    $pdf->Cell(35, 8, $row["payment_reference"] ?? "-", 1);
    $pdf->Ln();
  }

  $pdf->Output("D", "extra_activities_bookings.pdf");
  exit;
}

/* =====================================================
   SEMUA RESPONSE AJAX GUNA JSON
===================================================== */
header("Content-Type: application/json");

/* =========================
   GET BOOKINGS (ASAL)
========================= */
if ($_SERVER["REQUEST_METHOD"] === "GET") {
  $res = $conn->query(
    "SELECT * FROM activity_booking ORDER BY id_bookingActivity DESC"
  );

  $data = [];
  while ($r = $res->fetch_assoc()) {
    $data[] = $r;
  }

  echo json_encode($data);
  exit;
}

/* =========================
   DELETE BOOKING (ASAL)
========================= */
if (
  isset($_POST["action"]) &&
  $_POST["action"] === "delete" &&
  !empty($_POST["id_bookingActivity"])
) {

  $stmt = $conn->prepare(
    "DELETE FROM activity_booking WHERE id_bookingActivity=?"
  );
  $stmt->bind_param("i", $_POST["id_bookingActivity"]);
  $stmt->execute();

  echo json_encode(["success" => true]);
  exit;
}

/* =========================
   UPDATE BOOKING
   ✅ TAMBAH payment_reference SAHAJA
========================= */
if (
  isset($_POST["action"]) &&
  $_POST["action"] === "update" &&
  !empty($_POST["id_bookingActivity"])
) {

  $stmt = $conn->prepare("
    UPDATE activity_booking SET
      customer_name=?,
      customer_email=?,
      customer_phone=?,
      activity_name=?,
      activity_date=?,
      activity_time=?,
      participants=?,
      payment_reference=?
    WHERE id_bookingActivity=?
  ");

  $stmt->bind_param(
    "ssssssisi",
    $_POST["customer_name"],
    $_POST["customer_email"],
    $_POST["customer_phone"],
    $_POST["activity_name"],
    $_POST["activity_date"],
    $_POST["activity_time"],
    $_POST["participants"],
    $_POST["payment_reference"],
    $_POST["id_bookingActivity"]
  );

  echo json_encode(["success" => $stmt->execute()]);
  exit;
}

/* =========================
   INSERT BOOKING
   ✅ TAMBAH payment_reference SAHAJA
========================= */
$stmt = $conn->prepare("
  INSERT INTO activity_booking
  (customer_name, customer_email, customer_phone, activity_name, activity_date, activity_time, participants, payment_reference)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
  "ssssssis",
  $_POST["customer_name"],
  $_POST["customer_email"],
  $_POST["customer_phone"],
  $_POST["activity_name"],
  $_POST["activity_date"],
  $_POST["activity_time"],
  $_POST["participants"],
  $_POST["payment_reference"]
);

echo json_encode(["success" => $stmt->execute()]);
exit;
