import http from "@/api";
import type { FamilyContact } from "@/api/interface";

/** 获取亲情号列表 */
export function getFamilyContactsApi(params: FamilyContact.ReqGetFamilyContactsApi) {
  return http.get<FamilyContact.ResGetFamilyContactsApi>("/admin/family-contacts", params);
}

/** 获取亲情号详情 */
export function getFamilyContactDetailApi(id: number) {
  return http.get<FamilyContact.ResGetFamilyContactDetailApi>(`/admin/family-contacts/${id}`);
}

/** 新增亲情号 */
export function postCreateFamilyContactApi(data: FamilyContact.ReqPostFamilyContactApi) {
  return http.post<FamilyContact.ResPostFamilyContactApi>("/admin/family-contacts", data);
}

/** 更新亲情号 */
export function putUpdateFamilyContactApi(id: number, data: FamilyContact.ReqPutFamilyContactApi) {
  return http.put<FamilyContact.ResPutFamilyContactApi>(`/admin/family-contacts/${id}`, data);
}

/** 删除亲情号 */
export function deleteFamilyContactApi(id: number) {
  return http.delete<FamilyContact.ResDeleteFamilyContactApi>(`/admin/family-contacts/${id}`);
}

/** 获取称谓选项 */
export function getFamilyContactRelationshipOptionsApi() {
  return http.get<FamilyContact.ResGetFamilyContactRelationshipOptionsApi>("/admin/family-contacts/relationship-options");
}
/** 设置主联系人 */
export function putFamilyContactPrimaryApi(data: FamilyContact.ReqPutFamilyContactPrimaryApi) {
  return http.put<FamilyContact.ResPutFamilyContactPrimaryApi>("/admin/family-contacts/primary", data);
}
