/* =====================================================
   GLOBAL STATE
===================================================== */
let allActivityBookings = [];
let filterFromMonth = "";
let filterToMonth = "";

/* =====================================================
   MODAL HELPERS (KEKAL CARA ASAL)
===================================================== */
function getActivityModal() {
  return document.getElementById("activityModal");
}
function getBookActivityModal() {
  return document.getElementById("bookActivityModal");
}

/* =====================================================
   DOM READY – SATU KALI SAHAJA
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  if (getActivityModal()) getActivityModal().style.display = "none";
  if (getBookActivityModal()) getBookActivityModal().style.display = "none";

  loadActivities();
  loadBookings();
  restoreProfilePhoto();

  document.getElementById("activityForm")
    ?.addEventListener("submit", submitActivity);

  document.getElementById("bookActivityForm")
    ?.addEventListener("submit", submitBooking);

  document.getElementById("addActivityBtn")
    ?.addEventListener("click", openAddActivity);

  document.getElementById("addBookingBtn")
    ?.addEventListener("click", openAddBooking);

  document.getElementById("applyBookingFilterBtn")
    ?.addEventListener("click", applyBookingFilter);

  document.getElementById("resetBookingFilterBtn")
    ?.addEventListener("click", resetBookingFilter);

  document.getElementById("exportBookingPDF")
    ?.addEventListener("click", exportBookingPdf);

  // CLOSE & CANCEL BUTTONS
  [
    ["closeActivityModal", getActivityModal],
    ["cancelActivity", getActivityModal],
    ["closeBookActivityModal", getBookActivityModal],
    ["cancelBookActivity", getBookActivityModal]
  ].forEach(([id, modalFn]) => {
    document.getElementById(id)?.addEventListener("click", () => {
      const modal = modalFn();
      if (modal) modal.style.display = "none";
    });
  });
});

/* =====================================================
   LOAD ACTIVITIES
===================================================== */
function loadActivities() {
  fetch("../api/extraactivities.php")
    .then(res => res.json())
    .then(data => {

      let html = `
      <table class="data-table">
        <thead>
          <tr>
            <th>ACTIVITY</th>
            <th>PRICE</th>
            <th>DESCRIPTION</th>
            <th>IMAGE 1</th>
            <th>IMAGE 2</th>
            <th>IMAGE 3</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>`;

      data.forEach(a => {
        html += `
        <tr>
          <td>${a.name_activity}</td>
          <td>${a.price_activity}</td>
          <td>${a.detail_activity ?? "-"}</td>
          <td>${a.image1 ? `<img src="../imej/activity/${a.image1}" width="50">` : "-"}</td>
          <td>${a.image2 ? `<img src="../imej/activity/${a.image2}" width="50">` : "-"}</td>
          <td>${a.image3 ? `<img src="../imej/activity/${a.image3}" width="50">` : "-"}</td>
          <td>
            <button class="action-btn action-edit"
              onclick='openEditActivity(${JSON.stringify(a)})'>
              <i class="fa fa-pen"></i>
            </button>
            <button class="action-btn action-delete"
              onclick="deleteActivity(${a.id_activity})">
              <i class="fa fa-trash"></i>
            </button>
            <label class="switch">
              <input type="checkbox"
                ${a.is_active == 1 ? "checked" : ""}
                onchange="toggleActivity(${a.id_activity}, this.checked)">
              <span class="slider round"></span>
            </label>
          </td>
        </tr>`;
      });

      html += `</tbody></table>`;
      document.getElementById("activitiesTableContainer").innerHTML = html;
    });
}

/* =====================================================
   LOAD BOOKINGS
===================================================== */
function loadBookings() {
  fetch("../api/activitybooking.php")
    .then(res => res.json())
    .then(data => {
      allActivityBookings = Array.isArray(data) ? data : [];
      renderFilteredBookings();
    });
}

function renderFilteredBookings() {

  let data = [...allActivityBookings];

  if (filterFromMonth || filterToMonth) {
    data = data.filter(b => {
      if (!b.activity_date) return false;
      const m = b.activity_date.substring(0, 7);
      if (filterFromMonth && m < filterFromMonth) return false;
      if (filterToMonth && m > filterToMonth) return false;
      return true;
    });
  }

  let html = `
  <table class="data-table">
    <thead>
      <tr>
        <th>NAME</th>
        <th>EMAIL</th>
        <th>PHONE</th>
        <th>ACTIVITY</th>
        <th>DATE</th>
        <th>TIME</th>
        <th>PAX</th>
        <th>PAYMENT REF</th>
        <th>ACTION</th>
      </tr>
    </thead>
    <tbody>`;

  data.forEach(b => {
    html += `
    <tr>
      <td>${b.customer_name}</td>
      <td>${b.customer_email}</td>
      <td>${b.customer_phone}</td>
      <td>${b.activity_name}</td>
      <td>${b.activity_date}</td>
      <td>${b.activity_time}</td>
      <td>${b.participants}</td>
      <td>${b.payment_reference ?? "-"}</td>
      <td>
        <button class="action-btn action-edit"
          onclick='openEditBooking(${JSON.stringify(b)})'>
          <i class="fa fa-pen"></i>
        </button>
        <button class="action-btn action-delete"
          onclick="deleteBooking(${b.id_bookingActivity})">
          <i class="fa fa-trash"></i>
        </button>
      </td>
    </tr>`;
  });

  html += `</tbody></table>`;
  document.getElementById("bookingTableContainer").innerHTML = html;
}

