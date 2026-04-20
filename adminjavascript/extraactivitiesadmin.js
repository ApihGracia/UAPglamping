
let allActivityBookings = [];
let filterFromMonth = "";
let filterToMonth = "";

/* ===============================
   SAFETY STUB (ASAL)
================================ */
function submitActivity(e) {
  e.preventDefault();
}

/* ===============================
   MODAL REFERENCES (ASAL)
================================ */
function getActivityModal() {
  return document.getElementById("activityModal");
}
function getBookActivityModal() {
  return document.getElementById("bookActivityModal");
}

/* ===============================
   DOM READY (ASAL)
================================ */
document.addEventListener("DOMContentLoaded", () => {

  if (getActivityModal()) getActivityModal().style.display = "none";
  if (getBookActivityModal()) getBookActivityModal().style.display = "none";

  loadActivities();
  loadBookings();

  document.getElementById("activityForm")
    ?.addEventListener("submit", submitActivity);

  document.getElementById("bookActivityForm")
    ?.addEventListener("submit", submitBooking);
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(
    "#addBookingBtn, #addActivityBtn"
  ).forEach(btn => {
    btn.type = "button";
  });
});

document.getElementById("addActivityBtn")
  ?.addEventListener("click", () => {
    const form = document.getElementById("activityForm");
    if (form) form.reset();

    document.querySelector('[name="id_activity"]').value = "";
    getActivityModal().style.display = "block";
  });

document.getElementById("addBookingBtn")
  ?.addEventListener("click", () => {
    const form = document.getElementById("bookActivityForm");
    if (form) form.reset();

    document.querySelector('[name="id_bookingActivity"]').value = "";
    getBookActivityModal().style.display = "block";

    loadActivityOptionsForBooking(); // ✅ INI
  });

document.getElementById("addActivityBtn")
  ?.addEventListener("click", () => {
    const form = document.getElementById("activityForm");
    if (form) form.reset();

    document.querySelector('[name="id_activity"]').value = "";
    getActivityModal().style.display = "block";
  });

document.getElementById("addBookingBtn")
  ?.addEventListener("click", () => {
    const form = document.getElementById("bookActivityForm");
    if (form) form.reset();

    document.querySelector('[name="id_bookingActivity"]').value = "";
    getBookActivityModal().style.display = "block";
  });

document.getElementById("addActivityBtn")
  ?.addEventListener("click", () => {
    const form = document.getElementById("activityForm");
    if (form) form.reset();

    document.querySelector('[name="id_activity"]').value = "";
    getActivityModal().style.display = "block";
  });

document.getElementById("addBookingBtn")
  ?.addEventListener("click", () => {
    const form = document.getElementById("bookActivityForm");
    if (form) form.reset();

    document.querySelector('[name="id_bookingActivity"]').value = "";
    getBookActivityModal().style.display = "block";
  });


/* ===============================
   LOAD ACTIVITIES (UI ASAL + TOGGLE)
================================ */
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
          <td>${a.image1 ? `<img src="../imej/activity/${a.image1}" width="50" style="object-fit:cover;">` : "-"}</td>
          <td>${a.image2 ? `<img src="../imej/activity/${a.image2}" width="50" style="object-fit:cover;">` : "-"}</td>
          <td>${a.image3 ? `<img src="../imej/activity/${a.image3}" width="50" style="object-fit:cover;">` : "-"}</td>



          <!-- ✅ ACTION BUTTON ASAL -->
          <td>
            <button class="action-btn action-edit"
              onclick='openEditActivity(${JSON.stringify(a)})'>
              <i class="fa fa-pen"></i>
            </button>
            <button class="action-btn action-delete"
              onclick="deleteActivity(${a.id_activity})">
              <i class="fa fa-trash"></i>
            </button>

			<label class="switch" style="margin-right:10px;">
		<input type="checkbox"
      ${a.is_active == 1 ? "checked" : ""}
      onchange="toggleActivity(${a.id_activity}, this.checked)">
    <span class="slider round"></span>
  </label>
