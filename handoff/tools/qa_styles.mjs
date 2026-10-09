// Style lock: records the computed style and position of every element (and its ::before / ::after) on all 7 pages,
// at 8 widths, in the default state and an "interacted" state (header scrolled, sticky bar shown, FAQ opened, a choice
// picked in each booking step). Use it to prove a CSS clean-up changes nothing on screen:
//   node tests/qa_styles.mjs save before      (before the change)
//   node tests/qa_styles.mjs save after       (after the change)
//   node tests/qa_styles.mjs compare before after
// Needs the site on :8770 and headless Chrome on :9334, like qa_browser.mjs. Snapshots go to tests/.styles/.
import fs from 'fs';
const [mode, a, b] = process.argv.slice(2);
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8770';
const DIR = new URL('./.styles/', import.meta.url).pathname;
const PAGES = ['/', '/es/', '/first-surf-lesson-santa-teresa/', '/kids-family-surf-lessons-santa-teresa/', '/beginner-surf-beaches-santa-teresa/', '/surf-coaching-santa-teresa/', '/es/clases-de-surf-avanzado-santa-teresa/'];
const WIDTHS = [320, 390, 600, 768, 860, 1024, 1280, 1600];
const PROPS = ['display', 'position', 'top', 'left', 'right', 'bottom', 'z-index', 'width', 'height', 'min-height', 'max-width',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-top', 'border-right', 'border-bottom', 'border-left', 'border-top-left-radius', 'border-bottom-right-radius', 'box-shadow',
  'background-color', 'background-image', 'background-position', 'background-size', 'color', 'font-family', 'font-size',
  'font-weight', 'font-style', 'line-height', 'letter-spacing', 'text-transform', 'text-align', 'text-decoration-line',
  'text-decoration-color', 'text-decoration-thickness', 'text-underline-offset', 'white-space', 'opacity', 'transform', 'transition', 'animation-name',
  'visibility', 'overflow-x', 'overflow-y', 'flex-direction', 'flex-wrap', 'flex-grow', 'justify-content', 'align-items',
  'align-self', 'row-gap', 'column-gap', 'grid-template-columns', 'grid-template-rows', 'grid-column-start', 'grid-column-end', 'order',
  'object-fit', 'object-position', 'aspect-ratio', 'cursor', 'pointer-events', 'list-style-type', 'filter', 'backdrop-filter',
  'isolation', 'mix-blend-mode', 'outline', 'fill', 'stroke', 'scroll-snap-type', 'text-wrap', 'content'];
const sleep = ms => new Promise(r => setTimeout(r, ms));

const MEASURE = `(()=>{const P=${JSON.stringify(PROPS)};const out=[];
  const skip=${JSON.stringify(process.env.QA_IGNORE||'')};
  for (const e of document.querySelectorAll('body, body *')) {
    if (skip && e.closest(skip)) continue;   // QA_IGNORE='.a, .b': leave out elements that were added on purpose
    const R=e.getBoundingClientRect(), s=getComputedStyle(e);
    let line=e.tagName+'.'+[...e.classList].join('.')+' @'+[R.x,R.y+scrollY,R.width,R.height].map(v=>Math.round(v*10)/10).join(',')+' '+P.map(p=>s.getPropertyValue(p)).join('|');
    for (const pe of ['::before','::after']) { const q=getComputedStyle(e,pe); if (q.content!=='none' && q.content!=='normal') line+=' '+pe+' '+P.map(p=>q.getPropertyValue(p)).join('|'); }
    out.push(line);
  } return out})()`;
const INTERACT = `(()=>{document.querySelector('.site-header')?.classList.add('scrolled');document.querySelector('.wa-bar')?.classList.add('show');
  document.querySelector('.faq-toggle')?.click();document.querySelectorAll('details').forEach((d,i)=>{if(i%2===0)d.open=true});
  document.querySelectorAll('.book fieldset').forEach(f=>f.querySelector('input')?.click());return 1})()`;

async function tab() {
  const t = await (await fetch('http://127.0.0.1:9334/json/new?about:blank', {method: 'PUT'})).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); let id = 0; const P = {};
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && P[m.id]) P[m.id](m.result || m); };
  await new Promise(r => ws.onopen = r);
  const send = (m, p = {}) => new Promise(r => { const i = ++id; P[i] = r; ws.send(JSON.stringify({id: i, method: m, params: p})); });
  const ev = async x => (await send('Runtime.evaluate', {expression: x, returnByValue: true, awaitPromise: true})).result?.value;
  return {send, ev, close: async () => { ws.close(); await fetch('http://127.0.0.1:9334/json/close/' + t.id); }};
}

if (mode === 'save') {
  const snap = {};
  for (const path of PAGES) for (const state of ['default', 'interacted']) for (const mobile of [true, false]) {
    const T = await tab();
    await T.send('Network.setCacheDisabled', {cacheDisabled: true});
    await T.send('Emulation.setEmulatedMedia', {features: [{name: 'prefers-reduced-motion', value: 'reduce'}]});
    await T.send('Emulation.setDeviceMetricsOverride', {width: mobile ? 390 : 1280, height: 900, deviceScaleFactor: 1, mobile});
    await T.send('Page.enable'); await T.send('Page.navigate', {url: BASE + path}); await sleep(2200);
    await T.ev(`document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));document.querySelectorAll('.forecast').forEach(e=>e.classList.add('fc-wait'));document.fonts.ready.then(()=>1)`);
    if (state === 'interacted') await T.ev(INTERACT);
    for (const w of WIDTHS.filter(w => mobile ? w < 800 : w >= 800)) {
      await T.send('Emulation.setDeviceMetricsOverride', {width: w, height: 900, deviceScaleFactor: 1, mobile});
      await sleep(150);
      snap[`${path} ${state} ${w}`] = await T.ev(MEASURE);
    }
    await T.close();
  }
  fs.mkdirSync(DIR, {recursive: true});
  fs.writeFileSync(DIR + a + '.json', JSON.stringify(snap));
  console.log('saved', a, Object.keys(snap).length, 'views,', Object.values(snap).reduce((n, v) => n + v.length, 0), 'element records');
} else if (mode === 'compare') {
  const A = JSON.parse(fs.readFileSync(DIR + a + '.json')), B = JSON.parse(fs.readFileSync(DIR + b + '.json'));
  let diffs = 0;
  for (const k in A) {
    const x = A[k], y = B[k] || [];
    if (x.length !== y.length) { console.log('ELEMENT COUNT', k, x.length, y.length); diffs++; continue; }
    for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) {
      if (++diffs <= 15) {
        const xa = x[i].split('|'), ya = y[i].split('|');
        const changed = PROPS.map((p, j) => xa[j] !== ya[j] ? `${p}: ${xa[j]} -> ${ya[j]}` : null).filter(Boolean);
        console.log(k, x[i].split(' ')[0], x[i].split(' ')[1] !== y[i].split(' ')[1] ? `moved ${x[i].split(' ')[1]} -> ${y[i].split(' ')[1]}` : '', changed.slice(0, 4).join('; ').slice(0, 300));
      }
    }
  }
  console.log(diffs ? `\n${diffs} differences` : '\nIDENTICAL: no element changed position or style');
  process.exit(diffs ? 1 : 0);
}
