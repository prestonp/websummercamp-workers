const qr = require('qr-image')

const generate = async request => {
  const { text } = await request.json()
  const headers = { 'Content-Type': 'text/plain' }
  const qrPng = qr.imageSync(text || 'https://workers.dev')
  const qrEncoded = "data:image/png;base64," + qrPng.toString('base64')
  return new Response(qrEncoded, { headers })
}

const landing = `
<h1>QR Generator</h1>
<p>Click the below button to generate a new QR code. This will make a request to your serverless function.</p>
<input type="text" id="text" value="https://workers.dev"></input>
<button onclick='generate()'>Generate QR Code</button>
<p><img></img></p>
<script>
  function generate() {
    fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: document.querySelector("#text").value })
    }).then(body => {
      body.text().then(data => {
        document.querySelector('img').src = data
      })
    })
  }
</script>
`

async function handleRequest(request) {
  let response
  if (request.method === 'POST') {
    response = await generate(request)
  } else {
    response = new Response(landing, { headers: { 'Content-Type': 'text/html' } })
  }
  return response
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
