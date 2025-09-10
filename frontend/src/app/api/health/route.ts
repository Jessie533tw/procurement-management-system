export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'frontend',
    port: process.env.PORT || process.env.WEB_PORT || '3000',
    env: {
      PORT: process.env.PORT,
      WEB_PORT: process.env.WEB_PORT,
      NODE_ENV: process.env.NODE_ENV
    }
  });
}