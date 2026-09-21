/* Little Learners — offline service worker.
 *
 * Strategy
 *   app shell  : precached on install, served cache-first (instant, offline)
 *   fonts      : stale-while-revalidate in a separate cache
 *   navigation : cache-first with a network fallback, then index.html
 *
 * Bump CACHE_VERSION whenever you ship new files; the old cache is deleted
 * on activate and every open tab picks up the new build.
 */

const CACHE_VERSION = "v1.0.0";
const SHELL_CACHE = "little-learners-shell-" + CACHE_VERSION;
const FONT_CACHE  = "little-learners-fonts-" + CACHE_VERSION;
const MEDIA_CACHE = "little-learners-media-" + CACHE_VERSION;

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",

  "./css/tokens.css",
  "./css/base.css",
  "./css/layout.css",
  "./css/components.css",

  "./js/app.js",
  "./js/core/dom.js",
  "./js/core/store.js",
  "./js/core/audio-service.js",
  "./js/core/rewards.js",
  "./js/core/fx.js",
  "./js/core/toast.js",
  "./js/core/router.js",

  "./js/data/index.js",
  "./js/data/alphabet.js",
  "./js/data/numbers.js",
  "./js/data/colours.js",
  "./js/data/animals.js",
  "./js/data/shapes.js",
  "./js/data/words.js",
  "./js/data/modules.js",
  "./js/data/badges.js",

  "./js/features/home.js",
  "./js/features/learn.js",
  "./js/features/alphabet.js",
  "./js/features/numbers.js",
  "./js/features/colours.js",
  "./js/features/animals.js",
  "./js/features/shapes.js",
  "./js/features/words.js",
  "./js/features/quiz.js",
  "./js/features/games.js",
  "./js/features/progress.js",
  "./js/features/parent.js",
  "./js/features/settings.js",

  "./js/widgets/speaker-button.js",
  "./js/widgets/progress-row.js",
  "./js/widgets/shape-svg.js",

  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function(cache){
      /* Added one at a time: a single 404 must not fail the whole install. */
      return Promise.all(SHELL.map(function(url){
        return cache.add(new Request(url, {cache: "reload"})).catch(function(){
          console.warn("[sw] could not precache", url);
        });
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== SHELL_CACHE && k !== FONT_CACHE && k !== MEDIA_CACHE) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("message", function(event){
  if(event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

function staleWhileRevalidate(request, cacheName){
  return caches.open(cacheName).then(function(cache){
    return cache.match(request).then(function(hit){
      const fetching = fetch(request).then(function(res){
        if(res && (res.ok || res.type === "opaque")) cache.put(request, res.clone());
        return res;
      }).catch(function(){ return hit; });
      return hit || fetching;
    });
  });
}

self.addEventListener("fetch", function(event){
  const req = event.request;
  if(req.method !== "GET") return;

  const url = new URL(req.url);

  /* Google Fonts — nice to have, never required. */
  if(FONT_HOSTS.indexOf(url.hostname) > -1){
    event.respondWith(staleWhileRevalidate(req, FONT_CACHE));
    return;
  }

  /* Anything outside our own origin is left alone. */
  if(url.origin !== self.location.origin) return;

  /* Page loads: cache first, then network, then the shell. */
  if(req.mode === "navigate"){
    event.respondWith(
      caches.match("./index.html").then(function(hit){
        return hit || fetch(req).catch(function(){ return caches.match("./index.html"); });
      })
    );
    return;
  }

  /* Lesson audio and images dropped into assets/ get cached as they are used. */
  if(url.pathname.indexOf("/assets/") > -1){
    event.respondWith(staleWhileRevalidate(req, MEDIA_CACHE));
    return;
  }

  /* App shell: cache first, fall back to the network and remember the result. */
  event.respondWith(
    caches.match(req).then(function(hit){
      if(hit) return hit;
      return fetch(req).then(function(res){
        if(res && res.ok){
          const copy = res.clone();
          caches.open(SHELL_CACHE).then(function(c){ c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
