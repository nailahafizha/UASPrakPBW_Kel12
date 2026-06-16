let activeUser = null;
let activeArticleFilter = 'Semua';
let articleCache = [];
let locationCache = [];
let submissionCache = [];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

function renderUserIdentity() {
  document.querySelectorAll('[data-user-name]').forEach(el => {
    el.textContent = activeUser.nama;
  });

  const firstName = activeUser.nama.trim().split(/\s+/)[0];
  document.querySelectorAll('[data-user-first-name]').forEach(el => {
    el.textContent = firstName;
  });
}

function articleIcon(category) {
  if (category === 'Limbah Benda Tajam') return '💉';
  if (category === 'Limbah Farmasi') return '💊';
  if (category === 'Limbah Padat Infeksius') return '😷';
  return '🌱';
}

function shortText(text, maxLength = 140) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trim() + '...';
}

function showArticleDetail(article) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal">
      <div class="modal-card modal-card-large">
        <div class="modal-head">
          <h2>${escapeHtml(article.judul)}</h2>
          <button class="close" onclick="this.closest('.modal').remove()">✕</button>
        </div>
        <div class="article-img modal-article-icon">${articleIcon(article.kategori)}</div>
        <span class="pill article-pill">${escapeHtml(article.kategori)}</span>
        <div class="detail-box article-full-text">
          <p>${escapeHtml(article.isi)}</p>
        </div>
      </div>
    </div>
  `);
}

function renderArticleFilters() {
  const filterBox = document.querySelector('#articleFilters');
  if (!filterBox) return;

  const urlCategory = new URLSearchParams(location.search).get('kategori');
  if (urlCategory) activeArticleFilter = urlCategory;

  filterBox.innerHTML = CATEGORIES.map(category => `
    <button class="filter-chip ${category === activeArticleFilter ? 'active' : ''}" data-article-filter="${escapeHtml(category)}" type="button">
      ${escapeHtml(category)}
    </button>
  `).join('');
}

async function renderArticles() {
  const box = document.querySelector('#articles');
  if (!box) return;

  try {
    let path = '/articles';
    if (activeArticleFilter && activeArticleFilter !== 'Semua') {
      path += `?kategori=${encodeURIComponent(activeArticleFilter)}`;
    }

    articleCache = await apiRequest(path);

    box.innerHTML = articleCache.length ? articleCache.map(article => `
      <article class="card article-card">
        <div class="article-img">${articleIcon(article.kategori)}</div>
        <span class="pill article-pill">${escapeHtml(article.kategori)}</span>
        <h3>${escapeHtml(article.judul)}</h3>
        <p>${escapeHtml(shortText(article.isi, 145))}</p>
        ${String(article.isi || '').length > 145 ? `<button class="link-button" data-view-article="${article.id}" type="button">Lihat selengkapnya</button>` : ''}
      </article>
    `).join('') : '<div class="card empty-state">Belum ada artikel pada kategori ini.</div>';
  } catch (error) {
    box.innerHTML = '<div class="card empty-state">Gagal memuat artikel dari database.</div>';
  }
}

function fillWasteTypes() {
  const select = document.querySelector('#jenis');
  if (!select) return;

  select.innerHTML = WASTE_TYPES.map(type => `
    <option value="${escapeHtml(type.value)}">${escapeHtml(type.label)}</option>
  `).join('');

  updateQuantityLimit();
}

async function loadLocations() {
  try {
    const locations = await apiRequest('/locations');
    locationCache = locations.map(mapLocationFromApi);
  } catch (error) {
    locationCache = [];
    toast('Gagal memuat lokasi dari database.');
  }
}

function fillLocations() {
  const select = document.querySelector('#lokasi');
  if (!select) return;

  const selectedType = document.querySelector('#jenis')?.value;
  const matching = locationCache.filter(location => location.acceptedTypes.includes(selectedType));

  select.innerHTML = '<option value="">Pilih lokasi penerima</option>' + matching.map(location => `
    <option value="${location.id}">${escapeHtml(location.nama)} — ${escapeHtml(location.alamat)}</option>
  `).join('');

  const hint = document.querySelector('#locationFilterHint');
  if (hint) {
    hint.textContent = matching.length
      ? `${matching.length} lokasi menerima ${wasteLabel(selectedType)}.`
      : 'Belum ada lokasi yang menerima jenis limbah ini.';
  }

  renderSelectedLocation();
}

function getAllowedWeekdays(location) {
  const days = parseOperationalDays(location?.hariOperasional || '');
  const map = {
    Minggu: 0,
    Senin: 1,
    Selasa: 2,
    Rabu: 3,
    Kamis: 4,
    Jumat: 5,
    Sabtu: 6
  };

  return days.map(day => map[day]).filter(day => day !== undefined);
}

function isOperationalDate(dateValue, location) {
  if (!dateValue || !location) return false;
  const day = new Date(`${dateValue}T00:00:00`).getDay();
  return getAllowedWeekdays(location).includes(day);
}

function selectedLocation() {
  return locationCache.find(item => item.id === Number(document.querySelector('#lokasi')?.value));
}

function validateSelectedSchedule(showMessage = true) {
  const schedule = document.querySelector('#jadwal');
  const location = selectedLocation();
  if (!schedule || !schedule.value || !location) return true;

  if (!isOperationalDate(schedule.value, location)) {
    if (showMessage) {
      toast(`Jadwal tidak sesuai hari operasional lokasi. Pilih hari: ${location.hariOperasional}.`);
    }
    schedule.value = '';
    return false;
  }

  return true;
}

function updateScheduleLimit(location) {
  const input = document.querySelector('#jadwal');
  const hint = document.querySelector('#scheduleHint');
  if (!input) return;

  if (!location) {
    input.value = '';
    input.removeAttribute('min');
    input.removeAttribute('max');
    input.disabled = true;
    if (hint) hint.textContent = 'Pilih lokasi terlebih dahulu untuk melihat batas jadwal.';
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + Number(location.batasHari || 14));

  input.disabled = false;
  input.min = dateInputValue(today);
  input.max = dateInputValue(maxDate);

  if (input.value && (input.value < input.min || input.value > input.max)) {
    input.value = '';
  }

  if (hint) {
    hint.textContent = `Tersedia ${location.hariOperasional}, pukul ${location.jamOperasional}. Pilih tanggal sesuai hari operasional sampai maksimal ${formatDateIndonesia(input.max)}.`;
  }
}

function renderSelectedLocation() {
  const select = document.querySelector('#lokasi');
  const box = document.querySelector('#locationDetail');
  if (!select || !box) return;

  const location = locationCache.find(item => item.id === Number(select.value));
  updateScheduleLimit(location);

  if (!location) {
    box.innerHTML = '<span class="muted">Pilih lokasi untuk melihat alamat dan jadwal operasional.</span>';
    return;
  }

  box.innerHTML = `
    <h3>${escapeHtml(location.nama)}</h3>
    <p>${escapeHtml(location.alamat)}</p>
    <small>Telepon: ${escapeHtml(location.telepon)} · ${escapeHtml(location.hariOperasional)}, ${escapeHtml(location.jamOperasional)}</small>
    <small>Menerima: ${escapeHtml(formatAcceptedTypes(location.acceptedTypes))}</small>
  `;
}

function updateQuantityLimit() {
  const input = document.querySelector('#jumlah');
  const hint = document.querySelector('#quantityHint');
  const unitInput = document.querySelector('#satuan');
  const unitDisplay = document.querySelector('#satuanDisplay');
  const typeKey = document.querySelector('#jenis')?.value || 'Sharps';
  const limit = getQuantityLimit(typeKey);

  if (input) {
    input.min = 1;
    input.max = limit.max;
    if (Number(input.value) > limit.max) input.value = limit.max;
  }

  if (unitInput) unitInput.value = limit.unit;
  if (unitDisplay) unitDisplay.value = limit.unit;

  if (hint) {
    hint.textContent = `${limit.unitHint} Jika lebih banyak, hubungi fasilitas kesehatan terlebih dahulu.`;
  }
}

function validateQuantity(typeKey) {
  const input = document.querySelector('#jumlah');
  const value = Number(input?.value);
  const limit = getQuantityLimit(typeKey);

  if (!Number.isFinite(value) || value < 1) {
    toast('Jumlah minimal 1.');
    return false;
  }

  if (value > limit.max) {
    toast(`Jumlah melebihi batas rumah tangga. Maksimal ${limit.max}.`);
    return false;
  }

  return true;
}

function showPackagingModal(typeKey, kode) {
  const limit = getQuantityLimit(typeKey);
  const category = wasteCategory(typeKey);

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal">
      <div class="modal-card">
        <div class="modal-head">
          <h2>Pengajuan Berhasil Disimpan</h2>
          <button class="close" onclick="this.closest('.modal').remove()">✕</button>
        </div>
        <div class="handover-code">
          <small>Kode Penyerahan</small>
          <strong>${escapeHtml(kode)}</strong>
          <span>Tunjukkan kode ini saat menyerahkan limbah.</span>
        </div>
        <div class="detail-box packaging-box">
          <h3>Cara pembungkusan ${escapeHtml(category)}</h3>
          <p>${escapeHtml(limit.packaging)}</p>
        </div>
        <div class="modal-actions">
          <a class="btn btn-primary" href="edukasi.html?kategori=${encodeURIComponent(category)}">Baca Edukasi Terkait</a>
          <button class="btn btn-light" onclick="this.closest('.modal').remove()">Tutup</button>
        </div>
      </div>
    </div>
  `);
}

