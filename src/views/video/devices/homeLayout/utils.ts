import type { ApkHomepageLayout } from "@/api/interface";

import {
  DEFAULT_MODULE_LIST,
  HOME_MAIN_HEIGHT,
  HOME_MODULE_CODE_KEY_MAP,
  HOME_MODULE_KEY_CODE_MAP,
  MESSAGE_MOCK_LIST
} from "./constants";
import type { THomeAnnouncementItem, THomeLayoutMetrics, THomeModuleItem, THomeModuleKey, THomeStatisticsItem } from "./types";

/** 支持“高度自适应”的模块 */
const AUTO_HEIGHT_MODULE_KEY_SET = new Set<THomeModuleKey>(["schoolMien", "announcement"]);
/** 中间主区域模块间距（像素） */
const HOME_MAIN_MODULE_GAP = 16;

/**
 * 生成默认模块配置。
 * @returns 默认模块配置列表副本
 */
export function createDefaultModuleList(): THomeModuleItem[] {
  return DEFAULT_MODULE_LIST.map(moduleItem => ({ ...moduleItem }));
}
/**
 * 限制模块高度范围。
 * @param moduleItem 当前模块配置
 * @returns 无返回值
 */
export function clampModuleHeight(moduleItem: THomeModuleItem): void {
  if (moduleItem.height < moduleItem.minHeight) moduleItem.height = moduleItem.minHeight;
  if (moduleItem.height > moduleItem.maxHeight) moduleItem.height = moduleItem.maxHeight;
}
/**
 * 判断模块是否支持“自适应高度”。
 * @param moduleKey 模块标识
 * @returns 是否支持
 */
export function isAutoHeightSupported(moduleKey: THomeModuleKey): boolean {
  return AUTO_HEIGHT_MODULE_KEY_SET.has(moduleKey);
}
/**
 * 获取模块状态标签类型。
 * @param moduleItem 当前模块配置
 * @returns 标签类型
 */
export function getModuleTagType(moduleItem: THomeModuleItem): "success" | "info" {
  return moduleItem.visible ? "success" : "info";
}
/**
 * 获取统计数值样式类名。
 * @param tone 数值色调
 * @returns 样式类名
 */
export function getStatisticsValueClass(tone: THomeStatisticsItem["tone"]): string {
  if (tone === "success") return "preview-statistics-value--success";
  if (tone === "muted") return "preview-statistics-value--muted";
  return "preview-statistics-value--primary";
}
/**
 * 获取公告内容样式。
 * @param item 公告条目
 * @returns 内容行内样式
 */
export function getAnnouncementContentStyle(item: THomeAnnouncementItem): Record<string, string> {
  const styleMap: Record<string, string> = {};
  if (item.textColor) styleMap.color = item.textColor;
  if (item.textSize) styleMap.fontSize = `${item.textSize}px`;
  return styleMap;
}
/**
 * 生成未读留言循环列表。
 * @returns 留言循环列表
 */
export function resolveMessageLoopList() {
  if (MESSAGE_MOCK_LIST.length === 0) return [];
  if (MESSAGE_MOCK_LIST.length < 5) return [...MESSAGE_MOCK_LIST, ...MESSAGE_MOCK_LIST, ...MESSAGE_MOCK_LIST, ...MESSAGE_MOCK_LIST];
  return [...MESSAGE_MOCK_LIST, ...MESSAGE_MOCK_LIST];
}
/**
 * 计算首页主区域的渲染高度指标。
 * @param moduleList 模块配置列表
 * @returns 主区域渲染指标
 */
