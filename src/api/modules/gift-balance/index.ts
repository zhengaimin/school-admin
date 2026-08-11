/** 赠费余额模板下载与导入接口。 */
import http from "@/api";
import type { GiftBalance, ResultData } from "@/api/interface";

/** 下载赠费余额更新模板。 */
export function getGiftBalanceTemplateApi(params: GiftBalance.ReqGetGiftBalanceTemplateApi): Promise<Blob> {
  return http.get("/admin/gift-balances/template", params, { responseType: "blob" });
}

/** 导入更新赠费余额。 */
export function postGiftBalanceImportApi(
  params: GiftBalance.ReqPostGiftBalanceImportApi,
  file: File
): Promise<ResultData<GiftBalance.ResPostGiftBalanceImportApi>> {
  const formData = new FormData();
  formData.append("deviceType", params.deviceType);
  formData.append("file", file);
  return http.post<GiftBalance.ResPostGiftBalanceImportApi>("/admin/gift-balances/import", formData, { errorTip: false });
}
