# Einkaufsliste – Plan und Stand

## Stand — 29.09.2026

**Online unter https://ym52jyt288-sys.github.io/Einkaufsliste/** (GitHub Pages, Repo `ym52jyt288-sys/Einkaufsliste`, Branch `main`).
Selbsttest online 80/80 (Stand Erstveröffentlichung). Prüfung auf dem iPhone durch den Nutzer steht noch aus.

| Datei | Zweck |
|---|---|
| `index.html` | App (HTML/CSS/JS inline), Selbsttest mit `index.html?test` |
| `katalog.js` | Abteilungen, ~1.500 Begriffe mit Synonymen, Vorratsliste, Open-Food-Facts-Zuordnung. `~` vor einem Synonym = Falschschreibung, die zum Hauptnamen korrigiert wird |
| `sprache-en.js`, `sprache-fr.js`, `sprache-es.js` | Sprachpakete: Oberflächentexte (Schlüssel = deutscher Text), eigener Artikelkatalog je Sprache, Startverlauf, Vorrat |
| `sw.js` | Offline-Cache. **Bei jeder Änderung `VERSION` erhöhen**, sonst behält das iPhone die alte Fassung |
| `manifest.webmanifest`, `icon.svg` → `icon-180.png`, `icon-512.png` | Home-Bildschirm |
| `vendor/zxing.min.js` | @zxing/library 0.21.3 (UMD), Barcode-Erkennung, da Safari kein `BarcodeDetector` hat |

### Geprüft
- Selbsttest 80/80 in Headless Chrome: die komplette Beispielliste landet in der richtigen Abteilung, Tippfehlerkorrektur,
  Mengen, Mehrfacheingabe, Duplikate, Stammartikel-Kreislauf, Rezept-Parser, Open-Food-Facts-Zuordnung.
- Skriptgesteuerter UI-Durchlauf (Eintippen, Vorschläge, Detailblatt, Einstellungen, Profil, Laden-Ansicht, Rezept → Prüfblatt → Abschluss) ohne Fehler.
- Layout bei 390 px, hell und dunkel (per iframe, weil Headless Chrome nicht schmaler als ~500 px rendert).
- Open Food Facts antwortet mit `access-control-allow-origin: *`; die Claude-API erlaubt alle benötigten Header per CORS.

### Offen / nur auf dem iPhone prüfbar
- Kamera-Scan (braucht HTTPS → erst nach GitHub Pages), Standort, Offline-Betrieb, Home-Bildschirm, Wischen.
- Claude-Fotoerkennung: nicht mit echtem Schlüssel getestet.

### Überarbeitung 24.09.2026 (Runde 2)
- **Schnellauswahl** (Chips) erscheint nur noch in der Listenansicht. Sie ist personalisierbar: Artikel anheften (immer zuerst),
  ausblenden, Anzahl 6/9/12/18, ganz abschaltbar. Verwaltet wird sie unter Einstellungen → Schnellauswahl oder per langem Druck auf einen Chip.
- **Farben je Bereich** (`BEREICHE` in `katalog.js`: 8 Bereiche, Sonstiges bleibt grau). Es gibt drei Schemata (`FARBSCHEMATA`
  in `index.html`), alle aus derselben geprüften Referenzpalette mit 8 Farbtönen und je einem Wert für hell und dunkel.
  Die Zuordnung ist per Skript gewählt (Validator aus dem dataviz-Skill, ΔE in OKLab, benachbarte Bereiche im Standard-Laufweg):
  | Schema | Normalsicht (min. ΔE, Grenze 15) | Rot-Grün-Schwäche (min. ΔE, Ziel 8 / Untergrenze 6) |
  |---|---|---|
  | Markt (warenbezogen) | 19,6 hell / 19,7 dunkel | 6,9 / 6,5 – Untergrenze, zulässig weil die Abteilung immer beschriftet ist |
  | Kontrast | 19,6 / 19,3 | 9,2 / 9,4 |
  | Ruhig (4 Zonen, alle Paare geprüft) | 19,6 / 19,3 | 13,0 / 6,9 |
  Einzelfarben für alle 20 Abteilungen wären nicht unterscheidbar; deshalb gibt es Bereiche. Darstellung: Streifen oder farbige Zeilen, abschaltbar.
- **Hell / Dunkel / Automatisch** umschaltbar (`data-theme` auf `<html>`).
- **Autovervollständigung** zeigt je Katalogeintrag nur noch einen Vorschlag (kein „Tomate“ neben „Tomaten“).
- **Mengen mit Einheit** Stück / g / kg / ml / l: eintippen („500 g Hack“, „Kartoffeln 2 kg“) oder im Detailblatt umschalten
  (g↔kg und ml↔l werden umgerechnet). Der Verlauf merkt sich die zuletzt genutzte Menge mit Einheit.
- Selbsttest jetzt 97/97.
- Schnellauswahl: automatischer Teil lässt Stammartikel weg (angeheftete bleiben immer vorne). Selbsttest 100/100.

### Runde 3 (25.09.2026)
- **Abteilung in der Listenansicht** ein-/ausblendbar: Einstellungen → Darstellung → „Abteilung in der Listenansicht zeigen“
  (`einstellungen.abteilungInListe`, Standard an). Der Farbstreifen bleibt auch ohne Beschriftung.
- **„Ganze Liste löschen“** unter der Liste (nur Listenansicht, nur wenn die Liste nicht leer ist). Löscht nach Rückfrage
  (`confirm`) alle Artikel einschließlich Stammartikel; der Stammartikel-Status im Verlauf bleibt. Danach „Rückgängig“ im Hinweis.
- Selbsttest 105/105. `sw.js` VERSION `einkauf-5`.

### Runde 4 (25.09.2026): Liste teilen
- **Teilen-Symbol** in der Kopfzeile. Es verschickt die offenen Artikel (ohne Erledigte und „diesmal nicht“) als lesbaren
  Text nach Abteilung und einen Link `…/#l=<daten>`. Zum Verschicken dient das iPhone-Teilen-Menü (`navigator.share`). Wenn
  Safari das Teilen verweigert, weil nach dem asynchronen Kodieren das Antippen „verbraucht“ ist, öffnet sich ein Blatt mit
  den Knöpfen „Teilen“ und „Kopieren“.
- **Daten im Fragment** (hinter `#`, geht nie an GitHub): JSON → `CompressionStream('deflate-raw')` → Base64url, Präfix `z`
  (komprimiert) oder `j` (unkomprimiert, falls der Browser keinen `CompressionStream` hat). 48 Artikel ≈ 1.200 Zeichen Link.
  Snapshot `{v:1, id, t, a:[[id, name, menge, einheit, abteilung, notiz]…]}`. Rückmeldung `{v:1, id, g:[gekauft], n:[nicht bekommen]}`.
- **Empfänger**: eigene Ansicht „Geteilte Liste“ (`S.geteilt`, Schlüssel `ek.geteilt`), getrennt von der eigenen Liste.
  Die Abteilungen stehen in Standardreihenfolge. Antippen hakt ab, Wischen und Detailblatt sind aus. Unten steht
  „Erledigt zurückschicken“ und verschickt den Rücklink `#r=`. „Schließen“ fragt nach und verwirft die Liste.
- **Absender** öffnet den Rücklink. Ein Blatt zeigt Gekauftes, Fehlendes und nicht mehr vorhandene Artikel, dann „N als
  gekauft abhaken“ mit Rückgängig. Abschließen bleibt ein eigener Schritt.
- **iPhone-Einschränkung**: Links aus Nachrichten öffnen immer Safari, nie die Home-Bildschirm-App, und beide haben getrennte
  Speicher. Deshalb erkennt das **Eingabefeld eingefügte Links** (`#l=`/`#r=`) und verarbeitet sie. Ein Hinweis dazu steht im
  Rückmelde-Blatt, wenn es nicht in der Home-Bildschirm-App läuft.
