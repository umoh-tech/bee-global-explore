/* ===================== Bee Global Explore — shared site logic ===================== */

const WHATSAPP_NUMBER = '2349160026720';
const AGENCY_EMAIL = 'beeglobalexplore@gmail.com';

/* ---------- Data ---------- */

const PACKAGES = [
  {
    id: 'dubai-5day',
    name: 'Dubai 5-Day Getaway',
    from: 850000,
    includes: ['Flight', 'Hotel', 'Airport Transfer', 'City Tour'],
    blurb: 'Desert safaris, skyline views, and world-class shopping — a fast, well-organized introduction to Dubai.',
    itinerary: [
      'Arrival & airport transfer to hotel',
      'Half-day city tour: Burj Khalifa & Dubai Mall',
      'Desert safari with dinner',
      'Free day for shopping or optional excursions',
      'Departure transfer'
    ]
  },
  {
    id: 'zanzibar-beach',
    name: 'Zanzibar Beach Escape',
    from: 1150000,
    includes: ['Flight', 'Hotel', 'Airport Transfer', 'Spice Tour'],
    blurb: 'White-sand beaches, turquoise water, and Stone Town history for a relaxed island break.',
    itinerary: [
      'Arrival & beachfront hotel check-in',
      'Stone Town historical walking tour',
      'Spice farm tour',
      'Free beach days',
      'Departure transfer'
    ]
  },
  {
    id: 'paris-getaway',
    name: 'Paris City Getaway',
    from: 1650000,
    includes: ['Flight', 'Hotel', 'Airport Transfer', 'City Tour'],
    blurb: 'Iconic landmarks and café culture — a classic first-timer\u2019s introduction to Paris.',
    itinerary: [
      'Arrival & airport transfer',
      'Eiffel Tower & Seine river cruise',
      'Louvre & city walking tour',
      'Free day for shopping/exploring',
      'Departure transfer'
    ]
  },
  {
    id: 'london-citybreak',
    name: 'London City Break',
    from: 1800000,
    includes: ['Flight', 'Hotel', 'Airport Transfer', 'City Tour'],
    blurb: 'History, museums, and West End energy on a well-paced city break.',
    itinerary: [
      'Arrival & airport transfer',
      'Westminster & London Eye tour',
      'Museum day (free entry venues)',
      'Free day for shopping/exploring',
      'Departure transfer'
    ]
  },
  {
    id: 'bali-adventure',
    name: 'Bali Adventure',
    from: 1950000,
    includes: ['Flight', 'Hotel', 'Airport Transfer', 'Tours'],
    blurb: 'Temples, rice terraces, and beach time across one of Southeast Asia\u2019s most loved islands.',
    itinerary: [
      'Arrival & airport transfer',
      'Ubud rice terrace & temple tour',
      'Beach day at Seminyak/Kuta',
      'Optional water sports excursion',
      'Departure transfer'
    ]
  },
  {
    id: 'capetown-explorer',
    name: 'Cape Town Explorer',
    from: 1400000,
    includes: ['Flight', 'Hotel', 'Airport Transfer', 'Tours'],
    blurb: 'Table Mountain, coastal drives, and winelands on a scenic South African break.',
    itinerary: [
      'Arrival & airport transfer',
      'Table Mountain & city tour',
      'Cape Peninsula scenic drive',
      'Winelands day trip',
      'Departure transfer'
    ]
  },
];

const VISA_TYPES = {
  'Tourist / Visit': {
    docs: ['Valid international passport (6+ months validity)', 'Passport photographs (as specified by embassy)', 'Completed visa application form', 'Proof of accommodation (hotel booking or invitation letter)', 'Proof of sufficient funds (bank statement)', 'Flight itinerary / reservation', 'Proof of employment or means of livelihood'],
  },
  'Business': {
    docs: ['Valid international passport (6+ months validity)', 'Passport photographs (as specified by embassy)', 'Invitation letter from host company', 'Company introduction letter', 'Proof of sufficient funds (bank statement)', 'Flight itinerary / reservation', 'Proof of accommodation'],
  },
  'Student': {
    docs: ['Valid international passport (6+ months validity)', 'Admission / offer letter from institution', 'Proof of tuition payment or financial sponsorship', 'Academic transcripts and certificates', 'Proof of accommodation', 'Language proficiency result (e.g. IELTS), where required'],
  },
  'Work': {
    docs: ['Valid international passport (6+ months validity)', 'Job offer / employment contract', 'Work permit (where applicable)', 'Educational and professional certificates', 'Medical examination report, where required', 'Police clearance certificate, where required'],
  },
  'Transit': {
    docs: ['Valid international passport (6+ months validity)', 'Onward flight ticket', 'Visa for final destination (if required)', 'Proof of sufficient funds'],
  },
};

