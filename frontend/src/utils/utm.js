export function getUtmParams() {
  const q = new URLSearchParams(window.location.search);
  const pick = (k) => q.get(k) || null;
  return {
    utmSource: pick('utm_source'),
    utmMedium: pick('utm_medium'),
    utmCampaign: pick('utm_campaign'),
    utmTerm: pick('utm_term'),
    utmContent: pick('utm_content'),
    gclid: pick('gclid'),
    referrer: document.referrer || null,
    landingPage: window.location.pathname + (window.location.search || ''),
  };
}

