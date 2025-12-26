export const useAssetsPath = () => {
  const regex = /^(https?:\/\/)/i;

  /** 获取上传图片完整路径 */
  const getUploadPath = (path: string) => {
    if (!path) return "";
    // 如果已经有 http 或 https 前缀，直接返回
    if (regex.test(path)) {
      return path;
    }
    const { DEV, VITE_IMAGE_SERVER } = import.meta.env;
    // 开发环境下补充图片服务器前缀
    return DEV ? `${VITE_IMAGE_SERVER}${path}` : path;
  };

  /** 获取 public 路径 */
  const getPublicPath = (path: string) => {
    return `${import.meta.env.VITE_PUBLIC_PATH}${path}`;
  };

  return {
    getUploadPath,
    getPublicPath
  };
};
