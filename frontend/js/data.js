const API_BASE_URL = 'http://localhost:3000/api';

const USER_SESSION_KEY = 'medwaste_user_session';
const ADMIN_SESSION_KEY = 'medwaste_admin_session';

const CATEGORIES = [
  'Semua',
  'Limbah Benda Tajam',
  'Limbah Farmasi',
  'Limbah Padat Infeksius',
  'Lingkungan'
];

const HOUSEHOLD_LIMITS = {
  Sharps: {
    id: 1,
    max: 20,
    unitHint: 'Maksimal 20 item benda tajam rumah tangga.',
    unit: 'kotak/wadah keras',
    packaging: 'Masukkan jarum, lancet, ampul kecil, atau benda tajam lain ke dalam kotak/wadah keras yang tidak mudah tembus. Tutup rapat sebelum diserahkan.'
  },
  Infeksius: {
    id: 2,
    max: 5,
    unitHint: 'Maksimal 5 kantong kuning ukuran kecil untuk limbah infeksius rumah tangga.',
    unit: 'kantong kuning',
    packaging: 'Masukkan masker, sarung tangan, kapas, kasa, perban, atau alat tes bekas ke kantong kuning atau kantong tertutup. Ikat rapat agar tidak tercecer.'
  },
  Farmasi: {
    id: 3,
    max: 10,
    unitHint: 'Maksimal 10 item obat rumah tangga.',
    unit: 'kantong cokelat',
    packaging: 'Kumpulkan obat kedaluwarsa atau sisa obat ke kantong cokelat/wadah tertutup. Lepaskan data pribadi pada kemasan sebelum diserahkan.'
  }
};

const WASTE_TYPES = [
  { value: 'Sharps', id: 1, label: 'Limbah Benda Tajam', category: 'Limbah Benda Tajam' },
  { value: 'Infeksius', id: 2, label: 'Limbah Padat Infeksius', category: 'Limbah Padat Infeksius' },
  { value: 'Farmasi', id: 3, label: 'Limbah Farmasi', category: 'Limbah Farmasi' }
];

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Terjadi kesalahan pada server.');
  }

  return data;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

