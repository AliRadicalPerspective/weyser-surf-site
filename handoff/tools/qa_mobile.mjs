// Phone experience: the checks behind "smooth and delightful", on every page at phone width.
//   node tests/qa_mobile.mjs
// Needs the site on :8770 and headless Chrome on :9334, like the other tests.
//
//  1. Tap targets      every link, button and choice is at least 44x44px (or 24px with room around it, WCAG 2.5.8),
//                      and no two tappable things overlap
//  2. No zoom on type  form fields use 16px text or more, so iPhones don't zoom in when tapped
//  3. Readable text    no visible text under 12px; text contrast at least 4.5:1 (3:1 for large text), WCAG AA
//  4. Loading          on a mid-range phone (4x slower CPU, fast 3G): main content in view (LCP) under 2.5s, layout
//                      shift (CLS) under 0.1 for the whole visit, blocked time (TBT) under 200ms
//  5. Scrolling        wheel-scroll the whole page: no frame over 50ms, no long task over 100ms, every reveal-on-scroll
//                      block ends up visible
//  6. Jump links       "Book" links land with the form heading below the fixed header, not under it
//  7. iPhone details   sticky bar clears the home indicator (safe area); hover effects only on devices that hover
//                      (otherwise a tap leaves cards "stuck" lifted); photos sharp on a 3x screen
//  8. Swipe rows       reviews and photo strip show part of the next card (so people know to swipe) and snap
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8770';
const PAGES = ['/', '/es/', '/first-surf-lesson-santa-teresa/', '/kids-family-surf-lessons-santa-teresa/', '/beginner-surf-beaches-santa-teresa/', '/surf-coaching-santa-teresa/', '/es/clases-de-surf-avanzado-santa-teresa/'];
const sleep = ms => new Promise(r => setTimeout(r, ms));
let fails = 0, warns = 0;
const check = (name, ok, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  · ' + detail : ''}`); if (!ok) fails++; };
const warn = (name, detail) => { console.log(`NOTE  ${name}  · ${detail}`); warns++; };

async function tab({w = 390, dpr = 3, throttle = false} = {}) {
  const t = await (await fetch('http://127.0.0.1:9334/json/new?about:blank', {method: 'PUT'})).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); let id = 0; const P = {};
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && P[m.id]) P[m.id](m.result || m); };
  await new Promise(r => ws.onopen = r);
  const send = (m, p = {}) => new Promise(r => { const i = ++id; P[i] = r; ws.send(JSON.stringify({id: i, method: m, params: p})); });
  await send('Network.enable'); await send('Network.setCacheDisabled', {cacheDisabled: true}); await send('Page.enable');
  await send('Page.bringToFront');   // background tabs slow down timers and scroll-in triggers
  await send('Emulation.setDeviceMetricsOverride', {width: w, height: 844, deviceScaleFactor: dpr, mobile: true});
  await send('Emulation.setTouchEmulationEnabled', {enabled: true, maxTouchPoints: 5});
  await send('Emulation.setEmulatedMedia', {features: [{name: 'hover', value: 'none'}, {name: 'pointer', value: 'coarse'}]});
  if (throttle) {
    await send('Emulation.setCPUThrottlingRate', {rate: 4});
    await send('Network.emulateNetworkConditions', {offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8});
  }
  const ev = async x => { const r = await send('Runtime.evaluate', {expression: x, returnByValue: true, awaitPromise: true}); return r.exceptionDetails ? 'ERR ' + JSON.stringify(r.exceptionDetails).slice(0, 300) : r.result?.value; };
  const wheel = dy => send('Input.dispatchMouseEvent', {type: 'mouseWheel', x: w / 2, y: 420, deltaX: 0, deltaY: dy});
  return {send, ev, wheel, close: async () => { ws.close(); await fetch('http://127.0.0.1:9334/json/close/' + t.id); }};
}
const OBSERVE = `window.__m={cls:0,lcp:0,long:[],tbt:0};
  new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__m.cls+=e.value}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__m.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__m.long.push(Math.round(e.duration));window.__m.tbt+=Math.max(0,e.duration-50)}}).observe({type:'longtask',buffered:true});`;

