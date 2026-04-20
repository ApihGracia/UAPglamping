const resetForm = document.getElementById("resetPasswordForm");
const msg = document.getElementById("resetMsg");

if (resetForm) {
  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.style.color = "red";

    const password = document.getElementById("newPassword").value;
    const confirm  = document.getElementById("confirmPassword").value;

    if (password.length < 8) {
      msg.textContent = "Password must be at least 8 characters.";
      return;
    }

    if (password !== confirm) {
      msg.textContent = "Passwords do not match.";
      return;
    }

    const formData = new FormData();
    formData.append("newPassword", password);

    fetch("http://localhost:8080/UAPglamping/api/settingadmin.php", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        msg.style.color = "green";
        msg.textContent = "Password updated successfully. Please login again.";
        resetForm.reset();

        // auto logout selepas reset
        setTimeout(() => {
          localStorage.removeItem("admin_logged_in");
          window.location.href = "loginadmin.html";
        }, 2000);

      } else {
        msg.textContent = data.message || "Failed to update password.";
      }
    })
    .catch(() => {
      msg.textContent = "Server error. Please try again.";
    });
  });
}
