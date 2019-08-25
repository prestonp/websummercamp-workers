// Another load balancing strategy is to automatically fallback when
// the first host is unresponsive.
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
  // Attempt hitting random origin.
  const primary = getRandomInt(origins.length);
  var url = new URL(request.url);
  url.hostname = origins[primary];

  // Create a promise that resolves the origin response.
  const primaryPromise = fetch(url)

  // Create a promise that resolves to `undefined` after 2 seconds.
  let timeoutPromise = new Promise(resolve => setTimeout(resolve, 2 * 1000))

  // Wait for whichever promise completes first.
  let response = await Promise.race([primaryPromise, timeoutPromise])

  // Depending on resolution, we can return the primary response,
  // or fallback
  if (response) {
    console.log(`served ${origins[primary]}`)
    return response
  } else {
    // naive solution, try to pick some other host
    let fallback = primary;
    while(fallback == primary) {
      fallback = getRandomInt(origins.length)
    }

    // serve fallback
    console.log(`${origins[primary]} took too long; serving ${origins[fallback]} instead`)
    var fallbackUrl = new URL(request.url);
    fallbackUrl.hostname = origins[fallback];
    return await fetch(fallbackUrl);
  }
}

// getRandomInt generates a random int in range [0, n)
function getRandomInt(n) {
  return ~~(Math.random() *  n)
}