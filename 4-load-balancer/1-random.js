// Basic random load balancer
// Typically you would balance multiple instances
// of the same application to spread load over
// multiple hosts, i.e.
//
// const origins = [
//   'a.cloudflare.com',
//   'b.cloudflare.com',
//   'c.cloudflare.com'
// ]
//
// For this example, we'll use varying hosts
// for demonstration
const origins = [
  'wikipedia.org',
  'twitter.com',
  'cloudflare.com'
]

addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

/**
 * handle requests
 * @param {Request} request
 */
async function handle(request) {
  // Grab random origin
  const i = ~~(Math.random() * origins.length);

  // Replace hostname
  var url = new URL(request.url);
  url.hostname = origins[i];

  // Gotcha: Request objects are immutable, so we must recreate
  // request or call fetch with new url
  const response = await fetch(url)
  return response
}