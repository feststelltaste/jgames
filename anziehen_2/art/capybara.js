/* Capybara-Modenschau – Grafik: das Capybara.
   Koordinatensystem 240 x 300 (siehe STYLE.md). Diese Datei muss als erste der art/*.js geladen werden. */
(function () {
  'use strict';
  var O = '#5b3a24',      // Kontur (dunkles Braun)
    FUR = '#c98c55',      // Fell
    SH = '#a96e3d',       // Fell-Schatten
    LT = '#ecc293',       // Schnauze / Bauch
    NOSE = '#9b603a',
    EAR = '#8f5a36',
    EYE = '#2e1c10',
    CHEEK = '#ff8a8a';

  var BODY = 'M90 146C74 164 64 194 66 226C68 258 90 274 120 274C150 274 172 258 174 226C176 194 166 164 150 146Z';
  var HEAD = 'M120 52C157 52 176 76 177 108C178 142 158 170 120 171C82 170 62 142 63 108C64 76 83 52 120 52Z';
  var MUZZLE = 'M120 100C133 100 141 112 142 126C143 142 133 150 120 150C107 150 97 142 98 126C99 112 107 100 120 100Z';
  var LEG_L = 'M86 250V280Q86 292 100 292Q113 292 113 281V250Z';
  var LEG_R = 'M127 250V281Q127 292 140 292Q154 292 154 280V250Z';

  // Arme: Schulter -> Ellbogen (Kontrollpunkt) -> Pfote (Griffpunkt)
  var ARM = {
    L: { s: [80, 175], c: [58, 190], p: [60, 218] },
    R: { s: [160, 175], c: [182, 180], p: [186, 200] }
  };
  function armPath(a, t) {
    // Teilstück 0..t der quadratischen Kurve (de Casteljau)
    t = t == null ? 1 : t;
    var s = a.s, c = a.c, p = a.p;
    var c1 = [s[0] + (c[0] - s[0]) * t, s[1] + (c[1] - s[1]) * t];
    var m = [c[0] + (p[0] - c[0]) * t, c[1] + (p[1] - c[1]) * t];
    var e = [c1[0] + (m[0] - c1[0]) * t, c1[1] + (m[1] - c1[1]) * t];
    var r = function (v) { return Math.round(v * 10) / 10; };
    return 'M' + s[0] + ' ' + s[1] + 'Q' + r(c1[0]) + ' ' + r(c1[1]) + ' ' + r(e[0]) + ' ' + r(e[1]);
  }

  var capy =
    // Beine
    '<path d="' + LEG_L + '" fill="' + FUR + '" stroke="' + O + '" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<path d="' + LEG_R + '" fill="' + FUR + '" stroke="' + O + '" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<path d="M141 262V290Q152 290 154 280V262Z" fill="' + SH + '"/>' +
    '<path d="M95 292V286M104 292V286M136 292V286M145 292V286" stroke="' + O + '" stroke-width="1.6" stroke-linecap="round"/>' +
    // Körper
    '<path d="' + BODY + '" fill="' + FUR + '"/>' +
    '<path d="M150 146C166 164 176 194 174 226C172 258 150 274 120 274C146 266 162 248 163 222C164 196 158 170 144 150Z" fill="' + SH + '"/>' +
    '<ellipse cx="120" cy="224" rx="33" ry="37" fill="' + LT + '"/>' +
    '<path d="M104 262Q120 268 136 262" stroke="' + SH + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>' +
    '<path d="' + BODY + '" fill="none" stroke="' + O + '" stroke-width="2.5" stroke-linejoin="round"/>' +
    // Ohren: klein, abgerundet dreieckig, oben an den Kopfecken (wie beim Vorbild-Capybara)
    '<path d="M70 74Q62 50 76 45Q88 44 94 58Z" fill="' + FUR + '" stroke="' + O + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M74 66Q70 53 78 51Q85 51 88 59Z" fill="' + EAR + '"/>' +
    '<path d="M170 74Q178 50 164 45Q152 44 146 58Z" fill="' + FUR + '" stroke="' + O + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M166 66Q170 53 162 51Q155 51 152 59Z" fill="' + EAR + '"/>' +
    // Kopf: rund gewölbt
    '<path d="' + HEAD + '" fill="' + FUR + '"/>' +
    '<path d="M172 104C175 132 166 156 146 166C160 152 168 130 168 106Z" fill="' + SH + '" opacity=".7"/>' +
    '<ellipse cx="102" cy="66" rx="16" ry="5" fill="#fff" opacity=".2" transform="rotate(-8 102 66)"/>' +
    '<path d="' + HEAD + '" fill="none" stroke="' + O + '" stroke-width="2.5" stroke-linejoin="round"/>' +
    // Wangen: runde rosa Bäckchen neben der Schnauze
    '<circle cx="80" cy="124" r="9" fill="' + CHEEK + '" opacity=".7"/>' +
    '<circle cx="160" cy="124" r="9" fill="' + CHEEK + '" opacity=".7"/>' +
    // Augen: kleine Punkte
    '<circle cx="96" cy="94" r="6" fill="' + EYE + '"/><circle cx="94" cy="92" r="1.8" fill="#fff"/>' +
    '<circle cx="144" cy="94" r="6" fill="' + EYE + '"/><circle cx="142" cy="92" r="1.8" fill="#fff"/>' +
    // Schnauze: große, eiförmige, dunklere Fläche mit Näschen und Mund
    '<path d="' + MUZZLE + '" fill="' + NOSE + '"/>' +
    '<path d="M110 114L116.5 118.5L110 122M130 114L123.5 118.5L130 122" fill="none" stroke="' + O + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M120 124V131M111 133Q115.5 138 120 131Q124.5 138 129 133" fill="none" stroke="' + O + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';

  function armSvg(a, fingers) {
    var d = armPath(a), p = a.p;
    return '<path d="' + d + '" fill="none" stroke="' + O + '" stroke-width="21" stroke-linecap="round"/>' +
      '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11.5" fill="' + O + '"/>' +
      '<path d="' + d + '" fill="none" stroke="' + FUR + '" stroke-width="16" stroke-linecap="round"/>' +
      '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="' + FUR + '"/>' + fingers;
  }
  var arms =
    armSvg(ARM.L, '<path d="M55 219.5Q58 222.5 61 220M59 222.5Q62 225.5 65 223" fill="none" stroke="' + O + '" stroke-width="1.5" stroke-linecap="round"/>') +
    armSvg(ARM.R, '<path d="M180.5 198.5Q183.5 196.5 185.5 199M180.5 203Q183.5 201 185.5 203.5" fill="none" stroke="' + O + '" stroke-width="1.5" stroke-linecap="round"/>');

  // Die Orange auf dem Kopf (nur ohne Hut bzw. bei Teilen mit keepOrange)
  var orange =
    '<circle cx="120" cy="45" r="12" fill="#ff9d2e" stroke="' + O + '" stroke-width="2.5"/>' +
    '<path d="M127 38A12 12 0 0 1 124 56.2A10 10 0 0 0 127 38Z" fill="#e67d12" opacity=".7"/>' +
    '<ellipse cx="115.5" cy="40.5" rx="3.5" ry="2.2" fill="#fff" opacity=".6" transform="rotate(-30 115.5 40.5)"/>' +
    '<path d="M120 33.5V29" stroke="' + O + '" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M120.5 31Q126 25 132 28Q127 34 120.5 31Z" fill="#5cbf4a" stroke="' + O + '" stroke-width="1.5" stroke-linejoin="round"/>';

  // Ärmel-Helfer für Oberteile: liefert Ärmel über beiden Armen (für "top" eines Teils)
  // opt: { short: true (kurzer Ärmel), stroke: Konturfarbe, cuff: Farbe des Bündchens, pattern: zusätzliches SVG }
  function qpt(a, t) {
    var u = 1 - t;
    return [u * u * a.s[0] + 2 * u * t * a.c[0] + t * t * a.p[0], u * u * a.s[1] + 2 * u * t * a.c[1] + t * t * a.p[1]]
      .map(function (v) { return Math.round(v * 10) / 10; });
  }
  function sleeves(fill, opt) {
    opt = opt || {};
    var t = opt.short ? 0.45 : 0.78, st = opt.stroke || O, s = '';
    ['L', 'R'].forEach(function (k) {
      var a = ARM[k], d = armPath(a, t);
      s += '<circle cx="' + a.s[0] + '" cy="' + a.s[1] + '" r="12.5" fill="' + st + '"/>' +
        '<path d="' + d + '" fill="none" stroke="' + st + '" stroke-width="25"/>' +
        '<circle cx="' + a.s[0] + '" cy="' + a.s[1] + '" r="10" fill="' + fill + '"/>' +
        '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="20"/>';
      if (opt.cuff) {
        var c0 = qpt(a, t - 0.14), c1 = qpt(a, t);
        s += '<path d="M' + c0.join(' ') + 'L' + c1.join(' ') + '" stroke="' + opt.cuff + '" stroke-width="20"/>';
      }
    });
    return s + (opt.pattern || '');
  }

  window.ART = {
    size: [240, 300],
    capy: capy,
    arms: arms,
    orange: orange,
    colors: { outline: O, fur: FUR, furShade: SH, furLight: LT, nose: NOSE, cheek: CHEEK },
    sleeves: sleeves,
    armPath: function (side, t) { return armPath(ARM[side], t); },
    anchors: {
      headCenter: [120, 110],
      headTop: [120, 54],          // Scheitel (Kopfoberkante Mitte)
      hatLine: 64,                 // hier sitzt die Hutkrempe / das Hutband
      hatWidth: [65, 175],         // Kopfbreite auf der Hutlinie
      ears: [[80, 56], [160, 56]], // Ohren: abgerundete Dreiecke oben an den Kopfecken
      eyes: [[96, 94], [144, 94]], // Augen: Punkte r 6
      eyeLine: 92,
      nose: [120, 117],
      mouth: [120, 134],
      cheeks: [[77, 127], [163, 127]],
      chin: [120, 168],
      neck: [120, 158],            // Hals / Kragen, Breite ca. 96..144
      shoulders: [[80, 175], [160, 175]],
      chest: [120, 190],
      belly: [120, 224],           // Bauch-Ellipse rx 33 ry 37
      bodyPath: BODY,              // Körperumriss (x 66..174, y 146..274)
      headPath: HEAD,
      hands: { L: [60, 218], R: [186, 200] }, // Griffpunkte (Pfoten-Mittelpunkte, Radius 11.5)
      armPaths: { L: armPath(ARM.L), R: armPath(ARM.R) },
      feet: [[100, 292], [140, 292]],
      ground: 292
    },
    items: {}
  };
})();
