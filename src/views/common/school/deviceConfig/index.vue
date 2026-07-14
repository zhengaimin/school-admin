<script setup lang="ts" name="deviceConfig">
import type { ResultData, SchoolDeviceConfig } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { ConfigRow } from "./types";

import { ref, watch } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getSchoolDeviceConfigListApi } from "@/api/modules/device/config";
import { useManage, dateFormatter } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { DEVICE_TYPE_OPTIONS, ENABLE_STATUS, ENABLE_STATUS_OPTIONS, ENABLE_STATUS_I18N } from "@/config/modules";
import ConfigModal from "./modal/Config.vue";

const { schoolId } = useSchool();

const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: axiosGetSchoolDeviceConfigListApi }, null, list =>
  dateFormatter(list, [
    { field: "createdAt", isUnix: false },
    { field: "updatedAt", isUnix: false }
  ])
);

const modalRef = ref<InstanceType<typeof ConfigModal>>();

/** 显示编辑弹框 */
const onShowModal = (row: ConfigRow) => {
  modalRef.value?.acceptParams({ title: "编辑配置", type: "Edit", showConfirm: true }, row);
};

/**
 * 设备类型筛选项（-1 代表全部）。
 */
const deviceTypeQueryOptions = [{ label: "全部", value: -1 }, ...DEVICE_TYPE_OPTIONS];

/**
 * 构建设备配置列表查询参数。
 * @param params 原始查询参数
 * @returns 处理后的查询参数
 */
function buildSchoolDeviceConfigListParams(params: Record<string, any>) {
  const payload = { ...params };
  if (payload.deviceType === -1 || payload.deviceType === "-1" || payload.deviceType === "" || payload.deviceType == null) {
    delete payload.deviceType;
  }
  return payload;
}

/**
 * 获取设备配置列表。
 * @param params 查询参数
 * @returns 列表结果
 */
async function axiosGetSchoolDeviceConfigListApi(
  params: Record<string, any>
): Promise<ResultData<SchoolDeviceConfig.ResGetSchoolDeviceConfigListApi>> {
  try {
    const payload = buildSchoolDeviceConfigListParams(params);
    return await getSchoolDeviceConfigListApi(payload);
  } catch (error) {
    console.error("axiosGetSchoolDeviceConfigListApi:", error);
    return {
      code: -1,
      msg: "请求失败",
      data: {
        list: [],
        total: 0,
        page: Number(params.page ?? 1),
        pageSize: Number(params.pageSize ?? 10)
      }
    };
  }
}

const columns: ColumnProps<ConfigRow>[] = [
  { type: "index", label: "#", width: 60 },
  {
    prop: "schoolName",
    label: "学校名称",
    minWidth: 120,
    search: { el: "input", props: { placeholder: "请输入学校名称" } }
  },
  {
    prop: "deviceType",
    label: "设备类型",
    width: 100,
    enum: deviceTypeQueryOptions,
    search: { el: "select", defaultValue: -1, props: { placeholder: "请选择设备类型" } }
  },
  {
    prop: "vendorCode",
    label: "厂商代码",
    width: 100,
    search: { el: "input", props: { placeholder: "请输入厂商代码" } }
  },
  { prop: "description", label: "设备描述", minWidth: 140, showOverflowTooltip: true },
  { prop: "sortOrder", label: "显示排序", width: 100 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    fixed: "right",
    search: {
      el: "select",
      props: { placeholder: "请选择状态" }
    },
    enum: ENABLE_STATUS_OPTIONS
  },
  { prop: "createdAt", label: "创建时间", width: 160 },
  { prop: "updatedAt", label: "更新时间", width: 160 },
  { prop: "operation", label: "操作", width: 100, fixed: "right" }
];

watch(schoolId, () => refreshTableList());
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="学校设备配置管理">
      <template #status="{ row }">
        <el-tag :type="row.status === ENABLE_STATUS.ENABLED ? 'success' : 'info'">
          {{ ENABLE_STATUS_I18N[row.status] }}
        </el-tag>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="onShowModal(row)">编辑</el-button>
      </template>
    </ProTable>

    <ConfigModal ref="modalRef" @submit="refreshTableList" />
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