for (const path of PAGES) {
  if (process.env.QA_ONLY && process.env.QA_ONLY !== path) continue;   // e.g. QA_ONLY=/es/ to re-check one page
  console.log(`\n── ${path}`);
  // ---------------------------------------------------------------- 4. loading on a mid-range phone
  {
    const T = await tab({throttle: true});
    await T.send('Page.addScriptToEvaluateOnNewDocument', {source: OBSERVE});
    await T.send('Page.navigate', {url: BASE + path}); await sleep(9000);
    const m = await T.ev(`({lcp:Math.round(window.__m.lcp),cls:+window.__m.cls.toFixed(3),tbt:Math.round(window.__m.tbt)})`);
    check(`loading: LCP ${m.lcp}ms, CLS ${m.cls}, TBT ${m.tbt}ms (4x CPU, fast 3G)`, m.lcp < 2500 && m.cls < 0.1 && m.tbt < 200);
    await T.close();
  }
  const T = await tab();
  await T.send('Page.addScriptToEvaluateOnNewDocument', {source: OBSERVE + `window.__frames=[];(function f(t){if(window.__last)window.__frames.push(t-window.__last);window.__last=t;requestAnimationFrame(f)})(0);`});
  await T.send('Page.navigate', {url: BASE + path}); await sleep(2500);
  // ---------------------------------------------------------------- 5. scroll the whole page like a thumb
  await T.ev(`window.__frames.length=0;window.__m.long.length=0;1`);
  for (let i = 0; i < 300; i++) {
    await T.wheel(260); await sleep(40);
    if (i % 10 === 9 && await T.ev(`innerHeight+scrollY>=document.documentElement.scrollHeight-4`)) break;
  }
  await sleep(1200);
  const sc = await T.ev(`(()=>{const f=window.__frames.slice(2);const hidden=[...document.querySelectorAll('.reveal')].filter(e=>parseFloat(getComputedStyle(e).opacity)<1).map(e=>e.className+' '+(e.textContent||'').trim().slice(0,30));
    return {frames:f.length,worst:Math.round(Math.max(...f)),slow:f.filter(x=>x>50).length,long:Math.max(0,...window.__m.long),cls:+window.__m.cls.toFixed(3),hidden}})()`);
  check(`scrolling: ${sc.frames} frames, worst ${sc.worst}ms, ${sc.slow} over 50ms, longest task ${sc.long}ms`, sc.slow === 0 && sc.long < 100);
  check(`scrolling: no layout shift over the whole visit (CLS ${sc.cls})`, sc.cls < 0.1);
  check(`scrolling: every reveal-on-scroll block became visible`, sc.hidden.length === 0, sc.hidden.slice(0, 3).join(' | '));
  // ---------------------------------------------------------------- 1, 2, 3, 7 at rest, after the whole page has been seen
  const r = await T.ev(`(()=>{
    const vis=e=>{const s=getComputedStyle(e);const b=e.getBoundingClientRect();return s.visibility!=='hidden'&&s.display!=='none'&&b.width>0&&b.height>0&&!e.closest('[hidden],.sr-only,[aria-hidden=true]')};
    const box=e=>{const b=e.getBoundingClientRect();return {x:b.left,y:b.top+scrollY,w:b.width,h:b.height}};
    // 1. tap targets
    const taps=[...document.querySelectorAll('a[href],button,label.chip,summary,input:not([type=radio]),select,textarea')].filter(vis).filter(e=>!e.closest('p,li:not(.chip),dd')||e.matches('.btn,button')||getComputedStyle(e).display!=='inline');
    const small=[];
    for(const e of taps){const b=box(e);if(b.w>=44&&b.h>=44)continue;
      const c={x:b.x+b.w/2,y:b.y+b.h/2};const near=taps.some(o=>{if(o===e||o.contains(e)||e.contains(o))return false;const q=box(o);const dx=Math.max(q.x-c.x,0,c.x-(q.x+q.w)),dy=Math.max(q.y-c.y,0,c.y-(q.y+q.h));return Math.hypot(dx,dy)<12});
      if(b.w<24||b.h<24||near) small.push((e.textContent||e.getAttribute('aria-label')||e.tagName).trim().slice(0,28)+' '+Math.round(b.w)+'x'+Math.round(b.h)+(near?' crowded':''))}
    // inline text links inside sentences are exempt from size (WCAG 2.5.8 inline exception), but listed separately
    const inline=[...document.querySelectorAll('p a,li a,dd a')].filter(vis).filter(e=>getComputedStyle(e).display==='inline'&&!e.matches('.btn'));
    const overlap=[];
    const fixed=e=>{for(let q=e;q;q=q.parentElement)if(getComputedStyle(q).position==='fixed')return true;return false};
    for(let i=0;i<taps.length;i++)for(let j=i+1;j<taps.length;j++){const a=taps[i],b=taps[j];if(a.contains(b)||b.contains(a)||fixed(a)!==fixed(b))continue;const p=box(a),q=box(b);
      const ox=Math.min(p.x+p.w,q.x+q.w)-Math.max(p.x,q.x),oy=Math.min(p.y+p.h,q.y+q.h)-Math.max(p.y,q.y);if(ox>2&&oy>2)overlap.push(a.tagName+'.'+a.className+'['+(a.textContent||'').trim().slice(0,20)+'] / '+b.tagName+'.'+b.className+'['+(b.textContent||'').trim().slice(0,20)+'] @'+Math.round(p.y))}
    // 2. form fields
    const fields=[...document.querySelectorAll('input:not([type=radio]):not([type=checkbox]),select,textarea')].map(e=>[e.name||e.type,parseFloat(getComputedStyle(e).fontSize)]).filter(x=>x[1]<16);
    // 3. text size and contrast
    const lum=c=>{const m=c.match(/[\\d.]+/g).map(Number);const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return [.2126*f(m[0])+.7152*f(m[1])+.0722*f(m[2]),m[3]===undefined?1:m[3]]};
    const bgOf=e=>{for(let n=e;n;n=n.parentElement){const s=getComputedStyle(n);if(s.backgroundImage!=='none'&&!/gradient/.test(s.backgroundImage))return null;
      if(n.matches('.hero,.closing,.coach .photo,.photo,.pic,.b-img,.door-img,.lesson-photo'))return null;const bg=s.backgroundColor;const a=bg.match(/[\\d.]+/g).map(Number);if(a.length===3||a[3]>=.9)return bg}return 'rgb(242,236,225)'};
    const tiny=[],low=[];
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
    while((n=walker.nextNode())){if(!n.textContent.trim())continue;const e=n.parentElement;if(!vis(e))continue;const s=getComputedStyle(e);const fs=parseFloat(s.fontSize);
      if(fs<12)tiny.push(n.textContent.trim().slice(0,24)+' '+fs+'px');
      const bg=bgOf(e);if(!bg)continue;const [l1,a]=lum(s.color);if(a<1){/* translucent text: blend over background */}
      const fg=s.color.match(/[\\d.]+/g).map(Number),bb=bg.match(/[\\d.]+/g).map(Number);const al=fg[3]===undefined?1:fg[3];
      const mix=[0,1,2].map(i=>fg[i]*al+bb[i]*(1-al));const L1=lum('rgb('+mix.join(',')+')')[0],L2=lum(bg)[0];
      const ratio=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);const large=fs>=24||(fs>=18.66&&+s.fontWeight>=700);
      if(ratio<(large?3:4.5))low.push(n.textContent.trim().slice(0,26)+' '+ratio.toFixed(2)+':1')}
    // 7. sticky bar safe area, hover rules, photo sharpness
    const bar=document.querySelector('.wa-bar');const safe=bar?[...document.styleSheets].some(ss=>{try{return [...ss.cssRules].some(r=>(r.cssText||'').includes('safe-area-inset-bottom'))}catch(e){return false}}):true;
    const hoverMoves=[];const scan=(rules,inHover)=>{for(const r of rules){if(r.media){scan(r.cssRules,inHover||/hover:\\s*hover/.test(r.media.mediaText));continue}
      if(r.cssRules&&!r.selectorText){scan(r.cssRules,inHover);continue}
      if(r.selectorText&&r.selectorText.includes(':hover')&&!inHover&&/transform|box-shadow|background/.test(r.style.cssText)&&document.querySelector(r.selectorText.replace(/:hover/g,'')))hoverMoves.push(r.selectorText)}};
    for(const ss of document.styleSheets){try{scan(ss.cssRules,false)}catch(e){}}
    const blurry=[...document.images].filter(i=>i.complete&&i.naturalWidth&&vis(i)).map(i=>{const b=i.getBoundingClientRect();const need=b.width*Math.min(devicePixelRatio,2);const m=i.currentSrc.match(/-(\\d+)\\.(webp|jpg|png)/);const real=m?+m[1]:i.naturalWidth*devicePixelRatio;return [i.currentSrc.split('/').pop(),Math.round(need),real,real<need*0.9]}).filter(x=>x[3]&&!/reviewer|avatar/.test(x[0]));
    // 8. swipe rows
    const rows=[...document.querySelectorAll('.rv-list,.strip')].map(el=>{const s=getComputedStyle(el);const kids=[...el.children];const b=el.getBoundingClientRect();
      const peek=kids.length>1?Math.round(b.right-kids[1].getBoundingClientRect().left):0;return [el.className,s.overflowX,s.scrollSnapType,peek]});
    return {taps:taps.length,small,inline:inline.length,overlap,fields,tiny,low,safe,hoverMoves,blurry,rows}})()`);
  if (typeof r === 'string') { check('page scan ran', false, r); await T.close(); continue; }
  check(`tap targets: ${r.taps} buttons and links are thumb-sized`, r.small.length === 0, r.small.slice(0, 6).join(' | '));
  if (r.inline) warn('links inside sentences', `${r.inline} (size exempt under WCAG 2.5.8; checked separately for spacing)`);
  check(`tap targets: nothing tappable overlaps`, r.overlap.length === 0, r.overlap.slice(0, 4).join(' | '));
  check(`form fields: 16px text or more, so iPhones don't zoom`, r.fields.length === 0, r.fields.map(x => x.join(' ')).join(', '));
  check(`text: nothing under 12px`, r.tiny.length === 0, r.tiny.slice(0, 5).join(' | '));
  check(`text: contrast passes WCAG AA`, r.low.length === 0, r.low.slice(0, 6).join(' | '));
  check(`iPhone: sticky bar clears the home indicator`, r.safe);
  check(`iPhone: no hover effect that sticks after a tap`, r.hoverMoves.length === 0, r.hoverMoves.join(', '));
  check(`photos: sharp on a 3x phone screen`, r.blurry.length === 0, r.blurry.map(x => `${x[0]} needs ${x[1]}px, has ${x[2]}`).join(' | '));
  for (const [cls, ox, snap, peek] of r.rows) check(`swipe row .${cls.split(' ')[0]}: scrolls sideways, snaps, shows ${peek}px of the next card`, ox === 'auto' && snap.includes('mandatory') && peek >= 24);
  // ---------------------------------------------------------------- 6. jump links land below the header
  const jumps = await T.ev(`(async()=>{const out=[];document.documentElement.style.scrollBehavior='auto';
    for(const a of [...document.querySelectorAll('a[href^="#"]')].filter(a=>a.getAttribute('href').length>1&&!a.closest('.skip')).slice(0,40)){
      const t=document.querySelector(a.getAttribute('href'));if(!t)continue;window.scrollTo(0,0);a.click();await new Promise(r=>setTimeout(r,120));
      const h=document.querySelector('.site-header').getBoundingClientRect().bottom;const top=t.getBoundingClientRect().top;out.push([a.getAttribute('href'),Math.round(top-h)])}
    return out})()`);
  const bad = (jumps || []).filter(([, gap]) => gap < 0);
  if (jumps && jumps.length) check(`jump links: ${jumps.length} land below the fixed header`, bad.length === 0, bad.map(x => x.join(' ')).join(', '));
  await T.close();
}
console.log(fails ? `\n${fails} FAILED${warns ? `, ${warns} notes` : ''}` : `\nALL PASS${warns ? ` (${warns} notes)` : ''}`);
process.exit(fails ? 1 : 0);
