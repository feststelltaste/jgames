/* Capybara-Modenschau – Grafik: Kategorie "hand" (Zubehör: Handgegenstände, Brille, Monokel, Boxhandschuhe, Schwimmring).
   Koordinaten wie capybara.js (240 x 300), Teile liegen ohne Transformation auf dem Capybara.
   Bei sehr langen Teilen (Flagge, Mistgabel) umfasst box nur den oberen, typischen Teil, damit das Vorschaubild erkennbar bleibt.
   Griffe laufen durch den Griffpunkt der rechten Pfote (186, 200); die Pfote (Arm-Ebene) liegt darüber. */
(function () {
  'use strict';
  var O = ART.colors.outline;
  var W = ' stroke="' + O + '" stroke-width="2.5" stroke-linejoin="round"';   // Hauptkontur
  var w = ' stroke="' + O + '" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"'; // Detailkontur
  var HL = ' fill="#fff" opacity=".3"';                                         // Glanzlicht
  var N = ' fill="none"';
  function add(id, box, svg, more) {
    var o = { box: box, svg: '<g>' + svg + '</g>' };
    for (var k in more || {}) o[k] = more[k];
    ART.items[id] = o;
  }
  var f1 = function (v) { return Math.round(v * 10) / 10; };
  // Stab/Griff als Linie mit Kontur: d = Pfad, wd = Dicke ohne Kontur
  function stick(d, wd, fill, cap) {
    cap = cap || 'round';
    return '<path d="' + d + '" stroke="' + O + '" stroke-width="' + (wd + 5) + '" stroke-linecap="' + cap + '" stroke-linejoin="round"' + N + '/>' +
      '<path d="' + d + '" stroke="' + fill + '" stroke-width="' + wd + '" stroke-linecap="' + cap + '" stroke-linejoin="round"' + N + '/>';
  }
  // Fünfzackiger Stern
  function star(cx, cy, r, fill, extra, inner) {
    var d = '';
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * (inner || 0.45) : r;
      d += (i ? 'L' : 'M') + f1(cx + Math.cos(a) * rr) + ' ' + f1(cy + Math.sin(a) * rr);
    }
    return '<path d="' + d + 'Z" fill="' + fill + '"' + (extra || '') + '/>';
  }
  // Funkel-Stern (vier Zacken)
  function sparkle(cx, cy, r, fill) {
    var q = r * 0.28;
    return '<path d="M' + cx + ' ' + (cy - r) + 'Q' + (cx + q) + ' ' + (cy - q) + ' ' + (cx + r) + ' ' + cy + 'Q' + (cx + q) + ' ' + (cy + q) + ' ' + cx + ' ' + (cy + r) +
      'Q' + (cx - q) + ' ' + (cy + q) + ' ' + (cx - r) + ' ' + cy + 'Q' + (cx - q) + ' ' + (cy - q) + ' ' + cx + ' ' + (cy - r) + 'Z" fill="' + fill + '"' + w + '/>';
  }
  function ell(cx, cy, a, b, t0, t1, n) { // Punkte auf Ellipse (Winkel in Grad)
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var t = (t0 + (t1 - t0) * i / n) * Math.PI / 180;
      pts.push(f1(cx + Math.cos(t) * a) + ' ' + f1(cy + Math.sin(t) * b));
    }
    return pts;
  }

  // ---------- Sonnenbrille: pinkes Gestell, dunkle Gläser ----------
  (function () {
    var F = '#ff5d8f', FS = '#d9406f', G = '#3a3350';
    function lens(cx) {
      var d = 'M' + (cx - 17) + ' 84Q' + (cx - 17) + ' 80 ' + (cx - 12) + ' 80H' + (cx + 12) + 'Q' + (cx + 17) + ' 80 ' + (cx + 17) + ' 84Q' + (cx + 16) + ' 104 ' + cx + ' 104Q' + (cx - 16) + ' 104 ' + (cx - 17) + ' 84Z';
      return '<path d="' + d + '" fill="' + F + '"' + W + '/>' +
        '<path d="M' + (cx - 13) + ' 85Q' + (cx - 13) + ' 84 ' + (cx - 11) + ' 84H' + (cx + 11) + 'Q' + (cx + 13) + ' 84 ' + (cx + 13) + ' 85Q' + (cx + 12) + ' 100 ' + cx + ' 100Q' + (cx - 12) + ' 100 ' + (cx - 13) + ' 85Z" fill="' + G + '"' + w + '/>' +
        '<path d="M' + (cx + 4) + ' 99Q' + (cx + 11) + ' 97 ' + (cx + 12.5) + ' 87Q' + (cx + 13) + ' 99 ' + cx + ' 100Z" fill="#221d33"/>' +
        '<path d="M' + (cx - 9) + ' 95L' + (cx + 1) + ' 85.5M' + (cx - 4) + ' 97L' + (cx + 5) + ' 88" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>';
    }
    add('sonnenbrille', [60, 79, 120, 26.5],
      '<path d="M78 84L63 88M162 84L177 88" stroke="' + O + '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M78 84L63 88M162 84L177 88" stroke="' + FS + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M112 87Q120 81 128 87" stroke="' + O + '" stroke-width="6.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M112 87Q120 81 128 87" stroke="' + F + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
      lens(96) + lens(144));
  })();

  // ---------- Monokel: goldener Ring am rechten Auge, Kettchen zum Kragen ----------
  (function () {
    var Gd = '#f2b632', GS = '#c98b1c';
    var chain = '';
    // Kettchen: kleine Glieder entlang einer Kurve (160,104) -> (150,158)
    for (var i = 0; i <= 14; i++) {
      var t = i / 14, u = 1 - t;
      var x = u * u * 158 + 2 * u * t * 178 + t * t * 150, y = u * u * 105 + 2 * u * t * 136 + t * t * 160;
      chain += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="1.9" fill="' + Gd + '" stroke="' + O + '" stroke-width="1"/>';
    }
    add('monokel', [125.5, 73.5, 43.5, 90.5],
      chain +
      '<circle cx="150" cy="160" r="3.2" fill="' + Gd + '"' + w + '/>' +
      '<circle cx="144" cy="92" r="14" fill="#cfefff" opacity=".35"/>' +
      '<path d="M136 101A12 12 0 0 1 144 80" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".6"/>' +
      '<circle cx="144" cy="92" r="15" fill="none" stroke="' + O + '" stroke-width="7"/>' +
      '<circle cx="144" cy="92" r="15" fill="none" stroke="' + Gd + '" stroke-width="3.5"/>' +
      '<path d="M156 83A15 15 0 0 1 150.5 105.5" fill="none" stroke="' + GS + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="157.5" cy="103.5" r="2.8" fill="' + Gd + '"' + w + '/>');
  })();

  // ---------- Boxhandschuhe: rot, über beiden Pfoten (top) ----------
  (function () {
    var C = '#e23d3d', S = '#b92a2a', K = '#fbfbfb', KS = '#d9d4de';
    // lokales System: Arm kommt von oben (−y), Pfote bei (0,0); s = Seite des Daumens (+1 rechts, −1 links)
    function glove(px, py, rot, s) {
      var fist = 'M-13 -9C-19 -2 -19 14 -11 21C-4 27 8 26 13 19C18 12 18 -2 13 -9Z';
      var th = 'M' + (s * 10) + ' -4C' + (s * 20) + ' -8 ' + (s * 24) + ' 4 ' + (s * 19) + ' 12C' + (s * 17) + ' 16 ' + (s * 12) + ' 16 ' + (s * 9) + ' 12Z';
      return '<g transform="translate(' + px + ' ' + py + ') rotate(' + rot + ')">' +
        '<path d="' + th + '" fill="' + C + '"' + W + '/>' +
        '<path d="' + fist + '" fill="' + C + '"/>' +
        '<path d="M10 -6C16 2 16 14 9 20C4 24 -4 25 -9 22C2 20 10 12 10 -6Z" fill="' + S + '"/>' +
        '<path d="' + fist + '" fill="none"' + W + '/>' +
        '<path d="M' + (s * 11) + ' 4Q' + (s * 7) + ' 9 ' + (s * 9) + ' 13" stroke="' + O + '" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="-6" cy="4" rx="4" ry="7" transform="rotate(12 -6 4)"' + HL + '/>' +
        '<rect x="-13.5" y="-22" width="27" height="14" rx="4" fill="' + K + '"' + W + '/>' +
        '<path d="M-10 -12H10" stroke="' + KS + '" stroke-width="2" stroke-linecap="round"/>' +
        '</g>';
    }
    var top = glove(60, 219, 16, 1) + glove(186, 201, -28, -1);
    add('fäustlinge', [40, 175.5, 168.5, 70], '', { svg: '', top: '<g>' + top + '</g>' });
  })();

  // ---------- Kompass: goldenes Gehäuse, rot-weiße Nadel ----------
  (function () {
    var Gd = '#f2b632', GS = '#c98b1c', F = '#fffaf0';
    var cx = 201, cy = 184, ticks = '';
    for (var i = 0; i < 8; i++) {
      var a = i * Math.PI / 4, r1 = i % 2 ? 9.5 : 8.5;
      ticks += 'M' + f1(cx + Math.cos(a) * r1) + ' ' + f1(cy + Math.sin(a) * r1) + 'L' + f1(cx + Math.cos(a) * 11.3) + ' ' + f1(cy + Math.sin(a) * 11.3);
    }
    add('kompass', [183.5, 158, 37.5, 45],
      '<circle cx="' + cx + '" cy="' + (cy - 19) + '" r="4.5" fill="none" stroke="' + O + '" stroke-width="5"/>' +
      '<circle cx="' + cx + '" cy="' + (cy - 19) + '" r="4.5" fill="none" stroke="' + Gd + '" stroke-width="2.2"/>' +
      '<rect x="' + (cx - 4) + '" y="' + (cy - 18) + '" width="8" height="6" rx="1.5" fill="' + Gd + '"' + w + '/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="16.5" fill="' + Gd + '"' + W + '/>' +
      '<path d="M' + (cx + 13) + ' ' + (cy - 10) + 'A16.5 16.5 0 0 1 ' + (cx - 6) + ' ' + (cy + 15.5) + 'A14 14 0 0 0 ' + (cx + 13) + ' ' + (cy - 10) + 'Z" fill="' + GS + '"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="12.5" fill="' + F + '"' + w + '/>' +
      '<path d="' + ticks + '" stroke="' + O + '" stroke-width="1.3" stroke-linecap="round"/>' +
      '<path d="M' + (cx + 3) + ' ' + (cy - 1) + 'L' + (cx + 6) + ' ' + (cy - 10) + 'L' + (cx - 1) + ' ' + (cy - 3) + 'Z" fill="#e23d3d" stroke="' + O + '" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<path d="M' + (cx - 3) + ' ' + (cy + 1) + 'L' + (cx - 6) + ' ' + (cy + 10) + 'L' + (cx + 1) + ' ' + (cy + 3) + 'Z" fill="#fff" stroke="' + O + '" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="1.8" fill="' + O + '"/>' +
      '<path d="M' + (cx - 9) + ' ' + (cy - 3) + 'A9 9 0 0 1 ' + (cx - 3) + ' ' + (cy - 9) + '" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>');
  })();

  // ---------- Schwimmring: rot-weiß gestreift, um den Bauch ----------
  (function () {
    var R = '#ff4f5e', Wt = '#fdfdfd', cx = 120, cy = 238, a = 62, b = 24, ia = 38, ib = 9, icy = 231;
    var ring = 'M' + (cx - a) + ' ' + cy + 'A' + a + ' ' + b + ' 0 1 0 ' + (cx + a) + ' ' + cy + 'A' + a + ' ' + b + ' 0 1 0 ' + (cx - a) + ' ' + cy + 'Z' +
      'M' + (cx - ia) + ' ' + icy + 'A' + ia + ' ' + ib + ' 0 1 1 ' + (cx + ia) + ' ' + icy + 'A' + ia + ' ' + ib + ' 0 1 1 ' + (cx - ia) + ' ' + icy + 'Z';
    // rote Segmente: Viereck zwischen Außen- und Innenellipse
    var seg = '';
    [[20, 55], [95, 130], [165, 200], [240, 275], [310, 345]].forEach(function (s) {
      var outer = ell(cx, cy, a, b, s[0], s[1], 8), inner = ell(cx, icy, ia, ib, s[1], s[0], 8);
      seg += '<path d="M' + outer.join('L') + 'L' + inner.join('L') + 'Z" fill="' + R + '"/>';
    });
    add('schwimmring', [57, 213, 126.5, 50.5],
      '<path d="' + ring + '" fill="' + Wt + '" fill-rule="evenodd"/>' + seg +
      '<path d="M' + (cx - a + 3) + ' ' + (cy + 4) + 'Q' + cx + ' ' + (cy + 30) + ' ' + (cx + a - 3) + ' ' + (cy + 4) + 'A' + a + ' ' + b + ' 0 0 1 ' + (cx - a + 3) + ' ' + (cy + 4) + 'Z" fill="#7a2030" opacity=".18"/>' +
      '<path d="M' + (cx - ia) + ' ' + icy + 'A' + ia + ' ' + ib + ' 0 0 1 ' + (cx + ia) + ' ' + icy + 'A' + ia + ' ' + (ib - 3) + ' 0 0 0 ' + (cx - ia) + ' ' + icy + 'Z" fill="' + ART.colors.furShade + '" opacity=".45"/>' +
      '<path d="' + ring + '" fill="none" fill-rule="evenodd"' + W + '/>' +
      '<path d="M72 228Q84 219 100 217" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".7"/>' +
      '<ellipse cx="160" cy="224" rx="3.5" ry="2" fill="#fff" opacity=".7"/>');
  })();

  // ---------- Gehstock: schwarz mit goldenem Ring und Spitze, Griff nach außen gebogen, steht auf dem Boden ----------
  (function () {
    var C = '#2f2840', G = '#f2b632';
    add('gehstock', [180.5, 143.5, 29.5, 152],
      stick('M186 290V158A9 9 0 0 1 204 158V164', 6, C) +
      '<path d="M184 286V214M184 180V160" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".3"/>' +
      '<path d="M189 153A8 8 0 0 1 198 150.5" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".35"/>' +
      '<rect x="181" y="170" width="10" height="6" rx="1.5" fill="' + G + '"' + w + '/>' +
      '<path d="M181.5 279H190.5L190 289Q186 292 182 289Z" fill="' + G + '"' + w + '/>');
  })();

  // ---------- Heißer Kakao: rote Tasse mit Herz, Sahnehaube und Dampf ----------
  (function () {
    var C = '#e8505b', S = '#c23a45';
    add('kakao', [185, 136.5, 45, 68], '<g transform="translate(8 0)">' +
      '<path d="M183 142Q179 147 183 152Q187 157 183 162M193 139Q189 145 193 151Q197 157 193 163M203 142Q199 147 203 152Q207 157 203 162" stroke="#fff" stroke-width="5.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M183 142Q179 147 183 152Q187 157 183 162M193 139Q189 145 193 151Q197 157 193 163M203 142Q199 147 203 152Q207 157 203 162" stroke="#c9d6e0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M206 179Q218 178 217 188Q216 197 205 196" stroke="' + O + '" stroke-width="8.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M206 179Q218 178 217 188Q216 197 205 196" stroke="' + C + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M178 172H208L205.5 199Q205 203 200 203H186Q181 203 180.5 199Z" fill="' + C + '"/>' +
      '<path d="M200 172H208L205.5 199Q205 203 200 203H196Q201 202 201 196Z" fill="' + S + '"/>' +
      '<path d="M178 172H208L205.5 199Q205 203 200 203H186Q181 203 180.5 199Z" fill="none"' + W + '/>' +
      '<path d="M193 194C188 190 186 187 188 184.5C189.5 182.5 192 183 193 185C194 183 196.5 182.5 198 184.5C200 187 198 190 193 194Z" fill="#fff"' + w + '/>' +
      '<ellipse cx="193" cy="172" rx="15" ry="4" fill="#7a4a2a"' + W + '/>' +
      '<path d="M182 171Q181 164 188 165Q190 159 196 162Q203 161 203 168Q206 172 200 173H186Q181 174 182 171Z" fill="#fffaf0"' + w + '/>' +
      '<circle cx="190" cy="166" r="1.3" fill="#ff8aa8"/><circle cx="197" cy="165.5" r="1.3" fill="#7ad0ff"/><circle cx="194" cy="169" r="1.3" fill="#ffd23f"/>' +
      '<path d="M183 178L184.5 194" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/></g>');
  })();

  // ---------- Fernglas: zwei grüne Rohre mit Brücke und Riemen ----------
  (function () {
    var C = '#3f7d5a', S = '#2c5c41', D = '#2f2840', L = '#9fd9ff';
    function tube(x) {
      var d = 'M' + (x - 7) + ' 152H' + (x + 7) + 'V162L' + (x + 10) + ' 168V195Q' + (x + 10) + ' 199 ' + (x + 6) + ' 199H' + (x - 6) + 'Q' + (x - 10) + ' 199 ' + (x - 10) + ' 195V168L' + (x - 7) + ' 162Z';
      return '<path d="' + d + '" fill="' + C + '"/>' +
        '<path d="M' + (x + 4) + ' 168H' + (x + 10) + 'V195Q' + (x + 10) + ' 199 ' + (x + 6) + ' 199H' + (x + 1) + 'Q' + (x + 5) + ' 197 ' + (x + 5) + ' 192Z" fill="' + S + '"/>' +
        '<path d="' + d + '" fill="none"' + W + '/>' +
        '<rect x="' + (x - 9) + '" y="147" width="18" height="8" rx="2.5" fill="' + D + '"' + w + '/>' +
        '<rect x="' + (x - 12) + '" y="185" width="24" height="9" rx="2.5" fill="' + D + '"' + w + '/>' +
        '<path d="M' + (x - 6) + ' 171V180" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>' +
        '<ellipse cx="' + x + '" cy="149.5" rx="5" ry="1.5" fill="' + L + '" opacity=".9"/>';
    }
    add('fernglas', [180.5, 146.5, 49.5, 75.5],
      '<path d="M192 192Q178 218 199 219Q222 218 215 192" stroke="' + O + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M192 192Q178 218 199 219Q222 218 215 192" stroke="#b5673a" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      tube(193) + tube(217) +
      '<rect x="202" y="164" width="6" height="14" fill="' + D + '"' + w + '/>' +
      '<circle cx="205" cy="160" r="4" fill="' + D + '"' + w + '/>');
  })();

  // ---------- E-Gitarre: rot, schräg vor dem Körper, Hals in der rechten Pfote ----------
  (function () {
    var C = '#e23d3d', S = '#b92a2a', PG = '#fdfdfd', D = '#2f2840', NK = '#e0a860', NS = '#b8844a';
    var body = 'M-30 -4C-34 -18 -24 -26 -12 -22C-4 -19 2 -20 8 -24C14 -29 24 -30 28 -24C24 -19 20 -14 22 -9C26 -8 30 -6 30 -2C30 3 26 5 22 6C20 12 24 17 28 21C24 27 14 26 8 21C2 17 -4 18 -12 22C-24 27 -34 16 -30 4Z';
    var frets = '';
    for (var x = 34; x < 110; x += 9) frets += 'M' + x + ' -4V4';
    var g = '<g transform="translate(106 247) rotate(-30)">' +
      // Hals + Kopf
      '<path d="M18 -5H112V5H18Z" fill="' + NK + '"' + W + '/>' +
      '<path d="M18 2H112V5H18Z" fill="' + NS + '"/>' +
      '<path d="' + frets + '" stroke="' + O + '" stroke-width="1.2" opacity=".6"/>' +
      '<circle cx="52" cy="0" r="1.3" fill="#fff"/><circle cx="70" cy="0" r="1.3" fill="#fff"/><circle cx="88" cy="0" r="1.3" fill="#fff"/>' +
      '<path d="M110 -6L132 -10Q136 -4 132 2L110 6Z" fill="' + C + '"' + W + '/>' +
      '<circle cx="118" cy="-10" r="2.4" fill="#dfe6ee"' + w + '/><circle cx="126" cy="-12" r="2.4" fill="#dfe6ee"' + w + '/><circle cx="118" cy="10" r="2.4" fill="#dfe6ee"' + w + '/><circle cx="126" cy="7" r="2.4" fill="#dfe6ee"' + w + '/>' +
      // Korpus
      '<path d="' + body + '" fill="' + C + '"/>' +
      '<path d="M22 6C20 12 24 17 28 21C24 27 14 26 8 21C2 17 -4 18 -12 22C-24 27 -34 16 -30 4C-24 14 -14 16 -6 12C2 8 14 10 22 6Z" fill="' + S + '"/>' +
      '<path d="' + body + '" fill="none"' + W + '/>' +
      '<path d="M-6 -12C4 -14 16 -10 20 -4C18 4 10 10 -2 10C-10 10 -12 -8 -6 -12Z" fill="' + PG + '"' + w + '/>' +
      '<rect x="0" y="-7" width="5" height="14" rx="1.5" fill="' + D + '"/><rect x="10" y="-7" width="5" height="14" rx="1.5" fill="' + D + '"/>' +
      '<rect x="-16" y="-6" width="6" height="12" rx="1.5" fill="#dfe6ee"' + w + '/>' +
      '<path d="M-13 -1.8H112M-13 1.8H112" stroke="#f4f4f4" stroke-width=".8" opacity=".9"/>' +
      '<circle cx="-12" cy="14" r="2.6" fill="#ffd23f"' + w + '/><circle cx="-20" cy="10" r="2.6" fill="#ffd23f"' + w + '/>' +
      '<ellipse cx="-22" cy="-12" rx="5" ry="3" transform="rotate(-30 -22 -12)"' + HL + '/>' +
      '</g>';
    add('gitarre', [71, 170.5, 152, 109], g);
  })();

  // ---------- Säbel: geschwungene Klinge, goldener Korb, steht nach oben ----------
  (function () {
    var M = '#e3e9f0', MS = '#aebccb', G = '#f2b632', GS = '#c98b1c', GR = '#7a3b2a';
    var blade = 'M181 186C178 150 184 110 205 64C210 56 218 50 224 48C222 58 218 66 214 76C200 112 193 150 193 186Z';
    add('säbel', [167.5, 47, 58, 175.5],
      '<path d="' + blade + '" fill="' + M + '"/>' +
      '<path d="M193 186C193 150 200 112 214 76C218 66 222 58 224 48C221 60 218 70 216 80C206 116 200 152 199 186Z" fill="' + MS + '"/>' +
      '<path d="M187 180C186 146 192 112 210 70" stroke="' + MS + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<path d="' + blade + '" fill="none"' + W + '/>' +
      '<path d="M185 170C184 144 189 118 200 92" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>' +
      stick('M186 190V212', 6, GR, 'butt') +
      '<path d="M183 196L189 199M183 202L189 205M183 208L189 211" stroke="' + O + '" stroke-width="1.2" opacity=".6"/>' +
      '<path d="M172 190Q170 205 180 214L186 214Q176 205 178 190Z" fill="' + G + '"' + w + '/>' +
      '<path d="M170 183Q186 179 204 184Q205 190 200 191Q186 188 172 191Q167 189 170 183Z" fill="' + G + '"' + W + '/>' +
      '<path d="M186 184Q196 184 203 187Q200 190 186 188Z" fill="' + GS + '"/>' +
      '<circle cx="186" cy="216" r="5" fill="' + G + '"' + W + '/>');
  })();

  // ---------- Kochlöffel: Holzlöffel mit Soßenklecks ----------
  (function () {
    var C = '#e0a860', S = '#b8844a';
    add('kochlöffel', [175, 126, 35, 111.5],
      '<g transform="translate(186 200) rotate(10)">' +
      stick('M0 32V-40', 6, C) +
      '<path d="M1.5 30V-38" stroke="' + S + '" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse cx="0" cy="-57" rx="12" ry="17" fill="' + C + '"/>' +
      '<path d="M8 -69Q14 -56 8 -45Q2 -39 -6 -42Q6 -46 8 -69Z" fill="' + S + '"/>' +
      '<ellipse cx="0" cy="-57" rx="12" ry="17" fill="none"' + W + '/>' +
      '<ellipse cx="0" cy="-55" rx="7" ry="11" fill="none" stroke="' + S + '" stroke-width="1.5"/>' +
      '<path d="M-5 -60Q-6 -66 -1 -67Q5 -68 5 -62Q7 -57 3 -55Q1 -51 -2 -54Q-6 -55 -5 -60Z" fill="#e8505b"' + w + '/>' +
      '<ellipse cx="-5" cy="-65" rx="2.5" ry="5" transform="rotate(10 -5 -65)"' + HL + '/>' +
      '<circle cx="0" cy="26" r="2" fill="' + S + '"/>' +
      '</g>');
  })();

  // ---------- Flagge: blaue Fahne mit gelbem Stern an hoher Stange, steht auf dem Boden ----------
  (function () {
    var C = '#3d8bfd', S = '#2a6bd1', G = '#ffd23f', GS = '#e3a91c';
    var flag = 'M188 44Q200 38 212 44T236 44V82Q224 76 212 82T188 82Z';
    add('flagge', [179.5, 29.5, 58, 120],
      stick('M186 290V40', 4.5, '#dfe6ee') +
      '<path d="M187.5 288V44" stroke="#aebccb" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="' + flag + '" fill="' + C + '"/>' +
      '<path d="M212 44Q224 50 236 44V82Q224 76 212 82Q220 72 212 44Z" fill="' + S + '"/>' +
      '<path d="M188 72Q200 66 212 72T236 72V76Q224 70 212 76T188 76Z" fill="#fff"/>' +
      '<path d="' + flag + '" fill="none"' + W + '/>' +
      star(210, 57, 10, G, w) +
      '<circle cx="186" cy="36" r="5.5" fill="' + G + '"' + W + '/>' +
      '<path d="M188 37A3 3 0 0 1 186 39" stroke="' + GS + '" stroke-width="1.5" fill="none"/>' +
      '<path d="M181.5 283H190.5V289Q186 292 181.5 289Z" fill="#8f9aa6"' + w + '/>');
  })();

  // ---------- Schild: runder Superheldenschild vor der linken Pfote (top) ----------
  (function () {
    var cx = 54, cy = 216;
    var top = '<circle cx="' + cx + '" cy="' + cy + '" r="29" fill="#e23d3d"' + W + '/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="21.5" fill="#ffd23f"' + w + '/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="14.5" fill="#3d8bfd"' + w + '/>' +
      star(cx, cy + 1, 11, '#fff', w) +
      '<path d="M' + (cx + 22) + ' ' + (cy - 17) + 'A28 28 0 0 1 ' + (cx - 17) + ' ' + (cy + 22) + 'A31 31 0 0 0 ' + (cx + 22) + ' ' + (cy - 17) + 'Z" fill="#7a1a2a" opacity=".25"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="29" fill="none"' + W + '/>' +
      '<path d="M' + (cx - 22) + ' ' + (cy - 8) + 'A24 24 0 0 1 ' + (cx - 6) + ' ' + (cy - 24) + '" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".45"/>';
    add('schild', [24, 186, 60.5, 60.5], '', { svg: '', top: '<g>' + top + '</g>' });
  })();

  // ---------- Mistgabel: Holzstiel, drei Metallzinken, steht auf dem Boden ----------
  (function () {
    var C = '#c98a4a', S = '#a06a34', M = '#b8c4cf', MS = '#8f9daa';
    var fork = 'M170 28V60Q170 72 186 72Q202 72 202 60V28M186 24V74';
    add('mistgabel', [160, 20, 52, 130],
      stick('M186 290V80', 6, C) +
      '<path d="M188 286V84" stroke="' + S + '" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="' + fork + '" stroke="' + O + '" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="' + fork + '" stroke="' + M + '" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M200.5 32V60Q200 68 192 70.5" stroke="' + MS + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M169 36V52M185 30V46" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>' +
      '<rect x="181" y="72" width="10" height="12" rx="2" fill="' + M + '"' + w + '/>' +
      '<path d="M181 77H191" stroke="' + MS + '" stroke-width="1.5"/>');
  })();

  // ---------- Schatzkarte: Pergamentrolle mit Weg und rotem Kreuz ----------
  (function () {
    var P = '#f5e1ad', PS = '#dcc184', R = '#d8423a';
    var sheet = 'M183 151H227Q224 162 227 174Q230 186 227 198H183Q186 186 183 174Q180 162 183 151Z';
    function roll(y) {
      return '<rect x="178" y="' + (y - 5) + '" width="54" height="10" rx="5" fill="' + P + '"' + W + '/>' +
        '<path d="M181 ' + (y + 2.5) + 'H229" stroke="' + PS + '" stroke-width="2.5" stroke-linecap="round"/>' +
        '<ellipse cx="228" cy="' + y + '" rx="2" ry="3.5" fill="' + PS + '"' + w + '/>';
    }
    add('schatzkarte', [177, 145, 56.5, 59.5],
      '<path d="' + sheet + '" fill="' + P + '"/>' +
      '<path d="M218 151H227Q224 162 227 174Q230 186 227 198H219Q222 186 220 174Q218 162 218 151Z" fill="' + PS + '"/>' +
      '<path d="M190 168Q192 160 201 160Q210 158 214 164Q220 170 214 178Q208 186 198 184Q188 182 190 176Z" fill="#9ed36a" stroke="#6a9a3a" stroke-width="1.5"/>' +
      '<path d="M188 191Q200 188 199 178Q198 170 208 168" stroke="' + R + '" stroke-width="1.8" fill="none" stroke-dasharray="3 2.5" stroke-linecap="round"/>' +
      '<path d="M206 162L214 170M214 162L206 170" stroke="' + R + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M218 186q2 -2 4 0t4 0M186 160q2 -2 4 0t4 0" stroke="#4aa3df" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '<path d="' + sheet + '" fill="none"' + W + '/>' +
      roll(151) + roll(198));
  })();

  // ---------- Nudelholz: Holzrolle mit Griffen, ein Griff in der Pfote, etwas Mehl ----------
  (function () {
    var C = '#ecbd7c', S = '#c99557', H = '#c98a4a';
    add('nudelholz', [175.5, 113.5, 45.5, 105.5],
      '<g transform="translate(186 200) rotate(20)">' +
      stick('M0 14V-12', 6, H) + stick('M0 -62V-86', 6, H) +
      '<rect x="-11" y="-64" width="22" height="54" rx="6" fill="' + C + '"/>' +
      '<path d="M5 -64H5Q11 -64 11 -58V-16Q11 -10 5 -10H1Q6 -12 6 -18V-58Q6 -62 5 -64Z" fill="' + S + '"/>' +
      '<rect x="-11" y="-64" width="22" height="54" rx="6" fill="none"' + W + '/>' +
      '<path d="M-6 -56V-24" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"/>' +
      '<circle cx="-3" cy="-40" r="2.2" fill="#fff" opacity=".85"/><circle cx="3" cy="-50" r="1.6" fill="#fff" opacity=".85"/><circle cx="1" cy="-22" r="1.9" fill="#fff" opacity=".85"/><circle cx="-5" cy="-16" r="1.2" fill="#fff" opacity=".85"/>' +
      '</g>');
  })();

  // ---------- Satellit (Modell): goldener Körper, blaue Sonnensegel, Schüssel, auf einem Stab ----------
  (function () {
    var G = '#f2b632', GS = '#c98b1c', B = '#3d8bfd', BS = '#2a6bd1', M = '#dfe6ee';
    function panel(x0) { // Sonnensegel lokal, von x0 nach außen (Breite 22)
      var x1 = x0 < 0 ? x0 - 22 : x0 + 22, lo = Math.min(x0, x1);
      var grid = 'M' + (lo + 7.3) + ' -7V7M' + (lo + 14.7) + ' -7V7M' + lo + ' 0H' + (lo + 22);
      return '<path d="M' + x0 + ' 0H' + (x0 < 0 ? x0 + 4 : x0 - 4) + '" stroke="' + O + '" stroke-width="5"/>' +
        '<rect x="' + lo + '" y="-7" width="22" height="14" rx="1.5" fill="' + B + '"/>' +
        '<rect x="' + lo + '" y="1" width="22" height="6" fill="' + BS + '"/>' +
        '<path d="' + grid + '" stroke="#bfe4ff" stroke-width="1.2"/>' +
        '<rect x="' + lo + '" y="-7" width="22" height="14" rx="1.5" fill="none"' + W + '/>';
    }
    add('satellit', [174, 121.5, 64, 95],
      stick('M186 212L203 160', 3.5, M) +
      '<g transform="translate(206 150) rotate(-40)">' +
      panel(-13) + panel(13) +
      '<rect x="-10" y="-10" width="20" height="20" rx="3" fill="' + G + '"/>' +
      '<path d="M3 -10H7Q10 -10 10 -7V7Q10 10 7 10H-7Q-10 10 -10 7V4Q3 5 3 -10Z" fill="' + GS + '"/>' +
      '<rect x="-10" y="-10" width="20" height="20" rx="3" fill="none"' + W + '/>' +
      '<path d="M-6 -6H0" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M0 -10V-17" stroke="' + O + '" stroke-width="1.8"/>' +
      '<path d="M-9 -24A10 7 0 0 0 9 -24Z" fill="' + M + '"' + w + '/>' +
      '<path d="M0 -24V-30" stroke="' + O + '" stroke-width="1.5"/><circle cx="0" cy="-31" r="2" fill="#e23d3d"' + w + '/>' +
      '</g>');
  })();

  // ---------- Blitz: gelbes Blitz-Symbol schwebt über der Pfote ----------
  (function () {
    var Y = '#ffd23f', YS = '#f0a81c';
    var bolt = 'M201 112L178 152H192L181 186L212 140H197L209 112Z';
    add('blitz', [177, 105, 48.5, 82.5],
      '<path d="' + bolt + '" fill="' + Y + '"/>' +
      '<path d="M209 112L197 140H212L181 186L203 144H190Z" fill="' + YS + '"/>' +
      '<path d="' + bolt + '" fill="none"' + W + '/>' +
      '<path d="M199 117L185 146" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M216 124L221 120M218 136H224M214 156L219 160" stroke="' + YS + '" stroke-width="2.5" stroke-linecap="round"/>' +
      sparkle(184, 110, 4.5, '#fff3a8') + sparkle(217, 168, 4.5, '#fff3a8'));
  })();

  // ---------- Milchkanne: silberne Kanne mit Deckel, hängt am Bügel in der Pfote ----------
  (function () {
    var M = '#d5dee6', MS = '#a9b6c2', B = '#3d8bfd';
    var can = 'M178 214H194V222Q194 226 198 229Q204 233 204 240V268Q204 273 199 273H173Q168 273 168 268V240Q168 233 174 229Q178 226 178 222Z';
    add('milchkanne', [167, 193.5, 38.5, 81],
      '<path d="M174 216Q175 196 186 196Q197 196 198 216" stroke="' + O + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M174 216Q175 196 186 196Q197 196 198 216" stroke="' + MS + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="' + can + '" fill="' + M + '"/>' +
      '<path d="M196 230Q204 233 204 240V268Q204 273 199 273H190Q197 270 197 262V240Q197 234 193 230Z" fill="' + MS + '"/>' +
      '<path d="' + can + '" fill="none"' + W + '/>' +
      '<path d="M168.5 244H203.5V252H168.5Z" fill="' + B + '"' + w + '/>' +
      '<path d="M169 262H203" stroke="' + MS + '" stroke-width="1.5"/>' +
      '<path d="M174 238V260" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>' +
      '<ellipse cx="186" cy="214" rx="10" ry="3.5" fill="' + M + '"' + W + '/>' +
      '<rect x="183" y="208" width="6" height="5" rx="1.5" fill="' + MS + '"' + w + '/>' +
      '<path d="M181 222Q180 228 182 230Q184 232 184 226Z" fill="#fff"' + w + '/>');
  })();

  // ---------- Zauberstab: schwarz mit weißen Enden und Funkelsternen ----------
  (function () {
    add('zauberstab', [175.5, 102, 47.5, 125],
      '<g transform="translate(186 200) rotate(14)">' +
      stick('M0 22V-58', 5.5, '#2f2840') +
      '<path d="M0 22V10M0 -46V-58" stroke="#fdfdfd" stroke-width="5.5" stroke-linecap="round"/>' +
      '<path d="M-1.3 -8V-40" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".35"/>' +
      '</g>' +
      star(203, 130, 10.5, '#ffd23f', W) +
      '<path d="M200 126L203 123" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>' +
      sparkle(182, 118, 5, '#fff3a8') + sparkle(218, 146, 4, '#ffb3d9') + sparkle(214, 106, 3.2, '#bfe4ff'));
  })();

  // ---------- Lupe: goldener Ring, bläuliches Glas, dunkler Holzgriff ----------
  (function () {
    var G = '#f2b632', GS = '#c98b1c', H = '#7a3b2a';
    add('lupe', [175, 133, 44, 93],
      '<g transform="translate(186 200) rotate(14)">' +
      stick('M0 20V-24', 7, H) +
      '<path d="M2 18V-20" stroke="#5a2a1d" stroke-width="2" stroke-linecap="round"/>' +
      '<rect x="-5" y="-30" width="10" height="7" rx="2" fill="' + G + '"' + w + '/>' +
      '<circle cx="0" cy="-47" r="17" fill="#cfefff" opacity=".45"/>' +
      '<path d="M-10 -54A12 12 0 0 1 -2 -59" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>' +
      '<path d="M8 -38A12 12 0 0 1 3 -36" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>' +
      '<circle cx="0" cy="-47" r="17" fill="none" stroke="' + O + '" stroke-width="9"/>' +
      '<circle cx="0" cy="-47" r="17" fill="none" stroke="' + G + '" stroke-width="4.5"/>' +
      '<path d="M13 -58A17 17 0 0 1 6 -31" stroke="' + GS + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '</g>');
  })();

  // ---------- Mikrofon: silberner Korb, dunkler Griff, Kabel bis zum Boden ----------
  (function () {
    var D = '#2f2840', DS = '#1f1a2c', M = '#d5dee6', MS = '#a9b6c2', K = '#4a4062';
    var cable = 'M181 224Q176 242 191 251Q206 260 197 274Q190 286 204 291';
    var handle = 'M-3.5 24L-6.5 -22H6.5L3.5 24Q0 26 -3.5 24Z';
    add('mikrofon', [176.5, 149, 31.5, 145],
      '<path d="' + cable + '" stroke="' + O + '" stroke-width="5.5" fill="none" stroke-linecap="round"/>' +
      '<path d="' + cable + '" stroke="' + K + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<g transform="translate(186 200) rotate(12)">' +
      '<path d="' + handle + '" fill="' + D + '"/>' +
      '<path d="M2 24L3.5 -22H6.5L3.5 24Z" fill="' + DS + '"/>' +
      '<path d="' + handle + '" fill="none"' + W + '/>' +
      '<path d="M-3 -16L-2 10" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".3"/>' +
      '<rect x="-8" y="-27" width="16" height="6" rx="2" fill="' + MS + '"' + w + '/>' +
      '<circle cx="0" cy="-38" r="12.5" fill="' + M + '"/>' +
      '<path d="M8 -47A12.5 12.5 0 0 1 -4 -26A11 11 0 0 0 8 -47Z" fill="' + MS + '"/>' +
      '<path d="M-11 -42Q0 -38 11 -42M-11.5 -34Q0 -30 11.5 -34M-6 -48.5Q-9 -38 -6 -27M6 -48.5Q9 -38 6 -27M0 -50.5V-25.5" stroke="' + MS + '" stroke-width="1.2" fill="none"/>' +
      '<circle cx="0" cy="-38" r="12.5" fill="none"' + W + '/>' +
      '<ellipse cx="-5" cy="-44" rx="4" ry="2.5" transform="rotate(-30 -5 -44)" fill="#fff" opacity=".7"/>' +
      '</g>');
  })();

  // ---------- Lasso: aufgerolltes Seil in der Pfote, Schlinge schwingt darüber ----------
  (function () {
    var C = '#d9a55b', S = '#a8773a';
    function rope(d) {
      return '<path d="' + d + '" stroke="' + O + '" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + d + '" stroke="' + C + '" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + d + '" stroke="' + S + '" stroke-width="1.3" fill="none" stroke-dasharray="1.5 3.5"/>';
    }
    function loop(cx, cy, rx, ry) {
      return 'M' + (cx - rx) + ' ' + cy + 'A' + rx + ' ' + ry + ' 0 1 0 ' + (cx + rx) + ' ' + cy + 'A' + rx + ' ' + ry + ' 0 1 0 ' + (cx - rx) + ' ' + cy + 'Z';
    }
    add('lasso', [168, 109, 65.5, 152.5],
      rope('M193 197Q214 172 206 132') +
      rope(loop(205, 121, 25, 9)) +
      '<ellipse cx="206" cy="130.5" rx="4" ry="3" fill="' + C + '"' + w + '/>' +
      rope(loop(182, 222, 11, 20)) + rope(loop(187, 224, 11, 20)) + rope(loop(193, 222, 11, 20)) +
      rope('M193 240Q200 250 196 258'));
  })();

  // ---------- Wasserball: bunte Segmente, weiße Kappe ----------
  (function () {
    var cx = 207, cy = 166, r = 21, px = 201, py = 159;
    var cols = ['#ff4f5e', '#fdfdfd', '#3d8bfd', '#fdfdfd', '#ffd23f', '#fdfdfd'];
    var ang = [-100, -40, 20, 80, 140, 200, 260], pts = ang.map(function (a) {
      var t = a * Math.PI / 180, ex = cx + Math.cos(t) * r, ey = cy + Math.sin(t) * r;
      // Kontrollpunkt: Mitte zwischen Kappe und Rand, leicht im Uhrzeigersinn gebogen
      var mx = (px + ex) / 2, my = (py + ey) / 2, dx = ex - px, dy = ey - py;
      return { e: f1(ex) + ' ' + f1(ey), c: f1(mx - dy * 0.22) + ' ' + f1(my + dx * 0.22) };
    });
    var segs = '', lines = '';
    for (var i = 0; i < 6; i++) {
      segs += '<path d="M' + px + ' ' + py + 'Q' + pts[i].c + ' ' + pts[i].e + 'A' + r + ' ' + r + ' 0 0 1 ' + pts[i + 1].e + 'Q' + pts[i + 1].c + ' ' + px + ' ' + py + 'Z" fill="' + cols[i] + '"/>';
      lines += 'M' + px + ' ' + py + 'Q' + pts[i].c + ' ' + pts[i].e;
    }
    add('wasserball', [185, 144, 45.5, 45.5],
      segs +
      '<path d="' + lines + '" stroke="' + O + '" stroke-width="1.3" fill="none" opacity=".7"/>' +
      '<path d="M' + (cx + 17) + ' ' + (cy - 12) + 'A' + r + ' ' + r + ' 0 0 1 ' + (cx - 12) + ' ' + (cy + 17) + 'A' + (r - 3) + ' ' + (r - 3) + ' 0 0 0 ' + (cx + 17) + ' ' + (cy - 12) + 'Z" fill="#3a2a5a" opacity=".18"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none"' + W + '/>' +
      '<circle cx="' + px + '" cy="' + py + '" r="3.5" fill="#fdfdfd"' + w + '/>' +
      '<ellipse cx="194" cy="154" rx="5" ry="3" transform="rotate(-40 194 154)" fill="#fff" opacity=".6"/>');
  })();
})();