const VISA_STEPS = [
  'Free initial consultation to confirm the right visa category for your trip',
  'We share the exact document checklist for your destination country',
  'You submit your information and documents to our team',
  'We review your application for completeness before submission',
  'Application is submitted and tracked through to a decision',
];

const COUNTRIES = ['United Kingdom','United States','Canada','Schengen (Europe)','United Arab Emirates','South Africa','Germany','Ireland','Australia','China','India','Turkey','Saudi Arabia (Umrah/Hajj)','Ghana','Kenya','Malaysia','Qatar','Egypt','Brazil','Other / Not listed'];

const STUDY_DESTINATIONS = [
  { name: 'United Kingdom', icon: 'ph-bank', note: 'Wide range of universities and shorter postgraduate programs.' },
  { name: 'Canada', icon: 'ph-maple-leaf', note: 'Strong post-study work pathways and welcoming immigration policy.' },
  { name: 'United States', icon: 'ph-flag-banner', note: 'Broad program variety across large and specialized institutions.' },
  { name: 'Ireland', icon: 'ph-shamrock', note: 'Growing tech and business hub with EU access.' },
  { name: 'Australia', icon: 'ph-kangaroo', note: 'Quality institutions with year-round intake options.' },
  { name: 'Germany', icon: 'ph-buildings', note: 'Low tuition public universities with strong engineering programs.' },
];

const PROGRAM_LEVELS = [
  { name: 'Foundation / Pathway', icon: 'ph-signpost' },
  { name: 'Undergraduate (Bachelor\u2019s)', icon: 'ph-graduation-cap' },
  { name: 'Postgraduate (Master\u2019s)', icon: 'ph-student' },
  { name: 'Language & IELTS Preparation', icon: 'ph-books' },
  { name: 'Short Courses / Certificates', icon: 'ph-certificate' },
];

const SERVICES_NAV = [
  { href: 'flights.html', icon: 'ph-airplane-tilt', label: 'Flight Reservation' },
  { href: 'hotels.html', icon: 'ph-buildings', label: 'Hotel Reservation' },
  { href: 'visa.html', icon: 'ph-stamp', label: 'Visa Assistance' },
  { href: 'packages.html', icon: 'ph-island', label: 'Holiday Packages' },
  { href: 'transfers.html', icon: 'ph-car', label: 'Airport Transfers' },
  { href: 'goods.html', icon: 'ph-package', label: 'Goods Delivery' },
  { href: 'passport.html', icon: 'ph-identification-card', label: 'Passport Assistance' },
  { href: 'school.html', icon: 'ph-graduation-cap', label: 'School Services & IELTS' },
];

/* ---------- Utilities ---------- */

function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
function getQueryParam(name) { return new URLSearchParams(window.location.search).get(name); }
function fmtNaira(n) { return '\u20A6' + n.toLocaleString('en-NG'); }

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ---------- Global chrome: menu, whatsapp float, reveal, year ---------- */

function initMobileMenu() {
  const btn = qs('#menuBtn');
  const menu = qs('#mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    btn.innerHTML = isHidden ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
    btn.setAttribute('aria-expanded', String(isHidden));
  });
  qsa('.mobile-link', menu).forEach(a => a.addEventListener('click', () => {
    menu.classList.add('hidden');
    btn.innerHTML = '<i class="ph ph-list"></i>';
  }));
}

