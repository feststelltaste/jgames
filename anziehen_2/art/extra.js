/* Capybara-Modenschau – Grafik: Kategorie "extra" (Schal, Fliege, Ketten, Rucksack, Umhang …).
   Koordinaten wie capybara.js (240 x 300), Teile liegen ohne Transformation auf dem Capybara.
   Alles, was am Hals sitzt, beginnt an der Kinnlinie (Kopf-Unterkante), damit der Kopf frei bleibt. */
(function () {
  'use strict';
  var O = ART.colors.outline;
  var W = ' stroke="' + O + '" stroke-width="2.5" stroke-linejoin="round"';   // Hauptkontur
  var w = ' stroke="' + O + '" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"'; // Detailkontur
  var HL = ' fill="#fff" opacity=".3"';                                         // Glanzlicht
  function add(id, box, svg, more) {
    var o = { box: box, svg: '<g>' + svg + '</g>' };
    for (var k in more || {}) o[k] = more[k];
    ART.items[id] = o;
  }
  function r(v) { return Math.round(v * 10) / 10; }
  function P(p) { return r(p[0]) + ' ' + r(p[1]); }

  // ---------- Geometrie: Kinnlinie (Kopf-Unterkante) und Körperseite ----------
  function cub(a, b, c, d, t) {
    var u = 1 - t;
    return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
      u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
  }
  function sample(segs, n) {
    var pts = [];
    segs.forEach(function (s, j) { for (var i = j ? 1 : 0; i <= n; i++) pts.push(cub(s[0], s[1], s[2], s[3], i / n)); });
    return pts;
  }
  // Pfad aus M/C/Z-Befehlen in Kurvenstücke zerlegen und abtasten
  function parse(d) {
    var t = d.match(/[MCZ]|-?[\d.]+/g), segs = [], cur, i = 0, start;
    while (i < t.length) {
      var c = t[i++];
      if (c === 'M') { cur = [+t[i++], +t[i++]]; start = cur; }
      else if (c === 'C') {
        while (i < t.length && !/[MCZ]/.test(t[i])) {
          var s = [cur, [+t[i], +t[i + 1]], [+t[i + 2], +t[i + 3]], [+t[i + 4], +t[i + 5]]];
          segs.push(s); cur = s[3]; i += 6;
        }
      } else if (c === 'Z' && (cur[0] !== start[0] || cur[1] !== start[1])) segs.push([cur, cur, start, start]);
    }
    return segs;
  }
  function crossings(pts, k, v) {   // alle Werte der anderen Koordinate, wo der Umriss k = v schneidet
    var out = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1];
      if ((v - a[k]) * (v - b[k]) <= 0 && a[k] !== b[k]) out.push(a[1 - k] + (b[1 - k] - a[1 - k]) * (v - a[k]) / (b[k] - a[k]));
    }
    return out;
  }
  function nearest(pts, k, v) {
    var best = pts[0];
    pts.forEach(function (p) { if (Math.abs(p[k] - v) < Math.abs(best[k] - v)) best = p; });
    return best[1 - k];
  }
  function ext(pts, k, v, max) {
    var c = crossings(pts, k, v);
    return c.length ? (max ? Math.max.apply(null, c) : Math.min.apply(null, c)) : nearest(pts, k, v);
  }
  function sc(p) { return [120 + (p[0] - 120) * 1.04, 215 + (p[1] - 215) * 1.02]; }  // Kleidung liegt leicht über dem Fell
  var HEADP = sample(parse(ART.anchors.headPath), 30);
  var BODYP = sample(parse(ART.anchors.bodyPath), 30).map(sc);
  function chin(x) { return ext(HEADP, 0, x, true); }          // Kopf-Unterkante bei x
  function sideL(y) { return ext(BODYP, 1, y, false); }        // linke Körper-/Kleidungskante bei y
  function bodyBot(x) { return ext(BODYP, 0, x, true); }       // Körperunterkante bei x
  function range(a, b, step) {
    var n = Math.max(1, Math.ceil(Math.abs(b - a) / step)), out = [];
    for (var i = 0; i <= n; i++) out.push(a + (b - a) * i / n);
    return out;
  }
  function smooth(pts) {
    var s = '';
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      s += 'C' + P([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' +
        P([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + P(p2);
    }
    return s;
  }
  // Linie entlang der Kinnlinie von x0 nach x1, um off nach unten versetzt (ohne M, wenn cont)
  function chinPts(x0, x1, off) { return range(x0, x1, 6).map(function (x) { return [x, chin(x) + off]; }); }
  function qp(a, c, b, t) { var u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]; }
  function star(cx, cy, rr, n, inner, fill, extra) {
    var d = '';
    for (var i = 0; i < n * 2; i++) {
      var a = -Math.PI / 2 + i * Math.PI / n, q = i % 2 ? rr * inner : rr;
      d += (i ? 'L' : 'M') + P([cx + Math.cos(a) * q, cy + Math.sin(a) * q]);
    }
    return '<path d="' + d + 'Z" fill="' + fill + '"' + (extra || '') + '/>';
  }
  function sparkle(cx, cy, s, fill) {
    return '<path d="M' + cx + ' ' + (cy - s) + 'Q' + cx + ' ' + cy + ' ' + (cx + s) + ' ' + cy + 'Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy + s) +
      'Q' + cx + ' ' + cy + ' ' + (cx - s) + ' ' + cy + 'Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy - s) + 'Z" fill="' + fill + '" stroke="' + O + '" stroke-width="1" stroke-linejoin="round"/>';
  }
  // Band (z. B. Umhängeband) mit Kontur: Pfad d, Breite wd
  function cord(d, wd, fill) {
    return '<path d="' + d + '" fill="none" stroke="' + O + '" stroke-width="' + (wd + 2.2) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + wd + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  // Band, das an der Kinnlinie endet (flaches Ende genau am Kinn)
  function strapUp(x0, y0, x1, wd, fill) {
    var d = 'M' + x0 + ' ' + y0 + 'L' + x1 + ' ' + r(chin(x1) + 0.6);
    return '<path d="' + d + '" stroke="' + O + '" stroke-width="' + (wd + 2.5) + '"/><path d="' + d + '" stroke="' + fill + '" stroke-width="' + wd + '"/>';
  }

  // ---------- Fliege: rot mit Pünktchen ----------
  (function () {
    var C = '#d6334f', S = '#a8243b';
    var dots = [[104, 178], [106, 187], [110, 182], [136, 178], [134, 187], [130, 182]]
      .map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.4" fill="#fff"/>'; }).join('');
    add('fliege', [98, 170, 44, 25],
      '<path d="M116 182L102 172Q97 182 102 193Z" fill="' + C + '"' + W + '/>' +
      '<path d="M124 182L138 172Q143 182 138 193Z" fill="' + C + '"' + W + '/>' +
      '<path d="M116 182L102 193Q100 190 99.5 186Q108 186 116 182Z" fill="' + S + '"/><path d="M124 182L138 193Q140 190 140.5 186Q132 186 124 182Z" fill="' + S + '"/>' + dots +
      '<path d="M116 182L102 172Q97 182 102 193ZM124 182L138 172Q143 182 138 193Z" fill="none"' + W + '/>' +
      '<rect x="114" y="176" width="12" height="12" rx="3.5" fill="' + C + '"' + W + '/>' +
      '<path d="M116 179Q118 178 120 178.5" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".5"/>');
  })();

  // ---------- Schal: rot-weiß gestreifter Winterschal mit Fransen ----------
  (function () {
    var C = '#e84a55', S = '#c7353f', K = '#fbfbfb', KS = '#dcd6e0';
    var TH = 16; // Dicke der Wicklung
    var up = chinPts(80, 160, -1), dn = chinPts(160, 80, TH);
    var wrap = 'M' + P(up[0]) + smooth(up) + 'Q' + r(166) + ' ' + r(chin(160) + TH / 2) + ' ' + P(dn[0]) + smooth(dn) + 'Q74 ' + r(chin(80) + TH / 2) + ' ' + P(up[0]) + 'Z';
    var wstripes = '';
    [96, 112, 128, 144].forEach(function (x) {
      var x1 = x + 6;
      wstripes += '<path d="M' + x + ' ' + r(chin(x) - 1) + 'L' + x1 + ' ' + r(chin(x1) - 1) + 'L' + x1 + ' ' + r(chin(x1) + TH) + 'L' + x + ' ' + r(chin(x) + TH) + 'Z" fill="' + K + '"/>';
    });
    // herabhängendes Ende: Viereck a (oben links), b (oben rechts), c (unten rechts), d (unten links)
    function end(a, b, c, d, fill, shade, bands) {
      var s = '<path d="M' + P(a) + 'L' + P(b) + 'L' + P(c) + 'L' + P(d) + 'Z" fill="' + fill + '"/>';
      var L = function (p, q, t) { return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; };
      s += '<path d="M' + P(L(b, c, 0)) + 'L' + P(L(b, c, 1)) + 'L' + P(L(L(d, c, 0.72), c, 0)) + 'L' + P(L(a, b, 0.72)) + 'Z" fill="' + shade + '" opacity="0"/>';
      bands.forEach(function (t) {
        s += '<path d="M' + P(L(a, d, t)) + 'L' + P(L(b, c, t)) + 'L' + P(L(b, c, t + 0.12)) + 'L' + P(L(a, d, t + 0.12)) + 'Z" fill="' + K + '"/>';
      });
      var fr = '';
      for (var i = 0; i <= 4; i++) { var p = L(d, c, 0.1 + i * 0.2); fr += 'M' + P(p) + 'l' + r((c[0] - d[0]) * 0.02) + ' 7'; }
      return '<path d="' + fr + '" stroke="' + O + '" stroke-width="4.4" stroke-linecap="round"/><path d="' + fr + '" stroke="' + fill + '" stroke-width="2.2" stroke-linecap="round"/>' +
        s + '<path d="M' + P(a) + 'L' + P(b) + 'L' + P(c) + 'L' + P(d) + 'Z" fill="none"' + W + '/>';
    }
    add('schal', [75, 152, 90, 99],
      end([100, 172], [116, 174], [112, 222], [95, 218], S, S, [0.3, 0.62]) +
      end([124, 174], [144, 172], [150, 240], [130, 242], C, S, [0.22, 0.48, 0.74]) +
      '<path d="' + wrap + '" fill="' + C + '"/>' + wstripes +
      '<path d="' + 'M' + P(chinPts(100, 158, TH - 4)[0]) + smooth(chinPts(100, 158, TH - 4)) + '" fill="none" stroke="' + S + '" stroke-width="4" stroke-linecap="round" opacity=".6"/>' +
      '<path d="' + wrap + '" fill="none"' + W + '/>' +
      '<path d="M92 ' + r(chin(92) + 4) + 'Q100 ' + r(chin(100) + 6) + ' 108 ' + r(chin(108) + 5) + '" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/>' +
      '');
  })();

  // ---------- Halskette: goldene Perlen mit glitzerndem Edelstein ----------
  (function () {
    var G = '#f2c14e', GS = '#c9962b', GEM = '#ff5fa2', GEMS = '#d63a7e';
    var a = [97, 164], c = [120, 226], b = [143, 164], beads = '';
    for (var i = 0; i <= 26; i++) {
      var p = qp(a, c, b, i / 26);
      if (p[1] < chin(p[0]) + 2.2 || Math.abs(p[0] - 120) < 4) continue;
      beads += '<circle cx="' + r(p[0]) + '" cy="' + r(p[1]) + '" r="' + (i % 2 ? 1.9 : 2.5) + '" fill="' + (i % 2 ? GS : G) + '" stroke="' + O + '" stroke-width="1"/>';
    }
    add('kette', [96, 169, 48, 52],
      beads +
      '<path d="M120 193.5V197" stroke="' + O + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M120 197L130 205L120 219L110 205Z" fill="' + GEM + '"' + W + '/>' +
      '<path d="M120 197L130 205L120 219Z" fill="' + GEMS + '"/>' +
      '<path d="M110 205H130M115 205L120 197L125 205L120 219Z" fill="none" stroke="' + O + '" stroke-width="1" stroke-linejoin="round"/>' +
      '<path d="M120 197L130 205L120 219L110 205Z" fill="none"' + W + '/>' +
      '<path d="M113 204L118 199" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>' +
      sparkle(134, 197, 4.5, '#fff7c2') + sparkle(106, 214, 3.5, '#fff7c2') + sparkle(139, 184, 2.8, '#fff'));
  })();

  // ---------- Rucksack: Träger vorn, der Rucksack schaut links und rechts hinter dem Körper hervor ----------
  (function () {
    var C = '#f07f3c', S = '#cc6325', D = '#2f7ab8', DS = '#245f91', G = '#c9ced8';
    // Seitenteil links: außen gerundet, innen genau an der Kleidungs-/Körperkante
    var inL = range(250, 168, 8).map(function (y) { return [sideL(y), y]; });
    var inR = inL.map(function (p) { return [240 - p[0], p[1]]; }).reverse();
    var left = 'M' + P([sideL(168), 168]) + 'Q58 168 54 186L50 236Q50 250 ' + P([sideL(250) - 2, 250]) + smooth(inL.slice(0)) ;
    left = 'M' + P(inL[inL.length - 1]) + 'Q58 166 53 186L49 236Q49 251 ' + P(inL[0]) + smooth(inL) + 'Z';
    var right = 'M' + P(inR[0]) + 'Q182 166 187 186L191 236Q191 251 ' + P(inR[inR.length - 1]) + smooth(inR.slice().reverse()) + 'Z';
    var svg =
      '<path d="' + left + '" fill="' + C + '"/>' +
      '<path d="M50 222Q50 250 ' + P(inL[0]) + 'L' + P(inL[2]) + 'Q58 238 55 214Z" fill="' + S + '"/>' +
      '<path d="M58 214Q52 226 51 240" stroke="' + O + '" stroke-width="1.5" fill="none" stroke-dasharray="3 2.5" stroke-linecap="round"/>' +
      '<path d="' + left + '" fill="none"' + W + '/>' +
      '<path d="' + right + '" fill="' + C + '"/>' +
      '<path d="M190 206L191 236Q191 251 ' + P(inR[inR.length - 1]) + 'L' + P(inR[inR.length - 4]) + 'Q184 236 184 206Z" fill="' + S + '"/>' +
      '<path d="' + right + '" fill="none"' + W + '/>' +
      '<path d="M184 216H191V234H184Z" fill="' + D + '"' + w + '/>' +
      // Träger (vorn)
      strapUp(88, 250, 101, 9, D) + strapUp(152, 250, 139, 9, D) +
      '<path d="M88 250L101 ' + r(chin(101)) + '" stroke="' + DS + '" stroke-width="3" transform="translate(2.5 0)"/>' +
      '<path d="M152 250L139 ' + r(chin(139)) + '" stroke="' + DS + '" stroke-width="3" transform="translate(2.5 0)"/>' +
      '<rect x="87.5" y="226" width="12" height="8" rx="2" fill="none" stroke="' + O + '" stroke-width="3.5" transform="rotate(-18 93.5 230)"/><rect x="87.5" y="226" width="12" height="8" rx="2" fill="none" stroke="' + G + '" stroke-width="1.8" transform="rotate(-18 93.5 230)"/>' +
      '<rect x="140.5" y="226" width="12" height="8" rx="2" fill="none" stroke="' + O + '" stroke-width="3.5" transform="rotate(18 146.5 230)"/><rect x="140.5" y="226" width="12" height="8" rx="2" fill="none" stroke="' + G + '" stroke-width="1.8" transform="rotate(18 146.5 230)"/>' +
      // Brustgurt mit Schnalle
      '<path d="M98 199H142" stroke="' + O + '" stroke-width="6"/><path d="M98 199H142" stroke="' + DS + '" stroke-width="3.5"/>' +
      '<rect x="113" y="194" width="14" height="10" rx="2.5" fill="' + G + '"' + w + '/><path d="M120 196V202" stroke="' + O + '" stroke-width="1.2"/>';
    add('rucksack', [47, 166, 146, 86], svg);
  })();

  // ---------- Jetpack: hinter dem Körper, Tanks mit Düsen und Flammen seitlich ----------
  (function () {
    var C = '#d3dae6', S = '#a9b3c4', RD = '#e8505b', RS = '#bf3a44', F1 = '#ff9d2e', F2 = '#ffd84a';
    function tank(x, flip) {
      var s = '';
      // Flamme
      s += '<path d="M' + (x - 9) + ' 250Q' + (x - 12) + ' 268 ' + x + ' 286Q' + (x + 12) + ' 268 ' + (x + 9) + ' 250Z" fill="' + F1 + '"' + W + '/>' +
        '<path d="M' + (x - 5) + ' 251Q' + (x - 6) + ' 264 ' + x + ' 276Q' + (x + 6) + ' 264 ' + (x + 5) + ' 251Z" fill="' + F2 + '"/>';
      // Düse
      s += '<path d="M' + (x - 8) + ' 236H' + (x + 8) + 'L' + (x + 11) + ' 252H' + (x - 11) + 'Z" fill="' + S + '"' + W + '/>';
      // Tank
      s += '<path d="M' + (x - 14) + ' 172Q' + (x - 14) + ' 148 ' + x + ' 140Q' + (x + 14) + ' 148 ' + (x + 14) + ' 172V232Q' + (x + 14) + ' 240 ' + x + ' 240Q' + (x - 14) + ' 240 ' + (x - 14) + ' 232Z" fill="' + C + '"/>' +
        '<path d="M' + (x + 5) + ' 146Q' + (x + 14) + ' 152 ' + (x + 14) + ' 172V232Q' + (x + 14) + ' 240 ' + x + ' 240L' + (x + 6) + ' 236V172Q' + (x + 6) + ' 154 ' + (x + 5) + ' 146Z" fill="' + S + '"/>' +
        // rote Spitze und Streifen
        '<path d="M' + (x - 14) + ' 166Q' + (x - 14) + ' 148 ' + x + ' 140Q' + (x + 14) + ' 148 ' + (x + 14) + ' 166Z" fill="' + RD + '"/>' +
        '<path d="M' + (x + 5) + ' 146Q' + (x + 14) + ' 152 ' + (x + 14) + ' 166H' + (x + 6) + 'Q' + (x + 6) + ' 154 ' + (x + 5) + ' 146Z" fill="' + RS + '"/>' +
        '<path d="M' + (x - 14) + ' 166H' + (x + 14) + '"' + W + '/>' +
        '<rect x="' + (x - 14) + '" y="208" width="28" height="7" fill="' + RD + '"' + w + '/>' +
        '<path d="M' + (x - 14) + ' 172Q' + (x - 14) + ' 148 ' + x + ' 140Q' + (x + 14) + ' 148 ' + (x + 14) + ' 172V232Q' + (x + 14) + ' 240 ' + x + ' 240Q' + (x - 14) + ' 240 ' + (x - 14) + ' 232Z" fill="none"' + W + '/>' +
        '<ellipse cx="' + (x - 7) + '" cy="186" rx="2.5" ry="12"' + HL + '/>';
      return s;
    }
    add('jetpack', [41, 138, 158, 150],
      '<rect x="64" y="176" width="112" height="56" rx="10" fill="' + S + '"' + W + '/>' +
      tank(57) + tank(183), { back: true });
  })();

  // ---------- Umhang: rot, hinter dem Körper; goldene Schließen vorn (Ebene "top") ----------
  (function () {
    var C = '#e2333c', S = '#b3222b', G = '#ffd23f';
    var cape = 'M88 150C70 176 52 236 38 282Q50 290 64 284Q78 292 92 285Q106 292 120 286Q134 292 148 285Q162 292 176 284Q190 290 202 282C188 236 170 176 152 150Q120 138 88 150Z';
    var collarL = 'M' + P([82, chin(82) + 2]) + smooth(range(82, 102, 5).map(function (x) { return [x, chin(x) + 3]; }));
    var collarR = 'M' + P([158, chin(158) + 2]) + smooth(range(158, 138, 5).map(function (x) { return [x, chin(x) + 3]; }));
    add('superheldencape', [36, 142, 168, 149],
      '<path d="' + cape + '" fill="' + C + '"/>' +
      '<path d="M152 150C170 176 188 236 202 282Q190 290 176 284Q170 250 160 210Q152 176 140 148Z" fill="' + S + '"/>' +
      '<path d="M60 250Q66 220 78 196M180 250Q174 220 162 196" stroke="' + S + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="' + cape + '" fill="none"' + W + '/>',
      {
        back: true,
        top: '<g>' + cord(collarL, 5, C) + cord(collarR, 5, C) +
          '<circle cx="102" cy="' + r(chin(102) + 3) + '" r="4.8" fill="' + G + '"' + W + '/><circle cx="138" cy="' + r(chin(138) + 3) + '" r="4.8" fill="' + G + '"' + W + '/>' +
          '<circle cx="100.8" cy="' + r(chin(102) + 1.8) + '" r="1.4" fill="#fff" opacity=".7"/><circle cx="136.8" cy="' + r(chin(138) + 1.8) + '" r="1.4" fill="#fff" opacity=".7"/></g>'
      });
  })();

  // ---------- Augenklappe: auf dem linken Auge (96, 92), Band schräg über den Kopf ----------
  (function () {
    var C = '#2b2630';
    var xl = r(ext(HEADP, 1, 97, false) + 0.8), yr = r(ext(HEADP, 0, 148, false) + 0.8);
    var band = 'M84 90L' + xl + ' 97M106 84L148 ' + yr;
    add('augenklappe', [Math.floor(xl) - 2, Math.floor(yr) - 2, 150 - Math.floor(xl) + 2, 108 - Math.floor(yr)],
      '<path d="' + band + '" stroke="' + O + '" stroke-width="4.6"/>' +
      '<path d="' + band + '" stroke="' + C + '" stroke-width="2.6"/>' +
      '<path d="M83 86Q95 78 109 84Q111 99 97 105Q82 101 83 86Z" fill="' + C + '"' + W + '/>' +
      '<path d="M88 87Q94 83 100 84" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".35"/>' +
      '<path d="M96 104Q106 100 108 90" stroke="#4a4452" stroke-width="2.4" fill="none" stroke-linecap="round"/>');
  })();

  // ---------- Blumenkette (Hawaii-Lei) ----------
  (function () {
    var cols = ['#ff6fa8', '#ffd84a', '#fff7e8', '#ff9d2e', '#b57bff', '#ff6fa8', '#ffd84a', '#fff7e8', '#ff9d2e'];
    var a = [84, 160], c = [120, 236], b = [156, 160], s = '', lv = '';
    // Kurve abtasten und Blüten in gleichen Abständen verteilen (nur unterhalb der Kinnlinie)
    var poly = range(0, 1, 0.01).map(function (t) { var p = qp(a, c, b, t); p[1] = Math.max(p[1], chin(p[0]) + 7.5); return p; });
    var len = [0];
    for (var j = 1; j < poly.length; j++) len.push(len[j - 1] + Math.hypot(poly[j][0] - poly[j - 1][0], poly[j][1] - poly[j - 1][1]));
    function at(f) { var L = f * len[len.length - 1]; for (var j = 1; j < len.length; j++) if (len[j] >= L) { var u = (L - len[j - 1]) / (len[j] - len[j - 1]); return [poly[j - 1][0] + (poly[j][0] - poly[j - 1][0]) * u, poly[j - 1][1] + (poly[j][1] - poly[j - 1][1]) * u]; } return poly[poly.length - 1]; }
    var n = 9;
    for (var i = 0; i < n; i++) {
      var f = 0.04 + i * 0.92 / (n - 1), p = at(f), q = at(Math.min(1, f + 0.055));
      lv += '<ellipse cx="' + r(q[0]) + '" cy="' + r(q[1] + 3) + '" rx="5.5" ry="2.8" fill="#3cb55a" stroke="' + O + '" stroke-width="1.2" transform="rotate(' + (i < n / 2 ? 50 : -50) + ' ' + r(q[0]) + ' ' + r(q[1] + 3) + ')"/>';
      var pe = '';
      for (var k = 0; k < 5; k++) {
        var an = (k * 72 - 90 + i * 20) * Math.PI / 180;
        pe += '<circle cx="' + r(p[0] + Math.cos(an) * 4.4) + '" cy="' + r(p[1] + Math.sin(an) * 4.4) + '" r="3.9" fill="' + cols[i] + '" stroke="' + O + '" stroke-width="1.2"/>';
      }
      s += pe + '<circle cx="' + r(p[0]) + '" cy="' + r(p[1]) + '" r="2.3" fill="' + (cols[i] === '#ffd84a' ? '#ff9d2e' : '#ffd84a') + '" stroke="' + O + '" stroke-width="1"/>';
    }
    add('blumenkette', [77, 159, 86, 49], lv.split('</ellipse>').join('') + s);
  })();

  // ---------- Sheriffstern: sechszackig, gold, rechts auf der Brust ----------
  (function () {
    var G = '#f2c14e', GS = '#d19a2a', cx = 136, cy = 207, R = 15, tips = '';
    for (var i = 0; i < 6; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 3;
      tips += '<circle cx="' + r(cx + Math.cos(a) * R) + '" cy="' + r(cy + Math.sin(a) * R) + '" r="2.4" fill="' + G + '"' + w + '/>';
    }
    add('sheriffstern', [119, 188, 34, 38],
      star(cx, cy, R, 6, 0.55, G) +
      '<path d="M' + cx + ' ' + cy + 'L' + r(cx + R * 0.866) + ' ' + r(cy + R / 2) + 'L' + r(cx + R * 0.3) + ' ' + r(cy + R * 0.52) + 'L' + cx + ' ' + (cy + R) + 'L' + r(cx - R * 0.3) + ' ' + r(cy + R * 0.52) + 'Z" fill="' + GS + '"/>' +
      star(cx, cy, R, 6, 0.55, 'none', W) + tips +
      '<circle cx="' + cx + '" cy="' + cy + '" r="5.5" fill="' + G + '"' + w + '/>' +
      star(cx, cy, 3.4, 5, 0.45, GS) +
      '<path d="M' + (cx - 6) + ' ' + (cy - 7) + 'L' + (cx - 3) + ' ' + (cy - 10) + '" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>');
  })();

  // ---------- Kamera am Band ----------
  (function () {
    var B = '#3a3842', T = '#cfd3dc', TS = '#a9b0bd', RD = '#e0525a';
    add('kamera', [97, 166, 46, 56],
      strapUp(104, 196, 99, 3.2, RD) + strapUp(136, 196, 141, 3.2, RD) +
      '<rect x="103" y="187" width="10" height="7" rx="1.5" fill="' + TS + '"' + w + '/>' +
      '<rect x="129" y="188" width="7" height="5" rx="1.5" fill="' + RD + '"' + w + '/>' +
      '<rect x="99" y="192" width="42" height="28" rx="5" fill="' + B + '"' + W + '/>' +
      '<path d="M99.5 198V197Q99.5 192.5 104 192.5H136Q140.5 192.5 140.5 197V198Z" fill="' + T + '"/>' +
      '<path d="M99 198.5H141" stroke="' + O + '" stroke-width="1.5"/>' +
      '<rect x="99" y="192" width="42" height="28" rx="5" fill="none"' + W + '/>' +
      '<rect x="131" y="201" width="7" height="5" rx="1.2" fill="#fff7c2"' + w + '/>' +
      '<circle cx="120" cy="208" r="10" fill="' + T + '"' + W + '/>' +
      '<circle cx="120" cy="208" r="6.5" fill="#2b2b33"' + w + '/>' +
      '<circle cx="120" cy="208" r="3.8" fill="#4f8fe0"/>' +
      '<circle cx="118" cy="206" r="1.6" fill="#fff" opacity=".85"/>' +
      '<path d="M101.5 214Q101.5 217 104 217.5" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".3"/>');
  })();

  // ---------- Medaille am Band ----------
  (function () {
    var G = '#f2c14e', GS = '#d19a2a', B1 = '#3d7be0', B2 = '#e2333c';
    function rib(x0, x1, x2, x3, col, stripe) {
      // Band: oben x0..x1 (an der Kinnlinie), unten x2..x3 bei y 214
      return '<path d="M' + x0 + ' ' + r(chin(x0) + 0.6) + 'L' + x1 + ' ' + r(chin(x1) + 0.6) + 'L' + x3 + ' 214L' + x2 + ' 214Z" fill="' + col + '"' + W + '/>' +
        '<path d="M' + r((x0 + x1) / 2) + ' ' + r(chin((x0 + x1) / 2) + 2) + 'L' + r((x2 + x3) / 2) + ' 213" stroke="' + stripe + '" stroke-width="2.5"/>';
    }
    add('medaille', [97, 166, 46, 71],
      rib(99, 109, 113, 123, B1, '#fff') + rib(131, 141, 117, 127, B2, '#fff') +
      '<circle cx="120" cy="222" r="13" fill="' + G + '"' + W + '/>' +
      '<path d="M129.2 212.8A13 13 0 0 1 120 235A13 13 0 0 0 129.2 212.8Z" fill="' + GS + '"/>' +
      '<circle cx="120" cy="222" r="13" fill="none"' + W + '/>' +
      '<circle cx="120" cy="222" r="8.5" fill="none" stroke="' + GS + '" stroke-width="1.6"/>' +
      star(120, 222, 6, 5, 0.45, '#fff3b0', ' stroke="' + O + '" stroke-width="1.2" stroke-linejoin="round"') +
      '<path d="M112 216Q114 212 118 211" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>');
  })();

  // ---------- Halstuch: blaues Tuch mit weißen Tupfen, Spitze nach unten ----------
  (function () {
    var C = '#2f6fc4', S = '#245aa3', K = '#fff';
    var topPts = range(146, 94, 6).map(function (x) { return [x, chin(x) - 0.5]; });
    var tri = 'M94 ' + r(chin(94) - 0.5) + 'L146 ' + r(chin(146) - 0.5) + 'Q140 188 120 208Q100 188 94 ' + r(chin(94) - 0.5) + 'Z';
    tri = 'M' + P(topPts[topPts.length - 1]) + 'Q100 190 120 209Q140 190 ' + P(topPts[0]) + smooth(topPts) + 'Z';
    var dots = [[106, 176], [120, 180], [134, 176], [113, 190], [127, 190], [120, 200], [100, 172], [140, 172]]
      .map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.9" fill="' + K + '"/>'; }).join('');
    var roll = range(90, 150, 6).map(function (x) { return [x, chin(x) + 3]; });
    add('halstuch', [88, 163, 64, 48],
      '<path d="' + tri + '" fill="' + C + '"/>' +
      '<path d="M120 209Q140 190 146 ' + r(chin(146)) + 'L136 ' + r(chin(136) + 4) + 'Q132 190 120 209Z" fill="' + S + '"/>' + dots +
      '<path d="' + tri + '" fill="none"' + W + '/>' +
      cord('M' + P(roll[0]) + smooth(roll), 5, C));
  })();
})();
