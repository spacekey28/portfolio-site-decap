import type { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

interface GitHubOAuthResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

export const handler: Handler = async (event) => {
  const code = new URLSearchParams(event.rawQuery).get('code');
  if (!code) return { statusCode: 400, body: 'Missing code' };

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
    })
  });
  const data = await res.json() as GitHubOAuthResponse;

  // Decap expects JSON: { token: '<github_token>' }
  if (!data.access_token) return { statusCode: 400, body: 'No token' };
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: data.access_token }),
  };
};
