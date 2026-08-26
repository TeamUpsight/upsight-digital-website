(function () {
  var CONFIG = {
    // -----------------------------------------------------------
    // CONFIGURATION
    // -----------------------------------------------------------
    endpoint: 'https://script.google.com/a/macros/upsight.digital/s/AKfycbx_RHdEcnM1hIUtLgvllX9_S7J7NlJTPKI0MGoI-yWwpqn6Q9LUR-yPA7zNvH3qLLu5/exec',
    storageKey: '__upsight_digital_ab_check_v1__',
    domTimeout: 2000,
    domPollMs: 100
  };

  // -----------------------------------
  // 1. Utilities
  // -----------------------------------
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function enc(v) { return encodeURIComponent(v == null ? '' : String(v)); }

  function getCookie(name) {
    try {
      var m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : '';
    } catch (e) { return ''; }
  }

  function getGA4ClientId() {
    var ga = getCookie('_ga');
    if (!ga) return '';
    var p = ga.split('.');
    return p.length >= 4 ? (p[2] + '.' + p[3]) : '';
  }

  // -----------------------------------
  // 2. Persistent Run-Once Guard
  // -----------------------------------
  function hasRan() {
    try {
      if (window.localStorage && localStorage.getItem(CONFIG.storageKey)) return true;
      if (window.sessionStorage && sessionStorage.getItem(CONFIG.storageKey)) return true;
    } catch (e) { /* Storage blocked */ }
    return false;
  }

  function markRan() {
    try {
      if (window.localStorage) localStorage.setItem(CONFIG.storageKey, '1');
      if (window.sessionStorage) sessionStorage.setItem(CONFIG.storageKey, '1');
    } catch (e) { /* Storage blocked */ }
  }

  if (hasRan()) return;

  // -----------------------------------
  // 3. Reporting Mechanism (Image Beacon)
  // -----------------------------------
  function sendReport(adblockerEnabled, signal) {
    var eventId = generateUUID();
    var gaClientId = getGA4ClientId();
    
    var reportUrl = CONFIG.endpoint +
      '?landing_page=' + enc(window.location.href) +
      '&client_id=' + enc(gaClientId) +
      '&adblocker=' + enc(adblockerEnabled) +
      '&signal=' + enc(signal) +
      '&event_id=' + enc(eventId);

    // PRIMARY METHOD: Image Beacon
    var img = new Image();
    img.src = reportUrl;
    
    // Optional: retain reference to prevent garbage collection before request fires
    window.__ab_beacon_ref = img; 

    markRan();
  }

  // -----------------------------------
  // 4. Network Detection
  // -----------------------------------
  var networkBaits = [
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    'https://connect.facebook.net/en_US/fbevents.js',
    'https://www.google-analytics.com/g/collect'
  ];

  function checkNetwork(index) {
    if (index >= networkBaits.length) return Promise.resolve(false); // All passed

    // Cache buster ensures we test the NETWORK, not the disk cache
    var url = networkBaits[index] + '?t=' + Date.now();

    if (!window.fetch) return Promise.resolve(false); // Fallback if no fetch

    return fetch(url, { mode: 'no-cors', cache: 'no-store' })
      .then(function() {
        // Success (opaque response) => Not blocked
        return checkNetwork(index + 1);
      })
      .catch(function() {
        // Failed => Blocked
        return true; 
      });
  }

  // -----------------------------------
  // 5. DOM Detection
  // -----------------------------------
  function checkDOM() {
    return new Promise(function (resolve) {
      var bait = document.createElement('div');
      
      // Standard bait classes
      bait.className = 'ad ads ad-banner adsbox adsbygoogle ad-slot adunit pub_300x250 text-ad textAd header-ad';
      bait.style.cssText = 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;';
      bait.setAttribute('aria-hidden', 'true');

      document.body.appendChild(bait);

      function isBlocked() {
        if (!bait.isConnected) return true; 
        var cs = window.getComputedStyle(bait);
        return (
          cs.display === 'none' || 
          cs.visibility === 'hidden' || 
          cs.opacity === '0' ||
          bait.offsetHeight === 0 || 
          bait.offsetWidth === 0
        );
      }

      var observer;
      var timer;

      function finish(blocked) {
        if (observer) observer.disconnect();
        if (timer) clearTimeout(timer);
        if (bait.parentNode) bait.parentNode.removeChild(bait);
        resolve(blocked);
      }

      if (window.MutationObserver) {
        observer = new MutationObserver(function () {
          if (isBlocked()) finish(true);
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
      }

      var start = Date.now();
      (function loop() {
        if (isBlocked()) {
          finish(true);
        } else if (Date.now() - start > CONFIG.domTimeout) {
          finish(false); 
        } else {
          timer = setTimeout(loop, CONFIG.domPollMs);
        }
      })();
    });
  }

  // -----------------------------------
  // 6. Main Execution - Run after page load
  // -----------------------------------
  function init() {
    checkNetwork(0).then(function (isNetworkBlocked) {
      if (isNetworkBlocked) {
        sendReport(true, 'network');
        return;
      }
      checkDOM().then(function (isDomBlocked) {
        sendReport(isDomBlocked, isDomBlocked ? 'dom' : 'none');
      });
    });
  }

  // Wait for page to be fully loaded before running detection
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Page already loaded
    init();
  }

})();
