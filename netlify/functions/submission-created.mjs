// ─────────────────────────────────────────────────────────────────────────────
// Lead router — runs automatically on every verified Netlify Forms submission
// (Netlify invokes functions named `submission-created` on that event).
//
//   1. Scores & categorizes the lead (segment, urgency, value tier, priority)
//   2. Emails the office a formatted lead alert              (Resend)
//   3. Emails the customer an instant confirmation           (Resend)
//   4. Texts the customer a confirmation if they opted in    (Twilio)
//   5. Texts the owner a short alert for hot leads           (Twilio)
//   6. Pushes the lead to your CRM / Zapier / Make webhook   (any URL)
//
// Every channel is optional and switches on when its environment variables are
// set in Netlify → Site configuration → Environment variables:
//   RESEND_API_KEY, LEAD_FROM ("D.RAM Demolition <estimates@yourdomain.com>"),
//   LEAD_NOTIFY_TO (comma-separated), TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
//   TWILIO_FROM (+1714…), OWNER_SMS_TO (+1714…), CRM_WEBHOOK_URL, BUSINESS_PHONE
// ─────────────────────────────────────────────────────────────────────────────

const env = (k) => process.env[k] || '';
const PHONE = env('BUSINESS_PHONE') || '714-872-6566';

const HIGH = ['Residential Demolition', 'Commercial Demolition'];
const MEDIUM = ['Selective Demolition', 'Concrete Demolition', 'Concrete Slab Removal', 'Garage Demolition', 'Retaining Wall Removal', 'Asphalt Removal', 'Driveway Removal', 'Block Wall Demolition', 'Patio Removal'];
const COMMERCIAL_TYPES = /contractor|property manager|hoa|commercial|developer|owner \/ business|agency|architect/i;

