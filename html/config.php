<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "uap_glamping";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Fail to connect with Database: " . mysqli_connect_error());
}


?>
