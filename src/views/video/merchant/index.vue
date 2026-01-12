<script setup lang="ts" name="videoMerchant">
import type { FormInstance, FormRules } from "element-plus";

import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import UploadFile from "@/components/Upload/File.vue";
import { useSchool } from "@/hooks/useSchool";
import { useUserStore } from "@/stores/modules/user";
import { getMerchantConfigApi, putMerchantConfigApi } from "@/api/modules";
import { DEVICE_TYPE } from "@/config/modules";

const { guardSchool } = useSchool();
const userStore = useUserStore();

const formRef = ref<FormInstance>();
const loading = ref(false);
const submitting = ref(false);
const hasData = ref(false);

const tenantId = computed(() => userStore.userInfo?.tenantId || 0);

const form = ref({
  deviceType: DEVICE_TYPE.VIDEO,
  merchantId: "",
  merchantSecret: "",
  remark: ""
});

const certFileUrl = ref("");
const keyFileUrl = ref("");
const certFile = ref<File | null>(null);
const keyFile = ref<File | null>(null);

const rules: FormRules = {
  merchantId: [{ required: true, message: "请输入微信商户号", trigger: "blur" }],
  merchantSecret: [{ required: true, message: "请输入微信商户密钥", trigger: "blur" }]
};

const handleCertFileUpload = async (file: File) => {
  certFile.value = file;
  ElMessage.success(`已选择证书文件: ${file.name}`);
  return {
    fileUrl: `temp://${file.name}`,
    fileName: file.name,
    fileSize: file.size,
    fileType: "other" as const,
    fileHash: "",
    originalName: file.name,
    uploadTime: new Date().toISOString()
  };
};

const handleKeyFileUpload = async (file: File) => {
  keyFile.value = file;
  ElMessage.success(`已选择密钥文件: ${file.name}`);
  return {
    fileUrl: `temp://${file.name}`,
    fileName: file.name,
    fileSize: file.size,
    fileType: "other" as const,
    fileHash: "",
    originalName: file.name,
    uploadTime: new Date().toISOString()
  };
};

const axiosGetMerchantConfig = async (): Promise<void> => {
  if (!tenantId.value) return;

  loading.value = true;
  try {
    const result = await getMerchantConfigApi(tenantId.value, DEVICE_TYPE.VIDEO);
    const data = result?.data;
    if (data) {
      hasData.value = true;
      form.value.merchantId = data.merchantId || "";
      form.value.merchantSecret = data.merchantSecret || "";
      form.value.remark = data.remark || "";
      certFileUrl.value = data.certFileName ? `已上传: ${data.certFileName}` : "";
      keyFileUrl.value = data.keyFileName ? `已上传: ${data.keyFileName}` : "";
    } else {
      hasData.value = true;
      handleReset();
    }
  } catch {
    hasData.value = true;
    handleReset();
  } finally {
    loading.value = false;
  }
};

const handleReset = (): void => {
  form.value.deviceType = DEVICE_TYPE.VIDEO;
  form.value.merchantId = "";
  form.value.merchantSecret = "";
  form.value.remark = "";
  certFileUrl.value = "";
  keyFileUrl.value = "";
  certFile.value = null;
  keyFile.value = null;
  formRef.value?.clearValidate();
};

const handleSubmit = async (): Promise<void> => {
  if (submitting.value) return;
  if (!guardSchool()) return;

  const formEl = formRef.value;
  if (!formEl) return;

  const isValid = await formEl.validate().catch(() => false);
  if (!isValid) return;

  submitting.value = true;
  try {
    await putMerchantConfigApi(tenantId.value, {
      deviceType: form.value.deviceType,
      merchantId: form.value.merchantId,
      merchantSecret: form.value.merchantSecret,
      remark: form.value.remark,
      certFile: certFile.value || undefined,
      keyFile: keyFile.value || undefined
    });

    ElMessage.success("保存成功");
    certFile.value = null;
    keyFile.value = null;
    axiosGetMerchantConfig();
  } catch (error: any) {
    ElMessage.error(error?.msg || error?.message || "保存失败，请重试");
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  axiosGetMerchantConfig();
});
</script>

<template>
  <div class="h-full flex flex-col rounded-lg overflow-hidden">
    <el-card v-loading="loading" shadow="never" class="flex-1 flex flex-col">
      <template #header>
        <div class="flex items-center justify-between">
          <span>商户号配置</span>
        </div>
      </template>

      <template v-if="hasData">
        <div class="flex-1 overflow-y-auto p-4">
          <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="微信商户号" prop="merchantId">
                  <el-input v-model="form.merchantId" placeholder="请输入微信商户号" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="微信商户密钥" prop="merchantSecret">
                  <el-input
                    v-model="form.merchantSecret"
                    type="password"
                    placeholder="请输入微信商户密钥"
                    show-password
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="API证书文件（apiclient_cert.pem格式）">
                  <UploadFile
                    v-model="certFileUrl"
                    :api="handleCertFileUpload"
                    :file-type="['.pem']"
                    :drag="true"
                    height="120px"
                    width="100%"
                  >
                    <template #tip>
                      <div class="text-xs text-gray-500">仅支持 .pem 格式文件，可拖拽上传</div>
                    </template>
                  </UploadFile>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="API密钥文件（apiclient_key.pem格式）">
                  <UploadFile
                    v-model="keyFileUrl"
                    :api="handleKeyFileUpload"
                    :file-type="['.pem']"
                    :drag="true"
                    height="120px"
                    width="100%"
                  >
                    <template #tip>
                      <div class="text-xs text-gray-500">仅支持 .pem 格式文件，可拖拽上传</div>
                    </template>
                  </UploadFile>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input
                    v-model="form.remark"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入备注"
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <div class="px-4 pb-4">
          <div class="flex justify-end pt-4 border-t border-gray-200 gap-3">
            <el-button @click="handleReset">重置</el-button>
            <el-button class="ml-[0]!" type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
          </div>
        </div>
      </template>

      <template v-else>
        <el-empty description="暂无数据" />
      </template>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
:deep(.el-card__body) {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}
</style>
