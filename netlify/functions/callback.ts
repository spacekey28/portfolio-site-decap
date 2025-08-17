import type { Handler } from '@netlify/functions';

// Netlify runs on Node 18+ → built-in fetch is available; no node-fetch needed.
export const handler: Handler = async (event) => {
  const code = new URLSearchParams(event.rawQuery || '').get('code');

  const html = (js: string, fallback = 'You can close this window.') => ({
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<!doctype html><html><body><script>${js}</script>${fallback}</body></html>`
  });

  if (!code) {
    return html(`
      if (window.opener) {
        window.opener.postMessage('authorization:github:error:{"error":"missing_code"}','*');
        window.close();
      }
    `, 'Missing code');
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
    })
  });
  const data = await res.json();

  if (!data.access_token) {
    const err = JSON.stringify(data);
    return html(`
      if (window.opener) {
        window.opener.postMessage('authorization:github:error:${err}','*');
        window.close();
      }
    `, 'No token');
  }

  const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
  return html(`
    (function(){
      var msg='authorization:github:success:${payload}';
      if (window.opener) { window.opener.postMessage(msg,'*'); window.close(); }
      else { document.body.innerText='Logged in. You can close this window.'; }
    })();
  `);
};
