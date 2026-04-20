/* =========================
   DATE HELPERS (UTC SAFE)
========================= */
function parseISODate(iso) {
  if (!iso) return null;
  const p = iso.split("-");
  return { y: +p[0], m: +p[1], d: +p[2] };
}

function toDateUTC(y, m, d) {
  return new Date(Date.UTC(y, m - 1, d));
}

function addDaysToISO(iso, days) {
  const p = parseISODate(iso);
  const dt = toDateUTC(p.y, p.m, p.d);
  dt.setUTCDate(dt.getUTCDate() + Number(days));
  return dt.toISOString().slice(0, 10);
}

function formatISOToDDMMYYYY(iso) {
  const p = parseISODate(iso);
  return `${String(p.d).padStart(2, "0")}/${String(p.m).padStart(2, "0")}/${p.y}`;
}

function formatCurrency(n) {
  return "RM " + Number(n).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/* =========================
   TOTALS
========================= */
function computeTotalsFromBooking(b) {
  let subtotal = 0;
  (b.rooms || []).forEach(r => {
    subtotal += r.qty * r.nights * r.unitPrice;
  });
  return {
    subtotal,
    totalPayable: b.totalPayable ?? subtotal
  };
}

/* =========================
   REVIEW MODAL
========================= */

function showReviewModal() {

  if (!document.getElementById('acceptTerms').checked) {
    alert('Please accept the Terms and Hotel Policy.');
    return;
  }

  const checkInDate = BOOKING_DATA.checkin;
  const checkOutDate = addDaysToISO(checkInDate, BOOKING_DATA.nights);

  document.getElementById("r_checkin").innerText =
    formatISOToDDMMYYYY(checkInDate);

  document.getElementById("r_checkout").innerText =
    formatISOToDDMMYYYY(checkOutDate);

  document.getElementById("r_nights").innerText = BOOKING_DATA.nights;
  document.getElementById("r_total").innerText =
    BOOKING_DATA.total.toFixed(2);

  // 🔹 RENDER PACKAGE + AVAILABILITY
  const ul = document.getElementById("r_packages");
  ul.innerHTML = "";

  BOOKING_ROOMS.forEach(r => {
    const li = document.createElement("li");
    li.innerText = `${r.name_package} (x${r.qty})`;
    ul.appendChild(li);
  });

  document.getElementById('modalBackdrop').style.display = 'flex';
  
  const elCheckin = document.getElementById("r_checkin");
if (!elCheckin) {
  console.error("Review modal elements not found");
  return;
}

}

/* =========================
  CANCEL
========================= */
document.getElementById('editBookingBtn').onclick = function () {

  if (!confirm("Are you sure you want to cancel this booking?")) return;

  window.location.href =
    "billingGlamping.php?id_booking=" + BOOKING_ID + "&cancel=1";
};

/* =========================
   EVENTS
========================= */
document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("reviewBookingBtn").onclick = showReviewModal;

  const onlineBtn = document.getElementById("onlinePaymentBtn");
  if (onlineBtn) {
    onlineBtn.onclick = () => {
      if (!document.getElementById('acceptTerms').checked) {
        alert("Please accept the Terms & Hotel Policy.");
        return;
      }
      document.getElementById("paymentBackdrop").style.display = "flex";
    };
  }

});


/* =========================
   HEADER SCROLL (BILLING PAGE)
   ========================= */
const header = document.querySelector("header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

// HEADER SCROLL
window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 80);
});

// MOBILE MENU (SAFE)
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("show");
    menuToggle.classList.toggle("active");
  });

/* AUTO CLOSE MOBILE MENU BILA KLIK LINK */
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("show");
    menuToggle.classList.remove("active");
  });
});
}


