import type { ApkHomepageLayout } from "@/api/interface";

export type THomeModuleKey = "schoolMien" | "announcement" | "unreadMessage" | "statistics";
export type THomeHeightMode = "fixed" | "auto";
export type THomeLayoutModuleCode = ApkHomepageLayout.THomepageLayoutModuleCode;
export type THomeLayoutVisibleFlag = ApkHomepageLayout.THomepageLayoutVisible;
export type THomeLayoutSyncStatus = ApkHomepageLayout.TApkHomepageLayoutSyncStatus;

export interface THomeModuleItem {
  key: THomeModuleKey;
  title: string;
  description: string;
  visible: boolean;
  heightMode: THomeHeightMode;
  height: number;
  minHeight: number;
  maxHeight: number;
}

export interface THomeLayoutMetrics {
  mainHeight: number;
  usedHeight: number;
  remainingHeight: number;
  moduleHeightMap: Record<THomeModuleKey, number>;
}

export interface THomeAnnouncementItem {
  id: number;
  title: string;
  content: string;
  textColor?: string;
  textSize?: number;
}

export interface THomeMessageItem {
  student: string;
  className: string;
  count: number;
}

export interface THomeStatisticsItem {
  label: string;
  value: string;
  tone: "primary" | "success" | "muted";
}

export interface THomeLayoutDeviceQuery {
  status?: THomeLayoutSyncStatus;
  page: number;
  pageSize: number;
}
