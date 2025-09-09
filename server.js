const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
require('dotenv').config({ path: '.env.local' });

// Importer le gestionnaire OAuth
const oauthHandler = require('./api/oauth-token');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Route par défaut vers index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Gestion des routes API
  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/oauth-token') {
      // Utiliser le vrai gestionnaire OAuth
      try {
        // Convertir la requête HTTP native en format compatible
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const parsedBody = JSON.parse(body);
              const mockReq = {
                method: req.method,
                body: parsedBody
              };
              const mockRes = {
                setHeader: (name, value) => res.setHeader(name, value),
                status: (code) => ({
                  json: (data) => {
                    res.writeHead(code, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(data));
                  },
                  end: () => {
                    res.writeHead(code);
                    res.end();
                  }
                })
              };
              await oauthHandler(mockReq, mockRes);
            } catch (error) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Parse error' }));
            }
          });
        } else {
          const mockReq = { method: req.method };
          const mockRes = {
            setHeader: (name, value) => res.setHeader(name, value),
            status: (code) => ({
              end: () => {
                res.writeHead(code);
                res.end();
              }
            })
          };
          await oauthHandler(mockReq, mockRes);
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
      return;
    }
  }

  // Servir les fichiers statiques
  const filePath = path.join(__dirname, pathname);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Internal server error');
      }
      return;
    }

    // Déterminer le type de contenu
    const ext = path.extname(filePath);
    let contentType = 'text/html';

    switch (ext) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.ico':
        contentType = 'image/x-icon';
        break;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur de développement local lancé sur http://localhost:${PORT}`);
  console.log(`📁 Ouvrez http://localhost:${PORT} dans votre navigateur`);
  console.log(`🔧 API disponible sur http://localhost:${PORT}/api/oauth-token`);
});
