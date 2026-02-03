export {};

declare global {
  /** 弹窗类型 */
  type TModalType = "Add" | "Edit" | "View";
  /** 弹窗参数 */
  type TModalParams = {
    title: string;
    type: TModalType;
    showConfirm: boolean;
  };
}
