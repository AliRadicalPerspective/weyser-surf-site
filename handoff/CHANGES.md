# What's different from the live site

The redesign is aimed at Weyser's main customers, **first timers and families**. The goals are more WhatsApp bookings,
and being found in Google and AI search for "surf lessons Santa Teresa". Each new page replaces the old one whole, so this
is a description of the end result, not a to-do list. (Still needed before launch: `TO-CONFIRM.md`.)

## Homepage (`index.html`)

**Section order:** Hero · Tomorrow's forecast (navy) · Who's surfing (3 cards) · Your first lesson · Three sessions is where it
clicks (navy) · Reviews · Prices + booking form · Meet Weyser (navy) · Photo strip · FAQ · Closing (navy). The camp pitch
comes before the prices on purpose, and never more than two sand-coloured sections run together. After each navy section the first sand section is the darker one (`--paper-deep`), the next the lighter (`--paper`).

- **Head / SEO:** title "Surf Lessons & Coaching in Santa Teresa, Costa Rica"; the description mentions first timers and
  families; the structured data (based on the live JSON-LD) has the new offers and an FAQ list matching the 18 questions.
- **Hero:** a student standing up while Weyser cheers (it shows beginners the result). Subline "First timers and families
  welcome. Three people max, and a coach right beside you." Proof line: "800+ lessons taught · ★★★★★ 5.0 on Google · From $65 · ISA & lifeguard
  certified"; the stars link to his Google profile. Buttons: "Book a lesson" (to the booking form) and "See prices".
  On phones the photo sits above the text.
- **Who's surfing?** Three cards (First timer, Family & kids, Surfed before, with Weyser's spray turn), each with a photo,
  a bold price line under a small "Best option" label, one link to the matching guide, and a Book button that opens the booking form with
  that choice already selected. Links and buttons line up across the cards.
- **Your first lesson, start to finish:** one large photo (the pop-up, Weyser close by) beside a connected timeline:
  "On the sand · about 15 minutes", "In the water · about 90 minutes", "After", each with a title and one line. On phones
  the photo sits above the steps.
