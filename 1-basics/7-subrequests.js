// https://github.com/public-apis/public-apis
// https://pokeapi.co/api/v2/pokemon/1/

addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

/**
 * handle requests
 * @param {Request} request
 */
async function handle(request) {
  // 1-150 inclusive
  const pokeId = Math.floor(Math.random() *  150) + 1
  const pokeResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
  const pokeData = await pokeResp.json()

  // Note that we are proxying the api response but we could easily reshape
  // the content. This has practical uses like normalizing disparate APIs or
  // maintaining legacy apis. You could also combine several subrequests into
  // one response.
  const body = {
    pokemon: pokeData,
    // pokemon: { name: pokeData.name },
  }
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'content-type': 'application/json',
    },
  })
}

