// Sync-Server für die Einkaufsliste: Cloudflare Worker mit D1-Datenbank (Bindung „DB“).
// Speichert je Raum einen verschlüsselten Datenblock mit Versionsnummer. Den Inhalt kann der Server nicht lesen;
// Schlüssel und Zusammenführen liegen in der App. Einrichtung: siehe ANLEITUNG.md.
//
//   GET    /r/<id>[?v=<version>]   → 200 { version, daten } | 200 { version, unveraendert: true } | 404
//   PUT    /r/<id>  { basis, daten } → 200 { version } | 409 { version, daten } (jemand war schneller) | 404
//   DELETE /r/<id>                 → 204
//   POST   /z  { geraet, sync }      → 204   Nutzungszähler: je Gerät und Tag eine Zeile (zufällige ID, sonst nichts)
//   GET    /statistik               → 200 { tage, geraete7, sync7, haushalte7, haushalte }   nur mit
//                                      „authorization: Bearer <STAT_TOKEN>“ (Worker-Secret), sonst 404

const ERLAUBT = ['https://ym52jyt288-sys.github.io', 'http://localhost:8765', 'http://127.0.0.1:8765'];
const MAX_BYTES = 1_000_000;
const ID = /^[A-Za-z0-9_-]{43}$/;
const ZAEHLER_ID = /^[A-Za-z0-9_-]{22}$/;
const TAG = 864e5;

export default {
  async fetch(anfrage, env) {
    try { return await bearbeite(anfrage, env); }
    catch (e) { return new Response(JSON.stringify({ fehler: 'Server' }), { status: 500, headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' } }); }
  },

  // Optional (Cron-Trigger, z. B. einmal pro Woche): Räume löschen, die drei Monate lang niemand benutzt hat
  async scheduled(_, env) {
    await env.DB.prepare('DELETE FROM raum WHERE geaendert < ?').bind(Date.now() - 90 * TAG).run();
    await env.DB.prepare('DELETE FROM besuch WHERE tag < ?').bind(tagVon(Date.now() - 400 * TAG)).run();
  },
};

const tagVon = ms => new Date(ms).toISOString().slice(0, 10);   // UTC-Datum „2026-09-29“

async function bearbeite(anfrage, env) {
  {
    const herkunft = anfrage.headers.get('origin') || '';
    const cors = {
      'access-control-allow-origin': ERLAUBT.includes(herkunft) ? herkunft : ERLAUBT[0],
      'access-control-allow-methods': 'GET, PUT, POST, DELETE, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'access-control-max-age': '86400',
      'vary': 'origin',
    };
    const antwort = (status, daten) => new Response(daten === undefined ? null : JSON.stringify(daten), {
      status, headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
    const pfadname = new URL(anfrage.url).pathname;

    // Statistik fürs Dashboard (statistik.html): von überall abrufbar, geschützt durch das Token
    if (pfadname === '/statistik') {
      const offen = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization', 'access-control-max-age': '86400' };
      if (anfrage.method === 'OPTIONS') return new Response(null, { status: 204, headers: offen });
      const json = (status, daten) => new Response(JSON.stringify(daten), { status, headers: { ...offen, 'content-type': 'application/json', 'cache-control': 'no-store' } });
      if (!env.STAT_TOKEN || anfrage.headers.get('authorization') !== `Bearer ${env.STAT_TOKEN}`) return json(404, { fehler: 'unbekannt' });
      return json(200, await statistik(env));
    }

    if (anfrage.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    if (pfadname === '/z' && anfrage.method === 'POST') {
      let body;
      try { body = JSON.parse(await anfrage.text()); } catch (e) { return antwort(400, { fehler: 'kein JSON' }); }
      if (!ZAEHLER_ID.test(body.geraet || '')) return antwort(400, { fehler: 'ungültig' });
      await env.DB.prepare('INSERT INTO besuch (tag, geraet, sync) VALUES (?, ?, ?) ON CONFLICT(tag, geraet) DO UPDATE SET sync = max(sync, excluded.sync)')
        .bind(tagVon(Date.now()), body.geraet, body.sync ? 1 : 0).run();
      return new Response(null, { status: 204, headers: cors });
    }

    const pfad = pfadname.match(/^\/r\/([^/]+)$/);
    if (!pfad || !ID.test(pfad[1])) return antwort(404, { fehler: 'unbekannt' });
    const id = pfad[1];
    const zeile = () => env.DB.prepare('SELECT version, daten FROM raum WHERE id = ?').bind(id).first();

    if (anfrage.method === 'GET') {
      const r = await zeile();
      if (!r) return antwort(404, { fehler: 'unbekannt' });
      const v = new URL(anfrage.url).searchParams.get('v');
      return v && Number(v) === r.version ? antwort(200, { version: r.version, unveraendert: true }) : antwort(200, r);
    }

    if (anfrage.method === 'PUT') {
      if (Number(anfrage.headers.get('content-length') || 0) > MAX_BYTES) return antwort(413, { fehler: 'zu groß' });
      const text = await anfrage.text();
      if (text.length > MAX_BYTES) return antwort(413, { fehler: 'zu groß' });
      let body;
      try { body = JSON.parse(text); } catch (e) { return antwort(400, { fehler: 'kein JSON' }); }
      const basis = Number(body.basis);
      if (!Number.isInteger(basis) || basis < 0 || typeof body.daten !== 'string' || !body.daten) return antwort(400, { fehler: 'ungültig' });
      const jetzt = Date.now();
      const erg = basis === 0
        ? await env.DB.prepare('INSERT INTO raum (id, version, daten, geaendert) VALUES (?, 1, ?, ?) ON CONFLICT(id) DO NOTHING').bind(id, body.daten, jetzt).run()
        : await env.DB.prepare('UPDATE raum SET version = version + 1, daten = ?, geaendert = ? WHERE id = ? AND version = ?').bind(body.daten, jetzt, id, basis).run();
      if (erg.meta.changes === 1) return antwort(200, { version: basis + 1 });
      const r = await zeile();
      return r ? antwort(409, r) : antwort(404, { fehler: 'unbekannt' });
    }

    if (anfrage.method === 'DELETE') {
      await env.DB.prepare('DELETE FROM raum WHERE id = ?').bind(id).run();
      return new Response(null, { status: 204, headers: cors });
    }
    return antwort(405, { fehler: 'Methode' });
  }
}

// Letzte 30 Tage je Tag, dazu eindeutige Geräte der letzten 7 Tage (ein Gerät an mehreren Tagen zählt einmal)
async function statistik(env) {
  const jetzt = Date.now(), ab30 = tagVon(jetzt - 29 * TAG), ab7 = tagVon(jetzt - 6 * TAG);
  const [tage, woche, raeume] = await env.DB.batch([
    env.DB.prepare('SELECT tag, COUNT(*) AS geraete, SUM(sync) AS sync FROM besuch WHERE tag >= ? GROUP BY tag ORDER BY tag').bind(ab30),
    env.DB.prepare('SELECT COUNT(DISTINCT geraet) AS geraete, COUNT(DISTINCT CASE WHEN sync = 1 THEN geraet END) AS sync FROM besuch WHERE tag >= ?').bind(ab7),
    env.DB.prepare('SELECT COUNT(*) AS gesamt, SUM(geaendert >= ?) AS woche FROM raum').bind(jetzt - 7 * TAG),
  ]);
  const w = woche.results[0] || {}, r = raeume.results[0] || {};
  return { heute: tagVon(jetzt), tage: tage.results, geraete7: w.geraete || 0, sync7: w.sync || 0, haushalte7: r.woche || 0, haushalte: r.gesamt || 0 };
}