function initServicesDropdown() {
  const trigger = qs('#servicesTrigger');
  const panel = qs('#servicesPanel');
  if (!trigger || !panel) return;
  let open = false;
  const setOpen = (v) => {
    open = v;
    panel.classList.toggle('hidden', !open);
    trigger.setAttribute('aria-expanded', String(open));
  };
  trigger.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!open); });
  document.addEventListener('click', (e) => { if (open && !panel.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

function initWhatsAppFloat() {
  const el = qs('#waFloat');
  if (!el) return;
  const msg = document.body.dataset.waMsg || 'Hello Bee Global Explore, I\u2019m interested in your travel services.';
  el.href = waLink(msg);
}

function initReveal() {
  const els = qsa('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

function initYear() {
  const el = qs('#copyright');
  if (el) el.textContent = `\u00A9 ${new Date().getFullYear()} Bee Global Explore. All rights reserved.`;
}

/* ---------- Generic form validation + WhatsApp/email handoff ---------- */

function validateField(el) {
  const errEl = el.closest('div, td')?.querySelector('.field-err') || el.parentElement.querySelector('.field-err');
  let valid = el.checkValidity();
  if (el.type === 'email' && el.value.trim()) {
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
  }
  if (errEl) errEl.classList.toggle('show', !valid);
  el.classList.toggle('invalid', !valid);
  return valid;
}

function collectFormData(form) {
  const lines = [];
  const seenRadioGroups = new Set();
  qsa('[name]', form).forEach(el => {
    if (el.type === 'submit' || el.type === 'button' || el.type === 'file') return;
    if (el.type === 'checkbox' && !el.checked) return;
    if (el.type === 'radio') {
      if (seenRadioGroups.has(el.name)) return;
      const checked = form.querySelector(`input[name="${el.name}"]:checked`);
      if (!checked) return;
      seenRadioGroups.add(el.name);
      const label = checked.dataset.groupLabel || el.name;
      lines.push(`${label}: ${checked.value}`);
      return;
    }
    const label = el.dataset.label || el.closest('div')?.querySelector('label')?.textContent?.trim() || el.name;
    let value = el.value?.trim();
    if (el.type === 'checkbox') value = 'Yes';
    if (!value) return;
    lines.push(`${label}: ${value}`);
  });
  return lines;
}

/**
 * Builds the structured payload sent to /api/submit: pulls out the common
 * contact fields (fullName/phone/email) and puts everything else in `details`.
 */
function buildStructuredPayload(form, serviceType) {
  const details = {};
  let full_name = '', phone = '', email = '';
  const seenRadioGroups = new Set();

  qsa('[name]', form).forEach(el => {
    if (el.type === 'submit' || el.type === 'button' || el.type === 'file') return;
    let name = el.name;
    let value;

    if (el.type === 'radio') {
      if (seenRadioGroups.has(name)) return;
      const checked = form.querySelector(`input[name="${name}"]:checked`);
      if (!checked) return;
      seenRadioGroups.add(name);
      value = checked.value;
    } else if (el.type === 'checkbox') {
      value = el.checked ? 'Yes' : null;
    } else {
      value = el.value?.trim() || null;
    }
    if (!value) return;

    if (name === 'fullName') full_name = value;
    else if (name === 'phone') phone = value;
    else if (name === 'email') email = value;
    else details[name] = value;
  });

  return { service_type: serviceType, full_name, phone, email, details };
}

/** Reads all files from any <input type="file"> in the form as base64. */
async function collectFilesFromForm(form) {
  const fileInputs = qsa('input[type="file"]', form);
  const files = [];
  let totalBytes = 0;

  for (const input of fileInputs) {
    for (const file of Array.from(input.files || [])) {
      totalBytes += file.size;
      const dataBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1] || '');
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      files.push({ name: file.name, type: file.type, dataBase64 });
    }
  }
  return { files, totalBytes };
}

/**
 * Wires a form for client-side validation, then submits to our backend
 * (/api/submit → Supabase). Falls back to email/WhatsApp handoff only if
 * the network request fails, so no lead is ever silently lost.
 *
 * options: { subject, waMessagePrefix, successBoxId, waBtnId, serviceType, serviceTypeField }
 */
function bindFormHandoff(formId, options) {
  const form = qs('#' + formId);
  if (!form) return;
  const successBox = options.successBoxId ? qs('#' + options.successBoxId) : null;
  const waBtn = options.waBtnId ? qs('#' + options.waBtnId) : null;
  const submitBtn = form.querySelector('button[type="submit"]');

  qsa('input, select, textarea', form).forEach(el => {
    if (el.type === 'file') return;
    el.addEventListener('blur', () => validateField(el));
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    successBox?.classList.add('hidden');
    hideFormError(form);

    let allValid = true;
    qsa('input, select, textarea', form).forEach(el => {
      if (el.type === 'file' || !el.hasAttribute('required')) return;
      if (!validateField(el)) allValid = false;
    });
    if (!allValid) {
      const firstInvalid = qs('.invalid', form);
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const serviceType = options.serviceTypeField
      ? (qs(`[name="${options.serviceTypeField}"]`, form)?.value || options.serviceType || 'General Enquiry')
      : (options.serviceType || 'General Enquiry');

    const payload = buildStructuredPayload(form, serviceType);
    const lines = collectFormData(form);
    const bodyText = lines.join('\n');

    // Prepare files (if any), enforcing a client-side size cap that mirrors the server's.
    let files = [];
    try {
      const collected = await collectFilesFromForm(form);
      if (collected.totalBytes > 3 * 1024 * 1024) {
        showFormError(form, 'Attachments are too large (max ~3MB total). Please remove a file or send documents directly via WhatsApp/email, then submit again.');
        return;
      }
      files = collected.files;
    } catch (err) {
      console.error('File read error:', err);
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.originalText = submitBtn.textContent; submitBtn.textContent = 'Sending...'; }

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, files }),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok) {
        if (waBtn) {
          const waMsg = `${options.waMessagePrefix || 'Hello Bee Global Explore,'}\n\n${bodyText}\n\nReference: ${json.id ? json.id.slice(0, 8) : ''}`;
          waBtn.href = waLink(waMsg);
        }
        if (successBox) {
          successBox.classList.remove('hidden');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        qsa('.pill-option.selected', form).forEach(el => el.classList.remove('selected'));
        form.dispatchEvent(new CustomEvent('handoff:success', { detail: json }));
      } else {
        throw new Error(json.error || 'Request failed');
      }
    } catch (err) {
      console.error('Submit failed, falling back to email/WhatsApp:', err);
      // Fallback so the lead is never lost even if the backend is unreachable
      const subject = encodeURIComponent(options.subject || 'Enquiry — Bee Global Explore');
      const mailBody = encodeURIComponent(bodyText);
      if (waBtn) waBtn.href = waLink(`${options.waMessagePrefix || 'Hello Bee Global Explore,'}\n\n${bodyText}`);
      showFormError(
        form,
        'We couldn\u2019t reach our server just now. Your email app will open with your details filled in \u2014 please hit send, or continue via WhatsApp below, so we don\u2019t miss your request.'
      );
      window.location.href = `mailto:${AGENCY_EMAIL}?subject=${subject}&body=${mailBody}`;
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.originalText || 'Submit'; }
    }
  });
}

