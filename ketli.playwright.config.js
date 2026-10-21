import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'ketli.spec.mjs',workers:1,timeout:45000,use:{baseURL:'http://127.0.0.1:5180',channel:'chrome',headless:true},webServer:{command:'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5180',url:'http://127.0.0.1:5180',reuseExistingServer:true},reporter:'list'});
