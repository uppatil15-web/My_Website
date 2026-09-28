const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const chokidar = require('chokidar');
const { compileLess, packageZip } = require('./build-theme');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

// Contact Form Submission API Endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`\n======================================================`);
  console.log(` 📩 NEW CONTACT FORM SUBMISSION FOR u.p.patil15@gmail.com`);
  console.log(` 👤 Name:    ${name}`);
  console.log(` 📧 Email:   ${email}`);
  console.log(` 💬 Message: ${message}`);
  console.log(`======================================================\n`);

  res.json({ 
    success: true, 
    message: 'Thank you for reaching out! Your message has been sent successfully.' 
  });
});

// Active WebSocket connections
let clients = [];
wss.on('connection', (ws) => {
  clients.push(ws);
  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

function broadcast(msg) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
}

// Watch theme files for changes
let currentVariation = 'light';
const watcher = chokidar.watch(ROOT_DIR, {
  ignored: /(^|[\/\\])\..|node_modules|\.zip$/,
  persistent: true
});

watcher.on('change', async (filePath) => {
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath);
  console.log(`[File Changed] ${fileName}`);

  if (ext === '.less') {
    try {
      await compileLess(currentVariation);
      console.log('[LiveReload] Recompiled LESS -> Notifying CSS reload');
      broadcast({ type: 'reload-css' });
    } catch (e) {
      console.error('[Build Error]', e);
    }
  } else {
    console.log('[LiveReload] Page changed -> Notifying page reload');
    broadcast({ type: 'reload-page' });
  }
});

// Compile LESS on startup
compileLess(currentVariation).catch(console.error);

// Static assets routes
app.use('/files/theme', express.static(path.join(ROOT_DIR, 'assets')));
app.use('/assets', express.static(path.join(ROOT_DIR, 'assets')));
app.use('/styles', express.static(path.join(ROOT_DIR, 'styles')));
app.use(express.static(ROOT_DIR));

// Dynamic compiled CSS endpoint
app.get('/main_style.css', async (req, res) => {
  try {
    const variation = req.query.variation || 'light';
    const css = await compileLess(variation);
    res.setHeader('Content-Type', 'text/css');
    res.send(css);
  } catch (err) {
    res.status(500).send(`/* LESS Compilation Error: ${err.message} */`);
  }
});

// Export ZIP endpoint
app.get('/export-zip', async (req, res) => {
  try {
    const zipPath = await packageZip();
    res.download(zipPath, 'birdseye-website-export.zip');
  } catch (err) {
    res.status(500).send('Error packaging zip: ' + err.message);
  }
});

// Live Reload script snippet
const LIVE_RELOAD_SCRIPT = `
  <script>
    (function() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = protocol + '//' + window.location.host + '/ws';
      let socket;

      function connect() {
        socket = new WebSocket(wsUrl);
        socket.onopen = function() {
          console.log('[DevStudio] Connected to Live Reload server');
          if (window.parent && window.parent.updateLiveStatus) {
            window.parent.updateLiveStatus(true);
          }
        };
        socket.onmessage = function(event) {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'reload-css') {
              const links = document.querySelectorAll('link[rel="stylesheet"]');
              links.forEach(link => {
                if (link.href.includes('main_style.css')) {
                  const url = new URL(link.href);
                  url.searchParams.set('_t', Date.now());
                  link.href = url.toString();
                }
              });
            } else if (data.type === 'reload-page') {
              window.location.reload();
            }
          } catch(e){}
        };
        socket.onclose = function() {
          if (window.parent && window.parent.updateLiveStatus) {
            window.parent.updateLiveStatus(false);
          }
          setTimeout(connect, 2000);
        };
      }
      connect();
    })();
  </script>
`;

