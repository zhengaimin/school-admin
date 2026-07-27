<script setup lang="ts" name="commonApkManage">
import type { Common, ResultData } from "@/api/interface";
import type { ColumnProps, EnumProps } from "@/components/ProTable/interface";

import { computed, ref, watch } from "vue";
import { CirclePlus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import {
  deleteApkPackageApi,
  getApkPackagesApi,
  getDownloadApkPackageApi,
  postDisableApkPackageApi,
  postPublishApkPackageApi
} from "@/api/modules";
import { APK_PACKAGE_STATUS, APK_PACKAGE_STATUS_I18N, getApkPackageStatusTagType } from "@/config/modules";
import { dateFormatter, useManage } from "@/hooks/useManage";
import { useSchool } from "@/hooks/useSchool";
import { isNullOrUnDef } from "@/utils/is";
import ApkModal from "./modal/Apk.vue";
import DetailModal from "./modal/Detail.vue";
import UpgradeModal from "./modal/Upgrade.vue";
import { buildApkPackagesListParams } from "./utils/payload";

/** 学校信息 */
const { schoolId, isAllSchools } = useSchool();

/** 新增编辑弹窗引用 */
const modalRef = ref<InstanceType<typeof ApkModal>>();
/** 详情弹窗引用 */
const detailModalRef = ref<InstanceType<typeof DetailModal>>();
/** 升级弹窗引用 */
const upgradeModalRef = ref<InstanceType<typeof UpgradeModal>>();

/** 表格管理 */
const { proTable, axiosGetTableList, refreshTableList } = useManage({ get: axiosGetApkPackagesApi }, null, list =>
  dateFormatter(list, ["publishedAt", "createdAt", "updatedAt"])
);

/** APK 列表状态筛选选项（-1 全部，1 已发布，2 已下线） */
const apkListStatusQueryOptions: EnumProps[] = [
  { label: "全部", value: -1 },
  { label: "已发布", value: 1 },
  { label: "已下线", value: 2 }
];

/** 表格列配置 */
const columns: ColumnProps<Common.IApkPackageItemVo>[] = [
  { type: "index", label: "#", width: 60 },
  { prop: "packageName", label: "包名", minWidth: 220 },
  { prop: "versionName", label: "版本名称", minWidth: 120 },
  { prop: "versionCode", label: "版本号", minWidth: 100 },
  { prop: "fileSize", label: "文件大小", minWidth: 120 },
  {
    prop: "status",
    label: "状态",
    minWidth: 100,
    enum: apkListStatusQueryOptions,
    isFilterEnum: false,
    search: {
      el: "select",
      defaultValue: -1,
      props: { placeholder: "请选择状态" }
    },
    fixed: "right"
  },
  { prop: "publishedAt", label: "发布时间", minWidth: 170 },
  { prop: "createdAt", label: "创建时间", minWidth: 170 },
  { prop: "operation", label: "操作", width: 340, fixed: "right" }
];

/** 表格头部 */
const tableHeader = computed(() => {
  return `APK 管理${isAllSchools.value ? "（请选择学校后操作）" : ""}`;
});

/** 格式化文件大小 */
function formatFileSize(fileSize?: number) {
  if (isNullOrUnDef(fileSize) || Number(fileSize) <= 0) return "--";
  const size = Number(fileSize);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/** 获取 APK 列表 */
async function axiosGetApkPackagesApi(params: Record<string, any>): Promise<ResultData<Common.ResGetApkPackagesApi>> {
  try {
    const payload = buildApkPackagesListParams(params);
    return await getApkPackagesApi(payload);
  } catch (error) {
    console.error("axiosGetApkPackagesApi:", error);
    return { code: -1, msg: "请求失败", data: { list: [], total: 0, page: 1, pageSize: 10 } };
  }
}
/** 上线 APK */
async function axiosPostPublishApkPackageApi(id: number) {
  try {
    return await postPublishApkPackageApi(id);
  } catch (error) {
    console.error("axiosPostPublishApkPackageApi:", error);
    return { code: -1, data: null };
  }
}
/** 下线 APK */
async function axiosPostDisableApkPackageApi(id: number) {
  try {
    return await postDisableApkPackageApi(id);
  } catch (error) {
    console.error("axiosPostDisableApkPackageApi:", error);
    return { code: -1, data: null };
  }
}
/** 删除 APK */
async function axiosDeleteApkPackageApi(id: number) {
  try {
    return await deleteApkPackageApi(id);
  } catch (error) {
    console.error("axiosDeleteApkPackageApi:", error);
    return { code: -1, data: null };
  }
}
/** 下载 APK */
async function axiosGetDownloadApkPackageApi(id: number, versionName: string, versionCode: number) {
  try {
    const blob = await getDownloadApkPackageApi(id);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `apk-${versionName}-${versionCode}.apk`);
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("axiosGetDownloadApkPackageApi:", error);
  }
}

/** 打开新增编辑弹窗 */
function handleShowModal(type: "Add" | "Edit", row?: Common.IApkPackageItemVo) {
  if (type === "Add" && isAllSchools.value) {
    ElMessage.warning("请选择学校后再新增");
    return;
  }

  const titleMap = {
    Add: "上传 APK",
    Edit: "编辑 APK"
  };
  modalRef.value?.acceptParams({ title: titleMap[type], type, showConfirm: true }, row);
}
/** 打开详情弹窗 */
function handleShowDetailModal(row: Common.IApkPackageItemVo) {
  detailModalRef.value?.acceptParams({ title: "APK 详情", type: "View", showConfirm: false }, row);
}
/** 打开升级弹窗 */
function handleShowUpgradeModal(row: Common.IApkPackageItemVo) {
  if (row.status !== APK_PACKAGE_STATUS.PUBLISHED) {
    ElMessage.warning("仅已发布版本可设置升级目标");
    return;
  }
  upgradeModalRef.value?.acceptParams({
    title: "批量设置升级目标",
    type: "View",
    showConfirm: true,
    apkPackageId: row.id,
    versionName: row.versionName,
    versionCode: row.versionCode
  });
}
/** 上线操作 */
async function handlePublish(row: Common.IApkPackageItemVo) {
  if (row.status === APK_PACKAGE_STATUS.PUBLISHED) {
    ElMessage.warning("当前版本已上线");
    return;
  }
  try {
    await ElMessageBox.confirm(`确认上线版本 ${row.versionName}(${row.versionCode}) 吗？`, "提示", { type: "warning" });
    const result = await axiosPostPublishApkPackageApi(row.id);
    if (result.code !== 0) return;
    ElMessage.success("上线成功");
    refreshTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("上线失败，请重试");
    }
  }
}