- **Reviews:** headline "My favorite bodyguard in the ocean." (from Leonie's review), then four real Google reviews, word for word, with the reviewers' Google photos, and a link to all reviews.
- **Prices:** Private $75 · Group or family $65 per person ("Best for families") · Mini Surf Camp $200 (3 private
  sessions) · Group Mini Surf Camp $170 per person. "Bad waves? Free reschedule." Included: board, rashguard, wax, coconut.
  Extras and payment in one line. The camp cards sell the result ("From 'I stood up' to 'I surf'") and say "$25 less than three single sessions". (The Mini Surf Camp was "Progression Block" at $210 / $180 on the live site.)
- **Booking form** (`#book`): who's surfing, session, group size and kids' ages (for groups and families), when, and an
  optional "Staying where?". A line above it says December to April mornings fill up a few days ahead. It opens WhatsApp with a complete, bulleted message, so no more "My level: ___" blanks. The
  last line names the button that opened the form (see README, "Measuring bookings"). Email and Instagram for people
  without WhatsApp.
- **Meet Weyser** (navy section): his bio from the live site, four stats (18 years surfing, 7 years coaching, 800+ lessons, ISA
  certified coach with lifeguard & CPR) and his quote: "You're going to have a great time, and you're going to laugh."
- **Three sessions is where it clicks** (navy section): sells the Mini Surf Camp to beginners as a three-session arc
  (Session 1 stand up, Session 2 catch waves on your own, Session 3 ride along the wave), with the ocean-lessons line and
  both camp prices. Buttons: "Book a Mini Surf Camp" and "Already surfing? Coaching for improvers →". The live site's "Three stages" and "Everyone gets stuck"
  sections are gone from the homepage; both live on the coaching guide.
- **Tomorrow's forecast:** the live surf report and "Book tomorrow's waves" sit right below the hero, as on the live site.
  It stays hidden until its data arrives; the hero fills the first screen, so this causes no visible layout shift.
- **Photo strip:** walking in with Weyser, jungle walk-out, jeep, sunset after the lesson. No photo appears twice on the page.
- **FAQ:** 18 questions; the 4 families ask most show first, the other 14 sit behind "More questions". Includes the
  lightning and bad-waves policy. Cancellation is free up to 3 hours before, as on the live site.
- **Closing:** a muted drone loop behind "See you in the water.", the reply-time line and the standby list.
- **Logo:** the same inline SVG lockup and rules as the live site, in Weyser orange.
- **Footer:** WhatsApp, email, Instagram, Google Maps, and a "Guides" column with the four guides.
- **Wording:** short, friendly, with contractions; "lesson" (not "session") on the main buttons for beginners.
- **Sticky bar (phones):** "WhatsApp Weyser · from $65" opens WhatsApp directly. From 860px wide it's hidden, because
  the header button shows instead.
- **Colour:** orange is used for things you tap to book; decorative marks are ocean blue and navy. The one exception is the orange wave under "surf" in the hero, the page's signature.

## Phones (all pages)

Checked with `tests/qa_mobile.mjs` on every page at phone size:
- Tap targets are thumb-sized and don't overlap.
- Form fields use 16px text, so iPhones don't zoom in.
- No text is under 12px, and all text passes WCAG AA contrast.
- On a slowed-down phone (4x CPU, fast 3G), the main content shows in 1.2 to 1.6s, with no layout shift and near-zero blocking time.
- Scrolling runs at 60fps.

Fixes from that check:
- Small blue labels use the new `--blue-ink` token.
- Small uppercase labels went up to 12px.
- Hover effects only apply on devices that can hover, so a tap no longer leaves a card lifted.
- Review cards show straight away on phones.
- The beaches table becomes one card per beach on phones.
- Long Spanish words in headings break with a hyphen.
- The Spanish reviews headline is now "Mi ángel de la guarda en el mar." (it was "guardaespaldas", too long for small phones).

## Motion

The site moves like water (README, "Motion"):
- The level cards ride in like a set of waves, with a slight tilt; prices and the booking form just fade in quickly; text and the FAQ don't move.
- Headings pop up.
- Photos settle from a zoom.
- The hero headline surfaces, and an orange wave line draws under "surf"; another draws under "water" in the closing call.
- An orange wavy line joins the three sessions.
- Taps ripple and spring.
- The surf-report dot breathes at tomorrow's real swell period.
- The sticky bar rolls in.

It's switched off for visitors who ask for reduced motion, and costs about 3KB compressed.

## Spanish homepage (`es/index.html`)

The same design, sections, prices and booking form, written in neutral, friendly Spanish with *tú*. Weyser's bio comes
from the old Spanish page; his quote is "Te vas a divertir y te vas a reír." The booking form writes its WhatsApp message
in Spanish. The three English-only guides are linked with "(en inglés)".

## New pages

| Address | Page |
|---|---|
| `/first-surf-lesson-santa-teresa/` | Your first surf lesson: what to expect, step by step, with a "what to bring" checklist |
| `/kids-family-surf-lessons-santa-teresa/` | Surf lessons for kids and families |
| `/beginner-surf-beaches-santa-teresa/` | The beaches compared by level (two photos still to come) |
| `/surf-coaching-santa-teresa/` | Coaching for improvers, in Weyser's own voice, with the forecast |
| `/es/clases-de-surf-avanzado-santa-teresa/` | The coaching guide in Spanish |

Each guide has a short, quotable answer at the top, an "At a glance" summary, question cards, booking buttons, a
"Last updated" date, and Article, Breadcrumb and FAQ structured data. They're linked from the homepage cards, the lesson
section, four FAQ answers and the footer of every page, and they link back to the homepage and to each other.

**Guide layout (October 2026):**
- Short questions are white cards, two or three across on desktop, instead of a long column of headings.
- On the kids guide, "Which session should we book?" is a navy chooser, and each option has a "Book this" link that opens
  the booking form with that choice picked.
- **All five guides** (four English, one Spanish) share the homepage's finish:
  - an orange wave under one headline word ("first", "kids", "beaches", "improvers", "mejorar");
  - the homepage's proof line under the first button;
  - one navy band each: the step-by-step with an orange line drawn from step to step (first lesson, coaching),
    "At a glance" (kids), the beaches comparison table (beaches);
  - "At a glance" as fact tiles under a proper section title;
  - "What to bring" across the full width (first lesson); on the beaches guide the six questions are cards under a wide photo;
  - the homepage's scroll-in motion; the coaching guide's three stage cards ride in tilted, like the level cards.

## Speed (October 2026, from Google PageSpeed Insights)

- **First-screen styles inline:** each page draws its first screen before the full stylesheet arrives (README,
  "First-screen styles").
- **Quicker hero entrance:** it now settles in about 1.1s.
- **No failing request on load:** the forecast asks Open-Meteo directly, with no 404 from `/api/forecast`.
- **No forced layout while loading:** the header's first scroll check runs one frame later.
- **Drone video 0.7MB (was 2.6MB), looks the same.** Phones on 3G get a 0.2MB version; desktop always gets the sharp
  one. When a browser blocks video autoplay (iPhone Low Power Mode, in-app browsers, embeds), an animated image of
  the same loop takes its place, so the closing section always moves (README, "The drone video").

## Other details

- **Surf report:** label left, "Book tomorrow's waves" right (one row on wide screens); on phones the four figures are an
  even 2 × 2 grid with a full-width button.
- **Numerals for the key claims:** "3 people max" and "3 sessions is where it clicks" (Spanish: "Máximo 3 personas",
  "Con 3 clases"). Running sentences keep their words.
- **Hero headline on phones:** always three lines (ACTUALLY / LEARN TO / SURF.; APRENDE A / SURFEAR / DE VERDAD.).

## Script (`site-v5.js`)

Everything `site.js` did is still there (header, reveal on scroll, the forecast code unchanged, the sticky bar). Added:

- **Booking form:** builds the WhatsApp message in English or Spanish (it reads `<html lang>`), and shows the group-size,
  kids' ages and date fields only when they apply.
- **Book buttons:** every `href="#book"` link with `data-level` / `data-session` preselects those choices; `data-src`
  names the button in the message. A link from another page can preselect too: `/?level=...&session=...&src=...#book`.
- **FAQ toggle** ("More questions").
- **Drone loop:** plays only while on screen; stays off with reduced motion, data saver and 2G; if the phone blocks
  autoplay (iPhone Low Power Mode) it starts on the visitor's first tap.
- **Tracking stub:** `track()` sends a "WhatsApp" event with a `source` property if Plausible is added; otherwise nothing.

## Removed compared with the live site

- The "Why paddle out with Weyser?" section (its points live in Meet Weyser and the cards).
- The TripAdvisor footer link: there's no listing yet. It's in the footer of every page, switched off, ready for when there is (README, "TripAdvisor and Airbnb"). An Airbnb Experiences link is ready the same way.
