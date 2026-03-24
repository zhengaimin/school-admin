import type {
  THomeAnnouncementItem,
  THomeLayoutModuleCode,
  THomeLayoutSyncStatus,
  THomeMessageItem,
  THomeModuleItem,
  THomeModuleKey,
  THomeStatisticsItem
} from "./types";

/** 预览区宽度（像素） */
export const HOME_SCREEN_WIDTH = 534;
/** 预览区高度（像素） */
export const HOME_SCREEN_HEIGHT = 854;
/** 顶部信息区高度（像素） */
export const HOME_TOP_HEIGHT = 80;
/** 底部操作区高度（像素） */
export const HOME_BOTTOM_HEIGHT = 120;
/** 顶部/中间/底部之间的纵向间距（像素） */
export const HOME_SECTION_GAP = 8;
/** 中间主内容区高度（像素） */
export const HOME_MAIN_HEIGHT = 638;

/** 公告模块 mock 数据 */
export const ANNOUNCEMENT_MOCK_LIST: THomeAnnouncementItem[] = [
  { id: 1, title: "春季运动会报名已开始", content: "请各班于本周五前完成报名信息填报。" },
  { id: 2, title: "周五晚自习调整通知", content: "本周五晚自习调整至综合楼三层，请相互转告。" },
  { id: 3, title: "宿舍卫生评比结果公布", content: "本周优秀宿舍名单已发布，请到班主任处查看明细。", textColor: "#325b89", textSize: 11 }
];
/** 留言模块 mock 数据 */
export const MESSAGE_MOCK_LIST: THomeMessageItem[] = [
  { student: "张三", className: "高一(2)班", count: 3 },
  { student: "李四", className: "高二(1)班", count: 1 }
];
/** 设备统计模块 mock 数据 */
export const STATISTICS_MOCK_LIST: THomeStatisticsItem[] = [
  { label: "总数", value: "128", tone: "primary" },
  { label: "在线", value: "113", tone: "success" },
  { label: "离线", value: "15", tone: "muted" }
];
/** 模块默认配置 */
export const DEFAULT_MODULE_LIST: THomeModuleItem[] = [
  {
    key: "schoolMien",
    title: "校园风采",
    description: "图片/视频轮播区域",
    visible: true,
    heightMode: "fixed",
    height: 200,
    minHeight: 120,
    maxHeight: 320
  },
  {
    key: "announcement",
    title: "校园公告",
    description: "公告滚动展示区域",
    visible: true,
    heightMode: "fixed",
    height: 286,
    minHeight: 120,
    maxHeight: 360
  },
  {
    key: "unreadMessage",
    title: "未读留言",
    description: "留言提醒横条区域",
    visible: true,
    heightMode: "fixed",
    height: 52,
    minHeight: 48,
    maxHeight: 120
  },
  {
    key: "statistics",
    title: "设备统计",
    description: "设备在线统计区域",
    visible: true,
    heightMode: "fixed",
    height: 52,
    minHeight: 48,
    maxHeight: 120
  }
];

/** 页面模块 key -> 接口模块 code 映射 */
export const HOME_MODULE_KEY_CODE_MAP: Record<THomeModuleKey, THomeLayoutModuleCode> = {
  schoolMien: "schoolMien",
  announcement: "noticeList",
  unreadMessage: "messageList",
  statistics: "statistics"
};
/** 接口模块 code -> 页面模块 key 映射 */
export const HOME_MODULE_CODE_KEY_MAP: Record<THomeLayoutModuleCode, THomeModuleKey> = {
  schoolMien: "schoolMien",
  noticeList: "announcement",
  messageList: "unreadMessage",
  statistics: "statistics"
};
/** 同步状态文案映射 */
export const HOME_LAYOUT_SYNC_STATUS_I18N: Record<THomeLayoutSyncStatus, string> = {
  pending: "待更新",
  success: "已更新",
  failed: "失败",
  offline: "离线"
};
/** 同步状态筛选项 */
export const HOME_LAYOUT_SYNC_STATUS_OPTIONS: Array<{ label: string; value: THomeLayoutSyncStatus }> = [
  { label: HOME_LAYOUT_SYNC_STATUS_I18N.pending, value: "pending" },
  { label: HOME_LAYOUT_SYNC_STATUS_I18N.success, value: "success" },
  { label: HOME_LAYOUT_SYNC_STATUS_I18N.failed, value: "failed" },
  { label: HOME_LAYOUT_SYNC_STATUS_I18N.offline, value: "offline" }
];
