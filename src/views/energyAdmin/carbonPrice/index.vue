<template>
  <div class="process-content">
    <div class="left" ref="refLeft">
      <h1>
        <div>
          <img src="@/assets/images/common/bumen.svg" alt="" style="width: 18px; height: 18px; margin-right: 3px" />
          用能单元
        </div>
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
      <div>
        <div class="btn-box">
          <div>
            <el-radio-group v-model="radio2" @change="selectCom">
              <el-radio-button label="直接排放" value="1" />
              <el-radio-button label="间接排放" value="2" />
            </el-radio-group>
          </div>
          <div>
            <el-select style="margin-right: 10px" v-model="linkRuleForm.varieties_id" @change="selectSource(2)">
              <el-option label="手动填报" :value="Number(1)" />
              <el-option label="自动填报" :value="Number(2)" />
            </el-select>
            <el-date-picker v-model="year" type="year" placeholder="请选择年份" />
            <el-date-picker v-model="month" type="month" placeholder="请选择月份" />
          </div>
        </div>
        <div class="table-box">
          <div class="btn-box">
            <div>
              <span style="margin-right: 20px">化石燃料燃烧CO₂排放</span>
            </div>
            <div class="tab-box">
              <span class="active">全部</span>
              <span>煤</span>
              <span>天然气</span>
            </div>
          </div>
          <div class="table-list">
            <el-table border class="my-custom-table" :data="equipmentList" :span-method="mergeSameRows">
              <el-table-column fixed="left" label="用能单元/用能设备名称" prop="name" width="180"> </el-table-column>
              <el-table-column fixed="left" label="参数" prop="code" align="center" width="130"> </el-table-column>
              <el-table-column fixed="left" label="单位" prop="auth" align="center" width="90"> </el-table-column>
              <el-table-column label="1月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row[1]" />
                </template>
              </el-table-column>
              <el-table-column label="2月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row.january" />
                </template>
              </el-table-column>
              <el-table-column label="3月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row.january" />
                </template>
              </el-table-column>
              <el-table-column label="4月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row.january" />
                </template>
              </el-table-column>
              <el-table-column label="5月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row.january" />
                </template>
              </el-table-column>
              <el-table-column label="6月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row.january" />
                </template>
              </el-table-column>
              <el-table-column label="7月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row.january" />
                </template>
              </el-table-column>
              <el-table-column label="8月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row.january" />
                </template>
              </el-table-column>
              <el-table-column label="9月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row.january" />
                </template>
              </el-table-column>
              <el-table-column label="10月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row.january" />
                </template>
              </el-table-column>
              <el-table-column label="11月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row.january" />
                </template>
              </el-table-column>
              <el-table-column label="12月" align="center" width="120">
                <template #default="{ row }">
                  <!-- {{ row }} -->
                  <el-input v-model="row.january" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="110" fixed="right">
                <template #default="scope">
                  <div class="table-btn">
                    <div @click="editRow(scope.row, 2)">保存</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table-list">
            <el-table border class="my-custom-table" :data="equipmentList" :span-method="mergeSameRows">
              <el-table-column fixed="left" label="用能单元/用能设备名称" prop="name" width="180"> </el-table-column>
              <el-table-column fixed="left" label="参数" prop="code" align="center" width="130"> </el-table-column>
              <el-table-column fixed="left" label="单位" prop="auth" align="center" width="90"> </el-table-column>
              <el-table-column v-for="v in days" :key="v" :label="v" align="center" width="120">
                <template #default="{ row }">
                  <el-input v-model="row[v]" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="110" fixed="right">
                <template #default="scope">
                  <div class="table-btn">
                    <div @click="editRow(scope.row)">保存</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { drag } from "@/utils/drag.js";
