addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

/**
 * @param {Request} request
 */
async function handle(request) {
  const response = await fetch(request)

  // Make sure we only modify text, not images.
  let type = response.headers.get("Content-Type") || ""
  if (!type.startsWith("text/")) {
    // Not text. Don't modify.
    return response
  }

  let text = await response.text()
  //text = text.replace("</head>", "<style>body{transform:rotate(180deg);}</style></head>")

  return new Response(text, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  })
}

