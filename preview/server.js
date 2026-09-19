const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HTML_FILE = path.join(__dirname, 'index.html');
const SONGS_DIR = path.join(__dirname, 'songs');

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  // Serve MP3 songs
  if (url.startsWith('/songs/')) {
    const fileName = path.basename(url);
    const filePath = path.join(SONGS_DIR, fileName);

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      const total = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const partialstart = parts[0];
        const partialend = parts[1];
        const start = parseInt(partialstart, 10);
        const end = partialend ? parseInt(partialend, 10) : total - 1;
        const chunksize = end - start + 1;

        const file = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${total}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'audio/mpeg',
        });
        file.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': total,
          'Content-Type': 'audio/mpeg',
          'Accept-Ranges': 'bytes',
        });
        fs.createReadStream(filePath).pipe(res);
      }
      return;
    }
  }

  // Serve static images (logo, icons)
  if (url === '/logo.png' || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) {
    const imgPath = path.join(__dirname, path.basename(url));
    if (fs.existsSync(imgPath)) {
      const ext = path.extname(url).toLowerCase();
      const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      });
      fs.createReadStream(imgPath).pipe(res);
      return;
    }
  }
  fs.readFile(HTML_FILE, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading preview');
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Live Preview Server running at http://localhost:${PORT}/`);
});
