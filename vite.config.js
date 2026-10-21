import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({appType:'mpa',build:{sourcemap:false,rollupOptions:{input:{home:resolve('index.html'),tea:resolve('tea.html'),notFound:resolve('404.html'),checkout:resolve('demo-checkout.html')}}}});
