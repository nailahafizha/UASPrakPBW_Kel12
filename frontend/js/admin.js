function escapeAdmin(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

let adminSubmissionCache = [];
let adminLocationCache = [];
let adminArticleCache = [];

function sanitizePhoneInput(input) {
  input.value = input.value.replace(/[^0-9-]/g, '');
}

function shortText(text, maxLength = 120) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trim() + '...';
}

async function adminStats() {
  try {
    const stats = await apiRequest('/admin/dashboard');
    const map = {
      totalUser: stats.total_user,
      totalPengajuan: stats.total_pengajuan,
      totalMenunggu: stats.total_pengajuan - stats.total_selesai,
      totalSelesai: stats.total_selesai,
      totalLokasi: stats.total_lokasi
    };

    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val ?? 0;
    });
  } catch {
    toast('Gagal memuat statistik dashboard.');
  }
}

function renderWasteChart() {
  const box = document.querySelector('#wasteChart');
  if (!box) return;

  const max = Math.max(1, ...WASTE_TYPES.map(type => {
    return adminSubmissionCache.filter(s => s.jenisKey === type.value).length;
  }));

  box.innerHTML = WASTE_TYPES.map(type => {
    const total = adminSubmissionCache.filter(s => s.jenisKey === type.value).length;
    const width = Math.max(8, (total / max) * 100);

    return `
      <div class="chart-row">
        <strong>${escapeAdmin(type.label)}</strong>
        <div class="chart-track"><span style="width:${width}%"></span></div>
        <b>${total}</b>
      </div>
    `;
  }).join('');
}

function renderStatusSummary() {
  const box = document.querySelector('#statusSummary');
  if (!box) return;

  const statuses = ['Menunggu Penyerahan', 'Diterima Lokasi', 'Selesai'];
  box.innerHTML = statuses.map(status => `
    <div class="status-summary-row">
      <span class="status ${statusClass(status)}">${escapeAdmin(status)}</span>
      <strong>${adminSubmissionCache.filter(item => item.status === status).length}</strong>
    </div>
  `).join('');
}

function renderRecentSubmissions() {
  const box = document.querySelector('#recentSubmissions');
  if (!box) return;

  const items = adminSubmissionCache.slice(0, 5);
  box.innerHTML = items.length ? items.map(item => `
    <div class="recent-item">
      <div>
        <strong>${escapeAdmin(item.kode)}</strong>
        <p>${escapeAdmin(item.user)} · ${escapeAdmin(item.jenis)}</p>
      </div>
      <span class="status ${statusClass(item.status)}">${escapeAdmin(item.status)}</span>
    </div>
  `).join('') : '<div class="empty-state">Belum ada pengajuan terbaru.</div>';
}

function submissionActions(s) {
  if (s.status === 'Menunggu Penyerahan') {
    return `
      <button class="btn btn-primary" onclick="setStatus(${s.id},'Diterima Lokasi')">Tandai Diterima</button>
      <button class="btn btn-danger" onclick="setStatus(${s.id},'Dibatalkan')">Batalkan</button>
    `;
  }

  if (s.status === 'Diterima Lokasi') {
    return `
      <button class="btn btn-primary" onclick="setStatus(${s.id},'Selesai')">Selesaikan</button>
      <button class="btn btn-danger" onclick="setStatus(${s.id},'Dibatalkan')">Batalkan</button>
    `;
  }

  return '';
}

async function loadAdminSubmissions() {
  const selectedStatus = document.querySelector('#submissionStatusFilter')?.value || 'Semua';
  let path = '/admin/submissions';

  if (selectedStatus !== 'Semua') {
    path += `?status=${encodeURIComponent(selectedStatus)}`;
  }

  try {
    const data = await apiRequest(path);
    adminSubmissionCache = data.map(mapSubmissionFromApi);
  } catch {
    adminSubmissionCache = [];
    toast('Gagal memuat data penyerahan.');
  }
}

