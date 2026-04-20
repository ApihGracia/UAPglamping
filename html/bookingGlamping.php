<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
include 'config.php';

/* ===== CHECK LOGIN ===== */
if (!isset($_SESSION['email_customer'])) {
    header("Location: login.php");
    exit;
}

$email = $_SESSION['email_customer'];

$userType = $_SESSION['user_category'] ?? 'public';

$selectedDate = $_GET['date'] ?? date('Y-m-d');
$nights = (int)($_GET['nights'] ?? 1);

?>

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" >
  <meta name="viewport" content="width=device-width,initial-scale=1" >
  <title>Booking Glamping - UAP Glamping</title>

  <link rel="stylesheet" href="../css/glamping.css">
  <!-- small CSS tweak to make the action buttons inline -->
  <style>
    /* Put Info + Add Room side-by-side, but stack on narrow screens */
    .action-buttons { display:flex; gap:8px; align-items:center; }
    @media (max-width: 600px) {
      .action-buttons { flex-direction:column; width:100%; }
      .action-buttons .btn-info,
      .action-buttons .btn-book { width:100%; }
    }
  </style>

  <!--icon-->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body class="index">

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
    <a href="profile.php"><i class="fa-solid fa-user"></i></a>
    <a href="logout.php"><i class="fa-solid fa-arrow-right-from-bracket"></i></a>
  </nav>

    <!-- MOBILE MENU BUTTON -->
    <div class="menu-toggle">
      <i class="fa-solid fa-bars"></i>
    </div>
	
</header>


  <!-- Hero Search Section -->
  <div class="booking-hero">
    <div class="search-bar">
      <div>
        <label>Check In</label><br/>
        <input id="checkin" type="date" />
      </div>

      <div>
        <label>Nights</label><br/>
        <select id="nights">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
	  
	  <div>
	  <label>User Category</label><br/>
	  <input type="text" value="<?= strtoupper($userType) ?>" readonly>
	  </div>
	  
	  <input type="hidden" id="userType" value="<?= $userType ?>">

      <div style="display:flex;flex-direction:column;">
        <label>&nbsp;</label>
        <button type="button" class="btn-check" id="applySearch">Check Availability</button>

      </div>
    </div>
  </div>

  <!-- MAIN CONTENT -->
  <div class="container">
    <div class="left">
      <div class="filters">
        <button class="filter-btn" id="filterCompare">Compare Rooms</button>
        <button class="filter-btn" id="filterAll">Show All Packages</button>
        <button class="filter-btn" id="filterTent">Type of Tent</button>
        <button class="filter-btn" id="filterSite">Campsite Rental</button>
      </div>

      <div id="noticeArea"></div>

      <div id="rentalsList"></div>
    </div>

    <div class="right">
      <div class="summary">
        <h3>Booking Summary</h3>
        <div id="summaryDates" class="summary-dates">No date selected</div>
        <div id="summaryItems"></div>

        <div class="summary-total">Total: <span id="summaryTotal">RM 0.00</span></div>

        <a id="confirmBooking" class="book-confirm">
		Confirm Booking
		</a>
		
      </div>
    </div>
  </div>

  <!-- INFO MODAL -->
  <div id="modalBackdrop" class="modal-backdrop">
    <div class="modal">
      <span class="close-btn" id="modalClose"></span>
      <div id="modalContent"></div>
    </div>
  </div>

<!--footer-->
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
      <a href="package.html">Accommodation</a>
      <a href="bookingGlamping.html">Booking</a>
      <a href="gallery.html">Gallery</a>
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

<?php
// all package + price
$rentals = [];
// package
$sql = "SELECT * FROM package WHERE is_active = 1";
$selectedDate = $_GET['date'] ?? date('Y-m-d');

$sql = "
SELECT 
  p.*,
  (p.quantity - IFNULL(MAX(pa.booked_qty), 0)) AS available_qty

FROM package p
LEFT JOIN package_availability pa
  ON pa.id_package = p.id_package
  AND pa.book_date BETWEEN ? AND DATE_ADD(?, INTERVAL ? DAY)
