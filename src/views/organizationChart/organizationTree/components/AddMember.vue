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
export default {
  components: { CommonForm },
  emits: ["getFormData", "handleReset"],
  data() {
    return {
      configObj: {},
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
      extend: ""
    };
  },
  mounted() {
    this.formInfo();
  },
  methods: {
    formInfo() {
      formInfo({ key: "addMember" }).then(res => {
        this.configObj = JSON.parse(res.data);
        this.commonConfig = this.configObj.config ? deepClone(JSON.parse(this.configObj.config).commonConfig) : this.localConfig;
        this.formItems = this.configObj.config ? deepClone(JSON.parse(this.configObj.config).configList) : [];
      });
    },
    //获取表单数据
    getFormData(form) {
      this.$emit("getFormData", form);
    },
    handleReset() {
      this.$emit("handleReset");
    }
  }
};
</script>
