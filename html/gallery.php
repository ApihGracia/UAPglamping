<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UPSI Glamping Park | Gallery360</title>

  <!-- Font -->
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">

  <!-- ✅ Guna fail CSS dari folder libs -->
  <link rel="stylesheet" href="../libs/photo-sphere-viewer.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="../css/glamping.css">

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
    <h1>360° Virtual Gallery</h1>
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


<!-- GALLERY CONTENT -->
<section class="gallery-section">
  <h2>Explore UPSI Glamping Park</h2>
  
  <p>Immerse yourself in the authentic glamping experience with our stunning 360° panoramic views.</p>

  <div class="category-buttons">
    <button onclick="showCategory('domeVIP')">VIP Dome</button>
    <button onclick="showCategory('khemahBesar')">Big Tent</button>
    <button onclick="showCategory('khemahKecil')">Small Tent</button>
	<button onclick="showCategory('OutdoorView')">Outdoor View</button>
	
  </div>
<div class="gallery-layout">
  <div id="viewer"></div>
  <div id="thumbnails"></div>
  </div>
</section>

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

<!-- ====== SCRIPT PHOTO SPHERE VIEWER ====== -->
<!-- ✅ Versi lama Three.js supaya serasi -->
<script src="https://cdn.jsdelivr.net/npm/three@0.148.0/build/three.min.js"></script>
<!-- ✅ Tambah uEvent sebab PSV 4.7.2 perlukan -->
<script src="https://cdn.jsdelivr.net/npm/uevent@2.0.0/browser.min.js"></script>
<!-- ✅ Fail PSV yang betul -->
<script src="https://cdn.jsdelivr.net/npm/photo-sphere-viewer@4.7.2/dist/photo-sphere-viewer.min.js"></script>

<script>
/* 🕒 Tunggu SEMUA fail JS dimuat dulu */
window.addEventListener('load', function() {

  // === Navbar Scroll Effect ===
  window.addEventListener("scroll", () => {
    document.querySelector("header").classList.toggle("scrolled", window.scrollY > 80);
  });

  // === Senarai Gambar ===
  const images = {
    domeVIP: ['DomeVIP_1.jpg','DomeVIP_2.jpg','DomeVIP_3.jpg','DomeVIP_4.jpg'],
    khemahBesar: [
      'KhemahBesar_1.jpg'
    ],
    khemahKecil: ['KhemahKecil_4.jpg'],
    OutdoorView: ['KhemahKecil_2.jpg']
  };

  // === Buat Viewer 360 ===
  const viewer = new PhotoSphereViewer.Viewer({
    container: document.getElementById('viewer'),
    panorama: '../imej/DomeVIP_1.jpg',
    navbar: ['zoom', 'fullscreen'],
    mousewheel: true
	
	
  });

  // === Fungsi Tukar Kategori ===
  function showCategory(category) {
    viewer.setPanorama('../imej/' + images[category][0]);
    const thumbs = document.getElementById('thumbnails');
    thumbs.innerHTML = '';

    images[category].forEach(img => {
      const thumb = document.createElement('img');
      thumb.src = '../imej/' + img;
      thumb.onclick = () => viewer.setPanorama('../imej/' + img);
      thumbs.appendChild(thumb);
    });
  }

  // === Load Default Category ===
  showCategory('domeVIP');

  // === Bagi fungsi ni global supaya boleh klik butang HTML ===
  window.showCategory = showCategory;
});

<!-- HEADER JS (SEBIJIK BOOKING) -->
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