export function resolveHomeLayoutMetrics(moduleList: THomeModuleItem[]): THomeLayoutMetrics {
  const visibleModuleList = moduleList.filter(moduleItem => moduleItem.visible);
  const moduleHeightMap = moduleList.reduce(
    (map, moduleItem) => {
      map[moduleItem.key] = moduleItem.height;
      return map;
    },
    {} as Record<THomeModuleKey, number>
  );
  if (visibleModuleList.length === 0) {
    return {
      mainHeight: HOME_MAIN_HEIGHT,
      usedHeight: 0,
      remainingHeight: HOME_MAIN_HEIGHT,
      moduleHeightMap
    };
  }

  const gapHeight = HOME_MAIN_MODULE_GAP * Math.max(visibleModuleList.length - 1, 0);
  const maxContentHeight = HOME_MAIN_HEIGHT - gapHeight;
  const autoModuleItem = visibleModuleList.find(moduleItem => isAutoHeightSupported(moduleItem.key) && moduleItem.heightMode === "auto");
  const fixedModuleList = autoModuleItem
    ? visibleModuleList.filter(moduleItem => moduleItem.key !== autoModuleItem.key)
    : visibleModuleList;
  const fixedHeightSum = fixedModuleList.reduce((sum, moduleItem) => sum + moduleItem.height, 0);

  if (autoModuleItem) {
    const autoHeight = Math.max(autoModuleItem.minHeight, maxContentHeight - fixedHeightSum);
    moduleHeightMap[autoModuleItem.key] = autoHeight;
  }

  const usedContentHeight = visibleModuleList.reduce((sum, moduleItem) => sum + (moduleHeightMap[moduleItem.key] || 0), 0);
  const usedHeight = usedContentHeight + gapHeight;
  return {
    mainHeight: HOME_MAIN_HEIGHT,
    usedHeight,
    remainingHeight: HOME_MAIN_HEIGHT - usedHeight,
    moduleHeightMap
  };
}

/**
 * 将接口布局模块转换为页面模块配置。
 * @param modules 接口返回的模块配置列表
 * @returns 页面可编辑模块配置
 */
export function resolveModuleListByApiLayoutModules(
  modules: ApkHomepageLayout.IHomepageLayoutModule[] | undefined
): THomeModuleItem[] {
  const defaultModuleList = createDefaultModuleList();
  if (!modules?.length) return defaultModuleList;

  const defaultModuleMap = defaultModuleList.reduce(
    (map, moduleItem) => {
      map[moduleItem.key] = moduleItem;
      return map;
    },
    {} as Record<THomeModuleKey, THomeModuleItem>
  );
  const usedModuleKeyMap = {} as Record<THomeModuleKey, boolean>;
  const sortedModuleList = [...modules].sort((first, second) => first.sort - second.sort);
  const resolvedModuleList: THomeModuleItem[] = [];

  sortedModuleList.forEach(moduleItem => {
    const moduleKey = HOME_MODULE_CODE_KEY_MAP[moduleItem.code];
    if (!moduleKey || usedModuleKeyMap[moduleKey]) return;

    const defaultModuleItem = defaultModuleMap[moduleKey];
    if (!defaultModuleItem) return;

    const mergedModuleItem: THomeModuleItem = {
      ...defaultModuleItem,
      visible: moduleItem.visible === "Y",
      heightMode: "fixed",
      height: moduleItem.height
    };
    clampModuleHeight(mergedModuleItem);
    resolvedModuleList.push(mergedModuleItem);
    usedModuleKeyMap[moduleKey] = true;
  });

  defaultModuleList.forEach(moduleItem => {
    if (usedModuleKeyMap[moduleItem.key]) return;
    resolvedModuleList.push({ ...moduleItem });
  });

  return resolvedModuleList;
}

/**
 * 将页面模块配置转换为接口布局模块。
 * @param moduleList 页面可编辑模块配置
 * @returns 接口保存所需模块列表
 */
export function resolveApiLayoutModulesByModuleList(moduleList: THomeModuleItem[]): ApkHomepageLayout.IHomepageLayoutModule[] {
  const layoutMetrics = resolveHomeLayoutMetrics(moduleList);
  return moduleList.map((moduleItem, index) => {
    const renderedHeight = layoutMetrics.moduleHeightMap[moduleItem.key] || moduleItem.height;
    return {
      code: HOME_MODULE_KEY_CODE_MAP[moduleItem.key],
      visible: moduleItem.visible ? "Y" : "N",
      height: moduleItem.heightMode === "auto" ? renderedHeight : moduleItem.height,
      sort: index + 1
    };
  });
}
