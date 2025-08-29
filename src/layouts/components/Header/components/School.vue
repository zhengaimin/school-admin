<template>
  <div class="message">
    <el-select style="width: 200px" @change="selectSchool" v-model="school" placeholder="请选择学校">
      <el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
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
      handler(newVal) {
        if (newVal) {
          this.fetchTenantList();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchTenantList();
  },
  methods: {
    fetchTenantList() {
      let params = `page=1&pageSize=200`;
      schoolsList(params).then(res => {
        if (res.code == 0 && res.data && res.data.list) {
          this.schoolList = res.data.list;
          // 在第一位添加一个元素
          this.schoolList.unshift({ id: "-1", name: "全部" });
          this.school = this.schoolList[0].id;
          this.userStore.setSchoolMsg({ schoolId: this.school });
        } else {
          this.schoolList = [{ id: "-1", name: "全部学校" }];
          this.userStore.setSchoolMsg({ schoolId: "-1" });
          this.$message.warning("请创建学校");
        }
      });
    },
    selectSchool() {
      this.userStore.setSchoolMsg({ schoolId: this.school });
    }
  }
};
</script>
