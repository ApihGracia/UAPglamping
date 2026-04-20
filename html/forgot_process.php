<?php
session_start();
include "config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "invalid_request";
    exit;
}

$email = trim($_POST['email'] ?? '');
$newPassword = $_POST['newPassword'] ?? '';

// =====================
// VALIDATION
// =====================
if ($email === '' || $newPassword === '') {
    echo "error_required";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "error_invalid_email";
    exit;
}

// =====================
// CHECK EMAIL EXISTS
// =====================
$stmt = mysqli_prepare($conn, "
    SELECT email_customer 
    FROM customer 
    WHERE email_customer = ?
");
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) !== 1) {
    echo "error_email_not_found";
    exit;
}

// =====================
// UPDATE PASSWORD
// =====================
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

$update = mysqli_prepare($conn, "
    UPDATE customer 
    SET password = ? 
    WHERE email_customer = ?
");
mysqli_stmt_bind_param($update, "ss", $hashedPassword, $email);

mysqli_stmt_execute($update);

if (mysqli_stmt_affected_rows($update) === 1) {
    echo "success";
} else {
    echo "error_update_failed";
}


