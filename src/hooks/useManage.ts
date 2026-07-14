import { ResPage, ResultData } from "@/api/interface/index";
import { ref } from "vue";
import { ElMessageBox, ElNotification } from "element-plus";
import { ENABLE_STATUS } from "@/config/modules";
import { useUserStore } from "@/stores/modules/user";
import dayjs from "dayjs";

/** 日期格式化配置 */
type TDateFieldConfig = {
  field: string;
  format?: string;
  isUnix?: boolean;
};

/** 格式化时间戳 */
export const formatTimestamp = (timestamp: number | string | null | undefined, format = "YYYY-MM-DD HH:mm:ss"): string => {
  if (timestamp === null || timestamp === undefined || timestamp === "") return "";
  const date = typeof timestamp === "number" ? dayjs.unix(timestamp) : dayjs(timestamp);
  return date.isValid() ? date.format(format) : "";
};

/** 日期格式化函数 */
export const dateFormatter = (list: any[], fields: (string | TDateFieldConfig)[], defaultFormat = "YYYY-MM-DD HH:mm:ss") => {
  return (list || []).map(item => {
    const newItem = { ...item };
    fields.forEach(fieldConfig => {
      const field = typeof fieldConfig === "string" ? fieldConfig : fieldConfig.field;
      const format = typeof fieldConfig === "string" ? defaultFormat : fieldConfig.format || defaultFormat;
      const isUnix = typeof fieldConfig === "string" ? false : (fieldConfig.isUnix ?? false);

      if (newItem[field] !== undefined && newItem[field] !== null && newItem[field] !== "") {
        const date = isUnix ? dayjs.unix(newItem[field]) : dayjs(newItem[field]);
        newItem[field] = date.isValid() ? date.format(format) : "";
      } else {
        newItem[field] = "";
      }
    });
    return newItem;
  });
};

type TFormList = ((list: any[]) => any[]) | null;
type TParams = {
  page?: number;
  pageSize?: number;
  [key: string]: any;
};
type TApi = (params: any) => Promise<ResultData<any>>;
type TApis = {
  get: TApi;
  delete?: (params: any) => Promise<ResultData<any>>;
  update?: (params: any) => Promise<ResultData<any>>;
};

export const useManage = (apis: TApis, initParams: TParams | null = null, formatList: TFormList = null) => {
  const proTable = ref<any>(null);
  const query = ref<TParams | null>(null);
  const extra = ref<any>(null);

  const refreshTableList = async () => {
    return await proTable.value?.getTableList();
  };

  const withParams = (params: any) => {
    const { pageNum, pageSize, ..._params } = params;
    const init = { sort: "created_at-desc", ...(initParams || {}) };

    if (params.pageNum) {
      _params.page = params.pageNum;
    }
    if (params.pageSize) {
      _params.pageSize = params.pageSize;
    }

    // 如果 store 中选中了学校，添加学校 id 到查询条件（-1 表示全部，不需要携带）
    const userStore = useUserStore();
    if (userStore.schoolMsg?.schoolId && userStore.schoolMsg.schoolId !== "-1") {
      _params.schoolId = userStore.schoolMsg.schoolId;
    }

    query.value = {
      page: pageNum,
      pageSize: pageSize,
      ..._params,
      ...init
    };
    return { ...query.value };
  };
  const formatTableList = (data: ResPage<any> | null = null) => {
    if (data) {
      const { list, page, pageSize, total } = data!;

      return {
        data: {
          list: formatList ? formatList(list || []) : list || [],
          pageNum: page ?? query.value?.page ?? 1,
          pageSize: pageSize ?? query.value?.pageSize ?? 10,
          total: total
        }
      };
    }

    return {
      data: {
        list: [],
        pageNum: query.value?.page ?? 1,
        pageSize: query.value?.pageSize ?? 10,
        total: 0
      }
    };
  };
  /** 获取表格列表 */
  const axiosGetTableList = async (params = {}) => {
    if (!apis.get) {
      throw new Error("useManage Hook 需要传入 apis.get 方法");
    }
    try {
      const _params = withParams(params);
      const result = await apis.get({ ..._params });

      if (result.code === 0) {
        const { list, page, pageSize, total, ...data } = result.data;
        extra.value = data;
        return formatTableList({ list, page, pageSize, total });
      }

      return formatTableList();
    } catch (error) {
      console.log(error);
      return formatTableList();
    }
  };
  /** 删除某一项 */
  const deleteRow = (id, text = "", callback: any = null) => {
    if (!apis.delete) {
      throw new Error("useManage Hook 需要传入 apis.delete 方法");
    }

    console.log(id);
    ElMessageBox.confirm(text ? `确定删除 【${text}】 吗？` : "确定删除此项吗？", "提示", {
      type: "warning"
    }).then(async () => {
      const result = await apis.delete!(id);

      if (result.code === 0) {
        ElNotification({
          type: "success",
          title: "成功",
          message: text ? `${text} 删除成功` : "删除成功"
        });
        refreshTableList();
        if (callback) callback();
      }
    });
  };
  /** 启用/禁用 */
  const onBeforeSwitchActive = (row, text: string, key: string = "status") => {
    if (!apis.update) {
      throw new Error("useManage Hook 需要传入 apis.update 方法");
    }

    const statusKey = key;
    const statusLoadingKey = `${key}_loading`;
    const statusActiveKey = `${key}_active`;

    return new Promise(resolve => {
      // 没有初始化数据
      if (row[statusLoadingKey] === undefined || row[statusActiveKey] === undefined) {
        row[statusLoadingKey] = false;
        row[statusActiveKey] = row[statusKey] === ENABLE_STATUS.ENABLED;
      }

      const tip = row[statusActiveKey] ? `确定要禁用【${text}】吗？` : `确定要激活该【${text}】吗？`;

      ElMessageBox.confirm(tip, "提示", {
        type: "warning"
      })
        .then(async () => {
          row[statusLoadingKey] = true;

          const status = row[statusKey] === ENABLE_STATUS.ENABLED ? ENABLE_STATUS.DISABLED : ENABLE_STATUS.ENABLED;

          const result = await apis.update!({
            id: row.id,
            status
          });

          if (result.code === 0) {
            row[statusKey] = status;
            row[statusActiveKey] = status === ENABLE_STATUS.ENABLED;
            row[statusLoadingKey] = false;

            resolve(true);
            ElNotification({
              title: "提示",
              message: row[statusActiveKey] ? `激活【${text}】成功！` : `禁用【${text}】成功！`,
              type: "success"
            });
          }
        })
        .catch(() => {
          row[statusLoadingKey] = false;
          resolve(false);
        });
    });
  };

  return {
    query,
    extra,
    proTable,
    axiosGetTableList,
    refreshTableList,

    deleteRow,
    onBeforeSwitchActive
  };
};