async function renderSubmissions() {
  const body = document.querySelector('#adminSubmissionBody');
  if (!body) return;

  await loadAdminSubmissions();

  body.innerHTML = adminSubmissionCache.length ? adminSubmissionCache.map(s => `
    <tr>
      <td><strong>${escapeAdmin(s.kode)}</strong></td>
      <td>${escapeAdmin(s.user)}</td>
      <td>${escapeAdmin(s.jenis)}<br><small>${escapeAdmin(s.jumlah)} ${escapeAdmin(s.satuan)}</small></td>
      <td>${escapeAdmin(s.lokasi)}</td>
      <td>${escapeAdmin(formatDateIndonesia(s.jadwal))}</td>
      <td><span class="status ${statusClass(s.status)}">${escapeAdmin(s.status)}</span></td>
      <td class="actions submission-actions">
        <button class="btn btn-light" onclick='adminDetail(${JSON.stringify(s)})'>Detail</button>
        ${submissionActions(s)}
      </td>
    </tr>
  `).join('') : '<tr><td colspan="7" class="empty-state">Belum ada pengajuan.</td></tr>';

  renderWasteChart();
  renderStatusSummary();
  renderRecentSubmissions();
}

async function setStatus(id, status) {
  try {
    await apiRequest(`/admin/submissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });

    await renderSubmissions();
    await adminStats();
    toast('Status diperbarui menjadi ' + status);
  } catch (error) {
    toast(error.message || 'Gagal memperbarui status.');
  }
}

function adminDetail(s) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal">
      <div class="modal-card">
        <div class="modal-head">
          <h2>Detail Penyerahan</h2>
          <button class="close" onclick="this.closest('.modal').remove()">✕</button>
        </div>
        <div class="handover-code">
          <small>Kode Penyerahan</small>
          <strong>${escapeAdmin(s.kode)}</strong>
        </div>
        <div class="detail-box">
          <p><b>Nama User:</b> ${escapeAdmin(s.user)}</p>
          <p><b>Jenis:</b> ${escapeAdmin(s.jenis)}</p>
          <p><b>Jumlah:</b> ${escapeAdmin(s.jumlah)} ${escapeAdmin(s.satuan)}</p>
          <p><b>Lokasi:</b> ${escapeAdmin(s.lokasi)}</p>
          <p><b>Alamat:</b> ${escapeAdmin(s.alamatLokasi || '-')}</p>
          <p><b>Jadwal:</b> ${escapeAdmin(formatDateIndonesia(s.jadwal))}</p>
          <p><b>Status:</b> <span class="status ${statusClass(s.status)}">${escapeAdmin(s.status)}</span></p>
          <p><b>Catatan:</b> ${escapeAdmin(s.catatan)}</p>
        </div>
      </div>
    </div>
  `);
}

function renderLocationTypeOptions() {
  const box = document.querySelector('#locTypes');
  if (!box) return;

  box.innerHTML = WASTE_TYPES.map(type => `
    <label class="check-card">
      <input type="checkbox" name="acceptedType" value="${escapeAdmin(type.value)}">
      <span>${escapeAdmin(type.label)}</span>
    </label>
  `).join('');
}

function selectedLocationTypes() {
  return [...document.querySelectorAll('input[name="acceptedType"]:checked')].map(input => input.value);
}

function selectedLocationWasteTypeIds() {
  return selectedLocationTypes().map(wasteTypeId);
}

function selectedOperationalDays() {
  return [...document.querySelectorAll('input[name="locHari"]:checked')].map(input => input.value);
}

function setOperationalDays(days) {
  const selected = parseOperationalDays(days);
  document.querySelectorAll('input[name="locHari"]').forEach(input => {
    input.checked = selected.includes(input.value);
  });
  updateOperationalDaysText();
}

function updateOperationalDaysText() {
  const text = document.querySelector('#locHariText');
  if (!text) return;
  const days = selectedOperationalDays();
  text.textContent = days.length ? formatOperationalDays(days) : 'Pilih hari operasional';
}

function initOperationalDaysDropdown() {
  const dropdown = document.querySelector('#locHariDropdown');
  const toggle = document.querySelector('#locHariToggle');
  if (!dropdown || !toggle) return;

  toggle.addEventListener('click', () => {
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', event => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('open');
    }
  });

  document.querySelectorAll('input[name="locHari"]').forEach(input => {
    input.addEventListener('change', updateOperationalDaysText);
  });

  updateOperationalDaysText();
}

