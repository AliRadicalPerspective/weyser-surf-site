# Weyser site update: start here

This folder holds the redesigned weysersurf.com: new English and Spanish homepages, four new guide pages, and a
Spanish version of the coaching guide.
Everything in `site/` mirrors the web server root, so each file goes to the same path on the server.

Nothing here needs a build step. It is plain HTML, CSS and JavaScript, following the site's current
conventions (WebP images in two widths, `/assets/fonts/`, `?v=` cache busting).

Allow about an hour, including testing.

## In short

1. Look at it first: https://aliradicalperspective.github.io/weyser-surf-site/ (or `preview/index.html`).
2. Read `TO-CONFIRM.md`: a few photos and approvals are still coming from Weyser. Don't publish the beaches guide until
   its two photos are in, and don't launch with the kids' photos until the parents' OK is in.
3. Deploy `site/` to the Cloudflare Pages project (steps below), then run the test checklist on a real phone.
4. Submit the sitemap to Google and Bing.
5. Fix the hosting items listed below when you can (www redirect, HSTS).
6. Optional: run the same browser tests we ran before handover (`tools/`, see "Quality checks").

After this handover, **the files in `site/` are the source of truth.** Edit them directly; the section "Editing the site
by hand" shows where things live. Any later changes from us will come as small, described edits, not a new folder
that overwrites yours.

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
  assets/img/     38 images (22 new, including 3 Google reviewer photos; 16 identical copies of what's on the server)
  assets/fonts/   the 5 Montserrat files (identical copies of what's on the server)
  assets/video/   drone-loop.mp4 + its poster image
preview/           the same seven pages with relative links, for clicking through (don't upload this)
tools/             the browser tests run before handover, and a local server (see "Quality checks"; don't upload this)
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

- **Online:** https://aliradicalperspective.github.io/weyser-surf-site/ (all seven pages, English and Spanish, links work between them; its canonical links point to weysersurf.com, so search engines credit the real site)
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
- [x] **`/api/forecast` returns 404.** The old `site.js` tries it first and logs a 404 on every visit. `site-v5.js` now asks
      Open-Meteo directly (Google PageSpeed flagged the error). If you deploy the Pages Function later
      (`functions/api/forecast.js`), the one line to restore is in a comment at the end of `site-v5.js`.
- [ ] **Turn on HSTS** (SSL/TLS → Edge Certificates → HTTP Strict Transport Security).
- [ ] **Cloudflare Crawler Hints** (Caching → Configuration) so Bing and others hear about changes straight away.
- [ ] **Domain auto-renew**: the domain was registered 2026-09-13 and expires 2027-09-13. Check auto-renew is on.

## Things kept exactly as they are on the live site

- **Logo:** the header and footer use the same inline SVG lockup and CSS rules as the live `site.css`.
- **Forecast strip:** `site-v5.js` uses the live forecast code: `window.__FC` if it's present, otherwise the public
  Open-Meteo API, and the `fc-wait` state until data arrives. Two changes: the Spanish labels, and the `/api/forecast`
  step is left out because that function isn't deployed (see "Hosting fixes").
- **Structured data:** based on the live JSON-LD (including `priceSpecification`). Only the descriptions, the page name, the FAQ list and the Mini Surf Camp offers (new name and prices) change.
- **WhatsApp:** every link and the booking form go to +506 6008 4391, the same number as the live site.

## Placeholders

There is no draft copy left: all text on the seven pages is confirmed. Two things are still placeholders. Both are listed in `TO-CONFIRM.md`:

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

The two camp cards say "$25 less than three single sessions" and "$25 less per person": three sessions at the single price
minus the camp price. Update them if either price changes. The "Three sessions is where it clicks" section on both homepages
also names both camp prices. The sticky bar says "from $65" (the lowest price).

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

**The stylesheet** (`site-v5.css`) is plain CSS with one numbered section per component, in page order: 1. Base,
2. Layout helpers, 3. Buttons, 4. Header, 5. Hero, then each homepage section down to 18. Sticky WhatsApp bar,
19. Guide pages, 20. Photo placeholders and 21. Motion. The list is at the top of the file, so search for "5. Hero" to
jump there.
- Each selector is written once per `@media`: change a rule where it is instead of adding a second copy lower down.
- Inside a section the plain rules come first, then that component's `@media` rules (phones, tablets, desktop).
- Ten rules sit just outside their own section, under a note "From …: kept here". They override a rule above them, and
  in CSS the later rule wins, so leave them where they are.
- New styles for a component go at the end of its section.

**Colours:** every solid colour is a variable (a "token") in the `:root` block at the top of `site-v5.css`. Change a colour
there and it changes everywhere; don't type hex codes into rules. The first ten are the live site's own tokens, unchanged.
One rule for the two blues: **blue words use `--blue-ink`, blue decoration uses `--blue`.**

| Token | Value | Used for |
|---|---|---|
| `--navy` | `#063F5C` | Headings, navy sections (surf report, Three sessions, Meet Weyser), step numbers, outline buttons |
| `--navy-deep` | `#042C41` | Hero text panel, closing section, footer |
| `--blue` | `#419EBD` | Decoration only: dots, list markers, quote bars, underlines, the big card numbers. It's the logo kit's blue and reads well on navy |
| `--blue-ink` | `#2B697D` | Blue **text** on sand or white: "Best option", "Session 1", timeline times, stage labels. The same blue, darker, so small text passes contrast (WCAG AA 4.5:1) |
| `--orange` | `#F27F0C` | Things you tap to book: buttons, the sticky bar. Decorative exceptions, on purpose: the waves under "surf" (hero), "water" (closing call) and the guide headlines, and the lines through Three sessions and the guides' step-by-step |
| `--orange-soft` | `#FF9533` | Button hover |
| `--ink` / `--ink-soft` | `#242320` / `#4A4843` | Body text / secondary text |
| `--paper` / `--paper-deep` | `#F2ECE1` / `#E8DFCF` | The two sand backgrounds. After each navy section the first sand section is `--paper-deep`, the next `--paper` |
| `--white` | `#FFFFFF` | Cards, text on navy |
| `--green`, `--green-deep`, `--green-soft`, `--green-ink` | `#1B8A5A` `#1B7A4A` `#E7F6EE` `#0B3D2A` | "Bad waves? Free reschedule" box, included-list ticks, the form's "ready" line |
| `--wa-bubble` / `--wa-ink` | `#DCF8C6` / `#111B21` | The WhatsApp message preview in the booking form |
| `--placeholder` / `--placeholder-soft` | `#C8102E` / `#FDECEE` | The two PHOTO NEEDED boxes on the beaches guide; delete with the boxes |

See-through tints (shadows, text on navy, the hero fade) are written as `rgba()` of these colours, because older phones
can't combine a variable with transparency. The numbers map back: `6,63,92` is navy, `4,44,65` navy-deep, `242,127,12`
orange, `242,236,225` paper, `255,255,255` white. Fonts, corner radius, shadows, page width and side padding are tokens too
(`--display`, `--body`, `--radius`, `--radius-sm`, `--shadow`, `--shadow-lift`, `--wrap`, `--gutter`).

**First-screen styles:** each page has a `<style id="critical">` block in its `<head>`. It holds copies of the rules
that style the first screen (header, hero, surf report, the guides' header photo), so the page can draw before
`site-v5.css` arrives; the full stylesheet then loads without blocking (Google PageSpeed: "Render-blocking requests").
- **If you change a header, hero or first-screen style in `site-v5.css`, make the same change in that block on all seven
  pages**, or the first screen briefly shows the old style before the full file arrives.
- Every rule in the block is an exact copy, so you can search for its selector in `site-v5.css`.
- To drop the block: delete the `<style id="critical">…</style>`, and turn the next line back into a normal
  `<link rel="stylesheet" href="/assets/site-v5.css?v=…">` (delete `media="print" onload="…"` and the `<noscript>` line).
  The page then simply waits for the full file again.

**Cache:** every page links `site-v5.css?v=…` (twice: the stylesheet line and the `<noscript>` line after it) and
`site-v5.js?v=…`. When you change either file, change those `?v=` values on all seven pages (any new value works, for example today's date: `?v=2026-11-02`), so returning visitors get the new file.

**TripAdvisor and Airbnb:** the footer of all seven pages already has both links, switched off as HTML comments under
"Google Maps" (search for `TRIPADVISOR-LISTING-URL` and `AIRBNB-EXPERIENCE-URL`). When a listing is live:
1. paste its address over the placeholder and delete the `<!--` and `-->` around that line, on all seven pages;
2. add the same address to the `"sameAs"` list in the structured data of both homepages (it appears twice in each).
Keep Airbnb in the footer only, never in the booking section: bookings through Airbnb pay a fee, direct WhatsApp ones don't.

**Motion:** the site moves like water. Things lift in, overshoot a little and settle; taps ripple. All of it sits in
section 21, "Motion", of `site-v5.css`, and in the "motion" part of `site-v5.js`. It only runs while `<html>` has the class
`motion`, which the script adds unless the visitor has turned on "reduce motion". Without that class (reduce motion, or
no JavaScript) the page shows its calm, finished state, nothing hidden.
- **Swell (things arriving):** a few strong moments, everything else quiet. The hero headline surfaces and a wave line
  draws under "surf" ("surfear" in Spanish), and another under "water" ("agua") when the closing call scrolls in; the
  three level cards ride in tilted, one after another; headings pop up
  with a little lean; photos settle from a slight zoom. Prices and the booking form only fade in quickly (0.4s), so the
  selling part never makes anyone wait. Paragraphs, buttons, small boxes and the FAQ questions don't move on their own.
- **Spray (taps):** a ripple spreads from the finger on buttons and booking choices; buttons squash and spring back; a
  chosen option pops.
- **Three sessions:** an orange wavy line draws from Session 1 to Session 3 and each step fills as the line reaches it.
- **Guide pages:** the headline wave, sections and cards rise in, the step-by-step's orange line draws from step to step
  (first lesson, coaching), the "What to bring" ticks pop in one by one, and the coaching guide's stage cards ride in
  tilted. Same `.reveal` and `motion` code as the homepage.
- **Surf report:** the dot rises and falls, and sends out a ring, at tomorrow's real swell period (it reads the
  "Period" figure). The forecast code itself is unchanged.
- **Sticky bar:** rolls in with a small overshoot.
- **To tone it down,** change the distances and the `cubic-bezier(... 1.35 ...)` curves in section 21 (a value above 1 is
  the overshoot). **To switch it all off,** delete the line `doc.classList.add('motion');` in `site-v5.js`.
- Only `transform`, `opacity` and `clip-path` (the hero headline and the waves) move, so phones keep 60fps (tested on a
  4x slower CPU).

**Guide page building blocks** (all in section 19, "Guide pages"):
- **Question cards:** `<div class="qa">` holds one `<div class="qa-card">` per question (an `<h2>` and its answer). Two
  columns from tablets up; with exactly three questions, add `qa-3` to the `qa` div for one row of three on desktop.
- **Session chooser:** `<div class="qa-card qa-choose">` with `<ul class="choose">`. Each option ends with a
  `<a class="choose-book">` link to `/?level=…&session=…&src=…#book`, which opens the booking form with that choice picked.
- **Navy bands:** `<section class="guide-band on-dark">` sits between two `<div class="wrap">` blocks of the guide.
  With `band-split` on its inner wrap it puts the heading left and the steps right on desktop (first lesson, coaching);
  `band-glance` holds "At a glance" (kids), `band-table` the beaches comparison.
- **At a glance:** `<h2 class="table-title">` then `<dl class="glance">` with one `<div class="glance-item">` per fact
  (`<dt>` label, `<dd>` value). Add `glance-wide` to make a fact span two columns on desktop, `glance-long` to give it
  the full width on phones (used for facts over about 34 characters).
- **Other pieces:** `<article class="topic guide-v2">` turns on the full-width checklist; `<p class="guide-proof">` is the
  proof line under the first button; `<div class="pic pic-wide">` is the wide photo above the beaches questions.
- **Motion on a guide** comes from adding `reveal` to an element's class; the script does the rest.

## Quality checks

These are the checks run before handover, on all seven pages. The same tests are in `tools/`, so you can re-run them
after your own edits.

| Check | What it proves | Result at handover |
|---|---|---|
| `qa_browser.mjs` | 7 pages × 7 widths (320 to 1440px): no sideways scrolling, nothing off-screen, no script errors, no failed requests, no broken images, buttons don't wrap, sticky bar vs header button | 49 of 49 clean |
| `qa_functional.mjs` | The booking form builds the right WhatsApp message in English and Spanish; every Book button preselects a real option; sticky bar, FAQ toggle, language switch, surf report, WhatsApp number; the coaching guide opens the form preselected | All pass |
| `qa_mobile.mjs` | On a phone: tap targets thumb-sized and not overlapping, no iPhone zoom on form fields, no text under 12px, WCAG AA contrast, loading on a 4× slower CPU and fast 3G (LCP < 2.5s, CLS < 0.1, TBT < 200ms), 60fps scrolling, jump links below the header, safe area, no sticky hover, sharp photos, swipe rows | All pass on all seven pages |
| `qa_critical.mjs` | With `site-v5.css` blocked, every first screen (7 pages × 10 widths) looks exactly the same: the inline first-screen styles are complete | 70 of 70 identical |
| `qa_video.mjs` | The drone video plays when the closing section scrolls in, pauses when it leaves, plays again, and shows the still image for "reduce motion" | All pass |
| `qa_styles.mjs` | A style lock: records every element's position and style (7 pages, 8 widths, before and after taps), so a CSS clean-up can be proven to change nothing | Used for every refactor |

**To run them** (Node 22 and Google Chrome):
1. Serve the site: `python3 tools/serve.py 8770 site` (this server also sends video in pieces, like Cloudflare, so
   Safari plays it; `python3 -m http.server` does not).
2. Start a headless Chrome: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9334 --user-data-dir=/tmp/qa-chrome about:blank`
3. Run a test: `node tools/qa_browser.mjs` (each prints PASS or FAIL lines and exits non-zero on failure).
   `QA_BASE=https://your-preview-url node tools/qa_video.mjs` runs one against a deployed copy.
4. The style lock: `node tools/qa_styles.mjs save before`, make your change, `node tools/qa_styles.mjs save after`,
   then `node tools/qa_styles.mjs compare before after`.

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
- **CSS and script:** one stylesheet (about 16KB compressed), which no longer blocks the first paint (see "First-screen
  styles"), and one script (about 6KB compressed), loaded with `defer`.
- **Video:** `preload="none"`, muted, 6 seconds, 2.6MB. It only starts when that section is on screen, and never on data saver,
  2G, or when "reduce motion" is on. People in those cases see the still image instead. The still image is set by the
  script (`data-poster`) only when the visitor gets near that section, so it isn't part of the first load.
- **Result:** on an iPhone-size screen, the homepage's first screen loads **about 380KB** over the network (images 242KB,
  fonts 93KB, CSS 12KB, script 5KB, HTML 19KB). The live homepage loads **about 560KB**, of which 448KB is images, measured
  the same way on 7 October 2026. The Spanish homepage is the same. The drone video (2.6MB) is not part of the first load:
  it only downloads when the visitor reaches the closing section.

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
