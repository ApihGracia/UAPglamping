<?php
include 'config.php';

$activitySql = "
SELECT 
  name_activity,
  detail_activity,
  price_activity,
  image1
FROM activity
WHERE is_active = 1
ORDER BY id_activity
";
$activityResult = mysqli_query($conn, $activitySql);

$sql = "
SELECT 
  p.id_package,
  p.name_package,
  p.description,
  p.facility,
  p.capacity,
  p.image_package,
  p.image_package1,
  p.image_package2,

  MAX(CASE WHEN pr.user_category='upsi' AND pr.day_type='weekday' THEN pr.price END) AS upsi_weekday,
  MAX(CASE WHEN pr.user_category='upsi' AND pr.day_type='weekend' THEN pr.price END) AS upsi_weekend,

  MAX(CASE WHEN pr.user_category='public' AND pr.day_type='weekday' THEN pr.price END) AS public_weekday,
  MAX(CASE WHEN pr.user_category='public' AND pr.day_type='weekend' THEN pr.price END) AS public_weekend

FROM package p
LEFT JOIN price pr ON pr.id_package = p.id_package
WHERE p.is_active = 1
GROUP BY p.id_package
ORDER BY p.id_package
";

$result = mysqli_query($conn, $sql);

?>

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Packages — UAP Glamping</title>

  <link rel="stylesheet" href="../css/glamping.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <!-- Font -->
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">

</head>

<body class="index">

<!-- HERO -->
<section class="hero" id="home">
  <!-- VIDEO BACKGROUND -->
  <video autoplay muted loop playsinline>
    <source src="../imej/bookingVid.mp4" type="video/mp4">
    Your Browser does not support video.
  </video>
  <div class="hero-text">
    <h1>Our Package</h1>

    <p id="changingText">Discover our comfortable and well-designed glamping rooms.</p>
  </div>

  </div>
</section>

<!-- Header -->
<header>
  <div class="logo">
    <a href="#home">
      <img src="../imej/logoGlamping2.png" alt="UPSI Glamping Park">
    </a>
    <div class="logo-text">
      <span class="logo-line1">UPSI</span>
      <span class="logo-line2">GLAMPING PARK</span>
    </div>
  </div>

  <nav>
    <a href="index.php#home">Home</a>
      <a href="index.php#about">About</a>
      <a href="index.php#activities">Activities</a>
      <a href="package.php">Package</a>
      <a href="gallery.php">Gallery360</a>
      <a href="review.php">Review</a>
      <a href="login.html" class="book-btn">Book Now</a>
  </nav>
  
    <!-- MOBILE MENU BUTTON -->
    <div class="menu-toggle">
      <i class="fa-solid fa-bars"></i>
    </div>
</header>


  <!-- HERO -->
  <section class="hero-outer">
    <div class="hero-inner">
      <h1>CHOOSE YOUR EXPERIENCE</h1>
      <p class="lead">Choose between flexible weekday room packages or our all-inclusive weekend full-board experience. Toggle to compare prices.</p>

      <div class="toggle-wrap" role="tablist" aria-label="pricing toggle">
        <button class="toggle-btn active" data-mode="weekdays">WEEKDAYS (MON–THU)</button>
        <button class="toggle-btn" data-mode="weekends">WEEKENDS (FRI–SUN)</button>
      </div>
      <div class="rate-note">Room night basis</div>
    </div>
  </section>

  <!-- MAIN -->
  <main class="wrap" data-default-mode="weekdays">

    <!-- LEFT: packages stack -->
    <section class="left-col">
 <section class="packages-stack">

