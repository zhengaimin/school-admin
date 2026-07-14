import type { Announcement } from "@/api/interface";

/** 下拉选项 */
export type OptionItem = {
  /** 文案 */
  label: string;
  /** 值 */
  value: number;
};

/** 穿梭框选项 */
export type TransferOption = {
  /** 主键 */
  key: number;
  /** 文案 */
  label: string;
};

/** 目标范围表单 */
export type TargetForm = Partial<Announcement.IAnnouncementTarget> & {
  /** 目标ID列表 */
  scopeIds?: Array<string | number>;
};

/** 公告表单 */
export type AnnouncementForm = Omit<Partial<Announcement.IAnnouncementItem>, "targets"> & {
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 图片 */
  images: string[];
  /** 目标范围 */
  targets: TargetForm[];
};

/** 公告行数据 */
export type AnnouncementRow = Announcement.IAnnouncementListItem;
