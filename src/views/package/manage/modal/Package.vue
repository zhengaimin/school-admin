<script setup lang="ts">
import type { PlatformPackage } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { computed, nextTick, reactive, ref } from "vue";
import { ElMessage } from "element-plus";

import {
  createPlatformPackageApi,
  updatePlatformPackageApi,
  getPlatformPackageDetailApi,
  getPlatformPackageModulesApi,
  getSchoolsListApi
} from "@/api/modules";
import WangEditor from "@/components/WangEditor/index.vue";
import { useUserStore } from "@/stores/modules/user";

/** 计费模块（带每月赠送时长） */
const QUOTA_MODULE_KEYS = ["phone_call", "dryer"] as const;
/** 计费模块赠送时长字段文案 */
const QUOTA_MODULE_LABEL: Record<string, string> = {
  phone_call: "每月赠送话机时长（分钟）",
  dryer: "每月赠送吹风机时长（分钟）"
};

const userStore = useUserStore();

const emit = defineEmits(["submit"]);

/** 弹窗可见 */
const visible = ref(false);
/** 提交加载 */
const submitLoading = ref(false);
/** 学校选项加载 */
const schoolOptionsLoading = ref(false);
/** 表单实例 */
const ruleFormRef = ref<FormInstance>();
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "Add",
  showConfirm: false
});
/** 当前编辑行 */
const currentRow = ref<PlatformPackage.Item>();
/** 学校选项 */
const schoolOptions = ref<{ id: number; name?: string }[]>([]);
/** 功能模块选项 */
const moduleOptions = ref<PlatformPackage.ModuleOption[]>([]);
/** 选中的功能模块 key */
const selectedModuleKeys = ref<string[]>([]);
/** 计费模块每月赠送时长（moduleKey -> minutes） */
const moduleQuotaMap = reactive<Record<string, number | undefined>>({});
/** 有效期范围 */
const dateRange = ref<[string, string] | null>(null);

/** 表单数据 */
const ruleForm = reactive<{
  name: string;
  schoolIds: number[];
  pricingMode: string;
  monthlyPrice?: number;
  description: string;
}>({
  name: "",
  schoolIds: [],
  pricingMode: "DECREASING",
  monthlyPrice: undefined,
  description: ""
});

/** 是否新增 */
const isAdd = computed(() => parameter.value.type === "Add");

/** 模块勾选校验 */
function validateModules(_rule: any, _value: any, callback: (error?: Error) => void) {
  if (selectedModuleKeys.value.length === 0) {
    callback(new Error("请至少选择 1 个功能模块"));
    return;
  }
  callback();
}

/** 表单校验规则 */
const rules: FormRules = {
  name: [{ required: true, message: "请输入套餐名称", trigger: "blur" }],
  schoolIds: [{ required: true, type: "array", min: 1, message: "请选择适用学校", trigger: "change" }],
  dateRange: [{ required: true, message: "请选择有效期", trigger: "change" }],
  pricingMode: [{ required: true, message: "请选择定价模式", trigger: "change" }],
  monthlyPrice: [{ required: true, message: "请输入月单价", trigger: "blur" }],
  modules: [{ validator: validateModules, trigger: "change" }]
};

/** 剩余月数（有效期止月 - 当前月 + 1） */
const remainingMonths = computed(() => {
  if (!dateRange.value) return 0;
  const end = new Date(dateRange.value[1]);
  const now = new Date();
  const months = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth()) + 1;
  return Math.max(months, 0);
});

/** 总月数（有效期止月 - 起月 + 1） */
const totalMonths = computed(() => {
  if (!dateRange.value) return 0;
  const start = new Date(dateRange.value[0]);
  const end = new Date(dateRange.value[1]);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
  return Math.max(months, 0);
});

/** 价格联动展示文案 */
const priceHint = computed(() => {
  const price = ruleForm.monthlyPrice;
  if (!price || !dateRange.value) return "";
  if (ruleForm.pricingMode === "DECREASING") {
    return `本月购买价 = ${price} × ${remainingMonths.value} = ${price * remainingMonths.value} 元`;
  }
  return `总价 = ${price} × ${totalMonths.value} = ${price * totalMonths.value} 元`;
});

/** 是否为计费模块 */
function isQuotaModule(moduleKey: string) {
  return (QUOTA_MODULE_KEYS as readonly string[]).includes(moduleKey);
}

/** 获取学校选项 */
async function fetchSchoolOptions() {
  schoolOptionsLoading.value = true;
  try {
    const result = await getSchoolsListApi(
      {
        page: 1,
        pageSize: 100,
        status: -1,
        tenantId: userStore.currentTenant?.tenantId || userStore.userInfo?.tenantId || undefined
      },
      { loading: false }
    );
    if (result.code !== 0) {
      schoolOptions.value = [];
      return;
    }
    schoolOptions.value = result.data?.list || [];
  } catch (error) {
    console.error("fetchSchoolOptions:", error);
    schoolOptions.value = [];
  } finally {
    schoolOptionsLoading.value = false;
  }
}

/** 获取功能模块选项 */
async function fetchModuleOptions() {
  try {
    const result = await getPlatformPackageModulesApi();
    if (result.code !== 0) return;
    moduleOptions.value = result.data?.list || [];
  } catch (error) {
    console.error("fetchModuleOptions:", error);
    moduleOptions.value = [];
  }
}

