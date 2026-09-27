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
  var HEAD = 'M120 54C148 54 170 56 175 78C179 96 180 118 176 138C172 158 152 168 120 168C88 168 68 158 64 138C60 118 61 96 65 78C70 56 92 54 120 54Z';
  var MUZZLE = 'M87 121C87 108 103 103 120 103C137 103 153 108 153 121L155 145C155 160 140 166 120 166C100 166 85 160 85 145Z';
  var LEG_L = 'M86 250V280Q86 292 100 292Q113 292 113 281V250Z';
  var LEG_R = 'M127 250V281Q127 292 140 292Q154 292 154 280V250Z';

  // Arme: Schulter -> Ellbogen (Kontrollpunkt) -> Pfote (Griffpunkt)
  var ARM = {
    L: { s: [86, 182], c: [66, 196], p: [60, 218] },
    R: { s: [154, 182], c: [176, 184], p: [186, 200] }
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
    // Ohren (klein und rund)
    '<circle cx="69" cy="71" r="10" fill="' + FUR + '" stroke="' + O + '" stroke-width="2.5"/><circle cx="70.5" cy="72.5" r="4.8" fill="' + EAR + '"/>' +
    '<circle cx="171" cy="71" r="10" fill="' + FUR + '" stroke="' + O + '" stroke-width="2.5"/><circle cx="169.5" cy="72.5" r="4.8" fill="' + EAR + '"/>' +
    // Kopf (kastenförmig, breite stumpfe Schnauze)
    '<path d="' + HEAD + '" fill="' + FUR + '"/>' +
    '<path d="M177 104C180 128 175 150 158 162C168 148 173 130 173 108Z" fill="' + SH + '"/>' +
    '<ellipse cx="98" cy="68" rx="17" ry="6" fill="#fff" opacity=".2" transform="rotate(-6 98 68)"/>' +
    '<path d="M112 58Q116 51 119 57Q122 50 126 57" fill="none" stroke="' + O + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + MUZZLE + '" fill="' + LT + '"/>' +
    '<path d="' + HEAD + '" fill="none" stroke="' + O + '" stroke-width="2.5" stroke-linejoin="round"/>' +
    // Wangen
    '<ellipse cx="77" cy="127" rx="8.5" ry="5.5" fill="' + CHEEK + '" opacity=".6"/>' +
    '<ellipse cx="163" cy="127" rx="8.5" ry="5.5" fill="' + CHEEK + '" opacity=".6"/>' +
    // Augen
    '<ellipse cx="96" cy="92" rx="7" ry="8" fill="' + EYE + '"/><circle cx="93.6" cy="88.8" r="2.8" fill="#fff"/><circle cx="98.6" cy="95.4" r="1.2" fill="#fff"/>' +
    '<ellipse cx="144" cy="92" rx="7" ry="8" fill="' + EYE + '"/><circle cx="141.6" cy="88.8" r="2.8" fill="#fff"/><circle cx="146.6" cy="95.4" r="1.2" fill="#fff"/>' +
    '<path d="M86 80Q92 77 98 79M142 79Q148 77 154 80" fill="none" stroke="' + O + '" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>' +
    // Nase (groß, dunkel, typisch Capybara), Mund, Zähnchen
    '<path d="M102 112Q120 105 138 112Q141 122 129 126Q120 128.5 111 126Q99 122 102 112Z" fill="' + NOSE + '" stroke="' + O + '" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<ellipse cx="111" cy="117" rx="3.2" ry="1.8" fill="' + EYE + '" transform="rotate(20 111 117)"/><ellipse cx="129" cy="117" rx="3.2" ry="1.8" fill="' + EYE + '" transform="rotate(-20 129 117)"/>' +
    '<ellipse cx="117" cy="110" rx="7" ry="1.7" fill="#fff" opacity=".4"/>' +
    '<rect x="116" y="134.5" width="8" height="7" rx="1.6" fill="#fff" stroke="' + O + '" stroke-width="1.2"/><path d="M120 135V141" stroke="' + O + '" stroke-width="1"/>' +
    '<path d="M120 127.5V134M108 134Q114 140 120 134Q126 140 132 134" fill="none" stroke="' + O + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';

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
      ears: [[69, 71], [171, 71]], // Ohr-Mittelpunkte, Radius 10
      eyes: [[96, 92], [144, 92]], // Augen-Mittelpunkte (rx 7, ry 8)
      eyeLine: 92,
      nose: [120, 117],
      mouth: [120, 134],
      cheeks: [[77, 127], [163, 127]],
      chin: [120, 168],
      neck: [120, 158],            // Hals / Kragen, Breite ca. 96..144
      shoulders: [[86, 182], [154, 182]],
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
