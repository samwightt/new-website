import mime from 'mime'
import { mapRequestToAsset } from '@cloudflare/kv-asset-handler'

const defaultCacheControl = {
  browserTTL: null,
  edgeTTL: 2 * 60 * 60 * 24, // 2 days
  bypassCache: false, // do not bypass Cloudflare's cache
}

const shouldBeCached = (url) => (
  url.includes("/static") || url.includes(".js") || url.includes(".css")
)

const getAssetFromKV = async (event, options) => {
  // Assign any missing options passed in to the default
  options = Object.assign(
    {
      ASSET_NAMESPACE: __STATIC_CONTENT,
      ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
      mapRequestToAsset: mapRequestToAsset,
      cacheControl: defaultCacheControl,
    },
    options,
  )

  const request = event.request
  const ASSET_NAMESPACE = options.ASSET_NAMESPACE
  const ASSET_MANIFEST = options.ASSET_MANIFEST

  const SUPPORTED_METHODS = ['GET', 'HEAD']

  if (!SUPPORTED_METHODS.includes(request.method)) {
    throw new MethodNotAllowedError(`${request.method} is not a valid request method`)
  }

  if (typeof ASSET_NAMESPACE === 'undefined') {
    throw new InternalError(`there is no KV namespace bound to the script`)
  }

  // determine the requestKey based on the actual file served for the incoming request
  const requestKey = options.mapRequestToAsset(request)
  console.log(requestKey.url)
  const parsedUrl = new URL(requestKey.url)

  const pathname = parsedUrl.pathname

  // pathKey is the file path to look up in the manifest
  let pathKey = pathname.replace(/^\/+/, '') // remove prepended /

  // @ts-ignore
  const cache = caches.default
  const mimeType = mime.getType(pathKey) || 'text/plain'

  let shouldEdgeCache = false // false if storing in KV by raw file path i.e. no hash
  // check manifest for map from file path to hash
  if (typeof ASSET_MANIFEST !== 'undefined') {
    if (JSON.parse(ASSET_MANIFEST)[pathKey]) {
      pathKey = JSON.parse(ASSET_MANIFEST)[pathKey]
      shouldEdgeCache = true // cache on edge if pathKey is a unique hash
    }
  }
  // TODO this excludes search params from cache, investigate ideal behavior
  let cacheKey = new Request(`${parsedUrl.origin}/${pathKey}`, request)

  // if argument passed in for cacheControl is a function then
  // evaluate that function. otherwise return the Object passed in
  // or default Object
  const evalCacheOpts = (() => {
    switch (typeof options.cacheControl) {
      case 'function':
        return options.cacheControl(request)
      case 'object':
        return options.cacheControl
      default:
        return defaultCacheControl
    }
  })()

  options.cacheControl = Object.assign({}, defaultCacheControl, evalCacheOpts)

  // override shouldEdgeCache if options say to bypassCache
  if (options.cacheControl.bypassCache || options.cacheControl.edgeTTL === null) {
    shouldEdgeCache = false
  }
  // only set max-age if explictly passed in a number as an arg
  const shouldSetBrowserCache = typeof options.cacheControl.browserTTL === 'number'

  let response = null
  if (shouldEdgeCache) {
    response = await cache.match(cacheKey)
  }

  if (response) {
    let headers = new Headers(response.headers)
    headers.set('CF-Cache-Status', 'HIT')
    if (shouldBeCached(requestKey.url)) headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    else headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    response = new Response(response.body, { headers })
  } else {
    const body = await ASSET_NAMESPACE.get(pathKey, 'arrayBuffer')
    if (body === null) {
      throw new NotFoundError(`could not find ${pathKey} in your content namespace`)
    }
    response = new Response(body)

    // TODO: could implement CF-Cache-Status REVALIDATE if path w/o hash existed in manifest

    if (shouldEdgeCache) {
      response.headers.set('CF-Cache-Status', 'MISS')
      // determine Cloudflare cache behavior
      if (shouldBeCached(requestKey.url)) response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      else response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
      event.waitUntil(cache.put(cacheKey, response.clone()))
    }
  }
  response.headers.set('Content-Type', mimeType)
  if (shouldBeCached(requestKey.url)) response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  else response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  return response
}

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  let options = {}

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }
    return await getAssetFromKV(event, options)
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
      } catch (e) { }
    }

    return new Response(e.message || e.toString(), { status: 500 })
  }
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
function handlePrefix(prefix) {
  return request => {
    // compute the default (e.g. / -> index.html)
    let defaultAssetKey = mapRequestToAsset(request)
    let url = new URL(defaultAssetKey.url)

    // strip the prefix from the path for lookup
    url.pathname = url.pathname.replace(prefix, '/')

    // inherit all other props from the default request
    return new Request(url.toString(), defaultAssetKey)
  }
}