WHERE p.is_active = 1
GROUP BY p.id_package
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $selectedDate, $selectedDate, $nights);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
		
		if ((int)$row['is_active'] !== 1) {
        continue; // skip package yang OFF
    }
		
        $id = $row['id_package'];

        $price_sql = "SELECT user_category, day_type, price 
                      FROM price 
                      WHERE id_package = $id";
        $price_result = $conn->query($price_sql);

        $prices = [
            'upsi' => ['weekday'=>0,'weekend'=>0],
            'public' => ['weekday'=>0,'weekend'=>0]
        ];

        if ($price_result->num_rows > 0) {
            while($p = $price_result->fetch_assoc()){
                $prices[$p['user_category']][$p['day_type']] = (float)$p['price'];
            }
        }

        $rentals[] = [
            'id' => $id,
            'title' => $row['name_package'],
            'pax' => $row['capacity'],
            'qty' => max(0, (int)$row['available_qty']),
            'price' => $prices,
            'facilities' => $row['facility'], 
            'img' => '../imej/' . $row['image_package'] 
        ];
    }
}

?>

<!-- ========================================================= -->
<!-- ====================== JAVASCRIPT ======================== -->
<!-- ========================================================= -->
<script>
/* ================= Rental Data ================= */
const COMMON_FACILITIES = [
  'Car Parking',
  'Watching Tower',
  'Toilet',
  'Walkway',
  'Pantry'
];

let rentals = [];

const state = {
  rentals: JSON.parse(JSON.stringify(rentals)),
  compareSet: new Set(),
  summary: [],
  filter: 'all'
};

/* ================= weekend / weekdays ================= */
function isWeekendOrHoliday(dateStr) {
  if (!dateStr) return false;
  const day = new Date(dateStr + "T00:00:00").getDay();
  return (day === 5 || day === 6 || day === 0); // Fri, Sat, Sun
}