- Selbsttest 115/115 (jetzt `async`, Abbruch wird angezeigt). Headless Chrome braucht `--virtual-time-budget`, sonst
  wird das DOM vor dem Ende des asynchronen Tests ausgegeben. `sw.js` VERSION `einkauf-6`.
- Offen, nur auf dem iPhone prüfbar: Teilen-Menü, Öffnen aus WhatsApp/iMessage, Einfügen in die Home-Bildschirm-App.

### Runde 5 (25.09.2026): Schnellauswahl-Modus
- Einstellungen → Schnellauswahl → **Anzeigen: „Beim Antippen“** (wie bisher: bei aktivem Eingabefeld oder leerer Liste) oder
  **„Immer“** (`einstellungen.chips.modus`). Im Modus „Immer“ sind die Chips unter dem Eingabefeld immer sichtbar, darunter ein
  Griff. Nach oben wischen (auf den Chips oder dem Griff) klappt sie ein, dann bleibt eine Leiste „Schnellauswahl ⌄“. Antippen
  oder nach unten wischen holt sie zurück. Der Zustand wird gespeichert (`chips.eingeklappt`). Bei aktivem Eingabefeld
  erscheinen die Chips immer. Die Logik steckt in `chipsZustand()`.
- Ein Klick direkt nach einer Wischgeste trägt keinen Chip ein. Langes Drücken wird abgebrochen, sobald der Finger wandert.
- Globale Regel `[hidden] { display: none !important; }` ergänzt (`.chips` mit `display: flex` hatte `hidden` überstimmt).
- Selbsttest 122/122. `sw.js` VERSION `einkauf-7`.

### Runde 6 (26.09.2026): Karte für den Laden-Standort, gespeicherte Rezepte
- **Karte** (Laden-Profil → „Auf der Karte wählen“): Leaflet 1.9.4 in `vendor/leaflet/` (nur JS und CSS, wird erst beim Öffnen
  geladen, nicht vorab im Offline-Cache). Kacheln von `tile.openstreetmap.org`, im Dunkelmodus per CSS-Filter invertiert.
  - Die Karte startet am gespeicherten Ort, sonst am aktuellen Standort (sonst Deutschland). Ab Zoomstufe 14 werden Märkte
    (`shop` = supermarket, chemist, convenience, discount, organic, greengrocer) als Punkte geladen: zuerst Overpass
    (`overpass-api.de`, `overpass.private.coffee`), als Ersatz Nominatim (`supermarket`, `chemist`, bounded). Overpass war beim
    Test oft überlastet (504).
  - Punkt antippen → Nadel, Adresse und „Namen übernehmen“ (z. B. „REWE Sendlinger Straße“, vorausgewählt, wenn das Profil
    noch „Supermarkt“, „Drogerie“ oder „Neuer Laden“ heißt). Auf die Karte tippen setzt die Nadel frei. Suchfeld: Nominatim,
    nur beim Absenden (Nutzungsregeln: keine Suche während des Tippens).
  - Gespeichert wird `p.ort = { lat, lon, genau: null, quelle: 'karte', adresse }`. Die automatische Ladenwahl (250 m) bleibt unverändert.
- **Rezepte**: Das Prüfblatt hat das Feld „Als Rezept speichern“. Gespeichert werden **alle** erkannten Zutaten, auch Vorrat
  und abgewählte (`S.rezepte`, Schlüssel `ek.rezepte`, auch in der Sicherung).
  - Abrufen mit `#Name` im Eingabefeld (Groß-/Kleinschreibung und Leerzeichen egal, eindeutiger Anfang genügt). Mehrere
    Rezepte mit Komma möglich, gleiche Zutaten werden zusammengefasst und Mengen gleicher Einheit addiert. Beim Tippen von `#`
    erscheinen die Rezepte als Vorschläge. Danach kommt das Prüfblatt (Vorrat und schon Vorhandenes abgewählt).
  - Das Rezept-Blatt zeigt gespeicherte Rezepte oben als Chips. Einstellungen → Rezepte: umbenennen, Zutaten entfernen oder
    hinzufügen, auf die Liste, löschen.
  - **Mengen**: `rezeptMenge()` übernimmt g/kg/ml/l (cl, dl → ml) und Stückzahlen (auch Dose, Bund, Packung; Brüche und
    Spannen aufgerundet). Küchenmaße (EL, TL, Zehe, Prise …) ergeben keine Menge. Die Fotoerkennung liefert jetzt auch
    `menge`/`einheit` (0 = keine).
  - Nebenbei: Dezimalkommas („1,5 kg“) werden beim Zerlegen einzeiliger Rezepte nicht mehr getrennt.
- Selbsttest 136/136. Karte mit echten Daten geprüft (München Stachus: 11 Märkte, Suche „REWE Sendlinger Straße“ →
  Profilname „Rewe Sendlinger Straße“). `sw.js` VERSION `einkauf-8`.
- Offen, nur auf dem iPhone prüfbar: Karte mit Fingergesten im Blatt, Standortfreigabe beim Öffnen der Karte, Fotoerkennung mit Mengen.

### Bugfix 26.09.2026: Rezept ohne Zeilenumbrüche
- Bisher wurde eine einzelne Zeile nur an Kommas getrennt. Ohne Kommas war sie länger als 70 Zeichen und wurde verworfen
  („Keine Zutaten erkannt“). Neu ist `rezeptTeile()`: Es trennt an Aufzählungszeichen (• · - …) und bei einzeiligem Text (oder
  Zeilen über 70 Zeichen) vor jeder neuen Mengenangabe. Ab „Zubereitung:“ wird abgeschnitten, sofern davor schon Zahlen
  stehen. Entfernt werden „für 4 Personen“, Zeitangaben („20 Min“) und Zubereitungswörter („fein gehackt“).
- Einzeilig: Zutaten ohne Menge hintereinander („Salz Pfeffer“) werden getrennt, wenn jedes Wort ein Katalogbegriff ist
  (`trenneBekannte`). Bei mehrzeiligem Text nicht, damit „Milchreis“-artige Namen heil bleiben.
- Selbsttest 142/142. `sw.js` VERSION `einkauf-9`.

### Runde 7 (26.09.2026): Prüfblatt bearbeitbar
- Im Prüfblatt „Was brauchst du?“ ist jede Zeile ein Textfeld mit Menge und Name („400 g Spaghetti“). Beim Ändern liest
  `pruefAendern()` die Menge per `parseMenge` und bestimmt die Abteilung neu. Die Abteilung darunter lässt sich antippen: ein
  unsichtbares `<select>` über Text und Pfeil. Eine von Hand gewählte Abteilung wird beim Hinzufügen gelernt (`setzeAbteilung`).
  Geänderte Namen gehen auch ins gespeicherte Rezept.
- Bugfix „Zitronensaft“ → „Saft“: `rezeptArtikel` hat bei einem Treffer am Wortende (`art: 'suffix'`) den ganzen Namen durch
  den Katalogbegriff ersetzt. Jetzt wird nur bei `exakt`/`fuzzy` umbenannt. Zitronensaft, Limettensaft und
  Zitronensaftkonzentrat stehen jetzt im Katalog (Öl, Essig & Gewürze).
- Selbsttest 146/146. `sw.js` VERSION `einkauf-10`.

### Runde 8 (26.09.2026): Autovervollständigung
- **Vorschläge ab dem ersten Buchstaben** beim Eintragen (vorher ab zwei). Enter übernimmt den ersten Vorschlag weiterhin erst
  ab zwei Zeichen, damit „Q“ + Enter nicht zu „Quark“ wird.
