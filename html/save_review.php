<?php
session_start();
include 'config.php';

if (!isset($_SESSION['email_customer'])) {
    session_unset();
    session_destroy();
    echo "<script>
        alert('Please login before write your review!');
        window.location = 'login.html?next=review';
    </script>";
    exit;
}

$email = $_SESSION['email_customer'];
$comment = $_POST['comment'];
$rating = $_POST['rating'];
$gambar_path = NULL;
if (isset($_FILES['gambar']) && $_FILES['gambar']['error'] == 0) {
    $target_dir = "../uploads/review/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true); 
    }
}

    $file_name = uniqid() . "_" . basename($_FILES["gambar"]["name"]);
    $target_file = $target_dir . $file_name;

    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Semak format gambar
    $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
    if (in_array($imageFileType, $allowed_types)) {
        if (move_uploaded_file($_FILES["gambar"]["tmp_name"], $target_file)) {
            $gambar_path = "uploads/review/" . $file_name;
        }
    }
// Simpan ke DB
$sql = "INSERT INTO review (email_customer, rating, comment, gambar) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("siss", $email, $rating, $comment, $gambar_path);

if ($stmt->execute()) {
    echo "<script>
        alert('Thank you for your review!');
        window.location = 'review.php';
    </script>";
} else {
    echo 'Error: ' . $stmt->error;
}
?>
