import { defineConfig } from 'astro/config';

// Static site deployed to Cloudflare Pages at johnholik.com.
// Keep output 'static' and do NOT add the @astrojs/cloudflare adapter,
// or the build turns into a Worker/SSR deploy.
export default defineConfig({
  site: 'https://johnholik.com',
  output: 'static',
});
