<script setup lang="ts" name="familyContactManage">
import type { FamilyContact, ResultData } from "@/api/interface";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { FormInstance, FormRules } from "element-plus";

import { computed, nextTick, reactive, ref, watch } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import {
  deleteFamilyContactApi,
  getFamilyContactDetailApi,
  getFamilyContactRelationshipOptionsApi,
  getFamilyContactsApi,
  postCreateFamilyContactApi,
  putFamilyContactPrimaryApi,
  putUpdateFamilyContactApi
} from "@/api/modules";
import { useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import {
  buildFamilyContactListParams,
  buildFamilyContactPrimaryPayload,
  buildPostFamilyContactPayload,
  buildPutFamilyContactPayload
} from "./utils/payload";

const { schoolId } = useSchool();
const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: axiosGetFamilyContactsListApi });

const formRef = ref<FormInstance>();
const dialogVisible = ref(false);
const formMode = ref<"Add" | "Edit">("Add");
const relationshipOptions = ref<FamilyContact.IFamilyContactRelationshipOptionVo[]>([]);

const isPrimaryFilterOptions = [
  { label: "全部", value: -1 },
  { label: "主联系人", value: 1 },
  { label: "非主联系人", value: 0 }
];

const formData = reactive<Partial<FamilyContact.ReqPostFamilyContactApi> & { id?: number }>({
  id: undefined,
  studentId: undefined,
  relationship: undefined,
  nickname: "",
  phone: "",
  isPrimary: false,
  sortOrder: 1
});

const formTitle = computed(() => (formMode.value === "Add" ? "新增亲情号" : "编辑亲情号"));

const formRules: FormRules = {
  studentId: [{ required: true, message: "请输入学生ID", trigger: "blur" }],
  relationship: [{ required: true, message: "请选择称谓", trigger: "change" }],
  nickname: [{ required: true, message: "请输入别称", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" }
  ],
  sortOrder: [{ required: true, message: "请输入排序值", trigger: "blur" }]
};

const columns: ColumnProps<FamilyContact.IFamilyContactItemVo>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "id", label: "ID", width: 80 },
  {
    prop: "studentId",
    label: "学生ID",
    minWidth: 100,
    search: { el: "input", props: { placeholder: "请输入学生ID" } }
  },
  { prop: "studentName", label: "学生姓名", minWidth: 120 },
  { prop: "studentCode", label: "学号", minWidth: 120 },
  { prop: "className", label: "班级", minWidth: 120 },
  { prop: "schoolName", label: "学校", minWidth: 140 },
  { prop: "relationshipName", label: "称谓", minWidth: 100 },
  { prop: "nickname", label: "别称", minWidth: 100 },
  {
    prop: "phone",
    label: "手机号",
    minWidth: 130,
    search: { el: "input", props: { placeholder: "请输入手机号" } }
  },
  { prop: "isPrimary", label: "主联系人", width: 100 },
  { prop: "sortOrder", label: "排序", width: 80 },
  { prop: "createdAt", label: "创建时间", minWidth: 160 },
  {
    prop: "relationshipFilter",
    label: "称谓筛选",
    isShow: false,
    enum: relationshipOptions,
    search: {
      el: "select",
      key: "relationship",
      props: { placeholder: "请选择称谓" }
    }
  },
  {
    prop: "isPrimaryFilter",
    label: "主联系人筛选",
    isShow: false,
    enum: isPrimaryFilterOptions,
    search: {
      el: "select",
      key: "isPrimary",
      defaultValue: -1,
      props: { placeholder: "全部联系人" }
    }
  },
  { prop: "operation", label: "操作", width: 220, fixed: "right" }
];

/** Reset form to default values. */
function resetForm() {
  formData.id = undefined;
  formData.studentId = undefined;
  formData.relationship = undefined;
  formData.nickname = "";
  formData.phone = "";
  formData.isPrimary = false;
  formData.sortOrder = 1;
}

/** Query family contacts list. */
async function axiosGetFamilyContactsListApi(
  params: Record<string, any>
): Promise<ResultData<FamilyContact.ResGetFamilyContactsApi>> {
  try {
    return await getFamilyContactsApi(buildFamilyContactListParams(params));
  } catch (error) {
    console.error("axiosGetFamilyContactsListApi:", error);
    return { code: -1, msg: "请求失败", data: { list: [], total: 0 } };
  }
}

