import page from './index.html';
const server = Bun.serve({
  port: Number(process.env.PORT || 3000),
  hostname: '127.0.0.1',
  routes: { '/': page },
  development: process.env.NODE_ENV !== 'production',
});
console.log(`Local: ${server.url}`);
