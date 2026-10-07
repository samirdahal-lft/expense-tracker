import { defineConfig, devices } from "@playwright/test";
import path from "path";
import os from "os";

const DB_PATH = path.join(os.tmpdir(), `expense-e2e-${process.pid}.db`);

export default defineConfig({
  testDir: "./tests",
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: ".venv/bin/uvicorn app.main:app --port 8000",
      url: "http://localhost:8000/health",
      cwd: path.resolve(__dirname, "../backend"),
      reuseExistingServer: false,
      env: {
        EXPENSE_DB_PATH: DB_PATH,
      },
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      command: "npm run dev -- --port 5173",
      url: "http://localhost:5173",
      cwd: path.resolve(__dirname, "../frontend"),
      reuseExistingServer: false,
      env: {
        VITE_API_TARGET: "http://localhost:8000",
      },
      stdout: "pipe",
      stderr: "pipe",
    },
  ],
});
