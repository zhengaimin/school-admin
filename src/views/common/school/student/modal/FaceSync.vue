<script setup lang="ts">
import type { FaceSync, ResultData, Student } from "@/api/interface";
import type { TFaceSyncActionValue } from "@/config/modules";

import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { postFaceSyncSchoolStudentApi } from "@/api/modules";
import { FACE_SYNC_ACTION, FACE_SYNC_ACTION_OPTIONS } from "@/config/modules";
import { isNullOrUnDef } from "@/utils/is";

const emit = defineEmits<{
  submit: [];
}>();

const visible = ref(false);
const formData = reactive<{ studentId?: number; schoolId?: number; action: TFaceSyncActionValue }>({
  studentId: undefined,
  schoolId: undefined,
  action: FACE_SYNC_ACTION.UPDATE
});

/** 人脸信息同步 */
async function axiosPostFaceSyncSchoolStudentApi(
  schoolId: number,
  studentId: number,
  params: FaceSync.ReqPostFaceSyncSchoolStudentApi
): Promise<ResultData<FaceSync.ResPostFaceSyncSchoolStudentApi | null>> {
  try {
    return await postFaceSyncSchoolStudentApi(schoolId, studentId, params);
  } catch (error) {
    console.error("axiosPostFaceSyncSchoolStudentApi:", error);
    return { code: -1, data: null, msg: "请求失败" };
  }
}

/** 提交人脸下发 */
async function handleSubmitForm() {
  if (isNullOrUnDef(formData.studentId) || isNullOrUnDef(formData.schoolId)) return;
  const result = await axiosPostFaceSyncSchoolStudentApi(formData.schoolId, formData.studentId, {
    action: formData.action
  });
  if (result && result.code === 0) {
    ElMessage.success("操作成功");
    visible.value = false;
    emit("submit");
  }
}

/** 接收参数 */
function acceptParams(row: Student.IStudentItemVo) {
  if (isNullOrUnDef(row?.id) || isNullOrUnDef(row?.schoolId)) return;
  formData.studentId = row.id;
  formData.schoolId = row.schoolId;
  formData.action = FACE_SYNC_ACTION.UPDATE;
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" title="人脸信息同步" width="480px" destroy-on-close draggable align-center>
    <el-form :model="formData" label-position="top">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="操作">
            <el-select v-model="formData.action" class="w-full" placeholder="请选择操作">
              <el-option v-for="item in FACE_SYNC_ACTION_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmitForm">确定</el-button>
    </template>
  </el-dialog>
</template>
