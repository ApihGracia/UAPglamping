document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('signupForm');
  const clearBtn = document.getElementById('clearBtn');

  /* ===== POPUP ===== */
  const popupOverlay = document.getElementById('popupOverlay');
  const popupMessage = document.getElementById('popupMessage');
  const popupBtn = document.getElementById('popupBtn');

  /* ===== INPUTS ===== */
  const emailInput = document.getElementById('email');
  const nameInput = document.getElementById('fullname');
  const phoneInput = document.getElementById('phone');
  const addressInput = document.getElementById('address');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm_password');

  /* ===== ERROR TEXT ===== */
  const emailError = document.getElementById('emailError');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const addressError = document.getElementById('addressError');
  const passwordError = document.getElementById('passwordError');
  const confirmError = document.getElementById('confirmError');
  const genderError = document.getElementById('genderError');

  /* ===== HELPERS ===== */
  function showPopup(message){
    popupMessage.textContent = message;
    popupOverlay.style.display = 'flex';
  }

  popupBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
  });

  function clearErrors(){
    emailError.textContent = '';
    nameError.textContent = '';
    phoneError.textContent = '';
    addressError.textContent = '';
    passwordError.textContent = '';
    confirmError.textContent = '';
    genderError.textContent = '';
  }

  function scrollTo(el){
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ===== CLEAR BUTTON ===== */
  clearBtn.addEventListener('click', () => {
    form.reset();
    clearErrors();
  });

  /* ===== SUBMIT ===== */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const email = emailInput.value.trim();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();
    const genderEl = document.querySelector('input[name="gender"]:checked');

    /* ===== REQUIRED ===== */
    if (!email) {
      emailError.textContent = 'Email is required.';
      scrollTo(emailInput); emailInput.focus(); return;
    }
	// ✅ EMAIL FORMAT VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
       emailError.textContent = 'Please enter a valid email address.';
       scrollTo(emailInput);
       emailInput.focus();
    return;
    } 


    if (!name) {
      nameError.textContent = 'Full name is required.';
      scrollTo(nameInput); nameInput.focus(); return;
    }

    if (!genderEl) {
      genderError.textContent = 'Please select your gender.';
      const genderGroup = document.querySelector('.gender-group');
      scrollTo(genderGroup);
      return;
    }

    if (!phone) {
      phoneError.textContent = 'Phone number is required.';
      scrollTo(phoneInput); phoneInput.focus(); return;
    }

    if (!address) {
      addressError.textContent = 'Address is required.';
      scrollTo(addressInput); addressInput.focus(); return;
    }

    if (!password) {
      passwordError.textContent = 'Password is required.';
      scrollTo(passwordInput); passwordInput.focus(); return;
    }

    if (!confirmPassword) {
      confirmError.textContent = 'Please confirm your password.';
      scrollTo(confirmInput); confirmInput.focus(); return;
    }

    if (password !== confirmPassword) {
      confirmError.textContent = 'Passwords do not match.';
      confirmInput.value = '';
      scrollTo(confirmInput); confirmInput.focus(); return;
    }

    /* ===== SEND TO PHP ===== */
    const formData = new FormData(form);

    fetch('signup_process.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(response => {
      response = response.trim();

      if (response === 'error_email_exists') {
        emailError.textContent = 'This email is already registered.';
        emailInput.value = '';
        emailInput.focus();
        scrollTo(emailInput);
        return;
      }

      if (response === 'success') {
        showPopup('Registration successful!');
		popupBtn.onclick = null;
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
  
  // ===== AUTO CLEAR ERROR WHEN USER FIXES INPUT =====
emailInput.addEventListener('input', () => emailError.textContent = '');
nameInput.addEventListener('input', () => nameError.textContent = '');
phoneInput.addEventListener('input', () => phoneError.textContent = '');
addressInput.addEventListener('input', () => addressError.textContent = '');
passwordInput.addEventListener('input', () => passwordError.textContent = '');
confirmInput.addEventListener('input', () => confirmError.textContent = '');

document.querySelectorAll('input[name="gender"]').forEach(radio => {
  radio.addEventListener('change', () => genderError.textContent = '');
});

// ===== BRAND SHRINK WHEN SCROLL =====
const floatingBar = document.querySelector('.floating-bar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    floatingBar.classList.add('shrink');
  } else {
    floatingBar.classList.remove('shrink');
  }
});

});
