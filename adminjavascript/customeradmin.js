let allData = [];
let filterFromMonth = "";
let filterToMonth = "";

/* =========================
   LOAD DATA
========================= */
document.addEventListener("DOMContentLoaded", () => {
  fetch("../api/customer.php")
    .then(res => res.json())
    .then(data => {
      allData = Array.isArray(data) ? data : [];
      renderCustomersTable();
    })
    .catch(err => console.error("API Error:", err));

  initFilters();
  initExportPdf();
  restoreProfilePhoto();
});

/* =========================
   RENDER TABLE
========================= */
function renderCustomersTable() {
  const container = document.getElementById("customersTableContainer");
  if (!container) return;

  let customers = [...allData];

  // FILTER BULAN
  if (filterFromMonth || filterToMonth) {
    customers = customers.filter(c => {
      if (!c.created_at) return false;
      const rowMonth = c.created_at.slice(0, 7);
      if (filterFromMonth && rowMonth < filterFromMonth) return false;
      if (filterToMonth && rowMonth > filterToMonth) return false;
      return true;
    });
  }

  if (customers.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No customers yet</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Mobile</th>
          <th>Address</th>
          <th>Registered</th>
        </tr>
      </thead>
      <tbody>
        ${customers.map(c => `
          <tr>
            <td>${c.email_customer}</td>
            <td>${c.name}</td>
            <td>${c.gender ?? "-"}</td>
            <td>${c.mobile ?? "-"}</td>
            <td>${c.address ?? "-"}</td>
            <td>${c.created_at ? new Date(c.created_at).toLocaleDateString() : "-"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;
}

/* =========================
   FILTER BUTTONS
========================= */
function initFilters() {
  const fromMonth = document.getElementById("fromMonth");
  const toMonth = document.getElementById("toMonth");
  const applyBtn = document.getElementById("applyFilterBtn");
  const resetBtn = document.getElementById("resetFilterBtn");

  if (!fromMonth || !toMonth || !applyBtn || !resetBtn) return;

  applyBtn.onclick = () => {
    filterFromMonth = fromMonth.value;
    filterToMonth = toMonth.value;
    renderCustomersTable();
  };

  resetBtn.onclick = () => {
    filterFromMonth = "";
    filterToMonth = "";
    fromMonth.value = "";
    toMonth.value = "";
    renderCustomersTable();
  };
}

/* =========================
   EXPORT PDF
========================= */
/* =========================
   EXPORT PDF — FAIL-SAFE
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const exportBtn = document.getElementById("exportPdfBtn");
  if (!exportBtn) {
    alert("Export button not found");
    return;
  }

  exportBtn.type = "button";

  exportBtn.addEventListener("click", () => {

    const container = document.getElementById("customersTableContainer");
    const table = container?.querySelector("table");

    if (!table) {
      alert("No table found to export");
      return;
    }

    // 🔥 CONFIRM CODE JALAN
    console.log("EXPORT PDF WITH HEADER — RUNNING");

    // 📅 TARIKH & MASA
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-MY", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const timeStr = now.toLocaleTimeString("en-MY");

    // 📦 WRAPPER + HEADER (INLINE)
    const wrapper = document.createElement("div");
    wrapper.style.fontFamily = "Arial, sans-serif";
    wrapper.style.padding = "12px";

    wrapper.innerHTML = `
      <h2 style="margin:0;">Customer List</h2>
      <p style="font-size:16px; margin:4px 0;">
        Exported on: <strong>${dateStr}</strong><br>
        Time: <strong>${timeStr}</strong>
      </p>
      <hr>
    `;

    // 📋 TABLE
    const cloneTable = table.cloneNode(true);
    wrapper.appendChild(cloneTable);

    // 📄 EXPORT PDF
    html2pdf().set({
      margin: 10,
      filename: "customer_list.pdf",
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape"
      }
    }).from(wrapper).save();
  });

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
