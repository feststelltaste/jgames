# Capybara-Modenschau – Zeichenanleitung

Alle Grafiken sind Inline-SVG-Schnipsel in JS-Dateien (laden auch über `file://`).
Gezeichnet wird von Hand im gemeinsamen Koordinatensystem; es gibt **keine** Transformation
pro Teil: Jedes Teil wird deckungsgleich über das Capybara gelegt.

## Dateien

| Datei | Inhalt |
|---|---|
| `capybara.js` | setzt `window.ART` (Capybara, Arme, Orange, Anker, Farben, Helfer). Muss zuerst geladen werden. |
| `kopf.js` | Hüte, Masken, Frisuren |
| `ober.js` | Kleidung (Fach „Kleidung“) |
| `extra.js` | Schal, Fliege, Ketten, Rucksack, Umhang … |
| `hand.js` | Zubehör: Handgegenstände, aber auch Brille, Monokel, Boxhandschuhe, Schwimmring |

Jede Kategorie-Datei ist ein IIFE und fügt Einträge hinzu:

```js
ART.items['<id>'] = {
  box: [x, y, w, h],     // Umriss des Teils (für das Vorschaubild im Auswahlraster), eng anliegend
  svg: '<g>…</g>',       // normale Ebene (siehe Ebenen)
  top: '<g>…</g>',       // optional: Ebene ÜBER den Armen (Ärmel, Handschuhe, Schild …)
  back: true,            // optional: ganzes Teil HINTER dem Capybara (Umhang, Rucksack-Rückseite)
  keepOrange: true       // nur Kopf: die Orange bleibt sichtbar (Teil bedeckt den Scheitel nicht)
};
```

- `<id>` = exakt die `id` aus `ITEMS` in `index.html` (inkl. Umlaute, z. B. `fäustlinge`, `säbel`).
  Name, Fach und Punkte bleiben in `index.html`; `box`/`back` kommen nur noch aus `ART`.
- Gibt es für eine id einen `ART`-Eintrag, wird die alte Grafik aus `../anziehen/` nicht mehr benutzt.
- `index.html` muss für neue Teile nicht angepasst werden.

## Koordinatensystem und Anker (`ART.anchors`)

Zeichenfläche **240 × 300**, x nach rechts, y nach unten, Mitte x = 120. „Links“ = links im Bild.

| Anker | Wert |
|---|---|
| Scheitel (Kopfoberkante Mitte) | (120, 54) |
| Hutlinie (Krempe / Hutband sitzt hier) | y = 64, Kopfbreite dort x 65 … 175 |
| Ohren (Kreise r 10) | (69, 71), (171, 71) – seitlich am Kopf, Oberkante y ≈ 61 |
| Kopfmitte | (120, 110); Kopf x 61 … 179, y 54 … 168 |
| Augen (rx 7, ry 8) / Augenlinie | (96, 92), (144, 92); Brauen bei y ≈ 78 |
| Nase / Mund / Kinn | (120, 117) / (120, 134) / (120, 168) |
| Wangen | (77, 127), (163, 127) |
| Hals / Kragen | (120, 158), Breite ca. x 96 … 144 |
| Schultern (Armansatz) | (80, 175), (160, 175) |
| Brust / Bauch | (120, 190) / Bauch-Ellipse (120, 224) rx 33 ry 37 |
| Körper | `anchors.bodyPath`, x 66 … 174, y 146 … 274 |
| Pfote links (Griffpunkt) | (60, 218) – Arm hängt locker nach unten-außen |
| Pfote rechts (Griffpunkt) | (186, 200) – Arm leicht angehoben, hält Gegenstände |
| Armverlauf | `anchors.armPaths.L/R` (quadratische Kurve Schulter → Pfote), Armdicke 21 inkl. Kontur, Pfote r 11.5 |
| Füße / Boden | (100, 292), (140, 292); Boden y = 292 |

Oberer Freiraum y 0 … 54 ist für hohe Hüte da (nicht über y = 0 hinaus zeichnen).
Seitlich ist bis x 0 bzw. 240 Platz für Handgegenstände (Säbel, Flagge, Schild).
Referenzbild mit eingezeichneten Ankern: siehe Pfad in der Übergabe (Scratchpad, nicht im Repo).

## Ebenen (von hinten nach vorne)

