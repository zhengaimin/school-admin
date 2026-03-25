<script setup lang="ts" name="homeLayoutConfigPanel">
import type { THomeHeightMode, THomeModuleItem } from "../types";

import { computed } from "vue";
import draggable from "vuedraggable";
import { APK_HOMEPAGE_LAYOUT_HEIGHT_MODE } from "@/config/modules";
import { HOME_MAIN_HEIGHT } from "../constants";
import { clampModuleHeight, getModuleTagType, isAutoHeightSupported, resolveHomeLayoutMetrics } from "../utils";

interface IProps {
  disabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false
});
const moduleListModel = defineModel<THomeModuleItem[]>({ required: true });
const emit = defineEmits<{
  (e: "showAll"): void;
  (e: "hideAll"): void;
  (e: "reset"): void;
}>();

/** 可拖拽模块列表 */
const moduleList = computed({
  get() {
    return moduleListModel.value || [];
  },
  set(value: THomeModuleItem[]) {
    moduleListModel.value = value;
  }
});
/** 主区域高度指标 */
const layoutMetrics = computed(function () {
  return resolveHomeLayoutMetrics(moduleList.value);
});

/**
 * 处理高度输入变化。
 * @param moduleItem 当前模块配置
 * @returns 无返回值
 */
function handleModuleHeightChange(moduleItem: THomeModuleItem): void {
  clampModuleHeight(moduleItem);
}
/**
 * 处理模块高度模式切换。
 * @param moduleItem 当前模块配置
 * @param mode 目标模式
 * @returns 无返回值
 */
function handleHeightModeChange(moduleItem: THomeModuleItem, mode: THomeHeightMode): void {
  moduleItem.heightMode = mode;
  if (!isAutoHeightSupported(moduleItem.key)) return;
  if (mode !== APK_HOMEPAGE_LAYOUT_HEIGHT_MODE.ADAPTIVE) return;
  moduleList.value.forEach(item => {
    if (!isAutoHeightSupported(item.key)) return;
    if (item.key === moduleItem.key) return;
    item.heightMode = APK_HOMEPAGE_LAYOUT_HEIGHT_MODE.FIXED;
  });
}
/**
 * 处理高度模式输入变化（带类型收敛）。
 * @param moduleItem 当前模块配置
 * @param value 组件原始值
 * @returns 无返回值
 */
function handleHeightModeInputChange(moduleItem: THomeModuleItem, value: string | number | boolean | undefined): void {
  if (value === APK_HOMEPAGE_LAYOUT_HEIGHT_MODE.FIXED) {
    handleHeightModeChange(moduleItem, APK_HOMEPAGE_LAYOUT_HEIGHT_MODE.FIXED);
    return;
  }
  if (value === APK_HOMEPAGE_LAYOUT_HEIGHT_MODE.ADAPTIVE) {
    handleHeightModeChange(moduleItem, APK_HOMEPAGE_LAYOUT_HEIGHT_MODE.ADAPTIVE);
  }
}
/**
 * 处理全部显示。
 * @returns 无返回值
 */
function handleShowAllClick(): void {
  emit("showAll");
}
/**
 * 处理全部隐藏。
 * @returns 无返回值
 */
function handleHideAllClick(): void {
  emit("hideAll");
}
/**
 * 处理恢复默认。
 * @returns 无返回值
 */
function handleResetClick(): void {
  emit("reset");
}
</script>

