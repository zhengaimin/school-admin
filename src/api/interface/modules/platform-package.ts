export namespace PlatformPackage {
  export interface ModuleItem {
    serviceType: string;
    moduleKind: string;
    name: string;
    monthlyQuota?: number;
  }

  export interface ModuleOption {
    serviceType: string;
    moduleKind: string;
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
    modules: { serviceType: string; monthlyQuota?: number }[];
    pricingMode: string;
    monthlyPrice: number;
    startDate: string;
    endDate: string;
    description?: string;
  }
}
