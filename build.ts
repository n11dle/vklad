export {};
const result = await Bun.build({
  entrypoints: ['./index.html'], outdir: './dist', minify: true,
  sourcemap: 'external', target: 'browser',
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
});
if (!result.success) { console.error(result.logs); process.exit(1); }
console.log(`Built ${result.outputs.length} files into dist/`);