function showFormError(form, message) {
  let box = form.querySelector('.form-fallback-error');
  if (!box) {
    box = document.createElement('div');
    box.className = 'form-fallback-error mt-6 bg-red-500/15 border border-red-400/60 text-paper rounded-lg px-5 py-4 text-sm';
    form.querySelector('button[type="submit"]')?.closest('div')?.insertAdjacentElement('afterend', box);
  }
  box.innerHTML = `<i class="ph ph-warning-circle mr-1"></i> ${message}`;
  box.classList.remove('hidden');
}

function hideFormError(form) {
  form.querySelector('.form-fallback-error')?.classList.add('hidden');
}

/* ---------- File dropzone (cosmetic — no server to receive uploads yet) ---------- */

function initFileDrop(dropId, inputId, listId) {
  const drop = qs('#' + dropId);
  const input = qs('#' + inputId);
  const list = qs('#' + listId);
  if (!drop || !input) return;
  const render = () => {
    if (!list) return;
    const files = Array.from(input.files || []);
    list.innerHTML = files.map(f => `<li class="flex items-center gap-2"><i class="ph ph-paperclip"></i>${f.name}</li>`).join('');
  };
  drop.addEventListener('click', () => input.click());
  input.addEventListener('change', render);
  ['dragover', 'dragenter'].forEach(evt => drop.addEventListener(evt, (e) => { e.preventDefault(); drop.classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach(evt => drop.addEventListener(evt, (e) => { e.preventDefault(); drop.classList.remove('dragover'); }));
  drop.addEventListener('drop', (e) => { input.files = e.dataTransfer.files; render(); });
}

/* ---------- Page: Homepage ---------- */

function initHomepage() {
  const grid = qs('#quickServices');
  if (grid) {
    grid.innerHTML = SERVICES_NAV.map(s => `
      <a href="${s.href}" class="card-hover flex flex-col items-center text-center gap-3 bg-navy2 rounded-2xl p-6 border border-paper/10 hover:border-honey/40 transition">
        <div class="hex"><i class="ph ${s.icon} text-2xl"></i></div>
        <span class="font-medium text-sm">${s.label}</span>
      </a>
    `).join('');
  }

  const featured = qs('#featuredPackages');
  if (featured) {
    featured.innerHTML = PACKAGES.slice(0, 3).map(p => `
      <div class="pkg-card bg-white rounded-2xl overflow-hidden shadow-sm border border-navy/5">
        <div class="bg-navy h-2"></div>
        <div class="p-6">
          <h3 class="font-display font-semibold text-xl mb-2">${p.name}</h3>
          <div class="flex flex-wrap gap-2 mb-4">
            ${p.includes.map(i => `<span class="text-xs font-mono bg-papershade px-2 py-1 rounded-full">${i}</span>`).join('')}
          </div>
          <p class="text-navy/70 text-sm leading-relaxed mb-5">${p.blurb}</p>
          <div class="flex items-center justify-between">
            <span class="font-display font-semibold text-teal">From ${fmtNaira(p.from)}</span>
            <a href="packages.html#${p.id}" class="text-sm font-semibold text-navy hover:text-honey">View <i class="ph ph-arrow-right"></i></a>
          </div>
        </div>
      </div>
    `).join('');
  }

  const searchForm = qs('#heroSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = qs('#heroSearchInput').value.trim();
      const params = new URLSearchParams();
      if (val) params.set('note', `I'm interested in: ${val}`);
      window.location.href = `enquiry.html?${params.toString()}`;
    });
  }
}

/* ---------- Page: Packages ---------- */

function initPackagesPage() {
  const grid = qs('#packagesGrid');
  if (!grid) return;
  grid.innerHTML = PACKAGES.map(p => `
    <div id="${p.id}" class="pkg-card bg-white rounded-2xl overflow-hidden shadow-sm border border-navy/5 scroll-mt-28">
      <div class="bg-navy h-2"></div>
      <div class="p-6">
        <h3 class="font-display font-semibold text-xl mb-2">${p.name}</h3>
        <div class="flex flex-wrap gap-2 mb-4">
          ${p.includes.map(i => `<span class="text-xs font-mono bg-papershade px-2 py-1 rounded-full">${i}</span>`).join('')}
        </div>
        <p class="text-navy/70 text-sm leading-relaxed mb-5">${p.blurb}</p>
        <div class="flex items-center justify-between">
          <span class="font-display font-semibold text-teal">From ${fmtNaira(p.from)}</span>
          <button data-pkg="${p.id}" class="viewPkgBtn text-sm font-semibold text-navy hover:text-honey">View Package <i class="ph ph-arrow-right"></i></button>
        </div>
      </div>
    </div>
  `).join('');

  const modal = qs('#pkgModal');
  const modalBody = qs('#pkgModalBody');
  qsa('.viewPkgBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = PACKAGES.find(x => x.id === btn.dataset.pkg);
      if (!p) return;
      modalBody.innerHTML = `
        <div class="p-7 md:p-9">
          <p class="font-mono text-xs tracking-widest text-honey uppercase mb-2">Holiday Package</p>
          <h3 class="font-display font-semibold text-2xl md:text-3xl mb-4">${p.name}</h3>
          <div class="flex flex-wrap gap-2 mb-5">
            ${p.includes.map(i => `<span class="text-xs font-mono bg-navy2 border border-paper/10 px-2 py-1 rounded-full">${i}</span>`).join('')}
          </div>
          <p class="text-paper/75 leading-relaxed mb-6">${p.blurb}</p>
          <p class="font-mono text-xs tracking-widest text-honey uppercase mb-3">Sample Itinerary</p>
          <ol class="space-y-2 mb-7 text-sm text-paper/80">
            ${p.itinerary.map((step, i) => `<li class="flex gap-3"><span class="font-mono text-honey">${String(i + 1).padStart(2, '0')}</span>${step}</li>`).join('')}
          </ol>
          <div class="flex items-center justify-between border-t border-paper/10 pt-6">
            <span class="font-display font-semibold text-xl text-honeylight">From ${fmtNaira(p.from)}</span>
            <a href="enquiry.html?service=${encodeURIComponent('Holiday Package')}&note=${encodeURIComponent('I would like to book: ' + p.name)}"
              class="btn-honey px-6 py-3 rounded-full font-semibold">Book / Request This Package</a>
          </div>
          <p class="text-xs text-paper/40 mt-4">Pricing shown is a sample starting estimate for planning purposes and will be confirmed with you before booking.</p>
        </div>
      `;
      modal.classList.add('open');
    });
  });

  const closeModal = () => modal.classList.remove('open');
  qs('#pkgModalClose')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // deep link support (#package-id)
  if (window.location.hash) {
    const target = qs(window.location.hash);
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }
}

