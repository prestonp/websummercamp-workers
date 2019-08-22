addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

/**
 * handle requests
 * @param {Request} request
 */
async function handle(request) {
  const rawHeaders = [...request.headers]
  const headers = rawHeaders.reduce((headers, header) => {
    const [key, val] = header
    headers[key] = val;
    return headers;
  }, {});
  return new Response(JSON.stringify(headers, null, 2));
}

