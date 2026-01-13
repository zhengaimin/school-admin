<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { getAvailableSchoolsApi, getUserDataScopeApi, setUserDataScopeApi } from "@/api/modules";

const visible = ref(false);
const loading = ref(false);
const userId = ref<number>(0);
const userName = ref("");

/** Transfer 数据 */
const allSchools = ref<{ key: number; label: string }[]>([]);
const selectedSchoolIds = ref<number[]>([]);

/** 接收参数 */
const acceptParams = async (params: { userId: number; userName: string }) => {
  userId.value = params.userId;
  userName.value = params.userName;
  visible.value = true;
  loading.value = true;

  try {
    // 获取可分配的学校列表
    const schoolsRes = await getAvailableSchoolsApi();
    allSchools.value = (schoolsRes.data || []).map(s => ({
      key: s.id,
      label: s.name
    }));

    // 获取用户当前的数据权限
    const scopeRes = await getUserDataScopeApi(userId.value);
    selectedSchoolIds.value = scopeRes.data?.schoolIds || [];
  } catch {
    ElMessage.error("获取数据权限失败");
  } finally {
    loading.value = false;
  }
};

/** 提交保存 */
const onSubmit = async () => {
  loading.value = true;
  try {
    await setUserDataScopeApi(userId.value, {
      scopeType: "SCHOOL",
      schoolIds: selectedSchoolIds.value
    });
    ElMessage.success("数据权限保存成功");
    visible.value = false;
  } catch {
    // 错误已由拦截器处理
  } finally {
    loading.value = false;
  }
};

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="`数据权限配置 - ${userName}`" width="700px" destroy-on-close draggable align-center>
    <div v-loading="loading" class="transfer-box">
      <el-transfer
        v-model="selectedSchoolIds"
        :data="allSchools"
        :titles="['可选学校', '已选学校']"
        filter-placeholder="搜索学校"
        filterable
      />
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.transfer-box {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 20px 0;
}
</style>
