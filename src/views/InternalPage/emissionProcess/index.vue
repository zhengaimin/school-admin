<template>
  <div class="fossil-fuel">
    <div class="filter-box">
      <label>名称</label>
      <el-input style="width: 250px" v-model="filterForm.name"></el-input>
      <label>排放过程</label>
      <el-select style="width: 250px" v-model="filterForm.emission_process_type">
        <el-option v-for="v in unitList" :label="v.name" :value="Number(v.id)" :key="v.id" />
      </el-select>
      <el-button style="margin-left: 20px" @click="reset">重置</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <span> 排放过程字段列表</span>
        <div>
          <el-button type="primary" class="search-btn" @click="addMethod"> 新增 </el-button>
        </div>
      </div>
      <div class="table-list">
        <el-table style="width: 100%; height: calc(100% - 50px)" class="my-custom-table" :data="tableData">
          <el-table-column label="排序" prop="sort" align="left"> </el-table-column>
          <el-table-column label="名称" prop="name" align="left"> </el-table-column>
          <el-table-column label="KEY" prop="key" align="left"> </el-table-column>
          <el-table-column label="排放过程类型" align="left">
            <template #default="{ row }">
              {{ emissionObj[row.emission_process_type] }}
            </template>
          </el-table-column>
          <el-table-column label="字段类型" align="left">
            <template #default="{ row }">
              {{ ["", "固定字段", "用户输入的字段", "默认值但是可编辑的字段", "特殊处理字段"][row.field_type] }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="130" fixed="right">
            <template #default="scope">
              <div class="table-btn">
                <div @click="editRow(scope.row)">
                  <img src="@/assets/images/common/edit-circle-2.svg" alt="" style="width: 16px; height: 16px" />
                </div>
                <div @click="deleteProcess(scope.row)">
                  <img
                    src="@/assets/images/common/delete-circle-2.svg"
                    alt=""
                    style="width: 16px; height: 16px; margin-right: 3px"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="demo-pagination-block">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="page_size"
          :page-sizes="[10, 20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog v-model="LinkDialog" :close-on-click-modal="false" :title="linkRuleForm.id ? '编辑' : '新增'" :width="700">
      <div style="padding-left: 20px">
        <el-form ref="linkFormRef" :model="linkRuleForm" :rules="linkRules" class="demo-ruleForm" label-position="top">
          <el-row>
            <el-col :span="13">
              <el-form-item label="排放过程字段KEY" prop="key">
                <el-input v-model="linkRuleForm.key" :disabled="linkRuleForm.id == 1"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="排放过程字段名称" prop="name">
                <el-input v-model="linkRuleForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="排序" prop="sort">
                <el-input v-model.number="linkRuleForm.sort"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="排放过程" prop="emission_process_type">
                <el-select v-model="linkRuleForm.emission_process_type">
                  <el-option v-for="v in unitList" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="字段类型" prop="field_type">
                <el-select v-model="linkRuleForm.field_type">
                  <el-option v-for="v in fieldList" :label="v.name" :value="Number(v.id)" :key="v.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="23">
          <el-col :span="23">
            <div style="margin-top: 20px; text-align: right">
              <el-button @click="LinkDialog = false">取消</el-button>
              <el-button type="primary" @click="confirmAdd">确定</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ElMessageBox } from "element-plus";
