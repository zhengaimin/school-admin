import type { SchoolMien } from "@/api/interface";

/** 校园风采行数据 */
export type TSchoolMienRow = SchoolMien.ISchoolMienItem;

/** 校园风采表单 */
export type TSchoolMienForm = Partial<TSchoolMienRow> & {
  /** 内容 */
  content: string;
  /** 图片 */
  images: string[];
};

/** 校园风采详情 */
export type TSchoolMienDetail = SchoolMien.ISchoolMienItem;

/** 校园风采列表项 */
export type TSchoolMienItem = SchoolMien.ISchoolMienItem;
