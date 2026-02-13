<script setup lang="ts" name="control">
import type { DeviceDialConfig } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { TDeviceDialConfigItem } from "./types";

import { computed, ref, watch } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { deleteDeviceDialConfigApi, getDeviceDialConfigListApi } from "@/api/modules";
import ProTable from "@/components/ProTable/index.vue";
import Control from "./modal/Control.vue";
import Detail from "./modal/Detail.vue";
import { DIAL_MODE_I18N, PHONE_ENTRY, PHONE_ENTRY_I18N, PHONE_TYPE, YES_NO_FLAG, YES_NO_FLAG_I18N } from "@/config/modules";
import { useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";

const { schoolId, schoolName, isAllSchools } = useSchool();
const { proTable, axiosGetTableList, refreshTableList, deleteRow } = useManage({
  get: axiosGetDialConfigListApi,
  delete: axiosDeleteDialConfigApi
});

/** 控制弹窗引用 */
const controlModalRef = ref<InstanceType<typeof Control> | null>(null);
/** 详情弹窗引用 */
const detailModalRef = ref<InstanceType<typeof Detail> | null>(null);
/** 表格列配置 */
const columns: ColumnProps<TDeviceDialConfigItem>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 160 },
  { prop: "heartbeatFrequency", label: "心跳时间（ms）", minWidth: 140 },
  { prop: "callTime", label: "单次通话限定时长（分钟）", minWidth: 180 },
  { prop: "powerOnTime", label: "定时开机时间", minWidth: 130 },
  { prop: "powerOffTime", label: "定时关机时间", minWidth: 130 },
  { prop: "dialMode", label: "拨号模式", minWidth: 140 },
  { prop: "phoneTypes", label: "拨号入口", minWidth: 160 },
  { prop: "messageFlag", label: "是否显示留言按钮", minWidth: 160 },
  { prop: "operation", label: "操作", width: 200, fixed: "right" }
];
/** 表格总条数 */
const tableTotal = computed(() => proTable.value?.pageable?.value?.total ?? 0);
/** 是否允许新增 */
const canAdd = computed(() => tableTotal.value === 0);

/** 获取公话配置列表 */
async function axiosGetDialConfigListApi(params: DeviceDialConfig.ReqGetDeviceDialConfigListApi) {
  try {
    return await getDeviceDialConfigListApi(params);
  } catch (error) {
    console.error("axiosGetDialConfigListApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}
/** 删除公话配置 */
async function axiosDeleteDialConfigApi(id: number) {
  try {
    return await deleteDeviceDialConfigApi(id);
  } catch (error) {
    console.error("axiosDeleteDialConfigApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}

/** 显示弹窗 */
function handleShowModal(type: TModalType, row?: TDeviceDialConfigItem) {
  if (type === "Add" && isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }

  if (type === "View" && row) {
    detailModalRef.value?.acceptParams({ title: "配置详情", type: "View", showConfirm: false }, row);
    return;
  }

  if (type === "Edit" && row) {
    controlModalRef.value?.acceptParams({ title: "编辑", type: "Edit", showConfirm: true }, row);
    return;
  }

  if (type === "Add") {
    controlModalRef.value?.acceptParams({ title: "新增", type: "Add", showConfirm: true });
  }
}
/** 删除 */
function handleDelete(row: TDeviceDialConfigItem) {
  if (!row?.id) return;
  deleteRow(row.id, row.schoolName ?? "");
}
/** 获取拨号入口文案 */
function getPhoneEntriesText(row: TDeviceDialConfigItem) {
  if (row.phoneTypes?.length) {
    return row.phoneTypes.map(item => PHONE_ENTRY_I18N[item] || item).join("、");
  }
  if (row.phoneType === PHONE_TYPE.ALL) {
    return [PHONE_ENTRY.VIDEO, PHONE_ENTRY.SIM, PHONE_ENTRY.SIP].map(item => PHONE_ENTRY_I18N[item]).join("、");
  }
  if (row.phoneType === PHONE_TYPE.VIDEO) return PHONE_ENTRY_I18N[PHONE_ENTRY.VIDEO];
  if (row.phoneType === PHONE_TYPE.SIM) return PHONE_ENTRY_I18N[PHONE_ENTRY.SIM];
  return "--";
}

/** 监听学校切换 */
watch(schoolId, () => {
  refreshTableList();
});
</script>

<template>
  <div class="flex h-full flex-col">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="公话配置">
      <template #toolButton>
        <el-button v-if="canAdd" type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">新增</el-button>
      </template>

      <template #dialMode="{ row }">
        {{ DIAL_MODE_I18N[row.dialMode] || "--" }}
      </template>

      <template #phoneTypes="{ row }">
        {{ getPhoneEntriesText(row) }}
      </template>

      <template #messageFlag="{ row }">
        {{
          row.messageFlag === YES_NO_FLAG.YES
            ? YES_NO_FLAG_I18N[YES_NO_FLAG.YES]
            : row.messageFlag === YES_NO_FLAG.NO
              ? YES_NO_FLAG_I18N[YES_NO_FLAG.NO]
              : "--"
        }}
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowModal('View', row)">详情</el-button>
        <el-button type="primary" link @click="handleShowModal('Edit', row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>

    <Control ref="controlModalRef" :school-name="schoolName" @success="refreshTableList" />
    <Detail ref="detailModalRef" />
  </div>
</template>
