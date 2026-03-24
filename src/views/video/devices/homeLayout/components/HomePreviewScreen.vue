<script setup lang="ts" name="homePreviewScreen">
import type { THomeModuleItem } from "../types";

import { computed } from "vue";
import {
  ANNOUNCEMENT_MOCK_LIST,
  HOME_BOTTOM_HEIGHT,
  HOME_MAIN_HEIGHT,
  HOME_SCREEN_HEIGHT,
  HOME_SCREEN_WIDTH,
  HOME_SECTION_GAP,
  HOME_TOP_HEIGHT,
  MESSAGE_MOCK_LIST,
  STATISTICS_MOCK_LIST
} from "../constants";
import { getAnnouncementContentStyle, getStatisticsValueClass, resolveHomeLayoutMetrics, resolveMessageLoopList } from "../utils";

interface IProps {
  moduleList?: THomeModuleItem[];
}

const props = withDefaults(defineProps<IProps>(), {
  moduleList: () => []
});

/** 当前可见模块列表 */
const visibleModuleList = computed(function () {
  return props.moduleList.filter(moduleItem => moduleItem.visible);
});
/** 当前隐藏模块数量 */
const hiddenModuleCount = computed(function () {
  return props.moduleList.length - visibleModuleList.value.length;
});
/** 主区域高度指标 */
const layoutMetrics = computed(function () {
  return resolveHomeLayoutMetrics(props.moduleList);
});
/** 未读留言是否启动滚动 */
const messageShouldLoop = computed(function () {
  return MESSAGE_MOCK_LIST.length > 0;
});
/** 未读留言滚动列表 */
const messageLoopList = computed(function () {
  return resolveMessageLoopList();
});
/** 校园公告是否启动滚动 */
const announcementShouldLoop = computed(function () {
  return ANNOUNCEMENT_MOCK_LIST.length > 1;
});
/** 校园公告滚动列表 */
const announcementLoopList = computed(function () {
  if (!ANNOUNCEMENT_MOCK_LIST.length) return [];
  if (!announcementShouldLoop.value) return ANNOUNCEMENT_MOCK_LIST;
  return [...ANNOUNCEMENT_MOCK_LIST, ...ANNOUNCEMENT_MOCK_LIST];
});
</script>

