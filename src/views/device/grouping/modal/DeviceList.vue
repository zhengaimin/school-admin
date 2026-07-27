<script setup lang="ts">
import type { Device, DeviceGroup, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";

import { ref } from "vue";

import { getDeviceListApi } from "@/api/modules";

import ProTable from "@/components/ProTable/index.vue";

import { DEVICE_STATUS, DEVICE_STATUS_I18N, DEVICE_STATUS_OPTIONS } from "@/config/modules";
import { dateFormatter, useManage } from "@/hooks/useManage";

const { proTable, axiosGetTableList } = useManage({ get: axiosGetDeviceGroupDeviceListApi }, null, list =>
  dateFormatter(list, ["createdAt"])
);

/** 弹窗可见 */
const visible = ref(false);
/** 当前设备组ID */
const deviceGroupId = ref<number | null>(null);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});
/** 表格列配置 */
const columns: ColumnProps<Device.IDeviceItemVo>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "schoolName", label: "学校名称", minWidth: 140 },
  {
    prop: "terminalSn",
    label: "设备SN号",
    minWidth: 180,
    search: { el: "input", props: { placeholder: "请输入设备SN号" } }
  },
  {
    prop: "name",
    label: "设备名称",
    minWidth: 160,
    search: { el: "input", props: { placeholder: "请输入设备名称" } }
  },
  { prop: "terminalMac", label: "设备MAC地址", minWidth: 160 },
  { prop: "location", label: "设备位置", minWidth: 160 },
  {
    prop: "status",
    label: "设备状态",
    width: 100,
    enum: DEVICE_STATUS_OPTIONS,
    search: { el: "select", props: { placeholder: "请选择状态" } }
  },
  { prop: "createdAt", label: "创建时间", width: 170 }
];

/**
 * 获取设备组内设备列表
 * @param params 查询参数
 * @returns 设备列表结果
 */
async function axiosGetDeviceGroupDeviceListApi(params: Device.ReqGetDevicesApi): Promise<ResultData<Device.ResGetDevicesApi>> {
  const emptyData: Device.ResGetDevicesApi = {
    list: [],
    total: 0,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10
  };
  if (deviceGroupId.value === null) return { code: 0, msg: "成功", data: emptyData };
  try {
    return await getDeviceListApi({
      ...params,
      deviceGroupId: deviceGroupId.value
    });
  } catch (error) {
    console.error("axiosGetDeviceGroupDeviceListApi:", error);
    return { code: -1, msg: "请求失败", data: emptyData };
  }
}

/**
 * 接收弹窗参数
 * @param params 弹窗参数
 * @param row 当前设备组
 * @returns void
 */
function acceptParams(params: TModalParams, row?: DeviceGroup.IDeviceGroupItemVo): void {
  if (!row?.id) return;
  parameter.value = { ...parameter.value, ...params };
  deviceGroupId.value = row.id;
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="1120px" destroy-on-close draggable align-center>
    <ProTable
      ref="proTable"
      class="h-[560px]!"
      :columns="columns"
      :request-api="axiosGetTableList"
      :tool-button="false"
      row-key="id"
    >
      <template #status="{ row }">
        <el-tag :type="row.status === DEVICE_STATUS.ONLINE ? 'success' : 'info'">
          {{ DEVICE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>
    </ProTable>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
