import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir:'./tests',
  fullyParallel:false,
  workers:1,
  timeout:60000,
  use:{baseURL:process.env.PLAYWRIGHT_BASE_URL||'http://127.0.0.1:3004',trace:'retain-on-failure'},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome'],channel:'chrome',viewport:{width:1440,height:1000}}}],
  reporter:[['list']],
});
