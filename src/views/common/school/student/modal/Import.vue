<script setup lang="ts">
import type { ResultData, Student } from "@/api/interface";
import type { UploadInstance, UploadRequestOptions } from "element-plus";
import type { ImportErrorData, StudentImportAcceptParams, StudentImportType } from "../types";

import { computed, nextTick, ref } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { postStudentImportApi, postStudentUpdateImportApi } from "@/api/modules";
import { useSchool } from "@/hooks/useSchool";
import { useUserStore } from "@/stores/modules/user";
import { isNullOrUnDef } from "@/utils/is";

const emit = defineEmits<{
  submit: [];
}>();

const { schoolId, schoolName, guardSchool } = useSchool();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

const uploadFileRef = ref<UploadInstance>();
const visible = ref(false);
const importType = ref<StudentImportType>(1);
const importErrorVisible = ref(false);
const importErrorData = ref<ImportErrorData>({});

/** 导入学生信息 */
async function axiosPostStudentImportApi(file: File): Promise<ResultData<Student.ResPostStudentImportApi | null>> {
  try {
    const params: Student.ReqPostStudentImportApi = {
      schoolId: Number(schoolId.value)
    };
    if (!isNullOrUnDef(userInfo.value?.tenantId)) {
      params.tenantId = userInfo.value.tenantId;
    }
    return await postStudentImportApi(params, file);
  } catch (error) {
    console.error("axiosPostStudentImportApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}
/** 导入更新学生信息 */
async function axiosPostStudentUpdateImportApi(file: File): Promise<ResultData<Student.ResPostStudentUpdateImportApi | null>> {
  try {
    return await postStudentUpdateImportApi(file);
  } catch (error) {
    console.error("axiosPostStudentUpdateImportApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}

/** 导入前提示 */
function handleBeforeImport() {
  ElNotification({
    title: "提示",
    message: "数据导入中，请稍后",
    type: "success",
    duration: 0
  });
  return true;
}
/** 执行导入 */
async function handleUploadImport(options: UploadRequestOptions) {
  try {
    const file = options.file as File;
    const result = importType.value === 1 ? await axiosPostStudentImportApi(file) : await axiosPostStudentUpdateImportApi(file);
    options.onSuccess?.(result);
  } catch (error) {
    console.error("handleUploadImport:", error);
    ElNotification.closeAll();
    const message = error instanceof Error ? error.message : "上传失败";
    const uploadError = new Error(message) as Parameters<UploadRequestOptions["onError"]>[0];
    uploadError.status = 0;
    uploadError.method = options.method;
    uploadError.url = options.action;
    options.onError?.(uploadError);
  }
}
/** 导入成功回调 */
function handleImportSuccess(res: { code?: number; data?: ImportErrorData }) {
  if (res?.code === 0 && res.data?.failCount === 0) {
    ElMessage.success("导入成功");
    visible.value = false;
  } else if (res?.data) {
    importErrorData.value = res.data;
    importErrorVisible.value = true;
  }
  ElNotification.closeAll();
  emit("submit");
}

/** 接收参数 */
async function acceptParams(params: StudentImportAcceptParams) {
  if (!guardSchool()) return;
  importType.value = params.importType;
  importErrorVisible.value = false;
  importErrorData.value = {};
  visible.value = true;
  await nextTick();
  uploadFileRef.value?.clearFiles();
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" title="导入" width="760px" destroy-on-close draggable align-center>
    <div class="min-h-[100px] text-center">
      <el-row>
        <el-col :span="24">
          <div class="mb-4 rounded-lg bg-gray-100 px-4 py-2 text-left">
            学校名称：<span class="font-bold text-[var(--el-color-primary)]">{{ schoolName }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="!importErrorVisible">
        <el-col :span="24">
          <el-upload
            ref="uploadFileRef"
            class="w-full"
            action="#"
            :http-request="handleUploadImport"
            :before-upload="handleBeforeImport"
            :on-success="handleImportSuccess"
            :limit="1"
            :show-file-list="false"
          >
            <div
              class="mx-auto flex h-[120px] w-full flex-col items-center justify-center rounded-lg border border-solid border-gray-200 bg-gray-50"
            >
              <el-icon class="text-2xl text-gray-400"><UploadFilled /></el-icon>
              <p class="mt-2 text-sm text-gray-500">请上传</p>
            </div>
          </el-upload>
        </el-col>
      </el-row>
      <div v-else>
        <el-row>
          <h1 class="m-0 mb-2 text-base font-normal">
            导入失败数量：<span class="font-bold text-red-500">{{ importErrorData.failCount }}</span>
          </h1>
        </el-row>
        <el-row>
          <el-table :data="importErrorData.failList || []" class="w-full">
            <el-table-column label="Excel行号" prop="index" align="left" />
            <el-table-column label="姓名" prop="name" align="left" />
            <el-table-column label="失败原因" prop="reason" align="left" />
          </el-table>
        </el-row>
      </div>
      <div class="mt-4 text-center">
        <el-button @click="visible = false">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
