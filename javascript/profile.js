document.addEventListener('DOMContentLoaded', function () {

  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  const nameInput = document.getElementById('name');
  const genderSelect = document.getElementById('gender');
  const phoneInput = document.getElementById('phone');
  const addressInput = document.getElementById('address');

  // 🔒 Simpan data asal (untuk Cancel)
  const originalData = {
    name: nameInput.value,
    gender: genderSelect.value,
    phone: phoneInput.value,
    address: addressInput.value
  };

  // =====================
  // EDIT PROFILE
  // =====================
  editBtn.addEventListener('click', () => {
    nameInput.readOnly = false;
    phoneInput.readOnly = false;
    addressInput.readOnly = false;
    genderSelect.disabled = false;

    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
  });

  // =====================
  // CANCEL EDIT
  // =====================
  cancelBtn.addEventListener('click', () => {
    // revert data
    nameInput.value = originalData.name;
    genderSelect.value = originalData.gender;
    phoneInput.value = originalData.phone;
    addressInput.value = originalData.address;

    // lock semula
    nameInput.readOnly = true;
    phoneInput.readOnly = true;
    addressInput.readOnly = true;
    genderSelect.disabled = true;

    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
  });
  
  saveBtn.addEventListener('click', () => {

  const formData = new FormData();
  formData.append('name', nameInput.value.trim());
  formData.append('gender', genderSelect.value);
  formData.append('phone', phoneInput.value.trim());
  formData.append('address', addressInput.value.trim());

  fetch('update_profile.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.text())
  .then(response => {

    if (response === 'success') {

      // lock balik input
      nameInput.readOnly = true;
      phoneInput.readOnly = true;
      addressInput.readOnly = true;
      genderSelect.disabled = true;

      // update data asal
      originalData.name = nameInput.value;
      originalData.gender = genderSelect.value;
      originalData.phone = phoneInput.value;
      originalData.address = addressInput.value;

      editBtn.style.display = 'inline-block';
      saveBtn.style.display = 'none';
      cancelBtn.style.display = 'none';

      document.getElementById('successMsg').style.display = 'block';
	  setTimeout(() => {
      document.getElementById('successMsg').style.display = 'none';
      }, 1500);

      document.getElementById('errorMsg').style.display = 'none';

    } else {
      document.getElementById('errorMsg').style.display = 'block';
      document.getElementById('successMsg').style.display = 'none';
    }

  })
  .catch(() => {
    document.getElementById('errorMsg').style.display = 'block';
    document.getElementById('successMsg').style.display = 'none';
  });

});


});
