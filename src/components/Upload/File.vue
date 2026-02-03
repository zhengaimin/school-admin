<template>
  <div class="upload-box" :style="{ width, height }">
    <el-upload
      :id="uuid"
      action="#"
      :class="['upload', selfDisabled ? 'disabled' : '', drag ? 'no-border' : '']"
      :multiple="false"
      :disabled="selfDisabled"
      :show-file-list="false"
      :http-request="handleHttpUpload"
      :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <template v-if="fileUrl">
        <div class="upload-file">
          <el-icon class="file-icon"><Document /></el-icon>
          <span class="file-name" :title="fileName">{{ fileName }}</span>
        </div>
        <div class="upload-handle" @click.stop>
          <div v-if="!selfDisabled" class="handle-icon" @click="handleEdit">
            <el-icon><Edit /></el-icon>
            <span>编辑</span>
          </div>
          <div v-if="!selfDisabled" class="handle-icon" @click="handleDelete">
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-empty">
          <slot name="empty">
            <el-icon><Plus /></el-icon>
          </slot>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" name="UploadFile">
import { ref, computed, inject } from "vue";
import { Document, Edit, Delete, Plus } from "@element-plus/icons-vue";
import { generateUUID } from "@/utils";
import { uploadFileApi } from "@/api/modules/upload";
import { ElNotification, formContextKey, formItemContextKey } from "element-plus";
import type { UploadProps, UploadRequestOptions } from "element-plus";
import type { Upload } from "@/api/interface";

interface Props {
  api?: (file: File, businessType?: Upload.BusinessType) => Promise<any>;
  businessType?: Upload.BusinessType;
  drag?: boolean;
  disabled?: boolean;
  fileSize?: number;
  fileType?: string[];
  height?: string;
  width?: string;
  borderRadius?: string;
}

const props = withDefaults(defineProps<Props>(), {
  drag: true,
  disabled: false,
  fileSize: 10,
  fileType: () => [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "audio/mpeg"
  ],
  height: "120px",
  width: "150px",
  borderRadius: "8px"
});

const fileUrl = defineModel<string>({ default: "" });

const uuid = ref("id-" + generateUUID());

const formContext = inject(formContextKey, void 0);
const formItemContext = inject(formItemContextKey, void 0);

const selfDisabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

const fileName = computed(() => {
  if (!fileUrl.value) return "";
  const parts = fileUrl.value.split("/");
  return parts[parts.length - 1] || "文件";
});

/** 处理文件上传 */
const handleHttpUpload = async (options: UploadRequestOptions) => {
  try {
    const api = props.api ?? uploadFileApi;
    const { data } = await api(options.file, props.businessType);
    options.onSuccess(data);
  } catch (error) {
    options.onError(error as any);
  }
};

/** 处理删除文件 */
const handleDelete = () => {
  fileUrl.value = "";
};

/** 处理编辑文件 */
const handleEdit = () => {
  const dom = document.querySelector(`#${uuid.value} .el-upload__input`);
  if (dom) dom.dispatchEvent(new MouseEvent("click"));
};

/** 处理上传前校验 */
const handleBeforeUpload: UploadProps["beforeUpload"] = rawFile => {
  const isValidSize = rawFile.size / 1024 / 1024 < props.fileSize;

  // 检查文件扩展名
  const fileName = rawFile.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf("."));
  const allowedExtensions = props.fileType.map(type => {
    // 如果是 MIME 类型，提取扩展名
    if (type.includes("/")) {
      return type;
    }
    // 如果已经是扩展名格式（如 .pem），直接使用
    return type;
  });

  // 检查是否是允许的扩展名或 MIME 类型
  const isValidType = allowedExtensions.some(allowed => {
    if (allowed.startsWith(".")) {
      // 扩展名匹配
      return fileExtension === allowed;
    } else {
      // MIME 类型匹配
      return rawFile.type === allowed;
    }
  });

  if (!isValidType) {
    ElNotification({
      title: "温馨提示",
      message: "上传文件不符合所需的格式！",
      type: "warning"
    });
  }

  if (!isValidSize) {
    setTimeout(() => {
      ElNotification({
        title: "温馨提示",
        message: `上传文件大小不能超过 ${props.fileSize}M！`,
        type: "warning"
      });
    }, 0);
  }

  return isValidType && isValidSize;
};

/** 处理上传成功 */
const handleUploadSuccess = (response: Upload.ResFileUpload | undefined) => {
  if (!response) return;
  fileUrl.value = response.fileUrl;
  if (formItemContext?.prop) {
    formContext?.validateField([formItemContext.prop as string]);
  }
  ElNotification({
    title: "温馨提示",
    message: "文件上传成功！",
    type: "success"
  });
};

/** 处理上传失败 */
const handleUploadError = () => {
  ElNotification({
    title: "温馨提示",
    message: "文件上传失败，请您重新上传！",
    type: "error"
  });
};
</script>

<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;
    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}
.upload-box {
  display: flex;
  flex-direction: column;
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }
  :deep(.upload) {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);
      transition: var(--el-transition-duration-fast);
      &:hover {
        border-color: var(--el-color-primary);
        .upload-handle {
          opacity: 1;
        }
      }
      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
        border: 1px dashed var(--el-border-color-darker);
        border-radius: v-bind(borderRadius);
        &:hover {
          border: 1px dashed var(--el-color-primary);
        }
      }
      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }
      .upload-file {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 10px;
        .file-icon {
          margin-bottom: 8px;
          font-size: 40px;
          color: var(--el-color-primary);
        }
        .file-name {
          max-width: 100%;
          overflow: hidden;
          font-size: 12px;
          color: var(--el-text-color-regular);
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 12px;
        line-height: 30px;
        color: var(--el-color-info);
        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
      }
      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        transition: var(--el-transition-duration-fast);
        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;
          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }
          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }
  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}
</style>
