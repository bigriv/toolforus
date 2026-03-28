import axios from "axios";
import { fabric } from "fabric";

export const useBackgroundRemoval = (
  canvas: Ref<fabric.Canvas | undefined>
) => {
  const isProcessing = ref(false);
  const errorMessage = ref("");

  /**
   * 選択中の画像オブジェクトを remove.bg API（Supabase Edge Function 経由）に送信し、
   * 背景を透過した PNG で置き換える。位置・スケール・角度などのプロパティは維持する。
   */
  const removeBackground = async () => {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public.supabaseUrl as string;
    const supabaseAnonKey = config.public.supabaseAnonKey as string;

    if (!supabaseUrl || !supabaseAnonKey) {
      errorMessage.value =
        "Supabase の設定が不足しています。NUXT_PUBLIC_SUPABASE_URL と NUXT_PUBLIC_SUPABASE_ANON_KEY を設定してください。";
      return;
    }

    if (!canvas.value) return;

    const activeObjects = canvas.value.getActiveObjects();
    if (activeObjects.length !== 1) return;

    const target = activeObjects[0];
    if (!(target instanceof fabric.Image)) return;

    // 画像の base64 データを取得
    const element = target.getElement() as HTMLImageElement;
    const base64Match = element.src.match(/^data:[^;]+;base64,(.+)$/);
    if (!base64Match) {
      errorMessage.value = "画像データの取得に失敗しました。";
      return;
    }
    const imageBase64 = base64Match[1];

    isProcessing.value = true;
    errorMessage.value = "";

    try {
      const functionUrl = `${supabaseUrl}/functions/v1/remove-background`;
      const response = await axios.post(
        functionUrl,
        { image_base64: imageBase64 },
        {
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const resultBase64: string = response.data?.data?.result_b64;
      if (!resultBase64) {
        errorMessage.value = "背景透過の処理に失敗しました。";
        return;
      }

      const resultDataUrl = `data:image/png;base64,${resultBase64}`;

      // 元画像のレイアウトプロパティを保持して置き換え
      const props = {
        left: target.left,
        top: target.top,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        angle: target.angle,
        flipX: target.flipX,
        flipY: target.flipY,
        opacity: target.opacity,
      };

      canvas.value.remove(target);

      fabric.Image.fromURL(resultDataUrl, (img) => {
        if (!canvas.value) return;
        img.set(props);
        canvas.value.add(img);
        canvas.value.setActiveObject(img);
        canvas.value.renderAll();
      });
    } catch (e: any) {
      const status = e.response?.status;
      if (status === 402) {
        errorMessage.value =
          "remove.bg のクレジットが不足しています。アカウントを確認してください。";
      } else if (status === 403) {
        errorMessage.value = "remove.bg の APIキーが無効です。";
      } else if (status === 401) {
        errorMessage.value =
          "Supabase の認証に失敗しました。Anon Key を確認してください。";
      } else {
        errorMessage.value = `背景透過に失敗しました。(${status ?? "network error"})`;
      }
    } finally {
      isProcessing.value = false;
    }
  };

  return { removeBackground, isProcessing, errorMessage };
};
