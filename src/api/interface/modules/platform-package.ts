import type { TRefundPackageModuleKindValue } from "@/config/modules/refund";
import type { TPackagePricingModeValue, TPackageStatusValue } from "@/config/modules/package";

/** 平台套餐管理模块 */
export namespace PlatformPackage {
  export interface ModuleItem {
    moduleKey: string;
    kind: TRefundPackageModuleKindValue;
    name: string;
    monthlyGiftMinutes: number;
  }

  export interface ModuleOption {
    moduleKey: string;
    kind: TRefundPackageModuleKindValue;
    name: string;
  }

  export interface Item {
    id: number;
    name: string;
    schoolIds: number[];
    modules: ModuleItem[];
    pricingMode: TPackagePricingModeValue;
    monthlyPrice: number;
    firstMonthProration: boolean;
    startDate: string;
    endDate: string;
    status: TPackageStatusValue;
    statusText: "未开始" | "生效中" | "已过期" | "已停用";
  }

  export interface Detail extends Item {
    description: string;
  }

  export interface ListParams {
    name?: string;
    page: number;
    pageSize: number;
  }

  export interface ListResponse {
    list: Item[];
    total: number;
  }

  export interface SaveResponse {
    id: number;
  }

  export type ResGetPlatformPackageListApi = ListResponse;
  export type ResGetPlatformPackageDetailApi = Detail;
  export type ResGetPlatformPackageModulesApi = { list: ModuleOption[] };
  export type ResPostPlatformPackageApi = SaveResponse;
  export type ResPutPlatformPackageApi = SaveResponse;

  export interface SaveParams {
    name: string;
    schoolIds: number[];
    modules: { moduleKey: string; monthlyGiftMinutes?: number }[];
    pricingMode: TPackagePricingModeValue;
    monthlyPrice: number;
    firstMonthProration?: boolean;
    startDate: string;
    endDate: string;
    description?: string;
  }
}