import {
  emission_process_field_add,
  emission_process_field_list,
  emission_process_field_delete,
  emission_process_field_update
} from "@/api/modules/basicLibrary.js";
export default {
  name: "FossilFuel",
  data() {
    return {
      filterForm: {
        name: "",
        emission_process_type: ""
      },
      total: 0,
      page: 1,
      page_size: 10,
      tableData: [],
      // 新增
      list: [
        { name: "能源", id: 1 },
        { name: "非能源", id: 2 }
      ],
      emissionObj: {
        1: "化石燃料燃烧排放",
        2: "企业净购入的电力隐含的CO2排放 ",
        3: "企业净购入的热力(热水)隐含的CO2排放",
        4: "企业净购入的热力(蒸汽)隐含的CO2排放",
        5: "熟料生产过程产生的碳排放(熟料)",
        6: "熟料生产过程产生的碳排放(非碳酸盐替代原料)",
        6: "光伏发电"
      },
      unitList: [
        { name: "化石燃料燃烧排放", id: 1 },
        { name: "净购入的电力排放", id: 2 },
        { name: "净购入的热力排放(热水)", id: 3 },
        { name: "净购入的热力排放(蒸汽)", id: 4 },
        { name: "熟料生产过程产生的碳排放（熟料）", id: 5 },
        { name: "熟料生产过程产生的碳排放（非碳酸盐替代原料）", id: 6 },
        { name: "光伏发电", id: 7 }
      ],
      fieldList: [
        { name: "固定字段", id: 1 },
        { name: "用户输入的字段", id: 2 },
        { name: "默认值但是可编辑的字段", id: 3 },
        { name: "特殊处理字段", id: 4 }
      ],
      LinkDialog: false,
      linkRuleForm: {
        name: "",
        key: "",
        sort: "",
        emission_process_type: "",
        field_type: ""
      },
      linkRules: {
        name: [{ required: true, message: "必填项" }],
        key: [{ required: true, message: "必填项" }],
        sort: [{ required: true, message: "必填项" }],
        emission_process_type: [{ required: true, message: "必填项" }],
        field_type: [{ required: true, message: "必填项" }]
      }
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.emission_process_field_list();
    },
    search() {
      this.emission_process_field_list();
    },
    reset() {
      this.filterForm.name = "";
      this.filterForm.emission_process_type = "";
      this.emission_process_field_list();
    },
    // 获取列表
    emission_process_field_list() {
      let str = `page=${this.page}&page_size=${this.page_size}&name=${this.filterForm.name}&emission_process_type=${this.filterForm.emission_process_type}`;
      emission_process_field_list(str).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    //获取表单数据
    handleSizeChange(val) {
      this.page = 1;
      this.page_size = val;
      this.emission_process_field_list();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.emission_process_field_list();
    },

    // 新增/编辑
    editRow(row) {
      this.LinkDialog = true;
      this.$nextTick(() => {
        this.linkRuleForm = { ...row };
        this.linkRuleForm.id = 1;
      });
    },
    addMethod() {
      this.LinkDialog = true;
      delete this.linkRuleForm.id;
      this.$nextTick(() => {
        this.$refs.linkFormRef.resetFields();
      });
    },
    confirmAdd() {
      this.$refs.linkFormRef.validate(valid => {
        if (valid) {
          if (this.linkRuleForm.id) {
            emission_process_field_update(this.linkRuleForm).then(res => {
              if (res.code == 0) {
                this.LinkDialog = false;
                this.$message.success("修改成功");
                this.emission_process_field_list();
              }
            });
            return;
          }
          emission_process_field_add(this.linkRuleForm).then(res => {
            if (res.code == 0) {
              this.LinkDialog = false;
              this.$message.success("添加成功");
              this.emission_process_field_list();
            }
          });
        }
      });
    },
    //删除
    deleteProcess(row) {
      ElMessageBox.confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          emission_process_field_delete({ key: row.key }).then(res => {
            if (res && res.code == 0) {
              this.$message.success("删除成功");
              this.emission_process_field_list();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.fossil-fuel {
  position: relative;
  height: 100%;
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
  .table-box {
    height: calc(100% - 85px);
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
    .table-list {
      height: calc(100% - 60px);
      overflow: auto;
      .date-sort {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .super_admin {
        padding: 3px 8px;
        color: #ffffff;
        background: #0ec69a;
        border-radius: 5px;
      }
    }
  }
  .demo-pagination-block {
    position: absolute;
    right: 12px;
    bottom: 10px;
  }
  .bind-box {
    > span {
      margin-right: 15px;
    }
  }
}
</style>