/** 重置表单数据 */
function resetForm() {
  ruleForm.name = "";
  ruleForm.schoolIds = [];
  ruleForm.pricingMode = "DECREASING";
  ruleForm.monthlyPrice = undefined;
  ruleForm.description = "";
  dateRange.value = null;
  selectedModuleKeys.value = [];
  Object.keys(moduleQuotaMap).forEach(key => delete moduleQuotaMap[key]);
}

/** 用套餐详情回填表单 */
function fillFormFromDetail(detail: PlatformPackage.Detail) {
  ruleForm.name = detail.name;
  ruleForm.schoolIds = detail.schoolIds || [];
  ruleForm.pricingMode = detail.pricingMode;
  ruleForm.monthlyPrice = detail.monthlyPrice;
  ruleForm.description = detail.description || "";
  dateRange.value = detail.startDate && detail.endDate ? [detail.startDate, detail.endDate] : null;
  selectedModuleKeys.value = (detail.modules || []).map(item => item.moduleKey);
  Object.keys(moduleQuotaMap).forEach(key => delete moduleQuotaMap[key]);
  (detail.modules || []).forEach(item => {
    if (isQuotaModule(item.moduleKey)) {
      moduleQuotaMap[item.moduleKey] = item.monthlyGiftMinutes;
    }
  });
}

/** 提交表单 */
async function handleSubmitForm(formEl: FormInstance | undefined) {
  if (!formEl || submitLoading.value) return;
  const valid = await formEl.validate().catch(() => false);
  if (!valid) return;

  const data: PlatformPackage.SaveParams = {
    name: ruleForm.name,
    schoolIds: ruleForm.schoolIds,
    modules: selectedModuleKeys.value.map(moduleKey =>
      isQuotaModule(moduleKey) ? { moduleKey, monthlyGiftMinutes: moduleQuotaMap[moduleKey] } : { moduleKey }
    ),
    pricingMode: ruleForm.pricingMode,
    monthlyPrice: ruleForm.monthlyPrice as number,
    startDate: dateRange.value?.[0] || "",
    endDate: dateRange.value?.[1] || "",
    description: ruleForm.description
  };

  submitLoading.value = true;
  try {
    const result = isAdd.value
      ? await createPlatformPackageApi(data)
      : await updatePlatformPackageApi((currentRow.value as PlatformPackage.Item).id, data);
    if (result.code !== 0) return;
    ElMessage.success(isAdd.value ? "新增成功" : "编辑成功");
    visible.value = false;
    emit("submit");
  } catch (error) {
    console.error("handleSubmitForm:", error);
  } finally {
    submitLoading.value = false;
  }
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: PlatformPackage.Item) {
  parameter.value = { ...parameter.value, ...params };
  currentRow.value = row;

  resetForm();
  await Promise.all([fetchSchoolOptions(), fetchModuleOptions()]);

  if (!isAdd.value && row?.id) {
    try {
      const result = await getPlatformPackageDetailApi(row.id);
      if (result.code === 0 && result.data) {
        fillFormFromDetail(result.data);
      }
    } catch (error) {
      console.error("getPlatformPackageDetailApi:", error);
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
  <el-dialog v-model="visible" :close-on-click-modal="false" :title="parameter.title" width="760px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="套餐名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入套餐名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="适用学校" prop="schoolIds">
            <el-select
              v-model="ruleForm.schoolIds"
              class="w-full"
              multiple
              filterable
              collapse-tags
              collapse-tags-tooltip
              :loading="schoolOptionsLoading"
              placeholder="请选择适用学校"
            >
              <el-option v-for="item in schoolOptions" :key="item.id" :label="item.name || ''" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="有效期" prop="dateRange">
            <el-date-picker
              v-model="dateRange"
              class="w-full"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="定价模式" prop="pricingMode">
            <el-select v-model="ruleForm.pricingMode" class="w-full" placeholder="请选择定价模式">
              <el-option label="按月递减" value="DECREASING" />
              <el-option label="固定总价" value="FIXED_TOTAL" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="月单价（元）" prop="monthlyPrice">
            <el-input-number v-model="ruleForm.monthlyPrice" class="w-full" :min="1" :precision="0" placeholder="请输入月单价" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格预览">
            <span>{{ priceHint || "--" }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="包含功能模块" prop="modules">
            <el-checkbox-group v-model="selectedModuleKeys">
              <el-checkbox v-for="item in moduleOptions" :key="item.moduleKey" :value="item.moduleKey" :label="item.moduleKey">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>

        <el-col v-for="key in QUOTA_MODULE_KEYS" :key="key" :span="12">
          <el-form-item v-if="selectedModuleKeys.includes(key)" :label="QUOTA_MODULE_LABEL[key]">
            <el-input-number v-model="moduleQuotaMap[key]" class="w-full" :min="0" :precision="0" placeholder="请输入赠送时长" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="套餐说明" prop="description">
            <WangEditor v-model:value="ruleForm.description" height="300px" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="parameter.showConfirm" type="primary" :loading="submitLoading" @click="handleSubmitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