async function submitWaste(e) {
  e.preventDefault();

  const typeKey = document.querySelector('#jenis').value;
  const location = selectedLocation();

  if (!validateQuantity(typeKey)) return;
  if (!location) {
    toast('Silakan pilih lokasi penerima.');
    return;
  }
  if (!location.acceptedTypes.includes(typeKey)) {
    toast('Lokasi ini tidak menerima jenis limbah yang dipilih.');
    return;
  }

  const schedule = document.querySelector('#jadwal');
  if (!schedule.value) {
    toast('Silakan pilih jadwal penyerahan.');
    return;
  }
  if (schedule.value < schedule.min || schedule.value > schedule.max) {
    toast('Jadwal berada di luar batas yang ditentukan lokasi.');
    return;
  }
  if (!isOperationalDate(schedule.value, location)) {
    toast(`Jadwal tidak sesuai hari operasional lokasi. Pilih hari: ${location.hariOperasional}.`);
    return;
  }

  const payload = {
    user_id: activeUser.id,
    waste_type_id: wasteTypeId(typeKey),
    location_id: location.id,
    jumlah: Number(document.querySelector('#jumlah').value),
    satuan: document.querySelector('#satuan').value,
    jadwal_penyerahan: schedule.value,
    catatan: document.querySelector('#catatan').value.trim() || '-'
  };

  try {
    const result = await apiRequest('/submissions', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    e.target.reset();
    fillWasteTypes();
    fillLocations();
    renderHistory();
    showPackagingModal(typeKey, result.kode_penyerahan);
  } catch (error) {
    toast(error.message || 'Gagal menyimpan pengajuan.');
  }
}

async function renderHistory() {
  const body = document.querySelector('#historyBody');
  if (!body) return;

  try {
    const data = await apiRequest(`/submissions/user/${activeUser.id}`);
    submissionCache = data.map(mapSubmissionFromApi);

    body.innerHTML = submissionCache.length ? submissionCache.map(s => `
      <tr>
        <td><strong>${escapeHtml(s.kode)}</strong></td>
        <td>${escapeHtml(s.jenis)}<br><small>${escapeHtml(s.jumlah)} ${escapeHtml(s.satuan)}</small></td>
        <td>${escapeHtml(s.lokasi)}<br><small>${escapeHtml(s.alamatLokasi || '')}</small></td>
        <td>${escapeHtml(formatDateIndonesia(s.jadwal))}</td>
        <td><span class="status ${statusClass(s.status)}">${escapeHtml(s.status)}</span></td>
        <td><button class="btn btn-light" data-detail-id="${s.id}">Detail</button></td>
      </tr>
    `).join('') : '<tr><td colspan="6" class="empty-state">Belum ada riwayat penyerahan.</td></tr>';
  } catch (error) {
    body.innerHTML = '<tr><td colspan="6" class="empty-state">Gagal memuat riwayat.</td></tr>';
  }
}

function showDetail(s) {
  const steps = ['Menunggu Penyerahan', 'Diterima Lokasi', 'Selesai'];
  const current = Math.max(0, steps.indexOf(s.status));
  const timeline = steps.map((step, index) => `
    <div class="timeline-step ${index <= current ? 'active' : ''}">
      <span>${index + 1}</span>
      <small>${escapeHtml(step)}</small>
    </div>
  `).join('');

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal">
      <div class="modal-card">
        <div class="modal-head">
          <h2>Detail Penyerahan</h2>
          <button class="close" onclick="this.closest('.modal').remove()">✕</button>
        </div>
        <div class="handover-code">
          <small>Kode Penyerahan</small>
          <strong>${escapeHtml(s.kode)}</strong>
          <span>Tunjukkan kode ini saat menyerahkan limbah.</span>
        </div>
        <div class="status-timeline">${timeline}</div>
        <div class="detail-box">
          <p><b>Jenis:</b> ${escapeHtml(s.jenis)}</p>
          <p><b>Jumlah:</b> ${escapeHtml(s.jumlah)} ${escapeHtml(s.satuan)}</p>
          <p><b>Lokasi:</b> ${escapeHtml(s.lokasi)}</p>
          <p><b>Alamat:</b> ${escapeHtml(s.alamatLokasi || '-')}</p>
          <p><b>Jadwal:</b> ${escapeHtml(formatDateIndonesia(s.jadwal))}</p>
          <p><b>Status:</b> <span class="status ${statusClass(s.status)}">${escapeHtml(s.status)}</span></p>
          <p><b>Catatan:</b> ${escapeHtml(s.catatan)}</p>
        </div>
      </div>
    </div>
  `);
}

function fillProfile() {
  const form = document.querySelector('#profileForm');
  if (!form) return;

  form.elements.nama.value = activeUser.nama;
  form.elements.email.value = activeUser.email;
  form.elements.hp.value = activeUser.nomor_hp || activeUser.hp || '';
}

async function updateProfile(e) {
  e.preventDefault();

  const payload = {
    nama: e.target.elements.nama.value.trim(),
    email: normalizeEmail(e.target.elements.email.value),
    nomor_hp: e.target.elements.hp.value.trim()
  };

  try {
    const result = await apiRequest(`/auth/profile/${activeUser.id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });

    setCurrentUser(result.user);
    activeUser = result.user;

    renderUserIdentity();
    fillProfile();

    toast("Profil berhasil diperbarui.");
  } catch (error) {
    toast(error.message || "Gagal memperbarui profil.");
  }
}

