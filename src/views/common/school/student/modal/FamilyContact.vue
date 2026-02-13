<script setup lang="ts">
import type { FamilyContact, ResultData, Student } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { computed, nextTick, reactive, ref, unref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  deleteFamilyContactApi,
  getFamilyContactDetailApi,
  getFamilyContactRelationshipOptionsApi,
  getFamilyContactsApi,
  postCreateFamilyContactApi,
  putUpdateFamilyContactApi
} from "@/api/modules";
import { buildPostFamilyContactPayload, buildPutFamilyContactPayload } from "../utils/payload";

const visible = ref(false);
const formVisible = ref(false);
const formMode = ref<"Add" | "Edit">("Add");
const currentStudentId = ref<number>();
const parentFormRef = ref<FormInstance>();
const parentList = ref<FamilyContact.IFamilyContactItemVo[]>([]);
const relationshipOptions = ref<FamilyContact.IFamilyContactRelationshipOptionVo[]>([]);

const formTitle = computed(() => (formMode.value === "Add" ? "新增亲情号" : "编辑亲情号"));

const parentForm = reactive<Partial<FamilyContact.ReqPostFamilyContactApi> & { id?: number }>({
  studentId: undefined,
  relationship: undefined,
  nickname: "",
  phone: "",
  isPrimary: false,
  sortOrder: undefined
});

const parentRules: FormRules = {
  relationship: [{ required: true, message: "请选择关系", trigger: "change" }],
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  isPrimary: [{ type: "boolean", message: "请选择主联系人", trigger: "change" }]
};

/** 重置亲情号表单 */
function resetParentForm(studentId?: number) {
  parentForm.id = undefined;
  parentForm.studentId = studentId;
  parentForm.relationship = undefined;
  parentForm.nickname = "";
  parentForm.phone = "";
  parentForm.isPrimary = false;
  parentForm.sortOrder = undefined;
}

