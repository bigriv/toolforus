// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  dir: {
    layouts: "layouts",
  },
  app: {
    head: {
      style: [
        { children: "* { margin: 0;padding: 0;box-sizing: border-box;}" },
      ],
    },
  },
  runtimeConfig: {
    public: {
      host: '',
    },
  },
});
