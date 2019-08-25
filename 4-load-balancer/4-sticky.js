// Our examples are using a random distribution, but in some
// cases we might want users to also connect to the same host
// after being assigned a random host. This is called sticky
// sessions or session affinity.
//
// Note that this fixes the broken assets because these sites
// typically load assets using a relative path. So when wikipedia.org
// tries to load images from a relative path like /img/001.png, our
// previous LBs scattered requests to random hosts.
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
  const cookie = parseCookie(request.headers.get('Cookie'))

  // The cf-lb cookie will contain an integer index to a host,
  // thus each browser will be served by the same host.
  assignment = cookie['cf-lb']
  if (assignment) {
    const i = parseInt(assignment)
    var url = new URL(request.url);
    url.hostname = origins[i];
    return await fetch(url);
  }

  // No cookie found yet, so handle the assignment, here's
  // let's reuse our random scheme from earlier example.
  const i = ~~(Math.random() * origins.length)
  var url = new URL(request.url)
  url.hostname = origins[i]

  // Responses are also immutable, so must recreate
  // Also! Let's set a cookie which assigns the fixed index
  let response = await fetch(url)
  response = new Response(response.body, response)
  response.headers.set('Set-Cookie', 'cf-lb='+i)
  return response
}

// parseCookie converts string cookie value into an object
//
// Example Cookie header
//     Cookie: sessid=1e39fa; tracking-id=9;
// Returns 
//     { 'sessid': '1e39fa', 'tracking-id': '9' }
function parseCookie(val) {
  // Split into key-value pairs
  const kvs = val.split(';').filter(v => v !== '' )
  
  // Fold the pairs into a simple object
  return kvs.reduce((cookie, kv) => {
    kv = kv.trim()
    const [k, v] = kv.split('=')
    cookie[k] = v
    return cookie
  }, {})
}