- **Anheften in den Einstellungen** hat dieselbe Autovervollständigung (`vorschlaege(text, { anheften: true })`: ohne Rezepte,
  ohne schon Angeheftetes, Hinweis immer die Abteilung). Antippen heftet an, das Feld bleibt aktiv für den nächsten Artikel.
  Enter übernimmt bei unbekanntem Begriff den ersten Vorschlag.
- Bugfix: Ein abgeschnittener Name, der nur über ein angehängtes „e“ im Katalog stand („Kaffe“), blieb unkorrigiert. Jetzt
  korrigiert `korrigiere()` ihn zum Katalognamen; Beugungen wie Tomate/Tomaten bleiben unverändert.
- Skriptgesteuerter UI-Durchlauf (Eingabe, Vorschläge, Chips, Detailblatt, Laden-Ansicht, Teilen, Rezept, Einstellungen,
  Profil, Abschluss, Liste leeren) ohne JavaScript-Fehler.
- Selbsttest 150/150. `sw.js` VERSION `einkauf-11`.

### Runde 9 (26.09.2026): Mehrsprachig (Deutsch, Englisch, Französisch, Spanisch)
- **Sprache** unter Einstellungen → Sprache: Automatisch (Gerätesprache, sonst Englisch) oder fest. Die Wahl steht in
  `einstellungen.sprache`; ein Wechsel lädt die Seite neu, weil Katalog-Index und feste Texte an der Sprache hängen.
  Zum Testen: `index.html?sprache=en` (wird nicht gespeichert). Der Selbsttest läuft immer auf Deutsch.
- **Texte**: `t` als Tag (`` t`Text ${x}` ``) oder `t('Text')`. Schlüssel ist der deutsche Text, Werte werden zu `{0}`, `{1}` …
  Ein Wert im Sprachpaket kann `{ one, other }` sein (Einzahl/Mehrzahl nach dem ersten Wert). Deutsche Einzahl: `DE_EINZAHL`.
  Feste HTML-Texte übersetzt `uebersetzeSeite()` beim Start. Abteilungen, Bereiche und Farbschemata werden über ihren
  deutschen Namen übersetzt (`ABT_NAME`).
- **Artikelerkennung**: Jede Sprache hat einen eigenen Katalog (gleiches Format wie `katalog.js`, gleiche Abteilungs-IDs).
  `baueIndex(sprache)` nimmt den Katalog der Sprache und zusätzlich den deutschen, aber nur für exakte Treffer (Artikel von
  vor dem Wechsel). Vorschläge, Abkürzungen und Tippfehler nutzen nur die gewählte Sprache (`INDEX_KEYS`).
  Jeder Begriff steht zusätzlich ohne Füllwörter im Index („Pomme de terre“ → `pommeterre`), passend zu `erkenne()`.
  Stoppwörter und TK-Wörter enthalten jetzt alle vier Sprachen, `staemme()` kennt Plural auf -x, -ies und -ces.
  Achtung bei Stoppwörtern: „the“ musste raus, weil „Thé“ zu „the“ normalisiert wird.
- **Mengen und Rezepte**: Einheiten (pcs, grammes, gramos, litres …), Küchenmaße (tbsp, c. à soupe, cucharada …), Überschriften,
  Zubereitungswörter und „und/and/et/y“ in allen vier Sprachen; „1 lb“ wird zu 454 g. Dezimaltrennzeichen im Englischen: Punkt.
- Claude-Fotoerkennung liefert die Artikelnamen in der gewählten Sprache, Open Food Facts bevorzugt `product_name_<sprache>`,
  die Kartensuche nutzt `accept-language`.
- Geprüft: Selbsttest 220/220. Neu sind u. a. vollständige Übersetzungen, passende Platzhalter, keine überflüssigen Texte,
  Einsortierung und Rezepte je Sprache. Skriptgesteuerter UI-Durchlauf in en/fr/es ohne JavaScript-Fehler und ohne
  deutsche Reste. Sprachwechsel über die Einstellungen geprüft. Screenshots in Handybreite geprüft.
- Offen: Die Übersetzungen und Kataloge hat Claude geschrieben; eine Durchsicht durch Muttersprachler steht aus.
- `sw.js` VERSION `einkauf-12`, Sprachpakete im Cache und wie `katalog.js` „erst Netz“.

### Runde 10 (27.09.2026): Einstellungen mit Unterseiten
- Die Einstellungen waren eine lange Seite mit acht Abschnitten; allein Farbschemata und Schnellauswahl füllten mehr als
  einen Bildschirm. Jetzt gibt es eine **Startseite im Stil der iPhone-Einstellungen**: Zeilen mit aktuellem Wert und Pfeil,
  gruppiert in **Einkaufen** (Läden, Stammartikel, Rezepte), **Anzeige** (Darstellung, Schnellauswahl, Sprache) und
  **Erweitert** (Rezept-Fotos, Daten).
- Unterseiten mit „‹ Einstellungen“ und „Fertig“ und großer Überschrift. Beim Wechsel gleitet der Inhalt kurz seitlich ein
  (aus bei „Bewegung reduzieren“). Alles bleibt in einem Blatt (`seite` in `oeffneEinstellungen`). Läden und Rezepte öffnen
  wie bisher ein eigenes Blatt darüber.
- **Sprache** ist jetzt eine Liste mit Haken statt eines Auswahlfelds. **Darstellung**: erst das Erscheinungsbild, dann die
  Abteilungs-Schalter; Streifen/Zeilen steht vor den Farbschemata. Die Statistik (Verlauf, Zuordnungen, Katalogbegriffe)
  steht unter Daten.
- `oeffneEinstellungen(start)` kann direkt eine Unterseite öffnen: Das Rezeptfoto ohne Schlüssel führt nach „Rezept-Fotos“.
- Neue Texte in allen drei Sprachpaketen. Selbsttest 220/220, skriptgesteuerter Durchlauf aller Unterseiten auf Französisch
  ohne Fehler und ohne deutsche Reste. Screenshots bei 390 px hell, dunkel und auf Englisch. `sw.js` VERSION `einkauf-13`.

### Runde 11 (27.09.2026): Synchronisierung für den Haushalt, ohne Nutzerkonto
- **Prinzip**: Ein geheimer Schlüssel (16 Zufallsbytes, 22 Zeichen) ersetzt das Konto. Wer die Einladung hat (QR-Code oder
  Link `…/#s=<schlüssel>`), gehört zum Haushalt. Aus dem Schlüssel entstehen per Web Crypto die Raum-ID
  (SHA-256, 43 Zeichen) und ein AES-GCM-Schlüssel (HKDF). Der Server speichert nur `{version, daten}`, verschlüsselt und
  deflate-komprimiert.
- **Synchronisiert**: `liste`, `verlauf`, `korrekturen`, `eans`, `profile`, `rezepte`. **Nicht**: `einstellungen`
  (Thema, Sprache, Schnellauswahl, API-Schlüssel …), `aktivesProfil`, `geteilt`.
- **Zusammenführen** (`zusammenfuehren()`, reine Funktion): Jedes Feld eines Eintrags hat einen Zeitstempel, der jüngere
  gewinnt; bei Gleichstand entscheidet der Wert, damit alle Geräte zum selben Ergebnis kommen. Löschen = Grabstein `x`.
  Ein Eintrag lebt, wenn ein Feld jünger ist als `x`; dann bleibt er vollständig erhalten (Löschen gegen gleichzeitiges
  Ändern). Grabsteine fallen nach 60 Tagen weg. Die Uhr ist hybrid (`syncUhr`): nie kleiner als ein schon gesehener
  Zeitstempel.
