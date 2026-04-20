<?php
session_start();
include 'config.php';

if (!isset($_SESSION['email_customer'])) {
    echo "unauthorized";
    exit;
}

$email = $_SESSION['email_customer'];

$name = $_POST['name'] ?? '';
$gender = $_POST['gender'] ?? '';
$phone = $_POST['phone'] ?? '';
$address = $_POST['address'] ?? '';

if ($name === '' || $gender === '' || $phone === '' || $address === '') {
    echo "empty";
    exit;
}

$sql = "UPDATE customer 
        SET name = ?, gender = ?, mobile = ?, address = ?
        WHERE email_customer = ?";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "sssss", $name, $gender, $phone, $address, $email);

if (mysqli_stmt_execute($stmt)) {
    echo "success";
} else {
    echo "error";
}
