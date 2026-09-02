/* ===================== Bee Global Explore — Admin Dashboard ===================== */

// ---- Fill these in from Supabase → Project Settings → API ----
// The anon key is safe to expose here: Row Level Security only allows the
// signed-in admin account to read/update this table (see supabase/schema.sql).
const SUPABASE_URL = 'https://nphkrxnezvlaowbyakuf.supabase.co'; // e.g. https://xxxxxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waGtyeG5lenZsYW93Ynlha3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNzA5MzUsImV4cCI6MjEwMzk0NjkzNX0.vnanR5oGwwm3KGW4RoEg4bq49UOzkwFUVtjvtgJPAkE';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const qs = (s, c) => (c || document).querySelector(s);
const qsa = (s, c) => Array.from((c || document).querySelectorAll(s));

let allSubmissions = [];

/* ---------- Auth ---------- */

async function checkSession() {
  const { data } = await sb.auth.getSession();
  if (data.session) {
    showDashboard();
  } else {
    showLogin();
  }
}

function showLogin() {
  qs('#loginScreen').classList.remove('hidden');
  qs('#dashboardScreen').classList.add('hidden');
}

function showDashboard() {
  qs('#loginScreen').classList.add('hidden');
  qs('#dashboardScreen').classList.remove('hidden');
  loadSubmissions();
}

function initLoginForm() {
  const form = qs('#loginForm');
  const errorBox = qs('#loginError');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');
    const btn = qs('#loginBtn');
    btn.disabled = true;
    btn.textContent = 'Signing in...';

    const email = qs('#loginEmail').value.trim();
    const password = qs('#loginPassword').value;

    const { error } = await sb.auth.signInWithPassword({ email, password });

    btn.disabled = false;
    btn.textContent = 'Sign In';

    if (error) {
      errorBox.textContent = error.message || 'Sign-in failed. Check your email and password.';
      errorBox.classList.remove('hidden');
      return;
    }
    showDashboard();
  });
}

function initLogout() {
  qs('#logoutBtn').addEventListener('click', async () => {
    await sb.auth.signOut();
    showLogin();
  });
}

/* ---------- Data loading ---------- */

async function loadSubmissions() {
  const list = qs('#submissionsList');
  list.innerHTML = '<div class="spinner"></div>';

  const { data, error } = await sb
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    list.innerHTML = `<div class="empty-state">Couldn't load submissions: ${escapeHtml(error.message)}</div>`;
    return;
  }

  allSubmissions = data || [];
  populateServiceFilter(allSubmissions);
  renderStats(allSubmissions);
  renderList(allSubmissions);
}

function populateServiceFilter(rows) {
  const select = qs('#serviceFilter');
  const current = select.value;
  const types = Array.from(new Set(rows.map(r => r.service_type))).sort();
  select.innerHTML = '<option value="">All Services</option>' + types.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
  select.value = current;
}

function renderStats(rows) {
  const total = rows.length;
  const newCount = rows.filter(r => r.status === 'new').length;
  qs('#statsBar').innerHTML = `
    <span class="stat-pill"><i class="ph ph-tray"></i> ${total} total</span>
    <span class="stat-pill"><i class="ph ph-circle-notch"></i> ${newCount} new</span>
  `;
}

/* ---------- Filtering ---------- */

function getFilteredRows() {
  const search = qs('#searchInput').value.trim().toLowerCase();
  const service = qs('#serviceFilter').value;
  const status = qs('#statusFilter').value;

  return allSubmissions.filter(r => {
    if (service && r.service_type !== service) return false;
    if (status && r.status !== status) return false;
    if (search) {
      const haystack = `${r.full_name || ''} ${r.phone || ''} ${r.email || ''} ${JSON.stringify(r.details || {})}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

function applyFilters() {
  renderList(getFilteredRows());
}

/* ---------- Rendering ---------- */

function renderList(rows) {
  const list = qs('#submissionsList');
  if (!rows.length) {
    list.innerHTML = '<div class="empty-state"><i class="ph ph-tray" style="font-size:2rem;"></i><p>No submissions match your filters.</p></div>';
    return;
  }

  list.innerHTML = rows.map(r => renderCard(r)).join('');

  qsa('.status-select', list).forEach(sel => {
    sel.addEventListener('change', () => updateStatus(sel.dataset.id, sel.value));
  });

  qsa('.file-chip', list).forEach(chip => {
    chip.addEventListener('click', async (e) => {
      e.preventDefault();
      await openFile(chip.dataset.path);
    });
  });
}

function renderCard(r) {
  const date = new Date(r.created_at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
  const details = r.details || {};
  const detailRows = Object.entries(details)
    .map(([k, v]) => `<dt>${escapeHtml(humanizeKey(k))}</dt><dd>${escapeHtml(String(v))}</dd>`)
    .join('');

  const files = (r.file_paths || []).map(p => {
    const name = p.split('/').pop();
    return `<a href="#" class="file-chip" data-path="${escapeHtml(p)}"><i class="ph ph-paperclip"></i> ${escapeHtml(name)}</a>`;
  }).join('');

  return `
    <div class="sub-card" data-id="${r.id}">
      <div class="sub-top">
        <span class="badge">${escapeHtml(r.service_type)}</span>
        <span class="sub-date">${date}</span>
      </div>
      <div class="sub-contact">
        <div><span>Name</span>${escapeHtml(r.full_name || '\u2014')}</div>
        <div><span>Phone</span>${escapeHtml(r.phone || '\u2014')}</div>
        <div><span>Email</span>${escapeHtml(r.email || '\u2014')}</div>
      </div>
      ${detailRows ? `<dl class="sub-details">${detailRows}</dl>` : ''}
      ${files ? `<div class="sub-files">${files}</div>` : ''}
      <div class="sub-footer">
        <select class="status-select status-${r.status}" data-id="${r.id}">
          <option value="new" ${r.status === 'new' ? 'selected' : ''}>New</option>
          <option value="contacted" ${r.status === 'contacted' ? 'selected' : ''}>Contacted</option>
          <option value="closed" ${r.status === 'closed' ? 'selected' : ''}>Closed</option>
        </select>
        <span class="sub-date">#${r.id.slice(0, 8)}</span>
      </div>
    </div>
  `;
}

async function updateStatus(id, status) {
  const { error } = await sb.from('submissions').update({ status }).eq('id', id);
  if (error) {
    alert('Could not update status: ' + error.message);
    return;
  }
  const row = allSubmissions.find(r => r.id === id);
  if (row) row.status = status;
  const sel = qs(`.status-select[data-id="${id}"]`);
  if (sel) sel.className = `status-select status-${status}`;
  renderStats(allSubmissions);
}

async function openFile(path) {
  const { data, error } = await sb.storage.from('documents').createSignedUrl(path, 60);
  if (error) {
    alert('Could not open file: ' + error.message);
    return;
  }
  window.open(data.signedUrl, '_blank', 'noopener');
}

/* ---------- Utilities ---------- */

function humanizeKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Boot ---------- */

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initLogout();
  qs('#searchInput').addEventListener('input', applyFilters);
  qs('#serviceFilter').addEventListener('change', applyFilters);
  qs('#statusFilter').addEventListener('change', applyFilters);
  qs('#refreshBtn').addEventListener('click', loadSubmissions);
  checkSession();
});
