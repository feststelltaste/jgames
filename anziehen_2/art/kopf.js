/* Capybara-Modenschau – Grafik: Kategorie "kopf" (Hüte, Masken, Frisuren).
   Koordinaten wie capybara.js (240 x 300), Teile liegen ohne Transformation auf dem Capybara. */
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
  // Vorderer Teil einer Krempe (liegt über dem Hutkopf): Ellipse (cx, cy, rx, ry), Innenkante mit ry2
  function frontBrim(cx, cy, rx, ry, ry2, fill) {
    return '<path d="M' + (cx - rx) + ' ' + cy + 'A' + rx + ' ' + ry + ' 0 0 0 ' + (cx + rx) + ' ' + cy +
      'A' + rx + ' ' + ry2 + ' 0 0 1 ' + (cx - rx) + ' ' + cy + 'Z" fill="' + fill + '"' + W + '/>';
  }
  // Fünfzackiger Stern
  function star(cx, cy, r, fill, extra) {
    var d = '';
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1);
    }
    return '<path d="' + d + 'Z" fill="' + fill + '"' + (extra || '') + '/>';
  }

  // ---------- Sonnenhut: cremefarben, weiche Krempe, rosa Band mit Blüte ----------
  (function () {
    var C = '#fdf0d8', S = '#ecd3a8';
    var brim = 'M38 68Q40 56 66 53Q120 46 174 53Q200 56 202 68Q200 81 172 82Q120 89 68 82Q40 81 38 68Z';
    var flower = '';
    for (var i = 0; i < 5; i++) {
      var a = i * 72 * Math.PI / 180;
      flower += '<circle cx="' + (152 + Math.cos(a) * 6.5).toFixed(1) + '" cy="' + (60 + Math.sin(a) * 6.5).toFixed(1) + '" r="5.5" fill="#fff"' + w + '/>';
    }
    add('sonnenhut', [36, 24, 168, 66],
      '<path d="' + brim + '" fill="' + C + '"' + W + '/>' +
      '<path d="M44 74Q70 84 120 84Q170 84 196 74Q192 81 172 82Q120 89 68 82Q48 81 44 74Z" fill="' + S + '"/>' +
      '<path d="M84 64C84 38 98 26 120 26C142 26 156 38 156 64Z" fill="' + C + '"' + W + '/>' +
      '<path d="M142 32C152 40 156 50 156 64H146C147 50 146 40 142 32Z" fill="' + S + '"/>' +
      '<path d="M84.5 52Q120 60 155.5 52L156 64Q120 72 84 64Z" fill="#ff7aa8"' + W + '/>' +
      frontBrim(120, 64, 36, 9, 4, C) +
      '<path d="' + brim + '" fill="none"' + W + '/>' +
      flower + '<circle cx="152" cy="60" r="4" fill="#ffc531"' + w + '/>' +
      '<ellipse cx="102" cy="36" rx="9" ry="4" transform="rotate(-25 102 36)"' + HL + '/>');
  })();

  // ---------- Zylinder ----------
  (function () {
    var C = '#2f2840', D = '#1f1a2c', L = '#4a4062';
    add('zylinder', [64, 8, 112, 72],
      '<ellipse cx="120" cy="66" rx="54" ry="12" fill="' + D + '"' + W + '/>' +
      '<path d="M88 66L84 16H156L152 66Z" fill="' + C + '"' + W + '/>' +
      '<path d="M142 18H156L152 66H139Z" fill="' + D + '"/>' +
      '<path d="M86.9 48H153.1L152.1 62H87.9Z" fill="#d6334f"' + W + '/>' +
      '<path d="M140 49H153L152 61H140Z" fill="#a8243b"/>' +
      '<ellipse cx="120" cy="16" rx="36" ry="7" fill="' + L + '"' + W + '/>' +
      '<path d="M95 24L97.5 44" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".25"/>' +
      frontBrim(120, 66, 54, 12, 6, C) +
      '<path d="M76 70Q96 76 118 76.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".25"/>');
  })();

  // ---------- Mütze: rote Strickmütze mit Bommel ----------
  (function () {
    var C = '#e84a55', S = '#c7353f', K = '#fbfbfb';
    var ribs = '';
    for (var x = 70; x <= 170; x += 7) ribs += 'M' + x + ' 68V80';
    add('mütze', [60, 8, 120, 76],
      '<path d="M66 72C64 42 88 28 120 28C152 28 176 42 174 72Z" fill="' + C + '"' + W + '/>' +
      '<path d="M150 36C166 46 174 58 174 72H160C162 58 158 46 150 36Z" fill="' + S + '"/>' +
      '<path d="M69 52Q120 40 171 52" stroke="' + K + '" stroke-width="6" fill="none"/>' +
      '<path d="M100 32Q96 50 96 70M140 32Q144 50 144 70M120 29V70" stroke="' + S + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<rect x="62" y="64" width="116" height="19" rx="9.5" fill="' + K + '"' + W + '/>' +
      '<path d="' + ribs + '" stroke="#d9d4de" stroke-width="1.6" stroke-linecap="round"/>' +
      '<ellipse cx="94" cy="40" rx="10" ry="4" transform="rotate(-20 94 40)"' + HL + '/>' +
      '<circle cx="120" cy="24" r="14" fill="' + K + '"' + W + '/>' +
      '<path d="M112 16Q116 12 120 13M124 30Q130 29 132 24M109 26Q110 30 114 32" stroke="#d9d4de" stroke-width="1.8" fill="none" stroke-linecap="round"/>');
  })();

  // ---------- Forscherhut: Tropenhelm ----------
  (function () {
    var C = '#e3c98f', S = '#c9a96a', B = '#8a6a3a';
    add('forscherhut', [54, 16, 132, 66],
      '<ellipse cx="120" cy="67" rx="64" ry="12" fill="' + C + '"' + W + '/>' +
      '<path d="M78 66C78 36 96 22 120 22C144 22 162 36 162 66Z" fill="' + C + '"' + W + '/>' +
      '<path d="M146 30C157 38 162 50 162 66H151C152 50 150 38 146 30Z" fill="' + S + '"/>' +
      '<path d="M120 23V56M101 27Q92 40 92 57M139 27Q148 40 148 57" stroke="' + S + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M78.5 55Q120 63 161.5 55L162 66Q120 74 78 66Z" fill="' + B + '"' + W + '/>' +
      '<circle cx="120" cy="21" r="4.5" fill="' + S + '"' + W + '/>' +
      frontBrim(120, 67, 64, 12, 5, C) +
      '<ellipse cx="101" cy="35" rx="10" ry="4.5" transform="rotate(-30 101 35)"' + HL + '/>');
  })();

  // ---------- Bandana: rotes Stirnband mit Punkten und Knoten ----------
  (function () {
    var C = '#e23d3d', S = '#b92a2a';
    var dots = [[76, 69], [92, 72], [108, 74], [124, 74.5], [140, 73], [156, 70.5], [84, 76], [100, 79], [116, 80], [132, 79.5], [148, 77]]
      .map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.9" fill="#fff"/>'; }).join('');
    add('bandana', [60, 58, 138, 50],
      '<path d="M178 70Q192 84 194 104L184 102Q182 88 172 76Z" fill="' + S + '"' + W + '/>' +
      '<path d="M176 72Q196 78 198 94L189 96Q186 84 172 78Z" fill="' + C + '"' + W + '/>' +
      '<path d="M63 62Q120 74 177 62L177 76Q120 88 63 76Z" fill="' + C + '"' + W + '/>' +
      '<path d="M66 72Q120 84 174 72L177 76Q120 88 63 76Z" fill="' + S + '"/>' + dots +
      '<path d="M63 62Q120 74 177 62L177 76Q120 88 63 76Z" fill="none"' + W + '/>' +
      '<ellipse cx="178" cy="68" rx="8" ry="9" fill="' + C + '"' + W + '/>' +
      '<path d="M174 64Q177 62 180 64" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".6"/>',
      { keepOrange: true });
  })();

  // ---------- Visier: Sport-Sonnenschild ----------
  (function () {
    var bill = 'M68 64Q120 76 172 64Q180 78 160 82Q120 88 80 82Q60 78 68 64Z';
    add('visier', [58, 52, 124, 38],
      '<path d="' + bill + '" fill="#23b5d3" opacity=".78"/>' +
      '<path d="' + bill + '" fill="none"' + W + '/>' +
      '<path d="M80 74Q98 79 114 79.5" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M63 56Q120 67 177 56L177 65Q120 76 63 65Z" fill="#ffffff"' + W + '/>' +
      '<path d="M63 61Q120 72 177 61" stroke="#ff7a59" stroke-width="2.5" fill="none"/>' +
      '<path d="M63 56Q120 67 177 56L177 65Q120 76 63 65Z" fill="none"' + W + '/>',
      { keepOrange: true });
  })();

  // ---------- Baskenmütze ----------
  (function () {
    var C = '#b8324f', S = '#8f2139';
    add('baskenmütze', [62, 28, 126, 50],
      '<path d="M66 68C60 50 84 36 124 36C164 36 190 46 184 62C181 71 168 73 152 72Q120 75 90 73C77 73 68 72 66 68Z" fill="' + C + '"' + W + '/>' +
      '<path d="M184 62C181 71 168 73 152 72Q120 75 90 73C77 73 68 72 66 68C90 66 150 66 172 60C178 58 182 58 184 62Z" fill="' + S + '"/>' +
      '<path d="M70 65Q120 78 168 66L168 72Q120 84 70 71Z" fill="#4a1a2a"' + W + '/>' +
      '<path d="M124 37Q124 30 131 28" stroke="' + O + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M124 37Q124 30 131 28" stroke="' + C + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="102" cy="45" rx="16" ry="4.5" transform="rotate(-8 102 45)"' + HL + '/>');
  })();

  // ---------- Ohrenschützer ----------
  (function () {
    function muff(cx, cy) {
      var s = '';
      for (var i = 0; i < 10; i++) {
        var a = i * 36 * Math.PI / 180;
        s += '<circle cx="' + (cx + Math.cos(a) * 11).toFixed(1) + '" cy="' + (cy + Math.sin(a) * 11).toFixed(1) + '" r="6.5" fill="#ff9ecb"' + W + '/>';
      }
      for (var j = 0; j < 10; j++) {
        var b = j * 36 * Math.PI / 180;
        s += '<circle cx="' + (cx + Math.cos(b) * 11).toFixed(1) + '" cy="' + (cy + Math.sin(b) * 11).toFixed(1) + '" r="5.2" fill="#ff9ecb"/>';
      }
      return s + '<circle cx="' + cx + '" cy="' + cy + '" r="11" fill="#ff9ecb"/><circle cx="' + cx + '" cy="' + cy + '" r="7" fill="#ffc4e0"/>' +
        '<circle cx="' + (cx - 5) + '" cy="' + (cy - 6) + '" r="3"' + HL + '/>';
    }
    add('ohrenschützer', [46, 36, 148, 54],
      '<path d="M70 69Q64 40 120 44Q176 40 170 69" stroke="' + O + '" stroke-width="9" fill="none" stroke-linecap="round"/>' +
      '<path d="M70 69Q64 40 120 44Q176 40 170 69" stroke="#8e7cc3" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
      muff(69, 72) + muff(171, 72),
      { keepOrange: true });
  })();

  // ---------- Irokese: bunte Punk-Frisur ----------
  (function () {
    var crest = 'M98 60Q90 40 88 22Q100 34 106 44Q102 22 106 6Q114 22 117 40Q118 18 124 2Q128 20 126 40Q132 22 142 8Q144 26 136 44Q144 34 154 24Q152 42 142 60Z';
    var inner = 'M104 58Q99 46 97 36Q104 44 108 50Q107 34 109 22Q114 34 117 50Q120 30 123 16Q125 32 124 50Q130 36 137 26Q137 38 132 52Q138 44 145 38Q143 50 137 58Z';
    add('irokese', [84, 0, 74, 78],
      '<path d="' + crest + '" fill="#e8318a"' + W + '/>' +
      '<path d="' + inner + '" fill="#ff7ac0"/>' +
      '<path d="M112 58Q113 44 115 34M128 58Q128 46 130 38" stroke="#b81f6a" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M98 58Q120 50 142 58Q140 68 132 74Q126 70 120 76Q114 70 108 74Q100 68 98 58Z" fill="#e8318a"' + W + '/>' +
      '<path d="M104 60Q120 55 136 60Q134 65 129 68Q124 65 120 69Q116 65 111 68Q106 65 104 60Z" fill="#ff7ac0"/>' +
      '<circle cx="106" cy="8" r="2.5" fill="#ffd23f"/><circle cx="124" cy="4" r="2.5" fill="#ffd23f"/><circle cx="142" cy="10" r="2.5" fill="#ffd23f"/>');
  })();

  // ---------- Piratenhut: Dreispitz mit Totenkopf ----------
  (function () {
    var C = '#2b2a35', G = '#f2c14e';
    var hat = 'M40 72Q44 44 74 46Q94 18 120 18Q146 18 166 46Q196 44 200 72Q120 58 40 72Z';
    add('piratenhut', [38, 16, 164, 60],
      '<path d="' + hat + '" fill="' + C + '"' + W + '/>' +
      '<path d="M150 30Q164 40 166 46Q190 46 197 66Q180 56 160 56Q158 42 150 30Z" fill="#1d1c26"/>' +
      '<path d="M45 68Q120 55 195 68" stroke="' + G + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M47 62Q52 50 74 51Q94 25 120 25Q146 25 166 51Q188 50 193 62" stroke="' + G + '" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".9"/>' +
      '<path d="' + hat + '" fill="none"' + W + '/>' +
      '<path d="M107 49L133 61M133 49L107 61" stroke="' + O + '" stroke-width="6.5" stroke-linecap="round"/>' +
      '<path d="M107 49L133 61M133 49L107 61" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M111 44C111 36 115 32 120 32C125 32 129 36 129 44C129 48 127 50 125 50V53H115V50C113 50 111 48 111 44Z" fill="#fff"' + w + '/>' +
      '<circle cx="116.2" cy="42.5" r="2.4" fill="' + C + '"/><circle cx="123.8" cy="42.5" r="2.4" fill="' + C + '"/>' +
      '<path d="M118 53V50.5M120 53V50.5M122 53V50.5" stroke="' + O + '" stroke-width="1"/>' +
      '<ellipse cx="86" cy="45" rx="10" ry="3.5" transform="rotate(-35 86 45)" fill="#fff" opacity=".18"/>');
  })();

  // ---------- Kochmütze ----------
  (function () {
    var puffs = [[92, 36, 17], [110, 24, 19], [132, 24, 19], [150, 36, 17], [121, 38, 18]];
    var outl = puffs.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="#fff"' + W + '/>'; }).join('');
    var fill = puffs.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (p[2] - 1.2) + '" fill="#fff"/>'; }).join('');
    add('kochmütze', [72, 2, 96, 76],
      outl + fill +
      '<path d="M146 28Q156 30 160 40M100 18Q106 14 112 14M126 34Q132 30 138 32" stroke="#dcdde6" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M84 48Q120 42 156 48L158 72Q120 78 82 72Z" fill="#fff"' + W + '/>' +
      '<path d="M96 48V73M108 46.5V75M120 46V76M132 46.5V75M144 48V73" stroke="#dcdde6" stroke-width="1.8" stroke-linecap="round"/>' +
      '<path d="M146 48L156 48L158 72L148 73Z" fill="#e9eaf1"/>' +
      '<path d="M84 48Q120 42 156 48L158 72Q120 78 82 72Z" fill="none"' + W + '/>' +
      '<circle cx="100" cy="30" r="5"' + HL + '/>');
  })();

  // ---------- Astronautenhelm: Glaskuppel, Gesicht bleibt sichtbar ----------
  (function () {
    var cx = 120, cy = 106, r = 78;
    var collar = 'M56 166Q120 202 184 166L186 180Q120 218 54 180Z';
    add('astronautenhelm', [42, 26, 156, 188],
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#d8f1ff" opacity=".16"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + O + '" stroke-width="9"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#e9eef5" stroke-width="4.5"/>',
      {
        keepOrange: true,
        top:
          '<g><path d="' + collar + '" fill="#e2e8f0"' + W + '/>' +
          '<path d="M56 176Q120 212 184 176L186 180Q120 218 54 180Z" fill="#b8c2d0"/>' +
          '<path d="' + collar + '" fill="none"' + W + '/>' +
          '<circle cx="84" cy="186" r="5" fill="#ff5c5c"' + w + '/><circle cx="156" cy="186" r="5" fill="#4dabf7"' + w + '/>' +
          '<rect x="112" y="192" width="16" height="7" rx="2" fill="#ffd43b"' + w + '/>' +
          '<path d="M64 88Q70 56 100 38" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".75"/>' +
          '<path d="M60 104Q60 100 61 96" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".75"/>' +
          '<path d="M176 128Q172 150 154 164" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".45"/></g>'
      });
  })();

  // ---------- Superheldenmaske ----------
  (function () {
    var mask = 'M68 88C72 76 94 74 108 82Q120 88 132 82C146 74 168 76 172 88C176 100 166 110 150 108C140 106 132 101 120 101C108 101 100 106 90 108C74 110 64 100 68 88Z' +
      'M96 84.5A9.5 8.5 0 1 0 96.01 84.5ZM144 84.5A9.5 8.5 0 1 0 144.01 84.5Z';
    add('superheldenmaske', [64, 74, 136, 42],
      '<path d="M170 88Q186 80 198 84Q190 90 186 92Q194 98 196 108Q182 104 170 94Z" fill="#c42a40"' + W + '/>' +
      '<path d="' + mask + '" fill="#e53950" fill-rule="evenodd"' + W + '/>' +
      '<path d="M76 84Q84 78 94 78" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".5"/>' +
      '<path d="M104 98Q120 94 136 98" stroke="#c42a40" stroke-width="2" fill="none" stroke-linecap="round"/>',
      { keepOrange: true });
  })();

  // ---------- Strohhut: goldgelbes Stroh, Flechtmuster, rotes Band ----------
  (function () {
    var C = '#f5d268', S = '#dcb04a', T = '#c9952c';
    var weave = '';
    for (var i = 0; i < 11; i++) {
      var x = 58 + i * 12.5;
      weave += 'M' + x + ' 60L' + (x + 6) + ' 80';
    }
    var fray = '';
    for (var j = 0; j < 14; j++) {
      var a = Math.PI * (0.05 + j * 0.9 / 13), fx = 120 - Math.cos(a) * 78, fy = 69 + Math.sin(a) * 15;
      fray += 'M' + fx.toFixed(1) + ' ' + fy.toFixed(1) + 'l' + (j % 2 ? 2 : -2) + ' 4';
    }
    add('strohhut', [38, 22, 164, 68],
      '<ellipse cx="120" cy="69" rx="78" ry="15" fill="' + C + '"' + W + '/>' +
      '<path d="' + weave + '" stroke="' + T + '" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M88 68C87 44 98 32 120 32C142 32 153 44 152 68Z" fill="' + C + '"' + W + '/>' +
      '<path d="M140 36C149 42 152 52 152 68H143C144 54 143 44 140 36Z" fill="' + S + '"/>' +
      '<path d="M110 34Q120 39 130 34" stroke="' + T + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<path d="M91 44Q120 38 149 44M89 52Q120 46 151 52M104 36Q100 50 101 66M120 38V66M136 36Q140 50 139 66" stroke="' + T + '" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M89.5 55Q120 62 150.5 55L151 66Q120 73 89 66Z" fill="#d9453a"' + W + '/>' +
      '<path d="M142 58L160 30M146 58L168 38" stroke="' + T + '" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse cx="161" cy="29" rx="3" ry="6" transform="rotate(34 161 29)" fill="#e8b84a"' + w + '/><ellipse cx="169" cy="37" rx="3" ry="6" transform="rotate(48 169 37)" fill="#e8b84a"' + w + '/>' +
      frontBrim(120, 69, 78, 15, 7, C) +
      '<path d="' + fray + '" stroke="' + T + '" stroke-width="1.6" stroke-linecap="round"/>' +
      '<ellipse cx="100" cy="40" rx="7" ry="3" transform="rotate(-20 100 40)"' + HL + '/>');
  })();

  // ---------- Cowboyhut ----------
  (function () {
    var C = '#a8692f', S = '#7d4a1d', B = '#4a2c12';
    add('cowboyhut', [40, 20, 160, 62],
      '<path d="M84 64C82 42 88 24 104 24Q120 32 136 24C152 24 158 42 156 64Z" fill="' + C + '"' + W + '/>' +
      '<path d="M140 26C152 28 158 44 156 64H146C148 46 146 34 140 26Z" fill="' + S + '"/>' +
      '<path d="M112 30Q120 36 128 30" stroke="' + S + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M84.5 52Q120 59 155.5 52L156 64Q120 71 84 64Z" fill="' + B + '"' + W + '/>' +
      '<rect x="112" y="56" width="16" height="10" rx="2" fill="#f2c14e"' + w + '/><rect x="116.5" y="59" width="7" height="4" rx="1" fill="' + B + '"/>' +
      '<path d="M42 50Q50 74 78 74Q120 82 162 74Q190 74 198 50Q190 62 168 62Q120 58 72 62Q50 62 42 50Z" fill="' + C + '"' + W + '/>' +
      '<path d="M52 64Q64 74 80 74Q120 82 160 74Q176 74 188 64Q176 78 160 78Q120 86 80 78Q62 78 52 64Z" fill="' + S + '"/>' +
      '<path d="M42 50Q50 74 78 74Q120 82 162 74Q190 74 198 50" fill="none"' + W + '/>' +
      '<ellipse cx="98" cy="36" rx="7" ry="3.5" transform="rotate(-50 98 36)"' + HL + '/>');
  })();

  // ---------- Zauberhut ----------
  (function () {
    var C = '#4f5ed8', S = '#3442a8', G = '#ffd23f';
    add('zauberhut', [60, 0, 120, 78],
      '<ellipse cx="120" cy="67" rx="58" ry="11" fill="' + C + '"' + W + '/>' +
      '<path d="M82 66C92 46 102 22 114 10C120 3 134 0 146 5C136 7 129 13 127 24C130 40 146 54 158 66Z" fill="' + C + '"' + W + '/>' +
      '<path d="M127 24C130 40 146 54 158 66H144C136 52 126 40 124 28Z" fill="' + S + '"/>' +
      '<path d="M88.5 54Q120 62 152 54L157 64Q120 73 83 64Z" fill="' + G + '"' + W + '/>' +
      star(112, 40, 7.5, G, w) + star(135, 16, 4.5, G, w) +
      '<path d="M104 22A7 7 0 1 0 112 30A5.5 5.5 0 1 1 104 22Z" fill="#fff4b3"' + w + '/>' +
      '<circle cx="128" cy="45" r="2" fill="#fff"/><circle cx="98" cy="50" r="1.6" fill="#fff"/><circle cx="121" cy="27" r="1.4" fill="#fff"/>' +
      frontBrim(120, 67, 58, 11, 5, C) +
      '<circle cx="146" cy="5" r="4" fill="' + G + '"' + w + '/>');
  })();

  // ---------- Krone ----------
  (function () {
    var C = '#ffcc33', S = '#e8a31a';
    add('krone', [72, 12, 96, 70],
      '<path d="M82 60L76 24L100 46L120 16L140 46L164 24L158 60Z" fill="' + C + '"' + W + '/>' +
      '<path d="M140 46L164 24L158 60H146Z" fill="' + S + '"/>' +
      '<path d="M82 58Q120 65 158 58L158 74Q120 81 82 74Z" fill="' + C + '"' + W + '/>' +
      '<path d="M146 61Q153 60 158 58L158 74Q153 75.5 146 76.5Z" fill="' + S + '"/>' +
      '<path d="M86 64Q120 70.5 154 64" stroke="#fff3bf" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<circle cx="76" cy="24" r="4.5" fill="' + C + '"' + W + '/><circle cx="120" cy="16" r="5" fill="' + C + '"' + W + '/><circle cx="164" cy="24" r="4.5" fill="' + C + '"' + W + '/>' +
      '<path d="M120 36L127 45L120 54L113 45Z" fill="#e0245e"' + w + '/>' +
      '<circle cx="99" cy="68" r="4.5" fill="#1da1f2"' + w + '/><circle cx="120" cy="70.5" r="4.5" fill="#20c070"' + w + '/><circle cx="141" cy="68" r="4.5" fill="#1da1f2"' + w + '/>' +
      '<path d="M117.5 42L120 39" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M90 50L86 32" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>');
  })();
})();
