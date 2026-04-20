document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const clearBtn = document.getElementById('clearBtn');

  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  const upsiRadio = document.getElementById('upsi');
  const publicRadio = document.getElementById('public');

  function clearErrors(){
    emailError.textContent = '';
    passwordError.textContent = '';
  }

  function scrollTo(el){
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ✅ AUTO DETECT USER CATEGORY
  emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();

    if (email.endsWith('upsi.edu.my')) {
      upsiRadio.checked = true;
      publicRadio.checked = false;
    } else if (email.includes('@')) {
      publicRadio.checked = true;
      upsiRadio.checked = false;
    }
  });

  // ✅ CLEAR BUTTON
  clearBtn.addEventListener('click', () => {
    form.reset();
    clearErrors();
  });

  // ✅ AUTO CLEAR ERROR
  emailInput.addEventListener('input', () => emailError.textContent = '');
  passwordInput.addEventListener('input', () => passwordError.textContent = '');

  // ✅ SUBMIT LOGIN
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email) {
      emailError.textContent = 'Email is required.';
      scrollTo(emailInput);
      emailInput.focus();
      return;
    }

    if (!password) {
      passwordError.textContent = 'Password is required.';
      scrollTo(passwordInput);
      passwordInput.focus();
      return;
    }
	
    const formData = new FormData(form);

    fetch('login_process.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(response => {
      response = response.trim();

      if (response === 'error_email_not_found') {
        emailError.textContent = 'Email not found.';
        scrollTo(emailInput);
        emailInput.focus();
        return;
      }

      if (response === 'error_wrong_password') {
        passwordError.textContent = 'Incorrect password.';
        passwordInput.value = '';
        scrollTo(passwordInput);
        passwordInput.focus();
        return;
      }

      if (response === 'success') {

  const params = new URLSearchParams(window.location.search);
  const nextPage = params.get("next");

  if (nextPage === "review") {
    window.location.href = "review.php";
  } else {
    window.location.href = "../html/bookingGlamping.php";
  }

  return;
}

      alert('Something went wrong. Please try again.');
    })
    .catch(() => {
      alert('Server error. Please try again.');
    });
  
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

