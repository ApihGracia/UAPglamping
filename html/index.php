<?php
include '../html/config.php';

// Ambil semua aktiviti dari database
$sqlActivity = "SELECT * FROM activity WHERE is_active = 1";
$activities = mysqli_query($conn, $sqlActivity);

// Semak kalau query gagal
if (!$activities) {
    die("Ralat SQL: " . mysqli_error($conn));
}
?>

<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UPSI Glamping Park</title>

  <!-- MAIN CSS -->
  <link rel="stylesheet" href="glamping.css">
  <!-- Font -->
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">

  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body class="index">

<!-- ================= HERO / HOME ================= -->
<section class="hero" id="home">

  <!-- Background Video -->
  <video autoplay muted loop playsinline>
    <source src="../imej/bookingVid.mp4" type="video/mp4">
    Your browser does not support video.
  </video>

  <!-- ================= HEADER / NAVBAR ================= -->
  <header>

    <!-- LOGO -->
    <div class="logo">
      <a href="#home">
        <img src="../imej/logoGlamping2.png" alt="UPSI Glamping Park">
      </a>
      <div class="logo-text">
        <span class="logo-line1">UPSI</span>
        <span class="logo-line2">GLAMPING PARK</span>
      </div>
    </div>

    <!-- NAV -->
    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#activities">Activities</a>
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

  <!-- HERO TEXT -->
  <div class="hero-text">
    <h1>Welcome to UPSI Glamping Park</h1>
    <p id="changingText">We Have the Best Glamping Experience</p>
  </div>

</section>

<!-- ================= ABOUT ================= -->
<section id="about">
  <?php include '../html/aboutGlamping.html'; ?>
</section>


<main id="activities">
  <!-- HERO-STYLE TAJUK ACTIVITIES -->
  <div class="hero-about">
    <h1 style="letter-spacing:1px;">ACTIVITY AT UPSI GLAMPING PARK</h1>
  </div>

<?php while($act = mysqli_fetch_assoc($activities)) { ?>
  <div class="activity" style="margin-bottom:80px; text-align:center;">
    <!-- Tajuk Aktiviti -->
    <h2 style="
      font-family:'Bebas Neue',sans-serif; 
      color:#a89478; 
      font-size:2.3rem; 
      margin-bottom:20px;
      letter-spacing:1px;">
      <?= htmlspecialchars($act['name_activity']); ?>
    </h2>

    <!-- Gambar Carousel -->
    <div class="carousel ummi-carousel" id="carousel-<?= $act['id_activity']; ?>" 
         style="position:relative; max-width:550px; margin:0 auto 20px; overflow:hidden; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      <div class="carousel-images" style="display:flex; transition:transform 0.5s ease-in-out;">
        <?php if(!empty($act['image1'])) { ?>
          <img src="../imej/activity/<?= $act['image1']; ?>" style="width:100%; height:320px; object-fit:cover; flex-shrink:0;">
        <?php } ?>
        <?php if(!empty($act['image2'])) { ?>
          <img src="../imej/activity/<?= $act['image2']; ?>" style="width:100%; height:320px; object-fit:cover; flex-shrink:0;">
        <?php } ?>
        <?php if(!empty($act['image3'])) { ?>
          <img src="../imej/activity/<?= $act['image3']; ?>" style="width:100%; height:320px; object-fit:cover; flex-shrink:0;">
        <?php } ?>
      </div>

      <!-- Butang navigasi -->
      <button class="prev" onclick="prevSlide('<?= $act['id_activity']; ?>')" 
              style="position:absolute;top:50%;left:10px;transform:translateY(-50%);
                     background:#a89478;border:none;color:white;font-size:2rem;
                     border-radius:50%;width:45px;height:45px;cursor:pointer;">&#10094;</button>
      <button class="next" onclick="nextSlide('<?= $act['id_activity']; ?>')" 
              style="position:absolute;top:50%;right:10px;transform:translateY(-50%);
                     background:#a89478;border:none;color:white;font-size:2rem;
                     border-radius:50%;width:45px;height:45px;cursor:pointer;">&#10095;</button>
    </div>

    <!-- Keterangan & Harga -->
    <div style="max-width:700px; margin:0 auto; text-align:center;">
      <p style="color:#555; line-height:1.6; margin-bottom:8px;">
        <?= nl2br(htmlspecialchars($act['detail_activity'])); ?>
      </p>
      <p style="font-weight:bold; color:#333;">
        Price: RM<?= number_format($act['price_activity'], 2); ?> per person
      </p>
    </div>
  </div>
<?php } ?>