function setCurrentUser(user) {
  sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function setCurrentAdmin(admin) {
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
  sessionStorage.removeItem(USER_SESSION_KEY);
}

function getCurrentUser() {
  const saved = sessionStorage.getItem(USER_SESSION_KEY);
  return saved ? JSON.parse(saved) : null;
}

function getCurrentAdmin() {
  const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
  return saved ? JSON.parse(saved) : null;
}

function requireUser() {
  const user = getCurrentUser();
  if (!user) {
    location.replace('login.html');
    return null;
  }
  return user;
}

function requireAdmin() {
  const admin = getCurrentAdmin();
  if (!admin) {
    location.replace('login-admin.html');
    return null;
  }
  return admin;
}

function statusClass(status) {
  if (status === 'Selesai') return 'done';
  if (status === 'Diterima Lokasi') return 'received';
  if (status === 'Dibatalkan') return 'cancel';
  return 'waiting';
}

function wasteLabel(key) {
  return WASTE_TYPES.find(type => type.value === key)?.label || key;
}

function wasteCategory(key) {
  return WASTE_TYPES.find(type => type.value === key)?.category || key;
}

function wasteTypeId(key) {
  return HOUSEHOLD_LIMITS[key]?.id || 1;
}

function wasteKeyFromId(id) {
  return WASTE_TYPES.find(type => Number(type.id) === Number(id))?.value || 'Sharps';
}

function inferWasteKey(text) {
  const value = String(text || '').toLowerCase();

  if (value.includes('tajam') || value.includes('sharps') || value.includes('jarum')) {
    return 'Sharps';
  }

  if (value.includes('farmasi') || value.includes('obat') || value.includes('cokelat')) {
    return 'Farmasi';
  }

  return 'Infeksius';
}

function formatAcceptedTypes(types) {
  return (types || []).map(wasteLabel).join(', ');
}

function getQuantityLimit(typeKey) {
  return HOUSEHOLD_LIMITS[typeKey] || {
    id: 1,
    max: 10,
    unitHint: 'Maksimal 10 item untuk penyerahan rumah tangga.',
    unit: 'item',
    packaging: 'Kemas limbah di wadah tertutup sebelum diserahkan.'
  };
}

function formatDateIndonesia(value) {
  if (!value) return '-';
  return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function dateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeTimeValue(value) {
  const text = String(value || '').trim().replace('.', ':');
  const match = text.match(/(\d{1,2})[:.](\d{2})/);
  if (!match) return '';
  const hour = String(Math.min(23, Math.max(0, Number(match[1])))).padStart(2, '0');
  const minute = String(Math.min(59, Math.max(0, Number(match[2])))).padStart(2, '0');
  return `${hour}:${minute}`;
}

function displayTimeValue(value) {
  return String(value || '').slice(0, 5).replace(':', '.');
}

function formatTimeRange(open, close) {
  return `${displayTimeValue(open)}–${displayTimeValue(close)}`;
}

function parseOperationalDays(value) {
  if (Array.isArray(value)) return value;

  const text = String(value || '').trim();
  if (!text) return [];

  const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  if (text.toLowerCase().includes('setiap hari')) return allDays;

  if (text.includes('–') || text.includes('-')) {
    const parts = text.split(/[–-]/).map(s => s.trim());
    const start = allDays.indexOf(parts[0]);
    const end = allDays.indexOf(parts[1]);

    if (start !== -1 && end !== -1) {
      if (start <= end) return allDays.slice(start, end + 1);
      return [...allDays.slice(start), ...allDays.slice(0, end + 1)];
    }
  }

  return allDays.filter(day => text.toLowerCase().includes(day.toLowerCase()));
}

function formatOperationalDays(days) {
  const allDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const selectedRaw = parseOperationalDays(days);
  const selected = allDays.filter(day => selectedRaw.includes(day));

  if (selected.length === 0) return '';
  if (selected.length === 7) return 'Setiap hari';

  const ranges = [];
  let start = null;
  let prev = null;

  selected.forEach(day => {
    const index = allDays.indexOf(day);

    if (start === null) {
      start = index;
      prev = index;
      return;
    }

    if (index === prev + 1) {
      prev = index;
      return;
    }

    ranges.push([start, prev]);
    start = index;
    prev = index;
  });

  ranges.push([start, prev]);

  return ranges.map(([from, to]) => {
    if (from === to) return allDays[from];
    return `${allDays[from]}–${allDays[to]}`;
  }).join(', ');
}

function mapLocationFromApi(location) {
  const acceptedText = location.jenis_limbah || '';
  const acceptedTypes = WASTE_TYPES
    .filter(type => acceptedText.toLowerCase().includes(type.label.toLowerCase()))
    .map(type => type.value);

  if (!acceptedTypes.length) {
    if (acceptedText.toLowerCase().includes('tajam')) acceptedTypes.push('Sharps');
    if (acceptedText.toLowerCase().includes('infeksius')) acceptedTypes.push('Infeksius');
    if (acceptedText.toLowerCase().includes('farmasi')) acceptedTypes.push('Farmasi');
  }

  return {
    id: location.id,
    nama: location.nama_lokasi,
    alamat: location.alamat,
    telepon: location.telepon,
    acceptedTypes,
    hariOperasional: location.hari_operasional,
    hariList: parseOperationalDays(location.hari_operasional),
    jamBuka: String(location.jam_buka || '').slice(0, 5),
    jamTutup: String(location.jam_tutup || '').slice(0, 5),
    jamOperasional: formatTimeRange(location.jam_buka, location.jam_tutup),
    batasHari: Number(location.batas_hari || 14)
  };
}

function mapSubmissionFromApi(item) {
  const typeKey = inferWasteKey(item.nama_jenis);

  return {
    id: item.id,
    kode: item.kode_penyerahan,
    user: item.nama_user,
    jenis: item.nama_jenis,
    jenisKey: typeKey,
    jumlah: item.jumlah,
    satuan: item.satuan,
    lokasi: item.nama_lokasi,
    alamatLokasi: item.alamat,
    jadwal: String(item.jadwal_penyerahan || '').slice(0, 10),
    status: item.status,
    catatan: item.catatan || '-',
    createdAt: item.created_at
  };
}

function initResponsiveSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const button = document.createElement('button');
  button.className = 'mobile-menu-btn';
  button.type = 'button';
  button.innerHTML = '☰';

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';

  document.body.appendChild(button);
  document.body.appendChild(overlay);

  function closeSidebar() {
    document.body.classList.remove('sidebar-open');
    button.innerHTML = '☰';
  }

  function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
    button.innerHTML = document.body.classList.contains('sidebar-open') ? '✕' : '☰';
  }

  button.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', closeSidebar);

  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });
}

document.addEventListener('DOMContentLoaded', initResponsiveSidebar);