/* ---------- Page: Flights ---------- */

function initFlightsPage() {
  const tripRadios = qsa('input[name="tripType"]');
  const returnWrap = qs('#returnDateWrap');
  const returnInput = qs('#returnDate');
  const syncTripType = () => {
    const checked = qs('input[name="tripType"]:checked');
    const isRoundtrip = checked && checked.value === 'Round-trip';
    if (returnWrap) returnWrap.classList.toggle('hidden', !isRoundtrip);
    if (returnInput) {
      if (isRoundtrip) returnInput.setAttribute('required', 'required');
      else returnInput.removeAttribute('required');
    }
  };
  tripRadios.forEach(r => r.addEventListener('change', syncTripType));
  syncTripType();

  bindFormHandoff('flightForm', {
    serviceType: 'Flight Reservation',
    subject: 'Flight Reservation Request',
    waMessagePrefix: 'Hello Bee Global Explore, I would like to request a flight:',
    successBoxId: 'flightSuccess',
    waBtnId: 'flightWaBtn',
  });
}

/* ---------- Page: Hotels ---------- */

function initHotelsPage() {
  bindFormHandoff('hotelForm', {
    serviceType: 'Hotel Reservation',
    subject: 'Hotel Reservation Request',
    waMessagePrefix: 'Hello Bee Global Explore, I would like to request a hotel booking:',
    successBoxId: 'hotelSuccess',
    waBtnId: 'hotelWaBtn',
  });
}