<template>
  <section class="home-layout-page__preview">
    <div class="preview-header">
      <span class="preview-header__title">school-app 首页样式复现（mock）</span>
      <span class="preview-header__size">
        {{ HOME_SCREEN_WIDTH }} × {{ HOME_SCREEN_HEIGHT }} ｜ 主区域 {{ layoutMetrics.mainHeight }}px ｜ 已占用
        {{ layoutMetrics.usedHeight }}px ｜ 剩余 {{ layoutMetrics.remainingHeight }}px
      </span>
    </div>

    <div class="preview-device">
      <div
        class="preview-device__screen"
        :style="{ width: `${HOME_SCREEN_WIDTH}px`, height: `${HOME_SCREEN_HEIGHT}px`, rowGap: `${HOME_SECTION_GAP}px` }"
      >
        <div class="preview-top" :style="{ height: `${HOME_TOP_HEIGHT}px` }">
          <div class="preview-top__cell">天气 22°C 晴</div>
          <div class="preview-top__cell preview-top__cell--center">育才实验学校</div>
          <div class="preview-top__cell">2026-03-19 14:30</div>
        </div>

        <div class="preview-main" :style="{ height: `${HOME_MAIN_HEIGHT}px` }">
          <template v-if="visibleModuleList.length">
            <template v-for="moduleItem in visibleModuleList" :key="moduleItem.key">
              <section
                v-if="moduleItem.key === 'schoolMien'"
                class="preview-school-mien"
                :style="{ height: `${layoutMetrics.moduleHeightMap[moduleItem.key]}px` }"
              >
                <div class="preview-school-mien__media">校园风采图片 / 视频画面（mock）</div>
                <div class="preview-school-mien__meta">
                  <div class="preview-school-mien__meta-content">春日社团活动展示</div>
                  <div class="preview-school-mien__meta-time">2026-03-19</div>
                </div>
                <button class="preview-school-mien__mute-btn" type="button" aria-label="切换静音">
                  <i class="ri-volume-mute-line" />
                </button>
              </section>

              <section
                v-else-if="moduleItem.key === 'announcement'"
                class="preview-announcement-card"
                :style="{ height: `${layoutMetrics.moduleHeightMap[moduleItem.key]}px` }"
              >
                <div class="preview-announcement-card__head">
                  <h3 class="preview-announcement-card__title">校园公告</h3>
                </div>
                <div class="preview-announcement-card__content">
                  <div v-if="!ANNOUNCEMENT_MOCK_LIST.length" class="preview-card-empty-text">暂无校园公告</div>
                  <div v-else class="preview-announcement-scroll" :class="{ 'is-looping': announcementShouldLoop }">
                    <div
                      v-for="(announcementItem, announcementIndex) in announcementLoopList"
                      :key="`${announcementItem.id}-${announcementIndex}`"
                      class="preview-announcement-item"
                    >
                      <div class="preview-announcement-item__dot" />
                      <div class="preview-announcement-item__content">
                        <div class="preview-announcement-item__title">{{ announcementItem.title }}</div>
                        <div class="preview-announcement-item__text" :style="getAnnouncementContentStyle(announcementItem)">
                          {{ announcementItem.content }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                v-else-if="moduleItem.key === 'unreadMessage'"
                class="preview-message-card"
                :style="{ height: `${layoutMetrics.moduleHeightMap[moduleItem.key]}px` }"
              >
                <div class="preview-message-card__label">未读留言</div>
                <div class="preview-message-card__content">
                  <div v-if="!MESSAGE_MOCK_LIST.length" class="preview-card-empty-text">暂无未读留言</div>
                  <div v-else class="preview-message-scroll" :class="{ 'is-looping': messageShouldLoop }">
                    <div
                      v-for="(messageItem, messageIndex) in messageLoopList"
                      :key="`${messageItem.student}-${messageItem.className}-${messageIndex}`"
                      class="preview-message-item"
                    >
                      <span class="preview-message-student">{{ messageItem.student }}</span>
                      <span class="preview-message-class">({{ messageItem.className }})</span>
                      <span class="preview-message-count">{{ messageItem.count }}条</span>
                    </div>
                  </div>
                </div>
              </section>

              <section
                v-else-if="moduleItem.key === 'statistics'"
                class="preview-statistics-card"
                :style="{ height: `${layoutMetrics.moduleHeightMap[moduleItem.key]}px` }"
              >
                <div class="preview-statistics-card__label">设备统计</div>
                <div class="preview-statistics-card__content">
                  <div v-if="!STATISTICS_MOCK_LIST.length" class="preview-card-empty-text">暂无统计数据</div>
                  <div v-else class="preview-statistics-list">
                    <div v-for="statisticsItem in STATISTICS_MOCK_LIST" :key="statisticsItem.label" class="preview-statistics-item">
                      <span class="preview-statistics-item__label">{{ statisticsItem.label }}</span>
                      <span class="preview-statistics-value" :class="getStatisticsValueClass(statisticsItem.tone)">
                        {{ statisticsItem.value }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="preview-statistics-right">
                  <div class="preview-online-status">
                    <span class="preview-online-status__dot" />
                    <span class="preview-online-status__text">设备在线</span>
                  </div>
                </div>
              </section>
            </template>
          </template>

          <div v-else class="preview-empty">当前未显示任何首页模块</div>
        </div>

        <div class="preview-bottom" :style="{ height: `${HOME_BOTTOM_HEIGHT}px` }">
          <div class="preview-bottom__face">人脸识别</div>
          <div class="preview-bottom__actions">
            <span class="preview-bottom__action">SOS</span>
          </div>
        </div>
      </div>
    </div>

    <div class="preview-footer">可见模块 {{ visibleModuleList.length }} 个，隐藏模块 {{ hiddenModuleCount }} 个</div>
  </section>
</template>

<style scoped lang="scss">
.home-layout-page__preview {
  width: 620px;
  height: 100%;
  min-height: 0;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e6ecf5;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(16, 47, 86, 0.06);
}

.preview-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
}

.preview-header__title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2f4b;
}