- **Änderungen erfassen**: `sichere()` ruft `syncGeaendert()` auf, das den Stand per Vergleich ins Dokument überträgt
  (`erfasse()`). Deshalb musste keine der Stellen angepasst werden, die die Liste ändern. Das Dokument liegt in
  `ek.sync.doc`, Schlüssel, Version und Uhr in `ek.sync`. Beim Zurückschreiben (`ausDokument()`) werden vorhandene
  Objekte an Ort und Stelle geändert, damit offene Blätter gültig bleiben.
- **Ablauf** `synchronisiere()`: GET (`?v=` → `unveraendert`) → zusammenführen → bei Bedarf PUT mit `basis`. Bei `409`
  wird neu geholt, höchstens viermal. Ohne Änderung wird nicht hochgeladen (Vergleich über `kanonisch()` + Hash).
  Auslöser: Start, zurück in die App, `online`, 1,5 s nach einer Änderung, alle 10 s solange sichtbar.
- **Oberfläche**: Einstellungen → Erweitert → **Synchronisieren**. Aus: Erklärung und „Synchronisierung einrichten“.
  An: Status, QR-Code (`vendor/qrcode.min.js`, qrcode-generator 1.4.4, MIT), „Einladung teilen“, „Jetzt
  synchronisieren“, „Auf diesem Gerät beenden“, „Neuen Schlüssel erzeugen“ (löscht den alten Raum und trennt alle anderen).
- **Beitreten**: Link öffnen, Link ins Eingabefeld einfügen (wichtig für die Home-Bildschirm-App) oder QR-Code mit dem
  **Scanner der App** (zxing und `BarcodeDetector` lesen jetzt auch QR-Codes; andere QR-Codes werden übergangen).
  Das Blatt „Gemeinsame Liste“ bietet **Zusammenführen** oder **Ersetzen**. Beim Zusammenführen entfernt das beitretende
  Gerät vorher eigene offene Artikel, die schon auf der gemeinsamen Liste stehen (keine doppelte Milch). Seine
  übrigen Daten bekommen Zeitstempel 1, damit bei gleichen Einträgen (Standardläden, Startverlauf) der gemeinsame Stand gewinnt.
- **Server** in `server/`: `worker.js` (Cloudflare Worker, D1-Bindung `DB`, CORS nur für GitHub Pages und localhost:8765,
  1 MB Grenze, optional Cron zum Aufräumen), `schema.sql`, `ANLEITUNG.md` (Einrichtung im Browser).
- **Adresse**: `SYNC_URL_STANDARD` = `https://einkaufsliste-sync.56nr5tc89d.workers.dev` (Cloudflare-Konto des Nutzers,
  Worker `einkaufsliste-sync`, D1-Datenbank `einkauf`). Zum Testen überschreibbar mit `localStorage['ek.syncUrl']`.
- **Geprüft**:
  - Selbsttest 243/243 (20 neue Sync-Fälle).
  - Zwei-Geräte-Simulation in Headless Chrome, 18/18: zwei iframes auf `localhost` und `127.0.0.1` mit getrennten
    Speichern gegen den **echten `worker.js`** in Node mit nachgebildeter D1. Geprüft wurden Einrichten per Oberfläche,
    Beitritt per eingefügtem Link, gleichzeitiges Abhaken und Mengenänderung, Offline-Phase, zwei echte 409-Konflikte,
    Löschen, Einkauf abschließen, Rezepte, Läden, lokale Einstellungen, kein Hochladen ohne Änderung, Server-Daten
    unlesbar und die Trennung nach neuem Schlüssel.
  - Der erzeugte QR-Code wird von zxing gelesen. Screenshots bei 390 px.
  - Echter Worker (27.09.2026): `curl` für 404, Anlegen, zwei 409-Fälle, `unveraendert`, CORS für GitHub Pages und
    Löschen; dazu die Zwei-Geräte-Simulation gegen den echten Server, 18/18 (Offline-Fall nur gegen den lokalen Nachbau).
- Stolperstein beim Einrichten: Die D1-Konsole zieht eingefügten Text zu einer Zeile zusammen; `--`-Kommentare
  verschlucken dann den Rest. `schema.sql` ist deshalb einzeilig.
- **Offen, nur auf dem iPhone prüfbar**: QR-Scan mit der Kamera, zwei Geräte im Laden, Flugmodus.
- `sw.js` VERSION `einkauf-15`.

### Runde 12 (27.09.2026): Sync-Regeln beim Löschen
Mit dem Nutzer besprochen. Die Grundregel bleibt **„Ändern gewinnt“**: Wird ein gelöschter Artikel auf einem anderen Gerät
später noch geändert (abgehakt, Menge, Notiz), bleibt er für alle erhalten. Lieber einmal zu viel als vergessen.
„Einkauf abschließen“ entfernt weiter alles Abgehakte **bei allen**, weil der Haushalt fast nie gleichzeitig in
getrennten Läden einkauft. Neu:
- **Warnung**: Die Rückfragen bei „Ganze Liste löschen“, „Verlauf … löschen“, „Laden löschen“ und „Rezept löschen“ enthalten bei
  aktiver Synchronisierung „Das gilt für alle verbundenen Geräte.“ (`syncWarnung()`).
- **Hinweis bei fremden Löschungen** (`meldeFremdesLoeschen`): Verschwinden durch den Abgleich offene Artikel, erscheint
  „Eier auf einem anderen Gerät gelöscht“ bzw. „3 Artikel …“ mit „Rückgängig“. Rückgängig holt sie für alle zurück.
  Kein Hinweis beim Einrichten und Beitreten, bei „Einkauf abschließen“ (nur Abgehaktes) und beim Zusammenfassen.
- **Doppelte zusammenfassen** (`fasseDoppelteZusammen`): Haben zwei Geräte gleichzeitig denselben Artikel eingetragen,
  bleibt nach dem Abgleich einer. Es bleibt die kleinste id, damit alle Geräte denselben behalten. Bei gleicher Einheit
  gilt die **größere** Menge, nicht die Summe, weil beide dasselbe gemeint haben. Notiz und Stammartikel werden übernommen.
- Selbsttest 245/245, Zwei-Geräte-Simulation 24/24 (neu: gleichzeitig eingetragen, Hinweis und Rückgängig, kein
  Hinweis beim Abschließen, Warnung in der Rückfrage). `sw.js` VERSION `einkauf-16`.

### Runde 13 (28.09.2026): Verbundene Geräte, Kundenkarten
- **Verbundene Geräte** (Einstellungen → Synchronisieren): Jedes Gerät hat einen festen Code aus drei Wörtern wie bei
  what3words (`///ruder.sand.kahn`; in Runde 15 ersetzt durch `Butter-Tiger-71`). Er wird beim ersten Start zufällig erzeugt und steht nur lokal (`ek.geraet`, 3 Zufallsbytes
  aus `GERAETE_WOERTER`, 256 deutsche Wörter, also 16,7 Mio. Codes). Die Wörter sind in allen Sprachen gleich, damit der Code
  auf jedem Gerät gleich aussieht.
  - Neue synchronisierte Sammlung `geraete`: `{ code: { art, app, gesehen } }`. `meldeGeraet()` läuft zu Beginn jedes Abgleichs
    und schreibt den eigenen Eintrag direkt ins Dokument, **höchstens alle 5 Minuten**. Sonst würde bei jedem 10-s-Abgleich
    hochgeladen. Wer 60 Tage lang nicht gesehen wurde, wird vergessen.
  - Anzeige: eigenes Gerät zuerst, dann „Gerade aktiv“ (unter 15 Min.) oder „Zuletzt aktiv vor 3 Stunden“
    (`Intl.RelativeTimeFormat`). Art (iPhone/iPad/Mac …) und „App“ oder „Browser“, weil Safari und die Home-Bildschirm-App
    getrennte Speicher haben und als zwei Geräte zählen. Die Einstellungszeile zeigt „3 Geräte“.
  - „Auf diesem Gerät beenden“ trägt das Gerät vorher aus (`meldeGeraetAb`, höchstens 8 s Wartezeit). „Neuen Schlüssel
    erzeugen“ lässt nur das eigene Gerät in der Liste.
