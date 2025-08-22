<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      :label-width="commonConfig.labelWidth + 'px'"
      :label-position="commonConfig.labelPosition"
      :size="commonConfig.size"
    >
      <div
        :class="{
          'item-box': true,
          colOne: commonConfig.col == 1,
          colTwo: commonConfig.col == 2,
          colThree: commonConfig.col == 3,
          colFour: commonConfig.col == 4,
          labelSize12: commonConfig.labelSize == 12,
          labelSize14: commonConfig.labelSize == 14,
          labelSize16: commonConfig.labelSize == 16,
          labelSize18: commonConfig.labelSize == 18,
          labelSize20: commonConfig.labelSize == 20
        }"
      >
        <slot name="first"></slot>
        <div v-for="(item, index) in formList" :key="index">
          <FormItem :config="item" v-model="form[item.model]" />
        </div>
        <slot name="laster"></slot>
      </div>
      <el-form-item>
        <div
          :class="{
            'common-form-btn-left': commonConfig.btnposition == 'left',
            'common-form-btn-center': commonConfig.btnposition == 'center',
            'common-form-btn-right': commonConfig.btnposition == 'right'
          }"
        >
          <el-button v-if="!commonConfig.btn2Isshow || commonConfig.btn1Isshow == 1" @click="handleReset">{{
            commonConfig.btn1Name ? commonConfig.btn1Name : "取消"
          }}</el-button>
          <el-button v-if="!commonConfig.btn2Isshow || commonConfig.btn2Isshow == 1" type="primary" @click="handleSubmit">{{
            commonConfig.btn2Name ? commonConfig.btn2Name : "确认"
          }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import FormItem from "./FormItem.vue";
export default {
  name: "CommonForm",
  components: { FormItem },
  props: {
    formConfig: {
      required: true,
      type: Object
    },
    formItems: {
      required: true,
      type: Object
    },
    commonConfig: {
      required: true,
      type: Object
    }
  },
  emits: ["handleReset", "getFormData"],
  data() {
    return {
      rules: {}
    };
  },
  computed: {
    form() {
      return this.formConfig;
    },
    formList() {
      this.formItems.map(v => {
        v.rules = [{ required: v.required, message: v.message, trigger: "blur" }];
        if (v.options) {
          v.options = eval(v.options);
        }
      });
      return this.formItems;
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields();
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit("getFormData", this.form);
        }
      });
    },
    handleReset() {
      this.resetForm();
      this.$emit("handleReset");
    }
  }
};
</script>
<style lang="scss" scoped>
.item-box {
  display: grid;
  grid-gap: 0 20px;
}
.colOne {
  grid-template-columns: repeat(1, 1fr);
}
.colTwo {
  grid-template-columns: repeat(2, 1fr);
}
.colThree {
  grid-template-columns: repeat(3, 1fr);
}
.colFour {
  grid-template-columns: repeat(4, 1fr);
}
.labelSize12 {
  :deep(.el-form-item__label) {
    font-size: 12px;
  }
}
.labelSize14 {
  :deep(.el-form-item__label) {
    font-size: 14px;
  }
}
.labelSize16 {
  :deep(.el-form-item__label) {
    font-size: 16px;
  }
}
.labelSize18 {
  :deep(.el-form-item__label) {
    font-size: 18px;
  }
}
.labelSize20 {
  :deep(.el-form-item__label) {
    font-size: 20px;
  }
}
.common-form-btn-left {
  display: flex;
  justify-content: flex-startrt;
  width: 100%;
}
.common-form-btn-right {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
.common-form-btn-center {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
