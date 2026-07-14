import { onMounted, ref } from "vue";
import { getRsaPublicKeyApi } from "@/api/modules/common";

import JSEncrypt from "jsencrypt";

export const usePublicKey = () => {
  const publicKey = ref<string>("");

  const axiosGetRsaPublicKeyApi = async () => {
    try {
      const result = await getRsaPublicKeyApi();

      if (result?.code === 0) {
        publicKey.value = result.data?.publicKey || "";
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // rsa 加密
  const rsaEncrypt = (value: string, pubKey = publicKey.value): string => {
    const encryptor = new JSEncrypt(); // 创建加密对象实例
    //之前ssl生成的公钥，复制的时候要小心不要有空格
    encryptor.setPublicKey(pubKey); //设置公钥
    // 对内容进行加密
    return encryptor.encrypt(value) || "";
  };

  onMounted(async () => {
    await axiosGetRsaPublicKeyApi();
  });

  return { publicKey, rsaEncrypt };
};
