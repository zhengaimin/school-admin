<script setup lang="ts">
import type { School } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { ref, reactive, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { postSchoolApi, putSchoolApi } from "@/api/modules";
import { schoolsDetail } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
import UploadImg from "@/components/Upload/Img.vue";

const emit = defineEmits<{
  submit: [];
}>();

const visible = ref(false);
const loading = ref(false);
const parameter = ref({
  title: "",
  type: "Add" as "Add" | "Edit"
});

// 表单数据
const ruleForm = reactive<Partial<School.ISchoolItem>>({
  name: "",
  address: "",
  phone: "",
  principal: "",
  description: "",
  motto: "",
  principalIntro: "",
  badge: "",
  background: "",
  photos: [],
  scoreUrl: ""
});

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: "请输入学校名称", trigger: "blur" }]
};

const ruleFormRef = ref<FormInstance>();

const userStore = useUserStore();

/** 获取初始表单数据 */
const getInitialFormData = (): Partial<School.ISchoolItem> => ({
  name: "",
  address: "",
  phone: "",
  principal: "",
  description: "",
  motto: "",
  principalIntro: "",
  badge: "",
  background: "",
  photos: [],
  scoreUrl: ""
});

/** 获取学校详情 */
const axiosGetSchoolDetailApi = async (id: number) => {
  try {
    const result = await schoolsDetail({ id });
    if (result.code == 0 && result.data) {
      Object.assign(ruleForm, result.data);
    } else {
      ElMessage.error("获取学校信息失败");
    }
  } catch (error) {
    console.error("axiosGetSchoolDetailApi:", error);
    ElMessage.error("获取学校信息失败");
  }
};

/** 处理手机号校验 */
const handleCheckPhone = () => {
  if (ruleForm.phone && !/^1[3456789]\d{9}$/.test(ruleForm.phone)) {
    ruleForm.phone = "";
    ElMessage.warning("请输入正确的手机号");
  }
};

/** 提交表单 */
const onSubmitForm = async () => {
  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        const { type } = parameter.value;

        if (type === "Add") {
          await postSchoolApi({
            name: ruleForm.name!,
            tenantId: Number(userStore.userInfo.tenantId),
            address: ruleForm.address,
            phone: ruleForm.phone,
            principal: ruleForm.principal,
            description: ruleForm.description,
            motto: ruleForm.motto,
            principalIntro: ruleForm.principalIntro,
            badge: ruleForm.badge,
            background: ruleForm.background,
            photos: ruleForm.photos,
            scoreUrl: ruleForm.scoreUrl
          });
          ElMessage.success("添加成功");
        } else if (type === "Edit" && ruleForm.id) {
          await putSchoolApi(ruleForm.id, {
            name: ruleForm.name,
            address: ruleForm.address,
            phone: ruleForm.phone,
            principal: ruleForm.principal,
            description: ruleForm.description,
            motto: ruleForm.motto,
            principalIntro: ruleForm.principalIntro,
            badge: ruleForm.badge,
            background: ruleForm.background,
            photos: ruleForm.photos,
            status: -1,
            sort: -1
          });
          ElMessage.success("编辑成功");
        }

        visible.value = false;
        emit("submit");

        // 触发查询学校的全局接口
        let num = Math.floor(Math.random() * 1000);
        userStore.setCount(num);
      } catch (error) {
        console.error("提交失败", error);
      } finally {
        loading.value = false;
      }
    }
  });
};

/** 接收参数 */
const acceptParams = async (params: { title: string; type: "Add" | "Edit" }, row?: School.ISchoolItem) => {
  parameter.value = { ...parameter.value, ...params };

  if (params.type === "Add") {
    Object.assign(ruleForm, getInitialFormData());
  } else if (row?.id) {
    await axiosGetSchoolDetailApi(row.id);
  }

  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="760px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="校徽">
            <UploadImg
              v-model:image-url="ruleForm.badge!"
              :width="'100px'"
              :height="'100px'"
              :file-type="['image/jpeg', 'image/png', 'image/gif']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学校名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入学校名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="校长" prop="principal">
            <el-input v-model="ruleForm.principal" placeholder="请输入校长姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入联系方式" @blur="handleCheckPhone" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务器地址（成绩）" prop="scoreUrl">
            <el-input v-model="ruleForm.scoreUrl" placeholder="请输入服务器地址" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="学校简介" prop="description">
            <el-input
              v-model="ruleForm.description"
              type="textarea"
              :rows="3"
              :maxlength="1000"
              show-word-limit
              placeholder="请输入学校简介"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="学校校训" prop="motto">
            <el-input
              v-model="ruleForm.motto"
              type="textarea"
              :rows="3"
              :maxlength="100"
              show-word-limit
              placeholder="请输入学校校训"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="学校地址" prop="address">
            <el-input
              v-model="ruleForm.address"
              type="textarea"
              :rows="3"
              :maxlength="200"
              show-word-limit
              placeholder="请输入学校地址"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  width: 100%;
}
</style>
