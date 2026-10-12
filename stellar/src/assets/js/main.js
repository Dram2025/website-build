/* Stellar Haul Away: nav, attribution, tracking, lead forms. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } },
  };
  const cfg = window.SHA || {};

  // ── Tracking ──────────────────────────────────────────────────────────────
  window.dataLayer = window.dataLayer || [];
  function track(event, params = {}) {
    window.dataLayer.push({ event, ...params });
    if (typeof window.gtag === 'function') window.gtag('event', event, params);
  }
  function adsConversion(label) {
    if (cfg.adsId && label && typeof window.gtag === 'function') window.gtag('event', 'conversion', { send_to: `${cfg.adsId}/${label}` });
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (a.matches('[data-call], a[href^="tel:"]')) {
      track('click_to_call', { link_location: a.closest('header, footer, .mbar, form, aside, section')?.className.split(' ')[0] || 'page', page_path: location.pathname });
      adsConversion(cfg.callLabel);
    } else if (a.matches('[data-sms], a[href^="sms:"]')) {
      track('click_to_text', { page_path: location.pathname });
      adsConversion(cfg.callLabel);
    } else if (a.matches('a[href^="mailto:"]')) {
      track('email_click', { page_path: location.pathname });
    } else if (a.getAttribute('href') === '/quote/') {
      track('cta_click', { cta_text: a.textContent.trim().slice(0, 60), page_path: location.pathname });
    }
  });

  // ── Mobile nav ────────────────────────────────────────────────────────────
  const menuBtn = $('[data-menu]');
  const nav = $('#site-nav');
  if (menuBtn && nav) {
    const set = (open) => {
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', () => set(!nav.classList.contains('is-open')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  }

  // ── Attribution (first touch, 90 days) ───────────────────────────────────
  const qs = new URLSearchParams(location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'gclid'];
  let attr = store.get('sha_attr');
  if (!attr || Date.now() - attr.t > 90 * 864e5 || keys.some((k) => qs.get(k))) {
    attr = { t: Date.now(), landing_page: location.pathname + location.search, referrer: document.referrer || '(direct)' };
    keys.forEach((k) => { if (qs.get(k)) attr[k] = qs.get(k); });
    store.set('sha_attr', attr);
  }
  $$('[data-attr]').forEach((el) => {
    el.value = el.dataset.attr === 'page_url' ? location.href : attr[el.dataset.attr] || '';
  });

  // ── Thank-you page conversion (fires once per submission) ─────────────────
  if (window.SHA_LEAD) {
    const key = 'sha_conv_' + location.search;
    let seen = false;
    try { seen = sessionStorage.getItem(key); sessionStorage.setItem(key, '1'); } catch { /* ignore */ }
    if (!seen) {
      track('generate_lead', { form_name: window.SHA_LEAD });
      adsConversion(cfg.leadLabel);
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
    }
  }

  // ── File pickers (photos are resized in-browser before upload) ────────────
  const MAX_TOTAL = 7.5 * 1024 * 1024;
  const fmtSize = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.round(n / 1024) + ' KB');

  function resizeImage(file, max = 1600, quality = 0.8) {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) return resolve(file);
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob((blob) => {
          if (!blob || blob.size >= file.size) return resolve(file);
          resolve(new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); }; // e.g. HEIC on non-Safari: send original
      img.src = url;
    });
  }

  function setupPicker(input, { max, field, images }) {
    const wrap = input.closest('.field');
    const list = $('[data-thumbs]', wrap);
    const drop = input.closest('[data-drop]');
    const files = [];
    input._files = files;
    input._field = field;

    const render = () => {
      list.innerHTML = '';
      files.forEach((f, i) => {
        const li = document.createElement('li');
        if (images && f.type.startsWith('image/')) {
          const im = document.createElement('img');
          im.src = URL.createObjectURL(f);
          im.alt = '';
          li.append(im);
        } else {
          li.insertAdjacentHTML('beforeend', '<span class="doc">📄</span>');
        }
        li.append(document.createTextNode(`${f.name.slice(0, 22)} · ${fmtSize(f.size)}`));
        const x = document.createElement('button');
        x.type = 'button';
        x.setAttribute('aria-label', `Remove ${f.name}`);
        x.textContent = '×';
        x.onclick = () => { files.splice(i, 1); render(); };
        li.append(x);
        list.append(li);
      });
    };

    const add = async (incoming) => {
      const status = $('.form__status', input.form);
      for (const f of incoming) {
        if (files.length >= max) { flash(status, `You can attach up to ${max} files.`); break; }
        const ready = images ? await resizeImage(f) : f;
        const total = files.reduce((a, x) => a + x.size, 0) + ready.size;
        if (total > MAX_TOTAL) { flash(status, 'Those photos are too large together. Try fewer photos, or text them to us instead.'); break; }
        files.push(ready);
      }
      render();
      input.value = '';
      track('file_attached', { form_name: input.form.getAttribute('name'), count: files.length });
    };

    input.addEventListener('change', () => add([...input.files]));
    if (drop) {
      ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
      ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('is-over'); }));
      drop.addEventListener('drop', (e) => add([...e.dataTransfer.files]));
    }
  }
  $$('[data-photos]').forEach((i) => setupPicker(i, { max: 5, field: 'photo_', images: true }));

  // ── Validation ────────────────────────────────────────────────────────────
  function flash(el, msg, ok = false) {
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('is-ok', ok);
    el.classList.toggle('is-err', !ok);
  }
  function validate(scope) {
    let first = null;
    $$('.field__err', scope).forEach((e) => e.remove());
    $$('.is-invalid', scope).forEach((e) => e.classList.remove('is-invalid'));
    const radiosDone = new Set();
    $$('input, select, textarea', scope).forEach((el) => {
      if (el.closest('.hp') || el.type === 'hidden' || el.type === 'file') return;
      if (el.type === 'radio') {
        if (radiosDone.has(el.name)) return;
        radiosDone.add(el.name);
        const group = $$(`input[name="${el.name}"]`, scope);
        if (group.some((r) => r.required) && !group.some((r) => r.checked)) {
          markErr(el.closest('.field'), 'Please choose one.', group[0]);
          first = first || group[0];
        }
        return;
      }
      if (!el.checkValidity()) {
        const msg = el.validity.valueMissing ? 'This field is required.' : el.type === 'email' ? 'Please enter a valid email.' : el.type === 'url' ? 'Please enter a full link starting with https://' : 'Please check this field.';
        el.classList.add('is-invalid');
        markErr(el.closest('.field') || el.parentElement, msg, el);
        first = first || el;
      } else if (el.type === 'tel' && el.value && el.value.replace(/\D/g, '').length < 10) {
        el.classList.add('is-invalid');
        markErr(el.closest('.field'), 'Please enter a 10-digit phone number.', el);
        first = first || el;
      }
    });
    if (first) first.focus();
    return !first;
  }
  function markErr(field, msg, el) {
    if (!field) return;
    const p = document.createElement('p');
    p.className = 'field__err';
    p.id = (el.id || el.name) + '-err';
    p.textContent = msg;
    field.append(p);
    el.setAttribute('aria-describedby', p.id);
  }

  // ── Submission ────────────────────────────────────────────────────────────
  $$('form[data-lead-form]').forEach((form) => {
    // Our own validation runs here; the browser's built-in required-field check
    // stays on in the HTML so the form can't be sent half-empty if this script fails.
    form.noValidate = true;
    const started = Date.now();
    let begun = false;
    form.addEventListener('focusin', () => {
      if (!begun) { begun = true; track('form_start', { form_name: form.getAttribute('name') }); }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = $$('.form__status', form).pop();
      if (!validate(form)) return;
      if (Date.now() - started < 3000) { flash(status, 'Please take a moment to review your details, then submit again.'); return; }

      const btn = $('button[type=submit]', form);
      const label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Sending…';
      flash(status, 'Sending your request…', true);

      const fd = new FormData(form);
      let hasFiles = false;
      $$('input[type=file]', form).forEach((i) => fd.delete(i.name));
      $$('[data-photos]', form).forEach((i) => {
        (i._files || []).forEach((f, n) => { fd.append(i._field + (n + 1), f, f.name); hasFiles = true; });
      });
      const name = form.getAttribute('name');

      // Local preview without Netlify: simulate success so the flow is testable.
      if (['localhost', '127.0.0.1'].includes(location.hostname)) {
        console.info('[preview] form submission', name, Object.fromEntries([...fd].map(([k, v]) => [k, v instanceof File ? `${v.name} (${v.size}b)` : v])));
        location.href = `/thank-you/?form=${encodeURIComponent(name)}`;
        return;
      }

      try {
        const body = hasFiles || form.enctype === 'multipart/form-data' ? fd : new URLSearchParams(fd).toString();
        const res = await fetch('/', {
          method: 'POST',
          body,
          ...(body instanceof FormData ? {} : { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }),
        });
        if (!res.ok) throw new Error(res.status);
        location.href = `/thank-you/?form=${encodeURIComponent(name)}`;
      } catch (err) {
        btn.disabled = false;
        btn.innerHTML = label;
        const phone = document.querySelector('[data-call]')?.textContent.replace(/[^\d-]/g, '') || '';
        flash(status, `Sorry, your request didn’t go through. Please try again, or call us${phone ? ' at ' + phone : ''}.`);
        track('form_error', { form_name: name, error: String(err.message || err) });
      }
    });
  });
})();
