<template>
  <div class="process-content">
    <div class="left" ref="refLeft">
      <h1>
        <div><img src="@/assets/images/common/bumen.svg" alt="" style="width: 18px; height: 18px; margin-right: 3px" />列表</div>
      </h1>
      <div class="bottom-tree-box">
        <el-input placeholder="请输入关键字" v-model="filterText" class="input-with-select">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-tree
          style="max-width: 600px; margin-top: 15px"
          ref="treeRef"
          :data="dataSource"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :props="{ label: 'name' }"
          draggable
          :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <div class="slot-tree-div">
              <div @click="handleClickNode(node, data)">
                <img src="@/assets/images/common/bumen.svg" alt="" style="width: 16px; height: 16px; margin-right: 3px" />
                {{ node.label }}
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="right" ref="refRight">
      <div class="filter-box">
        <label>能源类型</label>
        <el-select style="width: 200px" v-model="filterForm.type1">
          <el-option label="电" value="all"></el-option>
        </el-select>
        <label>开始时间</label>
        <el-date-picker style="width: 150px" v-model="filterForm.start_time" value-format="x" type="month" />
        <label>结束时间</label>
        <el-date-picker style="width: 150px" v-model="filterForm.end_time" value-format="x" type="month" />
        <el-button style="margin-left: 20px" @click="reset">重置</el-button>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
      <div class="right-content">
        <div class="echart-box">
          <h1>选择数据项</h1>
          <div class="echart-box-bottom">
            <div>
              <div>
                <img src="@/assets/images/common/dian-o.svg" alt="" style="width: 18px; height: 18px" />
                <span> 正向有功电度(kWh) </span>
              </div>
              <el-switch size="small" v-model="switchForm.value1" />
            </div>
            <div>
              <div>
                <img src="@/assets/images/common/dian-o.svg" alt="" style="width: 18px; height: 18px" />
                <span> 正向无功电度(kWh) </span>
              </div>
              <el-switch size="small" v-model="switchForm.value2" />
            </div>
            <div>
              <div>
                <img src="@/assets/images/common/dian-o.svg" alt="" style="width: 18px; height: 18px" />
                <span> 反向有功电度(kWh) </span>
              </div>
              <el-switch size="small" v-model="switchForm.value3" />
            </div>
            <div>
              <div>
                <img src="@/assets/images/common/dian-o.svg" alt="" style="width: 18px; height: 18px" />
                <span> 反向无功电度(kWh) </span>
              </div>
              <el-switch size="small" v-model="switchForm.value4" />
            </div>
            <div>
              <div>
                <img src="@/assets/images/common/dian-o.svg" alt="" style="width: 18px; height: 18px" />
                <span> 正向有功尖电度(kWh) </span>
              </div>
              <el-switch size="small" v-model="switchForm.value4" />
            </div>
            <div>
              <div>
                <img src="@/assets/images/common/dian-o.svg" alt="" style="width: 18px; height: 18px" />
                <span> 正向有功峰电度(kWh) </span>
              </div>
              <el-switch size="small" v-model="switchForm.value4" />
            </div>
            <div>
              <div>
                <img src="@/assets/images/common/dian-o.svg" alt="" style="width: 18px; height: 18px" />
                <span> 正向有功平电度(kWh) </span>
              </div>
              <el-switch size="small" v-model="switchForm.value4" />
            </div>
          </div>
        </div>
        <div class="table-box1">
          <div class="btn-box">
            <span>数据列表</span>
          </div>
          <div class="table-list">
            <el-table class="my-custom-table" :data="equipmentList">
              <el-table-column label="设备名称" prop="equipment_id" align="left"> </el-table-column>
              <el-table-column label="数据项" prop="model_specification" align="left"> </el-table-column>
              <el-table-column label="开始时间示值" prop="path" align="left"> </el-table-column>
              <el-table-column label="结束时间示值" prop="manufacturer" align="left"> </el-table-column>
              <el-table-column label="用量" prop="production_date" align="left"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { drag } from "@/utils/drag.js";
