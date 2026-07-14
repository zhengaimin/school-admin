<script setup lang="ts">
import type { Common } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { computed, nextTick, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { getApkPackageDetailApi, postApkPackageApi, putUpdateApkPackageApi } from "@/api/modules";
import { APK_PACKAGE_STATUS, APK_PACKAGE_STATUS_I18N } from "@/config/modules";
import UploadFile from "@/components/Upload/File.vue";
import { buildPutUpdateApkPackagePayload } from "../utils/payload";

const emits = defineEmits(["submit"]);

/** 弹窗显隐 */
const visible = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "Add",
  showConfirm: true
});
/** 表单实例 */
const ruleFormRef = ref<FormInstance>();
/** 当前记录 ID */
const currentId = ref<number>();
/** 选择的 APK 文件 */
const uploadFile = ref<File>();
/** 上传组件绑定地址（仅用于展示） */
const uploadFileUrl = ref("");
/** 表单数据 */
const ruleForm = ref<{
  changelog: string;
  packageName?: string;
  versionName?: string;
  versionCode?: number;
  fileSize?: number;
  checksum?: string;
  status?: Common.IApkPackageItemVo["status"];
}>({
  changelog: "",
  status: APK_PACKAGE_STATUS.DISABLED
});

/** 是否新增 */
const isAdd = computed(() => parameter.value.type === "Add");
/** 是否编辑 */
const isEdit = computed(() => parameter.value.type === "Edit");

/** 表单规则 */
const rules: FormRules = {
  changelog: [{ required: false, trigger: "blur" }]
};

/** 格式化文件大小 */
function formatFileSize(fileSize?: number) {
  if (!fileSize || Number(fileSize) <= 0) return "--";
  const size = Number(fileSize);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/** 获取 APK 详情 */
async function axiosGetApkPackageDetailApi(id: number) {
  try {
    return await getApkPackageDetailApi(id);
  } catch (error) {
    console.error("axiosGetApkPackageDetailApi:", error);
    return { code: -1, data: null };
  }
}

/** 上传 APK */
async function axiosPostApkPackageApi(file: File, changelog?: string, status?: Common.ReqPostApkPackageApi["status"]) {
  try {
    const result = await postApkPackageApi(file, changelog, status);
    if (result.code === 0) {
      ElMessage.success("上传成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostApkPackageApi:", error);
    return { code: -1, data: null };
  }
}

/** 更新 APK */
async function axiosPutUpdateApkPackageApi(id: number, changelog?: string) {
  try {
    const payload = buildPutUpdateApkPackagePayload(changelog);
    const result = await putUpdateApkPackageApi(id, payload);
    if (result.code === 0) {
      ElMessage.success("更新成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutUpdateApkPackageApi:", error);
    return { code: -1, data: null };
  }
}

/** 使用 File 组件接收 APK 文件 */
async function handleApkFileUpload(file: File) {
  uploadFile.value = file;
  const tempFileUrl = `temp://${file.name}`;
  uploadFileUrl.value = tempFileUrl;
  ElMessage.success(`已选择 APK 文件：${file.name}`);
  return {
    fileUrl: tempFileUrl,
    fileName: file.name,
    fileSize: file.size,
    fileType: "other" as const,
    fileHash: "",
    originalName: file.name,
    uploadTime: new Date().toISOString()
  };
}

/** 监听上传组件删除动作，保持文件状态一致 */
watch(uploadFileUrl, value => {
  if (!value) {
    uploadFile.value = undefined;
  }
});

/** 提交表单 */
async function handleSubmitForm(formEl?: FormInstance) {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (!valid) return;
    if (isAdd.value) {
      if (!uploadFile.value) {
        ElMessage.warning("请先选择 APK 文件");
        return;
      }
      const result = await axiosPostApkPackageApi(
        uploadFile.value,
        ruleForm.value.changelog,
        ruleForm.value.status || APK_PACKAGE_STATUS.DISABLED
      );
      if (result.code !== 0) return;
    }
    if (isEdit.value) {
      if (!currentId.value) return;
      const result = await axiosPutUpdateApkPackageApi(currentId.value, ruleForm.value.changelog);
      if (result.code !== 0) return;
    }
    visible.value = false;
    emits("submit");
  });
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: Common.IApkPackageItemVo) {
  parameter.value = { ...parameter.value, ...params };
  currentId.value = row?.id;
  uploadFile.value = undefined;
  uploadFileUrl.value = "";
  ruleForm.value = {
    changelog: "",
    status: APK_PACKAGE_STATUS.DISABLED
  };

  if (isEdit.value && row?.id) {
    const result = await axiosGetApkPackageDetailApi(row.id);
    if (result.code === 0 && result.data) {
      ruleForm.value = {
        changelog: result.data.changelog || "",
        packageName: result.data.packageName,
        versionName: result.data.versionName,
        versionCode: result.data.versionCode,
        fileSize: result.data.fileSize,
        checksum: result.data.checksum,
        status: result.data.status
      };
    }
  }

  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="760px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-row v-if="isAdd" :gutter="24">
        <el-col :span="24">
          <el-form-item label="APK 文件" required>
            <UploadFile
              v-model="uploadFileUrl"
              :api="handleApkFileUpload"
              :file-type="['.apk']"
              :file-size="200"
              :drag="true"
              height="150px"
              width="100%"
            >
              <template #tip>
                <div class="text-xs text-gray-500">仅支持 .apk 文件，可拖拽上传，最大 200MB</div>
              </template>
            </UploadFile>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isEdit" :gutter="24">
        <el-col :span="12">
          <el-form-item label="包名">
            <el-input :model-value="ruleForm.packageName || '--'" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本名称">
            <el-input :model-value="ruleForm.versionName || '--'" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isEdit" :gutter="24">
        <el-col :span="12">
          <el-form-item label="版本号">
            <el-input :model-value="ruleForm.versionCode || '--'" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-input :model-value="ruleForm.status ? APK_PACKAGE_STATUS_I18N[ruleForm.status] : '--'" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isEdit" :gutter="24">
        <el-col :span="12">
          <el-form-item label="文件大小">
            <el-input :model-value="formatFileSize(ruleForm.fileSize)" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="校验值">
            <el-input :model-value="ruleForm.checksum || '--'" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="更新日志" prop="changelog">
            <el-input v-model="ruleForm.changelog" type="textarea" :rows="4" maxlength="500" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" @click="handleSubmitForm(ruleFormRef)">确定</el-button>
    </template>
  </el-dialog>
</template>
