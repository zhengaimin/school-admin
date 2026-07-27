import type { System } from "@/api/interface";

/** 租户表单 */
export type TenantForm = Omit<System.ReqTenantCreate, "contactEmail" | "address"> & {
  /** 联系邮箱 */
  contactEmail: string;
  /** 联系地址 */
  address: string;
  /** 状态 */
  status?: System.Tenant["status"];
};
