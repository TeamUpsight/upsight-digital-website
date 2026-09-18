import { build } from 'esbuild';
import { resolve } from 'node:path';

// Bundle Astro's virtual env module only in tests. No live keys or email requests.
export async function loadEndpoint(path) {
  const result = await build({
    entryPoints: [resolve(path)], bundle: true, write: false, platform: 'node', format: 'esm',
    define: { 'import.meta.env.DEV': 'false' },
    plugins: [{ name: 'test-secrets', setup(builder) {
      builder.onResolve({ filter: /^astro:env\/server$/ }, () => ({ path: 'secrets', namespace: 'test' }));
      builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export const getSecret = key => ({RESEND_API_KEY:"test-resend",TURNSTILE_SECRET_KEY:"test-turnstile"})[key];' }));
    } }],
  });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
}