</main>

<script>
const sliders = {};

function nextSlide(id) {
  const carousel = document.querySelector(`#carousel-${id} .carousel-images`);
  const total = carousel.children.length;
  sliders[id] = sliders[id] === undefined ? 0 : sliders[id];
  sliders[id]++;
  if (sliders[id] >= total) sliders[id] = 0;
  carousel.style.transform = `translateX(-${sliders[id]*100}%)`;
}

function prevSlide(id) {
  const carousel = document.querySelector(`#carousel-${id} .carousel-images`);
  const total = carousel.children.length;
  sliders[id] = sliders[id] === undefined ? 0 : sliders[id];
  sliders[id]--;
  if (sliders[id]<0) sliders[id]=total-1;
  carousel.style.transform = `translateX(-${sliders[id]*100}%)`;
}
</script>


  <script>
  const sliders = {};
  function nextSlide(id) {
    const carousel = document.querySelector(`#carousel-${id} .carousel-images`);
    const total = carousel.children.length;
    sliders[id] = sliders[id] === undefined ? 0 : sliders[id];
    sliders[id]++;
    if (sliders[id] >= total) sliders[id] = 0;
    carousel.style.transform = `translateX(-${sliders[id] * 100}%)`;
  }
  function prevSlide(id) {
    const carousel = document.querySelector(`#carousel-${id} .carousel-images`);
    const total = carousel.children.length;
    sliders[id] = sliders[id] === undefined ? 0 : sliders[id];
    sliders[id]--;
    if (sliders[id] < 0) sliders[id] = total - 1;
    carousel.style.transform = `translateX(-${sliders[id] * 100}%)`;
  }
  </script>
</section>

<!-- MAP FULLWIDTH -->
<section id="map-fullwidth">
  <div class="map-container map-fullwidth">
    <iframe 
      class="map-iframe"
      src="https://maps.google.com/maps?hl=en&q=upsi%20glamping&t=&z=14&ie=UTF8&iwloc=B&output=embed"
      loading="lazy"
      allowfullscreen>
    </iframe>
  </div>
</section>

<!-- ================= FOOTER ================= -->
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

<!-- ================= SCRIPT ================= -->
<script>
/* =========================
   HEADER & MOBILE NAV
========================= */
const header = document.querySelector("header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

/* NAVBAR JADI HITAM BILA SCROLL */
window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* TOGGLE MOBILE MENU */
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("show");
  menuToggle.classList.toggle("active");
});

/* AUTO CLOSE BILA KLIK LINK */
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("show");
    menuToggle.classList.remove("active");
  });
});

/* =========================
   HERO TYPING EFFECT
========================= */
const texts = [
  "The Best Glamping Experience at UPSI",
  "Affordable and Worth the Price",
  "A Variety of Activities Await You",
  "Memories You’ll Never Forget"
];

let index = 0;
let charIndex = 0;
let deleting = false;
const textEl = document.getElementById("changingText");

function typeEffect() {
  const current = texts[index];
  textEl.textContent = current.substring(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex++;
  } else if (deleting && charIndex > 0) {
    charIndex--;
  } else {
    deleting = !deleting;
    if (!deleting) index = (index + 1) % texts.length;
  }
  setTimeout(typeEffect, deleting ? 60 : 100);
}

setTimeout(typeEffect, 800);
</script>

</body>
</html>
