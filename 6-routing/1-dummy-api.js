addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

/**
 * Dummy CRUD app
 * @param {Request} request
 */
async function handle(request) {
  const url = new URL(request.url)
  if (request.method === 'POST' && url.pathname === "/") {
    return new Response('create')
  } else if (request.method === 'GET' && url.pathname.match(/\/.+/)) {
    return new Response('read')
  } else if (request.method === 'PATCH' && url.pathname.match(/\/.+/)) {
    return new Response('update')
  } else if (request.method === 'DELETE' && url.pathname.match(/\/.+/)) {
    return new Response('delete')
  } else {
    return new Response('not found', { status: 404 })
  }
}
