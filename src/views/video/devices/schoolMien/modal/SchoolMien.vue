<script setup lang="ts">
import type { SchoolMien } from "@/api/interface";
import type { UploadUserFile } from "element-plus";
import type { TSchoolMienForm, TSchoolMienRow } from "../types";

import { computed, nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
import { postCreateSchoolMienApi, putUpdateSchoolMienApi } from "@/api/modules";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";
import UploadVideo from "@/components/Upload/Video.vue";
import { ANNOUNCEMENT_STATUS, ANNOUNCEMENT_STATUS_OPTIONS } from "@/config/modules";
import { useAssetsPath } from "@/hooks/useAssetsPath";
import { useSchool } from "@/hooks/useSchool";

const { schoolId, schoolName: storeSchoolName } = useSchool();
const { getUploadPath } = useAssetsPath();
const currentSchoolName = ref("");

const emit = defineEmits(["submit"]);

/** 弹窗显示状态 */
const visible = ref(false);
/** 加载状态 */
const loading = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "Add",
  showConfirm: true
});

/** 表单引用 */
const ruleFormRef = ref();
/** 表单数据 */
const ruleForm = ref<TSchoolMienForm>(getInitialFormData());
/** 图片列表 */
const imageFileList = ref<UploadUserFile[]>([]);

/** 表单校验规则 */
const rules = {
  content: [{ required: true, message: "请输入内容", trigger: "blur" }]
};

/** 是否新增 */
const isAdd = computed(() => parameter.value.type === "Add");
/** 是否编辑 */
const isEdit = computed(() => parameter.value.type === "Edit");
/** 是否查看 */
const isView = computed(() => parameter.value.type === "View");

/** 获取表单初始值 */
function getInitialFormData(): TSchoolMienForm {
  return {
    schoolId: undefined,
    content: "",
    images: [],
    videoUrl: "",
    sort: undefined,
    status: ANNOUNCEMENT_STATUS.PUBLISHED
  };
}
/** 同步图片文件列表 */
function syncImageFileList(images: string[] = []) {
  imageFileList.value = images.map((url, index) => ({
    name: `图片${index + 1}`,
    url
  }));
}
/** 格式化图片 */
function formatImages() {
  return imageFileList.value.map(file => getUploadPath(file.url ?? "")).filter(Boolean) as string[];
}
/** 获取提交数据 */
function getSubmitPayload(): SchoolMien.ReqPutSchoolMienApi {
  return {
    content: ruleForm.value.content,
    images: formatImages(),
    videoUrl: ruleForm.value.videoUrl ? getUploadPath(ruleForm.value.videoUrl) : undefined,
    sort: ruleForm.value.sort ?? undefined
  };
}

/** 创建校园风采 */
async function axiosPostCreateSchoolMienApi(payload: SchoolMien.ReqPostSchoolMienApi) {
  try {
    const result = await postCreateSchoolMienApi(payload);
    if (result.code === 0) {
      ElMessage.success("添加成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostCreateSchoolMienApi:", error);
    return { code: -1, data: null };
  }
}
/** 更新校园风采 */
async function axiosPutUpdateSchoolMienApi(id: number, payload: SchoolMien.ReqPutSchoolMienApi) {
  try {
    const result = await putUpdateSchoolMienApi(id, payload);
    if (result.code === 0) {
      ElMessage.success("编辑成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutUpdateSchoolMienApi:", error);
    return { code: -1, data: null };
  }
}

/** 提交表单 */
async function handleSubmitForm(formEl: any) {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;

    try {
      const payload = getSubmitPayload();
      if (isAdd.value) {
        const result = await axiosPostCreateSchoolMienApi({
          schoolId: Number(ruleForm.value.schoolId ?? schoolId.value),
          status: ruleForm.value.status ?? ANNOUNCEMENT_STATUS.PUBLISHED,
          ...payload
        });
        if (result.code !== 0) return;
      } else if (isEdit.value && ruleForm.value.id) {
        const result = await axiosPutUpdateSchoolMienApi(ruleForm.value.id, payload);
        if (result.code !== 0) return;
      }
      visible.value = false;
      emit("submit");
    } catch (error) {
      console.error("handleSubmitForm:", error);
    }
  });
}
/** 关闭弹窗 */
function handleClose() {
  visible.value = false;
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: TSchoolMienRow) {
  parameter.value = { ...parameter.value, ...params };

  if (isAdd.value) {
    ruleForm.value = {
      ...getInitialFormData(),
      schoolId: Number(schoolId.value)
    };
    imageFileList.value = [];
    currentSchoolName.value = storeSchoolName.value;
  } else if ((isEdit.value || isView.value) && row?.id) {
    ruleForm.value = {
      id: row.id,
      schoolId: row.schoolId,
      content: row.content ?? "",
      images: row.images ?? [],
      videoUrl: row.videoUrl ?? "",
      sort: row.sort ?? undefined,
      status: row.status ?? ANNOUNCEMENT_STATUS.PUBLISHED
    };
    syncImageFileList(row.images ?? []);
    currentSchoolName.value = row.schoolName ?? storeSchoolName.value;
  }

  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="parameter.title"
    width="760px"
    destroy-on-close
    draggable
    align-center
  >
    <div v-loading="loading" class="space-y-4">
      <SchoolInfo :name="currentSchoolName" />

      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <el-input
                v-model="ruleForm.content"
                type="textarea"
                :rows="4"
                maxlength="1000"
                show-word-limit
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="图片">
              <UploadImgs v-model:file-list="imageFileList" :limit="9" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频">
              <UploadVideo v-model="ruleForm.videoUrl" :file-type="['video/mp4']" height="120px" width="100%">
                <template #tip>
                  <div class="text-xs text-gray-500">仅支持 mp4 格式视频</div>
                </template>
              </UploadVideo>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="排序权重">
              <el-input-number v-model="ruleForm.sort" class="w-full" :min="0" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="ruleForm.status" class="w-full" placeholder="请选择状态" :disabled="isEdit || isView">
                <el-option
                  v-for="item in ANNOUNCEMENT_STATUS_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="loading" @click="handleSubmitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
