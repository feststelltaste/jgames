// Erzeugt die In-Game-Screenshots für die Startseite (screenshots/<spiel>.jpg).
// Aufruf (Playwright muss irgendwo installiert sein, z. B. per `npm i playwright` in einem Ordner X):
//   NODE_PATH=X/node_modules node tools/screenshots.js [spiel ...]
// Ohne Argumente werden alle Spiele fotografiert. Neues Spiel? Unten in GAMES eintragen.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..'), OUT = path.join(ROOT, 'screenshots');
const wait = ms => new Promise(r => setTimeout(r, ms));

// Pro Spiel: Seite, Fenstergröße (immer 4:3, das Bild wird auf 800×600 gebracht) und die Schritte,
// um mitten ins Spielgeschehen zu kommen.
const GAMES = {
  'letzte-linie': { url: 'letzte-linie/', play: async p => {
    await p.evaluate(() => { try { localStorage.setItem('letzte-linie-world', '1'); } catch (e) {} });
    await p.reload(); await wait(500);
    await p.click('#go'); await wait(9000);
  } },
  'postamt': { url: 'postamt/', vw: 1000, play: async p => {
    await p.click('text=Spiel starten'); await wait(300);
    await p.click('#envGrid .item-btn >> nth=1'); await p.click('#stmpGrid .item-btn >> nth=1'); await wait(300);
  } },
  'flussfahrt': { url: 'flussfahrt/', vw: 1000, play: async p => { await p.evaluate(() => window.scrollTo(0, 0)); await wait(1500); } },
  'anziehen': { url: 'anziehen/', vw: 1200, play: async p => {
    await wait(800);
    await p.evaluate(() => ['btn-hut-strohhut', 'btn-kleidung-latzhose', 'btn-accessoire-mistgabel'].forEach(id => document.getElementById(id).click()));
    await wait(800); await p.evaluate(() => window.scrollTo(0, 0));
  } },
};

const TYPES = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!f.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
      if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
      fs.readFile(f, (err, data) => {
        if (err) { rsp.writeHead(404); return rsp.end(); }
        rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); rsp.end(data);
      });
    }).listen(0, () => res(srv));
  });
}

(async () => {
  const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(GAMES);
  const srv = await serve(), base = 'http://localhost:' + srv.address().port + '/';
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  fs.mkdirSync(OUT, { recursive: true });
  for (const name of names) {
    const g = GAMES[name]; if (!g) { console.error('Unbekanntes Spiel:', name); continue; }
    const vw = g.vw || 800, ctx = await browser.newContext({ viewport: { width: vw, height: vw * 3 / 4 }, deviceScaleFactor: 800 / vw });
    const p = await ctx.newPage();
    p.on('pageerror', e => console.error(name + ':', e.message));
    await p.goto(base + g.url); await wait(600);
    await g.play(p);
    await p.screenshot({ path: path.join(OUT, name + '.jpg'), type: 'jpeg', quality: 72 });
    console.log('ok', name);
    await ctx.close();
  }
  await browser.close(); srv.close();
})();
