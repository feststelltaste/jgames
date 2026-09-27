/* Capybara-Modenschau – Grafik: das Capybara.
   Koordinatensystem 240 x 300 (siehe STYLE.md). Diese Datei muss als erste der art/*.js geladen werden. */
(function () {
  'use strict';
  var O = '#5b3a24',      // Kontur (dunkles Braun)
    FUR = '#c98c55',      // Fell
    SH = '#a96e3d',       // Fell-Schatten
    LT = '#ecc293',       // Schnauze / Bauch
    NOSE = '#6e4529',
    EAR = '#8f5a36',
    EYE = '#2e1c10',
    CHEEK = '#ff8a8a';

  var BODY = 'M90 146C74 164 64 194 66 226C68 258 90 274 120 274C150 274 172 258 174 226C176 194 166 164 150 146Z';
  var HEAD = 'M120 52C146 52 162 56 166 72C171 92 177 118 177 142C177 163 158 172 120 172C82 172 63 163 63 142C63 118 69 92 74 72C78 56 94 52 120 52Z';
  var MUZZLE = 'M84 118C84 106 100 102 120 102C140 102 156 106 156 118L161 150C161 164 145 171 120 171C95 171 79 164 79 150Z';
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
    // Ohren (klein, seitlich oben)
    '<circle cx="72" cy="68" r="8.5" fill="' + FUR + '" stroke="' + O + '" stroke-width="2.5"/><circle cx="73" cy="69" r="4" fill="' + EAR + '"/>' +
    '<circle cx="168" cy="68" r="8.5" fill="' + FUR + '" stroke="' + O + '" stroke-width="2.5"/><circle cx="167" cy="69" r="4" fill="' + EAR + '"/>' +
    // Kopf: schmalere Stirn, nach unten breiter mit breiter, eckiger Schnauze (typisch Capybara)
    '<path d="' + HEAD + '" fill="' + FUR + '"/>' +
    '<path d="M171 108C175 130 176 152 162 166C170 150 171 130 167 110Z" fill="' + SH + '"/>' +
    '<ellipse cx="102" cy="66" rx="16" ry="5" fill="#fff" opacity=".2" transform="rotate(-6 102 66)"/>' +
    '<path d="M113 58Q116.5 52 119.5 57.5Q122.5 51.5 126 57.5" fill="none" stroke="' + O + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + MUZZLE + '" fill="' + LT + '"/>' +
    '<path d="' + HEAD + '" fill="none" stroke="' + O + '" stroke-width="2.5" stroke-linejoin="round"/>' +
    // Wangen (dezent)
    '<ellipse cx="78" cy="132" rx="6.5" ry="4" fill="' + CHEEK + '" opacity=".45"/>' +
    '<ellipse cx="162" cy="132" rx="6.5" ry="4" fill="' + CHEEK + '" opacity=".45"/>' +
    // Augen: klein, entspannt halb geschlossen
    '<ellipse cx="96" cy="92" rx="6" ry="6.5" fill="' + EYE + '"/><circle cx="94" cy="93" r="2" fill="#fff"/>' +
    '<ellipse cx="144" cy="92" rx="6" ry="6.5" fill="' + EYE + '"/><circle cx="142" cy="93" r="2" fill="#fff"/>' +
    '<path d="M88.5 91Q96 83 103.5 91L103.5 85L88.5 85Z" fill="' + FUR + '"/><path d="M136.5 91Q144 83 151.5 91L151.5 85L136.5 85Z" fill="' + FUR + '"/>' +
    '<path d="M88 91Q96 86.5 104 91M136 91Q144 86.5 152 91" fill="none" stroke="' + O + '" stroke-width="2" stroke-linecap="round"/>' +
    // Nase (breit, dunkel), Mund
    '<path d="M100 112Q120 105 140 112Q143 122 130 126Q120 128.5 110 126Q97 122 100 112Z" fill="' + NOSE + '" stroke="' + O + '" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<ellipse cx="110" cy="117" rx="3.4" ry="1.8" fill="' + EYE + '" transform="rotate(20 110 117)"/><ellipse cx="130" cy="117" rx="3.4" ry="1.8" fill="' + EYE + '" transform="rotate(-20 130 117)"/>' +
    '<ellipse cx="117" cy="110" rx="7" ry="1.7" fill="#fff" opacity=".4"/>' +
    '<path d="M120 127.5V135M110 136Q115 141 120 135Q125 141 130 136" fill="none" stroke="' + O + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';

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
      ears: [[72, 68], [168, 68]], // Ohr-Mittelpunkte, Radius 8.5
      eyes: [[96, 92], [144, 92]], // Augen-Mittelpunkte (rx 6, ry 6.5, Lid oben)
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
