/** 生成 store id */
export const generatePrefix = (key: string): string => {
  return `${import.meta.env.VITE_APP_PREFIX}-${key}`;
};
