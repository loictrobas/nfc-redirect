// netlify/functions/redirect.js
const https = require('https');

// Usar el nombre real del archivo del Gist:
const GIST_RAW = 'https://gist.githubusercontent.com/loictrobas/284df6b2f13698ce30a0a2526e5d9877/raw/gistfile1.txt';

function getText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error('HTTP ' + res.statusCode));
        return;
      }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

exports.handler = async () => {
  try {
    const raw = await getText(`${GIST_RAW}?t=${Date.now()}`); // cache-busting
    const text = (raw || '').replace(/^\uFEFF/, '').trim();
    const match = text.match(/https?:\/\/\S+/i);
    const dest = match ? match[0].trim() : '';
    if (!dest) return { statusCode: 500, body: 'Destino inválido' };

    return {
      statusCode: 302,
      headers: {
        Location: dest,
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
      body: ''
    };
  } catch (e) {
    return { statusCode: 500, body: 'Error leyendo destino: ' + e.message };
  }
};
