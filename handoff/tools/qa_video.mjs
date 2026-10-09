// Drone video at the closing section ("See you in the water."): scrolls down like a person (mouse-wheel steps, no jumps)
// and checks the video really plays (time moves), pauses when scrolled away, plays again on the way back, also plays with
// "reduce motion", and a tap on the video pauses it. English and Spanish, phone and desktop. Then the fallbacks:
// a 3G connection gets the light file, and when the browser blocks autoplay (openly or silently) the animated
// image takes the video's place in the same box.
//   node tests/qa_video.mjs                 (local site on :8770)
//   QA_BASE=https://... node tests/qa_video.mjs   (any other copy, e.g. the online preview)
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8770';
const sleep = ms => new Promise(r => setTimeout(r, ms));
let fails = 0;
const check = (name, ok, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  · ' + detail : ''}`); if (!ok) fails++; };

async function open(path, w, reduce, init = '') {
  const t = await (await fetch('http://127.0.0.1:9334/json/new?about:blank', {method: 'PUT'})).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); let id = 0; const P = {};
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && P[m.id]) P[m.id](m.result || m); };
  await new Promise(r => ws.onopen = r);
  const send = (m, p = {}) => new Promise(r => { const i = ++id; P[i] = r; ws.send(JSON.stringify({id: i, method: m, params: p})); });
  await send('Network.setCacheDisabled', {cacheDisabled: true});
  await send('Emulation.setEmulatedMedia', {features: [{name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference'}]});
  await send('Emulation.setDeviceMetricsOverride', {width: w, height: w < 800 ? 844 : 900, deviceScaleFactor: 1, mobile: w < 800});
  await send('Page.enable'); await send('Page.bringToFront');
  if (init) await send('Page.addScriptToEvaluateOnNewDocument', {source: init});
  await send('Page.navigate', {url: BASE + path}); await sleep(2500);
  const ev = async x => (await send('Runtime.evaluate', {expression: x, returnByValue: true, awaitPromise: true})).result?.value;
  const wheel = async dy => send('Input.dispatchMouseEvent', {type: 'mouseWheel', x: w / 2, y: 400, deltaX: 0, deltaY: dy});
  // scroll with the wheel until the closing section is on screen (or back up to the top)
  const scrollTo = async (target) => {
    for (let i = 0; i < 400; i++) {
      const s = await ev(`(()=>{const r=document.querySelector('.closing').getBoundingClientRect();return {top:r.top,bottom:r.bottom,y:scrollY}})()`);
      if (target === 'closing' && s.top < innerHeightGuess(w) * 0.4) return i;
      if (target === 'top' && s.y < 50) return i;
      await wheel(target === 'closing' ? 300 : -600); await sleep(60);
    }
    return -1;
  };
  const state = () => ev(`(()=>{const v=document.querySelector('.closing video');return {paused:v.paused,t:+v.currentTime.toFixed(2),ready:v.readyState,poster:!!v.poster,src:v.currentSrc.split('/').pop()}})()`);
  return {ev, scrollTo, state, close: async () => { ws.close(); await fetch('http://127.0.0.1:9334/json/close/' + t.id); }};
}
const innerHeightGuess = w => (w < 800 ? 844 : 900);

for (const path of ['/', '/es/']) for (const w of [390, 1280]) {
  const name = `${path} ${w < 800 ? 'phone' : 'desktop'}`;
  const T = await open(path, w, false);
  const atTop = await T.state();
  check(`${name}: nothing loads at the top of the page`, atTop.paused && !atTop.poster && atTop.ready === 0, JSON.stringify(atTop));
  const steps = await T.scrollTo('closing');
  await sleep(1500);
  const a = await T.state(); await sleep(1500); const b = await T.state();
  check(`${name}: plays once scrolled to "See you in the water."`, steps > 0 && !b.paused && b.t > a.t && b.ready >= 3, `${steps} wheel steps · time ${a.t}s → ${b.t}s · ${b.src}`);
  check(`${name}: still image is set as the fallback`, b.poster);
  await T.scrollTo('top'); await sleep(1200);
  const c = await T.state();
  check(`${name}: pauses when scrolled away`, c.paused, JSON.stringify(c));
  await T.scrollTo('closing'); await sleep(1500);
  const d = await T.state(); await sleep(1000); const e = await T.state();
  check(`${name}: plays again when scrolled back`, !e.paused && e.t > d.t, `time ${d.t}s → ${e.t}s`);
  const tapped = await T.ev(`(async()=>{const c=document.querySelector('.closing');c.dispatchEvent(new MouseEvent('click',{bubbles:true}));await new Promise(r=>setTimeout(r,400));const v=document.querySelector('.closing video');const paused=v.paused;c.dispatchEvent(new MouseEvent('click',{bubbles:true}));await new Promise(r=>setTimeout(r,800));return {pausedAfterTap:paused,playingAfterSecondTap:!v.paused,button:!!document.querySelector('.loop-play')}})()`);
  check(`${name}: a tap on the video pauses it, another plays it, no button`, tapped.pausedAfterTap && tapped.playingAfterSecondTap && !tapped.button, JSON.stringify(tapped));
  await T.close();
}
for (const path of ['/', '/es/']) {
  const T = await open(path, 390, true);
  await T.scrollTo('closing'); await sleep(2000);
  const a = await T.state(); await sleep(1200); const b = await T.state();
  check(`${path} reduced motion: the video still plays by itself`, !b.paused && b.t > a.t, `time ${a.t}s → ${b.t}s`);
  await T.close();
}

// fallbacks (phone, English and Spanish)
const BLOCKED = `HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException('blocked', 'NotAllowedError')); };`;
const SILENT = `HTMLMediaElement.prototype.play = function () { return Promise.resolve(); };`;
const G3 = `Object.defineProperty(navigator, 'connection', {value: {effectiveType: '3g', saveData: false}});`;
const box = `(()=>{const c=document.querySelector('.closing').getBoundingClientRect();const v=document.querySelector('.closing .bg');const r=v&&v.getBoundingClientRect();
  const img=document.querySelector('.closing img.bg');
  return {tag:v&&v.tagName, video:!!document.querySelector('.closing video'), img:!!img, loaded:!!img&&img.complete&&img.naturalWidth>0,
    src:img?img.src.split('/').pop():'', fills:!!r&&Math.abs(r.width-c.width)<2&&Math.abs(r.height-c.height)<2, fit:v&&getComputedStyle(v).objectFit}})()`;
for (const path of ['/', '/es/']) {
  for (const [label, init] of [['autoplay blocked', BLOCKED], ['autoplay blocked silently', SILENT]]) {
    const T = await open(path, 390, false, init);
    const top = await T.ev(`!!document.querySelector('.closing img.bg') || performance.getEntriesByType('resource').some(r=>/drone-loop\.webp/.test(r.name))`);
    await T.scrollTo('closing'); await sleep(label.includes('silently') ? 4000 : 2000);
    const s = await T.ev(box);
    check(`${path} ${label}: the animated image takes the video's place`, !top && s.img && s.loaded && !s.video && s.src === 'drone-loop.webp' && s.fills && s.fit === 'cover', JSON.stringify(s));
    await T.close();
  }
  const T = await open(path, 390, false, G3);
  await T.scrollTo('closing'); await sleep(1500);
  const a = await T.state(); await sleep(1200); const b = await T.state();
  check(`${path} 3G: plays the light file`, !b.paused && b.t > a.t && b.src === 'drone-loop-light.mp4' && !(await T.ev(`!!document.querySelector('.closing img.bg')`)), JSON.stringify(b));
  await T.close();
}
const D = await open('/', 1280, false, G3);
await D.scrollTo('closing'); await sleep(1500);
const ds = await D.state();
check('/ desktop on 3G: still plays the sharp file', !ds.paused && ds.src === 'drone-loop.mp4', JSON.stringify(ds));
await D.close();

console.log(fails ? `\n${fails} FAILED` : '\nALL PASS');
process.exit(fails ? 1 : 0);
