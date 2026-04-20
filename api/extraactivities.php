<?php
require "db.php";
header("Content-Type: application/json");

function uploadImage($field) {
  if (!isset($_FILES[$field]) || $_FILES[$field]['error'] !== 0) {
    return null;
  }

  $folder = "../imej/activity/";
  $ext = pathinfo($_FILES[$field]['name'], PATHINFO_EXTENSION);
  $newName = uniqid("act_") . "." . $ext;

  move_uploaded_file($_FILES[$field]['tmp_name'], $folder . $newName);
  return $newName; // SIMPAN NAMA FAIL SAHAJA
}

/* ===== GET ===== */
if ($_SERVER["REQUEST_METHOD"] === "GET") {
  $res = $conn->query("SELECT * FROM activity ORDER BY id_activity DESC");
  $data = [];
  while ($r = $res->fetch_assoc()) $data[] = $r;
  echo json_encode($data);
  exit;
}

/* ===== TOGGLE is_active ===== */
if (isset($_POST["action"]) && $_POST["action"] === "toggle") {
  $stmt = $conn->prepare("
    UPDATE activity SET is_active=? WHERE id_activity=?
  ");
  $stmt->bind_param("ii", $_POST["is_active"], $_POST["id_activity"]);
  echo json_encode(["success" => $stmt->execute()]);
  exit;
}

/* ===== DELETE ===== */
if (isset($_POST["action"]) && $_POST["action"] === "delete") {
  $stmt = $conn->prepare("DELETE FROM activity WHERE id_activity=?");
  $stmt->bind_param("i", $_POST["id_activity"]);
  echo json_encode(["success"=>$stmt->execute()]);
  exit;
}

/* ===== UPDATE ===== */
if (!empty($_POST["id_activity"])) {

  $img1 = uploadImage("image1") ?? $_POST["old_image1"] ?? null;
  $img2 = uploadImage("image2") ?? $_POST["old_image2"] ?? null;
  $img3 = uploadImage("image3") ?? $_POST["old_image3"] ?? null;

  $stmt = $conn->prepare("
    UPDATE activity SET
      name_activity=?,
      price_activity=?,
      detail_activity=?,
      image1=?,
      image2=?,
      image3=?,
      is_active=?
    WHERE id_activity=?
  ");

  $stmt->bind_param(
    "sdssssii",
    $_POST["name_activity"],
    $_POST["price_activity"],
    $_POST["detail_activity"],
    $img1,   // 🔧 FIX SAHAJA (asal: $_POST["image1"])
    $img2,   // 🔧 FIX SAHAJA (asal: $_POST["image2"])
    $img3,   // 🔧 FIX SAHAJA (asal: $_POST["image3"])
    $_POST["is_active"],
    $_POST["id_activity"]
  );

  echo json_encode(["success"=>$stmt->execute()]);
  exit;
}

/* ===== INSERT ===== */
$img1 = uploadImage("image1");
$img2 = uploadImage("image2");
$img3 = uploadImage("image3");

$stmt = $conn->prepare("
  INSERT INTO activity
  (name_activity, price_activity, detail_activity, image1, image2, image3, is_active)
  VALUES (?, ?, ?, ?, ?, ?, 1)
");

$stmt->bind_param(
  "sdssss",
  $_POST["name_activity"],
  $_POST["price_activity"],
  $_POST["detail_activity"],
  $img1,
  $img2,
  $img3
);

echo json_encode(["success"=>$stmt->execute()]);
exit;
