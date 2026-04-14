# Matrix Admin Invaders — README

██████  retro • neon • technical ██████

Willkommen zur lokalen Microsite-Erweiterung „Matrix Admin Invaders" — einem kleinen, gutmütigen Easter‑Egg-Spiel eingebettet in die Matrix‑Geburtstags‑Microsite für Karsten.

Inspiration
-----------
Dieses Projekt wurde inspiriert von klassischem Arcade‑Feeling, Admin‑Humor und einer Wertschätzung für verlässliche Kollegen. Es ist eine Hommage an Karsten (Happy 52!) und an die Tage, in denen Infrastruktur ebenso viel Herz hatte wie Logs.

Projekt-Layout (Wichtig)
------------------------
matrix-karsten-birthday/
  index.html                # Hauptseite (Matrix-Microsite)
  css/
    style.css               # Haupt-UI Styles
    matrix-admin-invaders.css     # Easter-Egg Styles (Matrix Admin Invaders look)
  js/
    app.js                  # Haupt-Story-Logik + lazy-loader für das Easter-Egg
    matrix-admin-invaders.js      # Easter-EGG Game + Credits-Scroll (Matrix Admin Invaders)
  img/
    erinnerung1.jpg         # Erinnerungsbilder (können fehlen)
    erinnerung2.jpg
    erinnerung3.jpg
  README.md                 # Diese Datei

Funktionsübersicht (technisch)
-------------------------------
- Das Easter‑Egg ist ein overlay-basiertes Canvas‑Spiel, das erst geladen wird, wenn ein geheimer Trigger ausgelöst wird.
- Loader: `js/app.js` enthält `loadStylesheetOnce()` und `loadScriptOnce()` und lädt bei Trigger die Dateien `css/space-invanders.css` und `js/space-invanders.js`.
- Trigger:
  - Desktop: Tippe die Buchstabenfolge `k a r s t e n` (beliebig schnell). Bei vollständiger Sequenz startet das Spiel.
  - Mobile: 5-facher Klick auf den grünen Statuspunkt im Header innerhalb kurzer Zeit.
- Game-Design:
  - Zwei Levels (kurz und spielerfreundlich). Easy-Mode aktiviert (mehr Leben, langsamere Gegner).
  - Controls: Pfeil links/rechts oder `A`/`D` und `Space` zum Schießen.
  - HUD zeigt Level/Score/Leben in Echtzeit.
- Credits:
  - Nach Sieg startet automatisch eine filmische Credits‑Sequenz (von unten nach oben scrollend), Kapitel enthalten technische-emotionale Texte über die Beziehung zu Karsten.
  - Am Ende der Credits wird ein `Spiel neu starten` Button freigegeben.

Dateiname‑/Display‑Hinweis
--------------------------
- Aus Kompatibilitätsgründen behalten die CSS/JS-Dateien weiterhin den Namen `space-invanders.*` im Dateisystem (so wird der Lazy-Loader in `app.js` nicht gebrochen).
- Die sichtbare Bezeichnung innerhalb des Overlay wurde auf **"Matrix Admin Invaders"** geändert.

Integration / Laufzeit
---------------------
- Öffnen: `index.html` per Doppelklick im Browser (kein Webserver nötig).
- Sobald das Overlay geladen ist, kannst du `Start` drücken oder die Tastenkombination verwenden.
- Das Script nutzt nur DOM APIs und Canvas; keine externen Bibliotheken.

Anpassungspunkte
-----------------
Wenn du das Spiel umbenennen möchtest (auch Dateinamen):
- Ersetze Verweise in `js/app.js` (zeile mit `loadStylesheetOnce("css/space-invanders.css")` und `loadScriptOnce("js/space-invanders.js")`) und benenne die Dateien entsprechend um.

Retro-Style Hinweise (für Entwickler-Ästhetik)
---------------------------------------------
- Farben: grün/neon auf dunklem Hintergrund, Scanlines, leichte Glitch Effekte.
- Schrift: monospace (Consolas/Courier) für Terminal-Feeling.
- Animationsdauer: bewusst moderat, für „filmische“ Präsentation.

Sicherheit und Verantwortung
---------------------------
- Alle Terminalausgaben, Befehle und Intune-Beispiele sind rein fiktiv und dienen nur der Atmosphäre.
- Keine schadhaften Aktionen, keine echten Scripts, keine Netzwerkzugriffe außerhalb dem Laden der lokalen Dateien.

Kontakt / Notes
---------------
Wenn du Änderungen möchtest (z. B. Dateiumbenennung, Difficulty‑Presets, zusätzliche Kapitel im Credits), sag kurz Bescheid — ich kann die Anpassungen sauber durchführen.

Have fun — und vergiss nicht: Happy 52, Karsten.
