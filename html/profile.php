<?php
session_start();
include 'config.php';

// 🔒 Mesti login
if (!isset($_SESSION['email_customer'])) {
    header("Location: login.html");
    exit;
}

$email = $_SESSION['email_customer'];

// Ambil data customer
$sql = "SELECT email_customer, name, gender, mobile, address 
        FROM customer 
        WHERE email_customer = ?";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$customer = mysqli_fetch_assoc($result);

// Jika user tiada dalam DB (rare case)
if (!$customer) {
    die("Customer data not found.");
}
?>

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Profile — UPSI Glamping</title>

  <!-- GLAMPING MASTER STYLE -->
  <link rel="stylesheet" href="../css/glamping.css">

  <!-- PROFILE OVERRIDE -->
  <link rel="stylesheet" href="../css/profile.css">

  <!-- ICON -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body class="profile-page">

<!-- ================= HEADER  ================= -->
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

  <nav>
    <a href="bookingGlamping.php">Booking</a>
    <a href="profile.php"><i class="fa-solid fa-user"></i></a>
    <a href="logout.php"><i class="fa-solid fa-arrow-right-from-bracket"></i></a>
  </nav>

  <div class="menu-toggle">
    <i class="fa-solid fa-bars"></i>
  </div>
</header>

<!-- ================= HERO ================= -->
<section class="profile-hero">
  <div class="hero-text">
    <h1>Profile Details</h1>
  </div>
</section>

<!-- ================= PROFILE CONTENT ================= -->
<main class="profile-container">

  <div class="profile-card">  
  
  <!-- PROFILE HEADER -->
<div class="profile-header">
  <div class="profile-avatar">
    <i class="fa-solid fa-user"></i>
  </div>

  <h2 class="profile-name">
    <?php echo htmlspecialchars($customer['name']); ?>
  </h2>

  <p class="profile-email">
    <?php echo htmlspecialchars($customer['email_customer']); ?>
  </p>
</div>


    <form id="profileForm" novalidate>

      <div class="field">
        <label>Email</label>
        <input type="email" id="email" name="email"
          value="<?php echo htmlspecialchars($customer['email_customer']); ?>"
          readonly>
      </div>

      <div class="field">
        <label>Full Name</label>
        <input type="text" id="name" name="name"
          value="<?php echo htmlspecialchars($customer['name']); ?>"
          readonly>
      </div>

      <div class="field">
        <label>Gender</label>
        <select id="gender" name="gender" disabled>
           <option value="Male"
             <?php if ($customer['gender'] === 'Male') echo 'selected'; ?>>
             Male
           </option>

           <option value="Female"
             <?php if ($customer['gender'] === 'Female') echo 'selected'; ?>>
             Female
           </option>
        </select>

      </div>

      <div class="field">
        <label>Phone Number</label>
        <input type="tel" id="phone" name="phone"
          value="<?php echo htmlspecialchars($customer['mobile']); ?>"
          readonly>
      </div>

      <div class="field">
        <label>Address</label>
        <textarea id="address" name="address" rows="3" readonly><?php echo htmlspecialchars($customer['address']); ?></textarea>
      </div>

      <!-- ACTION -->
      <div class="actions">
        <button type="button" id="editBtn" class="btn btn-edit">Edit Profile</button>
        <button type="button" id="saveBtn" class="btn btn-edit" style="display:none">Save</button>
        <button type="button" id="cancelBtn" class="btn btn-ghost" style="display:none">Cancel</button>
      </div>

      <!-- MESSAGES  -->
      <div id="successMsg" class="message success" style="display:none;">
        Changes saved.
      </div>

      <div id="errorMsg" class="message error" style="display:none;">
        Error saving changes.
      </div>

    </form>
  </div>

</main>

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
    <img src="../imej/logoAurora.png" alt="Collab 2">
    <img src="../imej/logoPusatKoko.png" alt="Collab 3">
  </div>

  <div class="footer-bottom">
    <small>© UPSI Glamping Park. All Rights Reserved.</small>
  </div>
</footer>

<script src="../javascript/profile.js"></script>

<!-- HEADER JS (SEBIJIK BOOKING) -->
<script>
const header = document.querySelector("header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 80);
});

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("show");
});
</script>

</body>
</html>
