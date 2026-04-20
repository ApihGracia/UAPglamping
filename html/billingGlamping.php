<?php
session_start();
include 'config.php';

if (!isset($_SESSION['email_customer'])) {
    header("Location: login.php");
    exit;
}

if (!isset($_GET['id_booking'])) {
    die("Invalid booking.");
}
// ===============================
// CANCEL BOOKING (DELETE + ROLLBACK)
// ===============================
if (isset($_GET['cancel']) && $_GET['cancel'] === '1') {

    $id_booking = (int)$_GET['id_booking'];
    $email = $_SESSION['email_customer'];

    // ambil booking info (tarikh & hari)
    $stmt = $conn->prepare(
        "SELECT booking_date, days 
         FROM booking 
         WHERE id_booking = ? AND email_customer = ?"
    );
    $stmt->bind_param("is", $id_booking, $email);
    $stmt->execute();
    $booking = $stmt->get_result()->fetch_assoc();

    if ($booking) {

        $startDate = new DateTime($booking['booking_date']);
        $days = (int)$booking['days'];

        // ambil item booking
        $stmt = $conn->prepare(
            "SELECT id_package, qty 
             FROM booking_detail 
             WHERE id_booking = ?"
        );
        $stmt->bind_param("i", $id_booking);
        $stmt->execute();
        $items = $stmt->get_result();

        // 🔁 ROLLBACK AVAILABILITY
        $stmtRollback = $conn->prepare(
            "UPDATE package_availability
             SET booked_qty = booked_qty - ?
             WHERE id_package = ? AND book_date = ?"
        );

        while ($item = $items->fetch_assoc()) {
            for ($i = 0; $i < $days; $i++) {
                $date = clone $startDate;
                $date->modify("+$i day");
                $bookDate = $date->format("Y-m-d");

                $stmtRollback->bind_param(
                    "iis",
                    $item['qty'],
                    $item['id_package'],
                    $bookDate
                );
                $stmtRollback->execute();
            }
        }

        // 🧹 DELETE availability rows yang jadi 0
        $conn->query(
            "DELETE FROM package_availability WHERE booked_qty <= 0"
        );

        // 🗑 DELETE booking_detail
        $stmt = $conn->prepare(
            "DELETE FROM booking_detail WHERE id_booking = ?"
        );
        $stmt->bind_param("i", $id_booking);
        $stmt->execute();

        // 🗑 DELETE booking
        $stmt = $conn->prepare(
            "DELETE FROM booking WHERE id_booking = ?"
        );
        $stmt->bind_param("i", $id_booking);
        $stmt->execute();
    }

    header("Location: bookingGlamping.php");
    exit;
}

if (isset($_POST['confirm_booking'])) {

    if (empty($_POST['id_booking'])) {
        die("Invalid booking");
    }

    $id_booking = (int)$_POST['id_booking'];
    $email = $_SESSION['email_customer'];

    // FETCH booking latest from database
    $sqlCheck = "SELECT payment_proof FROM booking WHERE id_booking = ? AND email_customer = ?";
    $stmt = $conn->prepare($sqlCheck);
    $stmt->bind_param("is", $id_booking, $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $bookingCheck = $result->fetch_assoc();

    // SAFETY 1: check payment
    if (!$bookingCheck || empty($bookingCheck['payment_proof'])) {
        echo "<script>
          alert('Please upload payment proof before confirming booking.');
          window.location.href = 'billingGlamping.php?id_booking=$id_booking';
        </script>";
        exit;
    }

    // SAFETY 2: check terms
    if (!isset($_POST['accept_terms'])) {
        echo "<script>
          alert('Please accept the Terms & Booking Policy.');
          window.history.back();
        </script>";
        exit;
    }
	
	// 🔒 FETCH booking info (WAJIB sebelum guna $booking)
$stmt = $conn->prepare(
  "SELECT booking_date, days 
   FROM booking 
   WHERE id_booking = ? AND email_customer = ?"
);
$stmt->bind_param("is", $id_booking, $email);
$stmt->execute();
$booking = $stmt->get_result()->fetch_assoc();

if (!$booking) {
  die("Booking data not found for availability save.");
}

$startDate = new DateTime($booking['booking_date']);
$days = (int)$booking['days'];
	
    echo "<script>
      alert('Booking successfully confirmed.');
      window.location.href = 'bookingGlamping.php';
    </script>";
    exit;
}

if (isset($_POST['submit_payment'])) {

    $uploadDir = "../imej/payment/";
    $fileName = time() . "_" . basename($_FILES["payment_proof"]["name"]);
    $targetFile = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES["payment_proof"]["tmp_name"], $targetFile)) {

        $sql = "UPDATE booking SET payment_proof = ? WHERE id_booking = ?";
        $stmt = $conn->prepare($sql);
        $bookingId = (int)$_POST['id_booking'];
		$stmt->bind_param("si", $fileName, $bookingId);

        $stmt->execute();

        echo "<script>
		alert('Payment proof uploaded successfully.');
		window.location.href = 'billingGlamping.php?id_booking=$bookingId';
		</script>";

    } else {
        echo "<script>alert('Failed to upload file');</script>";
    }
}

