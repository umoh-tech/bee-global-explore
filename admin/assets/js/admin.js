/* ===================== Bee Global Explore — Admin Dashboard ===================== */

// ---- Fill these in from Supabase → Project Settings → API ----
// The anon key is safe to expose here: Row Level Security only allows the
// signed-in admin account to read/update this table (see supabase/schema.sql).
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // e.g. https://xxxxxxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

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

  qsa('.delete-btn', list).forEach(btn => {
    btn.addEventListener('click', () => deleteSubmission(btn.dataset.id));
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
        <div style="display:flex; align-items:center; gap:.6rem;">
          <span class="sub-date">#${r.id.slice(0, 8)}</span>
          <button class="delete-btn" data-id="${r.id}"><i class="ph ph-trash"></i> Delete</button>
        </div>
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

async function deleteSubmission(id) {
  if (!confirm('Delete this submission permanently? This cannot be undone.')) return;
  const { error } = await sb.from('submissions').delete().eq('id', id);
  if (error) {
    alert('Could not delete: ' + error.message);
    return;
  }
  allSubmissions = allSubmissions.filter(r => r.id !== id);
  populateServiceFilter(allSubmissions);
  renderStats(allSubmissions);
  applyFilters();
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

/* ---------- Tabs ---------- */

function initTabs() {
  qsa('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      qsa('.tab-panel').forEach(p => p.classList.add('hidden'));
      qs(`#${btn.dataset.tab}Tab`).classList.remove('hidden');
      if (btn.dataset.tab === 'packages') loadPackages();
    });
  });
}

/* ---------- Packages management ---------- */

let allPackages = [];

async function loadPackages() {
  const list = qs('#packagesList');
  list.innerHTML = '<div class="spinner"></div>';

  const { data, error } = await sb
    .from('packages')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    list.innerHTML = `<div class="empty-state">Couldn't load packages: ${escapeHtml(error.message)}</div>`;
    return;
  }

  allPackages = data || [];
  renderPackagesList();
}

function renderPackagesList() {
  const list = qs('#packagesList');
  if (!allPackages.length) {
    list.innerHTML = '<div class="empty-state"><i class="ph ph-island" style="font-size:2rem;"></i><p>No packages yet. Add your first one.</p></div>';
    return;
  }

  list.innerHTML = allPackages.map(p => `
    <div class="pkg-admin-card ${p.is_active ? '' : 'inactive'}">
      <div>
        <span class="pkg-admin-name">${escapeHtml(p.name)}</span>
        ${p.is_active ? '' : '<span class="pill-inactive">Hidden</span>'}
        <div class="pkg-admin-meta">\u20a6${Number(p.from_price).toLocaleString('en-NG')} \u00b7 order ${p.sort_order}</div>
      </div>
      <div class="pkg-admin-actions">
        <button data-action="toggle" data-id="${p.id}">${p.is_active ? 'Hide' : 'Show'}</button>
        <button data-action="edit" data-id="${p.id}">Edit</button>
      </div>
    </div>
  `).join('');

  qsa('[data-action="edit"]', list).forEach(btn => {
    btn.addEventListener('click', () => openPackageForm(allPackages.find(p => p.id === btn.dataset.id)));
  });
  qsa('[data-action="toggle"]', list).forEach(btn => {
    btn.addEventListener('click', () => togglePackageActive(btn.dataset.id));
  });
}

async function togglePackageActive(id) {
  const pkg = allPackages.find(p => p.id === id);
  if (!pkg) return;
  const newValue = !pkg.is_active;
  const { error } = await sb.from('packages').update({ is_active: newValue }).eq('id', id);
  if (error) { alert('Could not update: ' + error.message); return; }
  pkg.is_active = newValue;
  renderPackagesList();
}

function openPackageForm(pkg) {
  qs('#packageFormError').classList.add('hidden');
  qs('#packageFormTitle').textContent = pkg ? 'Edit Package' : 'Add Package';
  qs('#pkgId').value = pkg?.id || '';
  qs('#pkgName').value = pkg?.name || '';
  qs('#pkgPrice').value = pkg?.from_price ?? '';
  qs('#pkgIncludes').value = (pkg?.includes || []).join(', ');
  qs('#pkgBlurb').value = pkg?.blurb || '';
  qs('#pkgItinerary').value = (pkg?.itinerary || []).join('\n');
  qs('#pkgSortOrder').value = pkg?.sort_order ?? allPackages.length;
  qs('#pkgActive').checked = pkg ? pkg.is_active : true;
  qs('#packageDeleteBtn').classList.toggle('hidden', !pkg);
  qs('#packageModal').classList.add('open');
}

function closePackageForm() {
  qs('#packageModal').classList.remove('open');
}

function initPackageForm() {
  qs('#addPackageBtn').addEventListener('click', () => openPackageForm(null));
  qs('#packageModalClose').addEventListener('click', closePackageForm);
  qs('#packageModal').addEventListener('click', (e) => { if (e.target.id === 'packageModal') closePackageForm(); });

  qs('#packageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = qs('#packageFormError');
    errorBox.classList.add('hidden');

    const id = qs('#pkgId').value;
    const payload = {
      name: qs('#pkgName').value.trim(),
      from_price: Number(qs('#pkgPrice').value) || 0,
      includes: qs('#pkgIncludes').value.split(',').map(s => s.trim()).filter(Boolean),
      blurb: qs('#pkgBlurb').value.trim(),
      itinerary: qs('#pkgItinerary').value.split('\n').map(s => s.trim()).filter(Boolean),
      sort_order: Number(qs('#pkgSortOrder').value) || 0,
      is_active: qs('#pkgActive').checked,
    };

    if (!payload.name) {
      errorBox.textContent = 'Package name is required.';
      errorBox.classList.remove('hidden');
      return;
    }

    const saveBtn = qs('#packageSaveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const { error } = id
      ? await sb.from('packages').update(payload).eq('id', id)
      : await sb.from('packages').insert(payload);

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Package';

    if (error) {
      errorBox.textContent = error.message;
      errorBox.classList.remove('hidden');
      return;
    }

    closePackageForm();
    loadPackages();
  });

  qs('#packageDeleteBtn').addEventListener('click', async () => {
    const id = qs('#pkgId').value;
    if (!id) return;
    if (!confirm('Delete this package permanently? This cannot be undone.')) return;
    const { error } = await sb.from('packages').delete().eq('id', id);
    if (error) { alert('Could not delete: ' + error.message); return; }
    closePackageForm();
    loadPackages();
  });
}

/* ---------- Boot ---------- */

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initLogout();
  initTabs();
  initPackageForm();
  qs('#searchInput').addEventListener('input', applyFilters);
  qs('#serviceFilter').addEventListener('change', applyFilters);
  qs('#statusFilter').addEventListener('change', applyFilters);
  qs('#refreshBtn').addEventListener('click', loadSubmissions);
  checkSession();
});
