// Log is middleware to print timestamp, method and url
function Log(handler) {
  return req => {
    console.log(`${new Date().toJSON()} [${req.method}] ${req.url}`)
    return handler(req)
  }
}

// Authorization is middleware to check authorization header
function Auth(token) {
  return function(handler) {
    return req => {
      if (req.headers.get('Authorization') !== token) {
        return ForbiddenHandler(req)
      }
      return handler(req)
    }
  } 
}

// Define a router class to handle wiring conditional statements
// to a specific handler
class Router {
  constructor() {
    this.routes = []
  }

  post(...args) {
    return this.handle('post', ...args)
  }

  patch(...args) {
    return this.handle('patch', ...args)
  }

  put(...args) {
    return this.handle('put', ...args)
  }

  get(...args) {
    return this.handle('get', ...args)
  }

  head(...args) {
    return this.handle('head', ...args)
  }

  delete(...args) {
    return this.handle('delete', ...args)
  }

  // handle(<Method>, <Regexp>, [...Middleware], <Handler>)
  handle(...args) {
    if (args.length < 3) {
      return new Response('internal server error', { status: 500 })
    }

    const method = args.shift();
    const pathRegexp = args.shift();
    let handler = args.pop();

    for (let middleware of args) {
      handler = middleware(handler)
    }

    this.routes.push({
      method,
      pathRegexp,
      handler
    })

    return this
  }

  // route to the first matching handler
  route(req) {
    // find first matching route
    const route = this.routes.find(r => {
      const url = new URL(req.url)
      return r.method === req.method.toLowerCase() && 
        url.pathname.match(r.pathRegexp)
    })

    // run this route's handler
    if (route) {
      return route.handler(req);
    }

    // otherwise serve 404
    return NotFoundHandler(req)
  }
}

// Application router
const router = new Router()
  .post(/^\/$/, Log, CreateHandler)
  .get(/^\/$/, Log, ListHandler)
  .get(/\/.+/, Log, ReadHandler)
  .put(/\/.+/, Log, Auth('hunter2'), UpdateHandler)
  .delete(/\/.+/, Log, DeleteHandler)

addEventListener('fetch', event => {
  event.respondWith(router.route(event.request))
})

async function CreateHandler(req) {
  return new Response('create')
}

async function ListHandler(req) {
  return new Response('list')
}

async function ReadHandler(req) {
  return new Response('read')
}

async function UpdateHandler(req) {
  return new Response('update')
}

async function DeleteHandler(req) {
  return new Response('delete')
}

async function NotFoundHandler(req) {
  return new Response('resource not found', {
    status: 404,
    statusText: 'not found',
    headers: {
      'content-type': 'text/plain'
    }
  })
}

async function ForbiddenHandler(req) {
  return new Response('forbidden', {
    status: 403,
    statusText: 'forbidden',
    headers: {
      'content-type': 'text/plain'
    }
  })
}