export function scoreLead(form, d) {
  const segment = form === 'commercial-bid' || COMMERCIAL_TYPES.test(d.customer_type || '') ? 'Commercial' : 'Residential';

  // Urgency
  let urgency = 'Warm';
  const tl = d.timeline || '';
  if (/soon as possible|2 weeks/i.test(tl)) urgency = 'Hot';
  else if (/planning|budget/i.test(tl)) urgency = 'Nurture';
  if (d.bid_due) {
    const days = (new Date(d.bid_due) - Date.now()) / 864e5;
    urgency = days <= 7 ? 'Hot' : 'Warm';
  }

  // Estimated value tier
  const tiers = ['Standard', 'Medium', 'High'];
  let tier = form === 'commercial-bid' ? 2 : HIGH.includes(d.service) ? 2 : MEDIUM.includes(d.service) ? 1 : 0;
  const sq = Number(String(d.dimensions || '').replace(/,/g, '').match(/(\d{3,})\s*(sq|sf|square)/i)?.[1] || 0);
  const lxw = String(d.dimensions || '').match(/(\d+)\s*(?:ft|')?\s*[x×]\s*(\d+)/i);
  const area = sq || (lxw ? Number(lxw[1]) * Number(lxw[2]) : 0);
  if (area >= 1500) tier = Math.min(2, tier + 1);
  if (segment === 'Commercial') tier = Math.max(tier, 1);

  const hasPhotos = Object.keys(d).some((k) => /^(photo|plans)_\d/.test(k) && d[k]) || !!d.plans_link;
  const score = Math.min(100,
    20 + { Hot: 35, Warm: 20, Nurture: 5 }[urgency] + tier * 15 + (hasPhotos ? 10 : 0) + (segment === 'Commercial' ? 5 : 0) + (d.email ? 5 : 0));

  return { segment, urgency, valueTier: tiers[tier], priority: score, hasAttachments: hasPhotos, approxArea: area || null };
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fileUrl = (v) => (v && typeof v === 'object' ? v.url : typeof v === 'string' && v.startsWith('http') ? v : '');
const SKIP = new Set(['form-name', 'company_website', 'ip', 'user_agent', 'referrer']);

function ownerEmail(form, d, s) {
  const rows = Object.entries(d)
    .filter(([k, v]) => !SKIP.has(k) && v && !/^(photo|plans)_\d/.test(k))
    .map(([k, v]) => `<tr><td style="padding:6px 10px;color:#666;white-space:nowrap">${esc(k.replace(/_/g, ' '))}</td><td style="padding:6px 10px">${esc(Array.isArray(v) ? v.join(', ') : v)}</td></tr>`).join('');
  const files = Object.entries(d).filter(([k]) => /^(photo|plans)_\d/.test(k)).map(([k, v]) => fileUrl(v)).filter(Boolean);
  const tel = String(d.phone || '').replace(/[^\d+]/g, '');
  return `<div style="font-family:Arial,sans-serif;max-width:640px">
  <div style="background:#0b0b0b;color:#fff;padding:16px 20px;border-top:5px solid #f26a1b">
    <strong style="font-size:18px">New ${esc(s.segment.toLowerCase())} lead — ${esc(d.service || d.project_name || form)}</strong><br>
    <span style="color:#f26a1b">${esc(s.urgency)} · ${esc(s.valueTier)} value · priority ${s.priority}/100</span>
  </div>
  <p style="padding:0 4px"><a href="tel:${esc(tel)}" style="display:inline-block;background:#f26a1b;color:#000;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold">Call ${esc(d.name)} — ${esc(d.phone)}</a></p>
  <table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table>
  ${files.length ? `<p><strong>Attachments:</strong><br>${files.map((u, i) => `<a href="${esc(u)}">File ${i + 1}</a>`).join(' · ')}</p><p style="color:#888;font-size:12px">Attachment links expire — download from the Netlify Forms dashboard if needed.</p>` : '<p style="color:#888">No attachments.</p>'}
</div>`;
}

function customerEmail(form, d) {
  const first = String(d.name || '').split(' ')[0] || 'there';
  const what = form === 'commercial-bid' ? `your bid request for <strong>${esc(d.project_name)}</strong>` : `your ${esc(d.service ? d.service.toLowerCase() : 'project')} request`;
  return `<div style="font-family:Arial,sans-serif;max-width:560px;color:#1a1b1d">
  <div style="background:#0b0b0b;padding:18px 20px;border-top:5px solid #f26a1b;color:#fff;font-size:20px;font-weight:bold">D.RAM Demolition &amp; Hauling</div>
  <p>Hi ${esc(first)},</p>
  <p>Thanks for reaching out — we received ${what}${d.city ? ` in ${esc(d.city)}` : ''}.</p>
  <p><strong>What happens next:</strong> our estimator will review your details${d.photo_1 || d.plans_1 ? ' and files' : ''} and contact you within one business day${d.preferred_contact ? ` by ${esc(String(d.preferred_contact).toLowerCase())}` : ''}.</p>
  <p>Need us sooner? Call <a href="tel:${PHONE.replace(/\D/g, '')}">${esc(PHONE)}</a>.</p>
  <p>— The D.RAM Demolition team</p>
  <p style="color:#888;font-size:12px">You’re receiving this because you submitted a request on our website.</p>
</div>`;
}

async function resend(to, subject, html, replyTo) {
  if (!env('RESEND_API_KEY') || !env('LEAD_FROM') || !to) return 'skipped';
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env('LEAD_FROM'), to: Array.isArray(to) ? to : [to], subject, html, ...(replyTo && { reply_to: replyTo }) }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}: ${await r.text()}`);
  return 'sent';
}

const e164 = (p) => {
  const n = String(p || '').replace(/\D/g, '');
  return n.length === 10 ? `+1${n}` : n.length === 11 && n.startsWith('1') ? `+${n}` : '';
};

async function sms(to, body) {
  const sid = env('TWILIO_ACCOUNT_SID');
  if (!sid || !env('TWILIO_AUTH_TOKEN') || !env('TWILIO_FROM') || !to) return 'skipped';
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${env('TWILIO_AUTH_TOKEN')}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: to, From: env('TWILIO_FROM'), Body: body }),
  });
  if (!r.ok) throw new Error(`twilio ${r.status}: ${await r.text()}`);
  return 'sent';
}

async function webhook(payload) {
  if (!env('CRM_WEBHOOK_URL')) return 'skipped';
  const r = await fetch(env('CRM_WEBHOOK_URL'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error(`crm ${r.status}`);
  return 'sent';
}

export const handler = async (event) => {
  let payload;
  try { payload = JSON.parse(event.body).payload; } catch { return { statusCode: 400, body: 'bad payload' }; }
  const form = payload.form_name;
  const d = payload.data || {};
  if (d.company_website) return { statusCode: 200, body: 'ignored' }; // honeypot

  const s = scoreLead(form, d);
  const label = `[${s.urgency}${s.valueTier === 'High' ? ' · High value' : ''}] ${d.service || d.project_name || 'New request'} — ${d.city || 'n/a'} — ${d.name || ''}`;
  const notify = env('LEAD_NOTIFY_TO').split(',').map((x) => x.trim()).filter(Boolean);

  const jobs = {
    ownerEmail: resend(notify, label, ownerEmail(form, d, s), d.email),
    customerEmail: form === 'contact' && !d.email ? Promise.resolve('skipped') : resend(d.email, form === 'commercial-bid' ? 'We received your bid request — D.RAM Demolition' : 'We received your estimate request — D.RAM Demolition', customerEmail(form, d)),
    customerSms: d.sms_consent === 'yes' ? sms(e164(d.phone), `D.RAM Demolition: Thanks ${String(d.name || '').split(' ')[0]}! We got your ${d.service ? d.service.toLowerCase() : ''} request and will contact you within 1 business day. Questions: ${PHONE}. Reply STOP to opt out.`) : Promise.resolve('skipped'),
    ownerSms: s.urgency === 'Hot' || s.valueTier === 'High' ? sms(env('OWNER_SMS_TO'), `${label.slice(0, 110)} · ${d.phone || ''}`) : Promise.resolve('skipped'),
    crm: webhook({
      source: 'website', form, submittedAt: payload.created_at, submissionId: payload.id, ...s,
      contact: { name: d.name, phone: d.phone, email: d.email, company: d.company, preferred: d.preferred_contact, smsConsent: d.sms_consent === 'yes' },
      project: { service: d.service, city: d.city, address: d.project_address, timeline: d.timeline, dimensions: d.dimensions, thickness: d.thickness, materials: d.materials, access: d.access, details: d.details, projectName: d.project_name, bidDue: d.bid_due, startDate: d.start_date, scope: d.scope, plansLink: d.plans_link },
      files: Object.entries(d).filter(([k]) => /^(photo|plans)_\d/.test(k)).map(([, v]) => fileUrl(v)).filter(Boolean),
      attribution: { landingPage: d.landing_page, referrer: d.referrer, utmSource: d.utm_source, utmMedium: d.utm_medium, utmCampaign: d.utm_campaign, utmTerm: d.utm_term, gclid: d.gclid, heardFrom: d.heard_from },
    }),
  };

  const names = Object.keys(jobs);
  const results = await Promise.allSettled(Object.values(jobs));
  const summary = Object.fromEntries(results.map((r, i) => [names[i], r.status === 'fulfilled' ? r.value : `error: ${r.reason.message}`]));
  console.log(JSON.stringify({ form, ...s, summary }));
  return { statusCode: 200, body: JSON.stringify(summary) };
};
