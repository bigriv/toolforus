export const useTOUHead = (define: { title: string; description: string }) => {
  const TITLE = define.title + " - ノンクリツール";
  useHead({
    title: TITLE,
    meta: [{ name: "description", content: define.description }],
  });

  useSeoMeta({
    title: TITLE,
    ogTitle: TITLE,
    description: define.description,
    ogDescription: define.description,
    ogImage: "/commons/logo.png",
  });
};
