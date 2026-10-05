# What's different from the live site

The redesign is aimed at Weyser's main customers, **first timers and families**. The goals are more WhatsApp bookings,
and being found in Google and AI search for "surf lessons Santa Teresa". Each new page replaces the old one whole, so this
is a description of the end result, not a to-do list. (Still needed before launch: `TO-CONFIRM.md`.)

## Homepage (`index.html`)

**Section order:** Hero · Who's surfing (3 cards) · Your first lesson · Reviews · Prices + booking form · Meet Weyser ·
Tomorrow's forecast · Three stages · Everyone gets stuck · Photo strip · FAQ · Closing.

- **Head / SEO:** title "Surf Lessons & Coaching in Santa Teresa, Costa Rica"; the description mentions first timers and
  families; the structured data (based on the live JSON-LD) has the new offers and an FAQ list matching the 18 questions.
- **Hero:** a student standing up while Weyser cheers (it shows beginners the result). Subline "First timers and families
  welcome. Three people max, always." Proof line: "800+ lessons taught · ★★★★★ 5.0 on Google · From $65 · ISA & lifeguard
  certified"; the stars link to his Google profile. Buttons: "Book a session" (to the booking form) and "See prices".
  On phones the photo sits above the text.
- **Who's surfing?** Three cards (First timer, Family & kids, Surfed before), each with a photo, a "Best fit" price, a
  link to the matching guide, and a Book button that opens the booking form with that choice already selected.
- **Your first lesson, start to finish:** three photos (walk in, pop up, head home). Swipes sideways on phones.
- **Reviews:** four real Google reviews, word for word, with the reviewers' Google photos, and a link to all reviews.
- **Prices:** Private $75 · Group or family $65 per person ("Best for families") · Mini Surf Camp $200 (3 private
  sessions) · Group Mini Surf Camp $170 per person. "Bad waves? Free reschedule." Included: board, rashguard, wax, coconut.
  Extras and payment in one line. (The Mini Surf Camp was "Progression Block" at $210 / $180 on the live site.)
- **Booking form** (`#book`): who's surfing, session, group size and kids' ages (for groups and families), when, and an
  optional "Staying where?". It opens WhatsApp with a complete, bulleted message, so no more "My level: ___" blanks. The
  last line names the button that opened the form (see README, "Measuring bookings"). Email and Instagram for people
  without WhatsApp.
- **Meet Weyser:** his bio from the live site, four stats (18 years surfing, 7 years coaching, 800+ lessons, ISA
  certified coach with lifeguard & CPR) and his quote: "You're going to have a great time, and you're going to laugh."
- **Three stages / Everyone gets stuck:** plainer words, less surf jargon.
- **Photo strip:** aerial turn, jungle walk-out, jeep, spray turn.
- **FAQ:** 18 questions; the 6 families ask most show first, the other 12 sit behind "More questions". Includes the
  lightning and bad-waves policy. Cancellation is free up to 3 hours before, as on the live site.
- **Closing:** a muted drone loop behind "See you in the water.", the reply-time line and the standby list.
- **Logo:** the same inline SVG lockup and rules as the live site, in Weyser orange.
- **Footer:** WhatsApp, email, Instagram, Google Maps, and a "Guides" column with the four guides.
- **Sticky bar (phones):** "WhatsApp Weyser · from $65" opens WhatsApp directly. From 860px wide it's hidden, because
  the header button shows instead.
- **Colour:** orange is used only for things you tap to book; decorative marks are ocean blue and navy.

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

Each guide has a short, quotable answer at the top, an "At a glance" table, questions and answers, booking buttons, a
"Last updated" date, and Article, Breadcrumb and FAQ structured data. They're linked from the homepage cards, the lesson
section, four FAQ answers and the footer of every page, and they link back to the homepage and to each other.

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
- The TripAdvisor footer link: there's no listing yet. Add it back once there is (TO-CONFIRM).
