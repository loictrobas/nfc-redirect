// netlify/functions/redirect.js
export async function handler(event, context) {
  try {
    // cambia por la URL RAW de tu Gist
    const GIST_RAW = 'https://gist.githubusercontent.com/TUUSUARIO/TUID/raw/redirect.txt';
    const r = await fetch(GIST_RAW, { cache: 'no-store' });
    if (!r.ok) return { statusCode: 500, body: 'Error leyendo destino' };
    const dest = (await r.text()).trim();
    if (!dest.startsWith('http')) return { statusCode: 500, body: 'Destino inválido' };
    return {
      statusCode: 302,
      headers: { Location: dest }
    };
  } catch (e) {
    return { statusCode: 500, body: String(e) };
  }
}