$email = $_SESSION['email_customer'];
$id_booking = (int)$_GET['id_booking'];

/* =====================
   GET BOOKING
===================== */
$sqlBooking = "
SELECT *
FROM booking
WHERE id_booking = ? AND email_customer = ?
";

$stmt = $conn->prepare($sqlBooking);
$stmt->bind_param("is", $id_booking, $email);
$stmt->execute();
$booking = $stmt->get_result()->fetch_assoc();

if (!$booking) {
    die("Booking not found. ID: $id_booking | Email: $email");
}

$paymentUploaded = !empty($booking['payment_proof']);

$sqlDetails = "
SELECT bd.*, p.name_package, p.capacity
FROM booking_detail bd
JOIN package p ON bd.id_package = p.id_package
WHERE bd.id_booking = ?
";

$stmt = $conn->prepare($sqlDetails);
$stmt->bind_param("i", $id_booking);
$stmt->execute();
$bookingDetails = $stmt->get_result();

$bookingRooms = [];
while ($row = $bookingDetails->fetch_assoc()) {
  $bookingRooms[] = $row;
}

$stmt = $conn->prepare($sqlBooking);
$stmt->bind_param("is", $id_booking, $email);
$stmt->execute();
$booking = $stmt->get_result()->fetch_assoc();
$paymentUploaded = !empty($booking['payment_proof']);

if (!$booking) {
    die("Booking not found. ID: $id_booking | Email: $email");
}


/* =====================
   GET CUSTOMER
===================== */
$sqlCustomer = "SELECT * FROM customer WHERE email_customer = ?";
$stmt = $conn->prepare($sqlCustomer);
$stmt->bind_param("s", $email);
$stmt->execute();
$customer = $stmt->get_result()->fetch_assoc();
?>


<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Billing - UAP Glamping</title>

  <link rel="stylesheet" href="../css/glamping.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body class="billing-page">

<!-- ================= HEADER ================= -->
<header>
  <div class="logo">
    <a href="index.php">
      <img src="../imej/logoGlamping2.png" alt="UPSI Glamping Park">
    </a>
    <div class="logo-text">
      <span class="logo-line1">UPSI</span>
      <span class="logo-line2">GLAMPING PARK</span>
    </div>
  </div>

  <div class="menu-toggle">
    <i class="fa-solid fa-bars"></i>
  </div>
  
</header>

<!-- ================= HERO ================= -->
<section class="billing-hero">
  <div class="hero-text">
    <h1>Billing & Guest Details</h1>
    <p style="color: #ffffff;" >Almost there — complete your booking</p>
  </div>
</section>

<!-- ================= MAIN ================= -->
<div class="page-wrap">

  <!-- LEFT -->
  <div class="main-col">

    <div class="card">
      <div class="section-title">Guest Information</div>

      <div class="form-grid">
	  
        <label class="required">Guest Name</label>
        <div class="readonly-field">
		<?= htmlspecialchars($customer['name']) ?>
		</div>


        <label class="required">Gender</label>
        <div class="readonly-field">
		<?= htmlspecialchars($customer['gender']) ?>
		</div>

        <label class="required">Mobile</label>
        <div class="readonly-field">
		<?= htmlspecialchars($customer['mobile']) ?>
		</div>

        <label class="required">Email</label>
        <div class="readonly-field">
		<?= htmlspecialchars($customer['email_customer']) ?>
		</div>

        <label class="required">Address</label>
        <div class="readonly-field">
		<?= htmlspecialchars($customer['address']) ?>
		</div>

      </div>
    </div>

    <div class="card">
      <div class="section-title">Preferences</div>
      <p class="small-muted" style="color: red; text: italic;">
        Any additional activities offered by the glamping will be arranged in person at the registration counter on your check-in day.
      </p>

      <div style="margin-top:16px;">
        <div class="section-title">Payment Method</div>
		
        <?php if ($paymentUploaded): ?>
		
		<div style="margin-bottom:10px; color:green; font-weight:600;">
		<i class="fa-solid fa-circle-check"></i>
		Payment proof uploaded: <br>
		
		<a href="../imej/payment/<?= htmlspecialchars($booking['payment_proof']) ?>" 
       target="_blank">
       <?= htmlspecialchars($booking['payment_proof']) ?>
	   </a>
	   </div>
	   
	   <?php else: ?>
	   <button class="btn-orange" id="onlinePaymentBtn">Online Payment</button>
	   <?php endif; ?>

      </div>
    </div>

    <div class="card">
      <div class="section-title">Hotel Policy & Booking Conditions</div>

      <div class="policy-box">
        <p><strong>Check-In</strong> – 3:00 PM</p>
        <p><strong>Check-Out</strong> – 12:00 PM</p>

        <p class="small-muted">
          Please ensure you present valid identification at check-in.
          Non-compliance with local entry requirements may result in denied entry and non-refundable charges.
        </p>

        <hr>

        <ul>
          <li><strong>Cancellation:</strong> Free cancellation up to 48 hours before check-in.</li>
          <li><strong>Deposit & Payment:</strong> A deposit may be required.</li>
          <li><strong>Extra Person:</strong> Additional guests may incur extra charges.</li>
          <li><strong>Children:</strong> Rates for children vary by room type.</li>
          <li><strong>Pets:</strong> Pets are not permitted.</li>
          <li><strong>Smoking:</strong> Smoking is not allowed inside tents/rooms.</li>
          <li><strong>Noise:</strong> Quiet hours apply from 10:00 PM to 7:00 AM.</li>
          <li><strong>Damages:</strong> Guests are liable for damage to property.</li>
          <li><strong>Late Check-Out:</strong> Subject to availability and additional charges.</li>
          <li><strong>Force Majeure:</strong> Events outside our control.</li>
        </ul>
      </div>
	  