async function renderLocations() {
  const body = document.querySelector('#locationBody');
  if (!body) return;

  try {
    const data = await apiRequest('/locations');
    adminLocationCache = data.map(mapLocationFromApi);

    body.innerHTML = adminLocationCache.map(l => `
      <tr>
        <td>${escapeAdmin(l.nama)}</td>
        <td>${escapeAdmin(l.alamat)}</td>
        <td>${escapeAdmin(l.telepon)}</td>
        <td>${escapeAdmin(formatAcceptedTypes(l.acceptedTypes))}</td>
        <td>${escapeAdmin(l.hariOperasional)}<br><small>${escapeAdmin(l.jamOperasional)} · maks. ${escapeAdmin(l.batasHari)} hari</small></td>
        <td class="actions submission-actions">
          <button class="btn btn-light" data-edit-location="${l.id}">Edit</button>
          <button class="btn btn-danger" onclick="deleteLocation(${l.id})">Hapus</button>
        </td>
      </tr>
    `).join('');
  } catch {
    body.innerHTML = '<tr><td colspan="6" class="empty-state">Gagal memuat lokasi.</td></tr>';
  }
}

async function saveLocation(e) {
  e.preventDefault();

  const types = selectedLocationTypes();
  if (!types.length) {
    toast('Pilih minimal satu jenis limbah.');
    return;
  }

  const days = selectedOperationalDays();
  if (!days.length) {
    toast('Pilih minimal satu hari operasional.');
    return;
  }

  const jamBuka = locJamBuka.value;
  const jamTutup = locJamTutup.value;

  if (!jamBuka || !jamTutup) {
    toast('Isi jam buka dan jam tutup.');
    return;
  }

  if (jamTutup <= jamBuka) {
    toast('Jam tutup harus lebih besar dari jam buka.');
    return;
  }

  sanitizePhoneInput(locTelepon);
  if (!locTelepon.value.trim()) {
    toast('Nomor telepon hanya boleh berisi angka dan wajib diisi.');
    return;
  }

  const id = Number(locId.value);
  const payload = {
    nama_lokasi: locNama.value.trim(),
    alamat: locAlamat.value.trim(),
    telepon: locTelepon.value.trim(),
    hari_operasional: formatOperationalDays(days),
    jam_buka: `${jamBuka}:00`,
    jam_tutup: `${jamTutup}:00`,
    batas_hari: Number(locBatas.value),
    waste_type_ids: selectedLocationWasteTypeIds()
  };

  try {
    await apiRequest(id ? `/locations/${id}` : '/locations', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });

    e.target.reset();
    locId.value = '';
    locBatas.value = 14;
    document.querySelectorAll('input[name="acceptedType"], input[name="locHari"]').forEach(input => {
      input.checked = false;
    });
    updateOperationalDaysText();
    document.querySelector('#locHariDropdown')?.classList.remove('open');
    await renderLocations();
    toast('Data lokasi disimpan.');
  } catch (error) {
    toast(error.message || 'Gagal menyimpan lokasi.');
  }
}

