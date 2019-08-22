addEventListener('fetch', event => {
  const content = 
`<html>
  <h1>Hello websummercamp!</h1>
  <p>How can we tell the browser to render html?</p>
</html>`

  event.respondWith(new Response(content, { 
    headers: {
      'content-type': 'text/plain'
    }
  }))
})
