<?php
session_start();
include "config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "invalid_request";
    exit;
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
    echo "error_required";
    exit;
}

$stmt = mysqli_prepare($conn, "
    SELECT email_customer, name, password 
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

$user = mysqli_fetch_assoc($result);

if (!password_verify($password, $user['password'])) {
    echo "error_wrong_password";
    exit;
}

// ✅ SUCCESS
$_SESSION['email_customer'] = $user['email_customer'];
$_SESSION['name'] = $user['name'];

// ✅ AUTO DETECT USER CATEGORY
if (str_ends_with($user['email_customer'], 'upsi.edu.my')) {
    $_SESSION['user_category'] = 'upsi';
} else {
    $_SESSION['user_category'] = 'public';
}

echo "success";


