// This adapts the previous pokemon api wrapper with
// request logging. The basic gist is to create
// a log ledger and return it as response header if
// the request has a special verbose header. The
// log header is base64 encoded.
//
// Example decoding via cli:
//
// $ echo "MjAxOS0wOC0yNVQxMDozODo0OC4xMjJaIFtpbmZvXSAtIGZldGNoaW5nIHBva2Vtb24gIzEyMAoyMDE5LTA4LTI1VDEwOjM4OjQ4LjU1N1ogW2luZm9dIC0gZ290IHN0YXJ5dQoyMDE5LTA4LTI1VDEwOjM4OjQ4LjU1N1ogW2RlYnVnXSAtIHJldHVybmluZyByZXNwb25zZQo=" | base64 -D
addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(request) {
  const logger = new Logger('info')

  // 1-150 inclusive
  const pokeId = Math.floor(Math.random() *  150) + 1
  
  logger.info(`fetching pokemon #${pokeId}`)
  
  const pokeResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
  const pokeData = await pokeResp.json()
  logger.info(`got ${pokeData.name}`)

  const body = {
    pokemon: { name: pokeData.name },
  }

  logger.debug('returning response')

  const headers = {
    'content-type': 'application/json',
  }

  if (request.headers.get('verbose')) {
    headers.logs = btoa(logger.logs.join(''))
  }

  return new Response(JSON.stringify(body, null, 2), {
    headers: headers
  })
}

// Simple logger that records logs into a list.
//
// Usage
// 
// const logger = new Logger()
// logger.info('hi')
// logger.warn('something bad happened')
// console.log(logger.logs)
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
