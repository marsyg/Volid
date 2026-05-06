import { OpenRouter } from '@openrouter/sdk';

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

export const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  httpReferer: appUrl,
  appTitle: 'Volid',
});
