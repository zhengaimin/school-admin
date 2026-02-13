<script setup lang="ts">
import type { Announcement, Class, Grade } from "@/api/interface";
import type { UploadUserFile, TransferDataItem } from "element-plus";
import type { AnnouncementForm, AnnouncementRow, OptionItem, TargetForm, TransferOption } from "../types";

import { ref, computed, nextTick, watch } from "vue";
import { ElMessage } from "element-plus";
import {
  ANNOUNCEMENT_AUDIENCE,
  ANNOUNCEMENT_AUDIENCE_OPTIONS,
  ANNOUNCEMENT_SCOPE,
  ANNOUNCEMENT_SCOPE_I18N,
  ANNOUNCEMENT_SCOPE_OPTIONS
} from "@/config/modules";
import {
  getAnnouncementDetailApi,
  postCreateAnnouncementApi,
  putUpdateAnnouncementApi,
  getGradesApi,
  getClassesListApi
} from "@/api/modules";
import { useSchool } from "@/hooks/useSchool";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";

const { schoolId, schoolName: storeSchoolName } = useSchool();
const currentSchoolName = ref("");

const emits = defineEmits(["submit"]);

const visible = ref(false);
const loading = ref(false);
const parameter = ref<TModalParams>({
  title: "",
  type: "Add",
  showConfirm: true
});

const ruleFormRef = ref();
const ruleForm = ref<AnnouncementForm>({
  title: "",
  content: "",
  images: [],
  targets: []
});

const imageFileList = ref<UploadUserFile[]>([]);
const gradeOptions = ref<OptionItem[]>([]);
const classOptions = ref<OptionItem[]>([]);

const isAdd = computed(() => parameter.value.type === "Add");
const isEdit = computed(() => parameter.value.type === "Edit");
const isView = computed(() => parameter.value.type === "View");
const gradeTransferOptions = computed<TransferOption[]>(() => {
  return gradeOptions.value.map(item => ({
    key: item.value,
    label: item.label
  }));
});
const classTransferOptions = computed<TransferOption[]>(() => {
  return classOptions.value.map(item => ({
    key: item.value,
    label: item.label
  }));
});

const rules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入正文", trigger: "blur" }]
};

const getInitialFormData = (): AnnouncementForm => ({
  title: "",
  content: "",
  images: [],
  targets: [
    {
      audienceType: ANNOUNCEMENT_AUDIENCE.PARENT,
      scopeType: ANNOUNCEMENT_SCOPE.SCHOOL_ALL,
      scopeId: 0,
      scopeIds: []
    }
  ]
});

const syncImageFileList = (images: string[] = []) => {
  imageFileList.value = images.map((url, index) => ({
    name: `图片${index + 1}`,
    url
  }));
};

const getScopeTransferOptions = (scopeType?: Announcement.IAnnouncementTarget["scopeType"]) => {
  if (scopeType === ANNOUNCEMENT_SCOPE.CLASS) return classTransferOptions.value;
  if (scopeType === ANNOUNCEMENT_SCOPE.GRADE) return gradeTransferOptions.value;
  return [];
};

const getScopeTransferTitles = (scopeType?: Announcement.IAnnouncementTarget["scopeType"]) => {
  const scopeName = scopeType ? ANNOUNCEMENT_SCOPE_I18N[scopeType] : "范围";
  return [`可选${scopeName}`, `已选${scopeName}`] as [string, string];
};

const filterTransferOption = (query: string, option: TransferDataItem) => {
  if (!query) return true;
  const label = String(option.label ?? "");
  return label.toLowerCase().includes(query.toLowerCase());
};

const normalizeScopeIds = (scopeIds: Array<string | number>) => {
  const normalized = scopeIds.map(id => Number(id)).filter(id => Number.isFinite(id) && id > 0);
  return Array.from(new Set(normalized));
};

const mergeTargetsForTransfer = (targets: Announcement.IAnnouncementTarget[] = []) => {
  const map = new Map<string, TargetForm>();
  targets.forEach(item => {
    const key = `${item.audienceType}-${item.scopeType}`;
    if (item.scopeType === ANNOUNCEMENT_SCOPE.SCHOOL_ALL) {
      map.set(key, {
        audienceType: item.audienceType,
        scopeType: item.scopeType,
        scopeId: 0,
        scopeIds: []
      });
      return;
    }
    const existing = map.get(key) ?? {
      audienceType: item.audienceType,
      scopeType: item.scopeType,
      scopeIds: []
    };
    const nextIds = normalizeScopeIds([...(existing.scopeIds ?? []), item.scopeId]);
    existing.scopeIds = nextIds;
    map.set(key, existing);
  });
  return Array.from(map.values());
};