<!-- REVIEW MODAL -->
<div id="modalBackdrop" class="modal-backdrop">
  <div  class="modal">
    <h3 style="text-align:center; margin-top:10px; color: #a89478; letter-spacing: 2px; font-size: 25px; ">Review Your Booking</h3>

    <div id="reviewContent">
	<p><strong>Package & Quantity:</strong></p>
	<ul id="r_packages" style="margin-left:18px; line-height:1.8;"></ul>
	<br>

	
    <p><strong>Check-in:</strong> <span id="r_checkin"></span></p>
    <p><strong>Check-out:</strong> <span id="r_checkout"></span></p>
    <p><strong>Nights:</strong> <span id="r_nights"></span></p>
	
    <p><strong>Total Price:</strong> RM <span id="r_total"></span></p>
	</div>

    <div style="text-align:right; margin-top:15px;">
      <button class="btn-info" onclick="document.getElementById('modalBackdrop').style.display='none'">
        Close
      </button>
    </div>
  </div>
</div>

      <form method="POST">

  <div style="margin-top:12px;">
    <label>
      <input type="checkbox" id="acceptTerms" name="accept_terms">
      I acknowledge and accept the Terms of Booking, Cancellation Policy & Hotel Policy.
    </label>
	
	<?php if (!$paymentUploaded): ?>
      <div class="payment-alert-global">
     ⚠ Please upload payment proof before confirming booking.
       </div>
    <?php endif; ?>

  </div>

  <input type="hidden" name="id_booking" value="<?= $id_booking ?>">

<div class="actions-bottom">

  <button type="button" class="btn-outline" id="reviewBookingBtn">
    Review Your Booking
  </button>

  <button type="button" class="btn-outline" id="editBookingBtn">
    Cancel
  </button>

  <button type="submit"
          name="confirm_booking"
          class="btn-orange"
          <?= !$paymentUploaded ? 'disabled' : '' ?>>
    Book Now
  </button>

</div>

</form>
	  
    </div>
  </div>

  <!-- RIGHT -->
  <div class="side-col">
    <div class="card summary-right">
      <h4>UAP Glamping Booking Summary</h4>

      <div class="summary-contact">
        <div><i class="fa-solid fa-location-dot"></i> UPSI Glamping Park,
		Kampus Sultan Azlan Shah, 
		Universiti Pendidikan Sultan Idris,
		35900 Tanjong Malim, Perak
		</div><br>
        <div><i class="fa-solid fa-phone"></i> 019-4944306 (En Iskandar)</div><br>
        <div><i class="fa-regular fa-envelope"></i> glamping.uap@upsi.edu.my</div>
      </div>
	  
	  <div id="carriedBooking" class="summary-block">
	  <div><strong>Package:</strong></div>
	  <ul style="margin-top:8px; margin-bottom: 8px;  margin-left: 20px ; padding-left: 0; line-height:2">
	  <?php foreach ($bookingRooms as $row): ?>
	  <li>
	  <?= htmlspecialchars($row['name_package']) ?>
	  (x<?= (int)$row['qty'] ?>)
	  </li>
	  <?php endforeach; ?>

	  </ul>
	  
	  <div><strong>Check-in:</strong> <?= date('d/m/Y', strtotime($booking['booking_date'])) ?></div>
	  <div><strong>Nights:</strong> <?= $booking['days'] ?></div>
	  </div>
	  
      <div class="checkout-box">
        <div class="pay-now" style="background-color:#c3b091">
          <span>Pay Now</span>
          <strong id="payNowPrice">
		  RM <?= number_format($booking['total_payment'], 2) ?>
		  </strong>
        </div>
      </div>
	  
    </div>
  </div>
  
  <!-- ONLINE PAYMENT MODAL -->
