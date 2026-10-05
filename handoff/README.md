# Weyser site update: start here

This folder holds the redesigned weysersurf.com: new English and Spanish homepages, four new guide pages, and a
Spanish version of the coaching guide.
Everything in `site/` mirrors the web server root, so each file goes to the same path on the server.

Nothing here needs a build step. It is plain HTML, CSS and JavaScript, following the site's current
conventions (WebP images in two widths, `/assets/fonts/`, `?v=` cache busting).

Allow about an hour, including testing.

## What's inside

```
README.md          this file
CHANGES.md         what's different from the live site, page by page
TO-CONFIRM.md      what is still needed before launch (photos, permissions, a read-through of the Spanish page)
site/
  index.html                                        new English homepage (replaces /index.html)
  es/index.html                                     new Spanish homepage (replaces /es/index.html)
  kids-family-surf-lessons-santa-teresa/index.html  new page
  beginner-surf-beaches-santa-teresa/index.html     new page
  first-surf-lesson-santa-teresa/index.html         new page
  surf-coaching-santa-teresa/index.html             new page (coaching for improvers)
  es/clases-de-surf-avanzado-santa-teresa/index.html new page (the coaching guide in Spanish)
  sitemap.xml                                       replaces /sitemap.xml (adds the 5 new pages)
  assets/site-v5.css                                new stylesheet (site.css stays, see below)
  assets/site-v5.js                                 new script (site.js stays, see below)
  assets/img/     37 images (21 new, including 3 Google reviewer photos; 16 identical copies of what's on the server)
  assets/fonts/   the 5 Montserrat files (identical copies of what's on the server)
  assets/video/   drone-loop.mp4 + its poster image
preview/           the same seven pages with relative links, for clicking through (don't upload this)
```

## The Spanish page is included

`site/es/index.html` is the new Spanish homepage: the same design, content, prices and booking form as the English one,
written in neutral, friendly Spanish (*tú*). It replaces the current `/es/index.html`.

- It uses `site-v5.css` and `site-v5.js`, like the English page. The booking form writes its WhatsApp message in Spanish
  on this page (the script checks `<html lang="es">`).
- Weyser's bio is his own words from the old Spanish page. His quote is "Te vas a divertir y te vas a reír."
- The coaching guide also has a Spanish version: `/es/clases-de-surf-avanzado-santa-teresa/`. The other three guides are only in English
  for now; the Spanish pages link to them and say "(en inglés)".
- `assets/site.css` and `assets/site.js` are no longer used by any page after this update. **Leave them on the server
  anyway** for a few weeks: old cached pages and any other page you know of may still point to them.

## See it first (no setup)

