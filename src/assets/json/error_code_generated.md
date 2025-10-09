# 错误码

！！系统错误码列表，由 `codegen -type=int -doc` 命令生成，不要对此文件做任何更改。

## 功能说明

如果返回结果中存在 `code` 字段，则表示调用 API 接口失败。例如：

```json
{
  "code": 100101,
  "message": "Database error"
}
```

上述返回中 `code` 表示错误码，`message` 表示该错误的具体信息。每个错误同时也对应一个 HTTP 状态码，比如上述错误码对应了 HTTP 状态码 500(Internal Server Error)。

## 错误码列表

系统支持的错误码列表如下：

| Identifier | Code | HTTP Code | Description |
| ---------- | ---- | --------- | ----------- |
| ErrRoleNotFound | 100901 | 200 | Role not found |
| ErrRoleExists | 100902 | 200 | Role already exists |
| ErrSystemRoleCannotModify | 100903 | 200 | System role cannot be modified |
| ErrSystemRoleCannotDelete | 100904 | 200 | System role cannot be deleted |
| ErrRoleInUse | 100905 | 200 | Role is in use and cannot be deleted |
| ErrTokenGenerate | 101001 | 500 | Token generation failed |
| ErrInternalServerError | 101002 | 500 | Internal server error |
| ErrCaptchaGenFailed | 101101 | 500 | Captcha generation failed |
| ErrCaptchaVerifyFailed | 101102 | 400 | Captcha verification failed |
| ErrCaptchaExpired | 101103 | 400 | Captcha expired |
| ErrCaptchaInvalid | 101104 | 400 | Captcha is invalid |
| ErrSuccess | 100001 | 200 | OK |
| ErrUnknown | 100002 | 500 | Internal server error |
| ErrBind | 100003 | 400 | Error occurred while binding the request body to the struct |
| ErrValidation | 100004 | 400 | Validation failed |
| ErrTokenInvalid | 100005 | 401 | Token invalid |
| ErrPageNotFound | 100006 | 404 | Page not found |
| ErrTimestampInvalid | 100007 | 400 | Timestamp invalid |
| ErrPermissionCheck | 100008 | 500 | Permission check failed |
| ErrParamsValidate | 100009 | 400 | Params validate failed |
| ErrInvalidParameter | 100010 | 400 | Invalid parameter |
| ErrFileNotFound | 100011 | 404 | File not found |
| ErrInternal | 100012 | 500 | Internal error |
| ErrDatabase | 100101 | 500 | Database error |
| ErrRedis | 100102 | 500 | Redis error |
| ErrEncrypt | 100201 | 401 | Error occurred while encrypting the user password |
| ErrSignatureInvalid | 100202 | 401 | Signature is invalid |
| ErrExpired | 100203 | 401 | Token expired |
| ErrInvalidAuthHeader | 100204 | 401 | Invalid authorization header |
| ErrMissingHeader | 100205 | 401 | The `Authorization` header was empty |
| ErrUsernamePasswordIncorrect | 100206 | 200 | UserNameOrPassword was incorrect |
| ErrPermissionDenied | 100207 | 403 | Permission denied |
| ErrCreateToken | 100208 | 500 | Create token failed |
| ErrUserNotLogin | 100209 | 401 | User not login |
| ErrAuthorizingUser | 100210 | 500 | Error occurred when authorizing user |
| ErrTimeConflict | 100211 | 200 | Time conflict with existing time slot |
| ErrInvalidParam | 100212 | 400 | Invalid parameter |
| ErrEncodingFailed | 100301 | 500 | Encoding failed due to an error with the data |
| ErrDecodingFailed | 100302 | 500 | Decoding failed due to an error with the data |
| ErrInvalidJSON | 100303 | 500 | Data is not valid JSON |
| ErrEncodingJSON | 100304 | 500 | JSON data could not be encoded |
| ErrDecodingJSON | 100305 | 500 | JSON data could not be decoded |
| ErrInvalidYaml | 100306 | 500 | Data is not valid Yaml |
| ErrEncodingYaml | 100307 | 500 | Yaml data could not be encoded |
| ErrDecodingYaml | 100308 | 500 | Yaml data could not be decoded |
| ErrInvalidUUID | 100401 | 400 | Invalid UUID |
| ErrCreateUUID | 100402 | 500 | Create UUID failed |
| ErrUnauthorized | 100501 | 401 | Unauthorized access |
| ErrForbidden | 100502 | 403 | Access forbidden |
| ErrTooManyRequests | 100503 | 403 | Too many requests |
| ErrInvalidSignature | 100504 | 401 | Invalid signature |
| ErrExpiredRequest | 100505 | 401 | Request expired |
| ErrInvalidAppID | 100506 | 401 | Invalid AppID |
| ErrIPNotAllowed | 100507 | 403 | IP not in whitelist |
| ErrRateLimit | 100508 | 403 | Rate limit exceeded |
| ErrInvalidPermission | 100509 | 403 | Invalid permission |
| ErrWXInvalidCode | 200001 | 400 | WeChat login code is invalid |
| ErrWXCodeUsed | 200002 | 400 | WeChat login code has been used |
| ErrWXInvalidCredential | 200003 | 401 | WeChat credential is invalid |
| ErrWXAccessTokenExpired | 200004 | 401 | WeChat access token expired |
| ErrWXSystemBusy | 200005 | 500 | WeChat system busy, try again later |
| ErrFamilyRelationNotFound | 200201 | 200 | Family relation not found |
| ErrFamilyRelationExists | 200202 | 200 | Family relation already exists |
| ErrCreateFamilyRelationFailed | 200203 | 200 | Create family relation failed |
| ErrUpdateFamilyRelationFailed | 200204 | 200 | Update family relation failed |
| ErrDeleteFamilyRelationFailed | 200205 | 200 | Delete family relation failed |
| ErrICCardAlreadyBound | 200301 | 200 | IC card already bound to user |
| ErrICCardNotBound | 200302 | 200 | IC card not bound to user |
| ErrICCardInvalid | 200303 | 200 | IC card is invalid |
| ErrICCardBindFailed | 200304 | 200 | IC card binding failed |
| ErrGradeRateConfigExists | 200901 | 400 | Grade rate config already exists |
| ErrGradeRateConfigNotFound | 200902 | 404 | Grade rate config not found |
| ErrRateTemplateCreateFailed | 200903 | 500 | Rate template creation failed |
| ErrGradeRateConfigCreateFailed | 200904 | 500 | Grade rate config creation failed |
| ErrGradeRateConfigQueryFailed | 200905 | 500 | Grade rate config query failed |
| ErrNotFound | 201101 | 404 | Resource not found |
| ErrAlreadyExists | 201102 | 400 | Resource already exists |
| ErrConflict | 201103 | 400 | Resource conflict |
| ErrInvalidInput | 201104 | 400 | Invalid input parameter |
| ErrConfigIncomplete | 201105 | 400 | Configuration incomplete |
| ErrPaymentConfigNotFound | 201201 | 404 | Payment configuration not found |
| ErrPaymentConfigExists | 201202 | 400 | Payment configuration already exists |
| ErrPaymentConfigInvalid | 201203 | 400 | Payment configuration is invalid |
| ErrPaymentAmountInvalid | 201204 | 400 | Payment amount is invalid |
| ErrPaymentLimitExceeded | 201205 | 400 | Payment limit exceeded |
| ErrWeChatConfigNotFound | 201301 | 404 | WeChat merchant configuration not found |
| ErrWeChatConfigExists | 201302 | 400 | WeChat merchant configuration already exists |
| ErrWeChatConfigIncomplete | 201303 | 400 | WeChat merchant configuration incomplete |
| ErrWeChatConfigInvalid | 201304 | 400 | WeChat merchant configuration is invalid |
| ErrNotificationConfigNotFound | 201401 | 404 | Notification configuration not found |
| ErrNotificationConfigInitFailed | 201402 | 500 | Notification configuration initialization failed |
| ErrDeviceNotFound | 101301 | 200 | Device not found |
| ErrDeviceExists | 101302 | 200 | Device already exists |
| ErrDeviceTerminalKeyExisted | 101303 | 200 | Device terminal key already exists |
| ErrDeviceTerminalMacExisted | 101304 | 200 | Device mac address already exists |
| ErrDeviceTerminalSnExisted | 101305 | 200 | Device sn already exists |
| ErrDeviceInUse | 101306 | 200 | Device is in use |
| ErrDeviceGroupNotFound | 101401 | 200 | Device group not found |
| ErrDeviceGroupExists | 101402 | 200 | Device group already exists |
| ErrGiftNotFound | 200151 | 200 | Gift record not found |
| ErrGiftAddFailed | 200152 | 200 | Add gift failed |
| ErrGiftCancelFailed | 200153 | 200 | Cancel gift failed |
| ErrGiftStatusInvalid | 200154 | 200 | Gift status is invalid |
| ErrGiftInsufficientBalance | 200155 | 200 | Gift balance is insufficient |
| ErrInsufficientFrozenBalance | 200156 | 200 | Frozen balance is insufficient |
| ErrGiftExpired | 200157 | 200 | Gift has expired |
| ErrGiftUsageFailed | 200158 | 200 | Gift usage failed |
| ErrInsufficientBalance | 200401 | 200 | Insufficient balance |
| ErrInvalidFrozenAmount | 200402 | 200 | Invalid frozen amount |
| ErrInsufficientWithdrawBalance | 200403 | 200 | Insufficient withdraw balance |
| ErrBalanceNotFound | 200404 | 200 | Balance record not found |
| ErrBalanceRecordExists | 200405 | 200 | Balance record already exists |
| ErrInvalidAmount | 200406 | 200 | Invalid amount |
| ErrWithdrawFailed | 200407 | 200 | Withdraw failed |
| ErrRefundFailed | 200408 | 200 | Refund failed |
| ErrBalanceOperationFailed | 200409 | 200 | Balance operation failed |
| ErrPaymentCreateFailed | 200501 | 200 | Payment creation failed |
| ErrPaymentOrderNotFound | 200502 | 200 | Payment order not found |
| ErrPaymentCallbackFailed | 200503 | 200 | Payment callback processing failed |
| ErrWeChatPayCallbackInvalid | 200504 | 200 | WeChat payment callback is invalid |
| ErrPaymentMethodNotSupported | 200505 | 200 | Payment method not supported |
| ErrPaymentOrderExpired | 200506 | 200 | Payment order expired |
| ErrPaymentAlreadyProcessed | 200507 | 200 | Payment already processed |
| ErrPaymentSignatureInvalid | 200508 | 200 | Payment signature invalid |
| ErrWeChatPayCreateFailed | 200509 | 200 | WeChat pay order creation failed |
| ErrPaymentStatusInvalid | 200510 | 200 | Payment status invalid |
| ErrPaymentRefundFailed | 200511 | 200 | Payment refund failed |
| ErrPaymentQueryFailed | 200512 | 200 | Payment query failed |
| ErrUserOpenIDNotFound | 200513 | 200 | User OpenID not found |
| ErrPaymentPendingOrderExists | 200514 | 400 | User has pending payment order |
| ErrPaymentTypeInvalid | 200515 | 200 | Payment type is invalid |
| ErrWeChatPayUserPaying | 200516 | 200 | User is paying |
| ErrWeChatPayFailed | 200517 | 500 | WeChat pay failed |
| ErrRefundApplicationNotFound | 200601 | 200 | Refund application not found |
| ErrRefundApplicationExists | 200602 | 200 | Refund application already exists |
| ErrRefundPendingOrderExists | 200603 | 400 | User has pending refund order |
| ErrRefundAmountExceedsBalance | 200604 | 200 | Refund amount exceeds available balance |
| ErrRefundApplicationCreateFailed | 200605 | 200 | Refund application creation failed |
| ErrRefundApplicationProcessFailed | 200606 | 200 | Refund application processing failed |
| ErrRefundStatusInvalid | 200607 | 200 | Refund status invalid |
| ErrRefundApprovalFailed | 200608 | 200 | Refund approval failed |
| ErrRefundRejectionFailed | 200609 | 200 | Refund rejection failed |
| ErrRefundExecutionFailed | 200610 | 200 | Refund execution failed |
| ErrRefundNotAllowed | 200611 | 200 | Refund not allowed |
| ErrRefundPendingRestriction | 200612 | 400 | Business operation restricted due to pending refund |
| ErrPackageNotFound | 201001 | 200 | Package not found |
| ErrPackageAlreadyExists | 201002 | 200 | Package already exists for student |
| ErrPackageExpired | 201003 | 200 | Package has expired |
| ErrPackagePurchaseFailed | 201004 | 200 | Package purchase failed |
| ErrPackageActivationFailed | 201005 | 200 | Package activation failed |
| ErrBusinessLogic | 201006 | 200 | Business logic validation failed |
| ErrPackageStatusInvalid | 201007 | 200 | Package status is invalid for this operation |
| ErrPackageRefundNotAllowed | 201008 | 200 | Package refund not allowed |
| ErrPackageRefundCurrentMonthExpiry | 201009 | 200 | Package refund not allowed for current month expiry |
| ErrGradeNotFound | 100801 | 200 | Grade not found |
| ErrGradeExists | 100802 | 200 | Grade already exists |
| ErrGradeHasClasses | 100803 | 200 | Grade has classes |
| ErrGradeHasStudents | 100804 | 200 | Grade has students |
| ErrSchoolNotFound | 100851 | 200 | School not found |
| ErrSchoolExists | 100852 | 200 | School already exists |
| ErrSchoolNameExists | 100853 | 200 | School name already exists |
| ErrSchoolHasGrades | 100854 | 200 | School has grades |
| ErrSchoolHasClasses | 100855 | 200 | School has classes |
| ErrSchoolHasStudents | 100856 | 200 | School has students |
| ErrSchoolHasModules | 100857 | 200 | School has modules |
| ErrClassNotFound | 100871 | 200 | Class not found |
| ErrClassExists | 100872 | 200 | Class already exists |
| ErrClassNameExists | 100873 | 200 | Class name already exists |
| ErrClassHasStudents | 100874 | 200 | Class has students |
| ErrClassHasDepartment | 100875 | 200 | Class has a department |
| ErrSchoolSosNotFound | 100881 | 200 | School SOS not found |
| ErrSchoolSosExists | 100882 | 200 | School SOS already exists |
| ErrPhoneNumberExists | 100883 | 200 | Phone number already exists in this school |
| ErrCallTimeNotFound | 100891 | 200 | Call time not found |
| ErrCallTimeExists | 100892 | 200 | Call time already exists |
| ErrSchoolConfigNotFound | 100911 | 200 | School device config not found |
| ErrSchoolConfigExists | 100912 | 200 | School device config already exists |
| ErrDepartmentNotFound | 101201 | 200 | School department not found |
| ErrDepartmentExists | 101202 | 200 | School department already exists |
| ErrDepartmentHasClasses | 101203 | 200 | Department has classes |
| ErrDepartmentHasStudents | 101204 | 200 | Department has students |
| ErrStudentNotFound | 200101 | 200 | Student not found |
| ErrStudentExists | 200102 | 200 | Student already exists |
| ErrStudentDisabled | 200103 | 200 | Student is disabled |
| ErrStudentCodeExists | 200104 | 200 | Student code already exists |
| ErrStudentNotInSchool | 200105 | 200 | Student not in this school |
| ErrStudentAlreadyBound | 200106 | 200 | Student already bound to this parent |
| ErrStudentNotBound | 200107 | 200 | Student not bound to this parent |
| ErrInvalidRelationship | 200108 | 200 | Invalid parent-child relationship |
| ErrParentNotFound | 200109 | 200 | Parent not found |
| ErrParentNotAuthorized | 200110 | 200 | Parent not authorized for this student |
| ErrStudentApplyFailed | 200111 | 200 | Student application failed |
| ErrStudentSearchFailed | 200112 | 200 | Student search failed |
| ErrInvalidSearchType | 200113 | 200 | Invalid search type |
| ErrInvalidSearchValue | 200114 | 200 | Invalid search value |
| ErrSwitchStudentFailed | 200115 | 200 | Switch student failed |
| ErrStudentInUse | 200116 | 200 | Student is in use |
| ErrFamilyContactPhoneDuplicate | 201501 | 200 | Family contact phone number already exists |
| ErrFamilyContactPhoneInvalid | 201502 | 200 | Family contact phone number format is invalid |
| ErrFamilyContactRelationshipInvalid | 201503 | 200 | Family contact relationship type is invalid |
| ErrFamilyContactRelationshipDuplicate | 201504 | 200 | Family contact relationship already exists for this student |
| ErrFamilyContactNicknameInvalid | 201505 | 200 | Family contact nickname is invalid |
| ErrFamilyContactNotBelongToStudent | 201506 | 200 | Family contact does not belong to this student |
| ErrUserNotFound | 100601 | 200 | User not found |
| ErrUserDisabled | 100602 | 200 | User is disabled |
| ErrPasswordIncorrect | 100603 | 200 | Password is incorrect |
| ErrUserExists | 100604 | 200 | User already exists |
| ErrUserPhoneExists | 100605 | 200 | User phone already exists |
| ErrTenantNotFound | 100701 | 200 | Tenant not found |
| ErrTenantDisabled | 100702 | 200 | Tenant is disabled |
| ErrTenantExists | 100703 | 200 | Tenant already exists |
| ErrTenantHasChildren | 100704 | 200 | Tenant has child tenants |
| ErrTenantHasUsers | 100705 | 200 | Tenant has associated users |
| ErrTenantCodeExists | 100706 | 200 | Tenant code already exists |
| ErrCannotDeleteSuperAdminTenant | 100707 | 200 | Cannot delete tenant with super admin accounts |
| ErrCannotDeletePlatformTenant | 100708 | 200 | Cannot delete platform tenant |

