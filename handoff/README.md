# Weyser site update: start here

This folder holds the redesigned weysersurf.com: new English and Spanish homepages, and four new guide pages, each
in English and Spanish. Ten pages in all.
Everything in `site/` mirrors the web server root, so each file goes to the same path on the server.

Nothing here needs a build step. It is plain HTML, CSS and JavaScript, following the site's current
conventions (WebP images, nearly all in two widths, `/assets/fonts/`, `?v=` cache busting).

Allow about an hour, including testing.

## In short

1. Look at it first: https://aliradicalperspective.github.io/weyser-surf-site/ (or `preview/index.html`).
2. Read `TO-CONFIRM.md`: a few photos and approvals are still coming from Weyser, starting with his OK on the new
   prices. Don't launch with the beaches guide's PHOTO NEEDED boxes, or with the kids' photos before the parents' OK:
   "Launching before everything is in" says what to do if they're late.
3. Deploy `site/` to the Cloudflare Pages project (steps below), then run the test checklist on a real phone.
4. Submit the sitemap to Google and Bing.
5. Fix the hosting items listed below when you can (www redirect, HSTS).
6. Optional: run the same browser tests we ran before handover (`tools/`, see "Quality checks").

After this handover, **the files in `site/` are the source of truth.** Edit them directly; the section "Editing the site
by hand" shows where things live. Any later changes from us will come as small, described edits, not a new folder
that overwrites yours. (We produced these files with our own build tools. They aren't part of the handover on
purpose: they would overwrite your edits, and you don't need them, since `site/` is complete.)

## What's inside

```
README.md          this file
CHANGES.md         what's different from the live site, page by page
TO-CONFIRM.md      what is still needed before launch (photos, permissions, a read-through of the Spanish pages)
site/
  index.html                                        new English homepage (replaces /index.html)
  es/index.html                                     new Spanish homepage (replaces /es/index.html)
  kids-family-surf-lessons-santa-teresa/index.html  new page
  beginner-surf-beaches-santa-teresa/index.html     new page
  first-surf-lesson-santa-teresa/index.html         new page
  surf-coaching-santa-teresa/index.html             new page (coaching for improvers)
  es/clases-de-surf-avanzado-santa-teresa/index.html          new page (the coaching guide in Spanish)
  es/primera-clase-de-surf-santa-teresa/index.html             new page (the first-lesson guide in Spanish)
  es/clases-de-surf-para-ninos-y-familias-santa-teresa/index.html  new page (the kids guide in Spanish)
  es/playas-para-aprender-surf-santa-teresa/index.html         new page (the beaches guide in Spanish)
  sitemap.xml                                       replaces /sitemap.xml (adds the 8 new pages, with their language pairs)
  llms.txt                                          replaces /llms.txt, the summary AI search reads (new prices, all 10 pages)
  assets/site-v5.css                                new stylesheet (site.css stays, see below)
  assets/site-v5.js                                 new script (site.js stays, see below)
  assets/img/     38 images (22 new, including 3 Google reviewer photos; 16 identical copies of what's on the server)
  assets/fonts/   the 5 Montserrat files (identical copies of what's on the server)
  assets/video/   the drone loop in three versions + its still image (see "The drone video")
functions/         optional: a Cloudflare function that caches the surf report (see "The surf report")
preview/           the same ten pages with relative links, for clicking through (don't upload this)
tools/             the browser tests, a local server and the video script (see "Quality checks"; don't upload this)
```

## The Spanish pages are included

`site/es/index.html` is the new Spanish homepage: the same design, content, prices and booking form as the English one,
written in neutral, friendly Spanish (*tú*). It replaces the current `/es/index.html`.

- It uses `site-v5.css` and `site-v5.js`, like the English page. The booking form writes its WhatsApp message in Spanish
  on this page (the script checks `<html lang="es">`).
- Weyser's bio is his own words from the old Spanish page. His quote is "Te vas a divertir y te vas a reír."
- Every guide has a Spanish version, under `/es/`. Each pair links to the other (language switch, footer, `hreflang`
  tags and sitemap), and the Spanish pages link only to Spanish guides.
- `assets/site.css` and `assets/site.js` are no longer used by any page after this update. **Leave them on the server
  anyway** for a few weeks: old cached pages and any other page you know of may still point to them.

## See it first (no setup)

- **Online:** https://aliradicalperspective.github.io/weyser-surf-site/ (all ten pages, English and Spanish, links work between them; its canonical links point to weysersurf.com, so search engines credit the real site)
- **Offline:** open `preview/index.html` in a browser. It is the same site with relative links, so it runs from a folder.
  (Browsers sometimes block web fonts from local files, so the headings may show in a fallback font there. That's normal.)
- **Closest to the real server:** in a terminal, from this folder, `python3 tools/serve.py 8000 site`, and open
  http://localhost:8000 (`python3 -m http.server` works too, but Safari then shows the drone video's still image only)

`preview/` is only for looking. Upload `site/`.

## Steps

The live site runs on **Cloudflare Pages** (Cloudflare DNS, Cloudflare Registrar), so "uploading" means deploying the files
to the Pages project, the same way the current site was published.

1. **Back up**: make sure you have the folder or Git repo the live site is deployed from. In Pages → Deployments, note
   the current production deployment: "Rollback to this deployment" restores it in one click if anything goes wrong.
2. **Add the files**: `site/` holds only new and changed files, so it goes **on top of** the current site, never instead of it.
   - If Pages deploys from Git, or from a folder you keep: copy everything in `site/` into it, overwriting when asked.
   - If you use Direct Upload (dashboard drag-and-drop or `wrangler pages deploy`): each upload replaces the whole site.
     Start from a full copy of the current files, copy `site/` on top, and upload that merged folder. Otherwise the
     files below disappear from the server.
   - Overwriting is safe. The only existing files that change are `/index.html`, `/es/index.html`, `/sitemap.xml` and
     `/llms.txt`. Every image and font in `site/assets/` that already exists is an identical copy, included so the
     folder previews completely.
   - Files that stay on the server and are **not** in this folder: `assets/site.css`, `assets/site.js`, `404.html`,
     `robots.txt`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `site.webmanifest` and
     `assets/img/og-weyser.jpg` (the homepages' sharing image). Keep them.
   - The eight guide pages arrive as folders, each with an `index.html` (see "What's inside"), so their addresses end
     in a slash.
3. **Check the `<head>` of the old homepage (and of the old `/es/` page)** for anything the new one doesn't have, and
   copy it across. Today the live homepage has only a placeholder comment for the Cloudflare Web Analytics beacon, so
   there may be nothing to copy. If you add a beacon, add it to all ten pages: the homepages have a comment marking
   the spot; on the guides, put it just before `</body>`.
4. **Deploy.** Pages clears its cache on every deploy, so there's nothing to purge. The CSS and JS also carry `?v=` version numbers, so browsers fetch the new files.
5. **Tell Google and Bing:** submit the sitemap in Google Search Console and Bing Webmaster Tools, and request indexing
   for the new addresses (the four guides and their four Spanish versions). Bing matters because ChatGPT search uses it.

## Hosting fixes found while checking the live site (1 October 2026)

- [ ] **`www.weysersurf.com` doesn't resolve.** There's no DNS record, so anyone typing "www" gets an error. In Cloudflare:
      add a proxied `www` record and a redirect rule `www.weysersurf.com/*` → `https://weysersurf.com/$1` (301).
- [x] **`/api/forecast` returns 404.** The old `site.js` tries it first and logs a 404 on every visit. `site-v5.js` now asks
      Open-Meteo directly (Google PageSpeed flagged the error). If you deploy the Pages Function later
      (`functions/api/forecast.js`, included, see "The surf report"), the one line to change is in a comment at the
      end of `site-v5.js`.
- [ ] **Turn on HSTS** (SSL/TLS → Edge Certificates → HTTP Strict Transport Security).
- [ ] **Cloudflare Crawler Hints** (Caching → Configuration) so Bing and others hear about changes straight away.
- [ ] **Domain auto-renew**: the domain was registered 2026-09-13 and expires 2027-09-13. Check auto-renew is on.

## Things kept exactly as they are on the live site

- **Logo:** the header and footer use the same inline SVG lockup and CSS rules as the live `site.css`.
- **Forecast strip:** `site-v5.js` uses the live forecast code: `window.__FC` if it's present, otherwise the public
  Open-Meteo API, and the `fc-wait` state until data arrives. Two changes: the Spanish labels, and the `/api/forecast`
  step is left out until that function is deployed (see "The surf report").
- **Structured data:** based on the live JSON-LD (including `priceSpecification`). Only the descriptions, the page name, the FAQ list and the Mini Surf Camp offers (new name and prices) change.
- **WhatsApp:** every link and the booking form go to +506 6008 4391, the same number as the live site.

## Placeholders

There is no draft copy left: all text on the ten pages is confirmed. Two things are still placeholders. Both are
listed in `TO-CONFIRM.md`:

- The beaches guide has two "PHOTO NEEDED" boxes (Playa Hermosa and Mar Azul), "FOTO PENDIENTE" on its Spanish version.
  Visitors see those words, so swap in the photos (steps below) or remove the boxes before launch.
- The kids' photos need written OK from the parents before launch.

### Swapping in the two beach photos (about 10 minutes)

In `beginner-surf-beaches-santa-teresa/index.html`, each placeholder is a `<div class="ph">…</div>` at the top of its
beach card. The Playa Carmen card (between the two placeholders) shows the finished version. Do the same in the Spanish
version, `es/playas-para-aprender-surf-santa-teresa/index.html`, with Spanish alt text (for example "Surfistas en la
espuma suave de Playa Hermosa, Santa Teresa").

1. Export each photo as two landscape WebP files, 800 and 1600px wide (quality 75 to 80, squoosh.app works), into `assets/img/`:
   `playa-hermosa-800.webp`, `playa-hermosa-1600.webp`, `mar-azul-800.webp`, `mar-azul-1600.webp`.
2. Replace the whole `<div class="ph">…</div>` (from `<div class="ph">` to its closing `</div>`) with:
   ```html
   <div class="b-img"><img src="/assets/img/playa-hermosa-800.webp" srcset="/assets/img/playa-hermosa-800.webp 800w, /assets/img/playa-hermosa-1600.webp 1600w" sizes="(min-width: 880px) 520px, 100vw" width="1600" height="1067" alt="Surfers in the gentle whitewater at Playa Hermosa, Santa Teresa" loading="lazy" decoding="async"></div>
   ```
   For Mar Azul, use the `mar-azul` file names and an alt text such as "The surf at Mar Azul, by the big rock, Santa Teresa".
3. Set `width` and `height` to the real size of the 1600 file (1600 and its height), so the page doesn't jump while loading.
4. Optional: add both images to the beaches page entry in `sitemap.xml`, the same way as the other `<image:image>` lines.
5. If the photo is someone else's, add a credit line under it like the Playa Santa Teresa one, and note it under "Image credits" below.

### Launching before everything is in

`TO-CONFIRM.md` lists what's still coming. If launch can't wait:

- **Beach photos late:** in `beginner-surf-beaches-santa-teresa/index.html` and its Spanish version, delete the two
  `<div class="ph">…</div>` boxes (Playa Hermosa and Mar Azul). The cards work as text-only cards until the photos
  arrive. Don't hold the page back instead: every page links to it (footer "Guides", homepage cards, an FAQ answer)
  and it's in `sitemap.xml`.
- **No OK for a photo with kids:** swap in a photo without kids, changing `src`, `srcset`, `width`, `height` and `alt`
  together, on every page that uses it:

  | Photo | Used on | Suggested stand-in |
  |---|---|---|
  | `student-cheer` (hero) | both homepages: the `<img>`, the `<link rel="preload">` in the `<head>`, and `sitemap.xml` | `hero-drone-turn` |
  | `family-walk-in` | both homepages, kids guide in both languages (also their `og:image` sharing image) | `walking-in` |
  | `first-timer-waiting` | both homepages, kids guide in both languages | `stuck-whitewater` |

  `student-cheer` is already on the live homepage today, so ask Weyser whether the OK covers the current site too.

## Test before and after going live

On a real phone, over mobile data:

- [ ] Both homepages and all eight guides (four English, four Spanish) load, with no 404s in the browser console
- [ ] On `/es/`, the booking form's WhatsApp message is in Spanish (send one test)
- [ ] "Book" buttons (hero, level cards, price cards, Meet Weyser) scroll to the booking form with the right choices already selected
- [ ] On a phone, the floating "WhatsApp Weyser · from $65" button opens WhatsApp directly
- [ ] On an iPhone (Safari), scroll the homepage top to bottom: the area behind the clock is sand like the header,
      and Safari's bottom bar stays sand the whole way (see "iPhone Safari")
- [ ] On the coaching page, "Plan it in the booking form" opens the homepage form with "Surfed before" and "Not sure" selected
- [ ] The booking form's "Send on WhatsApp" opens WhatsApp with the full message. Send one test to Weyser's number.
- [ ] "More questions" opens and closes the rest of the FAQ
- [ ] The drone video plays by itself behind "See you in the water." on an iPhone and an Android phone, and a tap
      pauses it. With iPhone Low Power Mode on, it still moves (as an animated image). Data saver shows the still
      image only; that's intended.
- [ ] The guide links work: the three homepage cards, the lesson section, four FAQ answers, and the footer "Guides" column on every page
- [ ] After launch, run Google PageSpeed Insights (mobile) on https://weysersurf.com/ three times: aim for 90+ on all
      four scores, and compare with the table in "Speed"
- [ ] Structured data passes Google's Rich Results Test for all ten pages

## Editing the site by hand

There's no build step: edit the HTML files directly. A few things live in more than one place, so here's where.

**English and Spanish are separate files.** Any change to a page also needs making in its Spanish version:

| English | Spanish |
|---|---|
| `index.html` | `es/index.html` |
| `first-surf-lesson-santa-teresa/` | `es/primera-clase-de-surf-santa-teresa/` |
| `kids-family-surf-lessons-santa-teresa/` | `es/clases-de-surf-para-ninos-y-familias-santa-teresa/` |
| `beginner-surf-beaches-santa-teresa/` | `es/playas-para-aprender-surf-santa-teresa/` |
| `surf-coaching-santa-teresa/` | `es/clases-de-surf-avanzado-santa-teresa/` |

**Changing a price.** Prices appear as text and in the structured data (the `<script type="application/ld+json">` block
in the `<head>`). In every page below, search for the old price with the dollar sign (for example `$75`), and on the two
homepages also for `"price": "75"` (it appears twice per product) and `"priceRange"`.

| Price | Pages to search |
|---|---|
| Private $75, Group or family $65 | both homepages, the first-lesson, kids and coaching guides, in both languages (the beaches guides only say "From $65" / "Desde $65") |
| Mini Surf Camp $200, Group Mini Surf Camp $170 (Spanish: "Mini Surf Camp grupal") | both homepages, the first-lesson, kids and coaching guides, in both languages |
| Board rental $15 a day (still to be confirmed by Weyser) | both homepages, FAQ "Can I rent a board after the lesson?" |

The two camp cards say "$25 less than three single sessions" and "$25 less per person": three sessions at the single price
minus the camp price. Update them if either price changes. The "Three sessions is where it clicks" section on both homepages
also names both camp prices. The floating WhatsApp button says "from $65" (the lowest price). Update `llms.txt` too (it is plain text).

**Changing the lessons count (800+)** or other facts about Weyser: search all pages for the number alone, `800` (English
says "800+" and "More than 800", Spanish "Más de 800"). It appears in the hero and the guides' proof line under the first
button, the Meet Weyser stats and the screen-reader sentence just above them, the guides' "At a glance" and "Last
updated" lines, and the first-lesson guide's opening answer. Update `llms.txt` too.

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
2. Layout helpers, 3. Buttons, 4. Header, 5. Hero, then each homepage section down to 18. Floating WhatsApp button,
19. Guide pages, 20. Photo placeholders and 21. Motion. The list is at the top of the file, so search for "5. Hero" to
jump there.
- Each selector is written once per `@media`: change a rule where it is instead of adding a second copy lower down.
- Inside a section the plain rules come first, then that component's `@media` rules. The widths used most: up to 360px
  (small phones), up to 560px (phones), from 700px and 760px (tablets), from 820px, 860px and 900px (small laptops;
  the header button replaces the floating WhatsApp button at 860px), from 1000px (desktop). Some components have one or two
  widths of their own where their layout needed it; that's intentional, so match the component you're editing.
- Eight small groups of rules sit just outside their own section, each under a note "From …: kept here". They override
  a rule above them, and in CSS the later rule wins, so leave them where they are.
- New styles for a component go at the end of its section.

**Colours:** every solid colour is a variable (a "token") in the `:root` block at the top of `site-v5.css`. Change a colour
there and it changes everywhere; don't type hex codes into rules. The `:root` block is also copied into the
first-screen styles (`<style id="critical">`) of all ten pages, so change it there too (see "First-screen styles").
The first ten tokens are the live site's own, unchanged.
One rule for the two blues: **blue words use `--blue-ink`, blue decoration uses `--blue`.**

| Token | Value | Used for |
|---|---|---|
| `--navy` | `#063F5C` | Headings, navy sections (surf report, Three sessions, Meet Weyser), step numbers, outline buttons |
| `--navy-deep` | `#042C41` | Hero text panel, closing section, footer |
| `--blue` | `#419EBD` | Decoration only: dots, list markers, quote bars, underlines, the big card numbers. It's the logo kit's blue and reads well on navy |
| `--blue-ink` | `#2B697D` | Blue **text** on sand or white: "Best option", "Session 1", timeline times, stage labels. The same blue, darker, so small text passes contrast (WCAG AA 4.5:1) |
| `--orange` | `#F27F0C` | Things you tap to book: buttons, the floating WhatsApp button. Decorative exceptions, on purpose: the waves under "surf" (hero), "water" (closing call) and the guide headlines, and the lines through Three sessions and the guides' step-by-step |
| `--orange-soft` | `#FF9533` | Button hover |
| `--ink` / `--ink-soft` | `#242320` / `#4A4843` | Body text / secondary text |
| `--paper` / `--paper-deep` | `#F2ECE1` / `#E8DFCF` | The two sand backgrounds. After each navy section the first sand section is `--paper-deep`, the next `--paper` |
| `--white` | `#FFFFFF` | Cards, text on navy |
| `--green`, `--green-deep`, `--green-soft`, `--green-ink` | `#1B8A5A` `#1B7A4A` `#E7F6EE` `#0B3D2A` | "Bad waves? Free reschedule" box, included-list ticks, the form's "ready" line |
| `--wa-bubble` / `--wa-ink` | `#DCF8C6` / `#111B21` | The WhatsApp message preview in the booking form |
| `--placeholder` / `--placeholder-soft` | `#C8102E` / `#FDECEE` | The two PHOTO NEEDED boxes on the beaches guide; delete with the boxes |

See-through tints (shadows, text on navy, the hero fade) are written as `rgba()` of these colours, because older phones
can't combine a variable with transparency. The numbers map back: `6,63,92` is navy, `4,44,65` navy-deep, `242,127,12`
orange, `242,236,225` paper, `255,255,255` white, `0,0,0` black (shadows only). Fonts, corner radius, shadows, page
width and side padding are tokens too (`--display`, `--body`, `--radius`, `--radius-sm`, `--shadow`, `--shadow-lift`,
`--wrap`, `--gutter`).

**First-screen styles:** each page has a `<style id="critical">` block in its `<head>`. It holds copies of the rules
that style the first screen (header, hero, surf report, the guides' header photo), so the page can draw before
`site-v5.css` arrives; the full stylesheet then loads without blocking (Google PageSpeed: "Render-blocking requests").
- **If you change a header, hero or first-screen style in `site-v5.css`, make the same change in that block on all ten
  pages**, or the first screen briefly shows the old style before the full file arrives.
- Every rule in the block is an exact copy, so you can search for its selector in `site-v5.css`. The block is identical
  on all ten pages: edit it once, then paste the same block into the other nine.
- To drop the block: delete the `<style id="critical">…</style>`, and turn the next line back into a normal
  `<link rel="stylesheet" href="/assets/site-v5.css?v=…">` (delete `media="print" onload="…"` and the `<noscript>` line).
  The page then simply waits for the full file again.

**Cache:** every page links `site-v5.css?v=…` (twice: the stylesheet line and the `<noscript>` line after it) and
`site-v5.js?v=…`. When you change either file, change those `?v=` values on all ten pages (any new value works, for
example today's date: `?v=2026-11-02`), so returning visitors get the new file.

**TripAdvisor and Airbnb:** the footer of all ten pages already has both links, switched off as HTML comments under
"Google Maps" (search for `TRIPADVISOR-LISTING-URL` and `AIRBNB-EXPERIENCE-URL`). When a listing is live:
1. paste its address over the placeholder and delete the `<!--` and `-->` around that line, on all ten pages;
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
- **Floating WhatsApp button (phones):** rolls in with a small overshoot.
- **To tone it down,** change the distances and the overshoot curves in section 21: `cubic-bezier(.2,1.3,.32,1)` and
  similar, about a dozen. The second number is the overshoot (1 means none; they range from 1.3 to 1.7).
  **To switch it all off,** delete the line `doc.classList.add('motion');` in `site-v5.js`.
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

**The surf report** (the forecast strip under the hero, and on the coaching guides) asks Open-Meteo's free marine
API for tomorrow's waves, straight from the visitor's browser.
- **Licence:** Open-Meteo's free API is for non-commercial use, and Weyser runs a business (see `TO-CONFIRM.md`). The
  options are their commercial plan, or the optional function below, which keeps the number of calls tiny.
- **The optional function** (`functions/api/forecast.js`, about 30 lines) runs on Cloudflare at `/api/forecast`. It asks
  Open-Meteo once an hour and serves that cached copy to every visitor, so about 24 calls a day instead of one per
  visit. If Open-Meteo is down it answers with an error, and the page then asks Open-Meteo directly, as today. To
  switch it on:
  1. Put the `functions/` folder at the root of the Pages project, next to the output folder (not inside `site/`).
     Pages runs it automatically when you deploy from Git or with `wrangler pages deploy`; a drag-and-drop upload in
     the dashboard does not run functions.
  2. Check that https://weysersurf.com/api/forecast shows the forecast data.
  3. In `site-v5.js`, replace the line `get(direct).then(render).catch(fail);` with the line in the comment just above
     it, and change the `?v=` values (see "Cache").

**The drone video** behind "See you in the water." (both homepages). It plays by itself whenever that section is on
screen, for everyone, also with "reduce motion"; a tap on the video area pauses it and plays it again. Which file a
visitor gets:

| Visitor | Gets | Size |
|---|---|---|
| Desktop, and phones on wifi or 4G | `drone-loop.mp4` | 0.7MB |
| Phones on 3G (Android tells the page; slow regions are mostly Android) | `drone-loop-light.mp4`, a smaller picture | 0.2MB |
| Browser blocks video autoplay (iPhone Low Power Mode, some in-app browsers, embeds) | `drone-loop.webp`, the same loop as an animated image, which browsers never block | 0.7MB |
| Data saver on, or 2G | `drone-loop-poster-960.webp`, the still image only | 0.1MB |

- Nothing downloads at the top of the page: the video has `preload="none"`. About a screen before the section
  (800px), the script sets the still image (`data-poster`) and starts downloading the video, so it is already playing
  when the visitor arrives.
- The other two files are named on the `<video>` tag: `data-light` and `data-anim`. Delete an attribute to switch that
  version off. The choice is made in the "drone loop" part of `site-v5.js`.
- The animated image downloads only when autoplay fails. It takes the video's exact place (same box, same crop), so
  nothing moves on the page.

*Replacing the clip:* you need ffmpeg (`brew install ffmpeg`). From this folder run `tools/encode_video.sh new-clip.mp4`
with a clip that has no sound, lasts 5 to 8 seconds, is 640 to 960px wide and loops cleanly. It writes all three files
and the still image (`drone-loop-poster-960.webp`, from the first frame) into `site/assets/video/`.

**iPhone Safari (iOS 26)** draws the page behind the clock and behind its floating address bar, and colours those areas
from pinned elements. Three things keep that looking right; please keep them when editing (comments in `site-v5.css`
mark each one):
- The header, once shown solid, is plain `--paper` with **no `backdrop-filter`** (blur). Safari only takes a solid,
  unblurred colour; otherwise page content shows through behind the clock.
- **The film grain (`body::after`) is off on phones.** Safari counted it as the page and never reached the header.
- The floating WhatsApp button sits 24px above the bottom edge, its shadow fits within those 24px (Safari cuts off
  anything below the edge), and it's painted with an orange-to-orange **gradient**, not a flat colour: Safari ignores
  gradients, otherwise it turns its whole bottom bar orange. When tucked away it is also `visibility: hidden`.
- On iPhones the script adds a 6px sand strip pinned to the bottom edge (`.edge-tint`). Safari colours its bottom bar
  from it, so the bar is always sand; without it, the bar took whatever scrolled underneath (orange, sand or clear).

## Quality checks

These are the checks run before handover, on all ten pages. The same tests are in `tools/`, so you can re-run them
after your own edits.

| Check | What it proves | Result at handover |
|---|---|---|
| `qa_browser.mjs` | 10 pages × 7 widths (320 to 1440px): no sideways scrolling, nothing off-screen, no script errors, no failed requests, no broken images, buttons don't wrap, floating WhatsApp button on phones vs header button on wider screens | 70 of 70 clean |
| `qa_functional.mjs` | The booking form builds the right WhatsApp message in English and Spanish; every Book button preselects a real option; floating WhatsApp button, FAQ toggle, language switch, surf report, WhatsApp number; the coaching and kids guides open the form preselected in both languages; every Spanish page links only to Spanish guides, and each language switch goes to the matching page | All pass |
| `qa_mobile.mjs` | On a phone: tap targets thumb-sized and not overlapping, no iPhone zoom on form fields, no text under 12px, WCAG AA contrast, loading on a 4× slower CPU and fast 3G (LCP < 2.5s, CLS < 0.1, TBT < 200ms), 60fps scrolling, jump links below the header, safe area, no sticky hover, sharp photos, swipe rows | All pass on all ten pages |
| `qa_critical.mjs` | With `site-v5.css` blocked, every first screen (10 pages × 10 widths) looks exactly the same: the inline first-screen styles are complete | 100 of 100 identical |
| `qa_video.mjs` | The drone video plays when the closing section scrolls in, pauses when it leaves, plays again, plays with "reduce motion" too, and a tap on the video pauses it. Phones on 3G get the light file, desktop never does; when autoplay is blocked (openly or silently) the animated image fills the same box | All pass |
| `qa_styles.mjs` | A style lock: records every element's position and style (10 pages, 8 widths, before and after taps), so a CSS clean-up can be proven to change nothing | Used for every refactor |

**To run them** (Node 22 and Google Chrome; an internet connection for the surf report checks). From this folder, in
three terminals:
1. Serve the site and leave it running: `python3 tools/serve.py 8770 site` (this server also sends video in pieces,
   like Cloudflare, so Safari plays it; `python3 -m http.server` does not).
2. Start a headless Chrome and leave it running. On a Mac:
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9334 --user-data-dir=/tmp/qa-chrome about:blank`
   (on Windows or Linux, the same flags on your Chrome or Chromium).
3. Run a test: `node tools/qa_browser.mjs`. Each test exits non-zero on failure; most print PASS or FAIL per check,
   `qa_browser` prints "no problems" or the problem, `qa_critical` and `qa_styles` print IDENTICAL or the differences.
   `QA_BASE=https://weysersurf.com node tools/qa_video.mjs` runs a test against the live site instead (any copy
   served from the root of its domain).
4. The style lock: `node tools/qa_styles.mjs save before`, make your change, `node tools/qa_styles.mjs save after`,
   then `node tools/qa_styles.mjs compare before after`.

## Measuring bookings (tracking)

Nothing is tracked yet, and no analytics script is loaded. Two things are already in place:

- **Every WhatsApp message says where it came from.** The booking form ends with a tag naming the button that opened it,
  for example "(Found you on your website · family)". The other WhatsApp links are tagged the same way ("· sticky" for the floating button,
  "· standby", "· footer"), and the guide pages name the page. Weyser can count these in WhatsApp with no setup at all.
- **Every WhatsApp link has a `data-track="<source>"` attribute**, and `site-v5.js` has a small `track()` function (also
  available as `window.weyserTrack("WhatsApp", source)` for any other link). When `window.plausible` exists, it sends a custom event
  "WhatsApp" with a `source` property. Otherwise it does nothing.

To turn on click counts, we suggest **Plausible**: one small script, no cookies, so no cookie banner is needed.
1. Create the site in Plausible, then add this line to the `<head>` of every page:
   `<script defer data-domain="weysersurf.com" src="https://plausible.io/js/script.js"></script>`
2. In Plausible, add a custom event goal named `WhatsApp` and the custom property `source`.

Cloudflare Web Analytics, which the site may already use, counts page views but not button clicks. It can run
alongside Plausible.

## Speed: what's already done, and how to keep it fast

Already done in these files:

- **Images:** WebP, nearly all in two widths, with `srcset` and `sizes`, so phones download the small one (mostly 20
  to 85KB). All have `width` and `height`, so nothing jumps while loading. Everything below the first screen uses `loading="lazy"`.
- **Hero:** preloaded with `fetchpriority="high"`. Only two fonts (400 and 700) are preloaded.
- **CSS and script:** one stylesheet (74KB, about 16KB gzipped), which no longer blocks the first paint (see "First-screen
  styles"), and one script (18KB, about 7KB gzipped), loaded with `defer`. Cloudflare's Brotli makes both a little smaller.
- **Video:** 0.7MB (was 2.6MB), and nothing of it loads until the visitor nears the closing section. Phones on slow
  connections get a 0.2MB version (see "The drone video").
- **Result:** on an iPhone-size screen, the homepage's first screen loads **about 380KB** over the network. The live
  homepage loads **about 560KB**, of which 448KB is images, measured the same way on 7 October 2026. The Spanish homepage is the same. The drone video (0.7MB) is not part of the first load:
  it only downloads when the visitor reaches the closing section.

**Google PageSpeed Insights** (mobile, English homepage, 3 runs each, middle result, October 2026). The redesign ran on
the GitHub preview, the live site on Cloudflare:

| | Live site | Redesign |
|---|---|---|
| Performance | 96 (runs: 93, 96, 100) | 94 (runs: 94, 99, 94) |
| Accessibility / Best Practices / SEO | 100 / 96 / 100 | 100 / **100** / 100 |
| Page weight | 654KB | **395KB** (40% less) |
| First Contentful Paint | 1.5s | 1.4s |
| Largest Contentful Paint | 2.6s | 2.8s (best run 1.8s) |
| Speed Index | 3.1s | 4.1s (best run 1.2s) |
| Total Blocking Time / Layout shift | 0ms / 0 | 0ms / 0 |

How to read it: both sites are in Google's green band, and the Performance scores are a tie (Google's own runs vary
by up to 7 points). The redesign is much lighter and scores 100 on Best Practices, while carrying the booking form,
reviews, guides and motion. Its Speed Index swings between runs, mostly from the hero's entrance motion and the
hosting. **Re-run the test once the redesign is live on Cloudflare** (same hosting as today), and use those numbers.

Adding photos later:

- Export two WebP versions at 800 and 1600px wide (portrait photos 600 and 1200), quality around 75 to 80.
  squoosh.app does this in the browser.
- Name them `what-it-shows-800.webp` / `-1600.webp`, the same as the rest.
- Video: see "Replacing the clip" under "The drone video".

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
