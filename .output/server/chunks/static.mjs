import { createError } from 'h3';
import { withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';

const assets = {
  "/_nuxt/admin-5ec1a2b1.mjs": {
    "type": "application/javascript",
    "etag": "\"ee-AFI3VsAuFScbIGcZzg5mzogplMI\"",
    "mtime": "2021-10-20T08:12:59.051Z",
    "path": "../public/_nuxt/admin-5ec1a2b1.mjs"
  },
  "/_nuxt/entry-ffa19f37.mjs": {
    "type": "application/javascript",
    "etag": "\"2354d-MmStAmGhT7YOfYAb15uGtpFOx60\"",
    "mtime": "2021-10-20T08:12:59.052Z",
    "path": "../public/_nuxt/entry-ffa19f37.mjs"
  },
  "/_nuxt/index-d007a682.mjs": {
    "type": "application/javascript",
    "etag": "\"196-JRLbfmJT89fiWyQMRF7+kjkh6cs\"",
    "mtime": "2021-10-20T08:12:59.051Z",
    "path": "../public/_nuxt/index-d007a682.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"268-zQQKofRkQ/TojbvO2dKlwd0bBVU\"",
    "mtime": "2021-10-20T08:12:59.052Z",
    "path": "../public/_nuxt/manifest.json"
  }
};

const mainDir = dirname(fileURLToPath(globalThis.entryURL));

function readAsset (id) {
  return promises.readFile(resolve(mainDir, getAsset(id).path))
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const PUBLIC_PATH = "/_nuxt/";
const TWO_DAYS = 2 * 60 * 60 * 24;
const STATIC_ASSETS_BASE = "C:/Users/Nans/Desktop/E-commerce/nuxt3-app/dist" + "/" + "1634717576";
async function serveStatic(req, res) {
  if (!METHODS.includes(req.method)) {
    return;
  }
  let id = withLeadingSlash(withoutTrailingSlash(parseURL(req.url).pathname));
  let asset = getAsset(id);
  if (!asset) {
    const _id = id + "/index.html";
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
    }
  }
  if (!asset) {
    if (id.startsWith(PUBLIC_PATH) && !id.startsWith(STATIC_ASSETS_BASE)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    res.statusCode = 304;
    return res.end("Not Modified (etag)");
  }
  const ifModifiedSinceH = req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      res.statusCode = 304;
      return res.end("Not Modified (mtime)");
    }
  }
  if (asset.type) {
    res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    res.setHeader("Last-Modified", asset.mtime);
  }
  if (id.startsWith(PUBLIC_PATH)) {
    res.setHeader("Cache-Control", `max-age=${TWO_DAYS}, immutable`);
  }
  const contents = await readAsset(id);
  return res.end(contents);
}

export { serveStatic as default };
