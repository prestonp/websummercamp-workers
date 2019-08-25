const US_HOST = "us.example.com"
const IN_HOST = "in.example.com"

var COUNTRIES_MAP = {
  IN: IN_HOST,
  PK: IN_HOST,
  BD: IN_HOST,
  SL: IN_HOST,
  NL: IN_HOST
}
addEventListener('fetch', event => {
  var url = new URL(event.request.url);

  // This special header signals the country code of the
  // Cloudflare edge node that is handling the request.
  var countryCode = event.request.headers.get('CF-IPCountry');

  if (COUNTRIES_MAP[countryCode]) {
    url.hostname = COUNTRIES_MAP[countryCode];
  } else {
    url.hostname = US_HOST;
  }
  
  event.respondWith(fetch(url));
});