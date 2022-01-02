import esbuildServe from 'esbuild-serve';

esbuildServe(
  {
    define: { 'process.env.NODE_ENV': '"development"' },
    logLevel: 'info',
    charset: 'utf8', // al cambiar caracteres a ASCII en modulo showdown, se produce preview incorrecto! usar UTF8
    entryPoints: ['docs/client.tsx'],
    bundle: true,
    outfile: 'docs/bundle.js',
  },
  { root: 'docs', port: 3000 }
);
