document.addEventListener("DOMContentLoaded", () => {

  /* ===========================
     LOGO UPLOAD (TAMBAHAN SAHAJA)
  ============================ */
  const logoContainer = document.getElementById("loginLogoContainer");
  const logoInput = document.getElementById("loginLogoInput");
  const logoPreview = document.getElementById("loginLogo");

  if (logoContainer && logoInput && logoPreview) {

    // Klik logo → buka file chooser
    logoContainer.addEventListener("click", () => {
      logoInput.click();
    });

    // Bila pilih gambar
    logoInput.addEventListener("change", () => {
      const file = logoInput.files[0];
      if (!file) return;

      // Pastikan fail gambar
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        logoPreview.style.backgroundImage = `url(${reader.result})`;
        logoPreview.style.backgroundSize = "cover";
        logoPreview.style.backgroundPosition = "center";

        // Simpan supaya kekal
        localStorage.setItem("login_logo", reader.result);
      };
      reader.readAsDataURL(file);
    });

    // Load semula logo bila refresh
    const savedLogo = localStorage.getItem("login_logo");
    if (savedLogo) {
      logoPreview.style.backgroundImage = `url(${savedLogo})`;
      logoPreview.style.backgroundSize = "cover";
      logoPreview.style.backgroundPosition = "center";
    }
  }

  /* ===========================
     LOGIN (KOD ASAL – KEKAL)
  ============================ */
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMsg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.innerText = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      msg.innerText = "Please fill in all fields.";
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/UAPGlamping/api/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        }
      );

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (data.success) {

        msg.innerText = "";
        localStorage.setItem("admin_logged_in", "true");
        window.location.href = "dashboardadmin.html";

      } else {
        alert("❌ " + (data.message || "Invalid username or password"));
      }

    } catch (err) {
      console.error(err);
      alert("❌ Server error. Please try again.");
    }
  });

});