.preview-header__size {
  font-size: 12px;
  color: #6a7d97;
}

.preview-device {
  display: flex;
  justify-content: center;
}

.preview-device__screen {
  --preview-text-primary: #0a1828;
  --preview-text-secondary: #3a5068;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(180deg, #edf4ff 0%, #eaf2fc 100%);
  border: 3px solid #172f4f;
  border-radius: 22px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.preview-top {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  padding: 10px 16px 8px;
}

.preview-top__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  font-size: 12px;
  color: #294e78;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(145, 176, 216, 0.45);
  border-radius: 8px;
}

.preview-top__cell--center {
  font-weight: 600;
  color: #14365f;
}

.preview-main {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  padding: 0 16px;
  overflow-y: auto;
}

.preview-main > section {
  box-sizing: border-box;
  width: 100%;
  flex-shrink: 0;
}

.preview-school-mien {
  position: relative;
  display: flex;
  overflow: hidden;
  background: #d8e4ee;
  border: 1px solid rgba(10, 60, 120, 0.2);
  border-radius: 12px;
}

.preview-school-mien__media {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #355c8a;
  background: linear-gradient(135deg, #c7dcf7 0%, #dbe9fb 100%);
}

.preview-school-mien__meta {
  position: absolute;
  right: 8px;
  bottom: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-school-mien__meta-content {
  display: inline-flex;
  max-width: calc(100% - 100px);
  padding: 4px 8px;
  overflow: hidden;
  font-size: 10px;
  color: var(--preview-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
}

.preview-school-mien__meta-time {
  flex-shrink: 0;
  margin-left: 8px;
  padding: 4px 8px;
  font-size: 10px;
  color: var(--preview-text-primary);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
}

.preview-school-mien__mute-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--preview-text-primary);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #99c8ff;
  border-radius: 999px;
}

.preview-school-mien__mute-btn > i {
  font-size: 16px;
}

.preview-announcement-card {
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow: hidden;
  background: #d8e4ee;
  border: 1px solid rgba(10, 60, 120, 0.15);
  border-radius: 8px;
}

.preview-announcement-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.preview-announcement-card__title {
  font-size: 14px;
  letter-spacing: 0.02em;
  color: var(--preview-text-primary);
}

.preview-announcement-card__content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.preview-announcement-scroll {
  display: flex;
  flex-direction: column;
}

.preview-announcement-scroll.is-looping {
  animation: preview-scroll-vertical 25s linear infinite;
}

.preview-announcement-item {
  display: inline-flex;
  align-items: flex-start;
  padding: 8px 10px;
  margin-top: 8px;
  background: #ffffff;
  border: 1px solid rgba(10, 60, 120, 0.1);
  border-radius: 10px;
}

.preview-announcement-item:first-child {
  margin-top: 0;
}

.preview-announcement-item__dot {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  margin-top: 3px;
  margin-right: 8px;
  background: #0066cc;
  border-radius: 999px;
  box-shadow: 0 0 6px rgba(0, 102, 204, 0.4);
}

.preview-announcement-item__content {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.25;
}

.preview-announcement-item__title {
  font-size: 12px;
  font-weight: 600;
  color: var(--preview-text-primary);
}

.preview-announcement-item__text {
  margin-top: 6px;
  font-size: 9px;
  color: var(--preview-text-secondary);
}

.preview-message-card {
  display: flex;
  align-items: center;
  padding: 0 16px;
  overflow: hidden;
  background: #d8e4ee;
  border: 1px solid rgba(10, 60, 120, 0.15);
  border-radius: 8px;
}

.preview-message-card__label {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-right: 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--preview-text-primary);
}