/* =====================================================
   OPEN MODALS
===================================================== */
function openAddActivity() {
  document.getElementById("activityForm").reset();
  document.querySelector('[name="id_activity"]').value = "";
  getActivityModal().style.display = "block";
}

function openAddBooking() {
  document.getElementById("bookActivityForm").reset();
  document.querySelector('[name="id_bookingActivity"]').value = "";
  loadActivityOptionsForBooking();
  getBookActivityModal().style.display = "block";
}

/* =====================================================
   EDIT ACTIVITY
===================================================== */
function openEditActivity(a) {
  getActivityModal().style.display = "block";

  document.querySelector('[name="id_activity"]').value = a.id_activity ?? "";
  document.querySelector('[name="name_activity"]').value = a.name_activity ?? "";
  document.querySelector('[name="price_activity"]').value = a.price_activity ?? "";
  document.querySelector('[name="detail_activity"]').value = a.detail_activity ?? "";

  document.querySelector('[name="old_image1"]').value = a.image1 ?? "";
  document.querySelector('[name="old_image2"]').value = a.image2 ?? "";
  document.querySelector('[name="old_image3"]').value = a.image3 ?? "";

  if (a.image1) document.getElementById("previewImage1")?.setAttribute("src", "../imej/activity/" + a.image1);
}

/* =====================================================
   EDIT BOOKING
===================================================== */
function openEditBooking(b) {
  getBookActivityModal().style.display = "block";

  document.querySelector('[name="id_bookingActivity"]').value = b.id_bookingActivity ?? "";
  document.querySelector('[name="customer_name"]').value = b.customer_name ?? "";
  document.querySelector('[name="customer_email"]').value = b.customer_email ?? "";
  document.querySelector('[name="customer_phone"]').value = b.customer_phone ?? "";
  document.querySelector('[name="participants"]').value = b.participants ?? "";
  document.querySelector('[name="payment_reference"]').value = b.payment_reference ?? "";
  document.querySelector('[name="activity_time"]').value = b.activity_time ?? "";

  if (b.activity_date) {
    document.querySelector('[name="activity_date"]').value =
      b.activity_date.substring(0, 10);
  }

  loadActivityOptionsForBooking();

  setTimeout(() => {
    document.querySelector('[name="activity_name"]').value = b.activity_name ?? "";
  }, 300);
}

/* =====================================================
   SUBMIT / DELETE
===================================================== */
function submitActivity(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  fd.append("action", fd.get("id_activity") ? "update" : "insert");

  fetch("../api/extraactivities.php", { method: "POST", body: fd })
    .then(res => res.json())
    .then(() => {
      getActivityModal().style.display = "none";
      loadActivities();
    });
}

function deleteActivity(id) {
  if (!confirm("Delete this activity?")) return;
  const fd = new FormData();
  fd.append("action", "delete");
  fd.append("id_activity", id);

  fetch("../api/extraactivities.php", { method: "POST", body: fd })
    .then(() => loadActivities());
}

function submitBooking(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  fd.append("action", fd.get("id_bookingActivity") ? "update" : "insert");

  fetch("../api/activitybooking.php", { method: "POST", body: fd })
    .then(res => res.json())
    .then(() => {
      getBookActivityModal().style.display = "none";
      loadBookings();
    });
}

function deleteBooking(id) {
  if (!confirm("Delete this booking?")) return;
  const fd = new FormData();
  fd.append("action", "delete");
  fd.append("id_bookingActivity", id);

  fetch("../api/activitybooking.php", { method: "POST", body: fd })
    .then(() => loadBookings());
}

/* =====================================================
   TOGGLE & FILTER
===================================================== */
function toggleActivity(id, status) {
  const fd = new FormData();
  fd.append("action", "toggle");
  fd.append("id_activity", id);
  fd.append("is_active", status ? 1 : 0);

  fetch("../api/extraactivities.php", { method: "POST", body: fd });
}

function applyBookingFilter() {
  filterFromMonth = document.getElementById("fromBookingMonth")?.value || "";
  filterToMonth = document.getElementById("toBookingMonth")?.value || "";
  renderFilteredBookings();
}

function resetBookingFilter() {
  filterFromMonth = "";
  filterToMonth = "";
  document.getElementById("fromBookingMonth").value = "";
  document.getElementById("toBookingMonth").value = "";
  renderFilteredBookings();
}

/* =====================================================
   DROPDOWN & UTIL
===================================================== */
function loadActivityOptionsForBooking() {
  fetch("../api/extraactivities.php")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("bookingActivitySelect");
      if (!select) return;

      select.innerHTML = `<option value="">Select Activity</option>`;
      data.filter(a => a.is_active == 1).forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.name_activity;
        opt.textContent = `${a.name_activity} (RM ${a.price_activity})`;
        select.appendChild(opt);
      });
    });
}

function exportBookingPdf() {
  const table = document.getElementById("bookingTableContainer");
  if (!table) return alert("No data to export");

  html2pdf().from(table).save("extra_activities_bookings.pdf");
}

function restoreProfilePhoto() {
  const saved = localStorage.getItem("adminProfilePic");
  const pic = document.getElementById("profilePicture");
  if (saved && pic) pic.style.backgroundImage = `url(${saved})`;
}
