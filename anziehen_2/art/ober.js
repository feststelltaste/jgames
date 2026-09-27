/* Capybara-Modenschau – Grafik: Kategorie "ober" (Kleidung).
   Koordinaten wie capybara.js (240 x 300), Teile liegen ohne Transformation auf dem Capybara.
   Oberteile: Rumpf in "svg" (oben am Kinn entlang, damit der Kopf frei bleibt), Ärmel in "top". */
(function () {
  'use strict';
  var O = ART.colors.outline;
  var W = ' stroke="' + O + '" stroke-width="2.5" stroke-linejoin="round"';   // Hauptkontur
  var w = ' stroke="' + O + '" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"'; // Detailkontur
  var NF = ' fill="none"';
  var HL = ' fill="#fff" opacity=".3"';                                         // Glanzlicht
  var FUR = ART.colors.fur;
  function add(id, box, svg, top, more) {
    var o = { box: box, svg: '<g>' + svg + '</g>' };
    if (top) o.top = '<g>' + top + '</g>';
    for (var k in more || {}) o[k] = more[k];
    ART.items[id] = o;
  }
  function r(v) { return Math.round(v * 10) / 10; }
  function P(p) { return r(p[0]) + ' ' + r(p[1]); }

  // ---------- Geometrie: Körperumriss (leicht vergrößert, damit Stoff über dem Fell liegt) und Kinnlinie ----------
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
  function sideR(y) { return 240 - sideL(y); }
  function solve(f, lo, hi) {
    var flo = f(lo);
    for (var i = 0; i < 40; i++) { var m = (lo + hi) / 2, fm = f(m); if ((fm > 0) === (flo > 0)) { lo = m; flo = fm; } else hi = m; }
    return (lo + hi) / 2;
  }
  // Glatte Kurve durch Punkte (Catmull-Rom); ohne führendes M
  function smooth(pts) {
    var s = '';
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      s += 'C' + P([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' +
        P([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + P(p2);
    }
    return s;
  }
  function range(a, b, step) {
    var n = Math.max(1, Math.ceil(Math.abs(b - a) / step)), out = [];
    for (var i = 0; i <= n; i++) out.push(a + (b - a) * i / n);
    return out;
  }
  function hem(y, drop) { return function (x) { var d = (x - 120) / 56; return y + (drop || 0) * Math.max(0, 1 - d * d); }; }
  function flat(y) { return function () { return y; }; }
  // Fläche zwischen linker Kante L(y), rechter Kante R(y), oberer Kante top(x) und unterer Kante bot(x)
  // o.full: untere Kante = Körperunterkante (L/R = Körperseiten)
  function shape(o) {
    var L = o.L || sideL, R = o.R || sideR, top = o.top || chin, bot = o.bot, st = o.step || 7;
    var yTL = solve(function (y) { return y - top(L(y)); }, 145, 300),
      yTR = solve(function (y) { return y - top(R(y)); }, 145, 300), yBL, yBR;
    if (o.full) { bot = bodyBot; yBL = yBR = o.full === true ? 244 : o.full; }
    else if (o.corner) { yBL = yBR = o.corner; }
    else {
      yBL = solve(function (y) { return bot(L(y)) - y; }, yTL, 300);
      yBR = solve(function (y) { return bot(R(y)) - y; }, yTR, 300);
    }
    var left = range(yTL, yBL, st).map(function (y) { return [L(y), y]; }),
      bottom = range(L(yBL), R(yBR), 8).map(function (x) { return [x, bot(x)]; }),
      right = range(yBR, yTR, st).map(function (y) { return [R(y), y]; }),
      topc = range(R(yTR), L(yTL), 7).map(function (x) { return [x, top(x)]; });
    left[left.length - 1] = bottom[0]; bottom[bottom.length - 1] = right[0]; right[right.length - 1] = topc[0]; topc[topc.length - 1] = left[0];
    return 'M' + P(left[0]) + smooth(left) + smooth(bottom) + smooth(right) + smooth(topc) + 'Z';
  }
  function path(d, fill, stroke) { return '<path d="' + d + '" fill="' + fill + '"' + (stroke || '') + '/>'; }
  // Rumpf: Grundfläche + Schatten rechts + Kontur
  function body(o, fill, shade, extra) {
    var R = o.R || sideR, sw = o.shadeW || 13, yt = o.shadeTop || 165, yb = o.shadeBot || 272;
    var so = {}; for (var k in o) so[k] = o[k];
    so.R = R;
    so.L = function (y) { var t = Math.min(1, Math.max(0, (y - yt) / (yb - yt))); return R(y) - 2 - sw * Math.sin(Math.PI * Math.pow(t, 0.8)); };
    var d = shape(o);
    return path(d, fill) + (shade ? path(shape(so), shade) : '') + (extra || '') + path(d, 'none', W);
  }
  // Streifen entlang der Kinnlinie (Kragen, Halsring): x0..x1, Mittellinie off unter dem Kinn
  function chinLine(x0, x1, off) {
    var pts = range(x0, x1, 6).map(function (x) { return [x, chin(x) + off]; });
    return 'M' + P(pts[0]) + smooth(pts);
  }
  function band(d, width, fill) {
    return '<path d="' + d + '" fill="none" stroke="' + O + '" stroke-width="' + (width + 2.5) + '" stroke-linecap="round"/>' +
      '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="' + width + '" stroke-linecap="round"/>';
  }
  function button(x, y, rr, fill) { return '<circle cx="' + x + '" cy="' + y + '" r="' + rr + '" fill="' + fill + '"' + w + '/>'; }

  // ---------- Ärmel ----------
  var ARM = {};
  ['L', 'R'].forEach(function (k) {
    var n = ART.anchors.armPaths[k].match(/-?[\d.]+/g).map(Number);
    ARM[k] = { s: [n[0], n[1]], c: [n[2], n[3]], p: [n[4], n[5]] };
  });
  function qpt(k, t) { var a = ARM[k], u = 1 - t; return [u * u * a.s[0] + 2 * u * t * a.c[0] + t * t * a.p[0], u * u * a.s[1] + 2 * u * t * a.c[1] + t * t * a.p[1]]; }
  // Querstreifen über den Ärmel von t0 bis t1
  function ring(k, t0, t1, color, wd) {
    return '<path d="M' + P(qpt(k, t0)) + 'L' + P(qpt(k, t1)) + '" stroke="' + color + '" stroke-width="' + (wd || 20) + '"/>';
  }
  // Teilstück t0..t1 der Armkurve als Pfad
  function qsub(k, t0, t1) {
    var a = ARM[k], b = qpt(k, t0), e = qpt(k, t1), dt = t1 - t0;
    var d = [2 * (1 - t0) * (a.c[0] - a.s[0]) + 2 * t0 * (a.p[0] - a.c[0]), 2 * (1 - t0) * (a.c[1] - a.s[1]) + 2 * t0 * (a.p[1] - a.c[1])];
    return 'M' + P(b) + 'Q' + P([b[0] + d[0] * dt / 2, b[1] + d[1] * dt / 2]) + ' ' + P(e);
  }
  var SHOFF = { L: 'translate(4.5 5)', R: 'translate(-1.5 7)' };
  function sleeves(fill, shade, opt) {
    opt = opt || {};
    var t = opt.short ? 0.45 : 0.78, s = ART.sleeves(fill, { short: opt.short, stroke: opt.stroke });
    ['L', 'R'].forEach(function (k) {
      s += '<path d="' + qsub(k, 0.1, t - (opt.cuff ? (opt.cuffW || 0.12) + 0.03 : 0.05)) + '" transform="' + SHOFF[k] + '" fill="none" stroke="' + shade + '" stroke-width="6" stroke-linecap="round"/>';
      if (opt.pattern) s += opt.pattern(k, t);
      if (opt.cuff) {
        s += ring(k, t - (opt.cuffW || 0.12), t, opt.cuff);
        var c = qpt(k, t - (opt.cuffW || 0.12)), c2 = qpt(k, t - (opt.cuffW || 0.12) - 0.01), dx = c[0] - c2[0], dy = c[1] - c2[1], l = Math.sqrt(dx * dx + dy * dy);
        dx /= l; dy /= l;
        s += '<path d="M' + P([c[0] - dy * 11, c[1] + dx * 11]) + 'L' + P([c[0] + dy * 11, c[1] - dx * 11]) + '"' + w + '/>';
      }
    });
    // Ärmelende mit Kontur nachziehen (ART.sleeves zeichnet nur den Schlauch)
    return s;
  }

  // Fertige Linienzüge
  function chinY(f) { return solve(function (y) { return y - chin(f(y)); }, 145, 300); }
  function vline(x, y0, y1) { return 'M' + x + ' ' + y0 + 'V' + y1; }

  // ======================================================================
  // Pullover: blau, Norwegerband, Rippbündchen
  // ======================================================================
  (function () {
    var C = '#4f86d9', S = '#3a6bbd', K = '#fbf1dc', RD = '#e0525a';
    var H = hem(256, 6), o = { bot: H };
    var rib = '';
    for (var x = 74; x <= 166; x += 5) { var yb = H(x); rib += 'M' + x + ' ' + r(yb - 7) + 'V' + r(yb - 1.5); }
    var zig = 'M' + P([sideL(204), 204]);
    for (var zx = 76, zi = 0; zx <= 164; zx += 8, zi++) zig += 'L' + zx + ' ' + (zi % 2 ? 200 : 208);
    zig += 'L' + P([sideR(204), 204]);
    var knit = '';
    for (var ky = 222; ky <= 244; ky += 11) for (var kx = 88 + (ky % 2 ? 0 : 6); kx <= 154; kx += 12)
      knit += 'M' + (kx - 3) + ' ' + ky + 'L' + kx + ' ' + (ky + 4) + 'L' + (kx + 3) + ' ' + ky;
    var dots = '';
    for (var dx = 84; dx <= 160; dx += 16) dots += '<path d="M' + dx + ' 187l3 3-3 3-3-3z" fill="' + K + '"/>';
    var svg = body(o, C, S,
      path(shape({ top: flat(197), bot: flat(211), step: 6 }), K) +
      '<path d="' + zig + '" fill="none" stroke="' + RD + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>' +
      path(shape({ top: flat(197), bot: flat(211), step: 6 }), 'none', w) +
      dots +
      '<path d="' + knit + '" fill="none" stroke="' + S + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      path(shape({ top: function (x) { return H(x) - 9; }, bot: H }), S) +
      '<path d="' + rib + '" stroke="' + C + '" stroke-width="1.6" stroke-linecap="round"/>' +
      path(shape({ top: function (x) { return H(x) - 9; }, bot: H }), 'none', w)) +
      band(chinLine(96, 144, 3.5), 7, S) +
      '<path d="' + chinLine(99, 141, 3.5) + '" fill="none" stroke="' + C + '" stroke-width="2" stroke-dasharray="1.6 3.4"/>' +
      '<ellipse cx="106" cy="182" rx="8" ry="3.5" transform="rotate(-15 106 182)"' + HL + '/>';
    var top = sleeves(C, S, {
      cuff: S, cuffW: 0.13, pattern: function (k) {
        return ring(k, 0.3, 0.38, K, 20) + ring(k, 0.335, 0.345, RD, 20);
      }
    });
    add('pullover', [46, 154, 149, 112], svg, top);
  })();

  // ======================================================================
  // Hawaiihemd: türkis mit Hibiskusblüten, kurze Ärmel, offener Kragen
  // ======================================================================
  function flower(cx, cy, rr, petal, mid) {
    var s = '';
    for (var i = 0; i < 5; i++) {
      var a = (i * 72 - 90) * Math.PI / 180;
      s += '<circle cx="' + r(cx + Math.cos(a) * rr * 0.62) + '" cy="' + r(cy + Math.sin(a) * rr * 0.62) + '" r="' + r(rr * 0.5) + '" fill="' + petal + '" stroke="' + O + '" stroke-width="1.2"/>';
    }
    return s + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r(rr * 0.26) + '" fill="' + mid + '" stroke="' + O + '" stroke-width="1"/>';
  }
  function leaf(cx, cy, rot, col) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="7" ry="3.2" fill="' + col + '" stroke="' + O + '" stroke-width="1.2" transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"/>';
  }
  (function () {
    var C = '#27b1b8', S = '#1b8c93', PK = '#ff6fa8', YE = '#ffd84a', WH = '#fff7e8', GR = '#3cb55a';
    var H = hem(252, 4);
    function vL(y) { return y < 194 ? 120 - (194 - y) * 0.85 : 122; }   // Kante der linken Hälfte
    function vR(y) { return y < 194 ? 120 + (194 - y) * 0.85 : 118; }
    var fl =
      leaf(84, 196, 30, GR) + leaf(100, 208, -40, GR) + flower(92, 204, 11, PK, YE) +
      leaf(152, 186, -30, GR) + flower(146, 196, 9, YE, PK) +
      leaf(126, 222, 20, GR) + flower(135, 229, 10, WH, PK) +
      leaf(84, 240, -20, GR) + flower(92, 244, 9, YE, PK) +
      leaf(160, 236, 50, GR) + flower(150, 244, 10, PK, YE) +
      '';
    var svg =
      body({ R: vL, bot: H }, C, null) +
      body({ L: vR, bot: H }, C, S) +
      fl +
      path(shape({ R: vL, bot: H }), 'none', W) +
      path(shape({ L: vR, bot: H }), 'none', W) +
      // Knöpfe
      button(120, 204, 2.2, '#fff') + button(120, 222, 2.2, '#fff') + button(120, 240, 2.2, '#fff') +
      // Kragen
      '<path d="M' + P([vL(chinY(vL)), chinY(vL)]) + 'L119 193L101 201Q92 186 88 170Q93 168 ' + P([vL(chinY(vL)), chinY(vL)]) + 'Z" fill="' + C + '"' + W + '/>' +
      '<path d="M' + P([vR(chinY(vR)), chinY(vR)]) + 'L121 193L139 201Q148 186 152 170Q147 168 ' + P([vR(chinY(vR)), chinY(vR)]) + 'Z" fill="' + C + '"' + W + '/>' +
      '<path d="M122 193L139 201Q148 186 152 170Q151 186 141 197Z" fill="' + S + '"/>' +
      '<ellipse cx="96" cy="200" rx="8" ry="4" transform="rotate(-25 96 200)"' + HL + '/>';
    var top = sleeves(C, S, {
      short: true, cuff: S, cuffW: 0.08, pattern: function (k) {
        var p = qpt(k, 0.22), q = qpt(k, 0.36);
        return flower(r(p[0]), r(p[1]), 7, k === 'L' ? YE : PK, k === 'L' ? PK : YE) + '<circle cx="' + r(q[0]) + '" cy="' + r(q[1]) + '" r="2.5" fill="' + WH + '" stroke="' + O + '" stroke-width="1"/>';
      }
    });
    add('hawaiihemd', [53, 154, 132, 106], svg, top);
  })();

  function K(v) { return function () { return v; }; }
  function dash(d, col, wd, da) { return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + (wd || 1.3) + '" stroke-dasharray="' + (da || '3 2.5') + '" stroke-linecap="round"/>'; }
  function edgeLine(f, y0, y1, dx) {   // Linie entlang einer Kante x = f(y) + dx
    var pts = range(y0, y1, 6).map(function (y) { return [f(y) + (dx || 0), y]; });
    return 'M' + P(pts[0]) + smooth(pts);
  }
  // Träger von (x0, y0) bis zur Kinnlinie bei x1 (endet genau am Kinn, damit der Kopf frei bleibt)
  function strap(x0, y0, x1, wd, fill) {
    var d = 'M' + x0 + ' ' + y0 + 'L' + x1 + ' ' + r(chin(x1) + 0.6);
    return '<path d="' + d + '" stroke="' + O + '" stroke-width="' + (wd + 2.5) + '"/><path d="' + d + '" stroke="' + fill + '" stroke-width="' + wd + '"/>';
  }

  // ======================================================================
  // Karohemd: rot kariert, Knopfleiste, Brusttasche
  // ======================================================================
  (function () {
    var C = '#d8433a', S = '#b3322b', D = '#9e2a25', DD = '#76201c', LN = '#f7b3a3';
    var H = hem(254, 5);
    function vL(y) { return y < 182 ? 120 - (182 - y) * 0.7 : 122; }
    function vR(y) { return y < 182 ? 120 + (182 - y) * 0.7 : 118; }
    var pl = '', HY = [186, 204, 222, 240], VX = [81, 100, 140, 159];
    HY.forEach(function (y) { pl += path(shape({ top: flat(y - 3), bot: flat(y + 3), step: 14 }), D); });
    VX.forEach(function (x) { pl += path(shape({ L: function (y) { return Math.max(x - 3, sideL(y) + 1); }, R: function (y) { return Math.min(x + 3, sideR(y) - 1); }, bot: H, step: 7 }), D); });
    HY.forEach(function (y) { VX.forEach(function (x) { pl += '<rect x="' + (x - 3) + '" y="' + (y - 3) + '" width="6" height="6" fill="' + DD + '"/>'; }); });
    var ln = '';
    [195, 213, 231, 248].forEach(function (y) { ln += 'M' + r(sideL(y) + 1.5) + ' ' + y + 'H' + r(sideR(y) - 1.5); });
    [90.5, 110, 130, 149.5].forEach(function (x) { ln += 'M' + x + ' ' + r(chin(x) + 1) + 'V' + r(H(x) - 1); });
    pl += '<path d="' + ln + '" stroke="' + LN + '" stroke-width="1.1"/>';
    var svg =
      body({ R: vL, bot: H }, C, null) + body({ L: vR, bot: H }, C, S) + pl +
      path(shape({ R: vL, bot: H }), 'none', W) + path(shape({ L: vR, bot: H }), 'none', W) +
      // Brusttasche
      '<path d="M133 190H153V206Q143 209 133 206Z" fill="' + C + '"' + w + '/><path d="M136 196H150M143 190V206" stroke="' + D + '" stroke-width="3"/>' +
      '<path d="M133 190H153V206Q143 209 133 206Z" fill="none"' + w + '/><path d="M132 190H154V195Q143 197 132 195Z" fill="' + S + '"' + w + '/>' +
      button(120, 196, 2, '#fff') + button(120, 214, 2, '#fff') + button(120, 232, 2, '#fff') + button(143, 194, 1.5, '#fff') +
      // Kragen
      '<path d="M' + P([vL(chinY(vL)), chinY(vL)]) + 'L119 181L104 187Q96 178 94 169Q100 167 ' + P([vL(chinY(vL)), chinY(vL)]) + 'Z" fill="' + C + '"' + W + '/>' +
      '<path d="M' + P([vR(chinY(vR)), chinY(vR)]) + 'L121 181L136 187Q144 178 146 169Q140 167 ' + P([vR(chinY(vR)), chinY(vR)]) + 'Z" fill="' + S + '"' + W + '/>';
    var top = sleeves(C, S, {
      cuff: S, cuffW: 0.1, pattern: function (k) {
        return '<path d="' + qsub(k, 0.04, 0.66) + '" fill="none" stroke="' + D + '" stroke-width="6"/>' +
          ring(k, 0.2, 0.26, D) + ring(k, 0.44, 0.5, D) + ring(k, 0.2, 0.26, DD, 6) + ring(k, 0.44, 0.5, DD, 6) +
          ring(k, 0.33, 0.34, LN) + ring(k, 0.57, 0.58, LN);
      }
    });
    add('bauernhemd', [46, 154, 150, 109], svg, top);
  })();

  // ======================================================================
  // Smoking / Frack: schwarz, weißes Hemd, Satinrevers, Frackschöße
  // ======================================================================
  (function () {
    var C = '#2f2840', S = '#1f1a2c', L = '#574c73', SH = '#fff', SS = '#dfe3ea';
    var H = hem(258, 4);
    function vL(y) { return y < 226 ? 120 - (226 - y) * 0.25 : 122; }
    function vR(y) { return y < 226 ? 120 + (226 - y) * 0.25 : 118; }
    var tL = vL(chinY(vL)), yL = chinY(vL);
    var svg =
      // Frackschöße (hängen seitlich unter der Jacke heraus)
      '<path d="M70 240Q67 264 74 286L88 272Q85 258 88 244Z" fill="' + C + '"' + W + '/>' +
      '<path d="M170 240Q173 264 166 286L152 272Q155 258 152 244Z" fill="' + C + '"' + W + '/>' +
      '<path d="M160 250Q162 266 161 280L166 286Q173 264 170 244Z" fill="' + S + '"/>' +
      '<path d="M170 240Q173 264 166 286L152 272Q155 258 152 244Z" fill="none"' + W + '/>' +
      // Hemd
      path(shape({ bot: flat(232), L: K(100), R: K(140) }), SH, w) +
      '<path d="M120 172V228" stroke="' + SS + '" stroke-width="2"/>' +
      button(120, 190, 1.8, SS) + button(120, 204, 1.8, SS) + button(120, 218, 1.8, SS) +
      '<path d="M107 168L117 176L108 180Z" fill="' + SH + '"' + w + '/><path d="M133 168L123 176L132 180Z" fill="' + SH + '"' + w + '/>' +
      // Jacke
      body({ R: vL, bot: H }, C, null) + body({ L: vR, bot: H }, C, S) +
      // Revers (Satin)
      '<path d="M' + r(tL) + ' ' + r(yL) + 'L117.6 216Q106 200 97 186L101 180L93 171Q98 168 ' + r(tL) + ' ' + r(yL) + 'Z" fill="' + L + '"' + W + '/>' +
      '<path d="M' + r(240 - tL) + ' ' + r(yL) + 'L122.4 216Q134 200 143 186L139 180L147 171Q142 168 ' + r(240 - tL) + ' ' + r(yL) + 'Z" fill="' + L + '"' + W + '/>' +
      '<path d="M101 176L109 197" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".25"/>' +
      button(120, 236, 3, L) + button(120, 249, 3, L) +
      // Einstecktuch
      '<path d="M135 207L138 197L142 203L146 196L150 206Z" fill="#d6334f"' + w + '/>' +
      '<path d="M133 207Q143 205 153 206" fill="none"' + w + '/>';
    var top = sleeves(C, S, { cuff: SH, cuffW: 0.1 });
    add('smoking', [46, 154, 150, 136], svg, top);
  })();

  // ======================================================================
  // Abenteuerweste: khaki, offen, vier Taschen mit Klappen
  // ======================================================================
  function pocket(x, y, pw, ph, fill, flap, btn) {
    return '<path d="M' + x + ' ' + y + 'H' + (x + pw) + 'V' + (y + ph - 3) + 'Q' + (x + pw / 2) + ' ' + (y + ph + 1) + ' ' + x + ' ' + (y + ph - 3) + 'Z" fill="' + fill + '"' + w + '/>' +
      '<path d="M' + (x - 1) + ' ' + (y - 1) + 'H' + (x + pw + 1) + 'V' + (y + 6) + 'Q' + (x + pw / 2) + ' ' + (y + 9) + ' ' + (x - 1) + ' ' + (y + 6) + 'Z" fill="' + flap + '"' + w + '/>' +
      (btn ? button(x + pw / 2, y + 5, 1.8, btn) : '');
  }
  (function () {
    var C = '#c2a468', S = '#9c8048', D = '#b0925a', ST = '#f1e0b4', B = '#6e4f2a';
    var H = hem(254, 4);
    function eL(y) { return 104 + (y - 168) * 0.09; }
    function eR(y) { return 240 - eL(y); }
    var y0 = chinY(eL);
    var svg =
      body({ R: eL, bot: H }, C, null) + body({ L: eR, bot: H }, C, S) +
      dash(edgeLine(eL, y0 + 2, 250, -3.5), ST) + dash(edgeLine(eR, y0 + 2, 250, 3.5), ST) +
      dash('M' + r(sideL(248) + 4) + ' 248' + smooth(range(sideL(248) + 4, eL(250) - 4, 8).map(function (x) { return [x, H(x) - 4]; })), ST) +
      dash('M' + r(eR(250) + 4) + ' ' + r(H(eR(250) + 4) - 4) + smooth(range(eR(250) + 4, sideR(248) - 4, 8).map(function (x) { return [x, H(x) - 4]; })), ST) +
      pocket(91, 187, 13, 15, D, C, B) + pocket(137, 186, 15, 16, D, C, B) +
      pocket(80, 218, 24, 22, D, C, B) + pocket(136, 218, 24, 22, D, C, B) +
      // Stifthalter und Karabiner
      '<rect x="140" y="178" width="3" height="10" rx="1" fill="#e0525a"' + w + '/><rect x="145" y="180" width="3" height="8" rx="1" fill="#3d7be0"' + w + '/>' +
      '<circle cx="96" cy="211" r="3.5" fill="none" stroke="' + O + '" stroke-width="3.8"/><circle cx="96" cy="211" r="3.5" fill="none" stroke="#c9ced8" stroke-width="1.8"/>' +
      '<ellipse cx="90" cy="180" rx="4" ry="2.5" transform="rotate(-40 90 180)"' + HL + '/>';
    add('weste', [62, 154, 116, 106], svg);
  })();

  // ======================================================================
  // Lederjacke: schwarz, breites Revers, Reißverschluss, Gürtel
  // ======================================================================
  (function () {
    var C = '#35313d', S = '#221f28', L = '#5a5565', Z = '#c9ced8', T = '#f4f1ea';
    var H = hem(256, 3);
    function eL(y) { return y < 204 ? 110 - (204 - y) * 0.2 : 130; }
    function eR(y) { return y < 204 ? 127 + (204 - y) * 0.42 : 127; }
    var yl = chinY(eL), yr = chinY(eR);
    var svg =
      // T-Shirt im Ausschnitt
      path(shape({ L: K(100), R: K(140), bot: flat(214) }), T, w) +
      body({ R: eL, bot: H }, C, null) + body({ L: eR, bot: H }, C, S) +
      // Gürtel
      path(shape({ top: function (x) { return H(x) - 9; }, bot: H }), S) +
      path(shape({ top: function (x) { return H(x) - 9; }, bot: H }), 'none', w) +
      '<rect x="82" y="244" width="12" height="12" rx="2" fill="none" stroke="' + O + '" stroke-width="4"/><rect x="82" y="244" width="12" height="12" rx="2" fill="none" stroke="' + Z + '" stroke-width="2"/>' +
      // Revers
      '<path d="M' + r(eL(yl)) + ' ' + r(yl) + 'L110 203L97 196L86 173Q94 168 ' + r(eL(yl)) + ' ' + r(yl) + 'Z" fill="' + L + '"' + W + '/>' +
      '<path d="M' + r(eR(yr)) + ' ' + r(yr) + 'L127 204L142 194L154 172Q147 168 ' + r(eR(yr)) + ' ' + r(yr) + 'Z" fill="' + C + '"' + W + '/>' +
      button(97, 190, 1.8, Z) + button(144, 189, 1.8, Z) +
      // Reißverschluss
      '<path d="M129 206V251" stroke="' + O + '" stroke-width="4.5"/><path d="M129 206V251" stroke="' + Z + '" stroke-width="2.5" stroke-dasharray="1.4 1.4"/>' +
      '<rect x="126.5" y="210" width="5" height="8" rx="1.5" fill="' + Z + '"' + w + '/>' +
      // Reißverschlusstaschen
      '<path d="M86 222L98 236M154 222L142 236M137 184L153 180" stroke="' + O + '" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M86 222L98 236M154 222L142 236M137 184L153 180" stroke="' + Z + '" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M103 214Q104 232 102 244" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".18"/>' +
      '<path d="M91 180Q98 176 104 177" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".3"/>';
    var top = sleeves(C, S, {
      cuff: S, cuffW: 0.1, pattern: function (k) {
        var a = qpt(k, 0.72), b = qpt(k, 0.64);
        return '<path d="M' + P(a) + 'L' + P(b) + '" stroke="' + Z + '" stroke-width="2" stroke-linecap="round"/>' +
          '<path d="' + qsub(k, 0.15, 0.4) + '" transform="translate(' + (k === 'L' ? '-3 -1' : '-1 -4') + ')" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".2"/>';
      }
    });
    add('lederjacke', [46, 154, 150, 109], svg, top);
  })();

  // ======================================================================
  // Piratenmantel: langer roter Mantel, Goldborte, Goldknöpfe, Gürtel
  // ======================================================================
  (function () {
    var C = '#b3263a', S = '#8a1a2b', G = '#f2c14e', GS = '#c9962b', WH = '#fff8ec', BL = '#4a3022';
    function cL(y) { return y < 226 ? sideL(y) - 0.5 : sideL(226) - 0.5 - (y - 226) * 0.14; }
    function cR(y) { return 240 - cL(y); }
    function eL(y) { return y < 200 ? 120 - (200 - y) * 0.5 : y < 240 ? 122 : 122 - (y - 240) * 0.65; }
    function eR(y) { return 240 - eL(y); }
    var H = hem(284, 1.5);
    var yl = chinY(eL);
    var gb = function (x) { return '<circle cx="' + x[0] + '" cy="' + x[1] + '" r="3.2" fill="' + G + '"' + w + '/><circle cx="' + (x[0] - 1) + '" cy="' + (x[1] - 1) + '" r="1" fill="#fff" opacity=".7"/>'; };
    var svg =
      // Rüschenhemd (Jabot)
      '<path d="M106 168Q101 176 108 183Q101 191 110 197Q108 206 120 208Q132 206 130 197Q139 191 132 183Q139 176 134 168Z" fill="' + WH + '"' + W + '/>' +
      '<path d="M112 176Q120 181 128 176M112 190Q120 195 128 190" fill="none" stroke="#e6d8c2" stroke-width="1.6" stroke-linecap="round"/>' +
      body({ L: cL, R: eL, bot: H }, C, null) + body({ L: eR, R: cR, bot: H, shadeBot: 284 }, C, S) +
      // Goldborte an den Vorderkanten und unten
      band(edgeLine(eL, yl + 3, 281, -3.5), 3.5, G) + band(edgeLine(eR, yl + 3, 281, 3.5), 3.5, G) +
      band('M' + r(cL(279) + 3) + ' 279.5H' + r(eL(279) - 3), 3.5, G) + band('M' + r(eR(279) + 3) + ' 279.5H' + r(cR(279) - 3), 3.5, G) +
      // Gürtel mit Goldschnalle
      path(shape({ L: cL, R: cR, top: flat(229), bot: flat(239), step: 12 }), BL, w) +
      '<rect x="112" y="227" width="16" height="14" rx="2" fill="' + G + '"' + w + '/><rect x="116" y="231" width="8" height="6" rx="1" fill="' + BL + '"/>' +
      gb([110, 206]) + gb([130, 206]) + gb([110, 219]) + gb([130, 219]) + gb([104, 252]) + gb([136, 252]) + gb([100, 266]) + gb([140, 266]) +
      // Taschenklappen
      '<path d="M76 250H96V257Q86 260 76 257Z" fill="' + S + '"' + w + '/><path d="M144 250H164V257Q154 260 144 257Z" fill="' + S + '"' + w + '/>' +
      '<ellipse cx="94" cy="186" rx="4.5" ry="2.5" transform="rotate(-50 94 186)"' + HL + '/>';
    var top = sleeves(C, S, {
      cuff: S, cuffW: 0.2, pattern: function (k) {
        var c = qpt(k, 0.66);
        return ring(k, 0.575, 0.6, G) + '<circle cx="' + r(c[0]) + '" cy="' + r(c[1]) + '" r="2.8" fill="' + G + '"' + w + '/>';
      }
    });
    add('piratenmantel', [47, 154, 146, 135], svg, top);
  })();

  // ======================================================================
  // Kochjacke: weiß, doppelreihig, Stehkragen
  // ======================================================================
  (function () {
    var C = '#fbfbfb', S = '#dde2ea', B = '#4f5868';
    var H = hem(258, 4);
    var btn = '';
    [190, 207, 224, 241].forEach(function (y) { btn += button(108, y, 2.8, B) + button(134, y, 2.8, B); });
    var svg = body({ bot: H }, C, S,
      '<path d="M99.5 ' + r(chin(99.5) + 5) + 'V' + r(H(99.5)) + '"' + w + '/>' +
      '<path d="M101.5 ' + r(chin(101.5) + 7) + 'V' + r(H(101.5) - 1) + '" stroke="' + S + '" stroke-width="2"/>' + btn +
      // Brusttasche mit Thermometer
      '<rect x="143" y="188" width="3.5" height="12" rx="1.5" fill="#e0525a"' + w + '/><rect x="148" y="190" width="3" height="10" rx="1.5" fill="#9aa4b5"' + w + '/>' +
      '<path d="M140 196H155V207Q147.5 209 140 207Z" fill="' + C + '"' + w + '/>') +
      band(chinLine(96, 144, 3.5), 7, C) +
      '<path d="M' + P([144, chin(144) + 0]) + 'L147 ' + r(chin(147) + 7) + '"' + w + '/>' +
      '<ellipse cx="90" cy="232" rx="3.5" ry="9" transform="rotate(12 90 232)"' + HL + '/>';
    var top = sleeves(C, S, { cuff: '#eef1f5', cuffW: 0.13 });
    add('kochjacke', [46, 154, 149, 112], svg, top);
  })();

  // ======================================================================
  // Kochschürze: weiß mit roter Borte, Latz, Tasche mit Kochlöffel
  // ======================================================================
  (function () {
    var C = '#fdfdfb', S = '#dfe3ea', RD = '#e0525a', RS = '#b93c44', WD = '#d9a066';
    function fL(y) { return 90 - (y - 218) * 0.16; }
    function fR(y) { return 240 - fL(y); }
    var HB = hem(281, 2);
    var svg =
      strap(106, 190, 101, 4, RD) + strap(134, 190, 139, 4, RD) +
      // Latz
      '<path d="M103 186Q120 183 137 186L139 218H101Z" fill="' + C + '"' + W + '/>' +
      '<path d="M130 187Q134 186 137 186L139 218H132Z" fill="' + S + '"/>' +
      '<path d="M103 186Q120 183 137 186L139 218H101Z" fill="none"' + W + '/>' +
      '<path d="M104 190Q120 187 136 190" fill="none" stroke="' + RD + '" stroke-width="3"/>' +
      '<path d="M120 212C111 205 111 198 115.5 197.5C118 197 120 200 120 200C120 200 122 197 124.5 197.5C129 198 129 205 120 212Z" fill="' + RD + '"' + w + '/>' +
      // Rock
      body({ L: fL, R: fR, top: flat(218), bot: HB, shadeTop: 216, shadeBot: 284, shadeW: 9 }, C, S,
        path(shape({ L: fL, R: fR, top: function (x) { return HB(x) - 7; }, bot: HB }), RD) +
        path(shape({ L: fL, R: fR, top: function (x) { return HB(x) - 7; }, bot: HB }), 'none', w) +
        // Kochlöffel in der Tasche
        '<path d="M127 244L133 220" stroke="' + O + '" stroke-width="5" stroke-linecap="round"/><path d="M127 244L133 220" stroke="' + WD + '" stroke-width="2.6" stroke-linecap="round"/>' +
        '<ellipse cx="134.5" cy="214" rx="4.5" ry="7" transform="rotate(14 134.5 214)" fill="' + WD + '"' + w + '/>' +
        '<path d="M106 234H138V250Q122 254 106 250Z" fill="' + C + '"' + w + '/><path d="M106 234H138V238H106Z" fill="' + RD + '"' + w + '/>') +
      // Bund mit Schleife
      path(shape({ top: flat(213), bot: flat(220), step: 12 }), RD, w) +
      '<path d="M170 217Q182 207 184 215Q182 223 170 217Z" fill="' + RD + '"' + w + '/><path d="M170 217Q181 221 180 232L174 230Q173 222 170 217Z" fill="' + RS + '"' + w + '/>' +
      '<circle cx="170" cy="217" r="3.2" fill="' + RD + '"' + w + '/>';
    add('kochschürze', [62, 167, 124, 118], svg);
  })();

  // ======================================================================
  // Raumanzug: weiß/grau, Halsring, Schaltpult, Emblem
  // ======================================================================
  (function () {
    var C = '#f3f5f9', S = '#cdd4df', G = '#9aa4b5', GD = '#7b8597', BL = '#3d7be0', RD = '#e8505b', YE = '#ffd23f';
    var st = '';
    for (var i = 0; i < 5; i++) { var a = (-90 + i * 72) * Math.PI / 180, b = a + Math.PI / 5; st += (i ? 'L' : 'M') + P([104 + Math.cos(a) * 5, 197 + Math.sin(a) * 5]) + 'L' + P([104 + Math.cos(b) * 2.2, 197 + Math.sin(b) * 2.2]); }
    var svg = body({ full: true }, C, S,
      '<path d="M119 174V233" stroke="' + S + '" stroke-width="2"/>' +
      // Emblem
      '<circle cx="104" cy="197" r="9.5" fill="' + BL + '"' + w + '/><path d="' + st + 'Z" fill="#fff"/>' +
      '<ellipse cx="104" cy="197" rx="12" ry="4" transform="rotate(-25 104 197)" fill="none" stroke="' + RD + '" stroke-width="1.8"/>' +
      // Schaltpult
      '<rect x="125" y="189" width="28" height="23" rx="3" fill="' + G + '"' + w + '/>' +
      '<circle cx="132" cy="196" r="2.6" fill="' + RD + '"' + w + '/><circle cx="139" cy="196" r="2.6" fill="' + YE + '"' + w + '/><circle cx="146" cy="196" r="2.6" fill="' + BL + '"' + w + '/>' +
      '<rect x="130" y="203" width="18" height="5" rx="1.5" fill="#6fe3a1"' + w + '/>' +
      // Gürtel
      path(shape({ top: flat(236), bot: flat(245), step: 10 }), G, w) +
      '<rect x="112" y="234" width="16" height="13" rx="2.5" fill="' + GD + '"' + w + '/><circle cx="120" cy="240.5" r="2.5" fill="' + YE + '"/>' +
      // Kniepolster / Taschen
      '<rect x="86" y="252" width="18" height="12" rx="3" fill="' + S + '"' + w + '/><rect x="136" y="252" width="18" height="12" rx="3" fill="' + S + '"' + w + '/>') +
      band(chinLine(90, 150, 4.5), 9, G) +
      '<path d="' + chinLine(96, 116, 2.5) + '" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>' +
      '<ellipse cx="92" cy="232" rx="4" ry="10" transform="rotate(12 92 232)"' + HL + '/>';
    var top = sleeves(C, S, {
      cuff: G, cuffW: 0.13, pattern: function (k) {
        return ring(k, 0.22, 0.29, BL);
      }
    });
    add('raumanzug', [46, 154, 149, 125], svg, top);
  })();

  // ======================================================================
  // Heldenanzug: blau, rote Hose und Handschuhe, gelber Gürtel, Brustsymbol
  // ======================================================================
  (function () {
    var C = '#2f6be0', S = '#2352b0', RD = '#e2333c', RS = '#b3222b', YE = '#ffd23f', YS = '#e8a91f';
    var T = hem(241, 5);
    var svg = body({ full: true }, C, S,
      body({ top: T, full: 246 }, RD, RS) +
      path(shape({ top: function (x) { return T(x) - 8; }, bot: T }), YE, w) +
      '<rect x="112" y="235" width="16" height="12" rx="2.5" fill="' + YE + '"' + w + '/><rect x="116" y="238.5" width="8" height="5" rx="1" fill="' + YS + '"/>' +
      // Brustsymbol
      '<path d="M104 180H136L145 191L120 222L95 191Z" fill="' + YE + '"' + W + '/>' +
      '<path d="M136 180L145 191L120 222L131 191Z" fill="' + YS + '"/>' +
      '<path d="M104 180H136L145 191L120 222L95 191Z" fill="none"' + W + '/>' +
      '<path d="M125 184L111 201H119.5L114 215L130 196H121.5L127 184Z" fill="' + RD + '"' + w + '/>') +
      '<ellipse cx="90" cy="230" rx="4" ry="10" transform="rotate(12 90 230)"' + HL + '/>';
    var top = sleeves(C, S, { cuff: RD, cuffW: 0.15 });
    add('superheldenanzug', [46, 154, 148, 125], svg, top);
  })();

  // ======================================================================
  // Latzhose: Jeans mit Trägern, Latztasche, goldene Knöpfe
  // ======================================================================
  (function () {
    var C = '#4d7cc4', S = '#3a62a3', LC = '#86a9e0', ST = '#f2c14e';
    var leg = function (x) {
      return '<path d="M' + x + ' 250V283H' + (x + 31) + 'V250Z" fill="' + C + '"' + W + '/>' +
        '<path d="M' + (x + 23) + ' 252V276H' + (x + 30) + 'V252Z" fill="' + S + '"/>' +
        dash('M' + (x + 4) + ' 258V273', ST) +
        '<rect x="' + (x - 1) + '" y="274" width="33" height="10" rx="2" fill="' + LC + '"' + W + '/>';
    };
    var svg =
      leg(84) + leg(125) +
      strap(104, 190, 97, 7, C) + strap(136, 190, 143, 7, C) +
      '<path d="M101 224V192Q101 186 107 186H133Q139 186 139 192V224Z" fill="' + C + '"' + W + '/>' +
      '<path d="M132 187Q139 187 139 193V224H133Z" fill="' + S + '"/>' +
      '<path d="M101 224V192Q101 186 107 186H133Q139 186 139 192V224Z" fill="none"' + W + '/>' +
      dash('M104.5 222V193Q104.5 189.5 108 189.5H132Q135.5 189.5 135.5 193V222', ST) +
      '<path d="M110 198H130V211Q120 215 110 211Z" fill="' + C + '"' + w + '/>' + dash('M112.5 200.5H127.5', ST) +
      body({ top: flat(222), full: true, shadeTop: 200 }, C, S,
        dash('M' + r(sideL(226) + 4) + ' 226Q' + r(sideL(226) + 14) + ' 228 ' + r(sideL(226) + 16) + ' 223', ST) +
        dash('M' + r(sideR(226) - 4) + ' 226Q' + r(sideR(226) - 14) + ' 228 ' + r(sideR(226) - 16) + ' 223', ST) +
        '<path d="M120 238V270"' + w + '/>' + dash('M123.5 240V268', ST)) +
      button(105, 194, 3, ST) + button(135, 194, 3, ST) +
      '<ellipse cx="90" cy="240" rx="3.5" ry="8" transform="rotate(20 90 240)"' + HL + '/>';
    add('latzhose', [62, 165, 116, 121], svg);
  })();

  // ======================================================================
  // Badeanzug: rot-pink mit weißen Punkten, Träger, Schleife
  // ======================================================================
  (function () {
    var C = '#ff5d73', S = '#d9435a', WH = '#fff';
    function topF(x) { var d = (x - 120) / 30; return 181 + 10 * Math.max(0, 1 - d * d); }
    function botF(x) { return Math.min(bodyBot(x), 240 + (56 - Math.abs(x - 120)) * 0.95); }
    var o = { top: topF, bot: botF, corner: 240 };
    var dots = '';
    for (var y = 200, row = 0; y <= 266; y += 12, row++) for (var x = 80 + (row % 2) * 7; x <= 160; x += 14) {
      if (x > sideL(y) + 6 && x < sideR(y) - 6 && y > topF(x) + 6 && y < botF(x) - 6) dots += '<circle cx="' + x + '" cy="' + y + '" r="2.6" fill="' + WH + '"/>';
    }
    var svg =
      strap(100, 186, 98, 6, C) + strap(140, 186, 142, 6, C) +
      body(o, C, S, dots) +
      '<path d="M120 191L111 186L111 197Z M120 191L129 186L129 197Z" fill="' + WH + '"' + w + '/><circle cx="120" cy="191" r="2.6" fill="' + WH + '"' + w + '/>' +
      '<ellipse cx="96" cy="214" rx="4" ry="9" transform="rotate(15 96 214)"' + HL + '/>';
    add('badeanzug', [62, 166, 116, 111], svg);
  })();
})();
