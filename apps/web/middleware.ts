import { next } from '@vercel/edge';

const BOT_PATTERN = /bot|crawler|spider|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex/i;

export default function middleware(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? '';
  const response = next();

  if (BOT_PATTERN.test(userAgent)) {
    response.headers.append('Set-Cookie', 'x-wander-bot=1; Path=/; Max-Age=60; SameSite=Lax');
  }

  return response;
}
