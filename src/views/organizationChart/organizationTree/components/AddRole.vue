<template>
  <div class="add-role">
    <div>
      <div style="width: 100%; margin-bottom: 15px; text-align: left">
        <el-input
          placeholder="请输入关键字"
          style="width: 95%"
          prefix-icon="el-icon-search"
          v-model="input2"
          class="input-with-select"
        >
        </el-input>
      </div>
      <el-tree
        ref="treeRef"
        style="max-width: 600px"
        :data="dataSource"
        show-checkbox
        default-expand-all
        node-key="id"
        highlight-current
        :props="defaultProps"
      />
    </div>
    <div>
      <h1>已选：5个成员</h1>
      <div class="user-box">
        <span>
          <img src="@/assets/images/common/user-circle-1.svg" alt="" style="width: 22px; height: 22px; margin-right: 3px" />
        </span>
        李先生
      </div>
      <div class="user-box">
        <span>
          <img src="@/assets/images/common/user-circle-1.svg" alt="" style="width: 22px; height: 22px; margin-right: 3px" />
        </span>
        李先生
      </div>
      <div class="user-box">
        <span>
          <img src="@/assets/images/common/user-circle-1.svg" alt="" style="width: 22px; height: 22px; margin-right: 3px" />
        </span>
        李先生
      </div>
    </div>
    <div>
      <h1>选择角色</h1>
      <div style="width: 100px; padding-left: 20px; text-align: left">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="超级管理员" value="Value A" />
          <el-checkbox label="管理员" value="Value B" />
          <el-checkbox label="填报员" value="Value C" />
        </el-checkbox-group>
      </div>
    </div>
  </div>
  <div style="margin-top: 20px; text-align: right">
    <el-button class="search-btn" @click="addRole"> 取消 </el-button>
    <el-button type="primary" class="search-btn" @click="addRole"> 确认 </el-button>
  </div>
</template>
<script>
export default {
  emits: ["handleReset"],
  data() {
    return {
      checkList: [],
      input2: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      dataSource: [
        {
          id: 1,
          label: "上海xxx科技有限公司",
          children: [
            {
              id: 4,
              label: "部门",
              children: [
                {
                  id: 9,
                  label: "部门1",
                  type: "department"
                },
                {
                  id: 10,
                  label: "部门2",
                  type: "department"
                },
                {
                  id: 9,
                  label: "部门1",
                  type: "department"
                },
                {
                  id: 10,
                  label: "部门2",
                  type: "department"
                },
                {
                  id: 9,
                  label: "部门1",
                  type: "department"
                },
                {
                  id: 10,
                  label: "部门2",
                  type: "department"
                },
                {
                  id: 9,
                  label: "部门1",
                  type: "department"
                },
                {
                  id: 10,
                  label: "部门2",
                  type: "department"
                },
                {
                  id: 9,
                  label: "部门1",
                  type: "department"
                },
                {
                  id: 10,
                  label: "部门2",
                  type: "department"
                }
              ]
            },
            {
              id: 2,
              label: "子公司",
              children: [
                {
                  id: 5,
                  label: "子公司1",
                  type: "subCompany",
                  children: [
                    {
                      id: 5,
                      label: "部门1-1"
                    },
                    {
                      id: 6,
                      label: "部门1-2"
                    }
                  ]
                },
                {
                  id: 6,
                  label: "子公司2",
                  type: "subCompany"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    addRole() {
      this.$emit("handleReset");
    }
  }
};
</script>
<style lang="scss" scoped>
.add-role {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  border-bottom: 1px solid #dce0e8;
  > div {
    width: 33.3%;
    height: 100%;
    overflow: auto;
    border-right: 1px solid #dce0e8;
    > h1 {
      padding-left: 20px;
      margin: 0;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: normal;
      text-align: left;
    }
    .user-box {
      display: flex;
      align-items: center;
      padding-left: 20px;
      margin-bottom: 10px;
      text-align: left;
      > span {
        box-sizing: border-box;
        width: 30px;
        height: 30px;
        padding: 2px 0 0 4px;
        margin-right: 10px;
        background: #15ddf1;
        border-radius: 50%;
      }
    }
  }
  > div:last-child {
    border-right: none;
  }
}
</style>
