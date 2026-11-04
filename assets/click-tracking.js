/* Fitness Finds HQ: analytics starts only after opt-in. Affiliate URLs are never changed. */
(function () {
  'use strict';
  if (window.ffhqAnalyticsLoaded) return;
  window.ffhqAnalyticsLoaded = true;
  var id = 'G-XPS7L21C89', key = 'ffhq-analytics-consent', enabled = false;
  function choice() { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function save(value) { try { localStorage.setItem(key, value); } catch (_) {} }
  function start() {
    if (enabled) return;
    enabled = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
    window.gtag('js', new Date());
    window.gtag('config', id, {allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname, page_referrer: document.referrer ? new URL(document.referrer).origin : ''});
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function classify(href) {
    var url;
    try { url = new URL(href, location.href); } catch (_) { return null; }
    if (!/^https?:$/.test(url.protocol)) return null;
    if (url.hostname === 'amazon.com' || url.hostname.endsWith('.amazon.com') || url.hostname === 'amzn.to') {
      var match = url.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:\/|$)/i);
      return {name: 'amazon_click', destination_path: url.hostname + url.pathname, product_id: match ? match[1].toUpperCase() : 'store_or_search'};
    }
    if (url.origin === location.origin && /^\/guides\/[^/]+(?:\.html)?$/.test(url.pathname)) {
      var path = url.pathname.replace(/\.html$/, '');
      if (path === location.pathname.replace(/\.html$/, '')) return null;
      return {name: 'guide_click', destination_path: path};
    }
    return null;
  }
  window.ffhqClassifyLink = classify;
  function track(event) {
    if (!enabled || event.defaultPrevented) return;
    if (event.type === 'auxclick' && event.button !== 1) return;
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var result = classify(link.href);
    if (!result) return;
    var name = result.name;
    delete result.name;
    result.source_path = location.pathname;
    result.transport_type = 'beacon';
    window.gtag('event', name, result);
  }
  document.addEventListener('click', track);
  document.addEventListener('auxclick', track);
  function showPreferences() {
    if (document.getElementById('ffhq-consent')) return;
    var box = document.createElement('section');
    box.id = 'ffhq-consent';
    box.setAttribute('aria-label', 'Analytics preferences');
    box.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;z-index:9999;background:#fff;color:#14273a;border:1px solid #536777;border-radius:12px;padding:16px;box-shadow:0 4px 24px #0003;font:14px/1.5 system-ui;max-width:640px';
    box.innerHTML = '<p style="margin:0 0 10px;color:#14273a">May we use Google Analytics cookies to measure visits, guide opens and Amazon link clicks? Advertising features are disabled. <a href="/privacy.html" style="color:#174c31">Privacy</a></p><button type="button" data-choice="yes">Allow analytics</button> <button type="button" data-choice="no">No thanks</button>';
    box.addEventListener('click', function (e) {
      var button = e.target.closest('button[data-choice]');
      if (!button) return;
      save(button.dataset.choice);
      box.remove();
      if (button.dataset.choice === 'yes') start();
      else if (enabled) location.reload();
    });
    document.body.appendChild(box);
  }
  function init() {
    if (choice() === 'yes') start();
    else if (choice() !== 'no') showPreferences();
    var footer = document.querySelector('footer') || document.body;
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Analytics preferences';
    button.addEventListener('click', showPreferences);
    footer.appendChild(button);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
