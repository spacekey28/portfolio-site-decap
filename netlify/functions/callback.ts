import type { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

interface GitHubOAuthResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

export const handler: Handler = async (event) => {
  const code = new URLSearchParams(event.rawQuery).get('code');
  if (!code) {
    return { statusCode: 400, body: 
    `<html><body>
      <script>
        (function() {
          if (window.opener) {
            window.opener.postMessage('authorization:github:error:{"error":"missing_code"}', '*');
            window.close();
          }
        })();
      </script>
      Missing code
      </body></html>`
    };
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
    })
  });
  const data = await tokenRes.json() as GitHubOAuthResponse;

  if (!data.access_token) {
    return { statusCode: 400, body: 
    `<html><body>
      <script>
        (function() {
          if (window.opener) {
            window.opener.postMessage('authorization:github:error:${JSON.stringify(data)}', '*');
            window.close();
          }
        })();
      </script>
      No token
      </body></html>`
    };
  }

  // IMPORTANT: send the success message with the right prefix + JSON
  const payload = JSON.stringify({ token: data.access_token, provider: 'github' });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: 
    `<html><body>
      <script>
        (function() {
          if (window.opener) {
            window.opener.postMessage('authorization:github:success:${payload}', '*');
            window.close();
          } else {
            // fallback to display token if not opened as popup
            document.body.innerText = 'Logged in. You can close this window.';
          }
        })();
      </script>
      </body></html>`
  };
};