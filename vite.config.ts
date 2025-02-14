import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugin: Partial<VitePWAOptions> = {
  strategies: "injectManifest",
  srcDir: "./src",
  filename: "sw.ts",
  registerType: "autoUpdate",
  injectRegister: false,
  devOptions: {
    enabled: true,
    navigateFallback: "index.html",
    suppressWarnings: true,
    type: "module",
  },
  includeAssets: [
    "favicon.ico",
    "apple-icon-180.png",
    "manifest-icon-512.maskable.png",
  ],
  manifest: {
    name: "AUDIT",
    short_name: "Audit",
    description: "Audit apps",

    icons: [
      {
        src: "/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon-180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
    ],
    theme_color: "#171717",
    background_color: "#e8ebf2",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    port: 5173,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  base: "./",
});
