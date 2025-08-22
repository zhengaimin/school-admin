<template>
  <div class="card content-box">
    <component :is="'el-form'" v-bind="options.form" ref="proFormRef" model="model">
      <template v-for="item in options.columns" :key="item.prop">
        <component :is="'el-form-item'" v-bind="item.formItem">
          <component :is="`el-${item.attrs.typeName}`" v-bind="item.attrs" v-model="model[item.formItem.prop]">
            <component
              v-for="(child, i) in item.children"
              :key="i"
              :is="`el-${child.type}`"
              :label="child.label"
              :value="child.value"
            >
            </component>
          </component>
        </component>
      </template>
      <el-form-item>
        <slot name="operation"></slot>
      </el-form-item>
      <el-form-item>
        <!-- <el-button @click="reset">重置</el-button>
        <el-button @click="submit" type="primary">提交</el-button> -->
      </el-form-item>
    </component>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      model: {}
    };
  },
  methods: {
    // submit() {
    //   console.log(this.model);
    // },
    // reset() {
    //   this.$refs.proFormRef.resetFields();
    // }
  }
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
