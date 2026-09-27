CREATE TABLE IF NOT EXISTS raum (
  id TEXT PRIMARY KEY,          -- aus dem Sync-Schlüssel abgeleitet (SHA-256), nicht der Schlüssel selbst
  version INTEGER NOT NULL,     -- steigt bei jedem Schreiben; Grundlage für die Konfliktprüfung
  daten TEXT NOT NULL,          -- verschlüsselt (AES-GCM), für den Server unlesbar
  geaendert INTEGER NOT NULL    -- Millisekunden, für das Aufräumen alter Räume
);
