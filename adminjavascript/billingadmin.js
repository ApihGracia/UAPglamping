let allData = [];
let filterFromMonth = "";
let filterToMonth = "";

/* =========================
   INIT PAGE (BILLING)
========================= */
document.addEventListener("DOMContentLoaded", () => {

  // Sidebar highlight
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === 'billing') {
      item.classList.add('active');
    }
  });

  // FETCH BILLING DATA
  fetch("../api/billing.php")
    .then(res => res.json())
    .then(data => {
      console.log("BILLING DATA:", data);
      allData = Array.isArray(data) ? data : [];
      renderBillingTable();
    })
    .catch(err => console.error("Billing fetch error:", err));

  restoreProfilePhoto();

  // 🔴 WAJIB (EXPORT BILLING PDF)
  initExportBillingPdf();
});


/* =========================
   RENDER BILLING TABLE
========================= */
function renderBillingTable() {
  const container = document.getElementById('billingTableContainer');
  if (!container) return;

  let billings = [...allData];

  // FILTER BULAN
  if (filterFromMonth || filterToMonth) {
    billings = billings.filter(b => {
      if (!b.billing_date) return false;
      const rowMonth = b.billing_date.slice(0, 7);
      if (filterFromMonth && rowMonth < filterFromMonth) return false;
      if (filterToMonth && rowMonth > filterToMonth) return false;
      return true;
    });
  }

  if (billings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💳</div>
        <p class="empty-state-text">No receipts yet</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Email</th>
          <th>Amount (RM)</th>
          <th>Payment Method</th>
          <th>Date</th>
          <th>Payment Proof</th>
        </tr>
      </thead>
      <tbody>
  ${billings.map(b => `
    <tr>
      <td>${b.customer_name ?? "-"}</td>
      <td>${b.customer_email ?? "-"}</td>
      <td>${b.amount ? Number(b.amount).toFixed(2) : "-"}</td>
      <td>${b.payment_method ?? "-"}</td>
      <td>${b.billing_date ? new Date(b.billing_date).toLocaleDateString() : "-"}</td>

      <!-- ✅ PAYMENT PROOF (WAJIB ADA TD) -->
      <td>
        ${
          b.payment_proof
            ? `
              <div class="proof-cell">
                <span class="proof-filename">
                  ${b.payment_proof.split("/").pop()}
                </span>
                <button
                  class="proof-preview-btn"
                  onclick="previewProof('${b.payment_proof}')"
                  title="Preview">
                  👁
                </button>
              </div>
            `
            : "-"
        }
      </td>
    </tr>
  `).join("")}
</tbody>

    </table>`;
}


/* =========================
   EXPORT PDF (BILLING)
========================= */
function initExportBillingPdf() {
  const exportBtn = document.getElementById("exportBillingPdfBtn");
  if (!exportBtn) return;

  exportBtn.onclick = () => {

    const container = document.getElementById("billingTableContainer");
    const table = container?.querySelector("table");

    if (!table) {
      alert("No data to export");
      return;
    }

    // 📅 TARIKH & MASA
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-MY", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const timeStr = now.toLocaleTimeString("en-MY");

    // HEADER
    const header = document.createElement("div");
    header.innerHTML = `
      <h2 style="margin:0;">Billing Report</h2>
      <p style="font-size:16px;">
        Exported on: <strong>${dateStr}</strong><br>
        Time: <strong>${timeStr}</strong>
      </p>
      <hr>
    `;

    const wrapper = document.createElement("div");
    wrapper.style.padding = "10px";
    wrapper.style.fontFamily = "Arial, sans-serif";
    wrapper.appendChild(header);
    wrapper.appendChild(table.cloneNode(true));

    html2pdf().set({
      margin: 10,
      filename: "billing_report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
    }).from(wrapper).save();
  };
}


/* =========================
   FILTER BUTTONS
========================= */
document.getElementById("applyBillingFilterBtn")
  ?.addEventListener("click", () => {
    filterFromMonth = document.getElementById("fromBillingMonth").value;
    filterToMonth = document.getElementById("toBillingMonth").value;
    renderBillingTable();
  });

document.getElementById("resetBillingFilterBtn")
  ?.addEventListener("click", () => {
    filterFromMonth = "";
    filterToMonth = "";
    document.getElementById("fromBillingMonth").value = "";
    document.getElementById("toBillingMonth").value = "";
    renderBillingTable();
  });


/* =========================
   VIEW & DOWNLOAD PROOF
========================= */
function viewProof(path) {
  if (!path) {
    alert("No payment proof available");
    return;
  }

  const fullPath = "../" + path;
  window.open(fullPath, "_blank");
}

function downloadProof(path) {
  if (!path) {
    alert("No payment proof available");
    return;
  }

  const link = document.createElement("a");
  link.href = "../" + path;
  link.download = path.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



function downloadProof(path) {
  const link = document.createElement("a");
  link.href = "../" + path;
  link.download = path.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


/* =========================
   PROFILE PHOTO
========================= */
function restoreProfilePhoto() {
  const savedLogo = localStorage.getItem('login_logo');
  const profilePic = document.getElementById('profilePicture');
  if (savedLogo && profilePic) {
    profilePic.style.backgroundImage = `url(${savedLogo})`;
    profilePic.style.backgroundSize = 'cover';
    profilePic.style.backgroundPosition = 'center';
  }
}


/* ======================================================
   ⚠️ KOD ASAL DIKEKALKAN (DISABLE SAHAJA)
   (BUKAN PAGE INI – JIKA AKTIF JS AKAN CRASH)
====================================================== */

// document.addEventListener("DOMContentLoaded", () => {
//   loadActivities();   // ❌ TIADA FUNCTION
//   loadBookings();     // ❌ TIADA FUNCTION
//   initExportBookingPdf(); // ❌ BUTTON TIADA DALAM PAGE BILLING
// });


// function loadBilling() {
//   fetch("../api/billing.php")
//     .then(res => res.json())
//     .then(data => {
//       const tbody = document.getElementById("billingTableBody"); // ❌ TIADA DALAM HTML
//       if (!tbody) return;
//       tbody.innerHTML = "";
//     });
// }


function previewProof(path) {
  if (!path) {
    alert("No payment proof available");
    return;
  }

  // 🚫 Block URL luar & file://
  if (path.startsWith("http") || path.startsWith("file:")) {
    alert("Invalid payment proof path");
    return;
  }

  const fullPath = "../" + path;
  window.open(fullPath, "_blank");
}