<div id="paymentBackdrop" class="modal-backdrop" style="display:none;">
  <div class="modal payment-modal">

    <h3 class="payment-title">YOUR PAYMENT</h3>
	
      <!--QR CODE GLAMPING-->
    <img src="../imej/QRglamping.jpg" class="payment-img" alt="Bank QR">

    <div class="payment-info">
      <p><strong>Bank:</strong> Bank Islam Malaysia Berhad</p>
      <p><strong>Account No:</strong> 08068010003264</p>
      <p><strong>Account Name:</strong>Universiti Pendidikan Sultan Idris</p>
      <p><strong>Reference:</strong> GLAMPING PARK</p>
    </div>

    <div class="payment-total" style="background-color:#c3b091">
      Total Payment:<br>
      <strong>
        RM <?= number_format($booking['total_payment'], 2) ?>
      </strong>
    </div>

    <form method="POST" enctype="multipart/form-data">
      <label class="upload-label">Upload Payment Proof</label>
      <input type="file" name="payment_proof" required>
	  <input type="hidden" name="id_booking" value="<?= $id_booking ?>">


      <div class="modal-actions">
        <button type="submit" name="submit_payment" class="btn-orange">
          Submit Payment
        </button>
        <button type="button" class="btn-outline"
          onclick="document.getElementById('paymentBackdrop').style.display='none'">
          Cancel
        </button>
      </div>
    </form>
  </div>
</div>

  
</div>

<!-- ================= FOOTER (SEBIJIK BOOKING) ================= -->
<footer class="site-footer">
  <div class="footer-inner">
    
    <!-- About -->
    <div class="f-about">
      <img class="footer-logo" src="../imej/logoGlamping2.png" alt="logo">
      <p><strong>UPSI Glamping Park</strong></p>
    <p>We Have the Best Glamping Experience for You!</p>
    </div>

    <!-- Links -->
    <div class="f-links">
      <h5>Explore</h5>
      <a href="index.html">Home</a>
      <a href="package.html">Package</a>
      <a href="login.php">Booking</a>
      <a href="gallery.html">Gallery360</a>
    </div>

    <!-- Contact -->
    <div class="f-info">
      <h5>Contact Us</h5>
      <div><i class="fa-solid fa-phone"></i> 019-4944306 ( En Iskandar)</div>
      <div><i class="fa-regular fa-envelope"></i> Email: glamping.uap@upsi.edu.my</div>
      <div><i class="fa-solid fa-globe"></i> www.uapglamping.com</div>
    
    <div class="footer-social">
    <a href="https://www.facebook.com/share/17PrcpV8zg/?mibextid=wwXIfr"
    target="_blank" class="social-icon facebook">
    <i class="fab fa-facebook-f"></i>
    </a>
    
    <a href="https://www.tiktok.com/@upsi.glamping.park?_r=1&_t=ZS-92MzzxeXY6q"
    target="_blank" class="social-icon tiktok">
    <i class="fa-brands fa-tiktok"></i></i>
    </a></div>
   
    </div>

    <!-- Address -->
    <div class="f-contact">
      <h5>Sales Office</h5>
      <div>
        <i class="fa-solid fa-location-dot"></i> UPSI Glamping Park,<br>
        &nbsp;&nbsp;Kampus Sultan Azlan Shah,<br>
        &nbsp;&nbsp;Universiti Pendidikan Sultan Idris,<br>
        &nbsp;&nbsp;35900 Tanjong Malim, Perak
      </div>
    </div>
  </div>

  <!--  COLLAB LOGOS -->
  <div class="collab-logos">
    <img src="../imej/logoUPSI1.png" alt="Collab 1">
    <img src="../imej/logoPusatKoko.png" alt="Collab 2">
    <img src="../imej/logoAurora.png" alt="Collab 3">
  </div>

  <div class="footer-bottom">
    <small>© UPSI Glamping Park. All Rights Reserved.</small>
		<p>
	<small>Powered by META.</small>
	</p>
  </div>
</footer>

<script>

  const BOOKING_ID = <?= (int)$id_booking ?>;

  const BOOKING_DATA = {
    checkin: <?= json_encode($booking['booking_date']) ?>,
    nights: <?= (int)$booking['days'] ?>,
    total: <?= (float)$booking['total_payment'] ?>
  }
  
const BOOKING_ROOMS = <?= json_encode($bookingRooms, JSON_PRETTY_PRINT); ?>;

</script>
<script src="../javascript/billingGlamping.js"></script>

</body>
</html>