- **Kundenkarten** (Einstellungen → Einkaufen → Kundenkarten, `S.karten`, Schlüssel `ek.karten`, synchronisiert und in der
  Sicherung): `{ id, kette, name, inhalt }`. Gespeichert wird nur der Text im QR-Code, angezeigt wird ein neu erzeugter
  QR-Code als SVG (`qrSvg(text, 4)`, Ruhezone 4 Module, Modus Numeric/Alphanumeric/Byte, UTF-8).
  - Hinzufügen: Screenshot wählen (`qrAusBild`: BarcodeDetector, sonst zxing `QRCodeReader` mit TRY_HARDER bei 1200/800/2000 px,
    jeweils auch invertiert für helle Codes auf dunklem Grund) oder die Plastikkarte scannen (`oeffneScanner(beiQr)`, quadratischer
    Rahmen, nur QR). Die Kette wird aus dem Namen des gewählten Ladens vorgeschlagen, dazu Chips für die großen Ketten.
  - **Knopf unten links** neben „Einkauf abschließen“, sobald eine Karte hinterlegt ist. Ohne Abgehaktes steht er allein, mit dem
    Namen der Kette. Welche Karte: `kartenFuerLaden()` vergleicht ganze Wörter mit dem Namen des aktiven Ladens („Rewe
    Sendlinger Straße“ → REWE, „Edmund“ ≠ dm). Bei mehreren Karten gibt es Reiter, passende zuerst.
  - **Vollbild an der Kasse**: weiß auch im Dunkelmodus, `theme-color` weiß, Nummer darunter (bis 40 Zeichen), **Wake Lock** hält
    das Display an. **Die Bildschirmhelligkeit kann eine Web-App nicht setzen**, auch nicht auf dem iPhone. Deshalb steht dort der
    Hinweis auf das Kontrollzentrum.
- Geprüft: Selbsttest 258/258 (neu u. a. Wortliste, Melde-Takt, Zusammenführen der Geräte, Ladenname → Karte, Screenshot
  1170×2532 → Vektor-QR → wieder gelesen über zxing *und* BarcodeDetector, invertiert, Bild ohne Code). Zwei-Geräte-Test gegen
  den echten `worker.js` (Node, D1 nachgebildet) 13/13: beide sehen sich, kein Hochladen ohne Änderung, Karte kommt an,
  Abmelden, neuer Schlüssel. UI-Durchlauf mit Screenshots bei 390 px hell und dunkel; en/fr/es ohne deutsche Reste.
  Headless Chrome mit `--dump-dom` wartet nicht auf Bild-Dekodierung; der Selbsttest läuft jetzt per DevTools-Protokoll.
- Offen, nur auf dem iPhone prüfbar: echter Screenshot aus REWE-/Lidl-App, Kassenscanner liest den erzeugten Code, Wake Lock.
  Manche Apps zeigen wechselnde Codes (zeitabhängig); die funktionieren als gespeicherter Screenshot nicht.
- `sw.js` VERSION `einkauf-17`.

### Bugfix 28.09.2026: Kundenkarte „Kein QR-Code gefunden“
- Rückmeldung vom iPhone: Beim Screenshot kam immer „Kein QR-Code gefunden“. Ursache: Gelesen wurden nur QR-Codes. **REWE Bonus
  zeigt einen Aztec-Code** (sieht ähnlich aus, Quadrat in der Mitte statt drei Ecken), Plastikkarten oft Strichcodes.
- Jetzt `codeAusBild()` mit allen gängigen Formaten (`CODE_FORMATE`): QR, Aztec, Data Matrix, EAN-13/8, UPC-A, Code 128, Code 39;
  PDF417/ITF/Codabar werden erkannt, aber als „kann die App noch nicht anzeigen“ gemeldet. Die Karte speichert `format`
  (alte Karten ohne Format gelten als QR). Anzeige über `codeSvg()`: QR per qrcode-generator, Aztec und Data Matrix per zxing-Writer,
  EAN und Code 128/39 selbst kodiert (`eanBits`, `code128Breiten`, `code39Breiten`).
- Zwei Fallen in zxing: (1) Der Aztec-Leser sucht von der **Bildmitte** aus. In einem hohen Screenshot mit dem Code weiter oben
  findet er nichts, deshalb werden danach überlappende quadratische Ausschnitte nur nach Aztec abgesucht. (2) Die Strichcode-Leser
  drehen bei TRY_HARDER die Bildquelle in sich selbst, danach schlug der invertierte Versuch fehl: je Versuch eine neue Quelle.
- Fehler beim Lesen des Bilds erscheinen jetzt mit Meldung, statt als „kein Code gefunden“ zu verschwinden. Der Kamera-Scan
  liest dieselben Formate.
- Dauer auf dem Mac: QR unter 0,1 s, Aztec in einem Ausschnitt ca. 1,7 s, Bild ohne Code ca. 2,4 s (der Ladekreis dreht weiter).
- Selbsttest 261/261: alle darstellbaren Formate als Screenshot → Vektorgrafik → wieder gelesen (zxing), kleiner Aztec-Code oben im
  Screenshot, invertiert, BarcodeDetector. `sw.js` VERSION `einkauf-18`.
- Offen: Echter Screenshot aus der REWE-App ist nicht getestet. Ob REWE den Code zeitweise wechselt, ist unklar.

### Runde 14 (28.09.2026): Anheften per Wischen nach rechts
- Artikel auf der Liste **nach rechts wischen** heftet ihn in der Schnellauswahl an (grüner Hintergrund „Anheften“). Ist er schon
  angeheftet, steht dort „Lösen“ und das Wischen löst ihn. Danach schnappt die Zeile zurück, Hinweis mit „Rückgängig“
  (`wechsleAngeheftet`). Nach links wischen löscht wie bisher. In der geteilten Liste ist das Wischen weiter aus.
- Angeheftete Artikel tragen in der Liste ein kleines Pin-Symbol. Einstellungen → Schnellauswahl weist auf die Geste hin.
- Geprüft mit echten Touch-Ereignissen (DevTools): anheften, kurzes Wischen unter der Schwelle tut nichts, erneut wischen löst,
  Rückgängig, links wischen löscht weiter. Selbsttest 261/261. `sw.js` VERSION `einkauf-19`.

### Runde 15 (28.09.2026): Gerätename statt what3words-Code
- Wunsch des Nutzers: Das eigene Gerät soll einen Namen haben, der auf den anderen Geräten erscheint, und man soll sehen, mit
  wie vielen Geräten das iPhone verbunden ist. Der Drei-Wörter-Code war zu nah an what3words.
- **Name** jetzt aus zwei Wörtern und einer Zahl, großgeschrieben mit Bindestrichen: `Butter-Tiger-71` (`GERAET_MUSTER`,
  256 × 256 × 90 ≈ 5,9 Mio.). Kein `///`, keine Punkte, nicht drei Wörter.
- **Umstellung**: Ein gespeicherter alter Code (`ruder.sand.kahn`) wird zum gleichen neuen Namen umgerechnet (`ausAltemCode`).
  Der alte Eintrag (`GERAET_ALT`) wird beim nächsten Abgleich aus der Geräteliste entfernt, und zwar gleich nach dem
  Zusammenführen, nicht erst bei der nächsten Meldung 5 Minuten später.
