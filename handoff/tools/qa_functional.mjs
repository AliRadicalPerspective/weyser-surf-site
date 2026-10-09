// Functional QA: the things a visitor does. Booking form (both languages), button preselects and source tags,
// links from other pages, the sticky bar, FAQ toggle, language switch, forecast strip, drone video, tracking stub.
// Needs the site on :8770 and headless Chrome on :9334 (same as qa_browser.mjs). Run: node tests/qa_functional.mjs
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8770';
const sleep = ms => new Promise(r => setTimeout(r, ms));
let fails = 0;
const check = (name, ok, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  · ' + detail : ''}`); if (!ok) fails++; };

async function open(path, w = 390) {
  const t = await (await fetch('http://127.0.0.1:9334/json/new?about:blank', {method:'PUT'})).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); let id = 0; const P = {};
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && P[m.id]) P[m.id](m.result || m); };
  await new Promise(r => ws.onopen = r);
  const send = (m, p={}) => new Promise(r => { const i = ++id; P[i] = r; ws.send(JSON.stringify({id:i, method:m, params:p})); });
  await send('Network.enable'); await send('Network.setCacheDisabled', {cacheDisabled:true}); await send('Page.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', {source: "window.__ev=[];window.plausible=function(e,o){window.__ev.push(e+':'+o.props.source)};"});
  await send('Emulation.setDeviceMetricsOverride', {width:w, height:844, deviceScaleFactor:1, mobile:w < 800});
  await send('Page.navigate', {url: BASE + path}); await sleep(2500);
  const ev = async x => { const r = await send('Runtime.evaluate', {expression:x, awaitPromise:true, returnByValue:true}); return r.exceptionDetails ? 'ERR ' + (r.exceptionDetails.exception?.description || '').slice(0, 160) : r.result?.value; };
  return {ev, close: async () => { ws.close(); await fetch('http://127.0.0.1:9334/json/close/' + t.id); }};
}
const SUBMIT = `(()=>{let o;window.open=u=>{o=decodeURIComponent(u.split('text=')[1]);return {}};document.querySelector('.book-form').requestSubmit();return o})()`;

for (const [path, L] of [['/', 'en'], ['/es/', 'es']]) {
  const T = await open(path);
  // family card -> form with family + group selected, then fill the rest
  await T.ev(`document.querySelector('a[data-src="family"]').click()`); await sleep(150);
  await T.ev(`(()=>{const f=document.querySelector('.book-form');f.querySelector('input[name=people][value="4 or more"]').click();f.elements.kids.value='8, 11';f.elements.kids.dispatchEvent(new Event('input',{bubbles:true}));f.querySelector('input[name=when][value="This week"]').click();f.querySelector('input[name=stay][value="Playa Carmen"]').click()})()`);
  const msg = await T.ev(SUBMIT);
  const want = L === 'en' ? ['I’d like to book a surf lesson.', '• Who: Family with kids', '• Session: Group or family', '• When: This week', '• People: 4 or more (kids 8, 11)', '• Staying in: Playa Carmen', '(Found you on your website · family)']
                          : ['Quiero reservar una clase de surf.', '• Quién: Familia con niños', '• Clase: Grupo o familia', '• Cuándo: Esta semana', '• Personas: 4 o más (niños: 8, 11)', '• Me quedo en: Playa Carmen', '(Te encontré en tu sitio web · family)'];
  check(`${L}: family card fills the WhatsApp message`, want.every(x => (msg || '').includes(x)), want.filter(x => !(msg || '').includes(x)).join(' | '));
  check(`${L}: form send is tracked`, JSON.stringify(await T.ev('window.__ev')).includes('form · family'));
  // every Book button carries a source tag; each preselect value exists in the form
  const tags = await T.ev(`[...document.querySelectorAll('a[href="#book"]')].map(a=>[a.dataset.src||'', a.dataset.level||'', a.dataset.session||''])`);
  check(`${L}: every Book button has a source tag`, tags.every(t => t[0]), `${tags.length} buttons`);
  const bad = await T.ev(`[...document.querySelectorAll('a[href="#book"]')].flatMap(a=>[['level',a.dataset.level],['session',a.dataset.session]]).filter(([n,v])=>v && !document.querySelector('input[name='+n+'][value="'+v+'"]')).map(x=>x.join('='))`);
  check(`${L}: every preselect matches a form option`, bad.length === 0, bad.join(', '));
  // sticky bar opens WhatsApp directly and is tracked
  const sticky = await T.ev(`(()=>{const a=document.querySelector('.wa-bar a');a.addEventListener('click',e=>e.preventDefault());a.click();return [a.href.startsWith('https://wa.me/50660084391'), decodeURIComponent(a.href.split('text=')[1]||''), window.__ev.slice(-1)[0]]})()`);
  check(`${L}: sticky bar opens WhatsApp with a tagged message`, sticky[0] && sticky[1].includes('sticky') && sticky[2] === 'WhatsApp:sticky', sticky[1]);
  // FAQ toggle, language switch, forecast strip, every WhatsApp link tracked and on the right number
  const misc = await T.ev(`(()=>{const b=document.querySelector('.faq-toggle');b.click();const open=document.getElementById('faq-extra').classList.contains('open');
    const wa=[...document.querySelectorAll('a[href*="wa.me"]')];
    return {faq:open&&b.getAttribute('aria-expanded')==='true', lang:[...document.querySelectorAll('.lang a')].map(a=>a.getAttribute('href')),
            forecast:!!document.querySelector('.hero + .forecast'), waOK:wa.every(a=>a.href.startsWith('https://wa.me/50660084391?text=')), waTracked:wa.every(a=>a.dataset.track), waCount:wa.length}})()`);
  check(`${L}: "More questions" opens the FAQ`, misc.faq);
  check(`${L}: language switch points to the other language`, JSON.stringify(misc.lang) === JSON.stringify(L === 'en' ? ['/es/'] : ['/']), JSON.stringify(misc.lang));
  check(`${L}: surf report sits right below the hero`, misc.forecast);
  check(`${L}: every WhatsApp link uses +506 6008 4391 and is tracked`, misc.waOK && misc.waTracked, `${misc.waCount} links`);
  // drone video plays when the closing section is on screen
  const video = await T.ev(`(async()=>{document.documentElement.style.scrollBehavior='auto';document.querySelector('.closing').scrollIntoView({block:'center'});await new Promise(r=>setTimeout(r,2500));const v=document.querySelector('.closing video');return {playing:!v.paused, poster:!!v.poster}})()`);
  check(`${L}: drone video plays at the closing section, still image set`, video.playing && video.poster, JSON.stringify(video));
  await T.close();
}
// coaching guide -> homepage form preselected, both languages
for (const [path, home] of [['/surf-coaching-santa-teresa/', '/'], ['/es/clases-de-surf-avanzado-santa-teresa/', '/es/']]) {
  const T = await open(path);
  const href = await T.ev(`document.querySelector('a[href*="level=Surfed"]').getAttribute('href')`);
  await T.close();
  check(`${path}: "Plan it in the booking form" goes to ${home}`, href.startsWith(home + '?'), href);
  const H = await open(href.replace(/&amp;/g, '&'));
  const m = await H.ev(SUBMIT);
  check(`${path}: the form opens preselected, tagged improver`, /Surfed before|Ya he surfeado/.test(m) && /improver/.test(m), m.replace(/\n/g, ' / '));
  await H.close();
}
console.log(fails ? `\n${fails} FAILED` : '\nALL PASS');
process.exit(fails ? 1 : 0);
