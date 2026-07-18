import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Lets `npm run dev` proxy /api/* to your local serverless function
    // when using `vercel dev` alongside Vite, or to a local Express server.
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