</td>
          </td>
        </tr>`;
      });

      html += `</tbody></table>`;
      document.getElementById("activitiesTableContainer").innerHTML = html;
    });
}

/* ===============================
   LOAD BOOKINGS (UI ASAL)
================================ */
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
onclick="openEditBookingSafe(${b.id_bookingActivity})">
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

/* ===============================
   TOGGLE ACTIVITY (LOGIK SAHAJA)
================================ */
function toggleActivity(id, status) {
  const fd = new FormData();
  fd.append("action", "toggle");
  fd.append("id_activity", id);
  fd.append("is_active", status ? 1 : 0);

  fetch("../api/extraactivities.php", {
    method: "POST",
    body: fd
  });
}

/* ===============================
   EDIT ACTIVITY (ASAL)
================================ */
function openEditActivity(a) {
	document.querySelector('[name="old_image1"]').value = a.image1 ?? "";
	document.querySelector('[name="old_image2"]').value = a.image2 ?? "";
	document.querySelector('[name="old_image3"]').value = a.image3 ?? "";

	if (a.image1) {
  document.getElementById("previewImage1").src = a.image1;
}

  getActivityModal().style.display = "block";

  document.querySelector('[name="id_activity"]').value = a.id_activity;
  document.querySelector('[name="name_activity"]').value = a.name_activity;
  document.querySelector('[name="price_activity"]').value = a.price_activity;
  document.querySelector('[name="detail_activity"]').value = a.detail_activity;
}

/* ===============================
   DELETE ACTIVITY (ASAL LOGIK)
================================ */
function deleteActivity(id) {
  if (!confirm("Delete this activity?")) return;

  const fd = new FormData();
  fd.append("action", "delete");
  fd.append("id_activity", id);

  fetch("../api/extraactivities.php", {
    method: "POST",
    body: fd
  })
  .then(res => res.json())
  .then(() => loadActivities());
}

/* ===============================
   SUBMIT ACTIVITY (ASAL)
================================ */
function submitActivity(e) {
  e.preventDefault();

  const fd = new FormData(e.target);
  fd.append(fd.get("id_activity") ? "action" : "action",
            fd.get("id_activity") ? "update" : "insert");

  fetch("../api/extraactivities.php", {
    method: "POST",
    body: fd
  })
  .then(res => res.json())
  .then(() => {
    getActivityModal().style.display = "none";
    loadActivities();
  });
}

function submitBooking(e) {
  e.preventDefault();

  const fd = new FormData(e.target);
  fd.append(
    fd.get("id_bookingActivity") ? "action" : "action",
    fd.get("id_bookingActivity") ? "update" : "insert"
  );

  fetch("../api/activitybooking.php", {
    method: "POST",
    body: fd
  })
  .then(res => res.json())
  .then(res => {
    if (res.success) {
      getBookActivityModal().style.display = "none";
      loadBookings();
    } else {
      alert("Failed to save booking");
    }
  });
}

function deleteBooking(id) {
  if (!confirm("Delete this booking?")) return;

  const fd = new FormData();
  fd.append("action", "delete");
  fd.append("id_bookingActivity", id);

  fetch("../api/activitybooking.php", {
    method: "POST",
    body: fd
  })
  .then(res => res.json())
  .then(() => loadBookings());
}

function exportBookingPdf() {
  const table = document.getElementById("bookingTableContainer");
  if (!table || table.innerText.trim() === "") {
    alert("No data to export");
    return;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-MY", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const timeStr = now.toLocaleTimeString("en-MY");

  const wrapper = document.createElement("div");
  wrapper.style.fontFamily = "Arial, sans-serif";
  wrapper.innerHTML = `
    <h2>Extra Activities Bookings</h2>
    <p>
      Exported on: <strong>${dateStr}</strong><br>
      Time: <strong>${timeStr}</strong>
    </p>
    <hr>
  `;

  const clone = table.cloneNode(true);

  // buang ACTION column
  clone.querySelectorAll("th").forEach(th => {
    if (th.innerText.trim() === "ACTION") th.remove();
  });
  clone.querySelectorAll("td").forEach(td => {
    if (td.querySelector(".action-btn")) td.remove();
  });

  wrapper.appendChild(clone);

  html2pdf({
    margin: 10,
    filename: "extra_activities_bookings.pdf",
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    html2canvas: { scale: 2 }
  }).from(wrapper).save();
}


/* ===============================
   EDIT BOOKING (TAMBAHAN SAHAJA)
   ❗ TIDAK UBAH KOD ASAL
================================ */
function openEditBooking(b) {
  const modal = getBookActivityModal();
  if (!modal) return;

  modal.style.display = "block";

  document.querySelector('[name="id_bookingActivity"]').value = b.id_bookingActivity ?? "";
  document.querySelector('[name="customer_name"]').value = b.customer_name ?? "";
  document.querySelector('[name="customer_email"]').value = b.customer_email ?? "";
  document.querySelector('[name="customer_phone"]').value = b.customer_phone ?? "";
  document.querySelector('[name="activity_name"]').value = b.activity_name ?? "";
  document.querySelector('[name="activity_time"]').value = b.activity_time ?? "";
  document.querySelector('[name="participants"]').value = b.participants ?? "";
  document.querySelector('[name="payment_reference"]').value = b.payment_reference ?? "";

  // 🔑 penting untuk <input type="date">
  if (b.activity_date) {
    document.querySelector('[name="activity_date"]').value =
      b.activity_date.toString().substring(0, 10);
  }
}


["closeActivityModal", "cancelActivity",
 "closeBookActivityModal", "cancelBookActivity"]
.forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      if (id.includes("Activity")) getActivityModal().style.display = "none";
      else getBookActivityModal().style.display = "none";
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {

  const exportBtn = document.getElementById("exportBookingPDF");
  if (!exportBtn) return;

  exportBtn.type = "button"; // WAJIB

  exportBtn.addEventListener("click", () => {
    exportBookingPdf();
  });

});


document.getElementById("closeActivityModal")
  ?.addEventListener("click", () => {
    getActivityModal().style.display = "none";
  });

document.getElementById("cancelActivity")
  ?.addEventListener("click", () => {
    getActivityModal().style.display = "none";
  });

document.getElementById("closeBookActivityModal")
  ?.addEventListener("click", () => {
    getBookActivityModal().style.display = "none";
  });

document.getElementById("cancelBookActivity")
  ?.addEventListener("click", () => {
    getBookActivityModal().style.display = "none";
  });

function openEditActivity(a) {
  getActivityModal().style.display = "block";

  document.querySelector('[name="id_activity"]').value = a.id_activity ?? "";
  document.querySelector('[name="name_activity"]').value = a.name_activity ?? "";
  document.querySelector('[name="price_activity"]').value = a.price_activity ?? "";
  document.querySelector('[name="detail_activity"]').value = a.detail_activity ?? "";

  // ✅ SELAMAT: hanya set src JIKA element wujud
  const img1 = document.getElementById("previewImage1");
  if (img1 && a.image1) img1.src = a.image1;

  const img2 = document.getElementById("previewImage2");
  if (img2 && a.image2) img2.src = a.image2;

  const img3 = document.getElementById("previewImage3");
  if (img3 && a.image3) img3.src = a.image3;
}

function openEditActivity(a) {
  getActivityModal().style.display = "block";

  document.querySelector('[name="id_activity"]').value = a.id_activity ?? "";
  document.querySelector('[name="name_activity"]').value = a.name_activity ?? "";
  document.querySelector('[name="price_activity"]').value = a.price_activity ?? "";
  document.querySelector('[name="detail_activity"]').value = a.detail_activity ?? "";

  // ✅ PAPAR PREVIEW GAMBAR LAMA
  const preview = document.getElementById("previewImage1");
  if (preview && a.image1) {
    preview.src = a.image1;
    preview.style.display = "block";
  }
}


/* ===============================
   EXPORT PDF – FINAL FIX
   ❗ TAMBAH SAHAJA
================================ */
document.addEventListener("DOMContentLoaded", () => {

  const exportBtn = document.getElementById("exportBookingPDF");
  if (!exportBtn) return;

  exportBtn.type = "button"; // elak jadi submit

  exportBtn.addEventListener("click", () => {
    exportBookingPdf();
  });

});

/* ===============================
   EXPORT PDF – BOOKING (FINAL, STABLE)
   ❗ TAMBAH / GANTI EXPORT SAHAJA
================================ */
document.addEventListener("DOMContentLoaded", () => {
  initExportBookingPdf();
});

function initExportBookingPdf() {
  const exportBtn = document.getElementById("exportBookingPDF");
  if (!exportBtn) return;

  // 🔴 PENTING: elak submit / refresh
  exportBtn.type = "button";

  exportBtn.onclick = () => {

    const container = document.getElementById("bookingTableContainer");
    const table = container?.querySelector("table");

    if (!table) {
      alert("No data to export");
      return;
    }

    /* ===== TARIKH & MASA ===== */
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-MY", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const timeStr = now.toLocaleTimeString("en-MY");

    /* ===== HEADER PDF ===== */
    const header = document.createElement("div");
    header.innerHTML = `
      <h2 style="margin:0;">Extra Activities Bookings</h2>
      <p style="font-size:12px;">
        Exported on: <strong>${dateStr}</strong><br>
        Time: <strong>${timeStr}</strong>
      </p>
      <hr>
    `;

    /* ===== CLONE TABLE ===== */
    const cloneTable = table.cloneNode(true);

    // ❌ BUANG COLUMN ACTION (HEADER)
    cloneTable.querySelectorAll("th").forEach(th => {
      if (th.innerText.trim() === "ACTION") th.remove();
    });

    // ❌ BUANG COLUMN ACTION (DATA)
    cloneTable.querySelectorAll("td").forEach(td => {
      if (td.querySelector(".action-btn")) td.remove();
    });

    /* ===== WRAPPER ===== */
    const wrapper = document.createElement("div");
    wrapper.style.padding = "10px";
    wrapper.style.fontFamily = "Arial, sans-serif";
    wrapper.appendChild(header);
    wrapper.appendChild(cloneTable);

    /* ===== EXPORT PDF ===== */
    html2pdf().set({
      margin: 10,
      filename: "extra_activities_bookings.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape"
      }
    }).from(wrapper).save();
  };
}

document.getElementById("applyBookingFilterBtn")
  ?.addEventListener("click", () => {
    filterFromMonth =
      document.getElementById("fromBookingMonth")?.value || "";
    filterToMonth =
      document.getElementById("toBookingMonth")?.value || "";

    renderFilteredBookings();
  });

document.getElementById("resetBookingFilterBtn")
  ?.addEventListener("click", () => {
    filterFromMonth = "";
    filterToMonth = "";

    const from = document.getElementById("fromBookingMonth");
    const to = document.getElementById("toBookingMonth");
    if (from) from.value = "";
    if (to) to.value = "";

    renderFilteredBookings();
  });

function restoreProfilePhoto() {
  const savedPic = localStorage.getItem("adminProfilePic");
  const profilePic = document.getElementById("profilePicture");

  if (savedPic && profilePic) {
    profilePic.style.backgroundImage = `url(${savedPic})`;
    profilePic.style.backgroundSize = "cover";
    profilePic.style.backgroundPosition = "center";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  restoreProfilePhoto();
});


/* =====================================================
   🔧 SAFE FIX: EDIT ACTIVITY IMAGE PREVIEW (TAMBAHAN SAHAJA)
   ❗ JANGAN BUANG / UBAH KOD ASAL
===================================================== */

window.openEditActivity = function (a) {

  // buka modal
  const modal = document.getElementById("activityModal");
  if (modal) modal.style.display = "block";

  // isi field asas
  document.querySelector('[name="id_activity"]').value = a.id_activity ?? "";
  document.querySelector('[name="name_activity"]').value = a.name_activity ?? "";
  document.querySelector('[name="price_activity"]').value = a.price_activity ?? "";
  document.querySelector('[name="detail_activity"]').value = a.detail_activity ?? "";

  // simpan gambar lama (hidden input)
  const old1 = document.querySelector('[name="old_image1"]');
  const old2 = document.querySelector('[name="old_image2"]');
  const old3 = document.querySelector('[name="old_image3"]');

  if (old1) old1.value = a.image1 ?? "";
  if (old2) old2.value = a.image2 ?? "";
  if (old3) old3.value = a.image3 ?? "";

  // paparkan preview gambar lama
  const p1 = document.getElementById("previewImage1");
  if (p1 && a.image1) {
    p1.src = "../imej/activity/" + a.image1;
    p1.style.display = "block";
  }

  const p2 = document.getElementById("previewImage2");
  if (p2 && a.image2) {
    p2.src = "../imej/activity/" + a.image2;
    p2.style.display = "block";
  }

  const p3 = document.getElementById("previewImage3");
  if (p3 && a.image3) {
    p3.src = "../imej/activity/" + a.image3;
    p3.style.display = "block";
  }
};


/* ======================================
   LOAD ACTIVE ACTIVITIES → BOOK DROPDOWN
   ❗ TAMBAHAN SAHAJA
====================================== */
function loadActivityOptionsForBooking() {
  fetch("../api/extraactivities.php")
    .then(res => res.json())
    .then(data => {

      const select = document.getElementById("bookingActivitySelect");
      if (!select) return;

      select.innerHTML = `<option value="">Select Activity</option>`;

      data
        .filter(a => a.is_active == 1)
        .forEach(a => {
          const opt = document.createElement("option");
          opt.value = a.name_activity;
          opt.textContent = `${a.name_activity} (RM ${a.price_activity})`;
          select.appendChild(opt);
        });
    });
}

/* ===========================================
   FINAL FIX - EDIT BOOKING DROPDOWN
   (TAMBAH SAHAJA, TAK USIK KOD LAMA)
=========================================== */
window.openEditBookingSafe = function (id) {

  // ambil data booking dari array asal
  const b = allActivityBookings.find(
    x => x.id_bookingActivity == id
  );

  if (!b) {
    alert("Booking data tak jumpa");
    return;
  }

  const modal = document.getElementById("bookActivityModal");
  modal.style.display = "block";

document.querySelector('[name="id_bookingActivity"]').value =
  b.id_bookingActivity ?? "";

document.querySelector('[name="customer_name"]').value =
  b.customer_name ?? "";

document.querySelector('[name="customer_email"]').value =
  b.customer_email ?? "";

document.querySelector('[name="customer_phone"]').value =
  b.customer_phone ?? "";

if (b.activity_date) {
  document.querySelector('[name="activity_date"]').value =
    b.activity_date.toString().substring(0, 10);
}
let timeVal = b.activity_time ?? "";

if (timeVal.includes("AM") || timeVal.includes("PM")) {
  const d = new Date("1970-01-01 " + timeVal);
  timeVal = d.toTimeString().substring(0,5);
}

if (timeVal.length >= 5) {
  timeVal = timeVal.substring(0,5);
}

document.querySelector('[name="activity_time"]').value = timeVal;

document.querySelector('[name="participants"]').value =
  b.participants ?? "";

document.querySelector('[name="payment_reference"]').value =
  b.payment_reference ?? "";


  if (b.activity_date) {
    document.querySelector('[name="activity_date"]').value =
      b.activity_date.substring(0, 10);
  }

  loadActivityOptionsForBooking();

  const select = document.getElementById("bookingActivitySelect");
  let tries = 0;

  const wait = setInterval(() => {
    tries++;
    if (select && select.options.length > 1) {
      for (let opt of select.options) {
        if (opt.value === b.activity_name) opt.selected = true;
      }
      clearInterval(wait);
    }
    if (tries > 15) clearInterval(wait);
  }, 200);
};