- **Online:** https://aliradicalperspective.github.io/weyser-surf-site/ (all seven pages, English and Spanish, links work between them; hidden from search engines)
- **Offline:** open `preview/index.html` in a browser. It is the same site with relative links, so it runs from a folder.
  (Browsers sometimes block web fonts from local files, so the headings may show in a fallback font there. That's normal.)
- **Exactly as the server will run it:** in a terminal, `cd site` then `python3 -m http.server 8000`, and open http://localhost:8000

`preview/` is only for looking. Upload `site/`.

## Steps

The live site runs on **Cloudflare Pages** (Cloudflare DNS, Cloudflare Registrar), so "uploading" means deploying the files
to the Pages project, the same way the current site was published.

1. **Back up**: download the current deployment, or note the commit or deployment ID you can roll back to.
2. **Add the files**: copy everything in `site/` into the project's output folder (or the repo, if Pages deploys from Git),
   overwriting when asked.
   - Overwriting is safe. The only existing files that change are `/index.html`, `/es/index.html` and `/sitemap.xml`. Every image and font in
     `site/assets/` that already exists is an identical copy, included so the folder previews completely.
   - `assets/site.css`, `assets/site.js`, `404.html` and the favicons are **not** in this folder, so they stay untouched.
   - The guide pages arrive as folders (`/first-surf-lesson-santa-teresa/`, `/kids-family-surf-lessons-santa-teresa/`,
     `/beginner-surf-beaches-santa-teresa/`, `/surf-coaching-santa-teresa/`, `/es/clases-de-surf-avanzado-santa-teresa/`, each with an
     `index.html`), so their addresses end in a slash.
3. **Check the `<head>` of the old homepage (and of the old `/es/` page)** for anything the new one doesn't have, such as the Cloudflare Web Analytics
   beacon, and copy it across. There's a comment marking where the beacon goes.
4. **Deploy.** Pages clears its cache on every deploy, so there's nothing to purge. The CSS and JS also carry `?v=` version numbers, so browsers fetch the new files.
5. **Tell Google and Bing:** submit the sitemap in Google Search Console and Bing Webmaster Tools, and request indexing
   for the new addresses (the four guides and the Spanish coaching page). Bing matters because ChatGPT search uses it.

## Hosting fixes found while checking the live site (1 October 2026)

- [ ] **`www.weysersurf.com` doesn't resolve.** There's no DNS record, so anyone typing "www" gets an error. In Cloudflare:
      add a proxied `www` record and a redirect rule `www.weysersurf.com/*` → `https://weysersurf.com/$1` (301).
- [ ] **`/api/forecast` returns 404.** `site.js` and `site-v5.js` try it first, then fall back to Open-Meteo, so the forecast
      works, but each visit makes one wasted request. Either deploy the Pages Function it expects (`functions/api/forecast.js`)
      or delete the `get('/api/forecast')` step in the JS.
- [ ] **Turn on HSTS** (SSL/TLS → Edge Certificates → HTTP Strict Transport Security).
- [ ] **Cloudflare Crawler Hints** (Caching → Configuration) so Bing and others hear about changes straight away.
- [ ] **Domain auto-renew**: the domain was registered 2026-09-13 and expires 2027-09-13. Check auto-renew is on.

## Things kept exactly as they are on the live site

- **Logo:** the header and footer use the same inline SVG lockup and CSS rules as the live `site.css`.
- **Forecast strip:** `site-v5.js` uses the live forecast code unchanged: `/api/forecast` (the Cloudflare function) first,
  `window.__FC` if it's present, the public Open-Meteo API as backup, and the `fc-wait` state until data arrives.
- **Structured data:** based on the live JSON-LD (including `priceSpecification`). Only the descriptions, the page name, the FAQ list and the Mini Surf Camp offers (new name and prices) change.
- **WhatsApp:** every link and the booking form go to +506 6008 4391, the same number as the live site.

## Placeholders

There is no draft copy left: all text on the seven pages is confirmed, and the old red placeholder style is gone from the CSS.
Two things are still placeholders. Both are listed in `TO-CONFIRM.md`:

- The beaches page has two "PHOTO NEEDED" boxes (Playa Hermosa and Mar Azul). They stay until Weyser sends the photos.
  Visitors see the words "PHOTO NEEDED", so swap them before the beaches page goes live (steps below).
- The kids' photos need written OK from the parents before launch.

### Swapping in the two beach photos (about 10 minutes)

In `beginner-surf-beaches-santa-teresa/index.html`, each placeholder is a `<div class="ph">…</div>` at the top of its beach card.
The Playa Carmen card just above them shows the finished version.

1. Export each photo as two landscape WebP files, 800 and 1600px wide (quality 75 to 80, squoosh.app works), into `assets/img/`:
   `playa-hermosa-800.webp`, `playa-hermosa-1600.webp`, `mar-azul-800.webp`, `mar-azul-1600.webp`.
2. Replace the whole `<div class="ph">…</div>` (from `<div class="ph">` to its closing `</div>`) with:
   ```html
   <div class="b-img"><img src="/assets/img/playa-hermosa-800.webp" srcset="/assets/img/playa-hermosa-800.webp 800w, /assets/img/playa-hermosa-1600.webp 1600w" sizes="(min-width: 880px) 340px, 100vw" width="1600" height="1067" alt="Surfers in the gentle whitewater at Playa Hermosa, Santa Teresa" loading="lazy" decoding="async"></div>
   ```
   For Mar Azul, use the `mar-azul` file names and an alt text such as "The surf at Mar Azul, by the big rock, Santa Teresa".
3. Set `width` and `height` to the real size of the 1600 file (1600 and its height), so the page doesn't jump while loading.
4. Optional: add both images to the beaches page entry in `sitemap.xml`, the same way as the other `<image:image>` lines.
5. If the photo is someone else's, add a credit line under it like the Playa Santa Teresa one, and note it under "Image credits" below.

## Test before and after going live

On a real phone, over mobile data:

- [ ] Homepage, `/es/`, the four guides and the Spanish coaching page load, with no 404s in the browser console
- [ ] On `/es/`, the booking form's WhatsApp message is in Spanish (send one test)
- [ ] "Book" buttons (hero, level cards, price cards, Meet Weyser) scroll to the booking form with the right choices already selected
- [ ] On a phone, the sticky bar "WhatsApp Weyser · from $65" opens WhatsApp directly
- [ ] On the coaching page, "Plan it in the booking form" opens the homepage form with "Surfed before" and "Not sure" selected
- [ ] The booking form's "Send on WhatsApp" opens WhatsApp with the full message. Send one test to Weyser's number.
- [ ] "More questions" opens and closes the rest of the FAQ
- [ ] The drone video plays behind "See you in the water." on an iPhone and an Android phone. It stays on the still image with data saver, 2G or "reduce motion" on; that's intended. With iPhone Low Power Mode it starts on the first tap.
- [ ] The guide links work: the three homepage cards, the lesson section, four FAQ answers, and the footer "Guides" column on every page
- [ ] Lighthouse (mobile): aim for 90+ on Performance, Accessibility, Best Practices and SEO
- [ ] Structured data passes Google's Rich Results Test for all seven pages

## Editing the site by hand

There's no build step: edit the HTML files directly. A few things live in more than one place, so here's where.

**English and Spanish are separate files.** Any change to `index.html` also needs making in `es/index.html`, and a change
to `surf-coaching-santa-teresa/` also in `es/clases-de-surf-avanzado-santa-teresa/`.

**Changing a price.** Prices appear as text and in the structured data (the `<script type="application/ld+json">` block
in the `<head>`). In every page below, search for the old price with the dollar sign (for example `$75`), and on the two
homepages also for `"price": "75"` (it appears twice per product) and `"priceRange"`.

| Price | Pages to search |
|---|---|
| Private $75, Group or family $65 | both homepages, all four guides, the Spanish coaching page |
| Mini Surf Camp $200, Group Mini Surf Camp $170 | both homepages, the first-lesson, kids and coaching guides (English and Spanish) |

The "save $25" lines on the price cards are three sessions at the single price minus the camp price; update them if either
price changes. The sticky bar says "from $65" (the lowest price).

**Changing the lessons count (800+)** or other facts about Weyser: search all pages for the old value. It appears in the hero,
the Meet Weyser stats, the screen-reader sentence just above them, and the "Last updated" lines on the guides.

**The booking form** (`#book` on both homepages):
- Options are radio buttons. Their `value` attributes stay in English on both pages: the script uses them as keys and
  translates them for the Spanish message (the `T.v` table at the top of `site-v5.js`).
- To add an option, copy a `<label class="chip">` line; for Spanish, add its translation to `T.v`.
- The message wording (greeting, line labels) is in the `T` table at the top of `site-v5.js`, in English and Spanish.
- Any link with `href="#book"` can preselect the form: `data-level="First timer"`, `data-session="Private"`, and
  `data-src="..."` to name it in the message's last line.

**Adding a WhatsApp link:** use `https://wa.me/50660084391?text=` plus the URL-encoded message, end the message with where it
came from (for example `(Found you on your website · instagram)`), and add `data-track="instagram"` to the link.

**The stylesheet** (`site-v5.css`) is plain CSS: base styles first, then sections that refine them. When a selector appears
twice, the later rule wins, so add new rules at the end. Colours are CSS variables at the top (`--navy`, `--orange`, ...).
The guide-page styles are in the "topic pages" section.

**Cache:** when you change `site-v5.css` or `site-v5.js`, raise the `?v=` number on every page that links them, so returning
visitors get the new file.

## Measuring bookings (tracking)

Nothing is tracked yet, and no analytics script is loaded. Two things are already in place:

- **Every WhatsApp message says where it came from.** The booking form ends with a tag naming the button that opened it,
  for example "(Found you on your website · family)". The other WhatsApp links are tagged the same way ("· sticky",
  "· standby", "· footer"), and the guide pages name the page. Weyser can count these in WhatsApp with no setup at all.
- **Every WhatsApp link has a `data-track="<source>"` attribute**, and `site-v5.js` has a small `track()` function. When
  `window.plausible` exists, it sends a custom event "WhatsApp" with a `source` property. Otherwise it does nothing.

To turn on click counts, we suggest **Plausible**: one small script, no cookies, so no cookie banner is needed.
1. Create the site in Plausible, then add this line to the `<head>` of every page:
   `<script defer data-domain="weysersurf.com" src="https://plausible.io/js/script.js"></script>`
2. In Plausible, add a custom event goal named `WhatsApp` and the custom property `source`.

Cloudflare Web Analytics, which the site may already use, counts page views but not button clicks. It can run
alongside Plausible.

## Speed: what's already done, and how to keep it fast

Already done in these files:

- **Images:** WebP in two widths with `srcset` and `sizes`, so phones download the small one (25 to 60KB each). All have
  `width` and `height`, so nothing jumps while loading. Everything below the first screen uses `loading="lazy"`.
- **Hero:** preloaded with `fetchpriority="high"`. Only two fonts (400 and 700) are preloaded.
- **Script:** one small file (about 4KB compressed), loaded with `defer`.
- **Video:** `preload="none"`, muted, 6 seconds, 2.6MB. It only starts when that section is on screen, and never on data saver,
  2G, or when "reduce motion" is on. People in those cases see the poster image instead.
- **Result:** the first screen on a phone is about 100KB compressed.

Adding photos later:

- Export two WebP versions at 800 and 1600px wide (portrait photos 600 and 1200), quality around 75 to 80. squoosh.app does this in the browser.
- Name them `what-it-shows-800.webp` / `-1600.webp`, the same as the rest.
- Video: under 3MB, 960px wide at most, no sound, 5 to 8 seconds, with a WebP poster.

One known gap: the hero photo (`student-cheer`) only exists at 1200px, so it looks slightly soft on large screens.
When the original turns up, export `student-cheer-1600.webp` and add `1600w` to the hero's `srcset` and the preload line.

## Image credits

- `playa-carmen-surf-800/1600.webp`: "Playa Carmen, Costa Rica" by Ladd Greene, from Unsplash via Wikimedia Commons.
  Public domain (CC0): free for commercial use, no credit required. Source: https://commons.wikimedia.org/wiki/File:Playa_Carmen,_Costa_Rica_(Unsplash).jpg
- `playa-santa-teresa-sunset-800/1600.webp`: "Playa Santa Teresa" by Vixitaly, via Wikimedia Commons, licensed CC BY 3.0.
  **The credit line under the photo on the beaches page is required by the licence: keep it.** Source: https://commons.wikimedia.org/wiki/File:Playa_Santa_Teresa_-_panoramio.jpg
- Every other photo and video is Weyser's own (sent 2026-09-30) or already on the live site.

## Brand (from Weyser's Canva logo kit)

| Use | Value |
|---|---|
| Navy | `#063F5C` (`--navy`) |
| Orange | `#F27F0C` (`--orange`), the logo on cream and navy, and the main buttons |
| Blue | `#419EBD` (`--blue`) |
| Charcoal | `#2E2E2E` (the kit's one-colour logo; the site's body text uses the live site's `#242320`) |
| Wordmark font | KIONA SemiBold. It appears only inside the logo, which is an SVG with the letters drawn as shapes, so no font file is needed. Don't load KIONA as a web font. |
| "SURF COACH" and site text | Montserrat (self-hosted in `/assets/fonts/`) |

The logo kit pairs the colours like this: orange or blue logo on navy, navy logo on orange or blue, and any of the four colours on a light background. The site uses an orange logo on the cream header and an orange logo on the navy footer, which both fit the kit.