/* ---------- Page: Airport Transfers ---------- */

function initTransfersPage() {
  bindFormHandoff('transferForm', {
    serviceType: 'Airport Transfer',
    subject: 'Airport Transfer Request',
    waMessagePrefix: 'Hello Bee Global Explore, I would like to request an airport transfer:',
    successBoxId: 'transferSuccess',
    waBtnId: 'transferWaBtn',
  });
}

/* ---------- Page: Goods Pickup & Delivery ---------- */

function initGoodsPage() {
  bindFormHandoff('goodsForm', {
    serviceType: 'Goods Pickup & Delivery',
    subject: 'Goods Pickup & Delivery Quote Request',
    waMessagePrefix: 'Hello Bee Global Explore, I would like a quote for pickup/delivery of goods:',
    successBoxId: 'goodsSuccess',
    waBtnId: 'goodsWaBtn',
  });
}

/* ---------- Page: Visa wizard ---------- */

function initVisaPage() {
  const countrySelect = qs('#visaCountry');
  const typeWrap = qs('#visaTypeOptions');
  const resultPanel = qs('#visaResultPanel');
  const docList = qs('#visaDocList');
  const stepList = qs('#visaStepList');
  const startBtn = qs('#startVisaAppBtn');
  const formSection = qs('#visaFormSection');
  if (!countrySelect || !typeWrap) return;

  countrySelect.innerHTML = '<option value="" disabled selected>Select destination country</option>' +
    COUNTRIES.map(c => `<option>${c}</option>`).join('');

  typeWrap.innerHTML = Object.keys(VISA_TYPES).map(t => `
    <div class="pill-option" data-type="${t}">
      <p class="font-semibold">${t}</p>
    </div>
  `).join('');

  stepList.innerHTML = VISA_STEPS.map((s, i) => `
    <li class="flex gap-3"><span class="font-mono text-honey">${String(i + 1).padStart(2, '0')}</span><span>${s}</span></li>
  `).join('');

  let selectedType = null;

  function updateResult() {
    if (!countrySelect.value || !selectedType) {
      resultPanel.classList.add('hidden');
      return;
    }
    const data = VISA_TYPES[selectedType];
    docList.innerHTML = data.docs.map(d => `<li class="flex gap-3"><i class="ph ph-check-circle text-honey mt-0.5"></i><span>${d}</span></li>`).join('');
    qs('#visaSummaryCountry').textContent = countrySelect.value;
    qs('#visaSummaryType').textContent = selectedType;
    resultPanel.classList.remove('hidden');
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  countrySelect.addEventListener('change', updateResult);
  qsa('.pill-option', typeWrap).forEach(el => {
    el.addEventListener('click', () => {
      qsa('.pill-option', typeWrap).forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      selectedType = el.dataset.type;
      updateResult();
    });
  });

  startBtn?.addEventListener('click', () => {
    qs('#visaFormCountry').value = countrySelect.value || '';
    qs('#visaFormType').value = selectedType || '';
    formSection.classList.remove('hidden');
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  initFileDrop('visaDrop', 'visaFiles', 'visaFileList');

  bindFormHandoff('visaForm', {
    serviceType: 'Visa Assistance',
    subject: 'Visa Application Request',
    waMessagePrefix: 'Hello Bee Global Explore, I would like to start a visa application:',
    successBoxId: 'visaSuccess',
    waBtnId: 'visaWaBtn',
  });
}

/* ---------- Page: School services ---------- */

function initSchoolPage() {
  const destGrid = qs('#studyDestGrid');
  if (destGrid) {
    destGrid.innerHTML = STUDY_DESTINATIONS.map(d => `
      <div class="card-hover bg-navy2 rounded-2xl p-6 border border-paper/10 text-center">
        <div class="hex mx-auto mb-4"><i class="ph ${d.icon} text-2xl"></i></div>
        <h4 class="font-display font-semibold mb-1">${d.name}</h4>
        <p class="text-paper/60 text-sm leading-relaxed">${d.note}</p>
      </div>
    `).join('');
  }
  const progGrid = qs('#programLevelGrid');
  if (progGrid) {
    progGrid.innerHTML = PROGRAM_LEVELS.map(p => `
      <div class="flex items-center gap-3 bg-white rounded-xl px-5 py-4 shadow-sm border border-navy/5">
        <i class="ph ${p.icon} text-teal text-xl"></i><span class="font-medium">${p.name}</span>
      </div>
    `).join('');
  }
  initFileDrop('schoolDrop', 'schoolFiles', 'schoolFileList');

  bindFormHandoff('schoolForm', {
    serviceType: 'School Services',
    subject: 'Study Abroad Consultation Request',
    waMessagePrefix: 'Hello Bee Global Explore, I would like guidance on studying abroad:',
    successBoxId: 'schoolSuccess',
    waBtnId: 'schoolWaBtn',
  });
}

/* ---------- Page: Enquiry (prefill from query string) ---------- */

function initEnquiryPage() {
  const service = getQueryParam('service');
  const note = getQueryParam('note');
  if (service) {
    const sel = qs('#enqService');
    if (sel) sel.value = service;
  }
  if (note) {
    const msg = qs('#enqMessage');
    if (msg) msg.value = note;
  }
  bindFormHandoff('enquiryForm', {
    serviceType: 'General Enquiry',
    serviceTypeField: 'service',
    subject: 'General Enquiry',
    waMessagePrefix: 'Hello Bee Global Explore, I have an enquiry:',
    successBoxId: 'enquirySuccess',
    waBtnId: 'enquiryWaBtn',
  });
}

/* ---------- Page: Passport ---------- */

function initPassportPage() {
  initFileDrop('passportDrop', 'passportFiles', 'passportFileList');

  bindFormHandoff('passportForm', {
    serviceType: 'Passport Assistance',
    subject: 'Passport Assistance Request',
    waMessagePrefix: 'Hello Bee Global Explore, I need passport assistance:',
    successBoxId: 'passportSuccess',
    waBtnId: 'passportWaBtn',
  });
}

/* ---------- Boot ---------- */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initServicesDropdown();
  initWhatsAppFloat();
  initReveal();
  initYear();

  const page = document.body.dataset.page;
  if (page === 'home') initHomepage();
  if (page === 'packages') initPackagesPage();
  if (page === 'visa') initVisaPage();
  if (page === 'school') initSchoolPage();
  if (page === 'enquiry') initEnquiryPage();
  if (page === 'passport') initPassportPage();
  if (page === 'flights') initFlightsPage();
  if (page === 'hotels') initHotelsPage();
  if (page === 'transfers') initTransfersPage();
  if (page === 'goods') initGoodsPage();
});
