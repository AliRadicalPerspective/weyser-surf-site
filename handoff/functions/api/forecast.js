// Cloudflare Pages Function: GET /api/forecast (optional, see README "The surf report").
// Fetches tomorrow's surf forecast from Open-Meteo once and keeps it for an hour at Cloudflare's edge, so every visitor
// gets the cached copy: about 24 calls a day to Open-Meteo instead of one per visit. Returns exactly Open-Meteo's JSON,
// so site-v5.js reads it the same way. If Open-Meteo is down, it answers 502 and the page asks Open-Meteo directly.
const SOURCE = 'https://marine-api.open-meteo.com/v1/marine?latitude=9.64&longitude=-85.17' +
  '&daily=wave_height_max,wave_period_max,wave_direction_dominant' +
  '&hourly=sea_surface_temperature&timezone=America%2FCosta_Rica&forecast_days=2';   // the same address as site-v5.js
const KEEP = 3600;   // seconds

export async function onRequestGet(context) {
  const cache = caches.default;
  const key = new Request(new URL('/api/forecast', context.request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;
  let data;
  try {
    const r = await fetch(SOURCE, { cf: { cacheTtl: KEEP } });
    if (!r.ok) throw new Error('Open-Meteo ' + r.status);
    data = await r.text();
    JSON.parse(data);   // only cache a real answer
  } catch (e) {
    return new Response(JSON.stringify({ error: 'forecast unavailable' }), { status: 502, headers: { 'content-type': 'application/json' } });
  }
  const res = new Response(data, { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': `public, max-age=${KEEP}` } });
  context.waitUntil(cache.put(key, res.clone()));
  return res;
}
