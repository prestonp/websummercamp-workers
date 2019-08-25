// Link shortener API
//
// GET / 
//   Return html form to enter url to be shortened
// POST /
//   Generate shortened link
// GET /:id
//   Redirect to destination using short id
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
  url = new URL(request.url)

  if (request.method == 'GET' && url.pathname === '/') {
    return new Response(formHTML, { 
      headers: {
        'content-type': 'text/html'
      }
    })
  } else if (request.method == 'POST' && url.pathname === '/') {
    // Parse target url
    let body = await request.text()
    const val = body.substring(4) // strip `url=`
    const key = getRandID()
    
    // Save to KV
    await BUCKET.put(key, val)

    return new Response(shortenHTML(url.href, key, val), {
      headers: {
        'content-type': 'text/html'
      }
    })
  } else if (request.method == 'GET' && url.pathname.length > 0) {
    const key = url.pathname.substring(1)
    const dest = await BUCKET.get(key)
    return new Response(`redirecting to ${dest}`, {
      status: 301,
      headers: {
        location: dest
      }
    })
  } else {
    return new Response(`not found`, {
      status: 404,
    })
  }
}

const formHTML = `
<html>
  <h1>Enter a url to shorten</h1>
  <form action="/" method="post" enctype="text/plain">
    <p><input type="text" name="url"/></p>
    <p><input type="submit"></p>
  </form>
</html>
`

const shortenHTML = (base, key, url) => {
  return `
<html>
<h1>Shortened ${url}</h1>
<p><a href="${key}">${base}${key}</a></p>
<p><a href="/">Go back</a></p>
</html>
  `
}

// this doesn't actually prevent collisions, should
// use a hash
function getRandID() {
  return Math.random().toString(36).substring(2, 8)
}
