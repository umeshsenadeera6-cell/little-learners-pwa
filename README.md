# Little Learners

A bright, calm first learning app for children aged 3–6. Letters, numbers,
colours, animals, shapes and words, with quizzes, five mini games, stars,
badges and a parent area behind a maths gate.

Installable as a Progressive Web App and **fully offline** after the first
visit. No accounts, no chat, no ads, no tracking — all progress stays in the
child's own browser.

---

## Run it

Any static server works. The app uses ES modules and a service worker, so it
must be served over `http://` or `https://` — opening `index.html` straight
from disk will not work.

```bash
# pick one
python3 -m http.server 8080
npx serve .
php -S localhost:8080
```

Then open <http://localhost:8080>.

## Deploy it

Drop the whole folder on any static host — Netlify, Vercel, GitHub Pages,
Firebase Hosting, Cloudflare Pages, S3, nginx. There is no build step.

```bash
netlify deploy --prod --dir .
vercel --prod
```

Two server details worth checking:

- `manifest.webmanifest` should be served as `application/manifest+json`
- `service-worker.js` must be served from the app root with
  `Cache-Control: no-cache`, or browsers may keep serving an old worker

Installability needs HTTPS (localhost is exempt). On Android, Chrome offers
"Install app"; on iOS, Safari → Share → **Add to Home Screen**. Once installed
it opens fullscreen in portrait with no browser chrome.

---

## Project structure

```
little-learners/
├── index.html                  app shell markup only
├── manifest.webmanifest        name, icons, standalone display, shortcuts
├── service-worker.js           precache + offline strategies
├── icons/                      192, 512, maskable, apple-touch
├── css/
│   ├── tokens.css              colour, radius, shadow tokens (light + dark)
│   ├── base.css                reset, typography, motion primitives
│   ├── layout.css              app frame, top bar, scroll area, tab bar
│   └── components.css          cards, buttons, quizzes, games, overlays
├── js/
│   ├── app.js                  entry point — imports features, boots the shell
│   ├── core/
│   │   ├── dom.js              h(), esc(), shuffle, pick, sample, fmtTime
│   │   ├── store.js            persistence + subscribe/notify
│   │   ├── audio-service.js    say(), effect(), music — the only audio layer
│   │   ├── rewards.js          stars, badge rules, celebrations
│   │   ├── fx.js               confetti, star pops, bounce, wiggle
│   │   ├── toast.js            bottom toast
│   │   └── router.js           UI shell, tab bar, back stack, Routes registry
│   ├── data/                   all learning content, one file per subject
│   ├── features/               one file per screen
│   └── widgets/                speaker button, progress row, shape SVG
└── assets/                     optional recorded audio + illustrations
```

### How the pieces fit

**Content never lives in a screen.** Everything the child sees comes from
`js/data/`. Adding a lesson is adding an object:

```js
// js/data/words.js
["Kite", "objects", "🪁", "My kite flies high."]
```

**Screens register themselves.** Each file in `js/features/` assigns onto the
shared `Routes` object, so the router never imports a screen and screens never
import each other:

```js
Routes.shapes = function (params) { /* returns a DOM node */ };
```

`app.js` imports every feature for that side effect, then calls `UI.selectTab`.

**State flows one way.** Screens call `Store`; `Store.notify()` tells its
subscribers; `rewards.js` re-checks badges and `router.js` refreshes the star
chip. No screen updates another screen.

**One audio layer.** No screen touches `Audio` or `speechSynthesis` directly —
they call `AudioService.say()` or `AudioService.effect()`. See
`assets/README.md` for swapping speech synthesis for recorded voice with a
single flag.

---

## Offline behaviour

| What | Strategy | Cache |
|---|---|---|
| App shell (HTML, CSS, JS, icons) | precache on install, cache-first | `little-learners-shell-<version>` |
| Google Fonts | stale-while-revalidate | `little-learners-fonts-<version>` |
| `assets/` audio and images | stale-while-revalidate | `little-learners-media-<version>` |
| Page navigations | cache-first, network fallback, shell fallback | — |

Fonts are the only external request the app makes, and it is optional: blocked
or offline, the app falls back to rounded system faces and behaves identically.

**Shipping an update:** bump `CACHE_VERSION` at the top of
`service-worker.js`. Old caches are deleted on activate and open tabs pick up
the new build.

---

## Data stored on the device

One `localStorage` key, `little_learners_v1`:

```jsonc
{
  "stars": 24,
  "badges": ["first_star", "super"],
  "seconds": 840,                       // time on task, for the parent area
  "seen": { "abc": { "A": 1 }, "numbers": {}, "colours": {}, … },
  "quiz": { "correct": 31, "wrong": 9, "byModule": { "abc": {…} } },
  "games": { "memory": 3 },
  "settings": { "sound": true, "music": false, "animation": true,
                "language": "en", "theme": "system" }
}
```

Every read and write is wrapped in `try/catch`, so private windows and blocked
storage degrade to an in-memory session instead of a crash. Nothing is sent
anywhere — there is no network code in the app beyond the font stylesheet.

Parents can clear it all from **Progress → Parent Area → Reset all progress**.

---

## Child safety

- No chat, profiles, messaging or user-generated content
- No advertising anywhere, and none inside lessons by design
- No external links in the child-facing area
- No personal information collected, and no analytics
- Settings and progress data sit behind a maths gate (`7 + 3`)
- Wrong answers never scold — always "Try Again! 😊", always retryable
- Gentle sounds only; no buzzers, no startling effects
- Background music off by default

## Accessibility

Large touch targets (64 px minimum), high-contrast text in both themes, audio
pronunciation on every item so reading is never required, visible keyboard
focus, `aria-live` status messages, and full respect for
`prefers-reduced-motion` plus an in-app animation toggle.

---

## Browser support

Chrome / Edge / Samsung Internet (Android), Safari (iOS 16.4+ for installable
PWAs), and all modern desktop browsers. Speech synthesis quality depends on the
device's installed voices — bundling recorded audio removes that variability.

## Roadmap hooks already in place

Sinhala, Tamil and Japanese are listed in Settings and wired to a `language`
setting. Content files are language-agnostic in shape, so a second language is
a data file plus a lookup — not a rewrite.
# kids_app
