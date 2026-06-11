import express from 'express';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'custom_db.json');

// Ensure DB directory and file exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({}), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json({ limit: '10mb' }));

  // API 1: Load live CMS settings from server-side database
  app.get('/api/load-cms', (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return res.json(JSON.parse(raw));
      }
      return res.json({});
    } catch (err) {
      console.error('Error loading custom db:', err);
      return res.status(500).json({ error: 'Failed to read database' });
    }
  });

  // API 2: Save live CMS settings to server-side database
  app.post('/api/save-cms', (req, res) => {
    try {
      const { key, data } = req.body;
      if (!key) {
        return res.status(400).json({ error: 'Missing key parameter' });
      }

      let currentDb: Record<string, any> = {};
      if (fs.existsSync(DB_FILE)) {
        try {
          currentDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
        } catch {
          currentDb = {};
        }
      }

      currentDb[key] = data;
      fs.writeFileSync(DB_FILE, JSON.stringify(currentDb, null, 2), 'utf-8');
      return res.json({ success: true });
    } catch (err) {
      console.error('Error saving to custom db:', err);
      return res.status(500).json({ error: 'Failed to write database' });
    }
  });

  // API 3: Server-side Telegram proxy bypasses adblockers and CORS
  app.post('/api/send-telegram', async (req, res) => {
    try {
      const { token, chatId, message } = req.body;
      if (!token || !chatId || !message) {
        return res.status(400).json({ error: 'Missing token, chatId or message' });
      }

      const cleanToken = token.trim();
      const cleanChatId = chatId.trim();
      const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cleanChatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        return res.json({ success: true });
      } else {
        const errText = await response.text();
        console.error('Telegram response error:', errText);
        return res.status(response.status).json({ error: errText });
      }
    } catch (err) {
      console.error('Telegram notification fetch threw exception:', err);
      return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LuxCod Server] Fullstack engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
