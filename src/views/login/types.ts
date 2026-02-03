import type { Login } from "@/api/interface";

/** 登录表单数据 */
export type LoginForm = Login.ReqLoginForm & {
  /** 是否记住密码 */
  rememberPassword: boolean;
};
