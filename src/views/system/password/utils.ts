import type { FormRules } from "element-plus";
import type { TPasswordForm } from "./types";

import { PASSWORD_MIN_LENGTH } from "./constants";

/**
 * 生成修改密码表单默认值。
 * @returns 修改密码表单默认值
 */
export function createPasswordFormData(): TPasswordForm {
  return {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  };
}
/**
 * 生成修改密码表单校验规则。
 * @param getNewPassword 获取当前新密码值的方法
 * @returns 表单校验规则
 */
export function createPasswordFormRules(getNewPassword: () => string): FormRules<TPasswordForm> {
  return {
    oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
    newPassword: [
      { required: true, message: "请输入新密码", trigger: "blur" },
      { min: PASSWORD_MIN_LENGTH, message: `新密码至少 ${PASSWORD_MIN_LENGTH} 位`, trigger: "blur" }
    ],
    confirmPassword: [
      { required: true, message: "请确认新密码", trigger: "blur" },
      {
        validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
          if (!value) {
            callback(new Error("请确认新密码"));
            return;
          }
          if (value !== getNewPassword()) {
            callback(new Error("两次输入的新密码不一致"));
            return;
          }
          callback();
        },
        trigger: "blur"
      }
    ]
  };
}
/**
 * 重置密码表单字段值。
 * @param form 表单数据
 * @returns 无返回值
 */
export function resetPasswordForm(form: TPasswordForm): void {
  form.oldPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";
}
