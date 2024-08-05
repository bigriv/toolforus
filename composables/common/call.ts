import axios from "axios";

export const useCallApi = () => {
  const isCalling = ref(false);

  const callApi = async (args: {
    method: "GET" | "POST";
    path: string;
    headers?: { [key: string]: string };
    params?: { [key: string]: any };
    sucessFunc: Function;
    failFunc?: Function;
  }) => {
    isCalling.value = true;
    switch (args.method) {
      case "GET":
        await callGetApi(args);
        break;
      case "POST":
        await callPostApi(args);
        break;
    }
    isCalling.value = false;
  };

  const callGetApi = async (args: {
    path: string;
    headers?: { [key: string]: string };
    params?: { [key: string]: any };
    sucessFunc: Function;
    failFunc?: Function;
  }) => {
    await axios
      .get(args.path, {
        headers: args.headers,
        params: args.params,
      })
      .then((response) => {
        // 取得成功時
        args.sucessFunc(response);
      })
      .catch((error) => {
        // 取得失敗時
        args.failFunc?.(error);
      });
  };

  const callPostApi = async (args: {
    path: string;
    headers?: { [key: string]: string };
    params?: { [key: string]: any };
    sucessFunc: Function;
    failFunc?: Function;
  }) => {
    await axios
      .post(args.path, args.params, { headers: args.headers })
      .then((response) => {
        // 取得成功時
        args.sucessFunc(response);
      })
      .catch((error) => {
        // 取得失敗時
        args.failFunc?.(error);
      });
  };

  return {
    isCalling,
    callApi,
  };
};
