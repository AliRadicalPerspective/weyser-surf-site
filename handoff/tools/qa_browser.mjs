// Real-browser QA for the handoff site: every page x every width.
// Checks sideways overflow, elements off-screen, script errors, failed requests, broken images, buttons that wrap or clip,
// and the sticky bar / header button rules (phones: bar, 860px+: header button).
// Needs: the site served on :8770 (python3 -m http.server 8770 --directory weyser-handoff/site), or set QA_BASE
//        and headless Chrome with --remote-debugging-port=9334. Run: node tests/qa_browser.mjs
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8770';   // the "weyser-site" preview in .claude/launch.json
try { const r = await fetch(BASE + '/'); if (!r.ok) throw new Error(r.status); }
catch (e) { console.error(`No site at ${BASE} (${e.message}). Start it first: python3 tools/serve.py 8770 site (or tests/serve.py 8770 weyser-handoff/site)`); process.exit(2); }
const PAGES = ['/', '/es/', '/first-surf-lesson-santa-teresa/', '/kids-family-surf-lessons-santa-teresa/', '/beginner-surf-beaches-santa-teresa/',
               '/surf-coaching-santa-teresa/', '/es/clases-de-surf-avanzado-santa-teresa/'];
const WIDTHS = [[320,640,1],[375,812,1],[390,844,1],[768,1024,1],[1024,768,0],[1280,800,0],[1440,900,0]];
const IGNORE = /api\/forecast|favicon|apple-touch|site\.webmanifest/;   // only exist on the live server
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function tab() {
  const t = await (await fetch('http://127.0.0.1:9334/json/new?about:blank', {method:'PUT'})).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); let id = 0; const P = {}; const events = [];
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && P[m.id]) P[m.id](m.result || m); else if (m.method) events.push(m); };
  await new Promise(r => ws.onopen = r);
  const send = (m, p={}) => new Promise(r => { const i = ++id; P[i] = r; ws.send(JSON.stringify({id:i, method:m, params:p})); });
  const ev = async x => { const r = await send('Runtime.evaluate', {expression:x, awaitPromise:true, returnByValue:true}); return r.exceptionDetails ? {ERR: r.exceptionDetails.exception?.description?.slice(0,200)} : r.result?.value; };
  return {ws, send, ev, events, id: t.id};
}
const problems = []; let n = 0;
for (const path of PAGES) for (const [w,h,mob] of WIDTHS) {
  if (process.env.QA_ONLY && process.env.QA_ONLY !== `${path}@${w}`) continue;   // e.g. QA_ONLY=/@1280 to re-check one view
  n++; if (process.env.QA_VERBOSE) console.error(n, path, w);
  // headless Chrome sometimes stops answering in a long run; each view gets 40s and one retry, so a stall can't freeze the test
  for (let attempt = 1; attempt <= 2; attempt++) {
    let T;
    const run = (async () => {
  T = await tab();
  await T.send('Emulation.setDeviceMetricsOverride', {width:w, height:h, deviceScaleFactor:1, mobile:!!mob});
  await T.send('Page.bringToFront');   // background tabs slow their timers right down, and the scroll loop below uses them
  await T.send('Page.enable'); await T.send('Runtime.enable'); await T.send('Network.enable'); await T.send('Network.setCacheDisabled', {cacheDisabled:true});
  await T.send('Page.navigate', {url: BASE + path}); await sleep(2500);
  const r = await T.ev(`(async () => {
    document.documentElement.style.scrollBehavior='auto';
    document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading='eager');
    for (let y=0; y<document.body.scrollHeight; y+=500) { scrollTo(0,y); await new Promise(r=>setTimeout(r,60)); }
    await new Promise(r=>setTimeout(r,1200));
    const vw = document.documentElement.clientWidth, res = {};   // not innerWidth: a phone widens innerWidth to fit anything too wide
    res.overflow = document.documentElement.scrollWidth - vw;
    res.wide = [...document.querySelectorAll('body *')].filter(e => { const b=e.getBoundingClientRect(); if (!b.width || getComputedStyle(e).position==='fixed' || e.closest('.skip,.sr-only')) return false;   // the skip link waits off-screen on purpose
        let p=e.parentElement; while(p && p!==document.body){ const o=getComputedStyle(p).overflowX; if(o==='auto'||o==='scroll'||o==='hidden') return false; p=p.parentElement }   // body's overflow-x:hidden doesn't stop a phone from widening the page
        return b.right > vw+1 || b.left < -1; }).slice(0,4).map(e => e.tagName+'.'+(e.className||'').toString().slice(0,30));
    res.brokenImg = [...document.images].filter(i => i.complete && i.naturalWidth===0).map(i=>i.currentSrc||i.src).slice(0,4);
    res.btnWrap = [...document.querySelectorAll('.btn, .head-cta')].filter(b => b.offsetParent && b.getBoundingClientRect().height > 72).map(b=>b.textContent.trim().slice(0,30));
    const bar = document.querySelector('.wa-bar'), hc = document.querySelector('.head-cta');
    scrollTo(0, document.body.scrollHeight*0.3); await new Promise(r=>setTimeout(r,700));
    res.bar = bar ? (getComputedStyle(bar).display==='none' ? 'hidden' : 'visible') : 'none';
    res.headCta = hc ? getComputedStyle(hc).display!=='none' : null;
    return res; })()`);
  const errs = T.events.filter(e => e.method==='Runtime.exceptionThrown').map(e => e.params.exceptionDetails.exception?.description?.slice(0,120));
  const failed = T.events.filter(e => (e.method==='Network.responseReceived' && e.params.response.status>=400))
     .map(e => e.params.response.status+' '+e.params.response.url).filter(x => !IGNORE.test(x));
  const desk = w >= 860;
  const bad = r.ERR || r.overflow>0 || r.wide.length || r.brokenImg.length || r.btnWrap.length || errs.length || failed.length
      || (desk ? (r.bar!=='hidden' || r.headCta===false) : r.bar!=='visible');
  if (bad) problems.push({path, w, ...r, errs, failed});
  T.ws.close(); await fetch('http://127.0.0.1:9334/json/close/'+T.id);
    })();
    if (await Promise.race([run.then(() => true), sleep(40000).then(() => false)])) break;
    try { T && T.ws.close(); T && await fetch('http://127.0.0.1:9334/json/close/' + T.id); } catch (e) {}
    if (attempt === 2) problems.push({path, w, ERR: 'no answer from the browser twice (40s each)'});
    else if (process.env.QA_VERBOSE) console.error('  retrying', path, w);
  }
}
console.log(`checked ${n} page/width combinations: ${problems.length ? problems.length + ' with problems' : 'no problems'}`);
problems.forEach(p => console.log(JSON.stringify(p)));
process.exit(problems.length ? 1 : 0);
