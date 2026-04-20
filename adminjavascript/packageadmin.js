let form;
let modal;

/* ===============================
   INIT PAGE (ASAL)
================================ */
document.addEventListener("DOMContentLoaded", () => {
  modal = document.getElementById("packageModal");
  form = document.getElementById("packageForm");

  loadPackages();

  document.getElementById("addPackageBtn").onclick = () => {
    form.reset();
    document.getElementById("id_package").value = "";
    document.getElementById("action").value = "add";
    modal.classList.add("active");
  };

  document.getElementById("closePackageModal").onclick =
  document.getElementById("cancelPackage").onclick = () => {
    modal.classList.remove("active");
  };

  form.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(form);

    fetch("/UAPglamping/api/packageadmin.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(text => {
        console.log("RAW RESPONSE:", text);

        try {
          const json = JSON.parse(text);
          console.log("SERVER RESPONSE:", json);

          if (json.success) {
            modal.classList.remove("active");
            loadPackages();
          }
        } catch (e) {
          alert("SERVER ERROR — check PHP output in console");
        }
      })
      .catch(err => console.error(err));
  });
});


/* ===============================
   LOAD PACKAGES 
================================ */
function loadPackages() {
  fetch("/UAPglamping/api/packageadmin.php")
    .then(res => res.json())
    .then(packages => {

      const tbody = document.getElementById("packagesTableBody");
      const emptyState = document.getElementById("emptyPackageState");

      if (!tbody) return;

      tbody.innerHTML = "";

      if (!packages || packages.length === 0) {
        emptyState.style.display = "block";
        return;
      }

      emptyState.style.display = "none";

      packages.forEach(p => {

        const row = document.createElement("tr");

        row.innerHTML = `
          <td class="image-col">
            ${p.image_package ? `<img src="${getImageSrc(p.image_package)}"
                     class="pkg-img"
                     onerror="this.style.display='none'">`
              : "-"}
          </td>

          <td class="image-col">
            ${p.image_package1
              ? `<img src="${getImageSrc(p.image_package1)}"
                     class="pkg-img"
                     onerror="this.style.display='none'">`
              : "-"}
          </td>

          <td class="image-col">
            ${p.image_package2
              ? `<img src="${getImageSrc(p.image_package2)}"
                     class="pkg-img"
                     onerror="this.style.display='none'">`
              : "-"}
          </td>

          <td>${p.name_package}</td>
          <td style="white-space:pre-line">${p.facility}</td>
          <td>${p.capacity ?? "-"}</td>
          <td>${p.avaibility ?? "-"}</td>
		      <td style="white-space:pre-line; font-size:13px">
            ${p.price_info ?? "-"}
          </td>

          <td>
            <button class="action-btn action-edit"
              onclick='openEditModal(${JSON.stringify(p)})'>
              <i class="fa-solid fa-pen"></i>
            </button>

            <button class="action-btn action-delete"
              onclick="deletePackage(${p.id_package})">
              <i class="fa-solid fa-trash"></i>
            </button>

            <label class="switch">
              <input type="checkbox"
                ${p.is_active == 1 ? "checked" : ""}
                onchange="togglePackage(${p.id_package}, this.checked)">
              <span class="slider"></span>
            </label>
          </td>
        `;

        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Load package error:", err);
    });
}


/* ===============================
   IMAGE SRC
================================ */
function getImageSrc(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return "/UAPglamping/imej/" + path;
}


/* ===============================
   TOGGLE
================================ */
function togglePackage(id, isChecked) {
  const formData = new FormData();
  formData.append("action", "toggle");
  formData.append("id_package", id);
  formData.append("is_active", isChecked ? 1 : 0);

  fetch("/UAPglamping/api/packageadmin.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.text())
  .then(text => {
    try {
      const json = JSON.parse(text);
      console.log("SERVER RESPONSE:", json);
      modal.classList.remove("active");
      loadPackages();
    } catch (e) {
      console.error("SERVER NOT JSON:", text);
      alert("Server error. Check PHP.");
    }
  });

}


/* ===============================
   EDIT MODAL (ASAL + FIX HARGA)
================================ */
function openEditModal(data) {
  modal.classList.add("active");

  document.getElementById("action").value = "update";
  document.getElementById("id_package").value = data.id_package;

  form.name_package.value = data.name_package;
  form.facility.value = data.facility;
  form.capacity.value = data.capacity;
  form.avaibility.value = data.avaibility;

  form.old_image_package.value = data.image_package ?? "";
  form.old_image_package1.value = data.image_package1 ?? "";
  form.old_image_package2.value = data.image_package2 ?? "";

  // =========================
  // 🔥 INI SAHAJA TAMBAHAN
  // =========================
  fetch(`/UAPglamping/api/packageadmin.php?action=get_price&id_package=${data.id_package}`)
    .then(res => res.json())
    .then(price => {

      console.log("PRICE DATA ===>", price);

      document.getElementById("price_upsi_weekday").value = price.upsi_weekday ?? "";
      document.getElementById("price_upsi_weekend").value = price.upsi_weekend ?? "";
      document.getElementById("price_public_weekday").value = price.public_weekday ?? "";
      document.getElementById("price_public_weekend").value = price.public_weekend ?? "";
    });
}


/* ===============================
   DELETE (ASAL)
================================ */
function deletePackage(id) {
  if (!confirm("Are you sure you want to delete this package?")) return;

  const fd = new FormData();
  fd.append("action", "delete");
  fd.append("id_package", id);

  fetch("/UAPglamping/api/packageadmin.php", {
    method: "POST",
    body: fd
  })
    .then(res => res.text())
    .then(text => {
      console.log("DELETE RESPONSE:", text);
      const json = JSON.parse(text);

      if (json.success) {
        loadPackages();
      } else {
        alert("Delete failed");
      }
    })
    .catch(err => {
      console.error("Delete error:", err);
      alert("Server error during delete");
    });
}


/* ===============================
   PROFILE (ASAL)
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("profilePictureContainer");
  const fileInput = document.getElementById("profilePictureInput");
  const profilePic = document.getElementById("profilePicture");

  if (!container || !fileInput || !profilePic) return;

  container.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      profilePic.style.backgroundImage = `url(${reader.result})`;
      localStorage.setItem("adminProfilePic", reader.result);
    };
    reader.readAsDataURL(file);
  });

  const savedPic = localStorage.getItem("adminProfilePic");
  if (savedPic) profilePic.style.backgroundImage = `url(${savedPic})`;

  document.getElementById("addPackageBtn").onclick = () => {
    form.reset();
    document.getElementById("id_package").value = "";
    document.getElementById("action").value = "add";
    modal.classList.add("active");
  };
});


/* ===============================
   LOGOUT
================================ */
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  window.location.href = "/UAPglamping/adminhtml/loginadmin.html";
});


/* =====================================================
   FINAL SAFE DELETE (ASAL)
===================================================== */
window.deletePackage = function (id) {
  console.log("DELETE CLICK:", id);

  if (!confirm("Are you sure you want to delete this package?")) return;

  const fd = new FormData();
  fd.append("action", "delete");
  fd.append("id_package", id);

  fetch("/UAPglamping/api/packageadmin.php", {
    method: "POST",
    body: fd
  })
  .then(res => res.text())
  .then(text => {
    console.log("DELETE RAW RESPONSE:", text);

    try {
      const json = JSON.parse(text);

      if (json.success) {
        console.log("DELETE SUCCESS");
        loadPackages();
      } else {
        alert("Delete failed (server returned false)");
      }
    } catch (e) {
      alert("Server returned invalid JSON. Check PHP output.");
      console.error(e);
    }
  })
  .catch(err => {
    console.error("DELETE ERROR:", err);
    alert("Network / server error");
  });
};
