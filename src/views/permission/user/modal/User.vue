<script setup lang="ts">
import type { System } from "@/api/interface";
import type { FormInstance, FormRules } from "element-plus";

import { ref, reactive, nextTick, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { createAdminUserApi, updateAdminUserApi, getAdminUserDetailApi, getAllRolesApi } from "@/api/modules";

const emit = defineEmits<{ submit: [] }>();

const visible = ref(false);
const loading = ref(false);
const parameter = ref({ title: "", type: "Add" as "Add" | "Edit" });
const roles = ref<System.Role[]>([]);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<System.ReqUserSave & { id?: number }>({
  id: undefined,
  username: "",
  password: "",
  realName: "",
  phone: "",
  roleId: undefined as unknown as number,
  status: 1
});

const rules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  realName: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
  roleId: [{ required: true, message: "请选择角色", trigger: "change" }]
};

/** 获取角色列表 */
const fetchRoles = async () => {
  try {
    const res = await getAllRolesApi();
    roles.value = res.data || [];
  } catch {
    // 错误已由拦截器处理
  }
};

onMounted(() => {
  fetchRoles();
});

/** 获取初始表单数据 */
const getInitialFormData = () => ({
  id: undefined,
  username: "",
  password: "",
  realName: "",
  phone: "",
  roleId: undefined as unknown as number,
  status: 1
});

/** 获取用户详情 */
const fetchUserDetail = async (id: number) => {
  try {
    const result = await getAdminUserDetailApi(id);
    if (result.code === 0 && result.data) {
      Object.assign(ruleForm, result.data);
      ruleForm.password = ""; // 编辑时不显示密码
    } else {
      ElMessage.error("获取用户信息失败");
    }
  } catch {
    ElMessage.error("获取用户信息失败");
  }
};

/** 校验手机号 */
const handleCheckPhone = () => {
  if (ruleForm.phone && !/^1[3-9]\d{9}$/.test(ruleForm.phone)) {
    ruleForm.phone = "";
    ElMessage.warning("请输入正确的手机号");
  }
};

/** 提交表单 */
const onSubmitForm = async () => {
  if (!ruleFormRef.value) return;

  await ruleFormRef.value.validate(async valid => {
    if (!valid) return;

    const { type } = parameter.value;

    // 新增时密码必填
    if (type === "Add" && !ruleForm.password) {
      ElMessage.warning("请输入初始密码");
      return;
    }

    loading.value = true;
    try {
      if (type === "Add") {
        await createAdminUserApi(ruleForm);
        ElMessage.success("添加成功");
      } else if (type === "Edit" && ruleForm.id) {
        const params: Partial<System.ReqUserSave> = {
          username: ruleForm.username,
          realName: ruleForm.realName,
          phone: ruleForm.phone,
          roleId: ruleForm.roleId,
          status: ruleForm.status
        };
        // 编辑时如果填了密码才更新
        if (ruleForm.password) {
          params.password = ruleForm.password;
        }
        await updateAdminUserApi(ruleForm.id, params);
        ElMessage.success("编辑成功");
      }

      visible.value = false;
      emit("submit");
    } catch {
      // 错误已由拦截器处理
    } finally {
      loading.value = false;
    }
  });
};

/** 接收参数 */
const acceptParams = async (params: { title: string; type: "Add" | "Edit" }, row?: System.AdminUser) => {
  parameter.value = { ...params };

  if (params.type === "Add") {
    Object.assign(ruleForm, getInitialFormData());
  } else if (row?.id) {
    await fetchUserDetail(row.id);
  }

  visible.value = true;
  nextTick(() => {
    ruleFormRef.value?.clearValidate();
  });
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="600px" destroy-on-close draggable align-center>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="ruleForm.realName" placeholder="请输入真实姓名" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="parameter.type === 'Add' ? '初始密码' : '新密码（不填则不修改）'" prop="password">
            <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号" @blur="handleCheckPhone" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="ruleForm.roleId" placeholder="请选择角色" style="width: 100%">
              <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
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
