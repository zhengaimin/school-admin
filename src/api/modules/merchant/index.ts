import type { Merchant } from "@/api/interface";
import http from "@/api";

/**
 * 获取租户的微信商户号配置
 * @param tenantId 租户ID
 * @param deviceType 设备类型，默认为VIDEO
 */
export function getMerchantConfigApi(tenantId: number, deviceType) {
  return http.get<Merchant.IMerchantConfigVo>(`/admin/wechat-merchant-configs/tenant/${tenantId}`, { deviceType });
}

/**
 * 创建或更新租户的微信商户号配置
 * @param tenantId 租户ID
 * @param data 配置数据
 */
export function putMerchantConfigApi(tenantId: number, data: Merchant.ReqUpdateMerchantConfigApi) {
  const formData = new FormData();
  formData.append("deviceType", data.deviceType);
  formData.append("merchantId", data.merchantId);
  formData.append("merchantSecret", data.merchantSecret);
  if (data.remark) {
    formData.append("remark", data.remark);
  }
  if (data.certFile) {
    formData.append("certFile", data.certFile);
  }
  if (data.keyFile) {
    formData.append("keyFile", data.keyFile);
  }

  return http.put<Merchant.IMerchantConfigVo>(`/admin/wechat-merchant-configs/tenant/${tenantId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
