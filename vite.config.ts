import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: process.env.BASE_URL || "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  staged: {
    "*.{ts,tsx}": "vp lint --fix",
  },
});
