const GIST_RAW = 'https://gist.githubusercontent.com/loictrobas/284df6b2f13698ce30a0a2526e5d9877/raw/6c09a84436b6ca237a2897b98130d93bc398eba4/gistfile1.txt';

exports.handler = async () => {
  try {
    const r = await fetch(GIST_RAW, { cache: 'no-store' });
    if (!r.ok) {
      return { statusCode: 500, body: 'Error leyendo destino' };
    }
    const dest = (await r.text()).trim();
    if (!/^https?:\/\//i.test(dest)) {
      return { statusCode: 500, body: 'Destino inválido' };
    }
    return {
      statusCode: 302,
      headers: { Location: dest },
    };
  } catch (e) {
    return { statusCode: 500, body: String(e) };
  }
};
