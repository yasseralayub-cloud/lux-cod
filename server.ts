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

  // API 1: Load live CMS settings from server-side database (or remote secure API proxy)
  app.get('/api/load-cms', async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      
      const externalUrl = process.env.VITE_EXTERNAL_API_URL || process.env.EXTERNAL_API_URL;
      const externalKey = process.env.VITE_EXTERNAL_API_KEY || process.env.EXTERNAL_API_KEY;
      
      if (externalUrl) {
        console.log('[Server Proxy] Securely fetching CMS from remote external database API:', externalUrl);
        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        if (externalKey) {
          if (externalKey.toLowerCase().startsWith('bearer ') || externalKey.toLowerCase().startsWith('token ')) {
            headers['Authorization'] = externalKey;
          } else {
            headers['X-Api-Key'] = externalKey;
            headers['Authorization'] = `Bearer ${externalKey}`;
          }
        }
        
        try {
          const apiRes = await fetch(externalUrl, { headers });
          if (apiRes.ok) {
            const rawData = await apiRes.json();
            // Automatically unwrap record structure (JSONBin support)
            const parsedData = (rawData && rawData.record) ? rawData.record : rawData;
            return res.json(parsedData);
          } else {
            console.error('[Server Proxy] Remote API GET error. Code:', apiRes.status);
          }
        } catch (apiErr) {
          console.error('[Server Proxy] Connection failed to remote API. Standard filesystem fallback:', apiErr);
        }
      }

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

  // API 2: Save live CMS settings to server-side database (or remote secure API proxy writeback)
  app.post('/api/save-cms', async (req, res) => {
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

      // Secure remote broadcast proxy to the external API
      const externalUrl = process.env.VITE_EXTERNAL_API_URL || process.env.EXTERNAL_API_URL;
      const externalKey = process.env.VITE_EXTERNAL_API_KEY || process.env.EXTERNAL_API_KEY;
      const externalMethod = (process.env.VITE_EXTERNAL_API_METHOD || process.env.EXTERNAL_API_METHOD || 'PUT') as any;

      if (externalUrl) {
        console.log('[Server Proxy] Syncing data backup to remote URL:', externalUrl);
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
        if (externalKey) {
          if (externalKey.toLowerCase().startsWith('bearer ') || externalKey.toLowerCase().startsWith('token ')) {
            headers['Authorization'] = externalKey;
          } else {
            headers['X-Api-Key'] = externalKey;
            headers['Authorization'] = `Bearer ${externalKey}`;
          }
        }

        try {
          const apiRes = await fetch(externalUrl, {
            method: externalMethod,
            headers,
            body: JSON.stringify(currentDb)
          });
          
          if (!apiRes.ok) {
            console.warn('[Server Proxy] Full document layout rejected, attempting KV delta dispatch...');
            await fetch(externalUrl, {
              method: externalMethod,
              headers,
              body: JSON.stringify({ key, data })
            });
          }
        } catch (apiErr) {
          console.error('[Server Proxy] Sync connection lost to external URL backend:', apiErr);
        }
      }

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

  // Explicit standard routes for SEO engines
  app.get('/sitemap.xml', (req, res) => {
    const sitemapPath = process.env.NODE_ENV !== 'production'
      ? path.join(process.cwd(), 'public', 'sitemap.xml')
      : path.join(process.cwd(), 'dist', 'sitemap.xml');
    
    if (fs.existsSync(sitemapPath)) {
      res.header('Content-Type', 'application/xml; charset=utf-8');
      return res.sendFile(sitemapPath);
    }
    return res.status(404).send('Sitemap not found');
  });

  app.get('/robots.txt', (req, res) => {
    const robotsPath = process.env.NODE_ENV !== 'production'
      ? path.join(process.cwd(), 'public', 'robots.txt')
      : path.join(process.cwd(), 'dist', 'robots.txt');
    
    if (fs.existsSync(robotsPath)) {
      res.header('Content-Type', 'text/plain; charset=utf-8');
      return res.sendFile(robotsPath);
    }
    return res.status(404).send('Robots.txt not found');
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
