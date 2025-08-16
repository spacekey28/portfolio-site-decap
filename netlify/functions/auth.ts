import type { Handler } from '@netlify/functions';

const clientId = process.env.GITHUB_CLIENT_ID!;
const scope = 'repo,user';

export const handler: Handler = async () => {
  const redirectUri = `${process.env.SITE_URL}/.netlify/functions/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  return { statusCode: 302, headers: { Location: url }, body: '' };
};
