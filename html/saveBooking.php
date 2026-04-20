<?php
session_start();
include 'config.php';

header("Content-Type: application/json");

// ================= SECURITY =================
if (!isset($_SESSION['email_customer'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    exit;
}

// ================= DATA =================
$email        = $_SESSION['email_customer'];
$checkin      = $data['booking_date'] ?? null;
$nights       = (int)($data['days'] ?? 1);
$rooms        = $data['rooms'] ?? [];
$totalPayment = (float)($data['total_payment'] ?? 0);

if (!$checkin || $nights <= 0 || empty($rooms)) {
    echo json_encode(["success" => false, "message" => "Invalid booking data"]);
    exit;
}

// ================= START TRANSACTION =================
$conn->begin_transaction();

try {

    // ---------- 1. INSERT BOOKING ----------
    $stmt = $conn->prepare("
        INSERT INTO booking (email_customer, booking_date, days, total_payment)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("ssid", $email, $checkin, $nights, $totalPayment);
    if (!$stmt->execute()) {
        throw new Exception("Failed to insert booking");
    }
    $id_booking = $conn->insert_id;

    // ---------- 2. INSERT BOOKING DETAIL ----------
    $stmtDetail = $conn->prepare("
        INSERT INTO booking_detail (id_booking, id_package, qty, price)
        VALUES (?, ?, ?, ?)
    ");

    foreach ($rooms as $room) {
        $stmtDetail->bind_param(
            "iiid",
            $id_booking,
            $room['id'],
            $room['qty'],
            $room['unitPrice']
        );
        if (!$stmtDetail->execute()) {
            throw new Exception("Failed to insert booking detail");
        }
    }

    // ---------- 3. AVAILABILITY CHECK + LOCK ----------
    foreach ($rooms as $room) {

        $id_package = (int)$room['id'];
        $qty        = (int)$room['qty'];

        // dapatkan total quantity package
        $q = $conn->query("
            SELECT quantity FROM package WHERE id_package = $id_package
        ");
        $totalQty = (int)$q->fetch_assoc()['quantity'];

        // loop SETIAP NIGHT
        for ($i = 0; $i < $nights; $i++) {

            $date = date('Y-m-d', strtotime("$checkin +$i day"));

            // LOCK availability row
            $lock = $conn->prepare("
                SELECT booked_qty
                FROM package_availability
                WHERE id_package = ? AND book_date = ?
                FOR UPDATE
            ");
            $lock->bind_param("is", $id_package, $date);
            $lock->execute();
            $res = $lock->get_result();

            $currentBooked = 0;
            if ($row = $res->fetch_assoc()) {
                $currentBooked = (int)$row['booked_qty'];
            }

            if ($currentBooked + $qty > $totalQty) {
                throw new Exception("Room not available for $date");
            }

            // UPSERT availability
            $upsert = $conn->prepare("
                INSERT INTO package_availability (id_package, book_date, booked_qty)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE booked_qty = booked_qty + VALUES(booked_qty)
            ");
            $upsert->bind_param("isi", $id_package, $date, $qty);
            if (!$upsert->execute()) {
                throw new Exception("Failed to update availability");
            }
        }
    }

    // ---------- COMMIT ----------
    $conn->commit();

    echo json_encode([
        "success" => true,
        "id_booking" => $id_booking
    ]);

} catch (Exception $e) {

    // ---------- ROLLBACK ----------
    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
