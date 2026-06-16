function showAuthError(form, message) {
  let box = form.querySelector('.form-error');

  if (!box) {
    box = document.createElement('p');
    box.className = 'form-error';
    form.prepend(box);
  }

  box.textContent = message;
}

function clearAuthError(form) {
  const box = form.querySelector('.form-error');
  if (box) box.remove();
}

document.addEventListener('submit', async event => {
  const form = event.target;

  if (form.dataset.auth === 'user-login') {
    event.preventDefault();
    clearAuthError(form);

    const email = normalizeEmail(form.elements.email.value);
    const password = form.elements.password.value;

    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      setCurrentUser(result.user);
      location.href = 'dashboard.html';
    } catch (error) {
      showAuthError(form, error.message || 'Email atau password salah.');
    }
  }

  if (form.dataset.auth === 'register') {
    event.preventDefault();
    clearAuthError(form);

    const nama = form.elements.nama.value.trim();
    const email = normalizeEmail(form.elements.email.value);
    const nomor_hp = form.elements.hp.value.trim();
    const password = form.elements.password.value;

    if (password.length < 8) {
      showAuthError(form, 'Password minimal 8 karakter.');
      return;
    }

    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nama, email, nomor_hp, password })
      });

      toast('Registrasi berhasil. Silakan login.');
      setTimeout(() => location.href = 'login.html', 700);
    } catch (error) {
      showAuthError(form, error.message || 'Registrasi gagal.');
    }
  }

  if (form.dataset.auth === 'forgot') {
    event.preventDefault();
    toast('Link reset password dikirim ke email.');
  }

  if (form.dataset.auth === 'admin-login') {
    event.preventDefault();
    clearAuthError(form);

    const email = normalizeEmail(form.elements.email.value);
    const password = form.elements.password.value;

    try {
      const result = await apiRequest('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      setCurrentAdmin(result.admin);
      location.href = 'dashboard.html';
    } catch (error) {
      showAuthError(form, error.message || 'Email atau password admin salah.');
    }
  }
});

document.addEventListener('click', event => {
  const logout = event.target.closest('[data-logout]');
  if (!logout) return;

  event.preventDefault();
  sessionStorage.removeItem(USER_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  location.href = logout.getAttribute('href');
});