// Render HTML page layout
app.get('/render', async (req, res) => {
  try {
    const pageName = req.query.page || 'index.html';
    const variation = req.query.variation || 'light';
    const fullWidth = req.query['full-width-body'] === 'true';
    const overlay = req.query['header-overlay'] === 'true';
    const altNav = req.query['alt-nav'] === 'true';

    currentVariation = variation;

    const pagePath = path.join(EXPORT_DIR, pageName);
    if (!fs.existsSync(pagePath)) {
      return res.status(404).send(`HTML page ${pageName} not found in export/`);
    }

    let html = fs.readFileSync(pagePath, 'utf8');

    // Body classes manipulation
    let bodyClasses = [];
    if (pageName === 'index.html' || pageName === 'about.html' || pageName === 'services.html' || pageName === 'portfolio.html' || pageName === 'contact.html') {
      bodyClasses.push('header-page', 'has-header-image');
    } else if (pageName === 'splash.html') {
      bodyClasses.push('splash-page', 'has-header-image');
    }

    if (fullWidth) bodyClasses.push('full-width-body-on');
    else bodyClasses.push('full-width-body-off');

    if (overlay) bodyClasses.push('header-overlay-on');
    else bodyClasses.push('header-overlay-off');

    if (altNav) bodyClasses.push('alt-nav-on');
    else bodyClasses.push('alt-nav-off');

    html = html.replace(/<body[^>]*>/, `<body class="${bodyClasses.join(' ')}">`);

    // Ensure CSS link uses selected variation
    html = html.replace(/href="\/main_style\.css[^"]*"/, `href="/main_style.css?variation=${variation}"`);

    // Inject Live Reload Script before </body>
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${LIVE_RELOAD_SCRIPT}\n</body>`);
    } else {
      html += LIVE_RELOAD_SCRIPT;
    }

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).send('Render Error: ' + err.message);
  }
});

// Preview Studio UI Dashboard
app.get('/', (req, res) => {
  const dashboardHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Birdseye Studio - Standalone Web Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .studio-header {
      height: 64px;
      background: #1e293b;
      border-bottom: 1px solid #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      gap: 15px;
      z-index: 10;
    }

    .brand-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 700;
      color: #38bdf8;
    }

    .brand-title span.badge {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 12px;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .controls-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .control-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #94a3b8;
    }

    .control-item label {
      font-weight: 500;
      color: #cbd5e1;
    }

    select, button {
      background: #0f172a;
      color: #f8fafc;
      border: 1px solid #475569;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    select:hover, select:focus {
      border-color: #38bdf8;
    }

    .toggle-btn {
      background: #334155;
      border: 1px solid #475569;
      color: #cbd5e1;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 500;
    }

    .toggle-btn.active {
      background: #0284c7;
      color: #ffffff;
      border-color: #38bdf8;
    }

    .viewport-group {
      display: flex;
      background: #0f172a;
      border-radius: 6px;
      padding: 2px;
      border: 1px solid #334155;
    }

    .vp-btn {
      border: none;
      background: transparent;
      padding: 5px 10px;
      font-size: 12px;
      border-radius: 4px;
      color: #94a3b8;
    }

    .vp-btn.active {
      background: #334155;
      color: #38bdf8;
      font-weight: 600;
    }

    .actions-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-dot {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #4ade80;
    }

    .dot {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      box-shadow: 0 0 8px #4ade80;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }

    .btn-export {
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      color: #fff;
      font-weight: 600;
      padding: 7px 16px;
      border: none;
      box-shadow: 0 2px 10px rgba(37, 99, 235, 0.3);
    }

    .btn-export:hover {
      opacity: 0.95;
      transform: translateY(-1px);
    }

    .workspace-container {
      flex: 1;
      background: #090d16;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 15px;
      position: relative;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      transition: width 0.3s ease;
    }

    iframe.device-tablet {
      width: 768px;
      height: 95%;
      border: 1px solid #334155;
    }

    iframe.device-mobile {
      width: 375px;
      height: 90%;
      border: 1px solid #334155;
    }
  </style>
</head>
<body>

  <header class="studio-header">
    <div class="brand-title">
      🎨 Birdseye Website Studio
      <span class="badge">Standalone Website</span>
    </div>

    <div class="controls-group">
      <!-- HTML Page Switcher -->
      <div class="control-item">
        <label>Page:</label>
        <select id="selPage" onchange="updatePreview()">
          <option value="index.html">Home Page (index.html)</option>
          <option value="portfolio.html">My Work Page (portfolio.html)</option>
          <option value="procurement-at-tesla.html">Procurement at Tesla</option>
          <option value="carxchange-website-optimization.html">CarXchange Optimization</option>
          <option value="junior-finance-app-design.html">Junior Finance App</option>
          <option value="google-nmi-program.html">Google NMI Program</option>
          <option value="allison-transmission-logistics.html">Allison Transmission Logistics</option>
          <option value="about.html">About Page (about.html)</option>
          <option value="contact.html">Contact Page (contact.html)</option>
        </select>
      </div>

      <!-- Theme Variation -->
      <div class="control-item">
        <label>Palette:</label>
        <select id="selVariation" onchange="updatePreview()">
          <option value="light">Light Palette</option>
          <option value="dark">Dark Palette</option>
        </select>
      </div>

      <!-- Option Toggles -->
      <div class="control-item">
        <button id="btnFullWidth" class="toggle-btn" onclick="toggleOption('fullWidth')">Full Width</button>
      </div>

      <div class="control-item">
        <button id="btnOverlay" class="toggle-btn active" onclick="toggleOption('overlay')">Header Overlay</button>
      </div>

      <!-- Viewport Switcher -->
      <div class="viewport-group">
        <button class="vp-btn active" onclick="setViewport('desktop', this)">🖥️ Desktop</button>
        <button class="vp-btn" onclick="setViewport('tablet', this)">📱 Tablet</button>
        <button class="vp-btn" onclick="setViewport('mobile', this)">📲 Mobile</button>
      </div>
    </div>

    <div class="actions-group">
      <div id="liveStatus" class="status-dot">
        <div class="dot"></div> Live Reload Active
      </div>
      <a href="/export-zip" download>
        <button class="btn-export">📦 Download Website ZIP</button>
      </a>
    </div>
  </header>

  <main class="workspace-container">
    <iframe id="previewFrame" src="/render?page=index.html&variation=light&full-width-body=false&header-overlay=true"></iframe>
  </main>

  <script>
    let options = {
      fullWidth: false,
      overlay: true,
      altNav: false
    };

    function toggleOption(optKey) {
      options[optKey] = !options[optKey];
      const btnId = 'btn' + optKey.charAt(0).toUpperCase() + optKey.slice(1);
      const btn = document.getElementById(btnId);
      if (btn) {
        if (options[optKey]) btn.classList.add('active');
        else btn.classList.remove('active');
      }
      updatePreview();
    }

    function setViewport(mode, btn) {
      const frame = document.getElementById('previewFrame');
      document.querySelectorAll('.vp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (mode === 'desktop') {
        frame.className = '';
      } else if (mode === 'tablet') {
        frame.className = 'device-tablet';
      } else if (mode === 'mobile') {
        frame.className = 'device-mobile';
      }
    }

    function updatePreview() {
      const page = document.getElementById('selPage').value;
      const variation = document.getElementById('selVariation').value;

      const url = \`/render?page=\${encodeURIComponent(page)}&variation=\${encodeURIComponent(variation)}&full-width-body=\${options.fullWidth}&header-overlay=\${options.overlay}\`;

      document.getElementById('previewFrame').src = url;
    }

    window.updateLiveStatus = function(connected) {
      const statusEl = document.getElementById('liveStatus');
      if (connected) {
        statusEl.innerHTML = '<div class="dot"></div> Live Reload Active';
        statusEl.style.color = '#4ade80';
      } else {
        statusEl.innerHTML = '<div class="dot" style="background:#f87171; box-shadow:none;"></div> Reconnecting...';
        statusEl.style.color = '#f87171';
      }
    };
  </script>
</body>
</html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(dashboardHtml);
});

// Start Server
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` 🚀 Standalone Website Dev Studio running at:`);
  console.log(` 👉 http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