.preview-message-card__content {
  flex: 1;
  min-width: 0;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.preview-message-scroll {
  display: inline-flex;
  width: max-content;
}

.preview-message-scroll.is-looping {
  animation: preview-scroll-horizontal 20s linear infinite;
}

.preview-message-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 24px;
  font-size: 14px;
  color: var(--preview-text-primary);
}

.preview-message-student {
  font-weight: 500;
}

.preview-message-class {
  font-size: 12px;
  color: var(--preview-text-secondary);
  opacity: 0.8;
}

.preview-message-count {
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 700;
  color: #0066cc;
  background: #e0f0ff;
  border-radius: 2px;
}

.preview-card-empty-text {
  font-size: 14px;
  color: var(--preview-text-secondary);
}

.preview-statistics-card {
  display: flex;
  align-items: center;
  padding: 0 16px;
  overflow: hidden;
  background: #d8e4ee;
  border: 1px solid rgba(10, 60, 120, 0.15);
  border-radius: 8px;
}

.preview-statistics-card__label {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-right: 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--preview-text-primary);
}

.preview-statistics-card__content {
  flex: 1;
  min-width: 0;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.preview-statistics-list {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  white-space: nowrap;
  color: var(--preview-text-primary);
}

.preview-statistics-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.preview-statistics-item__label {
  font-size: 12px;
  color: var(--preview-text-secondary);
}

.preview-statistics-value {
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid transparent;
  border-radius: 2px;
}

.preview-statistics-value--primary {
  color: #1d4ed8;
  background: #dbeafe;
  border-color: rgba(96, 165, 250, 0.5);
}

.preview-statistics-value--success {
  color: #047857;
  background: #d1fae5;
  border-color: rgba(52, 211, 153, 0.5);
}

.preview-statistics-value--muted {
  color: #3a5068;
  background: #f4f8fc;
  border-color: #99c8ff;
}

.preview-statistics-right {
  flex-shrink: 0;
  margin-left: 16px;
  display: flex;
  align-items: center;
}

.preview-online-status {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  cursor: pointer;
  user-select: none;
  opacity: 0.4;
}

.preview-online-status__dot {
  width: 6px;
  height: 6px;
  margin-right: 6px;
  background: #10b981;
  border-radius: 50%;
}

.preview-online-status__text {
  font-size: 10px;
  font-weight: 500;
  color: var(--preview-text-primary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  margin-top: 10px;
  font-size: 13px;
  color: #667f9c;
  background: rgba(255, 255, 255, 0.7);
  border: 1px dashed #b7cde8;
  border-radius: 10px;
}

.preview-bottom {
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
}

.preview-bottom__face {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  font-size: 13px;
  color: #ffffff;
  background: radial-gradient(circle at 30% 30%, #4f93df 0%, #1f66b3 100%);
  border: 2px solid #1d5da3;
  border-radius: 50%;
  box-shadow: 0 8px 20px rgba(30, 90, 158, 0.3);
}

.preview-bottom__actions {
  position: absolute;
  right: 20px;
  bottom: 16px;
  display: flex;
  gap: 8px;
}

.preview-bottom__action {
  padding: 5px 9px;
  font-size: 12px;
  color: #2c4e78;
  background: #ffffff;
  border: 1px solid #bfd4ee;
  border-radius: 10px;
}

.preview-footer {
  margin-top: 10px;
  font-size: 12px;
  color: #6a7d97;
  text-align: center;
}

@keyframes preview-scroll-horizontal {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes preview-scroll-vertical {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>
