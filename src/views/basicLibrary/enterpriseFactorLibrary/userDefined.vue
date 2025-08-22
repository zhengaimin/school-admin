<template>
  <div class="process-content">
    <div class="right" ref="refRight">
      <div>
        <userFossil />
      </div>
    </div>
  </div>
</template>
<script>
import { drag } from "@/utils/drag.js";
import userFossil from "./userFossil.vue";
export default {
  components: {
    userFossil
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
.process-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100%);
  .right {
    position: relative;
    display: auto;
    flex-grow: 1;
    height: 100%;
    > div {
      position: absolute;
      inset: 0;
    }
  }
}
:deep(.zm-tree-org) {
  background: none;
}
:deep(.tree-org-node__content) {
  padding: 0;
  border-radius: 10px;
}
.tree-org-node__text {
  padding: 0;
  > div {
    box-sizing: border-box;
    width: 190px;
    height: 63px;
    padding: 0 20px 0 60px;
    overflow: hidden;
    line-height: 70px;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: url("@/assets/images/org/cp2.svg") no-repeat center;
    background-size: 100% 100%;
  }
}
</style>
