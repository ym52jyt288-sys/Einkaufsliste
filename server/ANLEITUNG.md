# Sync-Server einrichten (Cloudflare, einmalig, ca. 10 Minuten)

Die Synchronisierung braucht einen kleinen Server, der die **verschlüsselten** Daten zwischen den iPhones weitergibt.
Er läuft kostenlos bei Cloudflare. Ein Konto braucht nur, wer den Server betreibt; die App-Nutzer brauchen keins.
Alles geht im Browser, installiert wird nichts.

Der Server kann die Daten nicht lesen: Der Schlüssel steckt nur in der Einladung (QR-Code oder Link) und verlässt die
Geräte nie. Gespeichert werden je Haushalt ein unlesbarer Datenblock und eine Versionsnummer.

## 1. Konto anlegen
Auf <https://dash.cloudflare.com/sign-up> mit E-Mail und Passwort registrieren und die E-Mail bestätigen.
Der kostenlose Plan („Free“) genügt. Eine Domain wird nicht gebraucht.

## 2. Datenbank anlegen
1. Links **Storage & Databases → D1 SQL Database** → **Create** (bzw. „Create database“).
2. Name: `einkauf` → **Create**.
3. In der Datenbank den Reiter **Console** öffnen, diese eine Zeile einfügen und **Execute** drücken:
   ```sql
   CREATE TABLE IF NOT EXISTS raum (id TEXT PRIMARY KEY, version INTEGER NOT NULL, daten TEXT NOT NULL, geaendert INTEGER NOT NULL);
   ```
   Danach steht unter „Tables“ die Tabelle `raum`. (Keine Zeilen mit `--`-Kommentaren einfügen: Die Konsole zieht den
   Text zu einer Zeile zusammen, dann verschluckt der Kommentar den Rest, Fehler „incomplete input“.)

## 3. Worker anlegen
1. Links **Compute (Workers) → Workers & Pages** → **Create** → **Worker** („Start with Hello World“).
2. Name: `einkaufsliste-sync` → **Deploy**.
3. **Edit code**: den ganzen Beispielcode löschen, den Inhalt von [`worker.js`](worker.js) einfügen → **Deploy**.

## 4. Datenbank mit dem Worker verbinden
1. Im Worker **Settings → Bindings** → **Add** → **D1 database**.
2. Variable name: `DB` (genau so, in Großbuchstaben), Database: `einkauf` → **Save** bzw. **Deploy**.

## 5. Prüfen
Die Adresse des Workers steht oben in der Übersicht, etwa `https://einkaufsliste-sync.<name>.workers.dev`.
Im Browser öffnen:

```
https://einkaufsliste-sync.<name>.workers.dev/r/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```

- `{"fehler":"unbekannt"}` → alles richtig (dieser Raum existiert nur nicht).
- `{"fehler":"Server"}` → die Bindung `DB` aus Schritt 4 fehlt oder heißt anders, oder `schema.sql` wurde nicht ausgeführt.

## 6. Adresse eintragen
Die Worker-Adresse an Claude geben. Sie kommt als `SYNC_URL_STANDARD` in `index.html`. Danach ist in der App unter
Einstellungen → Synchronisieren der Knopf „Synchronisierung einrichten“ aktiv.

## Optional: alte Räume aufräumen
Im Worker **Settings → Triggers → Cron Triggers** → **Add**, z. B. `0 3 * * 1` (montags 3 Uhr). Dann löscht der Worker
Haushalte, die drei Monate lang niemand benutzt hat (jedes Gerät meldet sich beim Öffnen der App, das zählt als Benutzung).

## Nutzungsstatistik (statistik.html)
Die App meldet einmal pro Tag eine zufällige Geräte-ID an den Worker (nicht den Gerätenamen, keine Listen) und ob
die Synchronisierung an ist. Das Dashboard `statistik.html` zeigt daraus die Geräte der letzten 7 und 30 Tage.
Einmalig einrichten:
1. D1-Datenbank `einkauf` → **Console**, diese Zeile einfügen → **Execute**:
   ```sql
   CREATE TABLE IF NOT EXISTS besuch (tag TEXT NOT NULL, geraet TEXT NOT NULL, sync INTEGER NOT NULL, PRIMARY KEY (tag, geraet));
   ```
2. Im Worker **Edit code**: den Inhalt von [`worker.js`](worker.js) neu einfügen → **Deploy**.
3. Im Worker **Settings → Variables and Secrets** → **Add** → Typ **Secret**, Name `STAT_TOKEN`, Wert: ein langes
   zufälliges Passwort → **Deploy**. Ohne dieses Secret bleibt die Statistik gesperrt.
4. `https://ym52jyt288-sys.github.io/Einkaufsliste/statistik.html` öffnen, unter „Zugang“ das Token eintragen.
   (Die Seite ist öffentlich erreichbar, zeigt ohne Token aber nichts.)

## Gut zu wissen
- **Kosten**: Das Gratis-Kontingent von Workers und D1 reicht für einen Haushalt um ein Vielfaches: Die App fragt
  höchstens alle 10 Sekunden nach, und nur solange sie offen ist. Die aktuellen Grenzen stehen bei Cloudflare unter
  „Workers & Pages → Plans“.
- **Erlaubte Herkunft**: `worker.js` nimmt Anfragen nur von `https://ym52jyt288-sys.github.io` an (und von `localhost`
  zum Testen). Zieht die App um, die Liste `ERLAUBT` oben in `worker.js` anpassen und erneut „Deploy“ drücken.
- **Wer den Link hat, hat Zugriff.** Ist eine Einladung in falsche Hände geraten: in der App „Neuen Schlüssel erzeugen“.
  Der alte Datenblock wird gelöscht, alle anderen Geräte werden getrennt und müssen neu eingeladen werden.
