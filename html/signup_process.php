<?php
include "config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email_customer = trim($_POST['email_customer'] ?? '');
    $name           = trim($_POST['name'] ?? '');
    $gender         = $_POST['gender'] ?? '';
    $mobile         = trim($_POST['mobile'] ?? '');
    $address        = trim($_POST['address'] ?? '');
    $password       = $_POST['password'] ?? '';
    $confirm        = $_POST['confirm_password'] ?? '';

    // Required fields
    if ($email_customer === '' || $name === '' || $mobile === '' || $password === '' || $confirm === '') {
        echo "error_required";
        exit;
    }

    // Password match
    if ($password !== $confirm) {
        echo "error_password_mismatch";
        exit;
    }

    // Password length
    if (strlen($password) < 8) {
        echo "error_password_short";
        exit;
    }

    // Email exists
    $check = mysqli_prepare($conn, "SELECT email_customer FROM customer WHERE email_customer = ?");
    mysqli_stmt_bind_param($check, "s", $email_customer);
    mysqli_stmt_execute($check);
    mysqli_stmt_store_result($check);

    if (mysqli_stmt_num_rows($check) > 0) {
        echo "error_email_exists";
        exit;
    }

    // Insert user
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = mysqli_prepare(
        $conn,
        "INSERT INTO customer (email_customer, name, gender, mobile, address, password)
         VALUES (?, ?, ?, ?, ?, ?)"
    );

    mysqli_stmt_bind_param(
        $stmt,
        "ssssss",
        $email_customer,
        $name,
        $gender,
        $mobile,
        $address,
        $hashedPassword
    );

    if (mysqli_stmt_execute($stmt)) {
        echo "success";
    } else {
        echo "error_general";
    }
}
