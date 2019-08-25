// If you have a logging service, you can map logs to an external service
// for this demo, we will use a service I created that manages simple log
// files: http://mirror.preston.io
//
// API is not authenticated so try to use a unique identifier
// for your log filename
//
// GET http://mirror.preston.io/:file
//   Fetch the log file
// DELETE http://mirror.preston.io/:file
//   Remove log file
// POST http://mirror.preston.io/:file
//   Append an entry using the request body

const log = async (v) => await fetch('http://mirror.preston.io/websummercamp', { 
  method: 'POST',
  body: v 
})

addEventListener('fetch', event => {
  // When logging using this strategy, you must 
  // account for a small but important detail: 
  // normally, any outstanding asynchronous tasks
  // are canceled as soon as a Worker finishes sending 
  // its main response body back to the client.
  // In order to ensure that a logging subrequest 
  // completes, you can pass its fetch() promise to 
  // event.waitUntil()
  event.waitUntil(log('setting up content'))
  const content = 
`<html>
  <h1>Hello websummercamp!</h1>
</html>`
  event.waitUntil(log('responding with ' + content))
  event.respondWith(new Response(content, { 
    headers: {
      'content-type': 'text/html'
    }
  }))
})

