(() => {
  const endpoint = 'https://script.google.com/a/macros/upsight.digital/s/AKfycbx_RHdEcnM1hIUtLgvllX9_S7J7NlJTPKI0MGoI-yWwpqn6Q9LUR-yPA7zNvH3qLLu5/exec';
  const storageKey = '__upsight_ab_consent_v2__';
  let consent = false;
  let running = false;
  let reported = false;
  let controller;

  // Local DOM detection: no network, cookie, identifier or storage access.
  const domResult = new Promise(resolve => {
    const bait = document.createElement('div');
    bait.className = 'ad ads ad-banner adsbox adsbygoogle ad-slot adunit pub_300x250 text-ad textAd header-ad';
    bait.style.cssText = 'width:1px!important;height:1px!important;position:absolute!important;left:-10000px!important;top:-1000px!important';
    bait.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bait);
    setTimeout(() => {
      const style = getComputedStyle(bait);
      const blocked = !bait.isConnected || style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || !bait.offsetHeight || !bait.offsetWidth;
      bait.remove();
      window.dispatchEvent(new CustomEvent('upsight:adblock-detected', { detail: { blocked, signal: 'dom' } }));
      resolve(blocked);
    }, 2000);
  });

  async function runConsentedCheck() {
    if (!consent || running || reported) return;
    try { if (sessionStorage.getItem(storageKey)) return; } catch { /* Storage may be disabled. */ }
    running = true;
    controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      let blocked = await domResult;
      let signal = blocked ? 'dom' : 'none';
      for (const url of [
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
        'https://connect.facebook.net/en_US/fbevents.js',
        'https://www.google-analytics.com/g/collect',
      ]) {
        if (!consent || controller.signal.aborted) return;
        try {
          await fetch(url, { mode: 'no-cors', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal: controller.signal });
        } catch {
          if (controller.signal.aborted) return;
          blocked = true; signal = 'network'; break;
        }
      }
      if (!consent || controller.signal.aborted) return;
      const params = new URLSearchParams({ landing_page: location.origin + location.pathname, adblocker: String(blocked), signal, event_id: crypto.randomUUID() });
      const image = new Image();
      image.referrerPolicy = 'no-referrer';
      image.src = `${endpoint}?${params}`;
      window.__ab_beacon_ref = image;
      reported = true;
      try { sessionStorage.setItem(storageKey, '1'); } catch { /* Optional deduplication. */ }
    } finally { clearTimeout(timeout); running = false; }
  }

  // Documented CMP/GTM bridge; absent consent fails closed. Do not infer consent
  // from cookies, generic dataLayer event names, or undocumented GTM internals.
  function updateConsent(state) {
    consent = ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization'].every(key => state?.[key] === 'granted');
    if (consent) void runConsentedCheck();
    else controller?.abort();
  }
  window.addEventListener('upsight:consent', event => updateConsent(event.detail));
  updateConsent(window.upsightConsent);
})();
