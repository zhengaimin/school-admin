<template>
  <div class="message" style="width: 300px">
    <el-select class="custom-dropdown" placement="right" @change="selectSchool" v-model="school" placeholder="请选择学校">
      <el-option style="text-align: right" v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { schoolsList } from "@/api/modules/InternalPage.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      schoolList: [],
      school: ""
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    count() {
      return useUserStore().count;
    }
  },
  watch: {
    count: {
      handler(newVal, oldVal) {
        console.log(1, newVal, oldVal);
        if (newVal && oldVal) {
          this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchTenantList("load");
  },
  methods: {
    fetchTenantList(val) {
      let params = `page=1&pageSize=200`;
      schoolsList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.schoolList = res.data.list;
          this.schoolList.unshift({ id: "-1", name: "全部学校" });
          if (val == "load") {
            this.school = this.schoolList[1].id;
            this.userStore.setSchoolMsg({ schoolId: this.school, schoolName: this.schoolList[1].name });
          }
        } else {
          this.schoolList = [{ id: "-1", name: "全部学校" }];
          this.userStore.setSchoolMsg({ schoolId: "-1" });
          this.$message.warning("请创建学校");
        }
      });
    },
    selectSchool() {
      let ary = this.schoolList.filter(item => item.id == this.school);
      this.userStore.setSchoolMsg({ schoolId: this.school, schoolName: ary[0].name });
    }
  }
};
</script>
<style scoped lang="scss">
::v-deep(.custom-dropdown .el-select-dropdown__wrap) {
  max-width: 100%; /* 或者具体的一个宽度值 */
}
::v-deep(.el-select__placeholder) {
  font-family: cursive;
  font-size: 20px;
  font-weight: bold;
  color: #627292 !important;
  border: none !important;
}
::v-deep(.el-select__wrapper) {
  text-align: right;
  background: none;
  border: none !important;
  box-shadow: none;
  .el-select__suffix {
    display: none;
  }
}
::v-deep(.el-select__wrapper:hover) {
  text-align: right;
  background: none;
  border: none !important;
  box-shadow: none;
  .el-select__suffix {
    display: none;
  }
}
</style>