function formatCurrency(n) {
  return Number(n).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/*load package*/
function loadPackages() {
  const checkin = document.getElementById('checkin').value;
  const nights = document.getElementById('nights').value;

  fetch(`getPackage.php?date=${checkin}&nights=${nights}`)
    .then(res => res.json())
    .then(data => {
      rentals = data;
      state.rentals = JSON.parse(JSON.stringify(rentals));
      renderRentals();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load latest packages.");
    });
}

/* ================= Render Rentals ================= */
// 🔹 Auto select userType dari server

function renderRentals() {
  const list = document.getElementById('rentalsList');
  list.innerHTML = '';

  const userType = document.getElementById('userType').value;
  const checkin = document.getElementById('checkin').value;
  const weekend = isWeekendOrHoliday(checkin);

  let toRender = state.rentals;
  
  /*filter tent or campsite button*/
if (state.filter === 'tent') {
  toRender = toRender.filter(r => 
    ['dome','big tent','small tent'].some(t =>
      r.title.toLowerCase().includes(t)
    )
  );
} else if (state.filter === 'site') {
  toRender = toRender.filter(r => 
    ['caravan','campsite','camping'].some(t =>
      r.title.toLowerCase().includes(t)
    )
  );
}

  toRender.forEach(r => {
      const unitPrice = weekend
    ? r.price[userType].weekend
    : r.price[userType].weekday;

if (!unitPrice || unitPrice <= 0) return;

  const card = document.createElement('div');
  card.className = 'rental-card'; 

    card.innerHTML = `
      <img src="${r.img || ''}" onerror="this.style.background='#eee';this.style.minHeight='120px';">
      
      <div class="rental-info">
        <div style="display:flex; gap:12px;">
          <div style="flex:1">
            <div class="rental-title">${r.title}</div>
            ${r.pax ? `<div class="meta">Capacity: ${r.pax}</div>` : ''}

            <div class="small-muted">Availability: <strong id="qty-${r.id}">${r.qty}</strong></div>
          </div>

          <div class="price-box">
            <div class="price-large">RM ${formatCurrency(unitPrice)}</div>
            <div class="small-muted">Price / Night</div>
          </div>
        </div>

        <div class="info-area">
          <div style="flex:1;"></div>

          <div class="action-box">
  <label class="compare-checkbox">
    <input type="checkbox" data-id="${r.id}" ${state.compareSet.has(r.id) ? 'checked':''}>
    Add To Compare
  </label>

  <div class="action-buttons">
    <button class="btn-info" onclick="showInfo('${r.id}')">Info</button>
    <button class="btn-book" onclick="bookItem('${r.id}')">Add Room</button>
  </div>
</div>
        </div>
      </div>
    `;

    list.appendChild(card);
  });

  /* Checkbox listener */
  document.querySelectorAll('.compare-checkbox input').forEach(cb=>{
    cb.onchange = (e)=>{
      const id = e.target.getAttribute('data-id');
      if (e.target.checked) state.compareSet.add(id);
      else state.compareSet.delete(id);
    }
  });

  updateSummaryDates();
  renderSummaryItems();
}

/* ================= INFO MODAL ================= */
function showInfo(id) {
  const r = state.rentals.find(x => x.id == id);

  // ===== FIX: convert facility TEXT → ARRAY =====
  let facilityList = [];
  if (r.facilities) {
    facilityList = r.facilities
      .split(/\r?\n/)   // pecahkan ikut line
      .map(f => f.trim())
      .filter(f => f !== '');
  }

  let capacityHTML = '';
  if (r.pax) {
    capacityHTML = `<div class="small-muted">Capacity: ${r.pax}</div>`;
  }

  let quantityHTML = '';
  if (r.qty && r.qty > 0) {
    quantityHTML = `<div class="small-muted">Available Units: ${r.qty}</div>`;
  }

  let facilitiesHTML = '';
  if (facilityList.length > 0) {
    facilitiesHTML = `
      <h5 style="margin-top:15px; color: #000000; letter-spacing: 1px; text-align: center; font-size: 18px">Facilities Provided</h5>
      <ul style="margin-top:10px; padding-left:170px; list-style:disc; color: #000000">
        ${facilityList.map(f => `<li>${f}</li>`).join('')}
      </ul>
    `;
  }

  document.getElementById('modalContent').innerHTML = `
    <h3 style="text-align:center; font-size:25px; color: #000000">${r.title}</h3>

    <div style="text-align:center; margin-bottom:10px;">
      ${capacityHTML}
      ${quantityHTML}
    </div>

    <hr>

    ${facilitiesHTML}

    <div style="text-align:center; margin-top:20px;">
      <button class="btn-book" onclick="closeModal(); bookItem('${r.id}')">Add Room</button>
      <button class="btn-info" onclick="closeModal()">Close</button>
    </div>
  `;

  document.getElementById('modalBackdrop').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modalBackdrop').style.display = 'none';
}

document.getElementById('modalClose').onclick = closeModal;
document.getElementById('modalBackdrop').onclick = function(e){
  if (e.target === this) closeModal();
};

/* ================= Booking Actions ================= */
function bookItem(id) {
	id = Number(id);
  const rental = state.rentals.find(r=>r.id===id);

if (!rental) {
    console.error("Rental not found for id:", id, state.rentals);
    alert("Room data not found. Please refresh the page.");
    return;
  }
  
  if (rental.qty <= 0) return alert("No more units available.");

  const checkin = document.getElementById('checkin').value;
  if (!checkin) return alert("Please select your check-in date first.");

  const nights = Number(document.getElementById('nights').value);
  const userType = document.getElementById('userType').value;
  const weekend = isWeekendOrHoliday(checkin);
  const unitPrice = weekend ? rental.price[userType].weekend : rental.price[userType].weekday;

  const existing = state.summary.find(s=>s.id===id);
  if (existing) {
    existing.qty++;
    existing.subtotal = existing.qty * existing.unitPrice * existing.nights;
  } else {
    state.summary.push({
      id,
      title: rental.title,
      qty: 1,
      nights,
      unitPrice,
      subtotal: unitPrice * nights
    });
  }

  rental.qty--;
  document.getElementById('qty-'+id).textContent = rental.qty;

  renderSummaryItems();
}


/* ================= Summary Handling ================= */
function renderSummaryItems() {
  const container = document.getElementById('summaryItems');
  container.innerHTML = '';

  let total = 0;

  if (state.summary.length === 0) {
    container.innerHTML = `<div class="small-muted">No Rooms Selected</div>`;
  } else {
    state.summary.forEach(s=>{
      total += s.subtotal;

      container.innerHTML += `
        <div class="summary-item">
          <div class="left">
            <div style="font-weight:700;">${s.title}</div>
            <div class="small-muted" style="margin-top:6px;">
              ${s.qty} x Night(s): ${s.nights} • RM ${formatCurrency(s.unitPrice)}
            </div>

            <div class="summary-controls">
              <button onclick="decrementSummary('${s.id}')">−</button>
              <button onclick="incrementSummary('${s.id}')">+</button>
              <button class="btn-trash" onclick="removeSummary('${s.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>

          <div class="right">
            <strong>RM ${formatCurrency(s.subtotal)}</strong>
          </div>
        </div>
      `;
    });
  }

  document.getElementById('summaryTotal').innerText = "RM " + formatCurrency(total);
}

function incrementSummary(id) {
	id = Number(id);
  const s = state.summary.find(x=>x.id===id);
  const rental = state.rentals.find(x=>x.id===id);

  if (!s || !rental) {
    console.warn("Invalid state on increment", id);
    return;
  }

  if (rental.qty <= 0) return alert("No more units available.");

  s.qty++;
  rental.qty--;
  s.subtotal = s.qty * s.unitPrice * s.nights;

const qtyEl = document.getElementById('qty-' + id);
if (qtyEl) qtyEl.textContent = rental.qty;

  renderSummaryItems();
}

function decrementSummary(id) {
	id = Number(id);
  const s = state.summary.find(x=>x.id===id);
  const rental = state.rentals.find(x=>x.id===id);

  if (!s || !rental) {
    console.warn("Invalid state on decrement", id);
    return;
  }

  s.qty--;
  rental.qty++;

  if (s.qty <= 0) {
    state.summary = state.summary.filter(x=>x.id!==id);
  } else {
    s.subtotal = s.qty * s.unitPrice * s.nights;
  }

  const qtyEl = document.getElementById('qty-' + id);
if (qtyEl) qtyEl.textContent = rental.qty;

  renderSummaryItems();
}

function removeSummary(id) {
	id = Number(id);
  const s = state.summary.find(x=>x.id===id);
  const rental = state.rentals.find(x=>x.id===id);

  if (!s || !rental) {
    console.warn("Invalid state on remove", id);
    state.summary = state.summary.filter(x=>x.id!==id);
    renderSummaryItems();
    return;
  }

  rental.qty += s.qty;
  state.summary = state.summary.filter(x=>x.id!==id);

  const qtyEl = document.getElementById('qty-' + id);
if (qtyEl) qtyEl.textContent = rental.qty;

  renderSummaryItems();
}

/* ================= Summary Dates ================= */
function updateSummaryDates() {
  const checkin = document.getElementById('checkin').value;
  const nights = Number(document.getElementById('nights').value);
  const el = document.getElementById('summaryDates');

  if (!checkin) return el.textContent = 'No date selected';

  const start = new Date(checkin + 'T00:00:00');
  const end = new Date(start);
  end.setDate(start.getDate() + nights);

  function fmt(d){ return d.toLocaleDateString('en-GB'); }
  el.textContent = `${fmt(start)} - ${fmt(end)}`;
}

/* ================= Compare Rooms ================= */
document.getElementById('filterCompare').onclick = function(){
  if (state.compareSet.size < 2) {
    return showNotice("Please select at least 2 room types to compare.", true);
  }

  const ids = Array.from(state.compareSet);

  const items = ids.map(id => {
    const rid = Number(id); // 🔑 FIX TYPE
    const r = state.rentals.find(x => x.id === rid);

    if (!r || !r.price) {
      console.warn("Compare skipped invalid room id:", id);
      return '';
    }

    const userType = document.getElementById('userType').value;
    const weekend = isWeekendOrHoliday(document.getElementById('checkin').value);
    const price = r.price[userType]?.[weekend ? 'weekend' : 'weekday'] ?? 0;

    return `
      <div style="padding:10px 0; border-bottom:1px solid #eee; color:#000; text-align:center;">
        <div style="font-weight:700; font-size:20px;">
          ${r.title}
        </div>
        <div class="small-muted">Capacity: ${r.pax ?? '-'}</div>
        <div class="small-muted">Available Units: ${r.qty}</div>
        <div class="small-muted">
          RM ${formatCurrency(price)} / night
        </div>
      </div>
    `;
  }).filter(Boolean).join('');

  if (!items) {
    return showNotice("Selected rooms are no longer available for comparison.", true);
  }

  document.getElementById('modalContent').innerHTML = `
    <h4 style="font-weight:700; font-size:30px; color:#a89478; letter-spacing:1px;">
      COMPARE ROOMS
    </h4>
    <div style="text-align:justify;">${items}</div>
    <div style="text-align:center; margin-top:12px;">
      <button class="btn-info" onclick="closeModal()">Close</button>
    </div>
  `;

  document.getElementById('modalBackdrop').style.display = 'flex';

function clearCompare() {
  state.compareSet.clear();
}

document.getElementById('filterAll').onclick = ()=>{ clearCompare(); state.filter='all'; renderRentals(); };
document.getElementById('filterTent').onclick = ()=>{ clearCompare(); state.filter='tent'; renderRentals(); };
document.getElementById('filterSite').onclick = ()=>{ clearCompare(); state.filter='site'; renderRentals(); };
};

/* ================= Notice ================= */
function showNotice(msg, autoHide){
  const area = document.getElementById('noticeArea');
  area.innerHTML = `<div class="notice">${msg}</div>`;
  if (autoHide) setTimeout(()=> area.innerHTML = '', 5000);
}

/* ================= Initialization ================= */
document.getElementById('applySearch').onclick = function(){
  const checkin = document.getElementById('checkin').value;
  const nights = document.getElementById('nights').value;

  if (!checkin) {
    alert("Please select your check-in date.");
    return;
  }

loadPackages();
updateSummaryDates();

};


document.getElementById('filterAll').onclick = ()=>{ state.filter='all'; renderRentals(); showNotice('Showing all packages', true); };
document.getElementById('filterTent').onclick = ()=>{ state.filter='tent'; renderRentals(); showNotice('Filter: Type of Tent', true); };
document.getElementById('filterSite').onclick = ()=>{ state.filter='site'; renderRentals(); showNotice('Filter: Campsite & Caravan', true); };

document.getElementById('nights').onchange = updateSummaryDates;
document.getElementById('checkin').onchange = updateSummaryDates;
document.getElementById('userType').onchange = renderRentals;

/* =========================
   UPDATED: confirmBooking handler
   ========================= */
document.getElementById('confirmBooking').onclick = function () {

  if (state.summary.length === 0) {
    alert("No rooms selected.");
    return;
  }

  const checkin = document.getElementById('checkin').value;
  const nights = Number(document.getElementById('nights').value);

  const payload = {
  booking_date: checkin,
  days: nights,
  rooms: state.summary, // SEMUA ROOM
  total_payment: state.summary.reduce((sum, s) => sum + s.subtotal, 0)
};

  fetch("saveBooking.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      window.location.href = "billingGlamping.php?id_booking=" + data.id_booking;
    } else {
      alert("Failed to create booking.");
    }
  })
  .catch(err => {
    console.error(err);
    alert("Error saving booking.");
  });
};


