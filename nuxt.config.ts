import { fileURLToPath } from "url";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  runtimeConfig: {
    // AWS S3 configuration
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsS3Bucket: process.env.AWS_S3_BUCKET,
    DATABASE_URL: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_ENDPOINT}:5432/${process.env.DB_NAME}?schema=public`,
    nodeEnv: process.env.NODE_ENV || "development",
  },
  compatibilityDate: "2025-06-10",
  // Disable strict
  typescript: {
    strict: false,
    shim: false, // Disable strict type checking
  },
  app: {
    head: {
      title: "Taskify App",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css",
        },
      ],
    },
  },
  nitro: {
    replace: {
      "import * as process": "import * as processUnused",
    },
    preset: "node-server", // Ensures full Node.js support (needed for Prisma)
    esbuild: {
      options: {
        target: "es2022",
      },
    },
    externals: {
      external: [
        ".prisma", // ignore Prisma internals
        "@prisma/client", // don't bundle Prisma
        "prisma", // don't bundle Prisma CLI
        "process", // Node.js process module
      ],
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
});