import { production_process_diagram } from "@/api/modules/enterpriseSetup.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterText: "",
      dataSource: [],
      filterForm: {
        type: "all",
        start_time: "all",
        end_time: "all"
      },
      switchForm: {
        value1: true,
        value2: true,
        value3: true,
        value4: true
      },
      calculateList: [{}]
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    token() {
      return useUserStore().token;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    }
  },
  mounted() {
    drag();
  },
  methods: {
    initPage() {
      this.getCompany();
    },
    getCompany() {
      production_process_diagram(`com_id=${this.userInfo.com_id}`).then(res1 => {
        if (res1.code == 0 && res1.data) {
          this.dataSource = res1.data.nodes;
          this.handleClickNode({ level: 1 }, this.dataSource[0]);
        } else {
          this.dataSource = [];
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.includes(value);
    },
    // 树节点点击事件
    handleClickNode(node, data) {
      this.treeNode = data;
      this.ruleForm.process_id = data.id;
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  display: flex;
  align-items: center;
  margin: 0;
  margin-bottom: 20px;
  font-size: 14px;
  > span {
    display: inline-block;
    width: 4px;
    height: 14px;
    margin-right: 8px;
    vertical-align: middle;
    background: #0ec69a;
  }
}
.process-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100%);
  .left {
    width: 300px;
    min-width: 100px;
    height: 100%;
    margin-right: 10px;
    overflow: auto;
    resize: horizontal;
    background: #ffffff;
    border-radius: 10px;
    > h1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 20px;
      margin: 0;
      font-size: 14px;
      font-weight: normal;
      color: #1f304c;
      border-bottom: 1px solid #f4f6fa;
      > div {
        display: flex;
        align-items: center;
      }
    }
    .bottom-tree-box {
      height: calc(100% - 75px);
      padding: 10px 20px;
      overflow: auto;
      .slot-tree-div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        > div {
          display: flex;
          align-items: center;
          width: 85%;
          height: 100%;
          height: 35px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > span {
          font-size: 14px;
        }
      }
      .popover-box {
        > div {
          height: 35px;
          font-size: 14px;
        }
      }
      :deep(.el-tree-node__content) {
        height: 30px !important;
      }
    }
  }
  :deep(.el-popover.el-popper) {
    min-width: 30px !important;
  }
  .right {
    position: relative;
    display: auto;
    flex-grow: 1;
    height: 100%;
    overflow: auto;
    .filter-box {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 20px 0;
      margin-bottom: 10px;
      background: #ffffff;
      border-radius: 10px;
      > label {
        margin: 0 10px 0 20px;
        font-size: 14px;
        color: #4a5975;
      }
    }
    .right-content {
      height: calc(100% - 82px);
      margin-top: 10px;
      overflow: auto;
      .echart-box {
        background: #ffffff;
        border-radius: 10px;
        > h1 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 50px;
          padding: 0 20px;
          margin: 0;
          font-size: 16px;
          font-weight: normal;
          color: #1f304c;
          border-bottom: 1px solid #f4f6fa;
        }
        .echart-box-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-gap: 10px;
          padding: 20px;
          > div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 20px;
            font-size: 14px;
            color: #4c5a76;
            background: #f9fafb;
            border: 1px solid rgb(222 226 235 / 100%);
            border-radius: 10px;
            > div {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              > img {
                margin-right: 10px;
              }
            }
          }
        }
      }
      .table-box1 {
        margin-top: 10px;
        overflow: hidden;
        background: #ffffff;
        border-radius: 10px;
        .btn-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          padding: 0 20px;
          > span {
            font-size: 16px;
          }
        }
      }
    }
  }
}
:deep(.el-table .el-table__header th) {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #8894b3 !important;
  background: #f9fafb !important;
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
