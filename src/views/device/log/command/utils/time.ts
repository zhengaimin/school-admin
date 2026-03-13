import dayjs from "dayjs";

const CHINA_TIMEZONE_OFFSET_MINUTES = 8 * 60;
const TIMEZONE_SUFFIX_REGEXP = /(Z|[+-]\d{2}:?\d{2})$/i;

function hasExplicitTimezone(value: string) {
  return TIMEZONE_SUFFIX_REGEXP.test(value.trim());
}

/**
 * 将后端返回的带时区时间统一转换为中国时间（UTC+8）展示。
 * - 带时区信息：按实际时刻换算到中国时间；
 * - 不带时区信息：保持原有本地格式化逻辑，避免误偏移。
 */
export function formatCommandLogTimeToChina(value: number | string | null | undefined, format = "YYYY-MM-DD HH:mm:ss"): string {
  if (value === null || value === undefined || value === "") return "";

  if (typeof value === "string" && !hasExplicitTimezone(value)) {
    const localDate = dayjs(value);
    return localDate.isValid() ? localDate.format(format) : "";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "";

  const shiftMinutes = CHINA_TIMEZONE_OFFSET_MINUTES + parsedDate.getTimezoneOffset();
  return dayjs(parsedDate.getTime() + shiftMinutes * 60_000).format(format);
}