- **Sync-Seite**: oben „Dieses Gerät“ mit dem eigenen Namen groß („Unter diesem Namen erscheint es auf den anderen Geräten“),
  darunter „Verbunden mit 2 Geräten“ mit nur den anderen Geräten, oder „Noch kein anderes Gerät verbunden“. Die Einstellungszeile
  zeigt „Mit 2 Geräten“ (Einzahl „Mit 1 Gerät“).
- Selbsttest 263/263, Zwei-Geräte-Test gegen den echten `worker.js` 14/14 (neu: Umstellung des alten Codes, Zählung, Seite).
  `sw.js` VERSION `einkauf-20`.

### Bugfix 28.09.2026: Reihenfolge der Schnellauswahl
- Rückmeldung: Trotz vieler angehefteter Artikel standen häufig gekaufte dazwischen bzw. an ihrer Stelle. Ursache: Ein
  angehefteter Artikel, der schon offen auf der Liste stand, fiel aus der Schnellauswahl, und ein häufig gekaufter rückte
  nach. Das traf besonders nach dem Anheften per Wischen (Runde 14), weil diese Artikel ja auf der Liste stehen.
- Regel jetzt (`haeufige`): **alle angehefteten zuerst, in fester Reihenfolge**. Steht einer schon auf der Liste, behält er
  seinen Platz, gestrichelt mit Haken. Antippen lässt die Zeile aufblinken und meldet „… steht schon auf der Liste“, ohne
  die Menge zu erhöhen. Häufig gekaufte füllen nur die Plätze, die danach noch frei sind (ohne Artikel auf der Liste).
- Selbsttest 266/266. `sw.js` VERSION `einkauf-21`.

- Nachtrag: Beide Varianten sind wählbar, Einstellungen → Schnellauswahl → „Angeheftete Artikel, die schon auf der Liste
  stehen“: **Platz behalten** (Standard, wie oben) oder **Ausblenden** (bisheriges Verhalten: fällt weg, häufig gekaufte
  rücken nach). `einstellungen.chips.aufListe` = `behalten` | `ausblenden`, gilt nur für dieses Gerät. Selbsttest 267/267.
  `sw.js` VERSION `einkauf-22`.

### Runde 16 (29.09.2026): Listenreihenfolge, eigene Abteilungen, Scanner-Bugfix
- **Reihenfolge in der Listenansicht**: Zeile lange drücken (450 ms), dann ziehen. Nur offene Artikel, Abgehakte bleiben
  unten. Am oberen/unteren Rand rollt die Seite mit. Bewegt sich der Finger vorher (Wischen, Rollen), passiert nichts. Das
  Wischen ruht während des Ziehens (`SORTIEREN`). Gespeichert wird die Reihenfolge im Feld **`pos`** jedes Artikels, damit sie
  synchronisiert wird (vorher galt nur die lokale Array-Reihenfolge). `verschiebeArtikel()` setzt nur beim gezogenen Artikel
  eine Position zwischen den neuen Nachbarn. Zwei Geräte, die gleichzeitig umsortieren, kommen sich so nicht in die Quere.
  `pruefeListe()` (läuft in `sichereListe`, beim Laden und nach dem Abgleich) sortiert nach `pos` und vergibt fehlende
  Positionen. Die Reihenfolge gilt auch innerhalb der Abteilungen in der Laden-Ansicht.
- **Eigene Abteilungen** (Laden-Profil → „Abteilung hinzufügen“): neue synchronisierte Sammlung `abteilungen`
  (`[{ id: 'e-…', name }]`, auch in der Sicherung). Eine eigene Abteilung gibt es in allen Läden, jeweils vor „Sonstiges“
  (`laufweg(p)`), und dort lässt sie sich verschieben oder ausblenden. Farbe neutral wie Sonstiges. Löschen (nur eigene) entfernt
  sie aus allen Läden, vergisst gelernte Zuordnungen und sortiert betroffene Artikel neu ein. `ABT_IDS`/`ABT_NAME` sind jetzt
  veränderlich (`aktualisiereAbteilungen()`); unbekannte Abteilungs-IDs (z. B. auf einem anderen Gerät gelöscht) werden neu bestimmt.
- **Abteilungen umbenennen**: Namen im Laufweg antippen. Mitgelieferte Abteilungen bekommen einen Namen **nur für diesen Laden**
  (`p.namen = { abtId: name }`, leer = ursprünglicher Name). Eigene Abteilungen haben einen Namen für alle Läden. Angezeigt
  wird überall `abtName(a)` mit dem aktiven Laden.
- **Bugfix Scanner** („bricht ab ohne Fehlermeldung“): Seit Runde 13 übergab der Scan-Knopf oben das Klick-Ereignis als
  `beiQr`. Der Scanner lief deshalb im Kundenkarten-Modus und warf nach dem Treffer einen TypeError, nachdem er sich schon
  geschlossen hatte: Er verschwand kommentarlos. Außerdem beendete zxings `decodeContinuously` die Suche still bei jedem
  Lesefehler außer „nicht gefunden“/Prüfsumme/Format. Jetzt gibt es eine eigene Leseschleife (`scanLeser`), die jedes Bild neu
  versucht. Nach 25 Fehlern in Folge erscheint ein Hinweis, eine beendete Kamera zeigt „Tippen, um neu zu starten“. Weitere Fixes:
  Die Kamera geht aus, wenn während der Freigabe abgebrochen wurde; „Nummer eingeben“ nimmt Leerzeichen/Bindestriche und meldet
  ungültige Eingaben; die Produktsuche fängt Fehler ab, statt mit Ladekreis hängen zu bleiben.
- Selbsttest 288/288 (neu: Positionen, Ziehen mit Touch-Ereignissen, eigene Abteilungen, Umbenennen, Löschen, Kamera-Scan
  mit Canvas als Kamera und gestörtem Leser über den echten Knopf; mit der alten Knopf-Bindung schlägt er fehl).
  `sw.js` VERSION `einkauf-24`.
- Offen, nur auf dem iPhone prüfbar: langes Drücken und Ziehen in Safari (Textauswahl/Callout sind abgeschaltet), Kamera-Scan.

### Anpassung 29.09.2026: Kundenkarte kleiner
- 2D-Codes (QR, Aztec, Data Matrix) an der Kasse jetzt so groß wie in Apple Wallet: `min(48vw, 30vh, 210px)` statt
  `min(88vw, 58vh, 480px)`, auf dem iPhone ≈ 190 pt mit Ruhezone, Code selbst ≈ 35 % der Breite. Zu große Codes lesen
  Kassenscanner schlechter. Strichcodes unverändert. `sw.js` VERSION `einkauf-25`.

### Abweichungen vom Entwurf unten
| Thema | Entwurf | Umsetzung |
|---|---|---|
| Wraps | Kühlregal | **Brot & Backwaren** (liegen dort im Regal) |
| Abteilung 8 | „Kühlregal vegetarisch & Frischteig“ | heißt „Tofu, Frischteig & Feinkost“ |
| Enter bei unbekanntem Begriff | übernimmt Korrektur | übernimmt den ersten Vorschlag, wenn er vom Getippten abweicht (Ergänzung aus Verlauf/Katalog oder Korrektur): „Tomatenkonz“ → Tomatenkonzentrat |
| Erster Start | leerer Verlauf | Verlauf ist mit der Beispielliste vorbefüllt, damit Chips und Autovervollständigung sofort etwas anbieten |
| Claude-Modell | offen | `claude-opus-5`, `effort: low`, strukturierte Ausgabe (`output_config.format` json_schema), `fallbacks: "default"` mit Beta-Header `server-side-fallback-2026-07-01`. Kosten grob 2–3 Cent pro Foto |
| Barcode ohne Kamera | — | Knopf „Nummer eingeben“ im Scanner |

---

## Entwurf: Einkaufsliste als iPhone-Web-App

### Kontext

