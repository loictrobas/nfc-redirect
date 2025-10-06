// netlify/functions/redirect.js
const https = require('https');

const GIST_RAW = 'https://gist.githubusercontent.com/loictrobas/284df6b2f13698ce30a0a2526e5d9877/raw/6c09a84436b6ca237a2897b98130d93bc398eba4/gistfile1.txt';

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
    const raw = await getText(GIST_RAW);
    // Limpieza y detección del primer URL válido
    const text = (raw || '').replace(/^\uFEFF/, '').trim();
    const match = text.match(/https?:\/\/\S+/i);
    const dest = match ? match[0].trim() : '';

    if (!dest) return { statusCode: 500, body: 'Destino inválido' };

    return {
      statusCode: 302,
      headers: { Location: dest },
      body: '' // por compatibilidad con algunos navegadores
    };
  } catch (e) {
    return { statusCode: 500, body: 'Error leyendo destino: ' + e.message };
  }
};