function editLocationById(id) {
  const location = adminLocationCache.find(l => l.id === id);
  if (!location) return;

  locId.value = location.id;
  locNama.value = location.nama;
  locAlamat.value = location.alamat;
  locTelepon.value = location.telepon;
  locBatas.value = location.batasHari;
  locJamBuka.value = location.jamBuka || '08:00';
  locJamTutup.value = location.jamTutup || '15:00';

  setOperationalDays(location.hariList || location.hariOperasional);

  document.querySelectorAll('input[name="acceptedType"]').forEach(input => {
    input.checked = location.acceptedTypes.includes(input.value);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteLocation(id) {
  try {
    await apiRequest(`/locations/${id}`, { method: 'DELETE' });
    await renderLocations();
    await adminStats();
    toast('Lokasi dihapus.');
  } catch (error) {
    toast(error.message || 'Gagal menghapus lokasi.');
  }
}

function renderArticleCategoryOptions() {
  const selects = document.querySelectorAll('[data-category-select]');
  selects.forEach(select => {
    const categories = select.id === 'articleKategori'
      ? CATEGORIES.filter(category => category !== 'Semua')
      : CATEGORIES;

    select.innerHTML = categories.map(category => `
      <option value="${escapeAdmin(category)}">${escapeAdmin(category)}</option>
    `).join('');
  });
}

function showArticleDetail(article) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal">
      <div class="modal-card modal-card-large">
        <div class="modal-head">
          <h2>${escapeAdmin(article.judul)}</h2>
          <button class="close" onclick="this.closest('.modal').remove()">✕</button>
        </div>
        <span class="pill article-pill">${escapeAdmin(article.kategori)}</span>
        <div class="detail-box article-full-text">
          <p>${escapeAdmin(article.isi)}</p>
        </div>
      </div>
    </div>
  `);
}

async function renderEduAdmin() {
  const body = document.querySelector('#articleBody');
  if (!body) return;

  const selected = document.querySelector('#articleFilter')?.value || 'Semua';
  let path = '/articles';

  if (selected !== 'Semua') {
    path += `?kategori=${encodeURIComponent(selected)}`;
  }

  try {
    adminArticleCache = await apiRequest(path);

    body.innerHTML = adminArticleCache.length ? adminArticleCache.map(a => `
      <tr>
        <td>${escapeAdmin(a.judul)}</td>
        <td>${escapeAdmin(a.kategori)}</td>
        <td>
          <p class="table-preview-text">${escapeAdmin(shortText(a.isi, 130))}</p>
          ${String(a.isi || '').length > 130 ? `<button class="link-button" data-view-article="${a.id}" type="button">Lihat selengkapnya</button>` : ''}
        </td>
        <td class="actions submission-actions">
          <button class="btn btn-light" data-edit-article="${a.id}">Edit</button>
          <button class="btn btn-danger" onclick="deleteArticle(${a.id})">Hapus</button>
        </td>
      </tr>
    `).join('') : '<tr><td colspan="4" class="empty-state">Belum ada artikel pada kategori ini.</td></tr>';
  } catch {
    body.innerHTML = '<tr><td colspan="4" class="empty-state">Gagal memuat artikel.</td></tr>';
  }
}

async function saveArticle(e) {
  e.preventDefault();

  const id = Number(articleId.value);
  const payload = {
    judul: articleJudul.value.trim(),
    kategori: articleKategori.value,
    isi: articleIsi.value.trim()
  };

  try {
    await apiRequest(id ? `/articles/${id}` : '/articles', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });

    e.target.reset();
    articleId.value = '';
    await renderEduAdmin();
    toast('Artikel disimpan.');
  } catch (error) {
    toast(error.message || 'Gagal menyimpan artikel.');
  }
}

function editArticleById(id) {
  const a = adminArticleCache.find(item => item.id === id);
  if (!a) return;

  articleId.value = a.id;
  articleJudul.value = a.judul;
  articleKategori.value = a.kategori;
  articleIsi.value = a.isi;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteArticle(id) {
  try {
    await apiRequest(`/articles/${id}`, { method: 'DELETE' });
    await renderEduAdmin();
    toast('Artikel dihapus.');
  } catch (error) {
    toast(error.message || 'Gagal menghapus artikel.');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireAdmin()) return;

  renderLocationTypeOptions();
  initOperationalDaysDropdown();
  renderArticleCategoryOptions();

  await loadAdminSubmissions();
  adminStats();
  renderWasteChart();
  renderStatusSummary();
  renderRecentSubmissions();
  renderSubmissions();
  renderLocations();
  renderEduAdmin();

  document.querySelector('#locationForm')?.addEventListener('submit', saveLocation);
  document.querySelector('#locTelepon')?.addEventListener('input', event => sanitizePhoneInput(event.target));
  document.querySelector('#articleForm')?.addEventListener('submit', saveArticle);
  document.querySelector('#articleFilter')?.addEventListener('change', renderEduAdmin);
  document.querySelector('#submissionStatusFilter')?.addEventListener('change', renderSubmissions);

  document.querySelector('#locationBody')?.addEventListener('click', event => {
    const button = event.target.closest('[data-edit-location]');
    if (button) editLocationById(Number(button.dataset.editLocation));
  });

  document.querySelector('#articleBody')?.addEventListener('click', event => {
    const editButton = event.target.closest('[data-edit-article]');
    if (editButton) {
      editArticleById(Number(editButton.dataset.editArticle));
      return;
    }

    const viewButton = event.target.closest('[data-view-article]');
    if (viewButton) {
      const article = adminArticleCache.find(item => item.id === Number(viewButton.dataset.viewArticle));
      if (article) showArticleDetail(article);
    }
  });
});
