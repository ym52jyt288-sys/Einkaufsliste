# Einkaufsliste – Plan und Stand

## Stand — 24.09.2026

**Online unter https://ym52jyt288-sys.github.io/Einkaufsliste/** (GitHub Pages, Repo `ym52jyt288-sys/Einkaufsliste`, Branch `main`).
Selbsttest online 80/80. Prüfung auf dem iPhone durch den Nutzer steht noch aus.

| Datei | Zweck |
|---|---|
| `index.html` | App (HTML/CSS/JS inline), Selbsttest mit `index.html?test` |
| `katalog.js` | Abteilungen, ~1.500 Begriffe mit Synonymen, Vorratsliste, Open-Food-Facts-Zuordnung. `~` vor einem Synonym = Falschschreibung, die zum Hauptnamen korrigiert wird |
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