/** 获取亲情号列表 */
async function axiosGetFamilyContactListApi(studentId: number) {
  try {
    const result = await getFamilyContactsApi({ page: 1, pageSize: 150, studentId });
    if (result.code === 0) {
      parentList.value = result.data?.list || [];
    } else {
      parentList.value = [];
    }
  } catch (error) {
    console.error("axiosGetFamilyContactListApi:", error);
    parentList.value = [];
  }
}
/** 获取亲情号称谓选项 */
async function axiosGetFamilyContactRelationshipOptionsApi() {
  try {
    const result = await getFamilyContactRelationshipOptionsApi();
    if (result.code === 0) {
      relationshipOptions.value = result.data?.relationships || [];
    } else {
      relationshipOptions.value = [];
    }
  } catch (error) {
    console.error("axiosGetFamilyContactRelationshipOptionsApi:", error);
    relationshipOptions.value = [];
  }
}
/** 获取亲情号详情 */
async function axiosGetFamilyContactDetailApi(
  id: number
): Promise<ResultData<FamilyContact.ResGetFamilyContactDetailApi | null>> {
  try {
    const result = await getFamilyContactDetailApi(id);
    if (result.code === 0 && result.data) {
      Object.assign(parentForm, result.data);
    }
    return result;
  } catch (error) {
    console.error("axiosGetFamilyContactDetailApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}
/** 新增亲情号 */
async function axiosPostFamilyContactApi(
  form: Partial<FamilyContact.ReqPostFamilyContactApi>
): Promise<ResultData<FamilyContact.ResPostFamilyContactApi | null>> {
  try {
    const payload = buildPostFamilyContactPayload(form);
    const result = await postCreateFamilyContactApi(payload);
    if (result.code === 0) {
      ElMessage.success("添加成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPostFamilyContactApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}
/** 更新亲情号 */
async function axiosPutFamilyContactApi(
  id: number,
  form: Partial<FamilyContact.ReqPutFamilyContactApi>
): Promise<ResultData<FamilyContact.ResPutFamilyContactApi | null>> {
  try {
    const payload = buildPutFamilyContactPayload(form);
    const result = await putUpdateFamilyContactApi(id, payload);
    if (result.code === 0) {
      ElMessage.success("编辑成功");
    }
    return result;
  } catch (error) {
    console.error("axiosPutFamilyContactApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}
/** 删除亲情号 */
async function axiosDeleteFamilyContactApi(id: number) {
  try {
    return await deleteFamilyContactApi(id);
  } catch (error) {
    console.error("axiosDeleteFamilyContactApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}

/** 打开亲情号表单 */
function handleShowParentForm(type: "Add" | "Edit", row?: FamilyContact.IFamilyContactItemVo) {
  formMode.value = type;
  formVisible.value = true;
  resetParentForm(currentStudentId.value);
  if (!relationshipOptions.value.length) {
    axiosGetFamilyContactRelationshipOptionsApi();
  }
  if (type === "Edit" && row?.id) {
    parentForm.id = row.id;
    axiosGetFamilyContactDetailApi(row.id);
  }
  nextTick(() => {
    parentFormRef.value?.clearValidate();
  });
}
/** 提交亲情号表单 */
function handleSubmitParentForm(formEl?: FormInstance) {
  if (!formEl) return;
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      const form = unref(parentForm);
      if (!form.studentId) return;
      if (formMode.value === "Edit" && form.id) {
        const result = await axiosPutFamilyContactApi(form.id, form);
        if (result.code !== 0) return;
      } else {
        const result = await axiosPostFamilyContactApi(form);
        if (result.code !== 0) return;
      }
      formVisible.value = false;
      await axiosGetFamilyContactListApi(form.studentId);
    }
  });
}
/** 删除亲情号 */
function handleDeleteParent(row: FamilyContact.IFamilyContactItemVo) {
  ElMessageBox.confirm("确定删除该条亲情号吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      const result = await axiosDeleteFamilyContactApi(row.id);
      if (result && result.code === 0 && currentStudentId.value) {
        ElMessage.success("删除成功");
        axiosGetFamilyContactListApi(currentStudentId.value);
      }
    })
    .catch(() => {
      console.log("取消删除");
    });
}
/** 校验亲情号手机号 */
function handleCheckParentPhone() {
  if (parentForm.phone && !/^1[3456789]\d{9}$/.test(parentForm.phone)) {
    parentForm.phone = "";
    ElMessage.warning("请输入正确的手机号");
  }
}

/** 接收参数 */
async function acceptParams(row: Student.IStudentItemVo) {
  currentStudentId.value = row.id;
  resetParentForm(row.id);
  await axiosGetFamilyContactListApi(row.id);
  if (!relationshipOptions.value.length) {
    await axiosGetFamilyContactRelationshipOptionsApi();
  }

  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" title="亲情号" width="760px" destroy-on-close draggable align-center>
    <div class="mb-3 text-right">
      <el-button type="primary" @click="handleShowParentForm('Add')">新增</el-button>
    </div>
    <el-table :data="parentList" class="w-full">
      <el-table-column label="关系" prop="relationshipName" />
      <el-table-column label="显示排序" prop="sortOrder" />
      <el-table-column label="别称" prop="nickname" />
      <el-table-column label="手机号" prop="phone" />
      <el-table-column label="是否主联系人" prop="isPrimary">
        <template #default="{ row }">
          {{ row.isPrimary ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleShowParentForm('Edit', row)">编辑</el-button>
          <el-button type="danger" link @click="handleDeleteParent(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="formVisible" :title="formTitle" width="640px" append-to-body destroy-on-close draggable align-center>
      <el-form ref="parentFormRef" :model="parentForm" :rules="parentRules" label-position="top">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="关系" prop="relationship">
              <el-select v-model="parentForm.relationship" class="w-full" placeholder="请选择关系">
                <el-option v-for="item in relationshipOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="别称" prop="nickname">
              <el-input v-model="parentForm.nickname" placeholder="请输入别称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="parentForm.phone" placeholder="请输入手机号" @blur="handleCheckParentPhone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否主联系人" prop="isPrimary">
              <el-select v-model="parentForm.isPrimary" class="w-full" placeholder="请选择是否主联系人">
                <el-option label="是" :value="true" />
                <el-option label="否" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sortOrder">
              <el-input v-model.number="parentForm.sortOrder" placeholder="请输入显示排序" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitParentForm(parentFormRef)">确定</el-button>
      </template>
    </el-dialog>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
</style>