Du willst eine Einkaufsliste für Supermarkt und Drogerie, die schneller geht als Papier oder die
Notizen-App. Artikel sollen sich selbst einer Abteilung zuordnen und nach dem Laufweg des jeweiligen
Ladens sortiert erscheinen. Laden-Profile halten fest, wie ein Markt aufgebaut ist (z. B. REWE
Hauptstraße, LIDL am Bahnhof, dm). Stammartikel sollen von selbst wieder auf der Liste
landen. Barcode-Scan und Rezeptfotos sparen das Abtippen. Das Design ist schlicht, ohne Emojis, und
ein Artikel ist mit sehr wenigen Taps eingetragen.

Deine Antworten auf die Rückfragen:
- Nur du benutzt die App, auf einem iPhone. Die Daten bleiben lokal, es gibt keinen Server und kein Konto.
- Die App wird über **GitHub Pages** gehostet. Dadurch läuft sie über HTTPS, der Live-Barcode-Scan
  funktioniert, du kannst sie zum Home-Bildschirm hinzufügen und sie läuft offline.
- Rezepte kommen auf zwei Wegen in die Liste: Text einfügen (iOS Live Text) als Standard, und
  zusätzlich Fotoerkennung über die Claude-API, wenn ein Schlüssel hinterlegt ist.
- Stammartikel stehen nach „Einkauf abschließen“ von selbst wieder auf der Liste.
- Abgehakte Artikel rutschen grau ans Ende der Liste.
- Ein Profil legt die Reihenfolge der Abteilungen fest und auch, welche Abteilungen es in dem Laden gibt.
- Zusätze: mehrere Artikel auf einmal eintragen, Chips für häufig gekaufte Artikel, Laden per
  Standort wählen, Kategorie korrigieren mit Lerneffekt.

### Dateien und Aufbau

Ordner `~/Claude/Einkaufsliste/` wird ein Git-Repository, das auf GitHub Pages veröffentlicht wird.
Es gibt keinen Build-Schritt, keine Installationen und zur Laufzeit keine CDN-Abhängigkeit.

| Datei | Inhalt |
|---|---|
| `index.html` | Die App: HTML, CSS und JS inline, im Stil von `Migraine/kopfschmerz.html` |
| `katalog.js` | Artikelkatalog (etwa 600 deutsche Begriffe mit Synonymen und Abteilung). Liegt getrennt, damit er leicht zu pflegen ist |
| `vendor/zxing.min.js` | Barcode-Bibliothek, einmalig per `curl` heruntergeladen und ins Repo gelegt (Safari kennt kein `BarcodeDetector`) |
| `sw.js` | Service Worker, der alle Dateien cacht. So läuft die App auch bei schlechtem Empfang im Laden. Der Cache-Name ist versioniert, damit Updates ankommen |
| `manifest.webmanifest`, `icon-180.png` | Home-Bildschirm-Icon und App-Name |
| `PLAN.md` | Dieser Plan mit einem Abschnitt „Stand“ ganz oben, wie beim Migräne-Projekt |

Von `kopfschmerz.html` werden übernommen: die iOS-Meta-Tags (`apple-mobile-web-app-capable`,
`viewport-fit=cover`, `apple-mobile-web-app-title`), das Safe-Area-Padding
(`env(safe-area-inset-*)`), die Systemschrift und das Muster des Selbsttests (`?test`, geprüft
über `URLSearchParams`).

### Datenmodell (localStorage, JSON)

- `liste`: `[{id, name, menge, abteilung, stamm, erledigt, erledigtUm, marke?, ean?, pausiert?}]`,
  gespeichert in der Reihenfolge der Eingabe.
- `verlauf`: `{normName: {name, anzahl, zuletzt, abteilung, stamm, ean?}}`. Daraus speisen sich
  Autovervollständigung, Häufig-Chips und die gelernten Kategorien.
- `korrekturen`: `{normName: abteilung}`. Von dir korrigierte Kategorien haben immer Vorrang.
- `profile`: `[{id, name, reihenfolge:[abteilungId], ausgeblendet:[abteilungId], ort?:{lat, lon}}]`
  und `aktivesProfil`.
- `einstellungen`: Ansicht, Claude-API-Schlüssel (liegt nur im Gerät), Standortautomatik an/aus.
- Export und Import der gesamten Daten als eine JSON-Datei, zur Sicherung.

### Abteilungen (Standard-Laufweg, pro Profil änderbar)

1. Gemüse · 2. Obst · 3. Brot & Backwaren · 4. Molkerei & Eier · 5. Käse · 6. Fleisch & Wurst ·
7. Fisch · 8. Kühlregal vegetarisch & Frischteig (Tofu, Schupfnudeln, Wraps) · 9. Frühstück &
Cerealien · 10. Nudeln, Reis & Beilagen · 11. Konserven & Saucen · 12. Öl, Essig & Gewürze ·
13. Backzutaten · 14. Süßes & Snacks · 15. H-Milch & Pflanzendrinks · 16. Getränke ·
17. Tiefkühl · 18. Drogerie & Körperpflege · 19. Haushalt & Putzen · 20. Sonstiges

Mitgelieferte Profile: „Supermarkt“ mit allen Abteilungen und „Drogerie“, in dem nur 18 und 19
sichtbar sind. In einem Profil ausgeblendete Abteilungen stehen eingeklappt unter
„Nicht in diesem Laden“.

### Klassifizierung und Rechtschreibkorrektur

Die Funktion `klassifiziere(name)` prüft der Reihe nach:
1. deine Korrektur (`korrekturen`)
2. die gelernte Abteilung aus dem Verlauf
3. einen exakten Treffer im Katalog oder bei einem Synonym. Vorher wird der Name normalisiert:
   Kleinschreibung, ß/Umlaute vereinheitlicht, Pluralendungen und Satzzeichen entfernt, „Bio“,
   „laktosefrei“ und „minus L“ als Zusatz abgetrennt
4. das Grundwort eines zusammengesetzten Worts, also den längsten Katalogeintrag am Wortende
   („Räucher**forelle**“ wird zu Fisch). Explizite Katalogeinträge schlagen dabei das Grundwort
   („Hafermilch“ landet bei Pflanzendrinks, obwohl es auf „milch“ endet)
5. unscharfe Suche (Damerau-Levenshtein, bis 1 Fehler bei ≤ 5 Buchstaben, sonst bis 2):
   „Broccholi“ wird zu Brokkoli, „Schupfnudelm“ zu Schupfnudeln, „Halumi“ zu Halloumi,
   „Ruccola“ zu Rucola
6. sonst „Sonstiges“, mit dezenter Markierung. Ein Tap auf die Markierung weist die Abteilung zu.

Führende Mengen werden erkannt: „2 Milch“ und „2x Milch“ ergeben `menge=2`. Gibst du einen Artikel
ein, der schon offen auf der Liste steht, wird er nicht doppelt angelegt, sondern seine Menge
erhöht, und die Zeile blinkt kurz auf. Deine Beispielliste enthält „Zucchini“ und „Balsamico“ je
zweimal; genau dieser Fall wird damit abgefangen.

### Bedienung

**Oben** steht das Eingabefeld, das beim Öffnen der App sofort den Fokus hat. Darunter wechselt ein
Umschalter zwischen **Liste** (Reihenfolge der Eingabe) und **Laden** (nach Abteilungen
gruppiert). In der Laden-Ansicht steht der Profilname mit einem Auswahlmenü daneben.

**Eintragen:**
- Beim Tippen erscheinen darunter bis zu 5 Vorschläge: zuerst Präfix-Treffer aus dem Verlauf,
  sortiert nach Häufigkeit, dann aus dem Katalog, dann Korrekturen.
- Ist das Getippte unbekannt, zeigt der erste Vorschlag die Korrektur („Brokkoli“). Enter oder ein
  Tap übernimmt ihn.
