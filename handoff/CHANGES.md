# What changed on the homepage, and why

The redesign is aimed at the main customers: **first timers and families**. The goals are more WhatsApp bookings,
and being findable in Google and AI search for "surf lessons Santa Teresa".

The new `index.html` replaces the old one whole, so this list is for review, not a to-do list.

## New page order

| Old | New |
|---|---|
| Hero · forecast · stuck · levels · stages · why · meet · prices · FAQ · closing | Hero · **Who is surfing** · **First lesson, start to finish** · **Reviews** · **Prices + booking picker** · Meet Weyser · forecast · stages · stuck · **gallery** · FAQ · closing |

Why: most visitors are beginners and families deciding quickly on a phone. Levels, proof and prices now come in the
first few screens, and the longer story follows for people who keep scrolling.

## Section by section

- **Head / SEO**
  - Title: "Surf Lessons & Coaching".
  - The description now mentions first timers and families.
  - FAQ structured data is updated to match the 18 questions on the page.
- **Hero**
  - The photo is now a student standing up with Weyser cheering, instead of the aerial shot. It shows beginners the result.
  - New subline: "First timers and families welcome".
  - Added a proof line: "800+ lessons taught · ★★★★★ on Google · From $65 · Lifeguard certified". The stars link to his Google profile, so they're checkable.
  - Two buttons: "Book a session" (goes to the picker) and "See prices".
  - On phones the photo sits above the text, so the headline never covers the student.
- **Who is surfing?**
  - Three cards: First timer, **Family & kids** (new), and Surfed before (merges "back for more" and "stuck").
  - Each card has a photo, a "Best fit" price, and a "Book" button that opens the picker with that choice selected.
  - Links to the two new guides.
- **Your first lesson, start to finish** (new)
  - A 3-photo sequence: walk in, pop up, head home.
  - On phones it swipes sideways.
- **Reviews** (new)
  - Heading: "Hands down the best surf coach." (a line from a real review)
  - Four real Google reviews, word for word, with the reviewers' Google photos and a link to all reviews on Google.
- **Prices**
  - "Group or family" is the highlighted card, with a "Best for families" badge and the only solid button.
  - Added a "Bad waves? Free reschedule" promise above the cards.
  - Private shows "per session".
  - The Mini Surf Camps say "Three sessions is where it clicks".
  - "Included" is now one line of checkmarks.
  - Extras have prices.
- **Booking picker** (new, `#book`)
  - The visitor taps who is surfing, the session, group size, kids' ages and when (Tomorrow, This week, or dates).
  - It opens WhatsApp with a complete message. Before, the message had blanks like "My level: ___".
  - Includes a "Not sure, help me pick" option.
  - Offers email or Instagram for people without WhatsApp.
- **Meet Weyser**
  - Merged with the old "Why paddle out" section.
  - Keeps the live bio and quote.
  - Adds four stats (18 years surfing, 7 coaching, 800+ lessons, lifeguard and CPR).
- **Stages / stuck**
  - Plainer words ("Catch your own waves", "Watching every good wave go past you"), with less surf jargon for beginners.
- **Gallery** (new)
  - Four photos: jungle walk-out, jeep, aerial turn, spray turn.
- **FAQ**
  - 18 questions in all.
  - The 6 that families ask most show first (kids, safety, families of four or more, bad waves, length).
  - The other 12 are behind "More questions".
  - Cancellation is 3 hours, as on the live site.
- **Closing**
  - A muted drone loop plays behind "See you in the water."
  - Adds a reply-time line.
- **Header and footer logo**
  - The real Weyser logo (the same inline SVGs as the live site).
- **Footer**
  - Adds an email address, Google Maps and TripAdvisor links (still to add), and a new "Guides" column.
- **Sticky bar**
  - "Book a session · from $65", which goes to the picker. It hides while the picker is on screen.
- **Colour**
  - Orange is now used only for things you tap to book.
  - Decorative marks (wave icons, numbers, stars, quote border) moved to the ocean blue and navy.

## New pages

- `/first-surf-lesson-santa-teresa/`, `/kids-family-surf-lessons-santa-teresa/` and `/beginner-surf-beaches-santa-teresa/`
- The first-lesson page walks through the lesson step by step (a numbered timeline), with a "what to bring" checklist.
- They answer the questions families and beginners type into Google and ask AI assistants.
- Each has:
  - a short, quotable answer at the top
  - an "At a glance" facts table
  - Q&A sections
  - a booking button
  - a "Last updated" date
  - Article, Breadcrumb and FAQ structured data
- They're linked from the homepage level cards, the lesson section, four FAQ answers and a "Guides" footer column on every page.
- They link back to the homepage and to each other.

## Script (`site-v5.js`)

Everything from `site.js` is still in it: header, reveal on scroll, the forecast strip, and the sticky bar. It adds:

- **Booking picker:** writes the WhatsApp message, and shows or hides the group size, kids' ages and dates fields.
- **Book buttons:** every `href="#book"` button with `data-level` or `data-session` selects those choices in the picker.
- **FAQ toggle** ("More questions").
- **Drone loop:** plays only while on screen. It stays off with reduced motion, data saver and slow connections.
- **Sticky bar:** also hides while the picker is visible.