const handleScopeTypeChange = (target: TargetForm) => {
  if (target.scopeType === ANNOUNCEMENT_SCOPE.SCHOOL_ALL) {
    target.scopeId = 0;
    target.scopeIds = [];
    return;
  }
  target.scopeId = undefined;
  target.scopeIds = [];
};

const formatTargets = (targets: TargetForm[]) => {
  return targets.flatMap(item => {
    const audienceType = item.audienceType!;
    const scopeType = item.scopeType!;
    if (scopeType === ANNOUNCEMENT_SCOPE.SCHOOL_ALL) {
      return [
        {
          audienceType,
          scopeType,
          scopeId: 0
        }
      ];
    }
    const fallbackIds = item.scopeId ? [item.scopeId] : [];
    const scopeIds = normalizeScopeIds(item.scopeIds?.length ? item.scopeIds : fallbackIds);
    return scopeIds.map(id => ({
      audienceType,
      scopeType,
      scopeId: id
    }));
  });
};

const formatImages = () => {
  return imageFileList.value.map(file => file.url).filter(Boolean) as string[];
};

async function axiosGetAnnouncementDetailApi(id: number) {
  try {
    return await getAnnouncementDetailApi(id);
  } catch (error) {
    console.error("axiosGetAnnouncementDetailApi:", error);
    return { code: -1, data: null };
  }
}

async function axiosPostCreateAnnouncementApi(payload: Announcement.ReqPostAnnouncementApi) {
  try {
    const result = await postCreateAnnouncementApi(payload);
    if (result.code === 0) {
      ElMessage.success("添加成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostCreateAnnouncementApi:", error);
    return { code: -1, data: null };
  }
}

async function axiosPutUpdateAnnouncementApi(id: number, payload: Announcement.ReqPutAnnouncementApi) {
  try {
    const result = await putUpdateAnnouncementApi(id, payload);
    if (result.code === 0) {
      ElMessage.success("编辑成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutUpdateAnnouncementApi:", error);
    return { code: -1, data: null };
  }
}

async function axiosGetGradeOptions(targetSchoolId?: number) {
  try {
    const result = await getGradesApi({ schoolId: targetSchoolId ?? Number(schoolId.value), page: 1, pageSize: 200 });
    if (result.code === 0) {
      const options = (result.data?.list || []).map((item: Grade.IGradeItemVo) => ({
        label: item.name,
        value: item.id
      }));
      gradeOptions.value.splice(0, gradeOptions.value.length, ...options);
    }
  } catch (error) {
    console.error("axiosGetGradeOptions:", error);
  }
}

async function axiosGetClassOptions(targetSchoolId?: number) {
  try {
    const result = await getClassesListApi({ schoolId: targetSchoolId ?? Number(schoolId.value), page: 1, pageSize: 200 });
    if (result.code === 0) {
      const options = (result.data?.list || []).map((item: Class.IClassItemVo) => ({
        label: item.gradeName ? `${item.gradeName}-${item.name}` : item.name,
        value: item.id
      }));
      classOptions.value.splice(0, classOptions.value.length, ...options);
    }
  } catch (error) {
    console.error("axiosGetClassOptions:", error);
  }
}

const loadScopeOptions = async (targetSchoolId?: number) => {
  gradeOptions.value.length = 0;
  classOptions.value.length = 0;
  await Promise.all([axiosGetGradeOptions(targetSchoolId), axiosGetClassOptions(targetSchoolId)]);
};

const handleSubmitForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean) => {
    if (!valid) return;

    if (!ruleForm.value.targets.length) {
      ElMessage.warning("请至少添加一个投放范围");
      return;
    }

    loading.value = true;
    try {
      const basePayload = {
        title: ruleForm.value.title,
        content: ruleForm.value.content,
        images: formatImages(),
        targets: formatTargets(ruleForm.value.targets)
      };

      if (isAdd.value) {
        const result = await axiosPostCreateAnnouncementApi({
          schoolId: Number(ruleForm.value.schoolId ?? schoolId.value),
          ...basePayload
        });
        if (result.code !== 0) return;
      } else if (isEdit.value && ruleForm.value.id) {
        const result = await axiosPutUpdateAnnouncementApi(ruleForm.value.id, basePayload);
        if (result.code !== 0) return;
      }

      visible.value = false;
      emits("submit");
    } catch (error) {
      console.error("提交失败", error);
    } finally {
      loading.value = false;
    }
  });
};

