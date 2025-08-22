export const deepClone = function deepClone(obj) {
  // 如果obj为null或者不是对象类型（比如是数值、字符串、布尔值等），直接返回
  if (obj === null || typeof obj !== "object") return obj;
  // 对于Date、RegExp、Error等特殊对象类型，需要特殊处理
  const Constructor = obj.constructor;
  switch (Constructor) {
    case Date:
      return new Date(obj);
    case RegExp:
      return new RegExp(obj.source, obj.flags);
    case Error:
      const cloneError = new Constructor();
      cloneError.name = obj.name;
      cloneError.message = obj.message;
      cloneError.stack = obj.stack;
      return cloneError;
    // 如果有其他需要特殊处理的对象类型，可以在这里添加相应的case语句
    default:
      break;
  }

  // 处理数组和普通对象
  const clone = Array.isArray(obj) ? [] : {};

  // 遍历对象的所有可枚举属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
};
