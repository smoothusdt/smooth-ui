import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// properties from pwa manifest
interface BuildConfig {
  related_applications: any[]
  port: number
}

const MainnetConfig: BuildConfig = {
  related_applications: [
    {
      "platform": "webapp",
      "url": "https://app.smoothusdt.com/manifest.webmanifest",
    },
  ],
  port: 5001
}

const ShastaConfig: BuildConfig = {
  related_applications: [
    {
      "platform": "webapp",
      "url": "https://shasta-app.smoothusdt.com/manifest.webmanifest",
    },

  ],
  port: 5173
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const chain = env.VITE_CHAIN
  if (!chain) {
    throw new Error("chain environment variable is not set")
  }

  let config: BuildConfig
  if (chain === "mainnet") config = MainnetConfig
  else if (chain === "shasta") config = ShastaConfig
  else throw new Error(`chain must be either 'mainnet' or 'shasta'. Not ${chain}.`)
  console.log(`Building a config for ${chain} chain.`)

  return {
    server: { // port to use for dev mode
      port: config.port
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: { enabled: true },
        workbox: { disableDevLogs: true },
        manifest: {
          name: "Smooth USDT",
          short_name: "Smooth USDT",
          description: "Simple, cheap USDT TRC-20 payments",
          id: "smooth-usdt",
          scope: "/",
          start_url: "/",
          background_color: "#ffffff",
          theme_color: "#339192",
          display: "standalone",
          orientation: "portrait",
          related_applications: config.related_applications,
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
});