<template>
  <section class="home-layout-page__panel">
    <div class="panel-header">
      <div class="panel-header__title">首页布局配置</div>
      <div class="panel-header__desc">支持显示/隐藏、高度调整、拖拽排序</div>
    </div>

    <div class="panel-actions">
      <el-button :disabled="props.disabled" @click="handleShowAllClick">全部显示</el-button>
      <el-button :disabled="props.disabled" @click="handleHideAllClick">全部隐藏</el-button>
      <el-button :disabled="props.disabled" type="primary" plain @click="handleResetClick">恢复默认</el-button>
    </div>
    <div class="panel-metrics">
      <span>主区域：{{ HOME_MAIN_HEIGHT }}px</span>
      <span>已占用：{{ layoutMetrics.usedHeight }}px</span>
      <span :class="{ 'panel-metrics__warn': layoutMetrics.remainingHeight < 0 }">
        剩余：{{ layoutMetrics.remainingHeight }}px
      </span>
    </div>

    <draggable
      v-model="moduleList"
      item-key="key"
      class="module-list"
      handle=".drag-handle"
      animation="260"
      chosen-class="module-item--chosen"
      :disabled="props.disabled"
    >
      <template #item="{ element, index }">
        <div class="module-item">
          <div class="module-item__head">
            <span class="drag-handle">::</span>
            <span class="module-item__index">{{ index + 1 }}</span>
            <span class="module-item__title">{{ element.title }}</span>
            <el-tag :type="getModuleTagType(element)" size="small">
              {{ element.visible ? "显示" : "隐藏" }}
            </el-tag>
          </div>

          <div class="module-item__desc">{{ element.description }}</div>

          <div class="module-item__row">
            <span class="module-item__label">显示开关</span>
            <el-switch v-model="element.visible" :disabled="props.disabled" inline-prompt active-text="开" inactive-text="关" />
          </div>
          <div v-if="isAutoHeightSupported(element.key)" class="module-item__row">
            <span class="module-item__label">高度模式</span>
            <el-radio-group
              :model-value="element.heightMode"
              :disabled="props.disabled"
              @change="value => handleHeightModeInputChange(element, value)"
            >
              <el-radio-button :value="APK_HOMEPAGE_LAYOUT_HEIGHT_MODE.FIXED">固定</el-radio-button>
              <el-radio-button :value="APK_HOMEPAGE_LAYOUT_HEIGHT_MODE.ADAPTIVE">自适应</el-radio-button>
            </el-radio-group>
          </div>

          <div class="module-item__row module-item__row--height">
            <span class="module-item__label">高度(px)</span>
            <el-slider
              v-model="element.height"
              :min="element.minHeight"
              :max="element.maxHeight"
              :step="2"
              :disabled="props.disabled || !element.visible || element.heightMode === APK_HOMEPAGE_LAYOUT_HEIGHT_MODE.ADAPTIVE"
              @change="() => handleModuleHeightChange(element)"
            />
            <el-input-number
              v-model="element.height"
              :min="element.minHeight"
              :max="element.maxHeight"
              :step="2"
              controls-position="right"
              :disabled="props.disabled || !element.visible || element.heightMode === APK_HOMEPAGE_LAYOUT_HEIGHT_MODE.ADAPTIVE"
              @change="() => handleModuleHeightChange(element)"
            />
          </div>
        </div>
      </template>
    </draggable>
  </section>
</template>

<style scoped lang="scss">
.home-layout-page__panel {
  flex: 1;
  min-width: 420px;
  height: 100%;
  padding: 16px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e6ecf5;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgb(16 47 86 / 6%);
}
.panel-header__title {
  font-size: 18px;
  font-weight: 600;
  color: #1d2f4b;
}
.panel-header__desc {
  margin-top: 6px;
  font-size: 13px;
  color: #6a7d97;
}
.panel-actions {
  display: flex;
  gap: 10px;
  margin: 14px 0;
}
.panel-metrics {
  display: flex;
  gap: 14px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #5d7391;
}
.panel-metrics__warn {
  color: #be4a2e;
}
.module-list {
  height: calc(100% - 126px);
  padding-right: 6px;
  overflow-y: auto;
}
.module-item {
  padding: 12px;
  margin-bottom: 12px;
  background: #f8fbff;
  border: 1px solid #d8e5f7;
  border-radius: 10px;
}
.module-item--chosen {
  background: #edf4ff;
  border-color: #7ea6e8;
}
.module-item__head {
  display: flex;
  gap: 8px;
  align-items: center;
}
.drag-handle {
  font-weight: 700;
  color: #91a7c7;
  letter-spacing: 1px;
  cursor: grab;
  user-select: none;
}
.module-item__index {
  width: 22px;
  height: 22px;
  font-size: 12px;
  line-height: 22px;
  color: #4d6485;
  text-align: center;
  background: #e2ebf8;
  border-radius: 50%;
}
.module-item__title {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #1f3858;
}
.module-item__desc {
  margin-top: 8px;
  font-size: 12px;
  color: #7a8faa;
}
.module-item__row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 10px;
}
.module-item__row--height :deep(.el-slider) {
  flex: 1;
}
.module-item__label {
  width: 56px;
  font-size: 12px;
  color: #3f5878;
  white-space: nowrap;
}
</style>
