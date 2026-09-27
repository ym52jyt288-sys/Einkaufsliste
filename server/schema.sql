/* Eine Zeile ohne Kommentare, weil die D1-Konsole eingefügten Text zu einer Zeile zusammenzieht.
   id: aus dem Sync-Schlüssel abgeleitet (SHA-256) · version: steigt bei jedem Schreiben (Konfliktprüfung)
   daten: verschlüsselt (AES-GCM), für den Server unlesbar · geaendert: Millisekunden, zum Aufräumen alter Räume */
CREATE TABLE IF NOT EXISTS raum (id TEXT PRIMARY KEY, version INTEGER NOT NULL, daten TEXT NOT NULL, geaendert INTEGER NOT NULL);