## 2026-10-01: Mini Surf Camp, reviewer photos
- "Progression Block" is now **Mini Surf Camp**, and "Group Progression Block" is now **Group Mini Surf Camp**. The rename covers the price cards, the booking form (so the WhatsApp message uses the new name), the FAQ, the JSON-LD offers and the guide pages.
- The Google reviews now show the reviewers' Google profile photos: assets/img/reviewer-*.jpg, 96px, shown at 44px. Rocío has no photo on Google, so she keeps the initial.
- The level-card buttons stay on one line. CSS version is now ?v=20261001d.
- Mini Surf Camp prices: **$200** for just you (was $210) and **$170 per person** for the group camp (was $180). Both save $25 compared with 3 single lessons. Updated on the price cards, the booking form, "Best fit", the guide pages and the JSON-LD (offers and priceRange).
- Fonts: Montserrat is the only font, for headings and body, same as the live site. The unused "Kiona" heading-font reference is gone. Fonts are self-hosted in assets/fonts (no Google Fonts call), and the 400 and 700 weights are preloaded.
- Floating "Book a session" button: hidden from 860px up, like the live site, because the header button is showing there. On phones it stays as the sticky bottom bar, and the footer gets 96px of bottom padding so the bar never covers it. This restores the developer's rules from the live site.css. CSS version is now ?v=20261001e.
- README: added a Brand section with the colours and fonts from the Canva logo kit.

## 2026-10-01: Spanish homepage
- New `es/index.html`: the redesigned homepage in Spanish, with the same sections, prices and booking form as the English page. It replaces the old Spanish page, so the two languages no longer show different names or prices.
- Neutral, friendly Spanish with *tú*, readable for Costa Ricans and for visitors from the rest of Latin America and from Spain. Local words stay where they help: *pipa* (coco fresco), *licra*.
- Weyser's bio is kept word for word from the old Spanish page. (His quote was updated later the same day, see below.)
- The camp keeps its name, **Mini Surf Camp** (and **Mini Surf Camp grupal**), so Weyser sees the same name from both languages.
- Reviews: the three English reviews are shown in Spanish, labelled "Reseña de Google, traducida del inglés". Daniela's review is in Spanish already and is shown as written.
- The booking form on `/es/` writes the WhatsApp message in Spanish. For example: "¡Hola, Weyser! Te encontré en tu sitio web. Quién: Familia con niños, 3 personas (niños: 8 y 11). Clase: Mini Surf Camp grupal. Cuándo: 20 dic al 23 dic". site-v5.js picks the language from `<html lang>`, so the English page is unchanged.
- Structured data on `/es/`: Spanish descriptions, offers and an FAQ list that matches the 18 questions on the page.
- Drone video: it now also plays on phones that report a "3g" connection, which many do on normal mobile data (only data saver and 2G keep it off). If the phone blocks autoplay (iPhone Low Power Mode), it starts on the visitor's first tap. Tested in Chrome on desktop and phone sizes, in English and Spanish. CSS and JS version is now ?v=20261001g.
- Guide titles now include "Costa Rica": "Surf Lessons for Kids & Families in Santa Teresa, Costa Rica" and "First Surf Lesson in Santa Teresa, Costa Rica: What to Expect" (all three guides now match).

## 2026-10-01: credentials, lessons count, quote
- Weyser's **ISA certification** (International Surfing Association surf instructor) is now on the site: the hero trust line ("ISA & lifeguard certified"), the "Meet Weyser" stats, the safety FAQ answer, the guide pages' coach details, the Spanish page, and the structured data (`hasCredential`, recognised by the International Surfing Association).
- Lessons taught: **650+** everywhere (was 800+).
- Weyser's quote is now "You're going to have a great time, and you're going to laugh." (Spanish: "La vas a pasar genial y te vas a reír.")
- Buttons stay on one line on the smallest phones (320px): slightly tighter button padding there, and the beaches guide button now reads "Ask which beach to surf". CSS and JS version is now ?v=20261002a.

## 2026-10-02: homepage revision (families first)
- **New homepage order:** hero, Who is surfing? (first timer, family), Meet Weyser, your first lesson, reviews, prices, booking form, FAQ, closing.
  The headline stays "Actually learn to surf."
- **Improver content has its own page:** `/surf-coaching-santa-teresa/`, plus the Spanish version `/es/clases-de-surf-avanzado-santa-teresa/`.
  "Three stages", "Everyone gets stuck", the advanced photos and the "Tomorrow in Santa Teresa" forecast moved there; the forecast code is
  unchanged. On the homepage the "Surfed before" card is now one line: "Surfed before and stuck? See coaching for improvers →".
  The new page is in the footer Guides list and in the sitemap.
- **Meet Weyser, safety first:** lifeguard, CPR and ISA certification come first, then how first timers and kids learn
  (Playa Hermosa or Playa Carmen), then his story. The new Spanish quote is "Te vas a divertir y te vas a reír."
- **"650+ lessons"** now appears only in the hero and the Meet Weyser stats.
- **Booking form:**
  - optional step 4, "Staying where?" (Santa Teresa, Malpaís, Playa Carmen, Playa Hermosa, Other);
  - the message is now a bulleted list, ending with a tag that names the button that opened the form;
  - other pages can preselect the form with a link like `/?level=Surfed%20before&session=Not%20sure&src=improver#book`.
- **Sticky bar on phones** opens WhatsApp directly: "WhatsApp Weyser · from $65". It is still hidden from 860px up, where the header button shows.
- **Tracking:** `data-track` on every WhatsApp link and a `track()` stub in site-v5.js. See README, "Measuring bookings".
- Removed photos that are no longer used: jeep-boards, lineup-wave-hello.
- Mobile homepage is about 23% shorter (from about 15,500px to 11,900px tall on a 390px phone).
