import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: process.env["BASE_URL"] || "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "react", test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            {
              name: "recharts",
              test: /[\\/]node_modules[\\/](recharts|d3-[^\\/]+|victory-vendor)[\\/]/,
            },
            { name: "radix", test: /[\\/]node_modules[\\/](radix-ui|@radix-ui)[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  staged: {
    "*.{ts,tsx}": "vp check --fix",
  },
});
