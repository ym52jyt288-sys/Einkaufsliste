// Sync-Server für die Einkaufsliste: Cloudflare Worker mit D1-Datenbank (Bindung „DB“).
// Speichert je Raum einen verschlüsselten Datenblock mit Versionsnummer. Den Inhalt kann der Server nicht lesen;
// Schlüssel und Zusammenführen liegen in der App. Einrichtung: siehe ANLEITUNG.md.
//
//   GET    /r/<id>[?v=<version>]   → 200 { version, daten } | 200 { version, unveraendert: true } | 404
//   PUT    /r/<id>  { basis, daten } → 200 { version } | 409 { version, daten } (jemand war schneller) | 404
//   DELETE /r/<id>                 → 204

const ERLAUBT = ['https://ym52jyt288-sys.github.io', 'http://localhost:8765', 'http://127.0.0.1:8765'];
const MAX_BYTES = 1_000_000;
const ID = /^[A-Za-z0-9_-]{43}$/;

export default {
  async fetch(anfrage, env) {
    try { return await bearbeite(anfrage, env); }
    catch (e) { return new Response(JSON.stringify({ fehler: 'Server' }), { status: 500, headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' } }); }
  },

  // Optional (Cron-Trigger, z. B. einmal pro Woche): Räume löschen, die ein Jahr lang niemand benutzt hat
  async scheduled(_, env) {
    await env.DB.prepare('DELETE FROM raum WHERE geaendert < ?').bind(Date.now() - 365 * 864e5).run();
  },
};

async function bearbeite(anfrage, env) {
  {
    const herkunft = anfrage.headers.get('origin') || '';
    const cors = {
      'access-control-allow-origin': ERLAUBT.includes(herkunft) ? herkunft : ERLAUBT[0],
      'access-control-allow-methods': 'GET, PUT, DELETE, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'access-control-max-age': '86400',
      'vary': 'origin',
    };
    const antwort = (status, daten) => new Response(daten === undefined ? null : JSON.stringify(daten), {
      status, headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
    if (anfrage.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const pfad = new URL(anfrage.url).pathname.match(/^\/r\/([^/]+)$/);
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