const acceptParams = async (params: TModalParams, row?: AnnouncementRow) => {
  parameter.value = { ...parameter.value, ...params };

  if (isAdd.value) {
    ruleForm.value = {
      ...getInitialFormData(),
      schoolId: Number(schoolId.value)
    };
    imageFileList.value = [];
    currentSchoolName.value = storeSchoolName.value;
    await loadScopeOptions(Number(schoolId.value));
  } else if ((isEdit.value || isView.value) && row?.id) {
    ruleForm.value = getInitialFormData();
    imageFileList.value = [];
    currentSchoolName.value = row.schoolName ?? "";
    loading.value = true;
    const result = await axiosGetAnnouncementDetailApi(row.id);
    if (result.code === 0 && result.data) {
      const detail = result.data;
      const mergedTargets = mergeTargetsForTransfer(detail.targets ?? []);
      ruleForm.value = {
        id: detail.id,
        schoolId: detail.schoolId,
        title: detail.title,
        content: detail.content,
        images: detail.images ?? [],
        targets: mergedTargets.length ? mergedTargets : getInitialFormData().targets
      };
      syncImageFileList(detail.images ?? []);
      currentSchoolName.value = detail.schoolName ?? row.schoolName ?? "";
      await loadScopeOptions(detail.schoolId);
    }
    loading.value = false;
  }

  visible.value = true;
  nextTick(() => ruleFormRef.value?.clearValidate());
};

watch(
  schoolId,
  async value => {
    if (!visible.value || !isAdd.value) return;
    currentSchoolName.value = storeSchoolName.value;
    await loadScopeOptions(Number(value));
  },
  { immediate: false }
);

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="800px" destroy-on-close draggable align-center>
    <div v-loading="loading" class="space-y-4">
      <SchoolInfo :name="currentSchoolName" />

      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :disabled="isView" label-position="top">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input v-model="ruleForm.title" placeholder="请输入标题" maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="正文" prop="content">
              <el-input
                v-model="ruleForm.content"
                type="textarea"
                :rows="5"
                placeholder="请输入正文内容"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="图片">
              <UploadImgs v-model:file-list="imageFileList" :limit="6" :drag="false" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-600">投放规则</span>
            </div>
          </el-col>
        </el-row>

        <el-row v-for="(target, index) in ruleForm.targets" :key="index" :gutter="24">
          <el-col :span="12">
            <el-form-item
              :label="`通知对象`"
              :prop="`targets.${index}.audienceType`"
              :rules="[{ required: true, message: '请选择通知对象', trigger: 'change' }]"
            >
              <el-select v-model="target.audienceType" placeholder="请选择通知对象" class="w-full">
                <el-option
                  v-for="item in ANNOUNCEMENT_AUDIENCE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              :label="`范围类型`"
              :prop="`targets.${index}.scopeType`"
              :rules="[{ required: true, message: '请选择范围类型', trigger: 'change' }]"
            >
              <el-select
                v-model="target.scopeType"
                placeholder="请选择范围类型"
                class="w-full"
                @change="() => handleScopeTypeChange(target)"
              >
                <el-option v-for="item in ANNOUNCEMENT_SCOPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              v-if="target.scopeType !== ANNOUNCEMENT_SCOPE.SCHOOL_ALL"
              :label="`范围`"
              :prop="`targets.${index}.scopeIds`"
              :rules="[{ required: true, type: 'array', message: '请选择范围', trigger: 'change' }]"
            >
              <el-transfer
                v-model="target.scopeIds"
                :data="getScopeTransferOptions(target.scopeType)"
                :titles="getScopeTransferTitles(target.scopeType)"
                filterable
                :filter-method="filterTransferOption"
                filter-placeholder="搜索范围"
                class="w-full"
              />
            </el-form-item>
            <el-form-item v-else label="范围">
              <el-input value="全校" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="loading" @click="handleSubmitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
:deep(.el-transfer) {
  display: flex;
  width: 100%;
}
:deep(.el-transfer-panel) {
  flex: 1;
  width: 0;
  min-width: 0;
}
:deep(.el-transfer__buttons) {
  flex: 0 0 auto;
  align-self: center;
}
</style>
