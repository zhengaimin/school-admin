<template>
  <div class="enterprise-factor-library">
    <div class="tab-box">
      <div>
        <el-radio-group v-model="radio2" @change="selectCom">
          <el-radio-button label="企业基础因子库" value="1" />
          <el-radio-button label="自定义因子库" value="2" />
        </el-radio-group>
      </div>
      <div>
        <!-- <el-button> 从基础因子库选择 </el-button>
        <el-button type="primary"> 新增 </el-button> -->
      </div>
    </div>
    <div style="height: calc(100% - 40px)">
      <!-- <companyList v-if="radio2 == 1" /> -->
      <userDefined v-if="radio2 == 2" />
    </div>
  </div>
</template>
<script>
import { drag } from "@/utils/drag.js";
// import companyList from "./companyList.vue";
import userDefined from "./userDefined.vue";
export default {
  components: {
    userDefined
  },
  data() {
    return {
      radio2: "1",
      filterText: "",
      dataSource: [
        {
          name: "企业基础因子库",
          id: 1,
          children: [
            {
              name: "化石燃料排放",
              id: 2
            },
            {
              name: "净购入的电力、热力消费的排放",
              id: 4
            }
          ]
        }
      ],
      treeNode: ""
    };
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    }
  },
  mounted() {
    drag();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.includes(value);
    },
    // 树节点点击事件
    handleClickNode(node, data) {
      if (node.level == 1) {
        return;
      }
      this.treeNode = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.enterprise-factor-library {
  height: 100%;
  .tab-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    > div {
      display: flex;
      align-items: center;
    }
  }
}
</style>
