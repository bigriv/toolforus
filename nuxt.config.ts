import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/google-fonts", "@nuxt/test-utils/module"],
  devtools: { enabled: true },
  ssr: false,
  dir: {
    layouts: "layouts",
  },
  app: {
    head: {
      style: [
        {
          children:
            "html,body,#__nuxt { width: 100%;height: 100%; } * { margin: 0;padding: 0;box-sizing: border-box;}",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      host: "",
    },
  },
  css: ["@/assets/styles/animation.css", "@/assets/styles/util.scss"],
  googleFonts: {
    families: {
      "Klee+One": true,
    },
  },
});
