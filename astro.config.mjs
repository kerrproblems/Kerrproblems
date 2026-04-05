import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kerrproblems.com',
  output: 'static',
  build: {
    assets: 'assets'
  }
});