1. `back`-Teile (`svg`)
2. Capybara (`ART.capy`: Beine, Körper, Kopf – ohne Arme)
3. `svg` der Teile in Reihenfolge `ober` → `extra` → `kopf` → *(Orange)* → `hand`
4. Arme mit Pfoten (`ART.arms`)
5. `top` aller Teile in derselben Reihenfolge

Daraus folgt:
- **Oberteile** zeichnen den Rumpf in `svg` (Körper bis Hals abdecken, Umriss an `bodyPath`
  orientieren, gern 2–4 Einheiten darüber hinaus). Ärmel kommen in `top`, dafür gibt es den Helfer
  `ART.sleeves(farbe, { short: true, cuff: '#fff', stroke: kontur, pattern: '<…>' })`
  (liefert beide Ärmel passend über den Armen; lange Ärmel enden am Handgelenk, Pfoten bleiben frei).
  Eigene Ärmel: `ART.armPath('L'|'R', t)` liefert das Teilstück 0…t des Arms als Pfad-`d`.
- **Handgegenstände** in `svg`: Der Griff läuft durch den Griffpunkt; die Pfote (Ebene 4) liegt
  automatisch darüber und „umschließt“ den Griff. Griffdicke 5–8, Gegenstand ragt ober- und
  unterhalb der Pfote heraus. Rechte Pfote (186, 200) ist die Standardhand; die linke (60, 218)
  z. B. für den Schild.
- Dinge, die **vor** Pfote/Arm liegen müssen (Boxhandschuhe über den Pfoten, Schild vor dem linken
  Arm, Riemen über den Armen), gehören in `top`.
- **Kopf**: Brillen, Masken, Monokel liegen in `svg` (Arme überdecken das Gesicht nie).
  Die Orange wird nur gezeichnet, wenn kein Hut getragen wird oder der Hut `keepOrange` hat;
  sie liegt dann über dem Hut-`svg` (z. B. vor dem Bügel der Ohrenschützer, in der Helmkuppel).
- Krempen: hintere Krempe zuerst, dann Hutkopf, dann vorderer Krempenteil (siehe `frontBrim` in `kopf.js`).

## Stil

- Kinder-App-Look: klare, weiche Formen, runde Enden (`stroke-linecap/linejoin="round"`), freundlich.
- **Kontur** überall `ART.colors.outline` = `#5b3a24` (dunkles Braun, nie Schwarz):
  Hauptumriss `stroke-width="2.5"`, Details/Innenlinien `1.5`–`2`.
- **Farben**: kräftig, aber nicht grell; je Fläche eine Grundfarbe plus **ein** dunklerer Schattenton.
  Capybara: Fell `#c98c55`, Schatten `#a96e3d`, hell `#ecc293`, Nase `#6e4529`, Wangen `#ff8a8a`.
- **Licht von oben links**: Schatten als eigene, randlose Fläche rechts/unten innerhalb der Form
  (Muster: Fläche füllen → Schattenfläche → Umriss als `fill="none"` darüber, damit die Kontur sauber bleibt).
  Glanzlicht: kleine weiße Ellipse links oben, `opacity .2–.35`.
- Keine `id`s, keine Verläufe (`<linearGradient>`), keine Filter, keine Masken/Clip-Pfade, keine Texte
  und keine externen Bilder: Die Schnipsel werden mehrfach gleichzeitig inline eingebettet
  (Bühne, Vorschaubilder, Album) und für den Foto-Export als Bild gerendert.
- Transparenz nur sparsam (Glas, Visier, Glanz), Transformationen nur innerhalb eines Teils
  (z. B. `rotate` für eine Ellipse) – nie um das Teil aufs Capybara zu schieben.
- Teile müssen im Vorschaubild (ca. 64–88 px) erkennbar sein: klare Silhouette, ein typisches Detail.
- `box` eng um das ganze Teil inkl. Kontur (`svg` und `top`) legen; das Raster ergänzt selbst Rand.

## Prüfen

- `node --check art/<datei>.js`
- Spiel über einen lokalen HTTP-Server öffnen (`python3 -m http.server` im Repo-Root,
  dann `/anziehen_2/`), im Ankleidezimmer jedes Teil anziehen, dazu Kombinationen mit den
  anderen Fächern (Ärmel über Armen, Pfote über Griff, Umhang hinter dem Körper), Foto-Export testen.
