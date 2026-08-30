import type { PlatformPackage } from "@/api/interface";
import http from "@/api";

const PREFIX = "/admin/platform-packages";

export const getPlatformPackageListApi = (params: PlatformPackage.ListParams) =>
  http.get<{ list: PlatformPackage.Item[]; total: number }>(PREFIX, params);

export const getPlatformPackageDetailApi = (id: number) => http.get<PlatformPackage.Detail>(`${PREFIX}/${id}`);

export const createPlatformPackageApi = (data: PlatformPackage.SaveParams) => http.post(PREFIX, data);

export const updatePlatformPackageApi = (id: number, data: PlatformPackage.SaveParams) => http.put(`${PREFIX}/${id}`, data);

export const updatePlatformPackageStatusApi = (id: number, status: number) => http.put(`${PREFIX}/${id}/status`, { status });

export const deletePlatformPackageApi = (id: number) => http.delete(`${PREFIX}/${id}`);

export const getPlatformPackageModulesApi = () => http.get<{ list: PlatformPackage.ModuleOption[] }>(`${PREFIX}/modules`);
