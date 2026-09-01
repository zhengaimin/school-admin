import type { PlatformPackage } from "@/api/interface";
import type { TPackageStatusValue } from "@/config/modules/package";
import http from "@/api";

const PREFIX = "/admin/platform-packages";

export const getPlatformPackageListApi = (params: PlatformPackage.ListParams) =>
  http.get<PlatformPackage.ResGetPlatformPackageListApi>(PREFIX, params);

export const getPlatformPackageDetailApi = (id: number | string) =>
  http.get<PlatformPackage.ResGetPlatformPackageDetailApi>(`${PREFIX}/${id}`);

export const createPlatformPackageApi = (data: PlatformPackage.SaveParams) =>
  http.post<PlatformPackage.ResPostPlatformPackageApi>(PREFIX, data);

export const updatePlatformPackageApi = (id: number | string, data: PlatformPackage.SaveParams) =>
  http.put<PlatformPackage.ResPutPlatformPackageApi>(`${PREFIX}/${id}`, data);

export const updatePlatformPackageStatusApi = (id: number | string, status: TPackageStatusValue) =>
  http.put<null>(`${PREFIX}/${id}/status`, { status });

/** 删除平台套餐 */
export const deletePlatformPackageApi = (id: number | string) => http.delete<null>(`${PREFIX}/${id}`);

export const getPlatformPackageModulesApi = () => http.get<PlatformPackage.ResGetPlatformPackageModulesApi>(`${PREFIX}/modules`);
