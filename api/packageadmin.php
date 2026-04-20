<?php
ob_start();                     // 🔥 WAJIB
error_reporting(0);             // 🔥 WAJIB
ini_set('display_errors', 0);

require "db.php";
header("Content-Type: application/json");

/* ===============================
   IMAGE UPLOAD (ASAL)
================================ */
function uploadImage($fileInputName) {
    if (!isset($_FILES[$fileInputName]) || $_FILES[$fileInputName]['error'] !== 0) {
        return null;
    }

    $folder = "../imej/";
    if (!is_dir($folder)) mkdir($folder, 0777, true);

    $ext = pathinfo($_FILES[$fileInputName]['name'], PATHINFO_EXTENSION);
    $newName = uniqid("pkg_") . "." . $ext;

    move_uploaded_file($_FILES[$fileInputName]['tmp_name'], $folder . $newName);
    return $newName;
}

/* =====================================================
   GET PACKAGE LIST + PRICE INFO
===================================================== */
if ($_SERVER["REQUEST_METHOD"] === "GET" && !isset($_GET["action"])) {

    $sql = "
      SELECT 
        p.*,
        MAX(CASE WHEN pr.user_category='upsi' AND pr.day_type='weekday' THEN pr.price END) AS upsi_weekday,
        MAX(CASE WHEN pr.user_category='upsi' AND pr.day_type='weekend' THEN pr.price END) AS upsi_weekend,
        MAX(CASE WHEN pr.user_category='public' AND pr.day_type='weekday' THEN pr.price END) AS public_weekday,
        MAX(CASE WHEN pr.user_category='public' AND pr.day_type='weekend' THEN pr.price END) AS public_weekend
      FROM package p
      LEFT JOIN price pr ON pr.id_package = p.id_package
      GROUP BY p.id_package
      ORDER BY p.id_package DESC
    ";

    $res = $conn->query($sql);
    $data = [];

    while ($row = $res->fetch_assoc()) {

        $row["price_info"] =
            "UPSI – Weekday: RM " . ($row["upsi_weekday"] ?? "-") . "\n" .
            "UPSI – Weekend: RM " . ($row["upsi_weekend"] ?? "-") . "\n" .
            "Public – Weekday: RM " . ($row["public_weekday"] ?? "-") . "\n" .
            "Public – Weekend: RM " . ($row["public_weekend"] ?? "-");

        $data[] = $row;
    }

    ob_clean();
    echo json_encode($data);
    exit;
}

/* ===============================
   GET PRICE (EDIT)
================================ */
if ($_SERVER["REQUEST_METHOD"] === "GET" && ($_GET["action"] ?? "") === "get_price") {

    $id = $_GET["id_package"];

    $stmt = $conn->prepare("
      SELECT
        MAX(CASE WHEN user_category='upsi' AND day_type='weekday' THEN price END) AS upsi_weekday,
        MAX(CASE WHEN user_category='upsi' AND day_type='weekend' THEN price END) AS upsi_weekend,
        MAX(CASE WHEN user_category='public' AND day_type='weekday' THEN price END) AS public_weekday,
        MAX(CASE WHEN user_category='public' AND day_type='weekend' THEN price END) AS public_weekend
      FROM price WHERE id_package=?
    ");

    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();

    ob_clean();
    echo json_encode($res->fetch_assoc());
    exit;
}

$action = $_POST["action"] ?? "";

/* ===============================
   DELETE PACKAGE
================================ */
if ($action === "delete") {

    $id = $_POST["id_package"];

    // ❌ delete child dulu
    $stmt2 = $conn->prepare("DELETE FROM price WHERE id_package=?");
    $stmt2->bind_param("i", $id);
    $stmt2->execute();

    // ✔️ baru delete parent
    $stmt = $conn->prepare("DELETE FROM package WHERE id_package=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    ob_clean();
    echo json_encode(["success" => true]);
    exit;
}


/* ===============================
   TOGGLE ACTIVE
================================ */
if ($action === "toggle") {

    $stmt = $conn->prepare("UPDATE package SET is_active=? WHERE id_package=?");
    $stmt->bind_param("ii", $_POST["is_active"], $_POST["id_package"]);
    $stmt->execute();

    ob_clean();
    echo json_encode(["success" => true]);
    exit;
}

/* ===============================
   UPDATE PACKAGE + PRICE
================================ */
if ($action === "update") {

    $img1 = uploadImage("image_package") ?? $_POST["old_image_package"];
    $img2 = uploadImage("image_package1") ?? $_POST["old_image_package1"];
    $img3 = uploadImage("image_package2") ?? $_POST["old_image_package2"];

    $stmt = $conn->prepare("
      UPDATE package SET
        name_package=?, facility=?, capacity=?, quantity=?,
        image_package=?, image_package1=?, image_package2=?
      WHERE id_package=?
    ");

    $stmt->bind_param(
        "ssiisssi",
        $_POST["name_package"],
        $_POST["facility"],
        $_POST["capacity"],
        $_POST["quantity"],
        $img1,
        $img2,
        $img3,
        $_POST["id_package"]
    );

    $stmt->execute();

    $prices = [
        ["upsi","weekday",$_POST["price_upsi_weekday"]],
        ["upsi","weekend",$_POST["price_upsi_weekend"]],
        ["public","weekday",$_POST["price_public_weekday"]],
        ["public","weekend",$_POST["price_public_weekend"]],
    ];

    $stmtP = $conn->prepare("
      UPDATE price SET price=?
      WHERE id_package=? AND user_category=? AND day_type=?
    ");

    foreach ($prices as $p) {
        $stmtP->bind_param("diss", $p[2], $_POST["id_package"], $p[0], $p[1]);
        $stmtP->execute();
    }

    ob_clean();
    echo json_encode(["success"=>true]);
    exit;
}

/* ===============================
   ADD PACKAGE + PRICE
================================ */
if ($action === "add") {

    $img1 = uploadImage("image_package");
    $img2 = uploadImage("image_package1");
    $img3 = uploadImage("image_package2");

    $stmt = $conn->prepare("
      INSERT INTO package
      (name_package, facility, capacity, quantity,
       image_package, image_package1, image_package2, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    ");

    $stmt->bind_param(
        "ssiisss",
        $_POST["name_package"],
        $_POST["facility"],
        $_POST["capacity"],
        $_POST["quantity"],
        $img1,
        $img2,
        $img3
    );

    $stmt->execute();
    $package_id = $conn->insert_id;

    $prices = [
        ["upsi","weekday",$_POST["price_upsi_weekday"]],
        ["upsi","weekend",$_POST["price_upsi_weekend"]],
        ["public","weekday",$_POST["price_public_weekday"]],
        ["public","weekend",$_POST["price_public_weekend"]],
    ];

    $stmtP = $conn->prepare("
      INSERT INTO price (id_package, user_category, day_type, price)
      VALUES (?, ?, ?, ?)
    ");

    foreach ($prices as $p) {
        $stmtP->bind_param("issd", $package_id, $p[0], $p[1], $p[2]);
        $stmtP->execute();
    }

    ob_clean();
    echo json_encode(["success"=>true]);
    exit;
}
