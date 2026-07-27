import { defineStore } from "pinia";
import type { PermissionState } from "@/stores/interface";
import type { System } from "@/api/interface";
import piniaPersistConfig from "@/stores/helper/persist";
import { generatePrefix } from "@/stores/helper/prefix";

const id = generatePrefix("permission");

const normalizePermissionModules = (payload: any): System.PermissionModule[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.modules)) return payload.modules;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.modules)) return payload.data.modules;
  return [];
};

const buildModulePermissions = (modules: System.PermissionModule[]): Record<string, System.Permission[]> => {
  return modules.reduce<Record<string, System.Permission[]>>((acc, module) => {
    if (module.moduleKey) {
      acc[module.moduleKey] = module.permissions || [];
    }
    return acc;
  }, {});
};

export const usePermissionStore = defineStore(id, {
  state: (): PermissionState => ({
    modulePermissions: {}
  }),
  getters: {
    modulePermissionsGet: state => state.modulePermissions,
    moduleKeysGet: state => Object.keys(state.modulePermissions),
    permissionCodesGet: state => {
      const codes = new Set<string>();
      Object.values(state.modulePermissions).forEach(permissions => {
        permissions?.forEach(permission => {
          if (permission?.code) {
            codes.add(permission.code);
          }
        });
      });
      return Array.from(codes);
    },
    getPermissionsByModule: state => (moduleKey: string) => state.modulePermissions[moduleKey] ?? []
  },
  actions: {
    setModulePermissions(modulePermissions: Record<string, System.Permission[]>) {
      this.modulePermissions = modulePermissions || {};
    },
    setModulePermissionsByModules(payload: any) {
      const modules = normalizePermissionModules(payload);
      this.modulePermissions = buildModulePermissions(modules);
    },
    resetModulePermissions() {
      this.modulePermissions = {};
    }
  },
  persist: piniaPersistConfig(id)
});
