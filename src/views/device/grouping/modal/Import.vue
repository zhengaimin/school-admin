<script setup lang="ts">
import type { DeviceGroup, ResultData } from "@/api/interface";

import { ref } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

import { postDeviceGroupImportApi } from "@/api/modules";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import UploadFile from "@/components/Upload/File.vue";
import { useSchool } from "@/hooks/useSchool";

const emit = defineEmits<{
  submit: [];
}>();

const { schoolId, schoolName } = useSchool();

/** 弹窗可见 */
const visible = ref(false);
/** 导入失败列表 */
const errorList = ref<DeviceGroup.IDeviceGroupImportErrorVo[]>([]);

/** 导入设备组 */
async function axiosPostDeviceGroupImportApi(file: File): Promise<ResultData<DeviceGroup.ResPostDeviceGroupImportApi | null>> {
  try {
    return await postDeviceGroupImportApi(Number(schoolId.value), file);
  } catch (error) {
    console.error("axiosPostDeviceGroupImportApi:", error);
    return { code: -1, msg: "请求失败", data: null };
  }
}

/** 导入前确认微信设备组同步风险 */
async function handleBeforeImport(): Promise<boolean> {
  try {
    await ElMessageBox.confirm(
      "导入 VOIP 设备组会同步创建微信设备组，同步可能耗时较长，频繁操作存在微信风控风险。确定继续吗？",
      "同步确认",
      {
        type: "warning",
        confirmButtonText: "继续导入",
        cancelButtonText: "取消"
      }
    );
  } catch {
    return false;
  }
  return true;
}
/** 处理导入结果 */
function handleImportSuccess(result: ResultData<DeviceGroup.ResPostDeviceGroupImportApi | null>): void {
  if (result.code !== 0 || !result.data) return;
  errorList.value = result.data.results?.filter(item => item.status === "失败") ?? [];
  if (result.data.errorCount === 0) {
    ElMessage.success("导入成功");
    visible.value = false;
  }
  emit("submit");
}

/** 接收弹窗参数 */
function acceptParams(): void {
  errorList.value = [];
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" title="导入" width="760px" destroy-on-close draggable align-center>
    <div class="min-h-[100px] text-center">
      <SchoolInfo :name="schoolName" />
      <UploadFile
        v-if="!errorList.length"
        :api="axiosPostDeviceGroupImportApi"
        :before-upload="handleBeforeImport"
        :file-type="['.xls', '.xlsx']"
        height="120px"
        width="100%"
        @success="handleImportSuccess"
      >
        <template #empty>
          <el-icon class="text-2xl text-gray-400"><UploadFilled /></el-icon>
          <p class="mt-2 text-sm text-gray-500">请上传</p>
        </template>
        <template #tip>
          <p class="mt-2 text-xs text-gray-500">仅支持 .xls、.xlsx 文件，最大 10MB</p>
        </template>
      </UploadFile>
      <div v-else>
        <p class="mb-2 text-left text-base">
          导入失败数量：<span class="font-bold text-red-500">{{ errorList.length }}</span>
        </p>
        <el-table :data="errorList" class="w-full">
          <el-table-column label="Excel行号" prop="row" align="left" />
          <el-table-column label="名称" prop="name" align="left" />
          <el-table-column label="状态" prop="status" align="left" />
          <el-table-column label="失败原因" prop="message" align="left" />
        </el-table>
        <el-button class="mt-4" type="primary" @click="acceptParams">重新上传</el-button>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
