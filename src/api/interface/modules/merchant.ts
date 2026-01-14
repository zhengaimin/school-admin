import type { TDeviceTypeValue } from "@/config/modules";

export namespace Merchant {
  /** 微信商户号配置信息 */
  export interface IMerchantConfigVo {
    /** 配置ID，为0表示尚未创建配置 */
    id: number;
    /** 租户ID */
    tenantId: number;
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 租户名称 */
    tenantName: string;
    /** 微信商户号 */
    merchantId: string;
    /** 微信商户密钥（脱敏） */
    merchantSecret: string;
    /** 证书文件名 */
    certFileName: string;
    /** 密钥文件名 */
    keyFileName: string;
    /** 配置是否完整 */
    isConfigComplete: boolean;
    /** 备注 */
    remark: string;
  }

  /** 获取商户号配置响应 */
  export interface ResGetMerchantConfigApi {
    code: number;
    msg: string;
    data: IMerchantConfigVo;
  }

  /** 获取商户号配置请求参数 */
  export interface ReqGetMerchantConfigApi {
    /** 租户ID */
    tenantId: number;
    /** 设备类型，默认为VIDEO */
    deviceType?: TDeviceTypeValue;
  }

  /** 更新商户号配置请求参数 */
  export interface ReqUpdateMerchantConfigApi {
    /** 设备类型 */
    deviceType: TDeviceTypeValue;
    /** 微信商户号 */
    merchantId: string;
    /** 微信商户密钥 */
    merchantSecret: string;
    /** 备注 */
    remark?: string;
    /** API证书文件 */
    certFile?: File;
    /** API密钥文件 */
    keyFile?: File;
  }

  /** 验证商户号配置请求参数 */
  export interface ReqValidateMerchantConfigApi {
    /** 微信商户号 */
    merchantId: string;
    /** 微信商户密钥 */
    merchantSecret: string;
    /** API证书文件 */
    certFile: File;
    /** API密钥文件 */
    keyFile: File;
  }

  /** 验证商户号配置响应 */
  export interface ResValidateMerchantConfigApi {
    /** 验证是否通过 */
    success: boolean;
    /** 验证结果消息 */
    message: string;
  }
}
