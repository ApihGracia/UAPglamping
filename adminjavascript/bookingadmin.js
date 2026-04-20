let allBookings = [];
let filterFromMonth = "";
let filterToMonth = "";

/* =========================
   INIT PAGE
========================= */
document.addEventListener("DOMContentLoaded", () => {

  // Sidebar highlight
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
    if (item.dataset.page === "bookings") {
      item.classList.add("active");
    }
  });

  // Fetch bookings (READ ONLY)
  fetch("../api/booking.php")
    .then(res => res.json())
    .then(data => {
      console.log("BOOKINGS:", data);
      allBookings = Array.isArray(data) ? data : [];
      renderBookings();
    })
    .catch(err => {
      console.error("Booking fetch error:", err);
    });

  restoreProfilePhoto();

  // 🔴 WAJIB: bind export di sini
  bindExportBookingPdf();
});

/* =========================
   RENDER TABLE
========================= */
function renderBookings() {
  const container = document.getElementById("bookingsTableContainer");
  if (!container) return;

  let bookings = [...allBookings];

  /* ===== FILTER BULAN ===== */
  if (filterFromMonth || filterToMonth) {
    bookings = bookings.filter(b => {
      if (!b.booking_date) return false;
      const rowMonth = b.booking_date.slice(0, 7);
      if (filterFromMonth && rowMonth < filterFromMonth) return false;
      if (filterToMonth && rowMonth > filterToMonth) return false;
      return true;
    });
  }

  /* ===== EMPTY STATE ===== */
  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📅</div>
        <p class="empty-state-text">No bookings yet</p>
      </div>`;
    return;
  }

  /* ===== TABLE OUTPUT ===== */
  container.innerHTML = `
    <table class="data-table">
      <thead>
  <tr>
    <th>ID</th>
    <th>Email</th>
    <th>Name</th>
    <th>Packages</th>
    <th>Check-in</th>
    <th>Days</th>
    <th>Quantity</th>
    <th>Total (RM)</th>
    <th>Payment Proof</th>
  </tr>
</thead>

	  
      <tbody>
  ${bookings.map(b => `
    <tr>
      <td class="col-id">${b.id_booking ?? "-"}</td>
      <td class="col-email">${b.email_customer ?? "-"}</td>
      <td>${b.customer_name ?? "-"}</td>
      <td>${b.package_list ?? "-"}</td>
      <td>${b.booking_date ?? "-"}</td>
      <td>${b.days ?? "-"}</td>
      <td>${b.total_qty ?? "-"}</td>
      <td>${b.total_payment ? Number(b.total_payment).toFixed(2) : "-"}</td>
      <td>
        ${b.payment_proof 
          ? `<a href="../imej/payment/${b.payment_proof}" target="_blank" class="payment-link">View</a>`
          : `<span class="no-proof">-</span>`
        }
      </td>
    </tr>
  `).join("")}
</tbody>

    </table>
  `;
}

/* =========================
   EXPORT PDF (BOOKINGS)
   ❗ FAIL-SAFE + HEADER CONFIRM
========================= */
function bindExportBookingPdf() {
  const exportBtn = document.getElementById("exportBookingsPdfBtn");
  if (!exportBtn) {
    console.warn("Export button not found");
    return;
  }

  exportBtn.type = "button";

  exportBtn.addEventListener("click", () => {

    const table = document
      .getElementById("bookingsTableContainer")
      ?.querySelector("table");

    if (!table) {
      alert("No data to export");
      return;
    }

    // 🔥 CONFIRM FUNCTION JALAN
    console.log("EXPORT BOOKING PDF WITH HEADER");

    /* ===== TARIKH & MASA ===== */
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-MY", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const timeStr = now.toLocaleTimeString("en-MY");

    /* ===== WRAPPER + HEADER ===== */
    const wrapper = document.createElement("div");
    wrapper.style.fontFamily = "Arial, sans-serif";
    wrapper.style.padding = "12px";

    wrapper.innerHTML = `
      <h2 style="margin:0;">Booking List</h2>
      <p style="font-size:12px; margin:4px 0;">
        Exported on: <strong>${dateStr}</strong><br>
        Time: <strong>${timeStr}</strong>
      </p>
      <hr>
    `;

    /* ===== CLONE TABLE ===== */
    const cloneTable = table.cloneNode(true);
    wrapper.appendChild(cloneTable);

    /* ===== EXPORT PDF ===== */
    html2pdf().set({
      margin: 10,
      filename: "booking_list.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape"
      }
    }).from(wrapper).save();
  });
}

/* =========================
   FILTER BUTTONS
========================= */
document.getElementById("applyBookingFilterBtn")
  ?.addEventListener("click", () => {
    filterFromMonth =
      document.getElementById("fromBookingMonth")?.value || "";
    filterToMonth =
      document.getElementById("toBookingMonth")?.value || "";
    renderBookings();
  });

document.getElementById("resetBookingFilterBtn")
  ?.addEventListener("click", () => {
    filterFromMonth = "";
    filterToMonth = "";
    const from = document.getElementById("fromBookingMonth");
    const to = document.getElementById("toBookingMonth");
    if (from) from.value = "";
    if (to) to.value = "";
    renderBookings();
  });

/* =========================
   PROFILE PHOTO
========================= */
function restoreProfilePhoto() {
  const savedLogo = localStorage.getItem("login_logo");
  const profilePic = document.getElementById("profilePicture");

  if (savedLogo && profilePic) {
    profilePic.style.backgroundImage = `url(${savedLogo})`;
    profilePic.style.backgroundSize = "cover";
    profilePic.style.backgroundPosition = "center";
  }
}
