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
    // 如果配置了图片服务器，使用配置的服务器
    if (VITE_IMAGE_SERVER) {
      return DEV ? `${VITE_IMAGE_SERVER}${path}` : path;
    }
    // 如果没有配置图片服务器，使用当前域名
    return `${window.location.origin}${path}`;
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
