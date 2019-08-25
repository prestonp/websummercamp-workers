addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
  const logger = new Logger()

  url = new URL(request.url)

  logger.info(`${request.method}: ${url.pathname}`)
  if (request.method == 'GET' && url.pathname === '/') {
    logger.info('serving url form')
    return new Response(formHTML, { 
      headers: {
        'content-type': 'text/html',
        logs: logger.toString()
      }
    })
  } else if (request.method == 'POST' && url.pathname === '/') {
    logger.info('generating shortened link')

    // Parse target url
    let body = await request.text()
    const val = body.substring(4) // strip `url=`
    const key = getRandID()
    
    // Save to KV
    await BUCKET.put(key, val)

    logger.info(`saving ${key} => ${val}`)
    return new Response(shortenHTML(url.href, key, val), {
      headers: {
        'content-type': 'text/html',
        logs: logger.toString()
      }
    })
  } else if (request.method == 'GET' && url.pathname.length > 0) {
    const key = url.pathname.substring(1)
    const dest = await BUCKET.get(key)
    logger.info(`redirecting to ${dest}`)
    return new Response(`redirecting to ${dest}`, {
      status: 301,
      headers: {
        location: dest,
        logs: logger.toString()
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

class Logger {
  static logLvls =  {
    'fatal': 0,
    'error': 1,
    'warn': 2,
    'info': 3,
    'debug': 4,
  }

  constructor(lvl = 'info', logs = []) {
    this.lvl = lvl
    this.logs = logs
  }

  toString() {
    return btoa(this.logs.join(''))
  }

  log(lvl, msg) {
    lvl = lvl.toLowerCase()
    if (Logger.logLvls[lvl] <= Logger.logLvls[this.lvl]) {
      this.logs.push(`${new Date().toJSON()} [${lvl}] - ${msg}\n`)
    }
  }

  fatal(msg) { this.log('fatal', msg) }
  error(msg) { this.log('error', msg) }
  warn(msg) { this.log('warn', msg) }
  info(msg) { this.log('info', msg) }
  debug(msg) { this.log('debug', msg) }
}
