RELEASE v1.0.0 — Matrix Admin Invaders
=====================================

Datum: 2026-04-14
Format: lokal, statisch (kein Server erforderlich)

Retro-Intro
-----------
> _neon • tape-reel log • green-on-black_

Achtung: Dies ist eine kleine, lokale Microsite-Release-Hauptauslieferung mit einem versteckten Easter‑Egg: "Matrix Admin Invaders" — ein 2-Level Canvas-Arcade-Bonus mit filmischem Credits-Scroll, entwickelt als persönliche Hommage an Karsten (Happy 52).

Highlights
---------
- Neues Easter‑Egg overlay: `Matrix Admin Invaders` (ehemals `space-invanders`) mit 2 Levels und Easy-Mode.
- Automatische Credits-Sequenz nach Sieg: filmischer Roll-Scroll (Matrix-Stil), Kapitel zur Geschichte mit Karsten.
- Dynamisches Lazy-Loading: Spielressourcen werden nur geladen, wenn das Easter‑Egg ausgelöst wird.
- Robuste Bild‑Fallbacks für Erinnerungsfotos — funktioniert auch, wenn lokale Bilder fehlen.
- Responsive UI und Mobile‑Tap-Trigger (5× Tap auf den grünen Punkt).

Wichtige Dateien (neu/aktualisiert)
----------------------------------
- `index.html` — Hauptseite, enthält Story-Flow und Easter‑Egg-Trigger.
- `css/style.css` — globale Styles (Matrix Microsite look).
- `css/matrix-admin-invaders.css` — Styles für das Easter‑Egg + Credits.
- `js/app.js` — Hauptlogik; enthält lazy-loader und Tastatur-/Tap‑Trigger.
- `js/matrix-admin-invaders.js` — Spiel‑Logik, Canvas, Credits-Scroll und Restart-Flow.
- `README.md` — Retro‑80s technische Dokumentation.
- `release.md` — diese Datei.
- `img/erinnerung1.jpg` `erinnerung2.jpg` `erinnerung3.jpg` — Erinnerungsbilder (optional).

Trigger / How to run (quick)
----------------------------
1. Doppelklick auf `index.html` im Browser (lokal). no server required.
2. Secret trigger:
   - Desktop: Tippe die Buchstabenfolge `k a r s t e n` (beliebig schnell).
   - Mobile: 5× schnell auf die grüne Status‑Pille oben links klicken.
3. Overlay öffnet sich — klicke `Start` oder benutze `A`/`D` / Pfeile + `Space`.
4. Nach Sieg läuft automatisch die Credits‑Sequenz; am Ende: `Spiel neu starten`.

Changelog — v1.0.0
------------------
- Init: komplette Implementierung Easter‑Egg (Canvas), Credits, Image fallbacks.
- Feature: Lazy load CSS/JS für Egg (keine Bibliotheken).
- Feature: 2-Level-Game, Easy mode tuned for smooth play.
- Content: Credits-Kapitel mit technischen-emotionalen Inhalten über Karsten.
- Docs: README im Retro-80s Stil + diese Release‑Notes.

Notes & Dev Hints
-----------------
- Der Loader in `js/app.js` lädt `css/matrix-admin-invaders.css` und `js/matrix-admin-invaders.js`.
- Wenn du die Dateinamen ändern möchtest, aktualisiere die Pfade in `js/app.js` (funktion `loadStylesheetOnce` / `loadScriptOnce`).
- Kein externer Netzwerkzugriff; alles lokal.
- Für schnelle Tests: öffne die DevTools und löse die Tastensequenz manuell oder aktiviere das Overlay mit `SpaceInvanders.start()` (Console) falls geladen.

Credits
-------
Design & Implementation: Assisted edit by automation + human prompts
Special dedication: Karsten — 52

End of Release Notes
--------------------
Enjoy — and don’t forget to message Karsten.
