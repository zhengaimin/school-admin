<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="parameter.title"
    width="820px"
    destroy-on-close
    draggable
    align-center
  >
    <div v-loading="loading" class="space-y-5">
      <SchoolInfo :name="currentSchoolName" />

      <div class="rounded-xl border border-gray-200 bg-white/80">
        <el-descriptions :column="2" border class="w-full">
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(detailForm.status)">
              {{ getStatusText(detailForm.status, detailForm.statusText) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="排序">{{ detailForm.sort ?? "--" }}</el-descriptions-item>
          <el-descriptions-item label="发布时间">{{ detailForm.publishedAt || "--" }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detailForm.createdAt || "--" }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ detailForm.updatedAt || "--" }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white/80">
        <div class="mb-2 text-sm font-medium text-gray-500">内容</div>
        <div class="whitespace-pre-line text-sm leading-6 text-gray-700">{{ detailForm.content || "--" }}</div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white/80">
        <div class="mb-2 text-sm font-medium text-gray-500">图片</div>
        <div v-if="imagePreviewList.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <el-image
            v-for="(url, index) in imagePreviewList"
            :key="`${url}-${index}`"
            :src="url"
            :preview-src-list="imagePreviewList"
            :initial-index="index"
            fit="cover"
            class="h-24 w-full rounded-md"
          />
        </div>
        <div v-else class="text-sm text-gray-400">--</div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white/80">
        <div class="mb-2 text-sm font-medium text-gray-500">视频</div>
        <div v-if="videoPreviewUrl" class="overflow-hidden rounded-lg border border-gray-100 bg-black/90">
          <video :src="videoPreviewUrl" class="w-full" controls></video>
        </div>
        <div v-else class="text-sm text-gray-400">--</div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { TSchoolMienDetail } from "../types";

import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { getSchoolMienDetailApi } from "@/api/modules";
import { ANNOUNCEMENT_STATUS_I18N, getAnnouncementStatusTagType } from "@/config/modules";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";
import { useAssetsPath } from "@/hooks/useAssetsPath";

const { getUploadPath } = useAssetsPath();

/** 弹窗显示状态 */
const visible = ref(false);
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});
/** 加载状态 */
const loading = ref(false);
/** 详情数据 */
const detailForm = ref<Partial<TSchoolMienDetail>>({});
/** 当前学校名称 */
const currentSchoolName = ref("");

const imagePreviewList = computed(() => {
  const images = detailForm.value.images ?? [];
  return images.map(item => getUploadPath(item)).filter(Boolean);
});

const videoPreviewUrl = computed(() => {
  if (!detailForm.value.videoUrl) return "";
  return getUploadPath(detailForm.value.videoUrl);
});

/** 获取状态标签类型 */
function getStatusTagType(status?: TSchoolMienDetail["status"]) {
  if (!status) return "info";
  return getAnnouncementStatusTagType(status);
}

/** 获取状态文案 */
function getStatusText(status?: TSchoolMienDetail["status"], statusText?: string) {
  if (status) return ANNOUNCEMENT_STATUS_I18N[status] || statusText || "--";
  return statusText || "--";
}

/** 获取校园风采详情 */
async function axiosGetSchoolMienDetailApi(id: number) {
  try {
    return await getSchoolMienDetailApi(id);
  } catch (error) {
    console.error(error);
    return { code: -1, data: null };
  }
}

/** 关闭弹窗 */
function handleClose() {
  visible.value = false;
}
/** 接收参数 */
async function acceptParams(params: TModalParams, row?: TSchoolMienDetail) {
  parameter.value = { ...parameter.value, ...params };
  if (!row?.id) return;
  currentSchoolName.value = row.schoolName ?? "";
  loading.value = true;

  const result = await axiosGetSchoolMienDetailApi(row.id);
  loading.value = false;

  if (result.code === 0 && result.data) {
    detailForm.value = result.data;
    currentSchoolName.value = result.data.schoolName ?? currentSchoolName.value;
    visible.value = true;
    return;
  }

  ElMessage.error("获取详情失败");
}

defineExpose({ acceptParams });
</script>