/** Load relationship options. */
async function axiosGetRelationshipOptionsApi() {
  try {
    const result = await getFamilyContactRelationshipOptionsApi();
    if (result.code === 0) {
      relationshipOptions.value = result.data?.relationships || [];
      return;
    }
    relationshipOptions.value = [];
  } catch (error) {
    console.error("axiosGetRelationshipOptionsApi:", error);
    relationshipOptions.value = [];
  }
}

/** Load contact detail by id. */
async function axiosGetFamilyContactDetailApi(id: number) {
  try {
    const result = await getFamilyContactDetailApi(id);
    if (result.code === 0 && result.data) {
      Object.assign(formData, result.data);
    }
  } catch (error) {
    console.error("axiosGetFamilyContactDetailApi:", error);
  }
}

/** Open create dialog. */
function handleShowCreate() {
  formMode.value = "Add";
  dialogVisible.value = true;
  resetForm();
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

/** Open edit dialog. */
async function handleShowEdit(row: FamilyContact.IFamilyContactItemVo) {
  formMode.value = "Edit";
  dialogVisible.value = true;
  resetForm();
  formData.id = row.id;
  await axiosGetFamilyContactDetailApi(row.id);
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

/** Submit form for create or update. */
function handleSubmit(formEl?: FormInstance) {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;

    if (formMode.value === "Edit" && formData.id) {
      const result = await putUpdateFamilyContactApi(formData.id, buildPutFamilyContactPayload(formData));
      if (result.code !== 0) return;
      ElMessage.success("编辑成功");
    } else {
      const result = await postCreateFamilyContactApi(buildPostFamilyContactPayload(formData));
      if (result.code !== 0) return;
      ElMessage.success("新增成功");
    }

    dialogVisible.value = false;
    refreshTableList();
  });
}

/** Delete one row. */
function handleDelete(row: FamilyContact.IFamilyContactItemVo) {
  ElMessageBox.confirm(`确定删除联系人【${row.nickname || row.phone}】吗？`, "提示", {
    type: "warning"
  })
    .then(async () => {
      const result = await deleteFamilyContactApi(row.id);
      if (result.code !== 0) return;
      ElMessage.success("删除成功");
      refreshTableList();
    })
    .catch(() => {
      console.log("取消删除");
    });
}

/** Set current row as primary contact. */
function handleSetPrimary(row: FamilyContact.IFamilyContactItemVo) {
  if (row.isPrimary) return;
  ElMessageBox.confirm(`确定将【${row.nickname || row.phone}】设为主联系人吗？`, "提示", {
    type: "warning"
  })
    .then(async () => {
      const result = await putFamilyContactPrimaryApi(buildFamilyContactPrimaryPayload(row.id));
      if (result.code !== 0) return;
      ElMessage.success("设置主联系人成功");
      refreshTableList();
    })
    .catch(() => {
      console.log("取消设置主联系人");
    });
}

watch(schoolId, () => {
  refreshTableList();
});

void axiosGetRelationshipOptionsApi();
</script>

<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" table-header="亲情号管理">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowCreate">新增</el-button>
      </template>

      <template #isPrimary="{ row }">
        <el-tag :type="row.isPrimary ? 'success' : 'info'">
          {{ row.isPrimary ? "是" : "否" }}
        </el-tag>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowEdit(row)">编辑</el-button>
        <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        <el-button v-if="!row.isPrimary" type="warning" link @click="handleSetPrimary(row)">设为主联系人</el-button>
      </template>
    </ProTable>

    <el-dialog v-model="dialogVisible" :title="formTitle" width="640px" destroy-on-close draggable align-center>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学生ID" prop="studentId">
              <el-input v-model.number="formData.studentId" :disabled="formMode === 'Edit'" placeholder="请输入学生ID" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="称谓" prop="relationship">
              <el-select v-model="formData.relationship" class="w-full" placeholder="请选择称谓">
                <el-option v-for="item in relationshipOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="别称" prop="nickname">
              <el-input v-model="formData.nickname" placeholder="请输入别称" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" maxlength="11" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否主联系人" prop="isPrimary">
              <el-select v-model="formData.isPrimary" class="w-full" placeholder="请选择">
                <el-option label="是" :value="true" />
                <el-option label="否" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="排序值" prop="sortOrder">
              <el-input v-model.number="formData.sortOrder" placeholder="请输入排序值" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit(formRef)">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