/** 切换发布状态 */
function handleTogglePublishStatus(row: Common.IApkPackageItemVo) {
  if (row.status === APK_PACKAGE_STATUS.PUBLISHED) {
    handleDisable(row);
    return;
  }
  handlePublish(row);
}
/** 下线操作 */
async function handleDisable(row: Common.IApkPackageItemVo) {
  if (row.status !== APK_PACKAGE_STATUS.PUBLISHED) {
    ElMessage.warning("仅已发布状态支持下线");
    return;
  }
  try {
    await ElMessageBox.confirm(`确认下线版本 ${row.versionName}(${row.versionCode}) 吗？`, "提示", { type: "warning" });
    const result = await axiosPostDisableApkPackageApi(row.id);
    if (result.code !== 0) return;
    ElMessage.success("下线成功");
    refreshTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("下线失败，请重试");
    }
  }
}
/** 删除操作 */
async function handleDelete(row: Common.IApkPackageItemVo) {
  if (row.status === APK_PACKAGE_STATUS.PUBLISHED) {
    ElMessage.warning("已发布版本需先下线再删除");
    return;
  }
  try {
    await ElMessageBox.confirm(`确认删除版本 ${row.versionName}(${row.versionCode}) 吗？`, "提示", { type: "warning" });
    const result = await axiosDeleteApkPackageApi(row.id);
    if (result.code !== 0) return;
    ElMessage.success("删除成功");
    refreshTableList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败，请重试");
    }
  }
}

watch(schoolId, () => refreshTableList());
</script>

<template>
  <div class="flex flex-col h-full">
    <ProTable ref="proTable" :columns="columns" :request-api="axiosGetTableList" row-key="id" :table-header="tableHeader">
      <template #toolButton>
        <el-button type="primary" :icon="CirclePlus" @click="handleShowModal('Add')">上传 APK</el-button>
      </template>

      <template #fileSize="{ row }">{{ formatFileSize(row.fileSize) }}</template>

      <template #status="{ row }">
        <el-tag :type="getApkPackageStatusTagType(row.status)">
          {{ APK_PACKAGE_STATUS_I18N[row.status] || "--" }}
        </el-tag>
      </template>

      <template #publishedAt="{ row }">
        {{ row.publishedAt || "--" }}
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link @click="handleShowDetailModal(row)">详情</el-button>
        <el-button type="primary" link @click="handleShowModal('Edit', row)"> 编辑 </el-button>
        <el-button
          :type="row.status === APK_PACKAGE_STATUS.PUBLISHED ? 'warning' : 'success'"
          link
          @click="handleTogglePublishStatus(row)"
        >
          {{ row.status === APK_PACKAGE_STATUS.PUBLISHED ? "下线" : "上线" }}
        </el-button>
        <el-button type="danger" link :disabled="row.status === APK_PACKAGE_STATUS.PUBLISHED" @click="handleDelete(row)">
          删除
        </el-button>
        <el-button type="primary" link @click="axiosGetDownloadApkPackageApi(row.id, row.versionName, row.versionCode)">
          下载
        </el-button>
        <el-button
          type="primary"
          link
          :disabled="row.status !== APK_PACKAGE_STATUS.PUBLISHED"
          @click="handleShowUpgradeModal(row)"
        >
          批量升级
        </el-button>
      </template>
    </ProTable>

    <ApkModal ref="modalRef" @submit="refreshTableList" />
    <DetailModal ref="detailModalRef" />
    <UpgradeModal ref="upgradeModalRef" @submit="refreshTableList" />
  </div>
</template>
