<?php
session_start();
include 'config.php';

// Jika tiada user login, pastikan sesi kosong
if (!isset($_SESSION['email_customer'])) {
    session_unset(); // buang semua data sesi
    session_destroy(); // padam sesi sepenuhnya
}

// Sekarang baru buat query paparan review
$sql = "
SELECT r.*, c.name AS customer_name
FROM review r
JOIN customer c ON r.email_customer = c.email_customer
ORDER BY r.review_date DESC
";
$result = mysqli_query($conn, $sql);
?>


<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UPSI Glamping Park | Review</title>

   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <!-- Font -->
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/glamping.css">

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UPSI Glamping Park | Review</title>

  <!-- Font -->
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/glamping.css">

 
  <style>
    /* ======= REVIEW PAGE SECTION ======= */
    .review-section {
      background: #fff;
      color: #333;
      padding: 50px 20px 120px;
      text-align: center;
    }
    .review-section h2 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 3rem;
      color: #a89478;
      margin-bottom: 60px;
      letter-spacing: 2px;
    }

    /* ===== BUTTON ADD REVIEW ===== */
    .add-review-btn {
      background: #a89478;
      color: white;
      padding: 12px 30px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 50px;
      transition: 0.3s;
    }
    .add-review-btn:hover {
      background: #8c7a63;
      transform: scale(1.05);
    }

#reviewModal {
  position: fixed;
  inset: 0;                 /* top:0; right:0; bottom:0; left:0 */
  z-index: 9999;
  display: none;            /* ❗ default sembunyi */
  align-items: center;
  justify-content: center;
  background: transparent !important; /* lapisan kelabu penuh */
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-shadow: none !important;
  backdrop-filter: none !important; /* elak efek blur */
  filter: none !important;          /* elak kesan cahaya belakang */
}

#reviewModal.show {
  display: flex;
}
    .modal-content {
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      margin: 0;
      text-align: center;
   box-shadow: none !important;    /* pastikan tiada shadow langsung */
  animation: none !important;
  position: relative;
}

#reviewModal * {
  box-shadow: none !important;
  background-image: none !important;
} 
/* bila modal buka → matikan shadow dan gradient page belakang */
body.index.modal-open,
body.index.modal-open *:not(#reviewModal):not(#reviewModal *) {
  box-shadow: none !important;
  filter: none !important;
  background-image: none !important;
}

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-content h2 {
      color: #a89478;
      margin-bottom: 20px;
      font-family: 'Bebas Neue', sans-serif;
    }

    .modal-content textarea,
    .modal-content select {
      width: 100%;
      padding: 12px;
      margin: 15px 0;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 15px;
    }

    .modal-content button {
      background: #a89478;
      color: white;
      padding: 12px 30px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: 0.3s;
    }
    .modal-content button:hover {
      background: #8c7a63;
      transform: scale(1.05);
    }

    .close {
      float: right;
      font-size: 24px;
      cursor: pointer;
      color: #555;
    }
    .close:hover {
      color: #000;
    }

    /* ===== REVIEW CARD ===== */
    .review-cards {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 30px;
      max-width: 1200px;
      margin: auto;
    }

    .review-card {
      background: #f9f9f9;
      border-radius: 15px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      padding: 30px;
      width: 300px;
      text-align: left;
      transition: transform 0.3s ease;
    }

    .review-card:hover {
      transform: scale(1.05);
    }

    .review-card h3 {
      font-size: 1.2rem;
      color: #a89478;
      margin-bottom: 10px;
    }

    .review-card p {
      color: #555;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 10px;
    }

    .stars {
      color: #f4c542;
      margin-bottom: 5px;
    }

    @media (max-width: 768px) {
      .modal-content {
        margin: 20% auto;
         padding: 20px;
      }
      .review-card {
        width: 90%;
      }
    }
	html, body {
  overflow-x: hidden; /* buang scrollbar putih tepi kanan */
}

  </style>
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
    <h1>Review</h1>
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



  <!-- REVIEW SECTION -->
  <section class="review-section">
    <h2>Reviews</h2>
	<!-- ADD REVIEW BUTTON -->
<!-- NOTE: Nanti backend akan CHECK login di sini -->
<button class="add-review-btn" onclick="openReviewForm()">Add Review</button>



  <div class="review-cards">

<?php while($row = mysqli_fetch_assoc($result)) { ?>
  <div class="review-card">
    <h3><?php echo htmlspecialchars($row['customer_name']); ?></h3>


	<?php if (!empty($row['gambar'])): ?>
  <img src="../<?php echo htmlspecialchars($row['gambar']); ?>" alt="Review image" style="width:100%; border-radius:10px; margin-top:10px;">
<?php endif; ?>


    <div class="stars">
      <?php
      for ($i = 1; $i <= 5; $i++) {
        echo ($i <= $row['rating']) ? "&#9733;" : "&#9734;";
      }
      ?>
	  
	  
    </div>

    <p><?php echo htmlspecialchars($row['comment']); ?></p>
    <small><?php echo date("d M Y", strtotime($row['review_date'])); ?></small>
  </div>
<?php } ?>

</div>

  </section>
  <!-- ================= ADD REVIEW MODAL ================= -->
<!-- NOTE DATABASE:
     Table: reviews
     - id
     - user_id
     - komen
     - rating
     - tarikh
-->
<div id="reviewModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeReviewForm()">&times;</span>

    <h2>Write your Review</h2>

    <!-- NOTE BACKEND:
         action nanti ? save_review.php
    -->
<form id="reviewForm" method="POST" action="save_review.php" enctype="multipart/form-data" onsubmit="return checkLoginBeforeSubmit()">

  <textarea name="comment" required
    placeholder="Share your experience at UPSI Glamping Park"></textarea>
	<label for="gambar">Upload your image (optional):</label>
<input type="file" name="gambar" accept="image/*">


  <select name="rating" required>
<option value="5">&#9733;&#9733;&#9733;&#9733;&#9733;</option>
<option value="4">&#9733;&#9733;&#9733;&#9733;&#9734;</option>
<option value="3">&#9733;&#9733;&#9733;&#9734;&#9734;</option>
<option value="2">&#9733;&#9733;&#9734;&#9734;&#9734;</option>
<option value="1">&#9733;&#9734;&#9734;&#9734;&#9734;</option>

  </select>

  <button type="submit">Submit</button>
</form>

  </div>
</div>

<!-- ================= FOOTER  ================= -->
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
  <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
  <script>
    // Header scroll effect
    window.addEventListener("scroll", function() {
      const header = document.querySelector("header");
      header.classList.toggle("scrolled", window.scrollY > 80);
    });
	
function openReviewForm() {
  const modal = document.getElementById("reviewModal");
  modal.classList.add("show");
  document.body.classList.add("modal-open"); 
}

function closeReviewForm() {
  const modal = document.getElementById("reviewModal");
  modal.classList.remove("show");
  document.body.classList.remove("modal-open"); 
}


function checkLoginBeforeSubmit() {
  
  const isLoggedIn = <?php echo isset($_SESSION['email_customer']) ? 'true' : 'false'; ?>;

  if (!isLoggedIn) {
    alert("Please login before write your review.");
    window.location = "login.html?next=review";
    return false; 
  }
  return true; 
}

/* =========================
   HEADER & MOBILE NAV 
========================= */
const header = document.querySelector("header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

/* SOLID BLACK */
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

/* AUTO CLOSE MOBILE MENU */
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("show");
    menuToggle.classList.remove("active");
  });
});
</script>

</body>
</html>

