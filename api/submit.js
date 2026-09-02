const { createClient } = require('@supabase/supabase-js');

const MAX_TOTAL_PAYLOAD_BYTES = 4 * 1024 * 1024; // ~4MB, safely under Vercel's body limit

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
    return res.status(500).json({ ok: false, error: 'Server is not configured yet. Please contact us directly.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      return res.status(400).json({ ok: false, error: 'Invalid request body' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'Invalid request body' });
  }

  const { service_type, full_name, phone, email, details, files } = body;

  if (!service_type || typeof service_type !== 'string') {
    return res.status(400).json({ ok: false, error: 'service_type is required' });
  }
  if (!full_name && !phone && !email) {
    return res.status(400).json({ ok: false, error: 'At least one contact field is required' });
  }

  // Rough payload size guard (files are base64, ~33% larger than raw bytes)
  const approxSize = JSON.stringify(body).length;
  if (approxSize > MAX_TOTAL_PAYLOAD_BYTES) {
    return res.status(413).json({
      ok: false,
      error: 'Attachments are too large. Please keep total attachments under ~3MB, or send documents directly via WhatsApp/email.',
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // Upload any attached files to private Storage bucket "documents"
  const filePaths = [];
  if (Array.isArray(files) && files.length > 0) {
    const submissionId = cryptoRandomId();
    for (const f of files) {
      if (!f || !f.name || !f.dataBase64) continue;
      try {
        const buffer = Buffer.from(f.dataBase64, 'base64');
        const safeName = String(f.name).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
        const path = `${slugify(service_type)}/${submissionId}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(path, buffer, {
            contentType: f.type || 'application/octet-stream',
            upsert: false,
          });
        if (uploadError) {
          console.error('File upload failed:', uploadError.message);
          continue; // don't fail the whole submission over one bad file
        }
        filePaths.push(path);
      } catch (err) {
        console.error('File processing error:', err.message);
      }
    }
  }

  const { data, error } = await supabase
    .from('submissions')
    .insert({
      service_type,
      full_name: full_name || null,
      phone: phone || null,
      email: email || null,
      details: details || {},
      file_paths: filePaths,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Insert failed:', error.message);
    return res.status(500).json({ ok: false, error: 'Could not save your request. Please try WhatsApp or email instead.' });
  }

  return res.status(200).json({ ok: true, id: data.id });
};

function slugify(str) {
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'general';
}

function cryptoRandomId() {
  // Simple unique-enough id for storage folder names (not the DB primary key)
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