- Die Eingabe „Milch, Eier und 2 Tomaten“ wird bei `,`, `;`, „und“ und Zeilenumbrüchen getrennt und
  ergibt drei Einträge. Das funktioniert auch mit dem iOS-Diktat.
- Bei leerem Feld stehen 8 bis 12 Chips mit den häufigsten Artikeln bereit, die gerade nicht auf der
  Liste sind. Ein Tap setzt den Artikel auf die Liste.
- Rechts im Feld sitzen zwei Symbole (als SVG-Strichzeichnungen): **Barcode** und **Rezept**.

**Im Laden:**
- Ein Tap auf den Kreis hakt den Artikel ab. Er rutscht dann grau ans Ende (in der gruppierten
  Ansicht ans Ende seiner Abteilung). Ein weiterer Tap holt ihn zurück.
- Nach links wischen löscht den Artikel, mit „Rückgängig“-Hinweis. Bei Stammartikeln heißt die
  Aktion „Diesmal nicht“ und pausiert den Artikel bis zum nächsten Abschluss.
- Ein Tap auf den Namen öffnet ein Detailblatt: Menge (− / +), Abteilung (die Korrektur wird
  gelernt), Schalter „Wird immer benötigt“, Marke/Notiz.
- „Einkauf abschließen“ schreibt die erledigten Artikel in den Verlauf und entfernt sie von der
  Liste. Erledigte oder pausierte Stammartikel kommen unabgehakt zurück.

**Einstellungen:** Profile anlegen, umbenennen und löschen. Pro Profil lässt sich die Reihenfolge
der Abteilungen per Ziehen (Griff an der Zeile) ändern, jede Abteilung ein- oder ausblenden und
mit „Standort dieses Ladens übernehmen“ der aktuelle Ort speichern. Außerdem gibt es hier den
Claude-API-Schlüssel, Export/Import und die Verwaltung der Stammartikel.

**Design:** Systemschrift, weißer bzw. im Dunkelmodus dunkler Hintergrund, eine Akzentfarbe, feine
Trennlinien, Tippflächen mindestens 44 px hoch, keine Emojis, Symbole als inline-SVG.

### Barcode-Scan

- Ein Tap auf das Barcode-Symbol öffnet eine Vollbild-Kameravorschau (`getUserMedia`, Rückkamera).
  Die Erkennung läuft über `BarcodeDetector`, wo es das gibt, sonst über ZXing, beschränkt auf
  EAN-13, EAN-8 und UPC.
- Zur erkannten EAN wird zuerst im eigenen Verlauf nachgesehen (dann funktioniert es auch offline),
  danach bei Open Food Facts, Open Beauty Facts und Open Products Facts (`/api/v2/product/{ean}`,
  kostenlos, ohne Schlüssel). Aus den Antworten entsteht ein Eintrag „Marke Produktname Menge“, die
  Abteilung wird aus `categories_tags` abgeleitet.
- Ein Bestätigungsblatt zeigt den Namen editierbar an. Ein Tap auf „Hinzufügen“ setzt den Artikel
  auf die Liste, und die Zuordnung EAN → Name wird gemerkt.
- Wird das Produkt nicht gefunden, trägst du den Namen einmal von Hand ein. Er bleibt dann für diese
  EAN gespeichert.

### Rezept übernehmen

Ein Tap auf das Rezept-Symbol öffnet ein Blatt mit zwei Wegen:
- **Text einfügen:** Im Foto markierst du den Text mit iOS Live Text, kopierst ihn und fügst ihn
  ein. Ein lokaler Parser entfernt Mengen und Einheiten (g, kg, ml, l, EL, TL, Prise, Stk, Dose,
  Bund, Zehe, Pck. …), Zusätze nach dem Komma („Zwiebel, fein gewürfelt“) und Klammern. Danach
  werden die Namen über `klassifiziere()` abgeglichen.
- **Foto wählen** (nur mit API-Schlüssel): Das Bild wird verkleinert und an die Claude-API
  geschickt, mit dem Header `anthropic-dangerous-direct-browser-access`. Über Tool-Use kommt die
  Antwort als festes JSON zurück: `[{name, abteilung}]`. Modell und Kosten werden bei der Umsetzung
  mit dem Skill `claude-api` festgelegt und nicht aus dem Gedächtnis.
- Beide Wege enden im selben **Prüfblatt**: Alle Zutaten sind vorausgewählt. Was schon auf der Liste
  steht oder typischer Vorrat ist (Salz, Pfeffer, Öl, Mehl, Zucker), ist bereits abgewählt und so
  gekennzeichnet. Du tippst weg, was du noch hast, und ein Tap auf „n Artikel hinzufügen“ übernimmt
  den Rest.

### Laden per Standort

Ist die Automatik eingeschaltet, fragt die App beim Öffnen einmal den Standort ab
(`getCurrentPosition`, Timeout 5 s). Liegt ein Profil mit gespeichertem Ort im Umkreis von 250 m,
wird es aktiv und die Ansicht springt auf „Laden“. Einschränkung: Eine App auf dem Home-Bildschirm
fragt unter iOS eventuell bei jedem Start erneut nach der Erlaubnis. Stört das, bleibt die
Automatik aus; das Profil lässt sich dann mit einem Tap wechseln.

### Umsetzungsreihenfolge

1. Grundgerüst: Datenmodell, Liste, Eintragen, Mengen, Abhaken, Abschließen, Stammartikel, Detailblatt, Export/Import
2. `katalog.js` und `klassifiziere()`, Laden-Ansicht, Profile, Einstellungen mit Sortieren per Ziehen
3. Autovervollständigung, Rechtschreibkorrektur, Mehrfacheingabe, Häufig-Chips
4. Git-Repo, GitHub Pages, Manifest, Icon, Service Worker (offline). **Erst ab hier läuft die App auf dem iPhone**
5. Barcode-Scan und Produktsuche
6. Rezept: Einfügen und Parser, dann Claude-Foto, dann das gemeinsame Prüfblatt
7. Standortautomatik
8. `PLAN.md` mit „Stand“ anlegen, Speicher-Eintrag für das Projekt ergänzen

Für Schritt 4 brauchst du ein GitHub-Konto (kostenlos). Das Repository muss öffentlich sein, damit
GitHub Pages kostenlos funktioniert. Öffentlich ist dann nur der Code; deine Liste und der
API-Schlüssel bleiben auf dem iPhone. Vor dem ersten Push frage ich nach.

### Prüfung

- **Selbsttest `index.html?test`:** Deine Beispielliste läuft komplett durch `klassifiziere()` und
  jeder Artikel landet in der erwarteten Abteilung (z. B. Deo, Ajona und Wattepads in Drogerie,
  Spülmittel in Haushalt, Halumi wird zu Halloumi und landet bei Käse, Erbsen bei Tiefkühl). Außerdem
  getestet werden: Mengenerkennung, Mehrfacheingabe, Zusammenführen von Duplikaten, der Kreislauf
  der Stammartikel beim Abschluss, der Rezept-Parser mit Beispieltexten und die
  Kategorie-Zuordnung aus Open Food Facts.
- **Mac:** Safari mit schmalem Fenster (~380 px) für WebKit-Layout und Dunkelmodus. Headless Chrome
  für Screenshots (mit `perl -e 'alarm 40; exec …'` begrenzen und danach aufräumen). Details siehe
  Speicher-Eintrag „Testen ohne iPhone“.
- **iPhone, durch dich:** Kamera-Scan, Standort, Home-Bildschirm, Offline-Betrieb (Flugmodus) und
  Claude-Foto lassen sich nur auf dem echten Gerät verlässlich prüfen. Ich sage bei jedem Schritt
  dazu, was ich am Mac getestet habe und was noch offen ist.