/* =========================
   RESTORE logic — run on page load
   ========================= */
(function tryRestoreFromBilling(){
  try {
    const editingFlag = localStorage.getItem('editingBooking');
    if (!editingFlag) return;

    const sel = JSON.parse(localStorage.getItem('selectedBooking') || 'null');
    if (!sel || !sel.rooms) {
      localStorage.removeItem('editingBooking');
      return;
    }

    // restore date and nights
    if (sel.checkin) document.getElementById('checkin').value = sel.checkin;
    if (sel.nights) document.getElementById('nights').value = String(sel.nights);

    // reset state
    state.rentals = JSON.parse(JSON.stringify(rentals)); // fresh copy
    state.summary = [];

    // for each saved room, add to state.summary and decrement availability from rentals
    sel.rooms.forEach(item => {
      const id = item.id;
      const qty = Number(item.qty || 0);
      const nights = Number(item.nights || sel.nights || 1);
      const unitPrice = Number(item.unitPrice || 0);
      const rentalObj = state.rentals.find(r => r.id === id);

      // push into summary
      state.summary.push({
        id: id,
        title: item.title || (rentalObj ? rentalObj.title : id),
        qty: qty,
        nights: nights,
        unitPrice: unitPrice,
        subtotal: qty * nights * unitPrice
      });

      // decrement availability in rentals list to match selection
      if (rentalObj) {
        rentalObj.qty = Math.max(0, rentalObj.qty - qty);
      }
    });

    // update qty displays (if rentals are already rendered)
    // ensure rentals are (re)rendered so qty elements exist
    renderRentals();

    // render summary items & update dates
    renderSummaryItems();
    updateSummaryDates();

    // remove flag so we don't restore next time automatically
    localStorage.removeItem('editingBooking');

    showNotice('Your previous selection has been restored for editing.', true);
  } catch(err) {
    console.warn('Error during restore from billing:', err);
    localStorage.removeItem('editingBooking');
  }
})();

/* Auto init */
(function(){
  const urlParams = new URLSearchParams(window.location.search);
  const date = urlParams.get('date');
  const nights = urlParams.get('nights');

  if (date) document.getElementById('checkin').value = date;
  if (nights) document.getElementById('nights').value = nights;

  loadPackages();

})();


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
