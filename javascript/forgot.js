// =======================
// FORGOT PASSWORD LOGIC
// =======================
const forgotForm = document.getElementById('forgotForm');

if (forgotForm) {

  const popupOverlay = document.getElementById('popupOverlay');
  const popupMessage = document.getElementById('popupMessage');
  const popupBtn = document.getElementById('popupBtn');

  function showPopup(message){
    popupMessage.textContent = message;
    popupOverlay.style.display = 'flex';
  }

  popupBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
  });

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('newPassword');
  const confirmInput = document.getElementById('confirmPassword');

  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const confirmError = document.getElementById('confirmError');

  // =======================
  // AUTO CLEAR ERROR ON INPUT ✅ (DI LUAR SUBMIT)
  // =======================
  emailInput.addEventListener('input', () => {
    emailError.textContent = '';
  });

  passwordInput.addEventListener('input', () => {
    passwordError.textContent = '';
  });

  confirmInput.addEventListener('input', () => {
    confirmError.textContent = '';
  });

  // =======================
  // SUBMIT
  // =======================
  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();

    emailError.textContent = '';
    passwordError.textContent = '';
    confirmError.textContent = '';

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if (!email) {
      emailError.textContent = 'Email is required.';
      emailInput.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.focus();
      return;
    }

    if (password.length < 8) {
      passwordError.textContent = 'Password must be at least 8 characters.';
      passwordInput.focus();
      return;
    }

    if (password !== confirm) {
      confirmError.textContent = 'Passwords do not match.';
      confirmInput.focus();
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('newPassword', password);

    fetch('forgot_process.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(response => {
      response = response.trim();

      if (response === 'error_required') {
        emailError.textContent = 'All fields are required.';
        return;
      }

      if (response === 'error_invalid_email') {
        emailError.textContent = 'Invalid email format.';
        emailInput.focus();
        return;
      }

      if (response === 'error_email_not_found') {
        emailError.textContent = 'Email not found. Please check and try again.';
        emailInput.focus();
        return;
      }

      if (response === 'error_update_failed') {
        showPopup('Password update failed. Please try again.');
        return;
      }

      if (response === 'success') {
        showPopup('Password reset successful! Redirecting to login...');
        popupBtn.onclick = () => {
          window.location.href = 'login.html';
        };
        return;
      }

      showPopup('Something went wrong. Please try again.');
    })
    .catch(() => {
      showPopup('Server error. Please try again.');
    });
  });
}
