import { defineConfig, devices } from '@playwright/test';

const PORT = 8091;
const COMPOSE =
  'docker compose -p expense-e2e -f ../docker-compose.yml -f docker-compose.e2e.yml';

export default defineConfig({
  testDir: './tests',
  retries: 0,
  // One stack, one DB: serial runs keep a test's seeded rows from leaking into another's totals.
  workers: 1,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `${COMPOSE} up --build --force-recreate --renew-anon-volumes`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 300_000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 30_000 },
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