import { getMergeCells } from "@/utils/table.js";
import { organizationInfo } from "@/api/modules/organization.js";
import { production_process_diagram } from "@/api/modules/enterpriseSetup.js";
import { useUserStore } from "@/stores/modules/user";
export default {
  data() {
    return {
      filterText: "",
      dataSource: [],
      tableColumn: [
        { prop: "name", label: "用能单元/用能设备名称" },
        { prop: "code", label: "参数" },
        { prop: "auth", label: "单位" }
      ],
      equipmentList: [
        { name: "搅拌机", code: "消耗量", auth: "t", 1: 100, 2: 120, 3: "", 4: 55 },
        { name: "搅拌机", code: "元素含碳量", auth: "%", 1: 100, 2: 120, 3: "", 4: 55 },
        { name: "搅拌机", code: "发热量", auth: "GJ/t", 1: 120, 2: 120, 3: "", 4: 55 },
        { name: "光刻机", code: "消耗量", auth: "t", 1: 108, 2: 120, 3: "", 4: 55 },
        { name: "光刻机", code: "元素含碳量", auth: "%", 1: 90, 2: 120, 3: "", 4: 55 }
      ],
      treeNode: "",
      radio2: "1",
      year: "",
      month: "",
      LinkDialog: false,
      linkRuleForm: {}
    };
  },
  computed: {
    userInfo() {
      return useUserStore().userInfo;
    },
    token() {
      return useUserStore().token;
    },
    days() {
      const now = new Date();
      // 下个月的第一天，再减去一天就是当前月的最后一天
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1) - 1;
      // 获取当前月最后一天的天数
      return new Date(lastDayOfMonth).getDate();
    },
    spanArr() {
      if (!this.tableColumn.length) return [];
      const mergeCols = ["name"]; // 需要合并的列（字段）
      return getMergeCells(this.equipmentList, this.tableColumn, mergeCols);
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val);
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      drag();
      this.getCompany();
    },
    //获取公司和工序
    getCompany() {
      organizationInfo({ id: this.userInfo.com_id }).then(res => {
        if (res.code == 0 && res.data) {
          this.dataSource[0] = res.data;
          this.handleClickNode({ level: 1 }, this.dataSource[0]);
          production_process_diagram(`com_id=${res.data.id}`).then(res1 => {
            if (res1.code == 0 && res1.data) {
              this.dataSource[0].children = res1.data.nodes;
            } else {
              this.dataSource[0].children = [];
            }
          });
        } else {
          this.dataSource = [];
        }
      });
    },
    selectCom() {
      console.log(2);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.includes(value);
    },
    // 树节点点击事件
    handleClickNode(node, data) {
      console.log(node);
      this.treeNode = data;
    },
    mergeSameRows({ row, column, rowIndex, columnIndex }) {
      console.log(row, columnIndex, column, rowIndex);
      return this.spanArr[rowIndex][columnIndex];
    },
    editRow(row) {
      console.log(row);
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
.sourceSelect {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 28px;
  padding: 0 10px;
  margin-top: 10px;
  line-height: 28px;
  text-align: left;
  background: #d9ecff;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  i {
    font-size: 18px;
    color: #f56c6c;
    cursor: pointer;
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
    margin-right: 20px;
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
    border-radius: 10px;
    > div {
      position: absolute;
      inset: 0;
      .btn-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 56px;
        color: #1f304c;
        border-bottom: 1px solid #ebeef5;
        > span {
          font-size: 16px;
        }
        > div {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
      .table-box {
        height: calc(100% - 57px);
        overflow: auto;
        background: #ffffff;
        .btn-box {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 56px;
          padding: 0 20px;
          > span {
            font-size: 16px;
          }
          .tab-box {
            height: 100%;
            margin-left: 30px;
            > span {
              display: inline-block;
              height: 100%;
              margin-right: 20px;
              font-size: 14px;
              line-height: 57px;
              color: #1f304c;
              cursor: pointer;
            }
            .active {
              color: #0ec69a;
              border-bottom: 2px solid #0ec69a;
            }
          }
        }
        .table-list {
          height: calc(100% - 57px);
        }
      }
      .demo-pagination-block {
        position: absolute;
        right: 12px;
        bottom: 10px;
      }
    }
  }
}
:deep(.el-upload) {
  width: 100%;
}
.upload-box {
  width: 100%;
  padding-top: 10px;
  cursor: pointer;
  background: rgb(249 250 251);
  border: 1px solid rgb(222 226 235);
  border-radius: 5px;
  p {
    padding: 0;
    margin: 0;
    margin-top: -15px;
    color: #999999;
  }
}
.file-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding-right: 10px;
  background: #d9ecff;
  border: 1px solid #cccccc;
  > div {
    display: flex;
    align-items: center;
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
