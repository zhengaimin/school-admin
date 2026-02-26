<script setup lang="ts">
import type { Announcement } from "@/api/interface";
import type { AnnouncementRow } from "../types";

import { ref } from "vue";
import { getAnnouncementDetailApi } from "@/api/modules";
import {
  ANNOUNCEMENT_AUDIENCE_I18N,
  ANNOUNCEMENT_SCOPE,
  ANNOUNCEMENT_SCOPE_I18N,
  ANNOUNCEMENT_STATUS_I18N,
  getAnnouncementStatusTagType
} from "@/config/modules";
import SchoolInfo from "@/components/Business/SchoolInfo/index.vue";

/** 弹窗可见 */
const visible = ref(false);
/** 详情数据 */
const detail = ref<Announcement.ResGetAnnouncementDetailApi | null>(null);
/** 当前学校名称 */
const currentSchoolName = ref("");
/** 弹窗参数 */
const parameter = ref<TModalParams>({
  title: "",
  type: "View",
  showConfirm: false
});

/** 获取公告详情 */
async function axiosGetAnnouncementDetailApi(id: number) {
  try {
    return await getAnnouncementDetailApi(id);
  } catch (error) {
    console.error("axiosGetAnnouncementDetailApi:", error);
    return { code: -1, data: null };
  }
}
/** 获取状态文案 */
function getStatusText(value?: Announcement.IAnnouncementItem["status"]) {
  if (!value) return "--";
  return ANNOUNCEMENT_STATUS_I18N[value] || "--";
}
/** 获取通知对象文案 */
function getAudienceText(value: Announcement.IAnnouncementTarget["audienceType"]) {
  return ANNOUNCEMENT_AUDIENCE_I18N[value] || value;
}
/** 获取范围文案 */
function getScopeText(target: Announcement.IAnnouncementTarget) {
  if (target.scopeType === ANNOUNCEMENT_SCOPE.SCHOOL_ALL) {
    return ANNOUNCEMENT_SCOPE_I18N[ANNOUNCEMENT_SCOPE.SCHOOL_ALL];
  }
  const scopeTypeLabel = ANNOUNCEMENT_SCOPE_I18N[target.scopeType] || target.scopeType;
  return `${scopeTypeLabel}(${target.scopeId})`;
}

/** 接收参数 */
async function acceptParams(params: TModalParams, row?: AnnouncementRow) {
  parameter.value = { ...parameter.value, ...params };
  detail.value = null;
  currentSchoolName.value = row?.schoolName || "";
  if (!row?.id) return;
  const result = await axiosGetAnnouncementDetailApi(row.id);
  if (result.code === 0) {
    detail.value = result.data;
    currentSchoolName.value = result.data?.schoolName || row.schoolName || "";
  }
  visible.value = true;
}

defineExpose({ acceptParams });
</script>

<template>
  <el-dialog v-model="visible" :title="parameter.title" width="900px" destroy-on-close draggable align-center>
    <div class="space-y-4">
      <SchoolInfo :name="currentSchoolName" />
      <el-descriptions v-if="detail" :column="2" border>
        <el-descriptions-item label="标题">{{ detail.title || "--" }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getAnnouncementStatusTagType(detail.status)">
            {{ getStatusText(detail.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发布时间">{{ detail.publishedAt || "--" }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createdAt || "--" }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detail.updatedAt || "--" }}</el-descriptions-item>
        <el-descriptions-item label="学校ID">{{ detail.schoolId || "--" }}</el-descriptions-item>
        <el-descriptions-item label="正文" :span="2">
          <div class="whitespace-pre-wrap break-all leading-6">{{ detail.content || "--" }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="图片" :span="2">
          <div v-if="detail.images?.length" class="flex flex-wrap gap-3">
            <el-image
              v-for="(imageUrl, imageIndex) in detail.images"
              :key="`${imageUrl}-${imageIndex}`"
              :src="imageUrl"
              :preview-src-list="detail.images"
              fit="cover"
              class="w-24 h-24 rounded border border-gray-200"
            />
          </div>
          <span v-else>--</span>
        </el-descriptions-item>
        <el-descriptions-item label="投放规则" :span="2">
          <div v-if="detail.targets?.length" class="flex flex-col gap-2">
            <div
              v-for="(target, targetIndex) in detail.targets"
              :key="`${target.audienceType}-${target.scopeType}-${target.scopeId}-${targetIndex}`"
              class="flex items-center gap-2"
            >
              <el-tag type="primary">{{ getAudienceText(target.audienceType) }}</el-tag>
              <el-tag type="info">{{ getScopeText(target) }}</el-tag>
            </div>
          </div>
          <span v-else>--</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
