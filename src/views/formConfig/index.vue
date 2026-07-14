<template>
  <div class="table-box">
    <div class="nav-box">
      <span :class="{ active: flag == 1 }" @click="selectNav(1)">表单列表</span>
      <span :class="{ active: flag == 2 }" @click="selectNav(2)">表单配置</span>
      <span :class="{ active: flag == 3 }" @click="selectNav(3)">表单预览</span>
    </div>
    <div class="section">
      <FormList ref="formList" v-if="flag == 1" @to-class="toClass" />
      <!-- <FormClass ref="formClass" v-if="flag == 2" @viewForm="viewForm"/>
      <FormConfig ref="formConfig" v-if="flag == 3" /> -->
    </div>
  </div>
</template>
<script>
import FormList from "./formList/index.vue";
//import FormClass from './FormClass.vue'
//import FormConfig from './FormConfig.vue'
export default {
  components: { FormList },
  data() {
    return {
      flag: 1
    };
  },
  mounted() {
    // this.getUserList();
  },
  methods: {
    selectNav(val) {
      this.flag = val;
    },
    toClass(val) {
      this.flag = val;
    },
    viewForm(val) {
      this.flag = val;
    }
    // 删除用户信息
    // async getUserList() {
    //   let res = await getUserList({});
    //   console.log(res);
    // }
  }
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
