export namespace PlatformPackage {
  export interface ModuleItem {
    moduleKey: string;
    kind: string;
    name: string;
    monthlyGiftMinutes?: number;
  }

  export interface ModuleOption {
    moduleKey: string;
    kind: string;
    name: string;
  }

  export interface Item {
    id: number;
    name: string;
    schoolIds: number[];
    modules: ModuleItem[];
    pricingMode: string;
    monthlyPrice: number;
    startDate: string;
    endDate: string;
    status: number;
    statusText: string;
  }

  export interface Detail extends Item {
    description: string;
  }

  export interface ListParams {
    name?: string;
    page: number;
    pageSize: number;
  }

  export interface SaveParams {
    name: string;
    schoolIds: number[];
    modules: { moduleKey: string; monthlyGiftMinutes?: number }[];
    pricingMode: string;
    monthlyPrice: number;
    startDate: string;
    endDate: string;
    description?: string;
  }
}
