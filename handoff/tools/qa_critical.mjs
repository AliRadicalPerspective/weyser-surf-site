// First screen without the stylesheet: proves the inline first-screen styles (<style id="critical">) are complete.
// For every page and width, the first screen is drawn twice: normally, and with site-v5.css blocked entirely.
// Every element visible on the first screen must have the same position and style both times.
//   node tests/qa_critical.mjs
// Needs the site on :8770 and headless Chrome on :9334, like the other tests.
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8770';
const PAGES = ['/', '/es/', '/first-surf-lesson-santa-teresa/', '/kids-family-surf-lessons-santa-teresa/', '/beginner-surf-beaches-santa-teresa/', '/surf-coaching-santa-teresa/', '/es/clases-de-surf-avanzado-santa-teresa/'];
const WIDTHS = [[320, 640], [375, 812], [390, 844], [414, 896], [600, 960], [768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]];
const PROPS = ['display', 'position', 'color', 'background-color', 'background-image', 'font-family', 'font-size', 'font-weight', 'line-height',
  'letter-spacing', 'text-transform', 'border-top-left-radius', 'box-shadow', 'opacity', 'visibility', 'padding-top', 'padding-left', 'margin-top', 'z-index'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SNAP = `(()=>{const H=innerHeight,out=[];for(const e of document.querySelectorAll('body *')){const b=e.getBoundingClientRect();
  if(!(b.width||b.height)||b.top>=H||b.bottom<=0)continue;const s=getComputedStyle(e);
  out.push(e.tagName+'.'+[...e.classList].join('.')+' @'+[b.x,b.y,b.width,b.bottom<=H?b.height:'(runs below the first screen)'].map(v=>typeof v==='number'?Math.round(v):v)+' '+${JSON.stringify(PROPS)}.map(p=>s.getPropertyValue(p)).join('|'))}
  return out})()`;
async function shot(path, w, h, block) {
  const t = await (await fetch('http://127.0.0.1:9334/json/new?about:blank', {method: 'PUT'})).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); let id = 0; const P = {};
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && P[m.id]) P[m.id](m.result || m); };
  await new Promise(r => ws.onopen = r);
  const send = (m, p = {}) => new Promise(r => { const i = ++id; P[i] = r; ws.send(JSON.stringify({id: i, method: m, params: p})); });
  await send('Page.bringToFront'); await send('Network.enable'); await send('Network.setCacheDisabled', {cacheDisabled: true});
  if (block) await send('Network.setBlockedURLs', {urls: ['*site-v5.css*']});
  await send('Emulation.setEmulatedMedia', {features: [{name: 'prefers-reduced-motion', value: 'reduce'}]});   // no animation timing differences
  await send('Emulation.setDeviceMetricsOverride', {width: w, height: h, deviceScaleFactor: 1, mobile: w < 800});
  await send('Page.navigate', {url: BASE + path}); await sleep(2200);
  await send('Runtime.evaluate', {expression: "document.querySelectorAll('.forecast').forEach(e=>e.classList.add('fc-wait'));1"});
  const r = await send('Runtime.evaluate', {returnByValue: true, expression: SNAP});
  ws.close(); await fetch('http://127.0.0.1:9334/json/close/' + t.id);
  return r.result.value;
}
let bad = 0, views = 0, els = 0;
for (const path of PAGES) for (const [w, h] of WIDTHS) {
  const a = await shot(path, w, h, false), b = await shot(path, w, h, true);
  views++; els += a.length;
  const diff = a.filter((x, i) => x !== b[i]);
  if (a.length !== b.length || diff.length) {
    bad++;
    console.log(`DIFF ${path} @${w}: ${a.length} vs ${b.length} elements`);
    for (let i = 0; i < Math.max(a.length, b.length) && i < 400; i++) if (a[i] !== b[i]) { console.log('   normal:  ', (a[i] || '').slice(0, 170)); console.log('   blocked: ', (b[i] || '').slice(0, 170)); break; }
  }
}
console.log(bad ? `\n${bad} of ${views} first screens differ` : `\nIDENTICAL: all ${views} first screens (${els} elements) look the same without the stylesheet`);
process.exit(bad ? 1 : 0);
