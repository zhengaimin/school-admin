<template>
  <div>
    <CommonForm
      :form-config="form"
      :common-config="commonConfig"
      :form-items="formItems"
      @handle-reset="handleReset"
      @get-form-data="getFormData"
    >
    </CommonForm>
  </div>
</template>
<script>
import { formInfo } from "@/api/modules/formConfig.js";
import CommonForm from "@/components/CommonForm/index.vue";
import { deepClone } from "@/utils/deepClone.js";
import { organizationAdd, organizationUpdate } from "@/api/modules/organization.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  components: { CommonForm },
  emits: ["handleReset"],
  data() {
    return {
      form: {},
      formItems: [],
      commonConfig: {},
      localConfig: {
        labelPosition: "left",
        col: 3,
        labelWidth: 100,
        size: "default",
        labelSize: 14,
        btnposition: "left"
      },
      tenant_list: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      streetList: [],
      parent_id: ""
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    }
  },
  methods: {
    async initPage(id) {
      this.parent_id = id;
      this.formInfo();
    },
    initPageEdit(data) {
      this.formInfo();
      this.$nextTick(() => {
        for (let key in data) {
          this.form[key] = data[key];
        }
        this.form.org_name = data.name;
      });
    },
    formInfo() {
      formInfo({ key: "addDepartment" }).then(res => {
        let configObj = JSON.parse(res.data);
        this.commonConfig = configObj.config ? deepClone(JSON.parse(configObj.config).commonConfig) : this.localConfig;
        this.formItems = configObj.config ? deepClone(JSON.parse(configObj.config).configList) : [];
        this.formItems.forEach(v => {
          if (v.model == "tenant_id") {
            v.options = [];
            this.tenant_list.map(item => {
              v.options.push({ label: item.name, value: item.id });
            });
          }
        });
        //如果不是超级管理员，则不显示合作方
        this.formItems.map((v, i) => {
          if (v.model == "tenant_id" && this.userInfo.role_key != "super_admin") {
            this.formItems.splice(i, 1);
          }
        });
      });
    },
    //获取表单数据
    getFormData(form) {
      const reg = /^1[3-9]\d{9}$/;
      if (!reg.test(form.contact_info) && form.contact_info !== "") {
        this.$message.warning("请输入正确的电话号码");
        return;
      }
      form.sort = Number(form.sort);
      form.org_type = 3;
      form.parent_id = this.parent_id;
      if (this.form.id) {
        delete form.parent_id;
        organizationUpdate(form).then(res => {
          if (res.code == 0) {
            this.$message.success("修改成功");
            this.handleReset();
          }
        });
        return;
      }
      organizationAdd(form).then(res => {
        if (res.code == 0) {
          this.$message.success("新增成功");
          this.handleReset();
        }
      });
    },
    handleReset() {
      this.$emit("handleReset");
    }
  }
};
</script>