function openPasswordModal() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal" id="passwordModal">
      <div class="modal-card">
        <div class="modal-head">
          <h2>Ganti Password</h2>
          <button class="close" onclick="this.closest('.modal').remove()">✕</button>
        </div>
        <form id="passwordForm">
          <div class="form-group">
            <label>Password Lama</label>
            <input name="oldPassword" type="password" required>
          </div>
          <div class="form-group">
            <label>Password Baru</label>
            <input name="newPassword" type="password" minlength="8" required>
          </div>
          <div class="form-group">
            <label>Konfirmasi Password</label>
            <input name="confirmPassword" type="password" minlength="8" required>
          </div>
          <button class="btn btn-primary btn-full">Simpan Password</button>
        </form>
      </div>
    </div>
  `);
}

async function changePassword(e) {
  e.preventDefault();

  const payload = {
    oldPassword: e.target.elements.oldPassword.value,
    newPassword: e.target.elements.newPassword.value,
    confirmPassword: e.target.elements.confirmPassword.value
  };

  try {
    await apiRequest(`/auth/change-password/${activeUser.id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });

    toast("Password berhasil diganti.");
    e.target.closest(".modal")?.remove();
  } catch (error) {
    toast(error.message || "Gagal mengganti password.");
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  activeUser = requireUser();
  if (!activeUser) return;

  renderUserIdentity();
  renderArticleFilters();
  renderArticles();
  fillWasteTypes();
  await loadLocations();
  fillLocations();
  renderHistory();
  fillProfile();

  document.querySelector('#jenis')?.addEventListener('change', () => {
    updateQuantityLimit();
    fillLocations();
  });

  document.querySelector('#lokasi')?.addEventListener('change', renderSelectedLocation);
  document.querySelector('#jadwal')?.addEventListener('change', () => validateSelectedSchedule(true));
  document.querySelector('#wasteForm')?.addEventListener('submit', submitWaste);
  document.querySelector('#profileForm')?.addEventListener('submit', updateProfile);
  document.querySelector('#openPasswordModal')?.addEventListener('click', openPasswordModal);

  document.addEventListener('submit', event => {
    if (event.target?.id === 'passwordForm') changePassword(event);
  });

  document.querySelector('#historyBody')?.addEventListener('click', event => {
    const button = event.target.closest('[data-detail-id]');
    if (!button) return;
    const item = submissionCache.find(s => s.id === Number(button.dataset.detailId));
    if (item) showDetail(item);
  });

  document.querySelector('#articleFilters')?.addEventListener('click', event => {
    const button = event.target.closest('[data-article-filter]');
    if (!button) return;
    activeArticleFilter = button.dataset.articleFilter;
    renderArticleFilters();
    renderArticles();
  });

  document.querySelector('#articles')?.addEventListener('click', event => {
    const button = event.target.closest('[data-view-article]');
    if (!button) return;
    const article = articleCache.find(item => item.id === Number(button.dataset.viewArticle));
    if (article) showArticleDetail(article);
  });
});
