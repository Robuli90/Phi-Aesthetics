import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Einheitliche, konsistente Content-Security-Policy (CSP) Konfiguration
const CSP_PRODUCTION = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widget.simplybook.it https://*.simplybook.it https://*.googleapis.com https://*.gstatic.com https://*.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com https://*.simplybook.it",
  "connect-src 'self' https://*.simplybook.it https://*.simplybook.me https://*.googleapis.com https://*.google.com https://*.gstatic.com data: blob:",
  "frame-src 'self' https://*.google.com https://*.simplybook.it https://*.simplybook.me",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ');

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Sicherheits-Header in Production
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      res.setHeader('Content-Security-Policy', CSP_PRODUCTION);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      next();
    });
  }

  // Gültige Standard-Routen der Web-Applikation
  const VALID_HTML_ROUTES = new Set(['/', '/impressum', '/datenschutz']);

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Dynamische robots.txt mit passender Sitemap-URL
  app.get('/robots.txt', (req, res) => {
    const robotsContent = `User-agent: *
Allow: /

Sitemap: https://phi-aesthetics.de/sitemap.xml
Sitemap: https://www.phi-aesthetics.de/sitemap.xml
`;
    res.type('text/plain').send(robotsContent);
  });

  // Dynamische sitemap.xml für Suchmaschinen
  app.get('/sitemap.xml', (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://phi-aesthetics.de/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://phi-aesthetics.de/impressum</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://phi-aesthetics.de/datenschutz</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;
    res.type('application/xml').send(sitemapContent);
  });

  // Development vs Production Server-Konfiguration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    // Vite Middleware für statische Assets, Scripts und HMR
    app.use(vite.middlewares);

    // HTML-Anfragen verarbeiten mit echter Statuscode-Auswertung (200 vs 404)
    app.get('*', async (req, res, next) => {
      const url = req.path;
      // Dateianfragen mit Endung ignorieren falls nicht gefunden
      if (url.startsWith('/api/') || url.includes('.')) {
        return next();
      }

      const isValid = VALID_HTML_ROUTES.has(url);
      const statusCode = isValid ? 200 : 404;

      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(statusCode).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Statische Dateien ausliefern
    app.use(express.static(distPath, { index: false }));

    // HTML-Routing in Production mit echtem Statuscode (200 für bekannte Routen, 404 für ungültige)
    app.get('*', (req, res) => {
      const url = req.path;
      const isValid = VALID_HTML_ROUTES.has(url);
      const statusCode = isValid ? 200 : 404;
      const indexFile = path.join(distPath, 'index.html');

      if (fs.existsSync(indexFile)) {
        res.status(statusCode).sendFile(indexFile);
      } else {
        res.status(statusCode).send('Not Found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
