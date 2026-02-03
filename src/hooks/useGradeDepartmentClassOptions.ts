import type { Ref } from "vue";

import { ref } from "vue";
import { getClassesListApi, getDepartmentsListApi, getGradesApi } from "@/api/modules";

export type GradeCascadeOption = {
  label: string;
  value: number;
};

type RequestOptionsGroup = {
  grade?: Record<string, any>;
  department?: Record<string, any>;
  class?: Record<string, any>;
};

type HandleGradeCascadeParams = {
  gradeId?: number | null;
  reset?: () => void;
  targetSchoolId?: number | string;
  requestOptions?: Record<string, any>;
};

type HandleDepartmentCascadeParams = {
  gradeId?: number | null;
  departmentId?: number | null;
  reset?: () => void;
  targetSchoolId?: number | string;
  requestOptions?: Record<string, any>;
};

type UseGradeDepartmentClassOptionsParams = {
  schoolId: Ref<string | number | undefined>;
  pageSize?: number;
  requestOptions?: RequestOptionsGroup;
  setLoading?: (loading: boolean) => void;
};

const DEFAULT_PAGE_SIZE = 200;

/** 年级/级部/班级级联选项 */
export function useGradeDepartmentClassOptions(params: UseGradeDepartmentClassOptionsParams) {
  const gradeOptions = ref<GradeCascadeOption[]>([]);
  const departmentOptions = ref<GradeCascadeOption[]>([]);
  const classOptions = ref<GradeCascadeOption[]>([]);

  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  const resolveSchoolId = (targetSchoolId?: number | string) => {
    const raw = targetSchoolId ?? params.schoolId.value;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const mergeRequestOptions = (base?: Record<string, any>, extra?: Record<string, any>) => {
    if (!base && !extra) return undefined;
    return { ...(base || {}), ...(extra || {}) };
  };

  const runWithLoading = async <T>(action: () => Promise<T>) => {
    params.setLoading?.(true);
    try {
      return await action();
    } finally {
      params.setLoading?.(false);
    }
  };

  /** 获取年级选项 */
  const loadGradeOptions = async (targetSchoolId?: number | string, requestOptions?: Record<string, any>) => {
    const schoolId = resolveSchoolId(targetSchoolId);
    if (schoolId === undefined) return { code: -1, data: null };

    const options = mergeRequestOptions(params.requestOptions?.grade, requestOptions);
    return await runWithLoading(async () => {
      try {
        const result = await getGradesApi({ schoolId, page: 1, pageSize }, options);
        if (result.code === 0) {
          const list = (result.data?.list || []).map((item: any) => ({
            label: item.name,
            value: item.id
          }));
          gradeOptions.value.splice(0, gradeOptions.value.length, ...list);
        }
        return result;
      } catch (error) {
        console.error("loadGradeOptions:", error);
        return { code: -1, data: null };
      }
    });
  };

  /** 获取级部选项 */
  const loadDepartmentOptions = async (
    gradeId?: number | null,
    targetSchoolId?: number | string,
    requestOptions?: Record<string, any>
  ) => {
    if (gradeId == null) return { code: -1, data: null };
    const schoolId = resolveSchoolId(targetSchoolId);
    if (schoolId === undefined) return { code: -1, data: null };

    const options = mergeRequestOptions(params.requestOptions?.department, requestOptions);
    return await runWithLoading(async () => {
      try {
        const result = await getDepartmentsListApi({ schoolId, gradeId, page: 1, pageSize }, options);
        if (result.code === 0) {
          const list = (result.data?.list || []).map((item: any) => ({
            label: item.name,
            value: item.id
          }));
          departmentOptions.value.splice(0, departmentOptions.value.length, ...list);
        }
        return result;
      } catch (error) {
        console.error("loadDepartmentOptions:", error);
        return { code: -1, data: null };
      }
    });
  };

  /** 获取班级选项 */
  const loadClassOptions = async (
    gradeId?: number | null,
    departmentId?: number | null,
    targetSchoolId?: number | string,
    requestOptions?: Record<string, any>
  ) => {
    if (gradeId == null || departmentId == null) return { code: -1, data: null };
    const schoolId = resolveSchoolId(targetSchoolId);
    if (schoolId === undefined) return { code: -1, data: null };

    const options = mergeRequestOptions(params.requestOptions?.class, requestOptions);
    return await runWithLoading(async () => {
      try {
        const result = await getClassesListApi({ schoolId, gradeId, departmentId, page: 1, pageSize }, options);
        if (result.code === 0) {
          const list = (result.data?.list || []).map((item: any) => ({
            label: item.name,
            value: item.id
          }));
          classOptions.value.splice(0, classOptions.value.length, ...list);
        }
        return result;
      } catch (error) {
        console.error("loadClassOptions:", error);
        return { code: -1, data: null };
      }
    });
  };

  /** 清空级部与班级选项 */
  const resetDepartmentOptions = () => {
    departmentOptions.value.length = 0;
    classOptions.value.length = 0;
  };

  /** 清空班级选项 */
  const resetClassOptions = () => {
    classOptions.value.length = 0;
  };

  /** 清空全部选项 */
  const resetAllOptions = () => {
    gradeOptions.value.length = 0;
    resetDepartmentOptions();
  };

  /** 处理年级级联 */
  const handleGradeCascade = async (params: HandleGradeCascadeParams) => {
    params.reset?.();
    resetDepartmentOptions();
    if (params.gradeId != null) {
      await loadDepartmentOptions(params.gradeId, params.targetSchoolId, params.requestOptions);
    }
  };

  /** 处理级部级联 */
  const handleDepartmentCascade = async (params: HandleDepartmentCascadeParams) => {
    params.reset?.();
    resetClassOptions();
    if (params.gradeId != null && params.departmentId != null) {
      await loadClassOptions(params.gradeId, params.departmentId, params.targetSchoolId, params.requestOptions);
    }
  };

  return {
    gradeOptions,
    departmentOptions,
    classOptions,
    loadGradeOptions,
    loadDepartmentOptions,
    loadClassOptions,
    resetDepartmentOptions,
    resetClassOptions,
    resetAllOptions,
    handleGradeCascade,
    handleDepartmentCascade
  };
}
