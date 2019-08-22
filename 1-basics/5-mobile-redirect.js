addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

const mobileUserAgents = [
  'iphone',
  'android',
]

/**
 * handle requests
 * @param {Request} request
 */
async function handle(request) {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase()
  const isMobile = mobileUserAgents.some(m => userAgent.indexOf(m) >= 0)

  if (isMobile) {
    return fetch('http://old.reddit.com')
  }

  return fetch('http://reddit.com')
}