<?php while ($row = mysqli_fetch_assoc($result)) { ?>


  <article class="package">
<div class="left">

  <?php
    $images = [];

if (!empty($row['image_package'])) {
  $images[] = "../imej/" . $row['image_package'];
}
if (!empty($row['image_package1'])) {
  $images[] = "../imej/" . $row['image_package1'];
}
if (!empty($row['image_package2'])) {
  $images[] = "../imej/" . $row['image_package2'];
}
  ?>

  <?php if (!empty($images)) { ?>
    <div class="carousel" data-images='<?php echo json_encode($images); ?>'>
      <button class="cprev" aria-label="previous">‹</button>
      <div class="cslides" role="list"></div>
      <button class="cnext" aria-label="next">›</button>
      <div class="cdots" aria-hidden="true"></div>
    </div>
	
  <?php } else { ?>
    <div style="width:100%; height:250px; background:#eee; border-radius:16px; display:flex; align-items:center; justify-content:center;">
      <span>No image</span>
    </div>
  <?php } ?>
  
</div>

    <div class="right">
      <div class="title-row">
  <h2 class="pkg-title"><?php echo $row['name_package']; ?></h2>

  <?php if (!empty($row['capacity'])) { ?>
    <div class="pax"><?php echo $row['capacity']; ?> pax</div>
  <?php } ?>
</div>

<?php if (!empty($row['description'])) { ?>
  <p class="pkg-desc">
    <?php echo $row['description']; ?>
  </p>
<?php } ?>
  
	 <div class="price-row">

  <!-- UPSI -->
  <div class="price-col">
    <div class="col-title">UPSI Citizens</div>
    <div 
      class="price-val"
      data-weekdays="RM <?php echo number_format($row['upsi_weekday'], 0); ?>"
      data-weekends="RM <?php echo number_format($row['upsi_weekend'], 0); ?>"
    >
      RM <?php echo number_format($row['upsi_weekday'], 0); ?>
    </div>
  </div>

  <!-- PUBLIC -->
  <div class="price-col">
    <div class="col-title">Government / Agencies / Public</div>
    <div 
      class="price-val"
      data-weekdays="RM <?php echo number_format($row['public_weekday'], 0); ?>"
      data-weekends="RM <?php echo number_format($row['public_weekend'], 0); ?>"
    >
      RM <?php echo number_format($row['public_weekday'], 0); ?>
    </div>
  </div>

</div>

	 <h4>Facilities</h4>

     <ul class="facilities">
       <?php
        if (!empty($row['facility'])) {
           $facilities = preg_split("/\r\n|\n|\r/", $row['facility']);
           foreach ($facilities as $f) {
              echo '<li>' . trim($f) . '</li>';
          }
        }
       ?>
     </ul>
 
    </div>
  </article>

<?php } ?>

</section>

    </section>

    <!-- RIGHT: add-on activities -->
    <aside class="right-col">
      <div class="addons-panel" id="addonsPanel" aria-labelledby="addonsTitle">
        <h3 id="addonsTitle">Add-On Activities</h3>

        <div class="addons-inner">

<?php while ($act = mysqli_fetch_assoc($activityResult)) {?>

  <div class="addon-item">
    <img src="../imej/activity/<?php echo $act['image1']; ?>" alt="<?php echo $act['name_activity']; ?>">
    <h4><?php echo $act['name_activity']; ?></h4>

<p class="addon-desc">
  <?php echo $act['detail_activity']; ?>
</p>

<div class="addon-price">
  <strong>Price: RM <?php echo number_format($act['price_activity'], 0);?> </strong>
</div>
  </div>
  
<?php } ?>
      
	  <div class="addon-preference-box">
  <h4 class="addon-preference-title">Preferences</h4>
  <p class="addon-preference-text">
    Any additional activities offered by the glamping will be arranged in person 
    at the registration counter on your check-in day.
  </p>
</div>


</div>

      </div>
    </aside>

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
      <div><i class="fa-solid fa-phone"></i> 019-4944306 (En Iskandar)</div>
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
		<p>
	<small>Powered by META.</small>
	</p>
  </div>
</footer>

  <script src="../javascript/package.js"></script>
  

</body>
</html>
