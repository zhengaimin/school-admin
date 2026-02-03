/** 排序方向：asc-升序，desc-倒序 */
export enum ORDER_DIRECTION {
  /** 升序 */
  ASC = "asc",
  /** 倒序 */
  DESC = "desc"
}

export type TOrderDirectionValue = (typeof ORDER_DIRECTION)[keyof typeof ORDER_DIRECTION];

export const ORDER_DIRECTION_I18N: Record<TOrderDirectionValue, string> = {
  [ORDER_DIRECTION.ASC]: "升序",
  [ORDER_DIRECTION.DESC]: "倒序"
};

export const ORDER_DIRECTION_OPTIONS: Array<{ label: string; value: TOrderDirectionValue }> = [
  { label: ORDER_DIRECTION_I18N[ORDER_DIRECTION.ASC], value: ORDER_DIRECTION.ASC },
  { label: ORDER_DIRECTION_I18N[ORDER_DIRECTION.DESC], value: ORDER_DIRECTION.DESC }
];
