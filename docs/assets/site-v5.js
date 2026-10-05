/* Weyser Surf Coach · small, dependency free */
(function () {
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  var lang = doc.lang === 'es' ? 'es' : 'en';
  /* words the booking picker writes; Spanish on /es/ */
  var T = lang === 'es' ? {
    hi: '¡Hola, Weyser! Quiero reservar una clase de surf.', found: 'Te encontré en tu sitio web', stay: 'Me quedo en: ', who: 'Quién: ', peopleLine: 'Personas: ',
    kids: ' (niños: ', kidsEnd: ')', session: 'Clase: ', notSure: 'No sé, ¿me ayudas a elegir?', to: ' al ', when: 'Cuándo: ',
    start: '3 toques y listo para WhatsApp', of: ' de 3 listos', done: 'Todo listo: 3 de 3 ✓', send: 'Enviar a Weyser', sendWa: 'Enviar por WhatsApp',
    fewer: 'Menos preguntas', locale: 'es-CR',
    v: { 'First timer': 'Primera vez', 'Family with kids': 'Familia con niños', 'Surfed before': 'Ya he surfeado', 'Private': 'Privada',
         'Group or family': 'Grupo o familia', 'Group Mini Surf Camp': 'Mini Surf Camp grupal', 'Tomorrow': 'Mañana',
         'This week': 'Esta semana', '4 or more': '4 o más', 'Other': 'Otro lugar' }
  } : {
    hi: 'Hi Weyser! I’d like to book a surf lesson.', found: 'Found you on your website', stay: 'Staying in: ', who: 'Who: ', peopleLine: 'People: ',
    kids: ' (kids ', kidsEnd: ')', session: 'Session: ', notSure: 'Not sure, can you help me pick?', to: ' to ', when: 'When: ',
    start: '3 quick taps, then WhatsApp', of: ' of 3 done', done: 'All set: 3 of 3 done ✓', send: 'Send to Weyser', sendWa: 'Send on WhatsApp',
    fewer: 'Fewer questions', locale: 'en-US', v: {}
  };
  var tx = function (v) { return T.v[v] || v; };

  /* tracking stub: every WhatsApp link has data-track="<source>". Nothing is loaded here. If Plausible is added
     to the page, clicks are counted as the custom event "WhatsApp" with a "source" property. */
  var track = window.weyserTrack = function (event, source) {
    if (window.plausible) window.plausible(event, { props: { source: source } });
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-track]');
    if (a) track('WhatsApp', a.getAttribute('data-track'));
  });

  /* header state */
  var header = document.querySelector('.site-header');
  function onScroll() { header && header.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* sticky WhatsApp: shows once the hero is out of view, hides at the closing call */
  var bar = document.querySelector('.wa-bar');
  var hero = document.querySelector('.hero');
  var closing = document.querySelector('.closing');
  if (bar && hero && 'IntersectionObserver' in window) {
    var heroVisible = true, closingVisible = false, bookVisible = false;
    var update = function () { bar.classList.toggle('show', !heroVisible && !closingVisible && !bookVisible); };
    var book = document.getElementById('book');
    if (book) new IntersectionObserver(function (e) { bookVisible = e[0].isIntersecting; update(); }, { threshold: 0.1 }).observe(book);
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }, { threshold: 0.15 }).observe(hero);
    if (closing) new IntersectionObserver(function (e) { closingVisible = e[0].isIntersecting; update(); }, { threshold: 0.35 }).observe(closing);
  } else if (bar) { bar.classList.add('show'); }

  /* reveal on scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* booking form: builds the WhatsApp message from the visitor's taps (only answered steps) */
  var form = document.querySelector('.book-form');
  if (form) {
    var people = form.querySelector('.people'), kids = form.querySelector('.kids');
    var dates = form.querySelector('.dates'), preview = form.querySelector('.book-preview');
    var fromIn = form.elements.from, toIn = form.elements.to;
    var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    fromIn.min = toIn.min = today.toISOString().slice(0, 10);
    var fmt = function (v) {
      if (!v) return '';
      var p = v.split('-');
      return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString(T.locale, { month: 'short', day: 'numeric' });
    };
    var val = function (name) { var el = form.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; };
    var pick = function (name, value) {
      var r = value && form.querySelector('input[name="' + name + '"][value="' + value + '"]');
      if (r) r.checked = true;
    };
    var groupish = function () { return /Group/.test(val('session')) || val('level') === 'Family with kids'; };
    var src = 'form';   /* which button opened the form: sent as a tag at the end of the message */
    var message = function () {
      var level = val('level'), session = val('session'), when = val('when'), stay = val('stay');
      var lines = [T.hi];
      if (level) lines.push('• ' + T.who + tx(level));
      if (session) lines.push('• ' + T.session + (session === 'Not sure' ? T.notSure : tx(session)));
      if (when === 'dates') {
        var f = fmt(fromIn.value), t = fmt(toIn.value);
        when = f ? (t && t !== f ? f + T.to + t : f) : '';
      } else if (when) { when = tx(when); }
      if (when) lines.push('• ' + T.when + when);
      if (groupish()) {
        var k = form.elements.kids.value.trim();
        lines.push('• ' + T.peopleLine + tx(val('people')) + (level === 'Family with kids' && k ? T.kids + k + T.kidsEnd : ''));
      }
      if (stay) lines.push('• ' + T.stay + tx(stay));
      lines.push('(' + T.found + ' · ' + src + ')');
      return lines.join('\n');
    };
    var refresh = function () {
      people.hidden = !groupish();
      kids.hidden = val('level') !== 'Family with kids';
      dates.hidden = val('when') !== 'dates';
      if (toIn.value && fromIn.value && toIn.value < fromIn.value) toIn.value = fromIn.value;
      toIn.min = fromIn.value || fromIn.min;
      preview.textContent = message();
      /* progress: how many of the 3 steps are done, and a button that says so */
      var done = [val('level'), val('session'), val('when')].filter(Boolean).length;
      var prog = form.querySelector('.book-progress'), label = form.querySelector('button[type=submit] > span:not(.sr-only)');
      if (prog) { prog.textContent = done === 0 ? T.start : done < 3 ? done + T.of : T.done; prog.classList.toggle('done', done === 3); }
      if (label) label.textContent = done === 3 ? T.send : T.sendWa;
    };
    form.addEventListener('change', function (e) {
      /* first timers and families who have not picked a session get "Not sure" */
      if (e.target.name === 'level' && !val('session') && e.target.value !== 'Surfed before') pick('session', 'Not sure');
      refresh();
    });
    form.addEventListener('input', refresh);
    var qs = new URLSearchParams(location.search);
    pick('level', qs.get('level')); pick('session', qs.get('session'));
    if (qs.get('src')) src = qs.get('src');
    refresh();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var url = 'https://wa.me/50660084391?text=' + encodeURIComponent(message());
      /* new tab for WhatsApp (app, or WhatsApp Web on desktop); this page stays open behind it.
         No 'noopener' feature here: with it, window.open always returns null and the page would navigate away too. */
      track('WhatsApp', 'form · ' + src);
      var w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (err) {} } else { window.location.href = url; }
    });
    /* every Book button on the page opens the picker with its choice selected */
    document.querySelectorAll('a[href="#book"]').forEach(function (a) {
      a.addEventListener('click', function () {
        pick('level', a.getAttribute('data-level'));
        pick('session', a.getAttribute('data-session'));
        if (a.getAttribute('data-src')) src = a.getAttribute('data-src');
        refresh();
      });
    });
  }

  /* FAQ: top questions first, the rest behind a toggle */
  var more = document.querySelector('.faq-toggle'), extra = document.getElementById('faq-extra');
  if (more && extra) more.addEventListener('click', function () {
    var open = extra.classList.toggle('open');
    more.setAttribute('aria-expanded', open);
    more.textContent = open ? T.fewer : more.getAttribute('data-label');
  });
  if (more) more.setAttribute('data-label', more.textContent);

  /* drone loop plays only while on screen, and never for people who prefer reduced motion */
  var loop = document.querySelector('.closing video.bg');
  var conn = navigator.connection || {};
  /* data saver or a 2G connection only: phones often report "3g" on normal mobile data */
  var slow = conn.saveData || /2g/.test(conn.effectiveType || '');
  if (loop && !slow && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var loopOn = false;
    new IntersectionObserver(function (e) {
      loopOn = e[0].isIntersecting;
      if (loopOn) { var p = loop.play(); if (p && p.catch) p.catch(function () {
        var retry = function () { if (loopOn && loop.paused) { var q = loop.play(); if (q && q.catch) q.catch(function () {}); } };
        document.addEventListener('touchend', retry, { once: true, passive: true });
        document.addEventListener('click', retry, { once: true });
      }); } else loop.pause();
    }, { threshold: 0.2 }).observe(loop);
  }

  /* live forecast for tomorrow in Santa Teresa (Open-Meteo Marine, free, no key) */
  var strip = document.querySelector('.forecast');
  var box = document.querySelector('.fc-data');
  if (!strip || !box) return;
  var L = {
    en: { waves: 'Waves', period: 'Period', from: 'Swell from', water: 'Water', dirs: ['N','NE','E','SE','S','SW','W','NW'] },
    es: { waves: 'Olas', period: 'Período', from: 'Swell del', water: 'Agua', dirs: ['N','NE','E','SE','S','SO','O','NO'] }
  }[lang];
  var nf1 = new Intl.NumberFormat(lang === 'es' ? 'es-CR' : 'en-US', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  var nf0 = new Intl.NumberFormat(lang === 'es' ? 'es-CR' : 'en-US', { maximumFractionDigits: 0 });
  function chip(value, label) {
    var d = document.createElement('div'); d.className = 'fc-chip';
    var b = document.createElement('b'); b.textContent = value;
    var s = document.createElement('small'); s.textContent = label;
    d.appendChild(b); d.appendChild(s); return d;
  }
  function fail() { strip.classList.add('fc-wait'); }
  function render(j) {
    var d = j && j.daily; if (!d || !d.time || d.time.length < 2) throw 0;
    var h = d.wave_height_max[1], p = d.wave_period_max[1], dir = d.wave_direction_dominant[1];
    if (h == null) throw 0;
    box.textContent = '';
    box.appendChild(chip(nf1.format(h) + ' m · ' + nf0.format(h * 3.281) + ' ft', L.waves));
    if (p != null) box.appendChild(chip(nf0.format(p) + ' s', L.period));
    if (dir != null) box.appendChild(chip(L.dirs[Math.round(dir / 45) % 8], L.from));
    var hh = j.hourly, day = d.time[1];
    if (hh && hh.time && hh.sea_surface_temperature) {
      var t = [];
      hh.time.forEach(function (ts, i) { if (ts.indexOf(day) === 0 && hh.sea_surface_temperature[i] != null) t.push(hh.sea_surface_temperature[i]); });
      if (t.length) { var avg = t.reduce(function (a, b) { return a + b; }, 0) / t.length; box.appendChild(chip(nf0.format(avg) + '°C', L.water)); }
    }
    strip.classList.remove('fc-wait');
  }
  if (window.__FC) { try { render(window.__FC); } catch (e) { fail(); } return; }
  var direct = 'https://marine-api.open-meteo.com/v1/marine?latitude=9.64&longitude=-85.17' +
    '&daily=wave_height_max,wave_period_max,wave_direction_dominant' +
    '&hourly=sea_surface_temperature&timezone=America%2FCosta_Rica&forecast_days=2';
  function get(u) {
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = setTimeout(function () { ctrl && ctrl.abort(); }, 5000);
    return fetch(u, ctrl ? { signal: ctrl.signal } : {}).then(function (r) { clearTimeout(timer); if (!r.ok) throw 0; return r.json(); });
  }
  /* our own cached endpoint first (Cloudflare function), the public API as backup */
  get('/api/forecast').catch(function () { return get(direct); }).then(render).catch(fail);
})();
