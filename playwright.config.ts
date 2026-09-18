import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  testIgnore: '**/ux-audit.spec.ts',
  timeout: 60_000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4322',
    channel: process.env.PLAYWRIGHT_CHANNEL,
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4322 --ignore-lock',
    url: 'http://127.0.0.1:4322',
    timeout: 120_000,
    env: { PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA', ASTRO_TELEMETRY_DISABLED: '1', PLAYWRIGHT_TEST: '1' },
  },
});
